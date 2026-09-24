from fastapi import APIRouter, Depends, HTTPException, Query
from database import get_session
from models import Order, OrderCreate, OrderUpdate, StatusLog, OrderStatus, now
from sqlmodel import Session, select
from datetime import datetime, date


router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=Order)
def create_order(order: OrderCreate, session: Session = Depends(get_session)):
    db_order = Order(**order.model_dump())
    session.add(db_order)
    session.commit()
    session.refresh(db_order)
    return db_order
# usung below fun how u can define  multiparameter filtering 

@router.get("/", response_model=list[Order])
def list_orders(
    status: OrderStatus | None = Query(default=None, description="Filter by order status"),
    created_date: date | None = Query(default=None, description="Filter by creation date (YYYY-MM-DD)"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session)
):
    query = select(Order)

    if status:
        query = query.where(Order.status == status)

    if created_date:
        # .astimezone() reads the naive day boundaries as local time
        start = datetime.combine(created_date, datetime.min.time()).astimezone()
        end = datetime.combine(created_date, datetime.max.time()).astimezone()
        query = query.where(Order.created_at >= start, Order.created_at <= end)

    query = query.order_by(Order.id.desc()).offset(skip).limit(limit)

    return session.exec(query).all()


@router.get("/{order_id}", response_model=Order)
def get_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    return order


@router.patch("/{order_id}", response_model=Order)
def update_order(order_id: int, update: OrderUpdate, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    update_data = update.model_dump(exclude_unset=True)

    # Record every real status change in the status_log table
    new_status = update_data.get("status")
    if new_status and new_status != order.status:
        session.add(StatusLog(
            order_id=order.id,
            old_status=order.status.value,
            new_status=new_status.value,
        ))

    for key, value in update_data.items():
        setattr(order, key, value)
    order.updated_at = now()

    session.add(order)
    session.commit()
    session.refresh(order)
    return order


@router.get("/{order_id}/history", response_model=list[StatusLog])
def order_history(order_id: int, session: Session = Depends(get_session)):
    if not session.get(Order, order_id):
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")
    query = select(StatusLog).where(StatusLog.order_id == order_id).order_by(StatusLog.changed_at)
    return session.exec(query).all()


@router.delete("/{order_id}")
def delete_order(order_id: int, session: Session = Depends(get_session)):
    order = session.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail=f"Order {order_id} not found")

    # Remove the order's status history first (foreign key)
    for log in session.exec(select(StatusLog).where(StatusLog.order_id == order_id)).all():
        session.delete(log)
    session.delete(order)
    session.commit()

    return {"message": f"Order {order_id} deleted"}
