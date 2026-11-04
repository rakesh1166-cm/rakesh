# My Python Revision Quiz

Python core: features, typing, mutability, collections, identity, scope, list methods, slicing, sorting.
Try to answer first, then click **Answer** to check. Numbers match `myrevision.md.txt`.

---

## Part A: Questions

**1.** What are Python's key features, and why is it popular for ML?

<details>
<summary>Answer</summary>

Readable, concise syntax · dynamic typing · multiple programming styles · cross-platform · huge ecosystem and community · integration with native code.
It's popular for ML because you write simple Python while libraries like NumPy and PyTorch run the heavy maths in fast C/C++/GPU code.

</details>

**2.** How do procedural, functional, and OOP styles differ? Show doubling the values in a list in each style.

<details>
<summary>Answer</summary>

| Programming Style | Main Idea | Common Syntax / Tools | Example |
|---|---|---|---|
| Procedural | Do the task step by step | `for`, `while`, variables, functions | `out = []`<br>`for n in nums: out.append(n * 2)` |
| Functional | Transform data with functions, no changing state | `map()`, `filter()`, `lambda`, comprehensions | `list(map(lambda n: n * 2, nums))` |
| Object-oriented | Group data and behaviour into objects | `class`, objects, attributes, methods | `class Doubler:`<br>`    def run(self, nums): return [n * 2 for n in nums]`<br>`Doubler().run(nums)` |

All give `[2, 4, 6]` for `nums = [1, 2, 3]`.

</details>

**3.** How is Python's syntax readable and concise?

<details>
<summary>Answer</summary>

**Readable:** clear names and indentation instead of braces. **Concise:** comprehensions and built-ins like `sum()` and `len()` do in one line what other languages need a loop for.

```python
avg = sum(scores) / len(scores)
passed = [s for s in scores if s >= 50]
```

</details>

**4.** How does Python integrate with native code?

<details>
<summary>Answer</summary>

Libraries connect Python calls to compiled C, C++, or GPU (CUDA) code, so you write simple Python while native code does the heavy work.
Examples: NumPy (C), PyTorch (C++/CUDA). Tools to write your own: Cython, pybind11, ctypes.

</details>

**5.** Which libraries and tools are used for each ML task?

<details>
<summary>Answer</summary>

| Task | Library / Tool | Purpose |
|---|---|---|
| Numerical computing | NumPy | Fast arrays and maths |
| Data preparation | pandas | Load, clean, and reshape tables |
| Visualization | Matplotlib, Seaborn | Charts and plots |
| Classical ML | scikit-learn | Regression, classification, clustering, pipelines |
| Deep learning | PyTorch, TensorFlow/Keras | Neural networks on GPU |
| Experimentation | Jupyter, MLflow | Interactive notebooks; tracking runs and metrics |
| Deployment | FastAPI, Docker | Serve the model as an API; package it |

</details>

**6.** Why is NumPy faster than Python loops? What is vectorization?

<details>
<summary>Answer</summary>

NumPy runs the operation on the whole array in compiled C code, so it skips Python's per-element overhead. Writing `arr * 2` instead of a loop is called **vectorization**.

```python
nums = list(range(1_000_000))
doubled = [n * 2 for n in nums]      # Python loop: slower

arr = np.arange(1_000_000)
doubled = arr * 2                    # vectorized: often 10–100x faster
```

</details>

**7.** How does dynamic typing work in Python?

<details>
<summary>Answer</summary>

Types are checked at runtime, not declared. A variable is just a name pointing to an object, and the object carries the type.

```python
x = 10      # x → int object
x = "hi"    # now x → str object; no declaration needed
```

</details>

**8.** What does "types belong to objects, not to variable names" mean?

<details>
<summary>Answer</summary>

The object `10` is an `int` forever. The name `x` has no type of its own; it just points to whatever object it was last assigned.

```python
x = 10
type(x)   # <class 'int'>, which is the type of the object x points to
```

</details>

**9.** Can a name refer to different types over time?

<details>
<summary>Answer</summary>

Yes, through reassignment.

```python
value = 5         # int
value = [5]       # list
value = None      # NoneType
```

</details>

**10.** When do invalid operations raise errors?

<details>
<summary>Answer</summary>

At runtime, only when that line actually runs, not before.

```python
def add():
    return "1" + 1    # no error when defined

add()                 # TypeError: can only concatenate str (not "int") to str
```

</details>

**12.** Are type hints automatically validated at runtime?

<details>
<summary>Answer</summary>

No. Hints are documentation for tools; Python ignores them when running. Use `mypy` to check statically or Pydantic to validate at runtime.

```python
def double(x: int) -> int:
    return x * 2

double("hi")   # 'hihi': no error
```

</details>

**13.** What is the difference between mutable and immutable objects?

<details>
<summary>Answer</summary>

**Mutable** = can be changed in place (`list`, `dict`, `set`, `bytearray`). **Immutable** = any "change" creates a new object (`int`, `float`, `bool`, `str`, `tuple`, `frozenset`).

```python
nums = [1, 2]; nums.append(3)    # same list changed
s = "hi"; s = s + "!"            # new string created
```

</details>

**14.** How does reassignment change a binding, while mutation changes an object?

<details>
<summary>Answer</summary>

**Binding** = a name pointing to an object. **Reassignment** points the name at a different object; **mutation** changes the object itself.

```python
items = [1, 2]
items.append(3)   # mutation: same object, now [1, 2, 3]
items = [9]       # reassignment: items now points to a new list
```

</details>

**15.** What is in-place modification vs reassignment?

<details>
<summary>Answer</summary>

**In place** = change the same object (`list.append()`, `+=` on a list). **Reassignment** = make the name refer to a new object (`count = count + 1` on an int).

```python
a = [1]; id1 = id(a); a.append(2); id(a) == id1   # True: same object
n = 1;   id2 = id(n); n = n + 1;   id(n) == id2   # False: new object
```

</details>

**16.** What is a shared reference?

<details>
<summary>Answer</summary>

Two names pointing to the same object, so a change through one is visible through the other.

```python
first = [1, 2]
second = first        # no copy!
second.append(3)
first                 # [1, 2, 3]
# Use first.copy() or list(first) to get a separate list
```

</details>

**17.** If a tuple is immutable, why can a list inside it still change?

<details>
<summary>Answer</summary>

The tuple can't swap which objects it holds, but a mutable object inside it can still change itself.

```python
record = ([1, 2], "a")
record[0].append(3)   # OK → ([1, 2, 3], 'a')
record[0] = [9]       # TypeError: tuple doesn't support item assignment
```

</details>

**18.** Why must dict keys be hashable, and why can't a tuple containing a list be a key?

<details>
<summary>Answer</summary>

Dicts find keys by hash, so the hash must never change. A list can change, so it isn't hashable, and a tuple is only hashable if everything inside it is.

```python
{(1, 2): "ok"}        # fine
{(1, [2]): "bad"}     # TypeError: unhashable type: 'list'
```

</details>

**19.** What is the difference between list, tuple, set, and dict? When do you use each?

<details>
<summary>Answer</summary>

| Type | Ordered | Mutable | Duplicates | Use for |
|---|---|---|---|---|
| `list [1, 2]` | Yes | Yes | Yes | Collection that changes |
| `tuple (1, 2)` | Yes | No | Yes | Fixed record, dict key |
| `set {1, 2}` | No | Yes | No (unique) | Remove duplicates, fast membership |
| `dict {"a": 1}` | Insertion order | Yes | Unique keys | Key → value lookup |

</details>

**20.** Which collections are ordered sequences?

<details>
<summary>Answer</summary>

`list`, `tuple`, `str`, and `range`: they support indexing and slicing. `dict` keeps insertion order but isn't a sequence (no `d[0]`). `set` is unordered.

</details>

**21.** Why is list membership O(n) but set/dict membership O(1)?

<details>
<summary>Answer</summary>

`x in list` checks items one by one. Sets and dicts use a hash table and jump straight to the right slot (O(1) on average).

```python
big_list = list(range(1_000_000))
big_set  = set(big_list)
999_999 in big_list   # scans ~1M items
999_999 in big_set    # one hash lookup
```

</details>

**22.** What must set elements and dict keys be?

<details>
<summary>Answer</summary>

Hashable (immutable): `int`, `str`, `tuple` of immutables, `frozenset`. Lists, dicts, and sets are not allowed.

```python
{[1, 2]}        # TypeError: unhashable type: 'list'
{(1, 2)}        # OK
```

</details>

**23.** What is the difference between `is` and `==`?

<details>
<summary>Answer</summary>

`==` asks "same contents?"; `is` asks "same object in memory?".

```python
a = [1, 2]; b = [1, 2]
a == b   # True
a is b   # False
```

</details>

**24.** What is the difference between identity and equality?

<details>
<summary>Answer</summary>

**Equality** (`==`) = two different dogs with the same name. **Identity** (`is`) = two leashes on the exact same dog. Check identity with `id(a) == id(b)`.

</details>

**25.** How do you check whether a value is missing or absent?

<details>
<summary>Answer</summary>

| Case | Check |
|---|---|
| Value is None | `if x is None:` (not `== None`) |
| Key missing in dict | `if "k" not in d:` or `d.get("k")` → `None` |
| Empty / falsy value | `if not x:` |
| Missing in pandas | `df["col"].isna()` |

</details>

**26.** Which operator compares numbers, strings, lists, and dicts?

<details>
<summary>Answer</summary>

`==` (equality) works on all of them. `<` and `>` work on numbers, strings (alphabetical), and lists (item by item), but not on dicts.

```python
[1, 2] == [1, 2]       # True
"apple" < "banana"     # True
{"a": 1} < {"b": 2}    # TypeError
```

</details>

**27.** What is variable scope? Explain the LEGB rule.

<details>
<summary>Answer</summary>

Scope is where a name can be seen. Python searches **L**ocal → **E**nclosing → **G**lobal → **B**uilt-in, and uses the first match.

```python
x = "global"
def outer():
    x = "enclosing"
    def inner():
        x = "local"
        print(x)       # local (len is found in Built-in)
    inner()
```

</details>

**28.** Which scope does a variable belong to in the outer function, current function, and current module?

<details>
<summary>Answer</summary>

Outer function → **enclosing** variable. Current function → **local** variable. Current module → **global** variable.

</details>

**29.** What is the difference between `global` and `nonlocal`?

<details>
<summary>Answer</summary>

`global` lets a function change a **module-level** variable. `nonlocal` lets a nested function change a variable in its **enclosing function**.

```python
count = 0
def inc():
    global count; count += 1

def outer():
    total = 0
    def add():
        nonlocal total; total += 1
    add(); return total     # 1
```

</details>

**30.** What is UnboundLocalError?

<details>
<summary>Answer</summary>

It happens when you read a local variable before giving it a value. Assigning to a name anywhere in a function makes it local for the whole function.

```python
count = 0
def inc():
    count += 1    # UnboundLocalError: count is local but not yet assigned
# Fix: add `global count`
```

</details>

**31.** How do you check the type of `None` and `False`, and what's the result?

<details>
<summary>Answer</summary>

```python
type(None)    # <class 'NoneType'>
type(False)   # <class 'bool'>
```

</details>

**32.** How do you check for an empty collection: `""`, `[]`, `()`, `{}`, `set()`, `range(0)`?

<details>
<summary>Answer</summary>

All of them are falsy, so `if not items:` works for every one.

```python
for empty in ["", [], (), {}, set(), range(0)]:
    print(not empty)    # True every time
```

</details>

**33.** What is the difference between `append()` and `extend()`?

<details>
<summary>Answer</summary>

`append()` adds its argument as **one** element. `extend()` loops over its argument and adds **each** element.

```python
a = [1, 2]; a.append([3, 4])   # [1, 2, [3, 4]]
b = [1, 2]; b.extend([3, 4])   # [1, 2, 3, 4]
```

</details>

**34.** Adding a single object vs adding the elements of an object: which method?

<details>
<summary>Answer</summary>

Single object → `append()`. Elements of an object → `extend()`.

</details>

**35.** How do you use `extend()` and `split()` to add a single character, a word's characters, and a sentence's words to a list?

<details>
<summary>Answer</summary>

```python
items = []
items.extend("a")                        # ['a']
items.extend("hi")                       # ['a', 'h', 'i']: a string iterates by character
items.extend("I love Python".split())    # [..., 'I', 'love', 'Python']
```

</details>

**36.** How do you add a range of numbers to a list with `extend()` and `range()`?

<details>
<summary>Answer</summary>

```python
batch_ids = []
batch_ids.extend(range(1, 4))   # [1, 2, 3]
```

</details>

**37.** How do you add dictionary keys to a list with `extend()`?

<details>
<summary>Answer</summary>

Iterating a dict gives its keys, so `extend()` adds the keys.

```python
columns = []
columns.extend({"age": 30, "income": 5000})   # ['age', 'income']
columns.extend(d.values())                    # use .values() for values
```

</details>

**38.** Do `append()` and `extend()` modify the original list?

<details>
<summary>Answer</summary>

Yes, both change the list in place and **return `None`**. So never write `items = items.append(x)`.

</details>

**39.** How do you remove duplicates from a list while preserving order?

<details>
<summary>Answer</summary>

`list(dict.fromkeys(items))`: dict keys are unique and keep insertion order.

```python
list(dict.fromkeys([3, 1, 2, 3, 1]))   # [3, 1, 2]
```

`list(set(items))` also removes duplicates but does **not** keep order.

</details>

**40.** What does "preserving order" mean when removing duplicates?

<details>
<summary>Answer</summary>

Keeping each value in the position where it **first** appeared: `[3, 1, 2, 3, 1]` → `[3, 1, 2]` (not sorted to `[1, 2, 3]`).

</details>

**41.** Does `list(set(items))` guarantee order?

<details>
<summary>Answer</summary>

No. Sets are unordered, so the result order can differ. Use `dict.fromkeys()` to keep order, or `sorted(set(items))` for sorted order.

</details>

**42.** How do you get unique values from a pandas Series?

<details>
<summary>Answer</summary>

Both keep first-seen order.

```python
labels = pd.Series(["cat", "dog", "cat"])
labels.unique()                      # array(['cat', 'dog'])  (NumPy array)
labels.drop_duplicates().tolist()    # ['cat', 'dog']         (via Series)
labels.nunique()                     # 2  (count of unique values)
```

</details>

**43.** How do you remove duplicate words and sort them alphabetically?

<details>
<summary>Answer</summary>

```python
words = ["pear", "apple", "pear", "fig"]
sorted(set(words))    # ['apple', 'fig', 'pear']
```

</details>

**44.** How do you extract a selected range of elements from a list?

<details>
<summary>Answer</summary>

Slicing: `items[start:stop]`.

```python
numbers = [10, 20, 30, 40, 50, 60]
numbers[1:4]    # [20, 30, 40]
```

</details>

**45.** What are start, stop, and step in slicing?

<details>
<summary>Answer</summary>

`list[start:stop:step]`: **start** = first index (included), **stop** = end index (excluded), **step** = jump size.

```python
numbers = [10, 20, 30, 40, 50, 60]
numbers[0:6:2]   # [10, 30, 50]  → indices 0, 2, 4
```

</details>

**46.** Why is the start index included but the stop index excluded?

<details>
<summary>Answer</summary>

So `len(a[start:stop]) == stop - start`, and splits fit together with no overlap: `a[:3] + a[3:] == a`.

```python
numbers = [10, 20, 30, 40]
numbers[1:3]   # [20, 30]  → indices 1 and 2; 3 is excluded
```

</details>

**47.** How do you reverse a list or print each element in reverse?

<details>
<summary>Answer</summary>

```python
items = [1, 2, 3]
items[::-1]              # [3, 2, 1]: new list
for x in reversed(items):
    print(x)             # 3, 2, 1: iterator, no copy
items.reverse()          # reverses in place, returns None
```

</details>

**48.** Slice for: first 3, last 3, all but first, all but last, all but first and last, every second, 3rd element onwards?

<details>
<summary>Answer</summary>

`numbers = [10, 20, 30, 40, 50, 60]`

| Task | Slice | Result |
|---|---|---|
| First 3 | `numbers[:3]` | `[10, 20, 30]` |
| Last 3 | `numbers[-3:]` | `[40, 50, 60]` |
| Exclude first | `numbers[1:]` | `[20, 30, 40, 50, 60]` |
| Exclude last | `numbers[:-1]` | `[10, 20, 30, 40, 50]` |
| Exclude first and last | `numbers[1:-1]` | `[20, 30, 40, 50]` |
| Every second | `numbers[::2]` | `[10, 30, 50]` |
| 3rd element onwards | `numbers[2:]` | `[30, 40, 50, 60]` |

</details>

**49.** What is the difference between `sorted()` and `.sort()`?

<details>
<summary>Answer</summary>

`sorted()` works on any iterable and **returns a new list**. `list.sort()` sorts the existing list **in place** and returns `None`.

```python
nums = [3, 1, 2]
sorted(nums)   # [1, 2, 3]; nums is unchanged
nums.sort()    # nums is now [1, 2, 3]; returns None
```

</details>

**50.** How do you sort model dicts by accuracy (highest first) and return their names?

<details>
<summary>Answer</summary>

```python
models = [{"name": "svm", "accuracy": 0.82},
          {"name": "rf",  "accuracy": 0.91},
          {"name": "lr",  "accuracy": 0.78}]

[m["name"] for m in sorted(models, key=lambda m: m["accuracy"], reverse=True)]
# ['rf', 'svm', 'lr']
```

</details>

**51.** Can the slice step be zero?

<details>
<summary>Answer</summary>

No: `numbers[::0]` raises `ValueError: slice step cannot be zero`. Negative steps are allowed (`[::-1]` reverses).

</details>

---

## Part B: Predict the Output (MCQ practice)

**M1.** What does each line print?

```python
print(issubclass(bool, int))
print(False == 0)
print(True == 1)
print(True + True)
print(sum([True, False, True]))
```

<details>
<summary>Answer</summary>

`True`, `True`, `True`, `2`, `2`: `bool` is a subclass of `int`, so `True` = 1 and `False` = 0.

</details>

**M2.** What does each line print?

```python
print(bool("0"))
print(bool([0]))
print(bool(-1))
print(bool(0.0))
```

<details>
<summary>Answer</summary>

`True`, `True`, `True`, `False`: only empty or zero values are falsy. `"0"` and `[0]` are non-empty, and `-1` is non-zero.

</details>

**M3.** What does each line print?

```python
print(None == False)
print(None == 0)
print([] == ())
print([] == False)
print(0 == 0.0)
print(False == 0)
```

<details>
<summary>Answer</summary>

`False`, `False`, `False`, `False`, `True`, `True`.
Being falsy is not the same as being equal: `None` and `[]` are falsy but not `== False`. Different types (list vs tuple) aren't equal.

</details>

**M4.** What does each line print?

```python
a = int("256"); b = int("256")
c = int("257"); d = int("257")
print(a is b)
print(c is d)
print(c == d)
```

<details>
<summary>Answer</summary>

`True`, `False`, `True`. CPython caches small ints from −5 to 256, so `a` and `b` are the same object, while 257 creates two objects. This is an implementation detail: always use `==` for values.

</details>

**M5.** What does each line print?

```python
first = [1, 2]
second = [1, 2]
third = first
print(first == second)
print(first is second)
print(first is third)
```

<details>
<summary>Answer</summary>

`True`, `False`, `True`: same contents but different objects; `third` is a shared reference to `first`.

</details>

**M6.** What happens?

```python
numbers = [1, 2]
numbers.extend(3)
```

<details>
<summary>Answer</summary>

`TypeError: 'int' object is not iterable`. `extend()` needs an iterable, so use `append(3)` or `extend([3])`.

</details>

**M7.** Starting from `[1, 2]` each time, what's the result of each call?

`append(3)` · `append([3, 4])` · `extend([3, 4])` · `extend((3, 4))` · `extend("ab")` · `extend(3)`

<details>
<summary>Answer</summary>

| Call | Result |
|---|---|
| `append(3)` | `[1, 2, 3]` |
| `append([3, 4])` | `[1, 2, [3, 4]]` |
| `extend([3, 4])` | `[1, 2, 3, 4]` |
| `extend((3, 4))` | `[1, 2, 3, 4]` |
| `extend("ab")` | `[1, 2, 'a', 'b']` |
| `extend(3)` | `TypeError` |

</details>

**M8.** What gets printed?

```python
numbers = [1, 2]
result = numbers.append(3)
print(result)
print(numbers)

features = ["age", "income"]
features = features.extend(["score"])
print(features)
```

<details>
<summary>Answer</summary>

`None`, `[1, 2, 3]`, `None`. Both methods return `None`, so `features = features.extend(...)` loses the list.

</details>

**M9.** With `numbers = [10, 20, 30, 40, 50, 60]`, what does each print?

```python
print(numbers[-3:])
print(numbers[:-2])
print(numbers[-4:-1])
```

<details>
<summary>Answer</summary>

`[40, 50, 60]` (last three) · `[10, 20, 30, 40]` (all except the last two) · `[30, 40, 50]` (start at 30, stop before 60).

</details>

**M10.** With `numbers = [10, 20, 30, 40, 50]`, what does each give?

`numbers[1:4]` · `numbers[:3]` · `numbers[2:]` · `numbers[::2]` · `numbers[1::2]`

<details>
<summary>Answer</summary>

| Slice | Meaning | Result |
|---|---|---|
| `numbers[1:4]` | Indices 1, 2, 3 | `[20, 30, 40]` |
| `numbers[:3]` | Start up to index 3 | `[10, 20, 30]` |
| `numbers[2:]` | Index 2 to the end | `[30, 40, 50]` |
| `numbers[::2]` | Every second element | `[10, 30, 50]` |
| `numbers[1::2]` | Every second, from index 1 | `[20, 40]` |

</details>

**M11.** Which of these reverses `items = [1, 2, 3]`, and what does each return?

A) `items[::-1]`  B) `reversed(items)`  C) `items.reverse()`  D) `items.sort(reverse=True)`

<details>
<summary>Answer</summary>

All four end up with the order `3, 2, 1`, but they return different things:
A → new list `[3, 2, 1]` · B → an iterator (wrap it in `list()`) · C → reverses in place, returns `None` · D → sorts descending in place, returns `None` (same result here only because the list was already sorted).

</details>

---

## Part C: Rapid-Fire Revision

**R1.** Where does the type belong?

<details>
<summary>Answer</summary>

To the object, not permanently to its variable name.

</details>

**R2.** Can a name refer to different types?

<details>
<summary>Answer</summary>

Yes, through reassignment.

</details>

**R3.** When does an unsupported operation fail?

<details>
<summary>Answer</summary>

When that operation executes (at runtime).

</details>

**R4.** What is the difference between an object and a name?

<details>
<summary>Answer</summary>

The object has identity, type, and value; the name just refers to it.

</details>

**R5.** Does assigning one list name to another copy the list?

<details>
<summary>Answer</summary>

No, both names refer to the same list. Use `.copy()` for a separate one.

</details>

**R6.** Is reassignment the same as mutation?

<details>
<summary>Answer</summary>

No. Reassignment changes a binding; mutation changes an object.

</details>
