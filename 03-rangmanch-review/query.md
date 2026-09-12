# 20 Common SQLModel Queries with Equivalent SQL

This guide uses SQLModel inside FastAPI and shows the corresponding SQL for each query.

## Example models

```python
from sqlmodel import SQLModel, Field

class Play(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    category: str

class Review(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    play_id: int = Field(foreign_key="play.id")
    reviewer_name: str
    rating: int
    comment: str | None = None
```

## Required imports

```python
from sqlmodel import Session, select
from sqlalchemy import func, distinct, and_, or_
```

## 1. Select all reviews

```python
query = select(Review)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review;
```

## 2. Select one review by ID

```python
query = select(Review).where(Review.id == 5)
review = session.exec(query).first()
```

```sql
SELECT * FROM review WHERE id = 5 LIMIT 1;
```

For a primary-key lookup, SQLModel also provides:

```python
review = session.get(Review, 5)
```

## 3. Filter by an exact value

```python
query = select(Review).where(Review.reviewer_name == "Ashwani")
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE reviewer_name = 'Ashwani';
```

## 4. Filter with multiple AND conditions

```python
query = select(Review).where(
    Review.rating >= 4,
    Review.reviewer_name == "Ashwani"
)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review
WHERE rating >= 4 AND reviewer_name = 'Ashwani';
```

Explicit form:

```python
query = select(Review).where(
    and_(Review.rating >= 4, Review.reviewer_name == "Ashwani")
)
```

## 5. Filter with OR conditions

```python
query = select(Review).where(
    or_(Review.rating == 4, Review.rating == 5)
)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE rating = 4 OR rating = 5;
```

## 6. Filter using IN

```python
query = select(Review).where(Review.rating.in_([3, 4, 5]))
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE rating IN (3, 4, 5);
```

## 7. Search text using LIKE or ILIKE

```python
query = select(Review).where(Review.comment.like("%excellent%"))
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE comment LIKE '%excellent%';
```

Case-insensitive PostgreSQL search:

```python
query = select(Review).where(Review.comment.ilike("%excellent%"))
```

```sql
SELECT * FROM review WHERE comment ILIKE '%excellent%';
```

## 8. Check NULL and NOT NULL

```python
query = select(Review).where(Review.comment.is_(None))
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE comment IS NULL;
```

```python
query = select(Review).where(Review.comment.is_not(None))
```

```sql
SELECT * FROM review WHERE comment IS NOT NULL;
```

## 9. Filter using BETWEEN

```python
query = select(Review).where(Review.rating.between(3, 5))
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review WHERE rating BETWEEN 3 AND 5;
```

`BETWEEN` includes both boundary values.

## 10. Sort with ORDER BY

```python
query = select(Review).order_by(
    Review.rating.desc(),
    Review.id.asc()
)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review
ORDER BY rating DESC, id ASC;
```

## 11. Pagination with LIMIT and OFFSET

```python
skip = 20
limit = 10

query = select(Review).offset(skip).limit(limit)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review LIMIT 10 OFFSET 20;
```

## 12. Select particular columns

```python
query = select(Review.reviewer_name, Review.rating)
results = session.exec(query).all()

for reviewer_name, rating in results:
    print(reviewer_name, rating)
```

```sql
SELECT reviewer_name, rating FROM review;
```

## 13. Select distinct values

```python
query = select(distinct(Review.rating))
ratings = session.exec(query).all()
```

```sql
SELECT DISTINCT rating FROM review;
```

## 14. Count records

```python
query = select(func.count(Review.id))
total = session.exec(query).one()
```

```sql
SELECT COUNT(id) FROM review;
```

Count only matching records:

```python
query = select(func.count(Review.id)).where(Review.rating >= 4)
total = session.exec(query).one()
```

```sql
SELECT COUNT(id) FROM review WHERE rating >= 4;
```

## 15. AVG, COUNT, SUM, MIN and MAX

```python
query = select(
    func.avg(Review.rating).label("average"),
    func.count(Review.id).label("total"),
    func.sum(Review.rating).label("rating_sum"),
    func.min(Review.rating).label("lowest"),
    func.max(Review.rating).label("highest")
)
result = session.exec(query).one()

print(result.average)
print(result.total)
print(result.rating_sum)
print(result.lowest)
print(result.highest)
```

```sql
SELECT
    AVG(rating) AS average,
    COUNT(id) AS total,
    SUM(rating) AS rating_sum,
    MIN(rating) AS lowest,
    MAX(rating) AS highest
FROM review;
```

## 16. GROUP BY

Count reviews and calculate the average rating for every play:

```python
query = (
    select(
        Review.play_id,
        func.count(Review.id).label("review_count"),
        func.avg(Review.rating).label("average_rating")
    )
    .group_by(Review.play_id)
)
results = session.exec(query).all()
```

```sql
SELECT
    play_id,
    COUNT(id) AS review_count,
    AVG(rating) AS average_rating
FROM review
GROUP BY play_id;
```

## 17. GROUP BY with HAVING

Return only plays having at least five reviews:

```python
query = (
    select(
        Review.play_id,
        func.count(Review.id).label("review_count")
    )
    .group_by(Review.play_id)
    .having(func.count(Review.id) >= 5)
)
results = session.exec(query).all()
```

```sql
SELECT play_id, COUNT(id) AS review_count
FROM review
GROUP BY play_id
HAVING COUNT(id) >= 5;
```

`WHERE` filters rows before grouping; `HAVING` filters groups after grouping.

## 18. INNER JOIN

Return only reviews that have a matching play:

```python
query = (
    select(Review, Play)
    .join(Play, Review.play_id == Play.id)
)
results = session.exec(query).all()

for review, play in results:
    print(review.reviewer_name, play.name)
```

```sql
SELECT review.*, play.*
FROM review
INNER JOIN play ON review.play_id = play.id;
```

Filter joined records:

```python
query = (
    select(Review, Play)
    .join(Play, Review.play_id == Play.id)
    .where(Play.name == "Hamlet")
)
results = session.exec(query).all()
```

```sql
SELECT review.*, play.*
FROM review
INNER JOIN play ON review.play_id = play.id
WHERE play.name = 'Hamlet';
```

## 19. LEFT JOIN

Return every play, including plays with no reviews:

```python
query = (
    select(Play, Review)
    .join(Review, Play.id == Review.play_id, isouter=True)
)
results = session.exec(query).all()

for play, review in results:
    print(play.name, review.rating if review else "No review")
```

```sql
SELECT play.*, review.*
FROM play
LEFT JOIN review ON play.id = review.play_id;
```

Alternative syntax:

```python
query = select(Play, Review).outerjoin(
    Review,
    Play.id == Review.play_id
)
```

## 20. Subquery

Find reviews rated higher than the overall average:

```python
average_subquery = (
    select(func.avg(Review.rating))
    .scalar_subquery()
)

query = select(Review).where(
    Review.rating > average_subquery
)
reviews = session.exec(query).all()
```

```sql
SELECT * FROM review
WHERE rating > (
    SELECT AVG(rating) FROM review
);
```

# Result methods

## `all()`

Returns a list containing all matched rows. It returns an empty list when nothing matches.

```python
reviews = session.exec(query).all()
```

## `first()`

Returns the first matched row or `None`.

```python
review = session.exec(query).first()
```

## `one()`

Requires exactly one result row. It raises an exception if zero or multiple rows are returned. It is commonly used with aggregate queries.

```python
total = session.exec(select(func.count(Review.id))).one()
```

## `one_or_none()`

Returns one row or `None`; it raises an exception if multiple rows exist.

```python
review = session.exec(query).one_or_none()
```

# Complete FastAPI endpoint with LEFT JOIN

```python
from fastapi import APIRouter, Depends, Query
from sqlmodel import Session, select
from sqlalchemy import func

router = APIRouter()

@router.get("/play-summary")
def get_play_summary(
    play_name: str | None = Query(default=None),
    session: Session = Depends(get_session)
):
    query = (
        select(
            Play.id,
            Play.name,
            func.count(Review.id).label("review_count"),
            func.avg(Review.rating).label("average_rating")
        )
        .outerjoin(Review, Play.id == Review.play_id)
        .group_by(Play.id, Play.name)
    )

    if play_name:
        query = query.where(Play.name == play_name)

    results = session.exec(query).all()

    return [
        {
            "play_id": row.id,
            "play_name": row.name,
            "review_count": row.review_count,
            "average_rating": (
                float(row.average_rating)
                if row.average_rating is not None
                else None
            )
        }
        for row in results
    ]
```

Equivalent SQL:

```sql
SELECT
    play.id,
    play.name,
    COUNT(review.id) AS review_count,
    AVG(review.rating) AS average_rating
FROM play
LEFT JOIN review ON play.id = review.play_id
WHERE play.name = 'Hamlet'
GROUP BY play.id, play.name;
```

> Note: SQL generated by SQLAlchemy/SQLModel can vary slightly depending on PostgreSQL, MySQL, MariaDB, or SQLite, but the query logic remains the same.
