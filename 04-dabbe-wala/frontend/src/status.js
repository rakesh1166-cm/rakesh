// Mirrors OrderStatus in models.py, in delivery order.
export const STATUSES = ['preparing', 'picked_up', 'in_transit', 'delivered']

export const LABEL = {
  preparing: 'Preparing',
  picked_up: 'Picked up',
  in_transit: 'In transit',
  delivered: 'Delivered',
}

export const nextStatus = (s) => STATUSES[STATUSES.indexOf(s) + 1] ?? null

export const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '')
