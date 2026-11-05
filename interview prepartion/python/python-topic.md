# Python Interview Q&A

## Topics
- [Basics and Data Types](#basics-and-data-types)
- [Data Structures and Comprehensions](#data-structures-and-comprehensions)
- [OOP](#oop)
- [Functions, Decorators and Generators](#functions-decorators-and-generators)
- [Exceptions and Context Managers](#exceptions-and-context-managers)
- [Memory Management and GIL](#memory-management-and-gil)
- [Concurrency (Threading, Multiprocessing, Asyncio)](#concurrency-threading-multiprocessing-asyncio)
- [Coding Problems](#coding-problems)

---

## Basics and Data Types

### Q: What are Python's key features, and why is it popular for ML?
**Difficulty:** 🟢

**Answer:** Python is a high-level, dynamically typed, general-purpose language known for readable syntax, fast development, and a large ecosystem. It's popular for machine learning because it makes data preparation, experimentation, model training, and deployment convenient.

| Key feature | Why it helps |
|---|---|
| Readable, concise syntax | Code is easier to write, understand, and maintain |
| Dynamic typing | Quick experimentation without explicit type declarations |
| Automatic memory management | Less manual memory-management work |
| Multiple programming styles | Supports procedural, object-oriented, and functional approaches |
| Cross-platform support | Runs on Windows, Linux, and macOS |
| Large ecosystem and community | Reusable libraries, documentation, and learning resources |
| Integration with native code | Python can call optimized C, C++, and GPU implementations |

**Why it's popular for ML:**
- **NumPy and pandas:** numerical computing and data preparation
- **Matplotlib:** data visualization
- **scikit-learn:** classical machine learning
- **PyTorch and TensorFlow:** deep learning
- **Jupyter notebooks:** interactive experiments and explanations
- **FastAPI:** serving trained models through APIs

Python itself can be slow for CPU-heavy loops. Many ML libraries get their speed by running the expensive operations in optimized native code or on GPUs.

**Interview-ready answer to practice:**
> Python is popular because its readable syntax, dynamic typing, automatic memory management, and large ecosystem make development fast. For ML, it covers the whole workflow, from data preparation with NumPy and pandas, to training with scikit-learn or PyTorch, to deployment through APIs. Python loops can be slow, but ML libraries run most of their computation in optimized native code or on GPUs.

**What the interviewer expects:**
- Name the main language features.
- Connect those features to ML development.
- Give relevant library examples.
- Explain that Python's popularity doesn't mean Python itself runs every computation fast.
- Mention a practical trade-off, such as runtime type errors or slow CPU-heavy Python loops.

---

### Q: How does dynamic typing work in Python?
**Difficulty:** 🟢

**Answer:** Python is dynamically typed. Objects have types, and a variable name can refer to objects of different types while the program runs. You don't declare a variable's type before using it.

```python
value = 10         # Refers to an int
value = "Python"   # Now refers to a str
```

Python checks whether an operation is valid at runtime:

```python
age = 25
print(age + 5)     # 30
print(age + "5")   # TypeError
```

Python is also **strongly typed**. It doesn't automatically convert between incompatible types for every operation.

Type hints describe the expected types, but Python generally doesn't enforce them at runtime:

```python
def double(number: int) -> int:
    return number * 2

double("Hi")  # Returns "HiHi"; annotations alone do not reject it
```

**What the interviewer expects:**
- Types belong to objects, not permanently to variable names.
- A name can refer to different types over time.
- Invalid operations raise errors at runtime.
- Dynamic typing is different from weak typing.
- Type hints are not automatic runtime validation.

---

### Q: What is the difference between mutable and immutable objects?
**Difficulty:** 🟢

**Answer:** Mutable objects can be changed in place after they're created. Immutable objects can't. Reassigning a variable is different from changing the object it refers to.

| Mutable objects | Immutable objects |
|---|---|
| `list`, `dict`, `set`, `bytearray` | `int`, `float`, `bool`, `str`, `tuple`, `frozenset` |

**Mutable example:** two names can refer to the same list, so a change to that list shows up through both names.

```python
first = [10, 20]
second = first
second.append(30)
print(first)            # [10, 20, 30]
print(first is second)  # True
```

**Immutable example:** changing an integer's value means the name now refers to a different integer object.

```python
first = 10
second = first
second += 5
print(first)   # 10
print(second)  # 15
```

A tuple can contain a mutable object:

```python
record = ([1, 2], "active")
record[0].append(3)   # Allowed: changes the contained list
print(record)         # ([1, 2, 3], 'active')
# record[0] = []      # TypeError: cannot replace a tuple element
```

**What the interviewer expects:**
- Understand in-place modification versus reassignment.
- Explain shared references and how function arguments behave.
- Know that tuple immutability doesn't make the tuple's contents deeply immutable.
- Know that dictionary keys must be hashable, and that a tuple containing a list is not hashable.

**Follow-ups:** Mutable default arguments.

```python
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items
```

With `items=[]` in the function definition, the same default list would be reused across calls.

---

### Q: What is the difference between list, tuple, set, and dict? When do you use each?
**Difficulty:** 🟢

**Answer:**

| Collection | Main characteristics | Example | When to use |
|---|---|---|---|
| `list` | Ordered, mutable, allows duplicates | `[10, 20, 10]` | A sequence that needs updates |
| `tuple` | Ordered, immutable sequence, allows duplicates | `(10, 20)` | A fixed collection or record |
| `set` | Unique hashable elements, no guaranteed positional order | `{10, 20}` | Deduplication and membership checks |
| `dict` | Key-value mapping, mutable, preserves insertion order | `{"name": "Ashwani"}` | Looking up values by key |

**Example:**

```python
# List: maintain and update a sequence
scores = [85, 90, 85]
scores.append(95)

# Tuple: represent a fixed pair
coordinates = (28.61, 77.21)

# Set: keep unique values
unique_categories = {"ML", "NLP", "ML"}
print(unique_categories)  # Contains only "ML" and "NLP"

# Dictionary: associate names with values
model_config = {
    "learning_rate": 0.01,
    "epochs": 20,
}
```

Important syntax:

```python
empty_dict = {}
empty_set = set()   # {} creates a dict, not a set
```

**What the interviewer expects:**
- Compare order, mutability, duplicates, and access patterns.
- Explain that sets need hashable elements and dictionaries need hashable keys.
- Know that list membership is typically O(n), while set and dictionary membership is O(1) on average.
- Choose a collection based on the operations you need, not just its syntax.

---

### Q: What is the difference between `is` and `==`?
**Difficulty:** 🟢

**Answer:** `==` compares **equality** (values). `is` compares **identity** (whether two names refer to the same object).

```python
first = [1, 2]
second = [1, 2]
third = first

print(first == second)  # True: equal contents
print(first is second)  # False: different objects
print(first is third)   # True: same object
```

Use `is` to check for singleton objects such as `None`:

```python
result = None
if result is None:
    print("No result")
```

Use `==` to compare ordinary values:

```python
status = "ready"
if status == "ready":
    print("Start processing")
```

**What the interviewer expects:**
- Explain identity versus equality clearly.
- Use `is None` to check for `None`.
- Avoid `is` for comparing string or numeric values.
- Know that object caching or string interning can make a wrong `is` comparison seem to work.

---

### Q: What is variable scope? Explain the LEGB rule.
**Difficulty:** 🟡

**Answer:** Scope determines where a name can be accessed. For ordinary name lookup inside functions, Python searches in the **LEGB** order:

| Letter | Scope | Meaning |
|---|---|---|
| L | Local | Names inside the current function |
| E | Enclosing | Names in surrounding function scopes |
| G | Global | Names in the current module |
| B | Built-in | Names such as `len`, `print`, and `sum` |

```python
course = "Global"

def outer():
    course = "Enclosing"

    def inner():
        course = "Local"
        print(course)

    inner()

outer()  # Local
```

If you remove the local assignment, lookup finds `"Enclosing"`. If you also remove the enclosing assignment, it finds `"Global"`.

**`global` and `nonlocal`:**

Use `global` to rebind a module-level name:

```python
count = 0

def increment():
    global count
    count += 1
```

Use `nonlocal` to rebind a name in an enclosing function scope:

```python
def outer():
    count = 0

    def increment():
        nonlocal count
        count += 1

    increment()
    return count

print(outer())  # 1
```

**What the interviewer expects:**
- Explain all four levels in the correct order.
- Distinguish `global` from `nonlocal`.
- Understand that assigning to a name inside a function normally makes that name local.
- Explain this common error:

```python
count = 10

def update():
    print(count)  # UnboundLocalError
    count = 20    # Makes count local throughout this function
```

---

### Q: What is the difference between `None`, `False`, `0`, and an empty container?
**Difficulty:** 🟢

**Answer:** These values have different types and meanings, but all of them evaluate as false in a Boolean condition.

| Value | Type | Typical meaning |
|---|---|---|
| `None` | `NoneType` | No value, missing value, or no result |
| `False` | `bool` | A negative logical result |
| `0` | `int` | A valid numeric value of zero |
| `[]`, `{}`, `set()`, `()` | Collection types | A collection containing no elements |
| `""` | `str` | An empty string |

```python
values = [None, False, 0, [], {}, set(), (), ""]
for value in values:
    print(repr(value), bool(value))
# Every Boolean conversion above is False
```

**Why the distinction matters:** a valid zero shouldn't accidentally be treated as missing.

```python
score = 0
if not score:
    print("Missing score")  # Wrong: treats a valid zero as missing
```

Check specifically for `None`:

```python
score = 0
if score is None:
    print("Missing score")
else:
    print(f"Score: {score}")  # Score: 0
```

Similarly, an empty list might mean "the search finished but found nothing," while `None` might mean "no result was provided." Your application defines these meanings.

**What the interviewer expects:**
- Distinguish meaning, type, and truth value.
- Use `is None` when you specifically want to check for absence.
- Use `if not items` when you intentionally check for an empty collection.
- Know that `False == 0` is `True` because `bool` is a subclass of `int`, but `False is 0` is not a valid way to compare values.
- Don't assume every falsy value means "missing."

> **Useful rule:** Use a specific check when the distinction matters. Use a truthiness check when all falsy values should be handled the same way.

---

## Data Structures and Comprehensions

### Q: What is the difference between `append()` and `extend()`?
**Difficulty:** 🟢

**Answer:** `append()` adds its argument as **one element** at the end of a list. `extend()` iterates over its argument and adds **each element separately**.

```python
numbers = [1, 2]
numbers.append([3, 4])
print(numbers)  # [1, 2, [3, 4]]
```

```python
numbers = [1, 2]
numbers.extend([3, 4])
print(numbers)  # [1, 2, 3, 4]
```

A string is also an iterable:

```python
letters = ["a"]
letters.extend("bc")
print(letters)  # ['a', 'b', 'c']
```

| Operation | Effect |
|---|---|
| `items.append(value)` | Adds `value` as one element |
| `items.extend(iterable)` | Adds each element from the iterable |

**Common mistake:** both methods modify the list in place and return `None`.

```python
numbers = [1, 2]
result = numbers.append(3)
print(result)   # None
print(numbers)  # [1, 2, 3]
```

**What the interviewer expects:**
- Explain adding one object versus adding the elements of an iterable.
- Show what happens when you add a list to another list.
- Know that both modify the original list and return `None`.

---

### Q: How do you remove duplicates from a list while preserving order?
**Difficulty:** 🟡

**Answer:** For **hashable elements**, use `dict.fromkeys()`. Dictionaries preserve insertion order and store each key only once.

```python
numbers = [3, 1, 3, 2, 1, 4]
unique_numbers = list(dict.fromkeys(numbers))
print(unique_numbers)  # [3, 1, 2, 4]
```

A more explicit approach uses a set to track the values already seen:

```python
numbers = [3, 1, 3, 2, 1, 4]
seen = set()
unique_numbers = []

for number in numbers:
    if number not in seen:
        seen.add(number)
        unique_numbers.append(number)

print(unique_numbers)  # [3, 1, 2, 4]
```

Both approaches take **O(n) expected time** for ordinary hashable values.

For **unhashable elements**, such as lists, use equality checks:

```python
rows = [[1, 2], [3, 4], [1, 2]]
unique_rows = []

for row in rows:
    if row not in unique_rows:
        unique_rows.append(row)

print(unique_rows)  # [[1, 2], [3, 4]]
```

This last approach can need **O(n²) equality comparisons**.

**What the interviewer expects:**
- Keep each value at the position where it first appears.
- Explain why `list(set(items))` doesn't guarantee that order.
- Recognize that dictionary keys and set elements must be hashable.

---

### Q: How does list slicing work, including negative indices?
**Difficulty:** 🟢

**Answer:** List slicing extracts selected elements from a list using:

```python
my_list[start:stop:step]
```

**1. The three parts**

| Part | Meaning | Default |
|---|---|---|
| `start` | Index where slicing begins; **included** | Beginning (for a positive step) |
| `stop` | Boundary where slicing ends; **excluded** | End (for a positive step) |
| `step` | Index increment and direction; can't be zero | `1` |

**2. `start`: where to begin**

```python
numbers = [10, 20, 30, 40, 50, 60]
print(numbers[2:])  # [30, 40, 50, 60]
```

Start at index 2, include its element, and continue to the end.

**3. `stop`: where to finish**

```python
print(numbers[:4])  # [10, 20, 30, 40]
```

Stop before index 4, so `50` is excluded.

Combine `start` and `stop`:

```python
print(numbers[1:4])  # [20, 30, 40]
```

Selected indices: 1, 2, 3.

**4. `step`: how far to move each time**

```python
print(numbers[0:6:2])  # [10, 30, 50]   indices 0, 2, 4
print(numbers[1:6:2])  # [20, 40, 60]   indices 1, 3, 5
```

| Slice | Start | Stop (excluded) | Step | Result |
|---|---|---|---|---|
| `[1:5:1]` | 1 | 5 | 1 | `[20, 30, 40, 50]` |
| `[1:5:2]` | 1 | 5 | 2 | `[20, 40]` |
| `[::3]` | Beginning | End | 3 | `[10, 40]` |

The step is the index increment. A step of 2 selects an element, skips one, then selects the next.

**5. Slicing with negative indices**

Negative indices choose positions relative to the end (`-1` is the last element). They do **not** reverse the direction.

```python
print(numbers[-3:])    # [40, 50, 60]      the last three elements
print(numbers[:-2])    # [10, 20, 30, 40]  everything except the last two
print(numbers[-4:-1])  # [30, 40, 50]
```

For `[-4:-1]`, start at `30` and stop before `60`.

**6. A negative step moves backward**

```python
print(numbers[::-1])  # [60, 50, 40, 30, 20, 10]
```

With a negative step, omitted boundaries default to starting at the end and continuing backward through the beginning.

```python
print(numbers[5:1:-1])    # [60, 50, 40, 30]   indices 5, 4, 3, 2 (index 1 excluded)
print(numbers[-1:-5:-2])  # [60, 40]           positions -1, -3 (stop before -5)
```

**7. Important distinction:** slices tolerate out-of-range boundaries, but indexing a single element doesn't.

```python
print(numbers[:100])   # [10, 20, 30, 40, 50, 60]
# print(numbers[100])  # IndexError
```

**What the interviewer expects:**
- Explain `start`, `stop`, and `step`.
- Know that the stop index is excluded.
- Explain negative indices and reverse slicing.
- Know that list slicing creates a new, shallow list.

---

### Q: What is the difference between `sorted()` and `.sort()`?
**Difficulty:** 🟢

**Answer:** `sorted()` accepts any iterable and returns a **new sorted list**. `list.sort()` sorts an existing list **in place** and returns `None`.

```python
numbers = [3, 1, 2]
ordered = sorted(numbers)
print(ordered)  # [1, 2, 3]
print(numbers)  # [3, 1, 2]
```

```python
numbers = [3, 1, 2]
result = numbers.sort()
print(numbers)  # [1, 2, 3]
print(result)   # None
```

| Feature | `sorted()` | `.sort()` |
|---|---|---|
| Accepted input | Any iterable of sortable elements | A list |
| Modifies the original | No | Yes |
| Return value | New list | `None` |
| Supports `key` and `reverse` | Yes | Yes |

**Practical ML example:** rank models by accuracy.

```python
models = [
    {"name": "Logistic Regression", "accuracy": 0.88},
    {"name": "Random Forest", "accuracy": 0.93},
    {"name": "Decision Tree", "accuracy": 0.85},
]

ranked_models = sorted(
    models,
    key=lambda model: model["accuracy"],
    reverse=True,
)

print([model["name"] for model in ranked_models])
# ['Random Forest', 'Logistic Regression', 'Decision Tree']
```

Both sorts are **stable**: items with equal keys keep their original relative order.

**What the interviewer expects:**
- Distinguish creating a new list from modifying an existing one.
- Know what each one returns.
- Understand `key`, `reverse`, and stable sorting.

---

### Q: How does a dictionary work internally?
**Difficulty:** 🟡

**Answer:** Python dictionaries use a **hash table** to map keys to values. Conceptually, when you insert or look up a key:

1. Python calculates the key's hash.
2. It uses that hash to find a candidate slot in the table.
3. It checks whether the key stored there is equal to the key you gave.
4. If different keys collide, it follows a collision-resolution process (probing) to find the correct entry.

Lookup, insertion, and deletion are **O(1) on average** but **O(n) in the worst case**.

```python
model_scores = {
    "logistic_regression": 0.88,
    "random_forest": 0.93,
}
print(model_scores["random_forest"])  # 0.93
```

Keys must be hashable:

```python
coordinates = {
    (10, 20): "Location A",  # Tuple of integers: hashable
}
print(coordinates[(10, 20)])  # Location A

# invalid = {[10, 20]: "Location A"}
# TypeError: unhashable type: 'list'
```

A key's hash must stay the same for its whole lifetime, and equal keys must have equal hashes.

Dictionaries preserve **insertion order**, which is not the same as sorted order:

```python
scores = {"z": 90, "a": 80, "m": 85}
print(list(scores))  # ['z', 'a', 'm']
```

**Common misconception:** two keys with the same hash aren't necessarily the same key. Python also checks equality.

**What the interviewer expects:**
- Explain hash tables, hashing, and collisions.
- Know why keys must be hashable.
- Explain the average lookup complexity.
- Distinguish insertion order from sorted order.

---

### Q: What are dictionary comprehensions? Give a practical ML example.
**Difficulty:** 🟢

**Answer:** A dictionary comprehension builds a dictionary from an expression and a loop, with an optional condition.

```python
{key_expression: value_expression for item in iterable if condition}
```

**Basic example:**

```python
squares = {number: number ** 2 for number in range(1, 5)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16}
```

**Practical ML example (label encoding):** convert class names into integer IDs.

```python
labels = ["cat", "dog", "cat", "bird"]
unique_labels = sorted(set(labels))

label_to_id = {
    label: index
    for index, label in enumerate(unique_labels)
}
encoded_labels = [label_to_id[label] for label in labels]

print(label_to_id)     # {'bird': 0, 'cat': 1, 'dog': 2}
print(encoded_labels)  # [1, 2, 1, 0]
```

In a real ML workflow, build the mapping from the **training labels** and reuse it for validation, testing, and inference. Also decide how to handle labels that weren't seen during training.

**Filtering example:**

```python
model_scores = {
    "logistic_regression": 0.88,
    "random_forest": 0.93,
    "decision_tree": 0.85,
}

selected_models = {
    name: score
    for name, score in model_scores.items()
    if score >= 0.90
}

print(selected_models)  # {'random_forest': 0.93}
```

**What the interviewer expects:**
- Understand the comprehension syntax.
- Build a dictionary from an iterable.
- Use an optional condition to filter entries.
- Apply it to a practical data or ML task.

---

### Q: How do `enumerate()` and `zip()` work?
**Difficulty:** 🟢

**Answer:** `enumerate()` gives you a counter together with each value from an iterable.

```python
features = ["age", "income", "experience"]

for index, feature in enumerate(features):
    print(index, feature)
# 0 age
# 1 income
# 2 experience
```

You can change the starting number:

```python
for position, feature in enumerate(features, start=1):
    print(position, feature)
# 1 age
# 2 income
# 3 experience
```

`zip()` combines the elements of several iterables into tuples.

```python
features = ["age", "income", "experience"]
importance = [0.2, 0.5, 0.3]

for feature, score in zip(features, importance):
    print(feature, score)
# age 0.2
# income 0.5
# experience 0.3
```

You can turn the pairs into a dictionary:

```python
feature_importance = dict(zip(features, importance))
print(feature_importance)
# {'age': 0.2, 'income': 0.5, 'experience': 0.3}
```

By default, `zip()` stops at the **shortest iterable**:

```python
print(list(zip(["a", "b", "c"], [1, 2])))
# [('a', 1), ('b', 2)]
```

Use `strict=True` (Python 3.10+) when mismatched lengths should raise an error:

```python
# Raises ValueError when consumed:
# list(zip(["a", "b", "c"], [1, 2], strict=True))
```

**What the interviewer expects:**
- Use `enumerate()` to get an index and a value.
- Use `zip()` to combine corresponding elements.
- Know that both return iterators.
- Understand what happens when the inputs have different lengths.

---

### Q: What is the difference between `*args` and `**kwargs`?
**Difficulty:** 🟢

**Answer:** In a function definition:
- `*args` collects extra **positional arguments** into a tuple.
- `**kwargs` collects extra **keyword arguments** into a dictionary.

```python
def show_arguments(*args, **kwargs):
    print(args)
    print(kwargs)

show_arguments(10, 20, model="Random Forest", epochs=5)
# (10, 20)
# {'model': 'Random Forest', 'epochs': 5}
```

**Practical ML example:**

```python
def describe_training(model_name, *features, **parameters):
    print("Model:", model_name)
    print("Features:", features)
    print("Parameters:", parameters)

describe_training(
    "Random Forest",
    "age",
    "income",
    n_estimators=100,
    max_depth=5,
)
# Model: Random Forest
# Features: ('age', 'income')
# Parameters: {'n_estimators': 100, 'max_depth': 5}
```

In a function **call**, `*` and `**` **unpack** existing collections:

```python
def train_model(learning_rate, epochs):
    print(learning_rate, epochs)

settings = {"learning_rate": 0.01, "epochs": 20}
train_model(**settings)  # 0.01 20

values = [0.02, 10]
train_model(*values)     # 0.02 10
```

The stars control the behavior, and the names can be anything:

```python
def example(*values, **options):
    pass
```

**What the interviewer expects:**
- Distinguish positional arguments from keyword arguments.
- Know that `args` becomes a tuple and `kwargs` becomes a dictionary.
- Explain collecting arguments versus unpacking them.
- Know that the names `args` and `kwargs` are only conventions.

---

### Q: How do you merge two dictionaries in Python?
**Difficulty:** 🟢

**Answer:** Use `|` (Python 3.9+) to create a new merged dictionary. When keys overlap, the **right-hand dictionary wins**.

```python
defaults = {
    "learning_rate": 0.01,
    "epochs": 10,
}
overrides = {
    "epochs": 30,
    "batch_size": 32,
}

config = defaults | overrides
print(config)    # {'learning_rate': 0.01, 'epochs': 30, 'batch_size': 32}
print(defaults)  # {'learning_rate': 0.01, 'epochs': 10}
```

Dictionary unpacking also creates a new dictionary:

```python
config = {**defaults, **overrides}
```

Use `update()` or `|=` to modify an existing dictionary:

```python
defaults.update(overrides)
# Alternatively:
# defaults |= overrides
```

| Method | Creates a new dictionary? |
|---|---|
| `first \| second` | Yes |
| `{**first, **second}` | Yes |
| `first.update(second)` | No |
| `first \|= second` | No |

**Important:** merging doesn't recursively combine nested dictionaries.

```python
first = {"model": {"depth": 5, "trees": 100}}
second = {"model": {"depth": 10}}

merged = first | second
print(merged)  # {'model': {'depth': 10}}
```

The whole value for `"model"` is replaced.

**What the interviewer expects:**
- Show several ways to merge dictionaries.
- Explain which value wins when keys overlap.
- Distinguish creating a new dictionary from updating an existing one.
- Know that ordinary merging is shallow.

---

### Q: How do you handle missing keys in a dictionary safely?
**Difficulty:** 🟡

**Answer:** Choose the approach based on what a missing key means in your application.

| Approach | Use it to |
|---|---|
| `get()` | Read an optional value with a default |
| `key in dictionary` | Check whether a key exists |
| `try/except KeyError` | Handle a missing required value |
| `setdefault()` | Insert a default if the key is missing |
| `defaultdict` | Create defaults automatically when indexing |

**Using `get()`:**

```python
config = {"epochs": 20}
batch_size = config.get("batch_size", 32)
print(batch_size)  # 32
print(config)      # {'epochs': 20}
```

`get()` doesn't insert the default into the dictionary.

**Checking membership:**

```python
record = {"score": None}
if "score" in record:
    print("The key exists, even though its value is None.")
```

**Handling a required key:**

```python
config = {"epochs": 20}
try:
    learning_rate = config["learning_rate"]
except KeyError:
    print("Required setting 'learning_rate' is missing.")
```

**Using `setdefault()` to group records:**

```python
groups = {}
groups.setdefault("cat", []).append("image_1.jpg")
groups.setdefault("cat", []).append("image_2.jpg")
print(groups)  # {'cat': ['image_1.jpg', 'image_2.jpg']}
```

**Using `defaultdict` to count labels:**

```python
from collections import defaultdict

counts = defaultdict(int)
for label in ["cat", "dog", "cat"]:
    counts[label] += 1

print(dict(counts))  # {'cat': 2, 'dog': 1}
```

**Common mistake:** assuming `get()` replaces an existing `None`.

```python
config = {"batch_size": None}
print(config.get("batch_size", 32))  # None
```

The default is used only when the key is **missing**.

**What the interviewer expects:**
- Know when direct indexing raises `KeyError`.
- Choose between `get()`, membership checks, and `try/except`.
- Explain when `setdefault()` and `defaultdict` are useful.
- Distinguish a missing key from a key whose value is `None`.

---

## OOP

### Q: What is `__init__` in a Python class?
**Difficulty:** 🟢

**Answer:** `__init__` initializes an instance after it has been created. Python calls it automatically when you instantiate a class. `self` refers to the instance being initialized.

```python
class Model:
    def __init__(self, name, learning_rate=0.01):
        self.name = name
        self.learning_rate = learning_rate
        self.metrics = {}


first = Model("Random Forest")
second = Model("Neural Network", learning_rate=0.001)

first.metrics["accuracy"] = 0.93

print(first.name)             # Random Forest
print(second.learning_rate)   # 0.001
print(second.metrics)         # {}
```

Each instance gets its own `metrics` dictionary because the dictionary is created inside `__init__`.

| Method | Role |
|---|---|
| `__new__` | Creates and returns an instance |
| `__init__` | Initializes an instance that already exists |

Normally `__new__` creates the instance and then `__init__` initializes it. If `__new__` returns an object that isn't an instance of the requested class, that class's `__init__` isn't called.

**Common mistake:** returning a value from `__init__`.

```python
class Invalid:
    def __init__(self):
        return 10


# Invalid()
# TypeError: __init__() should return None, not 'int'
```

**What the interviewer expects:**
- Explain instance initialization and the role of `self`.
- Distinguish initialization (`__init__`) from instance creation (`__new__`).
- Know that `__init__` must return `None`.
- Initialize attributes separately for each instance.

---

### Q: What is the difference between instance, class, and static methods?
**Difficulty:** 🟡

**Answer:**

| Method type | Implicit first argument | Typical purpose |
|---|---|---|
| Instance method | `self`: the instance | Read or modify instance state |
| Class method | `cls`: the class it's called on | Alternative constructors and class-level behavior |
| Static method | None | A related utility that needs neither the instance nor the class |

```python
class ModelConfig:
    def __init__(self, learning_rate):
        self.learning_rate = learning_rate

    def describe(self):
        return f"Learning rate: {self.learning_rate}"

    @classmethod
    def from_dict(cls, settings):
        return cls(settings["learning_rate"])

    @staticmethod
    def is_valid_rate(value):
        return 0 < value <= 1


config = ModelConfig.from_dict({"learning_rate": 0.01})

print(config.describe())                # Learning rate: 0.01
print(ModelConfig.is_valid_rate(0.01))  # True
print(ModelConfig.is_valid_rate(-0.5))  # False
```

`from_dict()` uses `cls(...)` instead of hardcoding `ModelConfig(...)`, so subclasses inherit a working alternative constructor:

```python
class AdvancedConfig(ModelConfig):
    pass


advanced = AdvancedConfig.from_dict({"learning_rate": 0.02})
print(type(advanced).__name__)  # AdvancedConfig
```

A static method can still use objects you pass in explicitly. It just doesn't receive `self` or `cls` automatically.

**What the interviewer expects:**
- Explain `self`, `cls`, and methods with no implicit first argument.
- Use `@classmethod` and `@staticmethod` correctly.
- Use instance methods for instance behavior and class methods for alternative constructors.
- Understand how class methods support subclasses.

---

### Q: Explain inheritance, method overriding, and `super()`.
**Difficulty:** 🟡

**Answer:**
- **Inheritance** lets a subclass reuse behavior from a base class.
- **Method overriding** means a subclass defines a method with the same name as an inherited one.
- **`super()`** gives access to the next implementation in the method resolution order (MRO).

```python
class Model:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Model: {self.name}"


class Classifier(Model):
    def __init__(self, name, classes):
        super().__init__(name)
        self.classes = classes

    def describe(self):
        base_description = super().describe()
        return f"{base_description}; classes: {self.classes}"


classifier = Classifier("Animal Classifier", ["cat", "dog"])

print(classifier.describe())
# Model: Animal Classifier; classes: ['cat', 'dog']

print(isinstance(classifier, Model))  # True
```

`Classifier` inherits from `Model`, extends its initialization, and overrides `describe()` while still reusing the base description.

If a subclass defines its own `__init__`, Python doesn't call the base initializer automatically. Call `super().__init__(...)` when the base initialization is needed.

**What the interviewer expects:**
- Explain reusing and extending behavior through inheritance.
- Show a subclass overriding a parent method.
- Use `super()` to build on inherited behavior.
- Know that `super()` follows the MRO rather than always meaning one fixed parent.

---

### Q: What is multiple inheritance and MRO?
**Difficulty:** 🔴

**Answer:** **Multiple inheritance** means a class inherits from more than one base class. The **MRO** (method resolution order) is the order in which Python searches classes for methods and attributes. Python builds it with **C3 linearization**, which respects the order of the base classes and lists each class only once.

**Diamond inheritance example:**

```python
class A:
    def process(self):
        print("A")


class B(A):
    def process(self):
        print("B")
        super().process()


class C(A):
    def process(self):
        print("C")
        super().process()


class D(B, C):
    def process(self):
        print("D")
        super().process()


d = D()
d.process()
# D
# B
# C
# A

print([cls.__name__ for cls in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']
```

`B` inherits directly from `A`, yet `super()` inside `B.process()` reaches `C.process()` for a `D` instance, because `C` comes next in `D`'s MRO.

You can inspect the order with `D.__mro__` or `D.mro()`.

**Practical guidance:** multiple inheritance works well for small mixins, such as logging or serialization behavior. Cooperative methods should use compatible signatures and call `super()` consistently. Python raises `TypeError` when it can't build a consistent MRO.

**What the interviewer expects:**
- Explain a class that inherits from more than one base class.
- Describe the method resolution order (MRO).
- Understand the diamond inheritance problem and cooperative `super()` calls.
- Know how to inspect the MRO and recognize hierarchies that can't produce one.

---

### Q: What are dunder/magic methods? Give examples such as `__str__`, `__len__`, and `__call__`.
**Difficulty:** 🟡

**Answer:** Dunder methods are special methods whose names start and end with double underscores. They let your objects take part in built-in operations such as printing, `len()`, iteration, and being called like a function.

| Method | Triggered by | Purpose |
|---|---|---|
| `__init__` | Creating an instance | Initialize instance state |
| `__str__` | `str(obj)` or `print(obj)` | Return a readable string |
| `__repr__` | `repr(obj)` | Return a developer-oriented string |
| `__len__` | `len(obj)` | Return a non-negative integer length |
| `__call__` | `obj(...)` | Make an instance callable |
| `__iter__` | `iter(obj)` or a `for` loop | Provide an iterator |
| `__getitem__` | `obj[key]` | Support item access |

```python
class Dataset:
    def __init__(self, name, rows):
        self.name = name
        self.rows = list(rows)

    def __str__(self):
        return f"Dataset '{self.name}' with {len(self)} rows"

    def __repr__(self):
        return f"Dataset(name={self.name!r}, rows={self.rows!r})"

    def __len__(self):
        return len(self.rows)

    def __call__(self, index):
        return self.rows[index]


dataset = Dataset("training", [10, 20, 30])

print(dataset)        # Dataset 'training' with 3 rows
print(len(dataset))   # 3
print(dataset(1))     # 20
print(repr(dataset))  # Dataset(name='training', rows=[10, 20, 30])
```

`dataset(1)` works because the class implements `__call__`. For a normal sequence interface, implement `__getitem__` so that `dataset[1]` works.

Use the normal operations, such as `len(dataset)`, instead of calling `dataset.__len__()` yourself.

**What the interviewer expects:**
- Explain special methods with double underscores.
- Connect them to built-in operations and Python protocols.
- Implement `__str__`, `__len__`, and `__call__` correctly.
- Distinguish readable output (`__str__`) from the developer-oriented representation (`__repr__`).

---

### Q: What are dataclasses, and why are they useful?
**Difficulty:** 🟡

**Answer:** A dataclass is a class decorated with `@dataclass`. It uses the annotated fields to generate common methods, which makes data containers shorter and easier to maintain.

By default it generates `__init__`, `__repr__`, and `__eq__`, unless you turn that behavior off or define the method yourself. You can also request ordering comparisons with `order=True`.

**Practical ML example (model configuration):**

```python
from dataclasses import dataclass, field


@dataclass
class ModelConfig:
    name: str
    learning_rate: float = 0.01
    epochs: int = 10
    features: list[str] = field(default_factory=list)


first = ModelConfig("Classifier")
second = ModelConfig("Classifier")

print(first)
# ModelConfig(name='Classifier', learning_rate=0.01, epochs=10, features=[])

print(first == second)  # True

first.features.append("age")
print(first.features)   # ['age']
print(second.features)  # []
```

`default_factory=list` creates a separate list for each instance. (`list[str]` needs Python 3.9+.)

**Adding validation:** use `__post_init__`, which the generated `__init__` calls after assigning the fields.

```python
from dataclasses import dataclass


@dataclass
class TrainingConfig:
    epochs: int
    learning_rate: float

    def __post_init__(self):
        if self.epochs <= 0:
            raise ValueError("epochs must be positive")
        if self.learning_rate <= 0:
            raise ValueError("learning_rate must be positive")


config = TrainingConfig(epochs=20, learning_rate=0.01)
print(config.epochs)  # 20
```

These checks validate values. The annotations alone don't enforce types at runtime.

**Frozen dataclasses:**

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class ModelVersion:
    name: str
    version: int


model = ModelVersion("Classifier", 1)

# model.version = 2
# Raises dataclasses.FrozenInstanceError
```

`frozen=True` blocks ordinary reassignment of fields. It doesn't make mutable objects stored inside the fields immutable.

**Why they're useful:** dataclasses give you concise data models, readable representations, field-based equality, and convenient defaults, while you can still add ordinary methods and validation.

**What the interviewer expects:**
- Explain that dataclasses reduce boilerplate for classes that mainly store data.
- Name the generated methods, such as `__init__`, `__repr__`, and `__eq__`.
- Use `field(default_factory=...)` for mutable defaults that each instance gets separately.
- Know that type hints aren't runtime validation, and that `frozen=True` isn't deep immutability.

---

## Functions, Decorators and Generators

### Q: What is a lambda function, and when should you avoid it?
**Difficulty:** 🟢

**Answer:** A lambda is a small anonymous function written as a single expression. The expression's result is returned automatically.

```python
lambda arguments: expression
```

**Basic example:**

```python
double = lambda number: number * 2
print(double(5))  # 10
```

This shows the syntax, but for a reusable named operation a normal `def` is usually clearer.

**Practical ML example:** sort models by accuracy.

```python
models = [
    {"name": "Decision Tree", "accuracy": 0.85},
    {"name": "Random Forest", "accuracy": 0.93},
]

ranked = sorted(models, key=lambda model: model["accuracy"], reverse=True)
print([model["name"] for model in ranked])
# ['Random Forest', 'Decision Tree']
```

**Avoid a lambda** when the logic needs several steps, exception handling, a docstring, or a meaningful name for debugging:

```python
def normalize_score(score, minimum, maximum):
    if maximum <= minimum:
        raise ValueError("maximum must be greater than minimum")
    return (score - minimum) / (maximum - minimum)

print(normalize_score(75, 0, 100))  # 0.75
```

A lambda isn't faster than a function defined with `def`.

**What the interviewer expects:**
- Explain that a lambda creates an anonymous function from a single expression.
- Show a practical use, such as a sorting key.
- Use a named function when the logic gets complex or needs documentation.
- Know that lambdas can capture surrounding variables, just like ordinary functions.

---

### Q: What are closures in Python?
**Difficulty:** 🟡

**Answer:** A closure is a function that keeps access to variables from its enclosing function's scope, even after the outer function has finished running.

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

triple = make_multiplier(3)
print(triple(5))  # 15
```

`multiply()` can still use `factor` after `make_multiplier()` has returned.

**Keeping state with `nonlocal`:**

```python
def make_counter():
    count = 0

    def increment():
        nonlocal count
        count += 1
        return count

    return increment

counter = make_counter()
print(counter())  # 1
print(counter())  # 2
```

Use `nonlocal` to reassign a variable from an enclosing function's scope. You don't need it if you only read the variable.

**Common mistake (late binding):**

```python
functions = [lambda: number for number in range(3)]
print([function() for function in functions])
# [2, 2, 2]
```

These functions look up the shared variable when they're **called**, not when they're created, so they all see its final value.

If you want each function to keep the current value, bind it as a default argument:

```python
functions = [lambda number=number: number for number in range(3)]
print([function() for function in functions])
# [0, 1, 2]
```

**What the interviewer expects:**
- Explain how a nested function keeps access to variables from an enclosing function.
- Know that the captured variables stay accessible after the outer function returns.
- Explain `nonlocal` for rebinding an enclosing variable.
- Recognize late binding in functions created inside loops.

---

### Q: What is a decorator, and how do you write one?
**Difficulty:** 🟡

**Answer:** A decorator is a callable that receives a function (or class) and returns the object that should replace it. A typical function decorator wraps the function to add behavior before or after it runs.

```python
from functools import wraps


def log_call(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print(f"Calling {function.__name__}")
        result = function(*args, **kwargs)
        print("Finished")
        return result

    return wrapper


@log_call
def add(first, second):
    """Return the sum of two numbers."""
    return first + second


print(add(2, 3))
# Calling add
# Finished
# 5

print(add.__name__)  # add
print(add.__doc__)   # Return the sum of two numbers.
```

The `@log_call` line is roughly equivalent to:

```python
add = log_call(add)
```

- `*args` and `**kwargs` pass all arguments through.
- `return result` keeps the original function's return value.
- `@wraps` keeps useful metadata (`__name__`, `__doc__`) and adds a `__wrapped__` reference to the original function.

**Common uses:** logging, timing, caching, authorization checks, and retries.

This wrapper is for ordinary synchronous functions. Async functions and generators may need wrappers written for how they run.

**What the interviewer expects:**
- Explain changing or extending behavior without editing the decorated function's body.
- Understand that `@decorator` applies a callable to a function or class.
- Pass arguments through and return the original result correctly.
- Use `functools.wraps` when writing function wrappers.

---

### Q: What is the difference between a function decorator and a class decorator?
**Difficulty:** 🟡

**Answer:** A **function decorator** receives a function and returns its replacement, often a wrapper. A **class decorator** receives a class and returns its replacement, often the same class after modifying or registering it.

| Aspect | Function decorator | Class decorator |
|---|---|---|
| Decorated target | Function | Class |
| Typical purpose | Wrap calls, log, cache, validate | Register or modify classes, generate methods |
| When it's applied | When the decorated definition runs | When the decorated definition runs |
| Common example | `@functools.lru_cache` | `@dataclass` |

**Function decorator:**

```python
from functools import wraps


def announce(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print("Running function")
        return function(*args, **kwargs)
    return wrapper


@announce
def predict():
    return "cat"


print(predict())
# Running function
# cat
```

**Class decorator (register available models):**

```python
model_registry = {}


def register_model(cls):
    model_registry[cls.__name__] = cls
    return cls


@register_model
class SimpleModel:
    def predict(self):
        return "cat"


model = model_registry["SimpleModel"]()
print(model.predict())  # cat
```

`register_model()` runs once, when the class definition is executed, not every time an instance is created.

**Terminology note:** "class-based decorator" can also mean a decorator *implemented* as a class with `__call__`. That kind of decorator can decorate a function, which is different from decorating a class.

**What the interviewer expects:**
- Distinguish decorating a function from decorating a class.
- Understand that either kind of decorator can itself be written as a function or a class.
- Explain when decoration happens.
- Give examples such as function logging and class registration.

---

### Q: What is the difference between an iterable and an iterator?
**Difficulty:** 🟢

**Answer:** An **iterable** is any object Python can get an iterator from with `iter()`, such as a list, tuple, string, or generator. An **iterator** produces the next value each time you call `next()` on it. It implements `__next__()`, and its `__iter__()` returns itself. When it runs out of values, it raises `StopIteration`.

| Feature | Iterable | Iterator |
|---|---|---|
| Main purpose | Provide iteration | Produce values and track progress |
| `iter(obj)` | Returns an iterator | Returns the same iterator |
| `next(obj)` | Not necessarily supported | Supported |
| Repeated traversal | Depends on the object | Continues from the current position |
| Example | A list | A list iterator |

```python
numbers = [10, 20, 30]
iterator = iter(numbers)

print(next(iterator))  # 10
print(next(iterator))  # 20
print(next(iterator))  # 30

try:
    next(iterator)
except StopIteration:
    print("No more values")

print(iter(iterator) is iterator)  # True
print(list(iterator))              # []: already exhausted
print(list(numbers))               # [10, 20, 30]: the list is unchanged
```

A `for` loop gets an iterator, keeps asking it for values, and stops when `StopIteration` signals that it's exhausted.

**Important:** not every iterable can be restarted. A generator is both an iterable and an iterator, so looping over it uses up its values.

**What the interviewer expects:**
- Distinguish the object you iterate over from the object that tracks progress.
- Explain `iter()`, `next()`, and `StopIteration`.
- Know that iterators are themselves iterable.
- Understand that many containers can be iterated again from the start, while an exhausted iterator stays exhausted.

---

### Q: What is a generator, and how does `yield` work?
**Difficulty:** 🟡

**Answer:** A **generator function** is a function with `yield` in its body. Calling it doesn't run the body. Instead it returns a generator object, which is an iterator.

When a value is requested, the body runs until it reaches a `yield`. The generator hands out that value and pauses, keeping its local variables and its position. The next request resumes right after that `yield`.

```python
def generate_scores():
    print("Starting")
    yield 0.85
    print("Resuming")
    yield 0.93
    print("Finished")


scores = generate_scores()
print("Generator created")

print(next(scores))
print(next(scores))

try:
    next(scores)
except StopIteration:
    print("Exhausted")

# Generator created
# Starting
# 0.85
# Resuming
# 0.93
# Finished
# Exhausted
```

**Generator expression:** a short way to create a generator.

```python
squares = (number ** 2 for number in range(4))
print(next(squares))  # 0
print(list(squares))  # [1, 4, 9]
```

A generator produces values on demand instead of building the whole result list up front. It can still hold a lot of memory if its local variables or inputs refer to large objects.

**What the interviewer expects:**
- Explain generators as iterators that produce values lazily.
- Know that calling a generator function returns a generator without running its body.
- Explain how execution pauses and resumes at `yield`.
- Understand exhaustion and how local state is kept between values.

---

### Q: When would you use a generator instead of a list?
**Difficulty:** 🟡

**Answer:** Use a generator when you want to process values one at a time without storing every result, for example when reading large files, processing streams, or building pipelines. Use a list when you need indexing, sorting, repeated traversal, or all the results at once.

| Requirement | Usually suitable |
|---|---|
| Process a large input once | Generator |
| Work with an unbounded stream | Generator |
| Stop early after finding a result | Generator |
| Access the fifth result directly | List |
| Sort all the results | List (or another materialized collection) |
| Reuse the results several times | List |

**Practical ML example:** produce batches without building a list of all batches.

```python
from itertools import islice


def batches(iterable, batch_size):
    if batch_size <= 0:
        raise ValueError("batch_size must be positive")

    iterator = iter(iterable)
    while True:
        batch = list(islice(iterator, batch_size))
        if not batch:
            return
        yield batch


for batch in batches(range(7), 3):
    print(batch)
# [0, 1, 2]
# [3, 4, 5]
# [6]
```

The generator holds only the current batch, not every batch. Memory use still depends on the input: passing in a large existing list doesn't remove that list from memory.

**Common mistake:** converting a generator to a list materializes all of its remaining values.

```python
squares = (number ** 2 for number in range(5))
all_squares = list(squares)
print(all_squares)  # [0, 1, 4, 9, 16]
```

Generators can cut memory use and unnecessary work, but they aren't automatically faster for every workload.

**What the interviewer expects:**
- Choose generators for streaming, large inputs, and single-pass processing.
- Explain the smaller intermediate storage and delayed computation.
- Recognize when a list is the better fit.
- Avoid claiming that generators always make code faster.

---

### Q: What is the difference between `return` and `yield`?
**Difficulty:** 🟢

**Answer:** `return` ends the current function call and gives its result to the caller. `yield` hands out a value from a generator and pauses it so it can resume later.

| Feature | `return` | `yield` |
|---|---|---|
| Effect | Ends the current call | Pauses the generator |
| Local state | Not kept after the call ends | Kept between resumptions |
| Results delivered | One result per call | Many values across iteration |
| Function type | Ordinary function (no `yield` in the body) | Generator function (`yield` in the body) |

```python
def get_scores():
    return [0.85, 0.93]


def generate_scores():
    yield 0.85
    yield 0.93


print(get_scores())             # [0.85, 0.93]
print(list(generate_scores()))  # [0.85, 0.93]
```

The ordinary function returns a list immediately. The generator function returns an iterator that produces the scores as they're requested.

**`return` inside a generator ends the iteration:**

```python
def sample():
    yield 10
    return "complete"


generator = sample()
print(next(generator))  # 10

try:
    next(generator)
except StopIteration as error:
    print(error.value)  # complete
```

A normal `for` loop doesn't give you this final return value as another item.

**`yield` vs `yield from`:**

```python
def one_item():
    yield [1, 2]


def individual_items():
    yield from [1, 2]


print(list(one_item()))          # [[1, 2]]
print(list(individual_items()))  # [1, 2]
```

`yield from` hands the iteration over to another iterable.

**What the interviewer expects:**
- Explain ending a function versus pausing a generator.
- Know what calling an ordinary function and a generator function returns.
- Understand what `return` does inside a generator.
- Distinguish yielding one list from yielding each element of a list.

---

## Exceptions and Context Managers

### Q: How do `try`, `except`, `else`, and `finally` work?
**Difficulty:** 🟢

**Answer:**

| Clause | Purpose |
|---|---|
| `try` | Run code that may raise an exception |
| `except` | Handle a matching exception raised in the `try` block |
| `else` | Run when the `try` block finishes without an exception |
| `finally` | Do cleanup as control leaves the statement |

```python
def divide(first, second):
    try:
        result = first / second
    except ZeroDivisionError:
        print("Cannot divide by zero")
    else:
        print(f"Result: {result}")
    finally:
        print("Division attempt finished")


divide(10, 2)
# Result: 5.0
# Division attempt finished

divide(10, 0)
# Cannot divide by zero
# Division attempt finished
```

`else` doesn't run if the `try` block exits through an exception, `return`, `break`, or `continue`. Exceptions raised inside `else` aren't caught by the `except` clauses before it.

`finally` normally runs even when an exception is propagating or a `return` happens. It can't guarantee cleanup if the process is killed, crashes, or loses power.

**Common mistake:** a `return` inside `finally` can replace a pending return value or silently swallow a pending exception. Avoid control-flow statements there. (Python 3.14+ warns about them with a `SyntaxWarning`.)

```python
def example():
    try:
        return "original"
    finally:
        print("Cleanup")


print(example())
# Cleanup
# original
```

Keep `try` blocks small, so it's clear which operation each handler protects.

**What the interviewer expects:**
- Explain the purpose and execution order of each clause.
- Catch specific exceptions instead of hiding unrelated failures.
- Know that `else` runs only when the `try` block completes normally.
- Explain cleanup with `finally` and the danger of returning from it.

---

### Q: How do you create and raise custom exceptions?
**Difficulty:** 🟢

**Answer:** A custom exception gives an application-specific failure a meaningful type. Define a class that inherits from `Exception`, then raise an instance of it with `raise`.

**Practical ML example:** reject prediction before training.

```python
class ModelNotTrainedError(Exception):
    """Raised when prediction is requested before training."""


class Classifier:
    def __init__(self):
        self.trained = False

    def train(self):
        self.trained = True

    def predict(self, features):
        if not self.trained:
            raise ModelNotTrainedError("Train the model before prediction")
        return "cat"


model = Classifier()

try:
    model.predict([1.2, 3.4])
except ModelNotTrainedError as error:
    print(error)
# Train the model before prediction

model.train()
print(model.predict([1.2, 3.4]))  # cat
```

You can store structured details on the exception:

```python
class InvalidFeatureCountError(ValueError):
    def __init__(self, expected, actual):
        self.expected = expected
        self.actual = actual
        super().__init__(f"Expected {expected} features, received {actual}")


try:
    raise InvalidFeatureCountError(expected=4, actual=2)
except InvalidFeatureCountError as error:
    print(error.actual)  # 2
    print(error)         # Expected 4 features, received 2
```

Inheriting from `ValueError` also lets callers catch it as a general invalid-value error. If a custom type adds no useful meaning, reuse a built-in exception instead.

**What the interviewer expects:**
- Derive application exceptions from `Exception` or a suitable subclass.
- Raise meaningful errors with useful messages.
- Catch the custom type where recovery or reporting makes sense.
- Don't derive ordinary application errors directly from `BaseException`.

---

### Q: What is exception chaining using `raise ... from ...`?
**Difficulty:** 🟡

**Answer:** Exception chaining links a new exception to the exception that caused it. Use `raise NewError(...) from original_error` when you turn a low-level failure into an application-level one but want to keep the original cause.

```python
class InvalidConfigurationError(Exception):
    pass


def parse_epochs(value):
    try:
        return int(value)
    except ValueError as error:
        raise InvalidConfigurationError(
            "epochs must be an integer"
        ) from error


try:
    parse_epochs("twenty")
except InvalidConfigurationError as error:
    print(error)
    print(type(error.__cause__).__name__)
# epochs must be an integer
# ValueError
```

If the error isn't handled, the traceback shows both exceptions and marks the original one as the direct cause.

| Form | Behavior |
|---|---|
| `raise NewError(...) from error` | Sets an explicit cause in `__cause__` |
| `raise NewError(...)` inside an `except` block | Keeps the implicit context in `__context__` |
| `raise NewError(...) from None` | Hides the earlier exception in the traceback |
| Bare `raise` inside an `except` block | Re-raises the exception being handled |

**Hiding the earlier exception:**

```python
def parse_public_value(value):
    try:
        return int(value)
    except ValueError:
        raise InvalidConfigurationError("Invalid numeric setting") from None
```

`from None` only simplifies the traceback that's shown. It doesn't remove the earlier exception from `__context__`. Use explicit chaining when the original cause helps with diagnosis.

**What the interviewer expects:**
- Turn a low-level error into a meaningful higher-level error.
- Keep the original cause for debugging.
- Distinguish explicit chaining from implicit exception context.
- Understand what `from None` changes.

---

### Q: What is a context manager, and how does `with` work?
**Difficulty:** 🟡

**Answer:** A context manager defines setup and exit behavior around a block of code. The `with` statement uses it to manage resources such as files, locks, or temporary directories.

```python
from tempfile import TemporaryFile


with TemporaryFile(mode="w+t", encoding="utf-8") as file:
    file.write("training data\n")
    file.seek(0)
    print(file.read().strip())  # training data

print(file.closed)  # True
```

For a synchronous context manager, the steps are:
1. Evaluate the context manager expression.
2. Call `__enter__()`.
3. Bind its return value to the name after `as`, if there is one.
4. Run the block.
5. Call `__exit__()` when leaving the block, including when an exception occurs.

The value `__enter__()` returns doesn't have to be the context manager itself.

If `__exit__()` returns a truthy value, the exception from the block is suppressed. Returning `False` or `None` lets the exception propagate.

**Important:** if `__enter__()` raises an exception, that manager's `__exit__()` isn't called. The entry code must clean up anything it partly acquired.

What a context manager actually does depends on how it's implemented. For example, a database context manager may manage a transaction instead of closing the connection.

**What the interviewer expects:**
- Explain managing a resource within a clearly defined scope.
- Describe entering, binding the `as` value, and exiting.
- Know that cleanup happens on normal exit and when an exception propagates, as long as entry succeeded.
- Recognize that some context managers suppress exceptions.

---

### Q: How do you write a custom context manager using `__enter__` and `__exit__`?
**Difficulty:** 🟡

**Answer:** Implement `__enter__()` to acquire the resource and `__exit__()` to clean it up.

```python
from tempfile import TemporaryDirectory
from pathlib import Path


class ManagedTextFile:
    def __init__(self, path, mode="r"):
        self.path = path
        self.mode = mode
        self.file = None

    def __enter__(self):
        self.file = open(self.path, self.mode, encoding="utf-8")
        return self.file

    def __exit__(self, exc_type, exc_value, traceback):
        self.file.close()
        return False  # Do not suppress exceptions from the block


with TemporaryDirectory() as directory:
    path = Path(directory) / "scores.txt"

    with ManagedTextFile(path, "w") as file:
        file.write("accuracy=0.93\n")

    print(file.closed)  # True

    try:
        with ManagedTextFile(path) as file:
            print(file.read().strip())  # accuracy=0.93
            raise ValueError("Example failure")
    except ValueError as error:
        print(error)        # Example failure
        print(file.closed)  # True
```

| `__exit__` argument | Meaning |
|---|---|
| `exc_type` | Exception class, or `None` if no exception occurred |
| `exc_value` | Exception instance, or `None` |
| `traceback` | Exception traceback, or `None` |

Once entry succeeds, `__exit__()` is called even if the block raises an exception. Returning `False` lets that exception continue outward after the cleanup.

If the cleanup itself raises an exception, that new error can replace the one already propagating. The earlier error is normally kept as its context.

**Practical note:** built-in file objects already support `with`. This class only demonstrates the protocol. For ordinary file handling, `with open(...) as file:` is enough.

**What the interviewer expects:**
- Implement the context manager protocol.
- Return the managed value from `__enter__()`.
- Explain the three exception arguments to `__exit__()`.
- Clean up reliably and avoid suppressing exceptions by accident.

---

### Q: What is the difference between `finally` and a context manager for cleanup?
**Difficulty:** 🟡

**Answer:** A `finally` block puts cleanup code explicitly next to one particular operation. A context manager packages setup and cleanup into a reusable interface that you use with `with`.

| Aspect | `try/finally` | Context manager |
|---|---|---|
| Where cleanup lives | An explicit `finally` block | `__exit__()` or an equivalent abstraction |
| Reusability | Cleanup often repeated at each call site | Resource behavior written once |
| Setup | Written explicitly | Usually done in `__enter__()` |
| Exception suppression | Needs explicit handling or changed control flow | Supported through the `__exit__()` return value |
| Best for | One-off cleanup or custom control flow | Reusable, scoped resource management |

**Explicit cleanup with `finally`:**

```python
from threading import Lock


lock = Lock()
lock.acquire()
try:
    print("Updating shared metrics")
finally:
    lock.release()

print(lock.locked())  # False
```

**The same resource scope with `with`:**

```python
from threading import Lock


lock = Lock()
with lock:
    print("Updating shared metrics")

print(lock.locked())  # False
```

The lock's context manager handles both acquiring and releasing it.

**Writing a reusable context manager with `contextlib`:**

```python
from contextlib import contextmanager
from threading import Lock


@contextmanager
def managed_lock(lock):
    lock.acquire()
    try:
        yield lock
    finally:
        lock.release()


lock = Lock()
with managed_lock(lock):
    print("Updating shared metrics")
```

This shows how a context manager can wrap `try/finally`. A generator used with `@contextmanager` must yield exactly once. The `try/finally` makes sure cleanup runs if the block raises an exception.

**Important details:**
- Acquire the resource *before* the `try`, so cleanup only runs once acquisition has succeeded, as in the lock example.
- If you acquire several resources and a later one fails, clean up the ones you already acquired. `contextlib.ExitStack` helps when the context managers are chosen at runtime.
- Neither approach guarantees cleanup if the process is killed or loses power.
- Prefer an existing context manager when it clearly expresses the resource's lifetime. Use `finally` for cleanup that doesn't need a reusable abstraction.

**What the interviewer expects:**
- Explain that both can run cleanup on normal exit and when an exception is raised.
- Distinguish explicit cleanup code from a reusable resource-management protocol.
- Choose context managers for resources with a well-defined, scoped lifetime.
- Understand acquisition failures, exception suppression, and the limits of cleanup.

---

## Memory Management and GIL

### Q: How does Python manage memory and garbage collection?
**Difficulty:** 🟡

**Answer:** Python manages object memory automatically. CPython, the most widely used implementation, mainly uses **reference counting**, backed up by a **cyclic garbage collector**.

**Reference counting:** an object can usually be reclaimed once nothing refers to it.

```python
first = [1, 2, 3]
second = first
del first    # Removes one reference; second still refers to the list
del second   # The list can now be reclaimed
```

`del` removes a reference (a name binding). It doesn't necessarily destroy the object right away.

**Cyclic garbage collection:** objects can refer to each other and form a cycle.

```python
first = []
second = []
first.append(second)
second.append(first)
del first
del second
```

The two lists still refer to each other internally, so their reference counts never reach zero. CPython's cyclic collector detects and collects these unreachable cycles.

**Resource cleanup:** use context managers for resources such as files.

```python
with open("data.txt", encoding="utf-8") as file:
    content = file.read()
```

Don't rely on garbage collection to close resources promptly.

**What the interviewer expects:**
- Mention CPython's reference counting and cyclic garbage collection.
- Explain why cycles need extra handling.
- Distinguish removing a reference from destroying an object.
- Know that reclaimed memory isn't always returned to the operating system right away.
- Recognize that other Python implementations may manage memory differently.

---

### Q: What are shallow copy and deep copy?
**Difficulty:** 🟡

**Answer:** A **shallow copy** creates a new outer object but shares references to the nested objects. A **deep copy** recursively copies the nested objects too, as far as each object's copying behavior allows.

Assignment alone doesn't copy anything:

```python
original = [[1, 2], [3, 4]]
alias = original
print(alias is original)  # True
```

**Shallow copy:**

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)

print(shallow is original)        # False
print(shallow[0] is original[0])  # True

shallow[0].append(99)
print(original)  # [[1, 2, 99], [3, 4]]
```

The nested list is shared, so changing it affects both structures.

**Deep copy:**

```python
import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

deep[0].append(99)
print(original)  # [[1, 2], [3, 4]]
print(deep)      # [[1, 2, 99], [3, 4]]
```

**What the interviewer expects:**
- Distinguish assignment, shallow copy, and deep copy.
- Show the difference using nested mutable objects.
- Know that `list.copy()`, list slicing (`lst[:]`), and `dict.copy()` all make shallow copies.
- Explain that deep copying can take a lot of time and memory, and that it doesn't suit every object (for example, objects that hold external resources).

---

### Q: What is the GIL, and why does it matter?
**Difficulty:** 🟡

**Answer:** The **Global Interpreter Lock (GIL)** is a lock in GIL-enabled CPython that lets only one thread at a time run Python bytecode within an interpreter. It simplifies parts of CPython's object and memory management.

For CPU-heavy loops written in Python, adding threads usually doesn't give you parallel execution across CPU cores in that interpreter.

Threads still help with **I/O-bound** work, because the GIL is released during many blocking I/O operations. Native extensions (for example, NumPy) can also release the GIL while they compute.

**Example: CPU-heavy work submitted to threads**

```python
from concurrent.futures import ThreadPoolExecutor


def sum_squares(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(sum_squares, [100_000, 100_000]))

    print(results[0] == results[1])  # True
```

This works, but two threads don't make it twice as fast. In GIL-enabled CPython this Python computation is still limited by the GIL, and thread scheduling adds overhead.

**The GIL is not a substitute for a lock.** Protect shared multi-step operations explicitly:

```python
from threading import Lock, Thread

counter = 0
counter_lock = Lock()


def increment():
    global counter
    for _ in range(1_000):
        with counter_lock:
            counter += 1


if __name__ == "__main__":
    threads = [Thread(target=increment) for _ in range(2)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    print(counter)  # 2000
```

**Free-threaded Python:** since Python 3.13, CPython offers optional free-threaded builds (experimental in 3.13, officially supported from 3.14). With the GIL disabled, threads can run Python code in parallel. Extension compatibility matters, because importing an extension that doesn't support it may turn the GIL back on. Shared state still needs synchronization.

Source: [Python support for free threading](https://docs.python.org/3/howto/free-threading-python.html)

**What the interviewer expects:**
- Expand GIL as Global Interpreter Lock.
- Explain its effect on CPU-bound Python threads in GIL-enabled CPython.
- Distinguish running Python code from I/O waits and native-library computation.
- Know that the GIL doesn't replace application-level synchronization.
- Mention optional free-threaded CPython instead of claiming every Python runtime has a GIL.

---

## Concurrency (Threading, Multiprocessing, Asyncio)

> The examples use ordinary GIL-enabled CPython unless stated otherwise. Run the process-pool examples as saved `.py` scripts, especially on Windows. Interactive environments may not support them as written.

### Q: When should you use threading, multiprocessing, or asyncio?
**Difficulty:** 🟡

**Answer:** First work out what makes the workload slow (CPU or waiting on I/O), then choose.

| Approach | Suitable work | Main advantage | Main trade-off |
|---|---|---|---|
| Threading | Blocking I/O with synchronous libraries | Overlaps waiting, simple to integrate | Shared-state races; the GIL limits pure-Python CPU parallelism |
| Multiprocessing | Independent, substantial CPU-bound Python tasks | Uses multiple CPU cores despite the GIL | Process startup, serialization, communication, and memory costs |
| Asyncio | Many concurrent I/O operations with async-compatible libraries | Coordinates many waiting operations with cooperative tasks | Blocking code stalls the event loop |

**Threading: overlap simulated blocking I/O**

```python
from concurrent.futures import ThreadPoolExecutor
from time import sleep


def load_item(item_id):
    sleep(0.05)  # Simulates a blocking I/O wait
    return f"item-{item_id}"


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=3) as executor:
        print(list(executor.map(load_item, [1, 2, 3])))
# ['item-1', 'item-2', 'item-3']
```

**Multiprocessing: independent CPU calculations**

```python
from concurrent.futures import ProcessPoolExecutor


def sum_squares(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(sum_squares, [100_000, 200_000]))

    print(len(results))  # 2
```

Keep worker functions at module level and use the `__main__` guard. Inputs and results must be serializable (picklable) for the process pool. Small tasks may run slower, because the overhead outweighs the work.

**Asyncio: overlap simulated asynchronous I/O**

```python
import asyncio


async def load_item(item_id):
    await asyncio.sleep(0.05)  # Simulates an asynchronous I/O wait
    return f"item-{item_id}"


async def main():
    results = await asyncio.gather(*(load_item(i) for i in [1, 2, 3]))
    print(results)


if __name__ == "__main__":
    asyncio.run(main())
# ['item-1', 'item-2', 'item-3']
```

In real services, limit how many requests are in flight, set timeouts, and respect the capacity of the API or database. Too much concurrency can overload the services you depend on.

**ML nuance:** threads can work well for CPU-heavy native operations that release the GIL. Check how the library behaves and benchmark before switching to processes.

**What the interviewer expects:**
- Identify whether the work is CPU-bound or I/O-bound before choosing a tool.
- Explain shared-memory threads versus separate processes.
- Choose asyncio for cooperative concurrency with async-compatible operations.
- Account for overhead, memory, serialization, and library behavior.

---

### Q: How do `async` and `await` work in Python?
**Difficulty:** 🟡

**Answer:** `async def` defines a coroutine function, and calling it creates a coroutine object. `await` runs or waits for an awaitable. When the wait needs to pause, the event loop can run another ready task. An awaitable that finishes immediately may not give up control.

`asyncio.run()` runs a top-level coroutine in an event loop it manages. Tasks schedule coroutines so they make progress concurrently.

**Sequential vs concurrent execution:**

```python
import asyncio


async def fetch_score(name):
    await asyncio.sleep(0.05)
    return f"{name}: ready"


async def main():
    # Sequential: the second operation starts after the first finishes.
    first = await fetch_score("model-a")
    second = await fetch_score("model-b")
    print([first, second])

    # Concurrent: both operations are scheduled before waiting for results.
    first_task = asyncio.create_task(fetch_score("model-a"))
    second_task = asyncio.create_task(fetch_score("model-b"))
    print(await asyncio.gather(first_task, second_task))


if __name__ == "__main__":
    asyncio.run(main())

# Both printed lists:
# ['model-a: ready', 'model-b: ready']
```

Adding `async` to a function doesn't make ordinary blocking work asynchronous.

**Offloading a synchronous blocking operation:**

```python
import asyncio
import time


def blocking_read():
    time.sleep(0.05)  # Simulates synchronous blocking I/O
    return "loaded"


async def main():
    result = await asyncio.to_thread(blocking_read)
    print(result)  # loaded


if __name__ == "__main__":
    asyncio.run(main())
```

In GIL-enabled CPython, moving CPU-heavy Python loops to a thread generally doesn't give you CPU parallelism. Use a process pool or optimized computation where it fits.

**Common mistakes:**
- Calling a coroutine without awaiting or scheduling it.
- Using `time.sleep()` on the event-loop thread.
- Calling `asyncio.run()` from inside an event loop that's already running. In a notebook that supports top-level `await`, use `await main()` instead.

Source: [Coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html)

**What the interviewer expects:**
- Explain coroutine functions, coroutine objects, and the event loop.
- Distinguish creating a coroutine from running or scheduling it.
- Understand that a coroutine pauses cooperatively at an awaitable that has to wait.
- Recognize that awaiting one thing after another doesn't run independent work concurrently.
- Keep blocking operations off the event-loop thread.

---

### Q: What is the difference between concurrency and parallelism?
**Difficulty:** 🟢

**Answer:** **Concurrency** means several tasks make progress during overlapping time periods. They may take turns, especially while one is waiting for I/O. **Parallelism** means several tasks run at the same instant on different execution resources, such as CPU cores.

| Aspect | Concurrency | Parallelism |
|---|---|---|
| Main idea | Coordinate overlapping work | Run work simultaneously |
| Needs multiple CPU cores? | No | Yes, for CPU parallelism |
| Example | Several network requests waiting for responses | Separate processes computing features on different cores |
| Typical benefit | Better use of waiting time, responsiveness | Higher computational throughput |

**Concurrent tasks on one event-loop thread:**

```python
import asyncio


async def task(name):
    print(f"{name}: started")
    await asyncio.sleep(0.05)
    print(f"{name}: finished")


async def main():
    await asyncio.gather(task("A"), task("B"))


if __name__ == "__main__":
    asyncio.run(main())
```

Both tasks can start before either one finishes. Their Python code takes turns on the event-loop thread, so this doesn't show simultaneous CPU computation.

**Work that can run in parallel across processes:**

```python
from concurrent.futures import ProcessPoolExecutor


def calculate(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(calculate, [100_000, 200_000]))

    print(len(results))  # 2
```

The OS may schedule the workers on separate cores. The actual speedup depends on CPU quotas, the number of available cores, the size of the workload, and the overhead.

> **Interview-ready distinction:** concurrency is about *managing* overlapping tasks. Parallelism is about *running* tasks at the same time.

**What the interviewer expects:**
- Explain overlapping task lifetimes versus simultaneous execution.
- Know that concurrency can happen on a single CPU core.
- Connect asyncio to cooperative concurrency, and processes to possible CPU parallelism.
- Don't assume either approach guarantees faster execution.

---

### Q: How would you speed up a CPU-bound ML preprocessing task in Python?
**Difficulty:** 🔴

**Answer:** First confirm that the task spends most of its time computing, not waiting on files, a database, or a network service. Profile it on representative data, then optimize the dominant work.

| Step | Action | Reason |
|---|---|---|
| 1 | Measure a baseline and profile | Find the operation that's actually expensive |
| 2 | Improve the algorithm and remove repeated work | Reduce the amount of computation |
| 3 | Use NumPy or compiled library operations where suitable | Move repeated operations out of Python loops |
| 4 | Split independent heavy work into process tasks | Use the available CPU cores for Python computation |
| 5 | Tune batch size and worker count | Balance computation against coordination costs |
| 6 | Measure runtime, peak memory, and outputs | Confirm the improvement is real and correct |

**Vectorization example: scale numeric feature columns** (requires NumPy; the statistics come from the training data only)

```python
import numpy as np

training = np.array([
    [10.0, 100.0],
    [20.0, 200.0],
    [30.0, 300.0],
])

mean = training.mean(axis=0)
standard_deviation = training.std(axis=0)
safe_scale = np.where(standard_deviation == 0, 1.0, standard_deviation)

scaled_training = (training - mean) / safe_scale
print(scaled_training.shape)  # (3, 2)

# Reuse the training statistics for validation/inference; don't refit them.
validation = np.array([[25.0, 250.0]])
scaled_validation = (validation - mean) / safe_scale
print(scaled_validation.shape)  # (1, 2)
```

This uses whole-array operations instead of processing each number in a Python loop. It still creates intermediate arrays, so large datasets may need chunking, or in-place operations where those are safe. Handle missing values according to your data policy.

**Process-pool example: independent Python feature extraction** (save it as `preprocess.py` and run `python preprocess.py`)

```python
from concurrent.futures import ProcessPoolExecutor
from time import perf_counter


def extract_features(record):
    # Illustrative CPU-bound Python calculation.
    score = sum((number * record) % 97 for number in range(50_000))
    return record, score


def main():
    records = list(range(40))

    started = perf_counter()
    sequential = [extract_features(record) for record in records]
    sequential_seconds = perf_counter() - started

    started = perf_counter()
    with ProcessPoolExecutor(max_workers=2) as executor:
        parallel = list(executor.map(extract_features, records, chunksize=5))
    parallel_seconds = perf_counter() - started

    assert parallel == sequential
    print(f"Sequential: {sequential_seconds:.3f}s")
    print(f"Processes:  {parallel_seconds:.3f}s")
    print(f"Speedup:    {sequential_seconds / parallel_seconds:.2f}x")


if __name__ == "__main__":
    main()
```

The timing includes starting and shutting down the pool, so this small demo may be slower with processes. Judge the production benefit on representative workloads.

Process workers need importable functions and serializable inputs and results. A larger `chunksize` can reduce scheduling overhead, but it can hurt load balancing when tasks vary in cost.

Source: [concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)

**Additional ML considerations:**
- Don't copy huge datasets to workers over and over. Consider memory mapping, shared memory, or having each worker load its own partition.
- Avoid nested oversubscription: several processes that each start many BLAS/OpenMP threads can slow things down. Coordinate the worker count with the native libraries' thread counts.
- Native routines that release the GIL may benefit from threads, with less transfer overhead. Benchmark the specific operation.
- For suitable custom numeric kernels, consider compiling them with tools such as Numba or Cython, and include the compilation and deployment costs in the decision.
- GPUs only help when the operations are supported and the batch sizes justify the transfer and setup costs.
- Cache expensive deterministic transformations when it's safe. Keep training and validation data separate to avoid data leakage.
- Keep ordering, random seeds, numerical tolerance, and error handling under control when you change how the work runs.

> **Interview-ready answer:** "I would profile the preprocessing pipeline, improve the expensive algorithm, and replace suitable Python loops with optimized array operations. For the remaining independent CPU-heavy Python work, I would benchmark a process pool with sensible batching while monitoring memory and transfer costs. I would verify the outputs and avoid nested thread oversubscription before accepting the speedup."

**What the interviewer expects:**
- Profile first instead of immediately adding workers.
- Improve the algorithm and reduce Python-level loops where possible.
- Choose between vectorization, compiled operations, and process parallelism based on the workload.
- Consider memory use, serialization, task size, and nested parallelism.
- Verify that the output is correct and measure end-to-end performance.

---

## Coding Problems
