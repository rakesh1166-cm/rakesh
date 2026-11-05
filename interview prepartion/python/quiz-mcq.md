# Python Topic-Wise MCQ Quiz

**132 multiple-choice questions** across 7 topics, about 3 for each question in [python-qa.md](python-qa.md). About half are "predict the output" questions, and every code answer was checked by running it in Python 3.12.

## How to Use

1. Pick **one topic** per session.
2. Choose your answer **before** opening **Answer**. Write the letter down if it helps.
3. Open **Answer** to see the correct letter, a short explanation, and the source question (for example *(Q25: Closures)*).
4. For every wrong answer, re-read that question in [python-interview-qa.md](python-interview-qa.md) and add it to [revision-log.md](revision-log.md).
5. Write your score in the table below. Aim for **90%+** before moving on.

> Open this file in **Markdown preview** (`Ctrl+Shift+V` in VS Code) so the answers stay hidden.
> Other quizzes: [quiz.md](quiz.md) (rapid-fire and interview questions).

## Topics and Scores

| # | Topic | Source questions | MCQs | Score | Date |
|---|---|---|---|---|---|
| 1 | [Basics and Data Types](#basics-and-data-types) | Q1–Q7 | 1–21 (21) | __ / 21 | |
| 2 | [Data Structures and Comprehensions](#data-structures-and-comprehensions) | Q8–Q17 | 22–51 (30) | __ / 30 | |
| 3 | [OOP](#oop) | Q18–Q23 | 52–69 (18) | __ / 18 | |
| 4 | [Functions, Decorators and Generators](#functions-decorators-and-generators) | Q24–Q31 | 70–93 (24) | __ / 24 | |
| 5 | [Exceptions and Context Managers](#exceptions-and-context-managers) | Q32–Q37 | 94–111 (18) | __ / 18 | |
| 6 | [Memory Management and GIL](#memory-management-and-gil) | Q38–Q40 | 112–120 (9) | __ / 9 | |
| 7 | [Concurrency (Threading, Multiprocessing, Asyncio)](#concurrency-threading-multiprocessing-asyncio) | Q41–Q44 | 121–132 (12) | __ / 12 | |

---

## Basics and Data Types

*MCQs 1–21, from Q1–Q7.*

**1.** Pure-Python loops are slow, yet NumPy and PyTorch are fast. What best explains this?

- A) Python JIT-compiles every loop to machine code before it runs
- B) The GIL lets these libraries run Python loops on all CPU cores
- C) The heavy work runs in optimized native code or on GPUs
- D) Dynamic typing lets the interpreter skip type checks inside loops

<details>
<summary>Answer</summary>

**C.** Python acts as the orchestration layer: one call hands a whole array operation to compiled C/C++ code or GPU kernels, avoiding per-element interpreter overhead. *(Q1: Key features and ML)*

</details>

**2.** Which is a genuine trade-off of using Python for ML work?

- A) Some type errors only surface at runtime, and CPU-heavy pure-Python loops are slow
- B) You must declare every variable's type, which slows down notebook prototyping
- C) You must free large objects by hand, or the training process leaks memory
- D) It supports only procedural code, so pipelines cannot be written as classes

<details>
<summary>Answer</summary>

**A.** Dynamic typing defers some errors to runtime, and element-by-element Python loops carry interpreter overhead; the other options contradict Python's actual features. *(Q1: Key features and ML)*

</details>

**3.** "Is CPython compiled or interpreted?" Which answer is most accurate?

- A) It compiles source directly to native machine code ahead of time
- B) It re-parses each source line from text every time that line runs
- C) It compiles to JVM bytecode, which the Java virtual machine executes
- D) It compiles source to bytecode, which the CPython virtual machine runs

<details>
<summary>Answer</summary>

**D.** CPython is partly both: source is compiled to bytecode (not native code), then executed by its virtual machine. JVM bytecode describes Jython, not CPython. *(Q1: Key features and ML)*

</details>

**4.** What does this print?

```python
def double(number: int) -> int:
    return number * 2

print(double("Hi"))
```

- A) `TypeError: expected int, got str`
- B) `HiHi`
- C) `Hi2`
- D) `4`

<details>
<summary>Answer</summary>

**B.** Type hints are not enforced at runtime, and `str * int` is valid string repetition, so the call returns `"HiHi"` despite the `-> int` annotation. *(Q2: Dynamic typing)*

</details>

**5.** Which expression raises a `TypeError`?

- A) `10 + 2.5`
- B) `"Hi" * 2`
- C) `25 + "5"`
- D) `str(25) + "5"`

<details>
<summary>Answer</summary>

**C.** Python is strongly typed and won't silently convert `"5"` to a number; `10 + 2.5` is a compatible numeric conversion, and the other two are valid string operations. *(Q2: Dynamic typing)*

</details>

**6.** Which statement best describes Python's type system?

- A) Dynamically typed and strongly typed
- B) Statically typed and strongly typed
- C) Dynamically typed and weakly typed
- D) Statically typed whenever type hints are present

<details>
<summary>Answer</summary>

**A.** Types belong to objects and names can be rebound to any type (dynamic), but incompatible operations like `10 + "20"` raise errors instead of converting (strong). Hints don't make it static. *(Q2: Dynamic typing)*

</details>

**7.** What does this print?

```python
def add_item(item, items=[]):
    items.append(item)
    return items

add_item("A")
print(add_item("B"))
```

- A) `['B']`
- B) `['A']`
- C) `TypeError`
- D) `['A', 'B']`

<details>
<summary>Answer</summary>

**D.** The default list is created once, when the `def` runs, so every call that omits `items` reuses and mutates the same list. Use `items=None` and create a new list inside. *(Q3: Mutable vs Immutable)*

</details>

**8.** What happens when this runs?

```python
record = ([1, 2], "active")
record[0].append(3)
print(record)
record[0] = []
```

- A) `TypeError` on line 2, because tuples are immutable
- B) Prints `([1, 2, 3], 'active')`, then `TypeError` on line 4
- C) Prints `([1, 2], 'active')`, then `TypeError` on line 4
- D) Prints `([1, 2, 3], 'active')` and finishes without error

<details>
<summary>Answer</summary>

**B.** Tuple immutability is shallow: the contained list can be mutated, but replacing a tuple element raises `TypeError`. *(Q3: Mutable vs Immutable)*

</details>

**9.** What does this print?

```python
def update(items):
    items.append(3)
    items = [99]
    items.append(4)

nums = [1, 2]
update(nums)
print(nums)
```

- A) `[1, 2]`
- B) `[99, 4]`
- C) `[1, 2, 3]`
- D) `[1, 2, 3, 4]`

<details>
<summary>Answer</summary>

**C.** The first `append` mutates the caller's list; `items = [99]` only rebinds the local parameter, so the second `append` goes to a new list the caller never sees. *(Q3: Mutable vs Immutable)*

</details>

**10.** Which expression creates an empty `set`?

- A) `{}`
- B) `{:}`
- C) `dict.fromkeys([])`
- D) `set()`

<details>
<summary>Answer</summary>

**D.** `{}` is an empty `dict`, not a set; `{:}` is a `SyntaxError`, and `dict.fromkeys([])` also returns a dict. *(Q4: list vs tuple vs set vs dict)*

</details>

**11.** Which of these can be used as a dictionary key?

- A) `("user", 1)`
- B) `[1, 2]`
- C) `([1], 2)`
- D) `{1: 2}`

<details>
<summary>Answer</summary>

**A.** Keys must be hashable. A tuple is hashable only if all its elements are, so `([1], 2)` fails because it contains a list; lists and dicts are unhashable. *(Q4: list vs tuple vs set vs dict)*

</details>

**12.** You must check "already processed?" for each of 1 million file IDs. Which choice is best?

- A) A `list`, because `in` on a list uses binary search
- B) A `set`, because membership is O(1) on average
- C) A `tuple`, because immutability makes `in` O(1)
- D) A `dict` of ID to `True`, checked with `id in d.values()`

<details>
<summary>Answer</summary>

**B.** Sets hash the value and jump to its slot. `in` on a list or tuple scans linearly (O(n)), and so does `d.values()`; only `key in d` is a hash lookup. *(Q4: list vs tuple vs set vs dict)*

</details>

**13.** What does this print?

```python
first = [1, 2]
second = [1, 2]
third = first
third.append(3)
print(first == second, first is third, second)
```

- A) `True True [1, 2]`
- B) `False True [1, 2, 3]`
- C) `True False [1, 2]`
- D) `False True [1, 2]`

<details>
<summary>Answer</summary>

**D.** `third` is the same object as `first`, so the append changes `first` to `[1, 2, 3]`, which is no longer equal to the separate list `second`. *(Q5: `is` vs `==`)*

</details>

**14.** Why is `if x is None:` preferred over `if x == None:`?

- A) `== None` raises `TypeError` when `x` is not `None`
- B) `==` calls `__eq__`, which can be overridden or work element-wise
- C) `is` first converts both sides to `bool`, which is faster
- D) Several `None` objects can exist, and `==` may miss some

<details>
<summary>Answer</summary>

**B.** A class's `__eq__` can return anything, and NumPy's `arr == None` returns an array; `None` is a singleton, so an identity check is exact and can't be customized. *(Q5: `is` vs `==`)*

</details>

**15.** Which statement about the `is` operator is true?

- A) Comparing with a literal, as in `x is 5`, triggers a `SyntaxWarning` since Python 3.8
- B) A class can customize what `is` means by defining an `__is__` method
- C) `a is b` is evaluated by comparing `hash(a)` with `hash(b)`
- D) Comparing with a literal, as in `x is 5`, is a `SyntaxError` since Python 3.8

<details>
<summary>Answer</summary>

**A.** It's a warning ("did you mean '=='?"), not an error, because the code still runs; `is` compares identity and cannot be overridden. *(Q5: `is` vs `==`)*

</details>

**16.** What happens when this runs?

```python
count = 10

def update():
    print(count)
    count = 20

update()
```

- A) Prints `10`
- B) Prints `20`
- C) Raises `UnboundLocalError`
- D) Raises `SyntaxError` when `update` is defined

<details>
<summary>Answer</summary>

**C.** Because `update` assigns `count` anywhere in its body, the compiler makes `count` local for the whole function, so `print(count)` reads it before it has a value. *(Q6: Scope and LEGB)*

</details>

**17.** What does this print?

```python
callbacks = [lambda: step for step in range(3)]
print([cb() for cb in callbacks])
```

- A) `[0, 1, 2]`
- B) `[2, 2, 2]`
- C) `[0, 0, 0]`
- D) `NameError: name 'step' is not defined`

<details>
<summary>Answer</summary>

**B.** Closures look up `step` when they run, not when they're created, and all three share one variable that ends at `2`. Use `lambda step=step: step` to capture each value. *(Q6: Scope and LEGB)*

</details>

**18.** Which statement about `nonlocal` is true?

- A) It falls back to the module-level name if no enclosing function defines it
- B) It is required even to call `.append()` on a list in an enclosing function
- C) It creates the name in the enclosing function if it doesn't exist yet
- D) It rebinds a name in the nearest enclosing function, which must already exist

<details>
<summary>Answer</summary>

**D.** `nonlocal` never refers to globals and raises `SyntaxError` if no enclosing binding exists; it's only needed to rebind, not to mutate an object. *(Q6: Scope and LEGB)*

</details>

**19.** What does this print?

```python
def configure(dropout=None):
    dropout = dropout or 0.5
    return dropout

print(configure(0.0), configure(None))
```

- A) `0.5 0.5`
- B) `0.0 0.5`
- C) `0.0 None`
- D) `None 0.5`

<details>
<summary>Answer</summary>

**A.** `or` replaces every falsy value, so the caller's explicit `0.0` becomes `0.5`. Use `if dropout is None: dropout = 0.5` to keep a valid zero. *(Q7: None vs False vs 0 vs empty)*

</details>

**20.** What does this print?

```python
counts = {0: "zero"}
counts[False] = "false"
print(counts)
```

- A) `{0: 'zero', False: 'false'}`
- B) `{False: 'false'}`
- C) `{0: 'false'}`
- D) `{0: 'zero'}`

<details>
<summary>Answer</summary>

**C.** `bool` subclasses `int`, so `False == 0` and their hashes match; they are the same key, so the original key `0` stays and only its value is replaced. *(Q7: None vs False vs 0 vs empty)*

</details>

**21.** Which value is truthy?

- A) `0.0`
- B) `range(0)`
- C) `""`
- D) `[0]`

<details>
<summary>Answer</summary>

**D.** A list is truthy whenever it is non-empty, whatever its elements are; `0.0` is a numeric zero, and `range(0)` and `""` are empty sequences. *(Q7: None vs False vs 0 vs empty)*

</details>

---

## Data Structures and Comprehensions

*MCQs 22–51, from Q8–Q17.*

**22.** What does this print?

```python
labels = ["cat"]
labels.extend("dog")
print(labels)
```

- A) `['cat', 'dog']`
- B) `['cat', ['dog']]`
- C) `['cat', 'd', 'o', 'g']`
- D) `TypeError: 'str' object is not iterable`

<details>
<summary>Answer</summary>

**C.** `extend()` iterates over its argument, and a string is an iterable of characters, so each letter is added separately. Use `append("dog")` to add the whole string. *(Q8: append vs extend)*

</details>

**23.** What does this print?

```python
row = [1, 2]
matrix = []
matrix.append(row)
row.append(3)
print(matrix)
```

- A) `[[1, 2, 3]]`
- B) `[[1, 2]]`
- C) `[1, 2, 3]`
- D) `[[1, 2], 3]`

<details>
<summary>Answer</summary>

**A.** `append()` stores a reference to the same list object, not a copy, so the later change to `row` is visible inside `matrix`. *(Q8: append vs extend)*

</details>

**24.** Which statement about growing a list `a` is correct?

- A) `a += (3, 4)` raises `TypeError` because the operand is a tuple
- B) `a + (3, 4)` works and returns a new list
- C) `a += [3, 4]` creates a new list and rebinds `a` to it
- D) `a += (3, 4)` behaves like `extend()`: in place, any iterable

<details>
<summary>Answer</summary>

**D.** `+=` on a list modifies it in place and accepts any iterable, just like `extend()`. By contrast, `+` builds a new list and requires both operands to be lists, so `a + (3, 4)` raises `TypeError`. *(Q8: append vs extend)*

</details>

**25.** You need to remove duplicates from a large list of strings while keeping each value at its first position. Which is the best choice?

- A) `list(set(items))`
- B) `list(dict.fromkeys(items))`
- C) `sorted(set(items))`
- D) A loop that checks `if x not in result` on a list

<details>
<summary>Answer</summary>

**B.** Dict keys are unique and preserve insertion order (guaranteed since 3.7), giving O(n) expected time. `set` gives no order guarantee, `sorted(set(...))` gives sorted rather than first-appearance order, and the list-scan loop costs O(n²) comparisons. *(Q9: removing duplicates preserving order)*

</details>

**26.** What does this print?

```python
values = [1, 1.0, True, 2]
print(list(dict.fromkeys(values)))
```

- A) `[1, 1.0, True, 2]`
- B) `[True, 2]`
- C) `[1, True, 2]`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**D.** `1`, `1.0` and `True` compare equal and have equal hashes, so they count as one key, and the first one seen (`1`) is kept. *(Q9: removing duplicates preserving order)*

</details>

**27.** What happens when this runs?

```python
rows = [[1, 2], [3, 4], [1, 2]]
print(list(dict.fromkeys(rows)))
```

- A) It prints `[[1, 2], [3, 4]]`
- B) It prints `[[1, 2], [3, 4], [1, 2]]`
- C) It raises `TypeError: unhashable type: 'list'`
- D) It prints `[(1, 2), (3, 4)]`

<details>
<summary>Answer</summary>

**C.** Dict keys must be hashable, and lists are not. For lists, use `tuple(row)` as the key in a `seen` set, or fall back to an O(n²) equality scan. *(Q9: removing duplicates preserving order)*

</details>

**28.** What does this print?

```python
numbers = [10, 20, 30, 40, 50]
print(numbers[4:1:-1])
```

- A) `[50, 40, 30]`
- B) `[50, 40, 30, 20]`
- C) `[]`
- D) `[40, 30, 20]`

<details>
<summary>Answer</summary>

**A.** With a negative step the slice starts at index 4 and moves left, visiting indices 4, 3 and 2; the stop index 1 is still excluded. *(Q10: list slicing)*

</details>

**29.** Which line raises an exception?

```python
numbers = [10, 20, 30, 40, 50]
a = numbers[:100]     # line A
b = numbers[10:20]    # line B
c = numbers[100]      # line C
d = numbers[-100:2]   # line D
```

- A) Line A
- B) Line B
- C) Line C
- D) Line D

<details>
<summary>Answer</summary>

**C.** Slice boundaries are clamped to the valid range (A gives the whole list, B gives `[]`, D gives `[10, 20]`), but a single index must exist, so `numbers[100]` raises `IndexError`. *(Q10: list slicing)*

</details>

**30.** What does this print?

```python
batches = [[1, 2], [3, 4]]
copy = batches[:]
copy[0].append(99)
copy.append([5])
print(batches)
```

- A) `[[1, 2], [3, 4]]`
- B) `[[1, 2, 99], [3, 4], [5]]`
- C) `[[1, 2], [3, 4], [5]]`
- D) `[[1, 2, 99], [3, 4]]`

<details>
<summary>Answer</summary>

**D.** A slice is a new but shallow list: appending to `copy` does not touch `batches`, but `copy[0]` is the same inner list object as `batches[0]`. *(Q10: list slicing)*

</details>

**31.** What does this print?

```python
numbers = [3, 1, 2]
numbers = numbers.sort()
print(numbers)
```

- A) `[1, 2, 3]`
- B) `None`
- C) `[3, 1, 2]`
- D) `AttributeError`

<details>
<summary>Answer</summary>

**B.** `.sort()` sorts in place and returns `None`, so the assignment rebinds `numbers` to `None` and the sorted list is lost. *(Q11: sorted() vs .sort())*

</details>

**32.** What does this print?

```python
runs = [("a", 0.90), ("b", 0.85), ("c", 0.90), ("d", 0.85)]
ranked = sorted(runs, key=lambda r: r[1], reverse=True)
print([name for name, _ in ranked])
```

- A) `['a', 'c', 'b', 'd']`
- B) `['c', 'a', 'd', 'b']`
- C) `['a', 'c', 'd', 'b']`
- D) `['b', 'd', 'a', 'c']`

<details>
<summary>Answer</summary>

**A.** Python's sort is stable, and `reverse=True` preserves stability, so ties keep their original order (`a` before `c`, `b` before `d`). It is not the same as reversing an ascending sort. *(Q11: sorted() vs .sort())*

</details>

**33.** `scores` is a tuple, and you need its values in sorted order. Which statement is correct?

- A) `scores.sort()` sorts the tuple in place and returns `None`
- B) `sorted(scores)` returns a new sorted tuple
- C) `sorted(scores)` returns a new sorted list
- D) `scores.sort()` returns a new sorted tuple

<details>
<summary>Answer</summary>

**C.** `sorted()` accepts any iterable and always returns a list. Tuples have no `.sort()` method, so calling it raises `AttributeError`. *(Q11: sorted() vs .sort())*

</details>

**34.** What does this print?

```python
mixed = {1: "int"}
mixed[1.0] = "float"
mixed[True] = "bool"
print(mixed)
```

- A) `{1: 'int', 1.0: 'float', True: 'bool'}`
- B) `{True: 'bool'}`
- C) `{1: 'int'}`
- D) `{1: 'bool'}`

<details>
<summary>Answer</summary>

**D.** `1`, `1.0` and `True` are equal and have equal hashes, so they are the same key. The original key object `1` is kept, and its value is replaced twice. *(Q12: dict internals)*

</details>

**35.** Which of these can be used as a dictionary key?

- A) `[10, 20]`
- B) `([1], 2)`
- C) `frozenset({"a", "b"})`
- D) `{"a": 1}`

<details>
<summary>Answer</summary>

**C.** A frozenset is immutable and hashable. Lists and dicts are unhashable, and a tuple is hashable only if all its elements are, so `([1], 2)` fails because it contains a list. *(Q12: dict internals)*

</details>

**36.** What is the time complexity of `key in d` for a Python dict?

- A) O(1) on average, O(n) in the worst case when many keys collide
- B) O(1) in every case, because the hash gives the exact slot
- C) O(log n), because keys are kept in sorted order
- D) O(n) on average, because the keys are scanned in order

<details>
<summary>Answer</summary>

**A.** A dict is a hash table: the hash picks a candidate slot and equality confirms the match, so lookup is O(1) on average. Collisions force probing, and a pathological `__hash__` can degrade it to O(n). *(Q12: dict internals)*

</details>

**37.** What does this print?

```python
runs = [("rf", 0.90), ("svm", 0.85), ("rf", 0.93)]
latest = {name: score for name, score in runs}
print(latest)
```

- A) `{'rf': 0.9, 'svm': 0.85}`
- B) `{'rf': 0.93, 'svm': 0.85}`
- C) `{'svm': 0.85, 'rf': 0.93}`
- D) `ValueError: duplicate key 'rf'`

<details>
<summary>Answer</summary>

**B.** With duplicate keys the last value wins, but the key keeps the position where it was first inserted, so `'rf'` stays first. *(Q13: dict comprehensions)*

</details>

**38.** What does this print?

```python
shared = dict.fromkeys(["train", "test"], [])
shared["train"].append(1)
print(shared)
```

- A) `{'train': [1], 'test': []}`
- B) `{'train': [1]}`
- C) `{'train': [1], 'test': [1]}`
- D) `{'train': 1, 'test': []}`

<details>
<summary>Answer</summary>

**C.** `dict.fromkeys()` puts the same list object under every key. A comprehension such as `{split: [] for split in splits}` creates a new list for each key. *(Q13: dict comprehensions)*

</details>

**39.** When building `label_to_id = {label: i for i, label in enumerate(sorted(set(train_labels)))}`, why sort the unique labels?

- A) `enumerate()` only accepts sorted input
- B) Sorting removes duplicates that `set()` misses
- C) Sorted keys make dictionary lookup faster
- D) Set iteration order is arbitrary, so IDs could change between runs

<details>
<summary>Answer</summary>

**D.** Sorting makes the mapping deterministic, so the same class always gets the same integer ID. The mapping should also be built from the training data only and reused at inference. *(Q13: dict comprehensions)*

</details>

**40.** What does this print?

```python
pairs = zip(["a", "b"], [1, 2])
print(list(pairs))
print(list(pairs))
```

- A) `[('a', 1), ('b', 2)]` then `[]`
- B) `[('a', 1), ('b', 2)]` twice
- C) `[('a', 1), ('b', 2)]` then `None`
- D) `[('a', 1), ('b', 2)]` then `StopIteration` is raised

<details>
<summary>Answer</summary>

**A.** `zip()` returns a lazy iterator that can be consumed only once; after exhaustion, `list()` simply gets an empty result. *(Q14: enumerate() and zip())*

</details>

**41.** What does this print?

```python
features = ["a", "b", "c"]
labels = [1, 2]
print(list(zip(features, labels)))
```

- A) `ValueError: zip() argument 2 is shorter than argument 1`
- B) `[('a', 1), ('b', 2), ('c', None)]`
- C) `[('a', 1), ('b', 2)]`
- D) `[('a', 1), ('b', 2), ('c',)]`

<details>
<summary>Answer</summary>

**C.** By default `zip()` stops at the shortest input and silently drops the extra `'c'`, which can hide misaligned data. Padding needs `itertools.zip_longest()`, and an error needs `strict=True`. *(Q14: enumerate() and zip())*

</details>

**42.** Which statement about `zip(a, b, strict=True)` is correct?

- A) It is available in all Python 3 versions and pads with `None`
- B) It needs Python 3.10+ and raises `ValueError` when the mismatch is reached during iteration
- C) It needs Python 3.10+ and raises `ValueError` as soon as `zip()` is called
- D) It needs Python 3.10+ and silently truncates to the shortest input

<details>
<summary>Answer</summary>

**B.** The length check happens while the iterator is consumed, so pairs produced before the mismatch have already been yielded. Calling `zip()` itself does not raise. *(Q14: enumerate() and zip())*

</details>

**43.** What does this print?

```python
def evaluate(*metrics, threshold=0.5):
    print(metrics, threshold)

evaluate("precision", 0.7)
```

- A) `('precision',) 0.7`
- B) `precision 0.7`
- C) `TypeError: missing keyword argument 'threshold'`
- D) `('precision', 0.7) 0.5`

<details>
<summary>Answer</summary>

**D.** Parameters after `*args` are keyword-only, so `0.7` is collected into `metrics` and `threshold` keeps its default. You must write `threshold=0.7` to set it. *(Q15: *args and **kwargs)*

</details>

**44.** Inside `def f(*args, **kwargs)`, what are the types of `args` and `kwargs` when `f()` is called with no arguments?

- A) `args` is an empty `tuple`, `kwargs` is an empty `dict`
- B) `args` is an empty `list`, `kwargs` is an empty `dict`
- C) Both are `None` until arguments are passed
- D) `args` is an empty `tuple`, `kwargs` is `None`

<details>
<summary>Answer</summary>

**A.** `*args` always collects extra positional arguments into a tuple (`()` when none), and `**kwargs` collects extra keyword arguments into a new dict (`{}` when none). *(Q15: *args and **kwargs)*

</details>

**45.** Which statement about `*` and `**` is correct?

- A) They always collect arguments, in both definitions and calls
- B) In a definition they collect arguments; in a call they unpack them
- C) In a definition they unpack arguments; in a call they collect them
- D) They only work if the parameters are named `args` and `kwargs`

<details>
<summary>Answer</summary>

**B.** `def f(*args, **kwargs)` collects extras into a tuple and a dict, while `f(*values, **settings)` unpacks an iterable and a mapping into separate arguments. The names are only conventions; the stars provide the behavior. *(Q15: *args and **kwargs)*

</details>

**46.** What does this print in Python 3.9+?

```python
defaults = {"lr": 0.01, "epochs": 10, "seed": 0}
overrides = {"epochs": 30, "batch_size": 32}
print(defaults | overrides)
```

- A) `{'lr': 0.01, 'epochs': 10, 'seed': 0, 'batch_size': 32}`
- B) `{'lr': 0.01, 'seed': 0, 'epochs': 30, 'batch_size': 32}`
- C) `{'lr': 0.01, 'epochs': 30, 'seed': 0, 'batch_size': 32}`
- D) `{'epochs': 30, 'batch_size': 32, 'lr': 0.01, 'seed': 0}`

<details>
<summary>Answer</summary>

**C.** The right-hand dict wins on overlapping keys, but `'epochs'` keeps its original position from the left dict; new keys are added at the end. *(Q16: merging dicts)*

</details>

**47.** `first = {"model": {"depth": 5, "trees": 100}}` and `second = {"model": {"depth": 10}}`. What is `first | second`?

- A) `{'model': {'depth': 10, 'trees': 100}}`, because nested dicts are merged
- B) `{'model': {'depth': 5, 'trees': 100}}`, because the left dict wins
- C) A `TypeError`, because nested dicts cannot be merged with `|`
- D) `{'model': {'depth': 10}}`, because the nested value is replaced

<details>
<summary>Answer</summary>

**D.** Ordinary merging is shallow: the whole value under `"model"` is replaced, so `"trees"` is lost. Combining nested configs needs a recursive merge. *(Q16: merging dicts)*

</details>

**48.** On Python 3.8, you need a new config dict where user values override `DEFAULTS`, and `DEFAULTS` must stay unchanged. Which is the best choice?

- A) `config = {**DEFAULTS, **user}`
- B) `config = DEFAULTS | user`
- C) `config = DEFAULTS.update(user)`
- D) `config = ChainMap(DEFAULTS, user)`

<details>
<summary>Answer</summary>

**A.** Unpacking builds a new dict and the later mapping wins. `|` needs Python 3.9+, `update()` mutates `DEFAULTS` and returns `None`, and in a `ChainMap` the first mapping wins, so defaults would override the user. *(Q16: merging dicts)*

</details>

**49.** What does this print?

```python
config = {"batch_size": None}
print(config.get("batch_size", 32))
```

- A) `32`
- B) `None`
- C) `KeyError: 'batch_size'`
- D) `0`

<details>
<summary>Answer</summary>

**B.** The default in `get()` is used only when the key is missing. Here the key exists with the value `None`, so `None` is returned. *(Q17: missing dict keys)*

</details>

**50.** Given `counts = defaultdict(int, {"cat": 2})`, which statement is correct?

- A) Reading `counts["bird"]` returns `0` and inserts `"bird"`
- B) `counts.get("bird")` returns `0` and inserts `"bird"`
- C) `"bird" in counts` returns `True` because of the factory
- D) Reading `counts["bird"]` returns `0` without inserting it

<details>
<summary>Answer</summary>

**A.** Only square-bracket access triggers the factory (via `__missing__`), and it inserts the new key, even on a read. `get()` and `in` do not call the factory. *(Q17: missing dict keys)*

</details>

**51.** `config = {"dropout": 0.0}`. You want `0.5` only when the `"dropout"` key is missing. Which expression is correct?

- A) `config.get("dropout") or 0.5`
- B) `config.get("dropout", 0.5)`
- C) `config["dropout"] or 0.5`
- D) `0.5 if not config.get("dropout") else config["dropout"]`

<details>
<summary>Answer</summary>

**B.** `get()` with a default returns `0.0` here and `0.5` only if the key is absent. The `or` and `not` versions treat the valid falsy value `0.0` as missing and replace it. *(Q17: missing dict keys)*

</details>

---

## OOP

*MCQs 52–69, from Q18–Q23.*

**52.** What happens when this code runs?

```python
class Invalid:
    def __init__(self):
        self.ready = True
        return 10

obj = Invalid()
print(obj)
```

- A) It prints `10`, because `__init__` returned it
- B) It prints the instance; the `10` is silently ignored
- C) `Invalid()` raises a `TypeError`
- D) A `SyntaxError` is raised when the class is defined

<details>
<summary>Answer</summary>

**C.** `__init__` must return `None`; returning anything else raises `TypeError` at instantiation. The class definition itself is valid, so it is not a `SyntaxError`. *(Q18: `__init__`)*

</details>

**53.** What does this print?

```python
class Odd:
    def __new__(cls):
        print("new")
        return 42

    def __init__(self):
        print("init")

obj = Odd()
print(obj)
```

- A) `new` then `42`
- B) `new`, `init`, then `42`
- C) `init`, `new`, then `42`
- D) `new`, `init`, then `<__main__.Odd object ...>`

<details>
<summary>Answer</summary>

**A.** If `__new__` returns an object that is not an instance of the class, that class's `__init__` is skipped, and the returned object (`42`) is what you get. *(Q18: `__init__` vs `__new__`)*

</details>

**54.** When do you actually need to override `__new__` instead of `__init__`?

- A) Whenever a class needs default values for its attributes
- B) When attributes must be private to each instance
- C) When the class has more than one base class
- D) When subclassing an immutable type such as `float` or `tuple`

<details>
<summary>Answer</summary>

**D.** An immutable value is fixed at creation, so by the time `__init__` runs it can no longer be changed; `__new__` must set it. Defaults and per-instance attributes belong in `__init__`. *(Q18: `__init__` vs `__new__`)*

</details>

**55.** What does this print?

```python
class Config:
    def __init__(self, lr):
        self.lr = lr

    @classmethod
    def from_dict(cls, d):
        return cls(d["lr"])

class AdvancedConfig(Config):
    pass

c = AdvancedConfig.from_dict({"lr": 0.1})
print(type(c).__name__, c.lr)
```

- A) `Config 0.1`
- B) `AdvancedConfig 0.1`
- C) `TypeError`: `from_dict` needs an instance
- D) `AttributeError`: subclasses don't inherit class methods

<details>
<summary>Answer</summary>

**B.** `cls` is bound to the class the method is called on, so `cls(...)` builds an `AdvancedConfig`. That is why alternative constructors use `cls` instead of hardcoding `Config(...)`. *(Q19: instance, class, and static methods)*

</details>

**56.** Which statement about `@staticmethod` is correct?

- A) It receives no implicit first argument, but can be called on the class or an instance
- B) It receives the class as `cls`, like a class method
- C) It can only be called on the class, never on an instance
- D) It cannot accept any objects as arguments, only literals

<details>
<summary>Answer</summary>

**A.** A static method gets neither `self` nor `cls` automatically, but it is still reachable through both the class and its instances, and can take any explicit arguments. *(Q19: instance, class, and static methods)*

</details>

**57.** You want `ModelConfig.from_json(text)` to build a config, and subclasses should get instances of their own type. What is the best choice?

- A) An instance method that sets fields on `self`
- B) A `@staticmethod` that returns `ModelConfig(...)`
- C) A `@classmethod` that returns `cls(...)`
- D) A module-level function that returns `ModelConfig(...)`

<details>
<summary>Answer</summary>

**C.** A class method receives the class it was called on, so `cls(...)` works for subclasses. Hardcoding `ModelConfig(...)` (static method or module function) always returns the base type. *(Q19: instance, class, and static methods)*

</details>

**58.** Which line raises an exception?

```python
class Model:
    def __init__(self, name):
        self.name = name

class Classifier(Model):
    def __init__(self, name, classes):
        self.classes = classes

c = Classifier("clf", ["cat"])  # line 1
print(c.classes)                # line 2
print(c.name)                   # line 3
```

- A) Line 1, with a `TypeError` about the arguments
- B) Line 2, with an `AttributeError`
- C) None; it prints `['cat']` then `clf`
- D) Line 3, with an `AttributeError`

<details>
<summary>Answer</summary>

**D.** When a subclass defines its own `__init__`, the base `__init__` is not called automatically, so `self.name` is never set. Calling `super().__init__(name)` fixes it. *(Q20: inheritance and `super()`)*

</details>

**59.** What does this print?

```python
class Model:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Model: {self.name}"

class Classifier(Model):
    def describe(self):
        return super().describe() + " (classifier)"

print(Classifier("clf").describe())
```

- A) `Model: clf`
- B) `Model: clf (classifier)`
- C) `TypeError`, because `Classifier` defines no `__init__`
- D) `RecursionError`, because `describe` calls itself

<details>
<summary>Answer</summary>

**B.** `Classifier` inherits `Model.__init__`, and the overriding `describe` extends the parent's result via `super()`, which calls `Model.describe`, not itself. *(Q20: inheritance and `super()`)*

</details>

**60.** What does `super()` refer to inside a method?

- A) The next class after the current one in the MRO of the instance's type
- B) Always the first base class listed in the current class definition
- C) Always the `object` base class
- D) The class of the instance, so the same method is called again

<details>
<summary>Answer</summary>

**A.** `super()` follows the method resolution order of the actual object, so with multiple inheritance it may reach a sibling class rather than the direct parent. *(Q20: inheritance and `super()`)*

</details>

**61.** What does this print? (Each letter prints on its own line; the options list them in order.)

```python
class A:
    def process(self): print("A")

class B(A):
    def process(self): print("B"); super().process()

class C(A):
    def process(self): print("C"); super().process()

class D(B, C):
    def process(self): print("D"); super().process()

D().process()
```

- A) `D B A`
- B) `D B A C A`
- C) `D B C A`
- D) `D C B A`

<details>
<summary>Answer</summary>

**C.** The MRO of `D` is `D, B, C, A, object`. `super()` inside `B` reaches `C` (next in `D`'s MRO), not `A`, and `A` runs only once. *(Q21: multiple inheritance and MRO)*

</details>

**62.** What does this print?

```python
class A: pass
class B(A): pass
class C(A): pass
class D(C, B): pass

print([k.__name__ for k in D.__mro__])
```

- A) `['D', 'B', 'C', 'A', 'object']`
- B) `['D', 'C', 'A', 'B', 'object']`
- C) `['D', 'A', 'C', 'B', 'object']`
- D) `['D', 'C', 'B', 'A', 'object']`

<details>
<summary>Answer</summary>

**D.** C3 linearization keeps the order of the listed bases (`C` before `B`) and places the shared base `A` after all its subclasses. *(Q21: multiple inheritance and MRO)*

</details>

**63.** What happens when this code runs?

```python
class A: pass
class B(A): pass
class C(A, B): pass

print("defined")
```

- A) It prints `defined`; the MRO is `C, A, B, object`
- B) A `TypeError` is raised when class `C` is defined
- C) It prints `defined`; the error appears only when a method is called
- D) It prints `defined`; Python silently drops `A` from the bases

<details>
<summary>Answer</summary>

**B.** Listing `A` before its own subclass `B` makes a consistent C3 linearization impossible, so Python raises `TypeError` at class creation. *(Q21: multiple inheritance and MRO)*

</details>

**64.** What does this print?

```python
class Dataset:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)

print(bool(Dataset([])), bool(Dataset([1, 2])))
```

- A) `False True`
- B) `True True`
- C) `False False`
- D) `TypeError`, because `__bool__` is not defined

<details>
<summary>Answer</summary>

**A.** Without `__bool__`, truthiness falls back to `__len__`, so an empty dataset is falsy. Plain objects with neither method are always truthy. *(Q22: dunder methods)*

</details>

**65.** A class defines `__eq__` but not `__hash__`. What happens when you add an instance to a `set`?

- A) It works; hashing falls back to the object's identity
- B) It works; Python derives `__hash__` from `__eq__`
- C) `TypeError`: the instance is unhashable
- D) It works, but every instance lands in the same bucket

<details>
<summary>Answer</summary>

**C.** Defining `__eq__` without `__hash__` sets `__hash__` to `None`, so equal objects can never end up with different hashes. Define `__hash__` from the same fields to make it hashable. *(Q22: dunder methods)*

</details>

**66.** Your `Metrics.__add__` receives an operand type it doesn't support. What should it do?

- A) Raise `TypeError` immediately
- B) Return `None`
- C) Return `False`
- D) Return `NotImplemented`

<details>
<summary>Answer</summary>

**D.** Returning `NotImplemented` lets Python try the other operand's reflected method (such as `__radd__`) and raise a clear `TypeError` only if nothing works. Raising directly skips that fallback. *(Q22: dunder methods)*

</details>

**67.** What happens when this code runs?

```python
from dataclasses import dataclass

@dataclass
class ModelConfig:
    name: str
    features: list = []

a = ModelConfig("a")
print(a.features)
```

- A) It prints `[]`, and every instance shares that one list
- B) A `ValueError` is raised when the class is defined
- C) It prints `[]`, and each instance gets its own copy
- D) A `TypeError` is raised by `ModelConfig("a")`

<details>
<summary>Answer</summary>

**B.** `@dataclass` rejects plain `list`, `dict`, and `set` defaults at decoration time; use `field(default_factory=list)` to give each instance its own list. *(Q23: dataclasses)*

</details>

**68.** What happens when this code runs?

```python
from dataclasses import dataclass, field

@dataclass(frozen=True)
class Version:
    name: str
    tags: list = field(default_factory=list)

v = Version("clf")
v.tags.append("prod")
print(v.tags)
v.name = "reg"
```

- A) It prints `['prod']`, then `v.name = "reg"` raises `FrozenInstanceError`
- B) `v.tags.append` raises `FrozenInstanceError`; nothing is printed
- C) It prints `['prod']` and the rename succeeds
- D) `@dataclass(frozen=True)` rejects the `list` field with a `TypeError`

<details>
<summary>Answer</summary>

**A.** `frozen=True` blocks field reassignment but is not deep immutability: the list stored in a field can still be mutated. *(Q23: dataclasses)*

</details>

**69.** Which statement about a plain `@dataclass` (default `eq=True`, `frozen=False`) is correct?

- A) Instances are hashable using their field values
- B) Instances are unhashable, because `__hash__` is set to `None`
- C) It generates `__lt__` and the other ordering methods by default
- D) It checks field types against the annotations at runtime

<details>
<summary>Answer</summary>

**B.** With `eq=True` and no `frozen`, the dataclass sets `__hash__` to `None`; `frozen=True` gives a field-based hash. Ordering needs `order=True`, and annotations are not enforced at runtime. *(Q23: dataclasses)*

</details>

---

## Functions, Decorators and Generators

*MCQs 70–93, from Q24–Q31.*

**70.** What does this print?

```python
double = lambda x: x * 2
print(double.__name__)
```

- A) `double`
- B) `<lambda>`
- C) `lambda`
- D) `None`

<details>
<summary>Answer</summary>

**B.** A lambda is anonymous: assigning it to a name does not rename the function object, so its `__name__` stays `<lambda>`, which is one reason a `def` is better for debugging. *(Q24: Lambda functions)*

</details>

**71.** Which of these can NOT appear in the body of a lambda?

- A) A conditional expression such as `a if flag else b`
- B) A call to another function, such as `len(x)`
- C) A `try`/`except` block that handles an error
- D) A comparison such as `x > threshold`

<details>
<summary>Answer</summary>

**C.** A lambda body is a single expression, and `try`/`except` is a statement; the other three are all expressions. *(Q24: Lambda functions)*

</details>

**72.** When should you replace a lambda with a normal `def` function?

- A) When the function is passed as the `key` argument of `sorted()`
- B) When you need the function to run faster than a `def` would
- C) When the function must read a variable from the enclosing scope
- D) When the logic needs several steps, error handling, or a docstring

<details>
<summary>Answer</summary>

**D.** Multi-step logic, exception handling, documentation, and a meaningful name all call for `def`. A lambda is not faster than `def`, and both can capture surrounding variables. *(Q24: Lambda functions)*

</details>

**73.** What does this print?

```python
fs = [lambda i=i: i for i in range(3)]
print([f() for f in fs])
```

- A) `[0, 1, 2]`
- B) `[2, 2, 2]`
- C) `[0, 0, 0]`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A.** The default argument `i=i` is evaluated when each lambda is created, so every function keeps the value of `i` from its own iteration. Without it, late binding would give `[2, 2, 2]`. *(Q25: Closures)*

</details>

**74.** What does this print?

```python
def make_counter():
    count = 0
    def inc():
        nonlocal count
        count += 1
        return count
    return inc

a, b = make_counter(), make_counter()
a(); a()
print(a(), b())
```

- A) `3 3`
- B) `1 1`
- C) `3 1`
- D) `2 1`

<details>
<summary>Answer</summary>

**C.** Each call to `make_counter()` creates a new `count` variable, so `a` and `b` keep separate state: `a` reaches 3 on its third call, while `b` is called for the first time. *(Q25: Closures)*

</details>

**75.** What does this print?

```python
def make_counter():
    count = 0
    def inc():
        count += 1
        return count
    return inc

counter = make_counter()
try:
    print(counter())
except Exception as e:
    print(type(e).__name__)
```

- A) `1`
- B) `NameError`
- C) `0`
- D) `UnboundLocalError`

<details>
<summary>Answer</summary>

**D.** Assigning to `count` inside `inc` makes it local to `inc`, so `count += 1` reads it before it has a value. You need `nonlocal count` to rebind the enclosing variable. *(Q25: Closures)*

</details>

**76.** What does this print?

```python
def log(func):
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper

@log
def add(x, y):
    """Add two numbers."""
    return x + y

print(add.__name__, add.__doc__)
```

- A) `add Add two numbers.`
- B) `wrapper None`
- C) `add None`
- D) `wrapper Add two numbers.`

<details>
<summary>Answer</summary>

**B.** Without `@functools.wraps(func)`, the name `add` now refers to `wrapper`, which has its own name and no docstring. `@wraps` would copy `__name__` and `__doc__` and set `__wrapped__`. *(Q26: Decorators)*

</details>

**77.** What does this print (one value per line)?

```python
def log(func):
    def wrapper(*args, **kwargs):
        print("calling")
        func(*args, **kwargs)
    return wrapper

@log
def add(x, y):
    return x + y

print(add(2, 3))
```

- A) `calling`, then `None`
- B) `calling`, then `5`
- C) `5`, then `calling`
- D) only `calling`

<details>
<summary>Answer</summary>

**A.** The wrapper calls `func` but throws away its result, so it returns `None` by default. A correct wrapper must `return func(*args, **kwargs)`. *(Q26: Decorators)*

</details>

**78.** Which line is roughly equivalent to putting `@log_call` above `def add(...)`?

- A) `add = log_call(add())`
- B) `add = log_call()(add)`
- C) `log_call = add(log_call)`
- D) `add = log_call(add)`

<details>
<summary>Answer</summary>

**D.** The decorator receives the function object and its return value replaces the name. Option B would only be correct for a decorator factory that takes arguments, such as `@log_call()`. *(Q26: Decorators)*

</details>

**79.** What does this print?

```python
registry = []

def register(cls):
    registry.append(cls.__name__)
    return cls

@register
class Model:
    pass

a, b = Model(), Model()
print(registry)
```

- A) `[]`
- B) `['Model', 'Model']`
- C) `['Model']`
- D) `['Model', 'Model', 'Model']`

<details>
<summary>Answer</summary>

**C.** A class decorator runs once, when the class definition executes, not each time an instance is created. *(Q27: Function vs class decorators)*

</details>

**80.** What does this print?

```python
class CountCalls:
    def __init__(self, func):
        self.func = func
        self.calls = 0
    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.func(*args, **kwargs)
@CountCalls
def predict(x):
    return x * 2
predict(1); predict(2)
print(predict.calls, type(predict).__name__)
```

- A) `2 function`
- B) `2 CountCalls`
- C) `0 CountCalls`
- D) `1 predict`

<details>
<summary>Answer</summary>

**B.** `@CountCalls` replaces `predict` with a `CountCalls` instance, and each call goes through `__call__`, which increments `calls`. This is a decorator implemented as a class that decorates a function. *(Q27: Function vs class decorators)*

</details>

**81.** Which statement about a class decorator, such as `@dataclass`, is correct?

- A) It receives a class and returns its replacement, often the same class modified
- B) It must itself be implemented as a class that defines `__call__`
- C) It runs again every time a new instance of the class is created
- D) It can add methods to a class but can never register the class

<details>
<summary>Answer</summary>

**A.** The term describes the target: the decorator receives a class. It can be written as a function or a class, it runs once when the class is defined, and it can modify or register the class. *(Q27: Function vs class decorators)*

</details>

**82.** What does this print?

```python
nums = [10, 20, 30]
it = iter(nums)
next(it)
print(list(it), list(it), list(nums))
```

- A) `[20, 30] [20, 30] [10, 20, 30]`
- B) `[10, 20, 30] [] [10, 20, 30]`
- C) `[20, 30] [] []`
- D) `[20, 30] [] [10, 20, 30]`

<details>
<summary>Answer</summary>

**D.** The iterator continues from its current position and stays exhausted after the first `list(it)`. The list itself is unchanged and can be iterated again from the start. *(Q28: Iterables vs iterators)*

</details>

**83.** `it` is already an iterator (for example `it = iter([1, 2])`). What does `iter(it)` return?

- A) The same iterator object, so `iter(it) is it` is `True`
- B) A fresh iterator that starts again from the first element
- C) A copy of the iterator positioned at the current element
- D) Nothing, because it raises `TypeError` for an iterator

<details>
<summary>Answer</summary>

**A.** An iterator's `__iter__()` returns itself, which is why iterators are also iterable and why re-iterating one does not restart it. *(Q28: Iterables vs iterators)*

</details>

**84.** Which object can you pass directly to `next()` without a `TypeError`?

- A) `[1, 2]`
- B) `"ab"`
- C) `iter([1, 2])`
- D) `range(2)`

<details>
<summary>Answer</summary>

**C.** Lists, strings, and ranges are iterables but not iterators, so they don't support `next()`. `iter()` gives you an iterator that implements `__next__()`. *(Q28: Iterables vs iterators)*

</details>

**85.** What does this print (one value per line)?

```python
def gen():
    print("start")
    yield 1
    print("end")

g = gen()
print("created")
print(next(g))
```

- A) `start`, `created`, `1`
- B) `created`, `start`, `1`
- C) `created`, `start`, `1`, `end`
- D) `start`, `1`, `created`

<details>
<summary>Answer</summary>

**B.** Calling `gen()` doesn't run the body. `next()` runs it up to the first `yield` and pauses there, so `end` is never printed. *(Q29: Generators and yield)*

</details>

**86.** What does this print (one value per line)?

```python
squares = (n * n for n in range(4))
print(next(squares))
print(list(squares))
print(sum(squares))
```

- A) `0`, `[1, 4, 9]`, `0`
- B) `0`, `[0, 1, 4, 9]`, `14`
- C) `0`, `[1, 4, 9]`, `14`
- D) `1`, `[4, 9]`, `0`

<details>
<summary>Answer</summary>

**A.** `next()` consumes `0`, `list()` takes the remaining values, and the exhausted generator gives `sum()` nothing, so it returns `0`. *(Q29: Generators and yield)*

</details>

**87.** What does calling a generator function (a `def` with `yield` in its body) return?

- A) The first yielded value, after running the body up to the first `yield`
- B) A list containing every value the body yields
- C) `None`, because the function has no `return` statement
- D) A generator object; the body doesn't run until a value is requested

<details>
<summary>Answer</summary>

**D.** The call only creates a generator object (an iterator). Execution starts when `next()` or a loop asks for the first value. *(Q29: Generators and yield)*

</details>

**88.** Which requirement is the best reason to use a list instead of a generator?

- A) Processing a 50 GB log file line by line in a single pass
- B) Sorting the results and then traversing them several times
- C) Stopping as soon as the first matching record is found
- D) Consuming an unbounded stream of incoming sensor events

<details>
<summary>Answer</summary>

**B.** Sorting, indexing, and repeated traversal need materialized results. The other three are classic generator cases: single-pass, early-exit, or unbounded work. *(Q30: Generators vs lists)*

</details>

**89.** What does this print?

```python
def evens(n):
    for i in range(n):
        if i % 2 == 0:
            yield i

data = evens(6)
print(len(list(data)), len(list(data)))
```

- A) `3 3`
- B) `6 0`
- C) `3 0`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C.** The first `list(data)` consumes all three values `0, 2, 4`, and the generator stays exhausted, so the second list is empty. Use a list if you need to reuse results. *(Q30: Generators vs lists)*

</details>

**90.** Which claim about generators versus lists is correct?

- A) Generators are always faster than lists for every workload
- B) Calling `list()` on a generator materializes all its remaining values
- C) Passing a large existing list into a generator frees that list's memory
- D) A generator supports indexing, so `gen[4]` returns its fifth value

<details>
<summary>Answer</summary>

**B.** A generator avoids storing results only while you consume it lazily; `list(gen)` stores everything. Generators aren't automatically faster, don't free their inputs, and don't support indexing. *(Q30: Generators vs lists)*

</details>

**91.** What does this print (one value per line)?

```python
def sample():
    yield 10
    return "complete"

g = sample()
print(next(g))
try:
    next(g)
except StopIteration as e:
    print(e.value)
```

- A) `10`, `None`
- B) `10`, `10`
- C) `complete`, `None`
- D) `10`, `complete`

<details>
<summary>Answer</summary>

**D.** `return` inside a generator ends the iteration, and the returned value is attached to `StopIteration.value`. A `for` loop or `list()` would not include it as an item. *(Q31: return vs yield)*

</details>

**92.** What does this print?

```python
def one():
    yield [1, 2]

def each():
    yield from [1, 2]

print(list(one()), list(each()))
```

- A) `[[1, 2]] [1, 2]`
- B) `[1, 2] [1, 2]`
- C) `[[1, 2]] [[1, 2]]`
- D) `[1, 2] [[1, 2]]`

<details>
<summary>Answer</summary>

**A.** `yield [1, 2]` hands out the whole list as one item, while `yield from` delegates to the list and yields each element separately. *(Q31: return vs yield)*

</details>

**93.** Which statement correctly contrasts `return` and `yield`?

- A) `yield` ends the call like `return`, but the next call restarts from the top
- B) Using `return` with a value inside a generator function is a `SyntaxError`
- C) `return` ends the call and drops its locals; `yield` pauses and keeps them
- D) A function containing both is ordinary, and its `yield` lines are ignored

<details>
<summary>Answer</summary>

**C.** `yield` pauses the generator and keeps its local state for the next resume, while `return` finishes the call. In a generator, `return` is allowed and simply ends the iteration. *(Q31: return vs yield)*

</details>

---

## Exceptions and Context Managers

*MCQs 94–111, from Q32–Q37.*

**94.** What happens when this code runs?

```python
try:
    x = 1
except ValueError:
    print("caught")
else:
    raise ValueError("from else")
finally:
    print("finally")
```

- A) It prints `caught`, then `finally`
- B) It prints `finally`, then the `ValueError` propagates
- C) It prints only `caught`
- D) The `ValueError` propagates before `finally` runs

<details>
<summary>Answer</summary>

**B.** Exceptions raised in `else` are not caught by the `except` clauses before it; `finally` still runs as the exception leaves the statement. *(Q32: try/except/else/finally)*

</details>

**95.** What does this print (Python 3.12)?

```python
def load():
    try:
        raise ValueError("boom")
    finally:
        return "done"

try:
    print(load())
except ValueError:
    print("error")
```

- A) `error`
- B) `done`, then `error`
- C) A `SyntaxError`, because `return` is not allowed in `finally`
- D) `done`

<details>
<summary>Answer</summary>

**D.** A `return` in `finally` silently swallows the pending exception. It is legal but dangerous; Python 3.14+ emits a `SyntaxWarning` (PEP 765), not an error. *(Q32: try/except/else/finally)*

</details>

**96.** When does the `else` clause of a `try` statement run?

- A) Only when the `try` block finishes without an exception, `return`, `break`, or `continue`
- B) Whenever no `except` clause matched, including when an exception propagates
- C) After any `except` clause finishes handling an exception
- D) Always, just before the `finally` block

<details>
<summary>Answer</summary>

**A.** `else` runs only on normal completion of `try`; leaving `try` through an exception or a `return`/`break`/`continue` skips it. *(Q32: try/except/else/finally)*

</details>

**97.** What does this print?

```python
class InvalidFeatureCountError(ValueError):
    def __init__(self, expected, actual):
        self.actual = actual
        super().__init__(f"Expected {expected}, got {actual}")

try:
    raise InvalidFeatureCountError(4, 2)
except ValueError as e:
    print(type(e).__name__, e.actual, e)
```

- A) `ValueError 2 Expected 4, got 2`
- B) Nothing; the `except ValueError` clause doesn't match
- C) `InvalidFeatureCountError 2 Expected 4, got 2`
- D) `InvalidFeatureCountError 2 (4, 2)`

<details>
<summary>Answer</summary>

**C.** A subclass of `ValueError` is caught by `except ValueError`, keeps its own type, and `str(e)` is the message passed to `super().__init__()`. *(Q33: custom exceptions)*

</details>

**98.** What does this print?

```python
class WrongBaseError(BaseException):
    pass

try:
    try:
        raise WrongBaseError("bad")
    except Exception:
        print("Exception handler")
except BaseException:
    print("BaseException handler")
```

- A) `Exception handler`
- B) `BaseException handler`
- C) `Exception handler`, then `BaseException handler`
- D) Nothing; the error is uncaught

<details>
<summary>Answer</summary>

**B.** `except Exception` does not catch direct `BaseException` subclasses (like `KeyboardInterrupt`), which is why application errors should derive from `Exception`. *(Q33: custom exceptions)*

</details>

**99.** You're designing errors for a larger ML package. What is the best approach?

- A) One package base exception deriving from `Exception`, with specific subclasses
- B) One `PackageError` class, with the failure kind stored in a string code
- C) Derive every error directly from `BaseException` so nothing swallows it
- D) A new custom class for every failure, even where a built-in fits

<details>
<summary>Answer</summary>

**A.** A base class plus specific subclasses lets callers catch one failure or all of them. Reuse built-ins when a custom type adds no meaning, and avoid `BaseException`. *(Q33: custom exceptions)*

</details>

**100.** What does this print?

```python
try:
    try:
        int("x")
    except ValueError:
        raise KeyError("k")
except KeyError as e:
    print(e.__cause__, type(e.__context__).__name__)
```

- A) `invalid literal ... ValueError`
- B) `None NoneType`
- C) `ValueError ValueError`
- D) `None ValueError`

<details>
<summary>Answer</summary>

**D.** Raising inside an `except` block without `from` chains implicitly: `__context__` holds the `ValueError`, while the explicit `__cause__` stays `None`. *(Q34: exception chaining)*

</details>

**101.** What does this print?

```python
try:
    try:
        int("x")
    except ValueError:
        raise KeyError("k") from None
except KeyError as e:
    print(e.__cause__, type(e.__context__).__name__, e.__suppress_context__)
```

- A) `None NoneType True`
- B) `None NoneType False`
- C) `None ValueError True`
- D) `None ValueError False`

<details>
<summary>Answer</summary>

**C.** `from None` sets `__suppress_context__` to `True` so the traceback hides the earlier error, but `__context__` still holds the `ValueError`. *(Q34: exception chaining)*

</details>

**102.** Inside an `except` block you want to log the error and re-raise the same exception unchanged. What should you write after logging?

- A) `raise error from error`
- B) A bare `raise`
- C) `raise Exception(str(error))`
- D) `raise error from None`

<details>
<summary>Answer</summary>

**B.** A bare `raise` re-raises the exception currently being handled. Wrapping it in `Exception(...)` loses the type, and `from None` hides context. *(Q34: exception chaining)*

</details>

**103.** What does this print?

```python
class Quiet:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return "done"

with Quiet():
    raise ValueError("lost")
print("after")
```

- A) `after`
- B) `done`, then `after`
- C) A `ValueError` traceback, and `after` is not printed
- D) `after`, then a `ValueError` traceback

<details>
<summary>Answer</summary>

**A.** Any truthy return from `__exit__` suppresses the exception, so execution continues after the `with`. This is a classic accidental-suppression bug. *(Q35: context managers and `with`)*

</details>

**104.** What does this print?

```python
class Resource:
    def __enter__(self):
        print("enter")
        raise RuntimeError("fail")

    def __exit__(self, *args):
        print("exit")

try:
    with Resource():
        print("body")
except RuntimeError:
    print("caught")
```

- A) `enter`, `exit`, `caught`
- B) `enter`, `body`, `exit`, `caught`
- C) `enter`, `exit`
- D) `enter`, `caught`

<details>
<summary>Answer</summary>

**D.** If `__enter__` raises, the block never runs and that manager's `__exit__` is not called, so entry code must clean up anything it partly acquired. *(Q35: context managers and `with`)*

</details>

**105.** Which statement about `with` and context managers is correct?

- A) The `as` name is always bound to the context manager object itself
- B) Every context manager closes its resource when the block ends
- C) What exit does depends on the manager; an `sqlite3` connection commits or rolls back
- D) `__exit__` is skipped when the block raises, so `finally` is still needed

<details>
<summary>Answer</summary>

**C.** Exit behavior is defined by each manager: a `sqlite3` connection manages a transaction rather than closing. The `as` name gets whatever `__enter__` returns. *(Q35: context managers and `with`)*

</details>

**106.** What does this print?

```python
class Timer:
    def __enter__(self):
        self.start = 0

    def __exit__(self, *args):
        return False

with Timer() as t:
    print(t)
```

- A) `<__main__.Timer object at ...>`
- B) `None`
- C) `0`
- D) `AttributeError`, because `__enter__` returned nothing

<details>
<summary>Answer</summary>

**B.** The `as` target is bound to the return value of `__enter__`; forgetting `return self` gives `None`. *(Q36: custom context manager)*

</details>

**107.** What does this print?

```python
class OnlyKeyError:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc, tb):
        return exc_type is not None and issubclass(exc_type, KeyError)

for E in (KeyError, ValueError):
    try:
        with OnlyKeyError():
            raise E("x")
        print(E.__name__, "suppressed")
    except Exception as e:
        print(type(e).__name__, "escaped")
```

- A) `KeyError suppressed`, then `ValueError escaped`
- B) `KeyError escaped`, then `ValueError escaped`
- C) `KeyError suppressed`, then `ValueError suppressed`
- D) `KeyError escaped`, then `ValueError suppressed`

<details>
<summary>Answer</summary>

**A.** `__exit__` returns `True` only for `KeyError`, so that one is suppressed while `ValueError` propagates. This is how to suppress narrowly and on purpose. *(Q36: custom context manager)*

</details>

**108.** The `with` block raises `ValueError`, and then `__exit__` itself raises `OSError` during cleanup. What propagates?

- A) The `ValueError`; errors inside `__exit__` are ignored
- B) Both, combined into an `ExceptionGroup`
- C) Nothing; an exception inside `__exit__` suppresses the original
- D) The `OSError`, with the `ValueError` kept as its `__context__`

<details>
<summary>Answer</summary>

**D.** An exception raised in `__exit__` replaces the one already propagating, and the earlier error is normally kept as its context. Keep cleanup code simple. *(Q36: custom context manager)*

</details>

**109.** What does this print?

```python
from contextlib import contextmanager

@contextmanager
def managed():
    print("acquire")
    yield
    print("release")

try:
    with managed():
        raise ValueError("boom")
except ValueError:
    print("caught")
```

- A) `acquire`, `release`, `caught`
- B) `acquire`, `caught`, `release`
- C) `acquire`, `caught`
- D) `acquire`, `release`

<details>
<summary>Answer</summary>

**C.** The exception is thrown into the generator at the `yield`, so code after it is skipped; wrapping the `yield` in `try/finally` makes cleanup run. *(Q37: `finally` vs context managers)*

</details>

**110.** When cleaning up a lock manually with `try/finally`, where should `lock.acquire()` go?

- A) Just before the `try`, so `finally` releases only a lock that was acquired
- B) Inside the `try`, so a failed acquire is also handled by `finally`
- C) Inside the `finally`, so it always runs together with the release
- D) Anywhere; `lock.release()` is a no-op on an unlocked lock

<details>
<summary>Answer</summary>

**A.** Acquiring before the `try` means cleanup runs only once acquisition succeeded. Releasing an unlocked `Lock` raises `RuntimeError`, so it is not a no-op. *(Q37: `finally` vs context managers)*

</details>

**111.** You need to open a variable number of files, chosen at runtime, and close all of them reliably. What is the best choice?

- A) Nested `with` statements, one per file
- B) `contextlib.ExitStack`
- C) A single `try/finally` that closes only the last file
- D) `contextlib.suppress(OSError)` around the opens

<details>
<summary>Answer</summary>

**B.** `ExitStack` manages any number of context managers chosen at runtime and unwinds the ones already entered if a later one fails. Nested `with` needs the count known in advance. *(Q37: `finally` vs context managers)*

</details>

---

## Memory Management and GIL

*MCQs 112–120, from Q38–Q40.*

**112.** What does this print?

```python
features = [0.5, 0.7]
cache = {"latest": features}
del features
print(cache["latest"])
```

- A) `[0.5, 0.7]`
- B) `None`
- C) `NameError`
- D) `KeyError: 'latest'`

<details>
<summary>Answer</summary>

**A.** `del` removes a name binding, not the object; the dictionary still holds a reference, so the list stays alive. An object is reclaimed only when its last reference disappears. *(Q38: Memory and garbage collection)*

</details>

**113.** Why does CPython need a cyclic garbage collector on top of reference counting?

- A) Reference counting cannot track objects that are stored inside lists
- B) Objects that refer to each other keep their counts above zero when unreachable
- C) Reference counting only runs when `gc.collect()` is called explicitly
- D) Objects that refer to each other push their reference counts below zero

<details>
<summary>Answer</summary>

**B.** In a cycle, each object still references the other after the program can no longer reach them, so their counts never hit zero; the cyclic collector finds and reclaims such unreachable groups. *(Q38: Memory and garbage collection)*

</details>

**114.** A script deletes a large list of Python floats, but Task Manager still shows high memory for the process. What is the most likely explanation?

- A) `del` only queues the list, and it is freed at the next `gc.collect()`
- B) The list was moved to swap space and will be reloaded later
- C) Freed memory is kept by Python's allocator for reuse, not returned at once
- D) `del` doesn't work on lists, so the list is leaked until exit

<details>
<summary>Answer</summary>

**C.** CPython reclaimed the objects, but `pymalloc` arenas, free lists, and the C allocator may hold the memory for reuse, so process size (RSS) can stay high; `tracemalloc` would show the drop. *(Q38: Memory and garbage collection)*

</details>

**115.** What does this print?

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
shallow[0].append(99)
shallow[1] = ["x"]
print(original)
```

- A) `[[1, 2], [3, 4]]`
- B) `[[1, 2, 99], ['x']]`
- C) `[[1, 2, 99], [3, 4]]`
- D) `[[1, 2], ['x']]`

<details>
<summary>Answer</summary>

**C.** The shallow copy shares the inner lists, so mutating `shallow[0]` shows in `original`; replacing `shallow[1]` changes only the new outer list. *(Q39: Shallow vs deep copy)*

</details>

**116.** What does this print?

```python
grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)
```

- A) `[[1, 0, 0], [1, 0, 0], [1, 0, 0]]`
- B) `[[1, 0, 0], [0, 0, 0], [0, 0, 0]]`
- C) `[[1, 1, 1], [0, 0, 0], [0, 0, 0]]`
- D) `[[1, 0, 0, 0, 0, 0, 0, 0, 0]]`

<details>
<summary>Answer</summary>

**A.** Multiplying the outer list repeats references to one inner list, so all three rows are the same object. Use `[[0] * 3 for _ in range(3)]` for independent rows. *(Q39: Shallow vs deep copy)*

</details>

**117.** Which statement about `copy.deepcopy()` is true?

- A) It safely duplicates objects such as locks, open files, and sockets
- B) It copies the outer container but shares the nested mutable objects
- C) It recurses forever on a list that contains a reference to itself
- D) It keeps a memo, so shared references stay shared and cycles are handled

<details>
<summary>Answer</summary>

**D.** The memo dictionary maps already-copied objects to their copies, preserving sharing and stopping infinite recursion. Deep-copying a `threading.Lock` raises `TypeError`, and option B describes a shallow copy. *(Q39: Shallow vs deep copy)*

</details>

**118.** In GIL-enabled CPython, which task is most likely to get faster by using several threads?

- A) Summing squares in a pure-Python `for` loop
- B) Downloading many dataset shards over the network
- C) Tokenizing text with a pure-Python character loop
- D) Computing pairwise distances with nested Python loops

<details>
<summary>Answer</summary>

**B.** Blocking I/O releases the GIL while waiting, so threads overlap the waits. The other tasks are CPU-bound Python bytecode, which only one thread can run at a time per interpreter. *(Q40: GIL)*

</details>

**119.** Several threads run `counter += 1` on a shared global in GIL-enabled CPython. Which statement is correct?

- A) It's safe, because the GIL makes every Python statement atomic
- B) It's safe, but only while `counter` stays a small integer
- C) It's unsafe: it reads, adds, and stores, and a thread can switch between steps
- D) It's unsafe, because the GIL is released on every integer addition

<details>
<summary>Answer</summary>

**C.** The GIL protects the interpreter's internals, not your multi-step operations, so updates can be lost; protect the update with a `threading.Lock` or avoid shared state. *(Q40: GIL)*

</details>

**120.** Which statement about free-threaded CPython is true?

- A) Since Python 3.13, the standard CPython build runs without a GIL by default
- B) Without the GIL, shared state no longer needs locks or other synchronization
- C) It runs single-threaded code faster than the standard GIL-enabled build
- D) It is an optional separate build, and some extensions can re-enable the GIL

<details>
<summary>Answer</summary>

**D.** Free-threaded builds (such as `python3.13t`) are opt-in, experimental in 3.13 and supported from 3.14; importing an incompatible extension may turn the GIL back on, and shared state still needs synchronization. *(Q40: GIL)*

</details>

---

## Concurrency (Threading, Multiprocessing, Asyncio)

*MCQs 121–132, from Q41–Q44.*

**121.** A service must make 500 HTTP calls using an async client such as `httpx.AsyncClient`, without overloading the remote API. What is the best approach?

- A) A `ProcessPoolExecutor` with 500 workers, one per request
- B) A loop that does `await client.get(url)` for each URL in turn
- C) asyncio tasks run with `gather()`, capped by an `asyncio.Semaphore`, with timeouts
- D) One `threading.Thread` per call, each using `time.sleep()` while waiting

<details>
<summary>Answer</summary>

**C.** Many concurrent I/O operations with an async-compatible library fit asyncio, and a semaphore plus timeouts keeps the load on the API under control. Awaiting each call in turn (B) runs them one after another. *(Q41: Threading vs multiprocessing vs asyncio)*

</details>

**122.** A script downloads 50 files with the synchronous `requests` library, and you can't change the library. In GIL-enabled CPython, what is the simplest way to speed it up?

- A) A `ThreadPoolExecutor`, because threads release the GIL while waiting on I/O
- B) A `ProcessPoolExecutor`, because only processes can get around the GIL
- C) Wrap each `requests.get()` in an `async def` and run them with `gather()`
- D) Keep the loop sequential, because the GIL stops threads from helping at all

<details>
<summary>Answer</summary>

**A.** Threading suits blocking I/O with synchronous libraries: waits release the GIL, so downloads overlap. Putting a blocking call inside `async def` (C) doesn't make it asynchronous, and processes add startup and pickling costs you don't need. *(Q41: Threading vs multiprocessing vs asyncio)*

</details>

**123.** This is saved as a `.py` file and run with GIL-enabled CPython 3.12. What does it print?

```python
from concurrent.futures import ProcessPoolExecutor

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=1) as executor:
        try:
            print(list(executor.map(lambda v: v * 2, [1, 2])))
        except Exception as error:
            print(type(error).__name__)
```

- A) `[2, 4]`
- B) `PicklingError`
- C) `NameError`
- D) `TimeoutError`

<details>
<summary>Answer</summary>

**B.** Work sent to a process pool must be pickled, and a lambda can't be pickled. Define worker functions at module level instead. *(Q41: Threading vs multiprocessing vs asyncio)*

</details>

**124.** What does this print (one line each)?

```python
import asyncio, time

async def heartbeat():
    print("heartbeat")

async def main():
    task = asyncio.create_task(heartbeat())
    time.sleep(0.05)
    print("blocking call finished")
    await task

asyncio.run(main())
```

- A) `heartbeat`, then `blocking call finished`
- B) `blocking call finished` only, because the task never runs
- C) `RuntimeError`, because `time.sleep()` is banned in coroutines
- D) `blocking call finished`, then `heartbeat`

<details>
<summary>Answer</summary>

**D.** `time.sleep()` blocks the only event-loop thread, so the scheduled task can't run until `main` reaches `await task`. Use `await asyncio.sleep()` or `asyncio.to_thread()` instead. *(Q42: async and await)*

</details>

**125.** What does this print (one line each)?

```python
import asyncio

async def cached_lookup():
    return "cached"

async def other():
    print("other task ran")

async def main():
    task = asyncio.create_task(other())
    print(await cached_lookup())
    await task

asyncio.run(main())
```

- A) `cached`, then `other task ran`
- B) `other task ran`, then `cached`
- C) `cached` only, because the task is never awaited in time
- D) `other task ran` only, because the lookup returns no value

<details>
<summary>Answer</summary>

**A.** `cached_lookup()` contains no `await`, so awaiting it finishes without giving control to the event loop; `other()` first runs at `await task`. Only an `await` that actually has to wait (or `await asyncio.sleep(0)`) yields. *(Q42: async and await)*

</details>

**126.** Inside `main()`, `await a()` followed by `await b()` takes about 2 seconds, because each one waits about 1 second on `asyncio.sleep(1)`. Which change makes `main()` take about 1 second?

- A) Replace `asyncio.sleep(1)` inside them with `time.sleep(1)`
- B) Call `asyncio.run()` separately for each of the two coroutines
- C) Await them together with `asyncio.gather(a(), b())` or a `TaskGroup`
- D) Call `a()` and `b()` without `await`, so both start immediately

<details>
<summary>Answer</summary>

**C.** Sequential awaits don't overlap; `gather()`, `create_task()`, or a `TaskGroup` schedules both before waiting. Calling a coroutine without awaiting it (D) only creates a coroutine object, and its body never runs. *(Q42: async and await)*

</details>

**127.** What does this print (one line each)?

```python
import asyncio

async def task(name):
    print(name, "start")
    await asyncio.sleep(0)
    print(name, "end")

async def main():
    await asyncio.gather(task("A"), task("B"))

asyncio.run(main())
```

- A) `A start`, `A end`, `B start`, `B end`
- B) `A start`, `B start`, `A end`, `B end`
- C) `B start`, `A start`, `B end`, `A end`
- D) `A start`, `B start`, `B end`, `A end`

<details>
<summary>Answer</summary>

**B.** At `await asyncio.sleep(0)`, A gives control back to the loop, so B starts before A finishes. The two tasks take turns on one thread: concurrency without parallelism. *(Q43: Concurrency vs parallelism)*

</details>

**128.** Which statement about concurrency and parallelism is correct?

- A) Concurrency requires at least two CPU cores to be possible
- B) Parallelism means tasks take turns on one core while they wait
- C) asyncio runs coroutines in parallel across all available cores
- D) Concurrency can happen on one core; CPU parallelism needs several

<details>
<summary>Answer</summary>

**D.** Concurrency means tasks make progress during overlapping time periods, possibly by taking turns. Parallelism means running at the same instant on separate resources such as cores. asyncio is single-threaded cooperative concurrency. *(Q43: Concurrency vs parallelism)*

</details>

**129.** In GIL-enabled CPython on a 4-core machine, you start 4 threads that each run a pure-Python CPU-heavy loop. What happens?

- A) They run concurrently, but only one thread executes Python bytecode at a time
- B) They run in parallel on all four cores, giving roughly a 4x speedup
- C) Only the first thread runs, and the rest wait until it has finished
- D) CPython raises an error when CPU-bound threads compete for the GIL

<details>
<summary>Answer</summary>

**A.** The GIL lets only one thread run Python bytecode at a time, so the threads take turns rather than computing in parallel. Processes, vectorized code, or a free-threaded CPython build are the ways to get CPU parallelism here. *(Q43: Concurrency vs parallelism)*

</details>

**130.** An ML preprocessing step is too slow. What should you do first?

- A) Wrap the pipeline in a `ProcessPoolExecutor` with `os.cpu_count()` workers
- B) Profile it on representative data to confirm what is actually expensive
- C) Rewrite its loops as asyncio coroutines so that they no longer block
- D) Move all of the preprocessing to a GPU, since that is always faster

<details>
<summary>Answer</summary>

**B.** Profile first to confirm the work is CPU-bound and find the dominant operation; then improve the algorithm, vectorize, and only then consider processes. asyncio doesn't speed up computation, and GPUs help only when transfer and setup costs are justified. *(Q44: Speeding up CPU-bound ML preprocessing)*

</details>

**131.** On an 8-core machine, 8 worker processes each run heavy NumPy matrix operations, and the job is slower than with fewer workers. What is the most likely cause and fix?

- A) The GIL is blocking the processes, so switch the workers to threads
- B) The `chunksize` is too large, so set it to 1 for every task
- C) The processes share memory, so their results overwrite each other
- D) Each process starts its own BLAS threads; limit them, e.g. `OMP_NUM_THREADS=1`

<details>
<summary>Answer</summary>

**D.** This is nested oversubscription: 8 processes times 8 native threads compete for 8 cores. Coordinate the worker count with the native libraries' thread counts, set before NumPy is imported. *(Q44: Speeding up CPU-bound ML preprocessing)*

</details>

**132.** A process pool tokenizes texts, and every task is sent the same large vocabulary dictionary, so pickling costs dominate. What is the best fix?

- A) Turn the vocabulary into a lambda so that it pickles faster
- B) Use `as_completed()` instead of `map()` so tasks start sooner
- C) Send the vocabulary once per worker using `initializer` and `initargs`
- D) Set `chunksize=1` so that each task carries a smaller copy of it

<details>
<summary>Answer</summary>

**C.** An `initializer` stores the shared data in each worker once, instead of pickling it with every task. Lambdas can't be pickled at all, and `chunksize` changes batching, not the size of the data each task carries. *(Q44: Speeding up CPU-bound ML preprocessing)*

</details>
