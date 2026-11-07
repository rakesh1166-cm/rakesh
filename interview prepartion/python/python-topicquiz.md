# My Python Revision Quiz

Python core: features, typing, mutability, collections, identity, scope, list methods, slicing, sorting, OOP, functions, decorators, generators, exceptions, context managers, memory, GIL, and concurrency.
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

**Mutation (in place)** = `b.append(3)`, `b[:] = [9]`, `b += [3]`

**Reassignment** = `b = [9]`, `b = b + [3]`, `b = b[::-1]`, `b = a.copy()`

`b = a.copy()` is a reassignment: `copy()` builds a new list and `b` now points to it. `a` doesn't change.

`copy()` is shallow, so a nested list is still shared, and changing it is a mutation that `a` also sees:

```python
a = [[1], [2]]
b = a.copy()        # reassignment: b is a new outer list
b[0].append(9)      # mutation: changes the inner list shared with a
print(a)            # [[1, 9], [2]]
```

Use `copy.deepcopy(a)` to copy the inner lists too.

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

`UnboundLocalError` occurs when a function tries to read a local variable before it has been assigned a value. Assigning to a name anywhere in a function makes it local for the whole function.

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

**52.** How do you sort dictionary keys based on their values and leave the original unchanged?

<details>
<summary>Answer</summary>

Use `sorted()` with `key=d.get`. It returns a new list, so the dictionary stays the same.

```python
scores = {"asha": 70, "ben": 90, "cara": 80}
sorted(scores, key=scores.get)                  # ['asha', 'cara', 'ben']
sorted(scores, key=scores.get, reverse=True)    # ['ben', 'cara', 'asha']
```

</details>

**53.** How do you sort a string, set, or tuple alphabetically and leave the original unchanged?

<details>
<summary>Answer</summary>

Use `sorted()`. It works on any iterable and always returns a **new list**. These types have no `.sort()` method.

```python
sorted("cab")            # ['a', 'b', 'c']
"".join(sorted("cab"))   # 'abc'
sorted({3, 1, 2})        # [1, 2, 3]
sorted((3, 1, 2))        # [1, 2, 3]
```

</details>

**54.** How do you sort a list of strings by different criteria?

<details>
<summary>Answer</summary>

Pass a `key` function to `sorted()`. Python sorts by whatever value the key returns.

```python
words = ["banana", "fig", "Cherry", "apple"]

# 1. Length: shortest first
sorted(words, key=len)
# ['fig', 'apple', 'banana', 'Cherry']

# 2. Alphabetical: case-sensitive (uppercase comes first)
sorted(words)
# ['Cherry', 'apple', 'banana', 'fig']

# 3. Reverse alphabetical: case-sensitive
sorted(words, reverse=True)
# ['fig', 'banana', 'apple', 'Cherry']

# 4. Alphabetical: ignore case
sorted(words, key=str.lower)
# ['apple', 'banana', 'Cherry', 'fig']

# 5. Last character
sorted(words, key=lambda word: word[-1])
# ['banana', 'apple', 'fig', 'Cherry']

# 6. Second character
sorted(words, key=lambda word: word[1])
# ['banana', 'Cherry', 'fig', 'apple']

# 7. Number of vowels: fewest first
sorted(words, key=lambda word: sum(letter in "aeiou" for letter in word.lower()))
# ['fig', 'Cherry', 'apple', 'banana']

# 8. Number of uppercase letters: fewest first
sorted(words, key=lambda word: sum(letter.isupper() for letter in word))
# ['banana', 'fig', 'apple', 'Cherry']

# 9. Number of digits: fewest first
items = ["a12", "abc", "b3"]
sorted(items, key=lambda word: sum(letter.isdigit() for letter in word))
# ['abc', 'b3', 'a12']

# 10. Position of the first "a": absent words last
sorted(words, key=lambda word: word.find("a") if "a" in word else float("inf"))
# ['apple', 'banana', 'fig', 'Cherry']

# 11. Reversed spelling
sorted(words, key=lambda word: word[::-1])
# ['banana', 'apple', 'fig', 'Cherry']

# 12. Fully uppercase words first
items = ["apple", "BANANA", "Cherry", "FIG"]
sorted(items, key=lambda word: not word.isupper())
# ['BANANA', 'FIG', 'apple', 'Cherry']

# 13. Words containing "py" first: ignore case
items = ["java", "python", "ruby", "pytorch"]
sorted(items, key=lambda word: "py" not in word.lower())
# ['python', 'pytorch', 'java', 'ruby']

# 14. Custom priority
items = ["low", "high", "medium", "high"]
priority = {"high": 0, "medium": 1, "low": 2}
sorted(items, key=lambda word: priority[word])
# ['high', 'high', 'medium', 'low']

# 15. Numeric value of strings
items = ["100", "2", "10"]
sorted(items, key=int)
# ['2', '10', '100']

# 16. Multiple criteria: length, then alphabetical ignoring case
items = ["dog", "Banana", "cat", "apple", "Ant"]
sorted(items, key=lambda word: (len(word), word.lower()))
# ['Ant', 'cat', 'dog', 'apple', 'Banana']
```

Trick for 12 and 13: `False` sorts before `True`, so `not condition` puts the matching items first.

</details>

**55.** How do you sort a dictionary by different criteria?

<details>
<summary>Answer</summary>

Sort `data.items()`, then wrap the result in `dict()`. Inside the key, `p[0]` is the dictionary key and `p[1]` is its value.

| # | Sorting criterion | Given `data` | Code | Output |
|---|---|---|---|---|
| 1 | Key length: shortest first | `{"banana": 1, "fig": 2, "apple": 3}` | `dict(sorted(data.items(), key=lambda p: len(p[0])))` | `{'fig': 2, 'apple': 3, 'banana': 1}` |
| 2 | Alphabetical: case-sensitive | `{"banana": 1, "Cherry": 2, "apple": 3}` | `dict(sorted(data.items()))` | `{'Cherry': 2, 'apple': 3, 'banana': 1}` |
| 3 | Reverse alphabetical: case-sensitive | `{"banana": 1, "Cherry": 2, "apple": 3}` | `dict(sorted(data.items(), reverse=True))` | `{'banana': 1, 'apple': 3, 'Cherry': 2}` |
| 4 | Alphabetical: ignore case | `{"banana": 1, "Cherry": 2, "apple": 3}` | `dict(sorted(data.items(), key=lambda p: p[0].lower()))` | `{'apple': 3, 'banana': 1, 'Cherry': 2}` |
| 5 | Last character | `{"cat": 1, "dog": 2, "apple": 3}` | `dict(sorted(data.items(), key=lambda p: p[0][-1]))` | `{'apple': 3, 'dog': 2, 'cat': 1}` |
| 6 | Second character | `{"apple": 1, "banana": 2, "cherry": 3}` | `dict(sorted(data.items(), key=lambda p: p[0][1]))` | `{'banana': 2, 'cherry': 3, 'apple': 1}` |
| 7 | Vowel count: fewest first | `{"banana": 1, "fig": 2, "apple": 3}` | `dict(sorted(data.items(), key=lambda p: sum(c in "aeiou" for c in p[0].lower())))` | `{'fig': 2, 'apple': 3, 'banana': 1}` |
| 8 | Uppercase count: fewest first | `{"APPLE": 1, "Banana": 2, "fig": 3}` | `dict(sorted(data.items(), key=lambda p: sum(c.isupper() for c in p[0])))` | `{'fig': 3, 'Banana': 2, 'APPLE': 1}` |
| 9 | Digit count: fewest first | `{"a12": 1, "abc": 2, "b3": 3}` | `dict(sorted(data.items(), key=lambda p: sum(c.isdigit() for c in p[0])))` | `{'abc': 2, 'b3': 3, 'a12': 1}` |
| 10 | First position of `"a"`: absent keys last | `{"cat": 1, "fig": 2, "apple": 3}` | `dict(sorted(data.items(), key=lambda p: p[0].find("a") if "a" in p[0] else float("inf")))` | `{'apple': 3, 'cat': 1, 'fig': 2}` |
| 11 | Reversed spelling | `{"bat": 1, "car": 2, "dog": 3}` | `dict(sorted(data.items(), key=lambda p: p[0][::-1]))` | `{'dog': 3, 'car': 2, 'bat': 1}` |
| 12 | Fully uppercase keys first | `{"apple": 1, "BANANA": 2, "Cherry": 3}` | `dict(sorted(data.items(), key=lambda p: not p[0].isupper()))` | `{'BANANA': 2, 'apple': 1, 'Cherry': 3}` |
| 13 | Keys containing `"py"` first: ignore case | `{"java": 1, "Python": 2, "ruby": 3}` | `dict(sorted(data.items(), key=lambda p: "py" not in p[0].lower()))` | `{'Python': 2, 'java': 1, 'ruby': 3}` |
| 14 | Custom priority | `{"low": 1, "high": 2, "medium": 3}` | `priority = {"high": 0, "medium": 1, "low": 2}`<br>`dict(sorted(data.items(), key=lambda p: priority[p[0]]))` | `{'high': 2, 'medium': 3, 'low': 1}` |
| 15 | Numeric value of string keys | `{"100": "a", "2": "b", "10": "c"}` | `dict(sorted(data.items(), key=lambda p: int(p[0])))` | `{'2': 'b', '10': 'c', '100': 'a'}` |
| 16 | Key length, then alphabetical ignoring case | `{"dog": 1, "apple": 2, "Ant": 3, "cat": 4}` | `dict(sorted(data.items(), key=lambda p: (len(p[0]), p[0].lower())))` | `{'Ant': 3, 'cat': 4, 'dog': 1, 'apple': 2}` |
| 17 | Value: smallest first | `{"apple": 30, "banana": 10, "fig": 20}` | `dict(sorted(data.items(), key=lambda p: p[1]))` | `{'banana': 10, 'fig': 20, 'apple': 30}` |
| 18 | Value: largest first | `{"apple": 30, "banana": 10, "fig": 20}` | `dict(sorted(data.items(), key=lambda p: p[1], reverse=True))` | `{'apple': 30, 'fig': 20, 'banana': 10}` |
| 19 | Value, then key ignoring case | `{"banana": 10, "apple": 10, "fig": 5}` | `dict(sorted(data.items(), key=lambda p: (p[1], p[0].lower())))` | `{'fig': 5, 'apple': 10, 'banana': 10}` |

</details>

**56.** How do you sort a list of dictionaries by accuracy (highest first) and return only the model names?

<details>
<summary>Answer</summary>

Sort with `key` and `reverse=True`, then pick out each name with a list comprehension.

```python
models = [{"name": "svm", "accuracy": 0.82},
          {"name": "rf",  "accuracy": 0.91},
          {"name": "lr",  "accuracy": 0.78}]

ranked = sorted(models, key=lambda m: m["accuracy"], reverse=True)
[m["name"] for m in ranked]    # ['rf', 'svm', 'lr']
```

</details>

**57.** Why is `reverse=True` used while sorting?

<details>
<summary>Answer</summary>

Sorting is smallest-first and A to Z by default. `reverse=True` flips it to largest-first and Z to A, for example the highest accuracy at the top.

```python
sorted([3, 1, 2])                 # [1, 2, 3]
sorted([3, 1, 2], reverse=True)   # [3, 2, 1]

sorted(["cat", "apple", "dog"])                 # ['apple', 'cat', 'dog']
sorted(["cat", "apple", "dog"], reverse=True)   # ['dog', 'cat', 'apple']
```

Uppercase letters sort before lowercase, so with mixed case use `key=str.lower`:

```python
sorted(["apple", "Banana", "cherry"], reverse=True)                  # ['cherry', 'apple', 'Banana']
sorted(["apple", "Banana", "cherry"], key=str.lower, reverse=True)   # ['cherry', 'Banana', 'apple']
```

</details>

**58.** How do you sort a list by: (1) fewest vowels, (2) fewest digits, (3) words containing "py" first, ignoring case, (4) length, then alphabetical ignoring case?

<details>
<summary>Answer</summary>

`words = ["Python", "java", "a12", "Pytorch", "go3"]`

| Task | Code | Output |
|---|---|---|
| Fewest vowels | `sorted(words, key=lambda w: sum(c in "aeiou" for c in w.lower()))` | `['Python', 'a12', 'Pytorch', 'go3', 'java']` |
| Fewest digits | `sorted(words, key=lambda w: sum(c.isdigit() for c in w))` | `['Python', 'java', 'Pytorch', 'go3', 'a12']` |
| "py" first | `sorted(words, key=lambda w: "py" not in w.lower())` | `['Python', 'Pytorch', 'java', 'a12', 'go3']` |
| Length, then A–Z | `sorted(words, key=lambda w: (len(w), w.lower()))` | `['a12', 'go3', 'java', 'Python', 'Pytorch']` |

Ties keep their original order because Python's sort is stable.

</details>

**59.** How do you sort a dictionary by its keys using the same four rules?

<details>
<summary>Answer</summary>

`data = {"Python": 1, "java": 2, "a12": 3, "Pytorch": 4, "go3": 5}`

| Task | Code | Output |
|---|---|---|
| Fewest vowels | `dict(sorted(data.items(), key=lambda p: sum(c in "aeiou" for c in p[0].lower())))` | `{'Python': 1, 'a12': 3, 'Pytorch': 4, 'go3': 5, 'java': 2}` |
| Fewest digits | `dict(sorted(data.items(), key=lambda p: sum(c.isdigit() for c in p[0])))` | `{'Python': 1, 'java': 2, 'Pytorch': 4, 'go3': 5, 'a12': 3}` |
| "py" first | `dict(sorted(data.items(), key=lambda p: "py" not in p[0].lower()))` | `{'Python': 1, 'Pytorch': 4, 'java': 2, 'a12': 3, 'go3': 5}` |
| Length, then A–Z | `dict(sorted(data.items(), key=lambda p: (len(p[0]), p[0].lower())))` | `{'a12': 3, 'go3': 5, 'java': 2, 'Python': 1, 'Pytorch': 4}` |

</details>

### Sorting by multiple criteria (60–67)

The key returns a tuple, so Python compares the first item, then the second if they tie, and so on.

| You want | Write in the tuple |
|---|---|
| Smallest number first, or A to Z | `x["price"]` |
| Largest number first | `-x["marks"]` |
| `True` values first | `not x["in_stock"]` |
| Your own order | a position from a dict, such as `order[x["status"]]` |

**60.** Student leaderboard: highest marks first, then fastest time, then name A to Z?

<details>
<summary>Answer</summary>

```python
students = [{"name": "Asha", "marks": 90, "time": 30},
            {"name": "Ben",  "marks": 95, "time": 40},
            {"name": "Cara", "marks": 90, "time": 25},
            {"name": "Dev",  "marks": 90, "time": 30}]

sorted(students, key=lambda s: (-s["marks"], s["time"], s["name"]))
# Order: Ben, Cara, Asha, Dev
```

</details>

**61.** Product listings: in-stock first, then cheapest, then highest rated?

<details>
<summary>Answer</summary>

```python
products = [{"name": "Pen", "in_stock": False, "price": 10, "rating": 4.5},
            {"name": "Bag", "in_stock": True,  "price": 50, "rating": 4.0},
            {"name": "Cap", "in_stock": True,  "price": 20, "rating": 4.1},
            {"name": "Mug", "in_stock": True,  "price": 20, "rating": 4.8}]

sorted(products, key=lambda p: (not p["in_stock"], p["price"], -p["rating"]))
# Order: Mug, Cap, Bag, Pen
```

</details>

**62.** Support tickets: urgent first, then most severe, then oldest?

<details>
<summary>Answer</summary>

ISO dates like `"2026-01-01"` sort correctly as text, so the oldest comes first without any change.

```python
tickets = [{"id": 1, "urgent": False, "severity": 3, "created": "2026-01-05"},
           {"id": 2, "urgent": True,  "severity": 2, "created": "2026-01-03"},
           {"id": 3, "urgent": True,  "severity": 3, "created": "2026-01-04"},
           {"id": 4, "urgent": True,  "severity": 3, "created": "2026-01-01"}]

sorted(tickets, key=lambda t: (not t["urgent"], -t["severity"], t["created"]))
# Order of ids: 4, 3, 2, 1
```

</details>

**63.** Employee directory: department A to Z, then last name, then first name?

<details>
<summary>Answer</summary>

All three go A to Z, so a plain tuple works.

```python
employees = [{"dept": "Sales", "last": "Rao",  "first": "Mira"},
             {"dept": "HR",    "last": "Shah", "first": "Nia"},
             {"dept": "Sales", "last": "Rao",  "first": "Amit"},
             {"dept": "Sales", "last": "Khan", "first": "Zoya"}]

sorted(employees, key=lambda e: (e["dept"], e["last"], e["first"]))
# Order: Nia Shah (HR), Zoya Khan, Amit Rao, Mira Rao (Sales)
```

</details>

**64.** Trip recommendations: highest rating first, then cheapest, then shortest?

<details>
<summary>Answer</summary>

```python
trips = [{"name": "Goa",  "rating": 4.5, "price": 300, "days": 5},
         {"name": "Rome", "rating": 4.8, "price": 900, "days": 7},
         {"name": "Bali", "rating": 4.5, "price": 300, "days": 3},
         {"name": "Oslo", "rating": 4.5, "price": 200, "days": 6}]

sorted(trips, key=lambda t: (-t["rating"], t["price"], t["days"]))
# Order: Rome, Oslo, Bali, Goa
```

</details>

**65.** Search results: exact matches first, then highest score, then title A to Z?

<details>
<summary>Answer</summary>

```python
results = [{"title": "Beta",  "exact": False, "score": 0.9},
           {"title": "Zed",   "exact": True,  "score": 0.7},
           {"title": "Alpha", "exact": True,  "score": 0.7},
           {"title": "Core",  "exact": True,  "score": 0.8}]

sorted(results, key=lambda r: (not r["exact"], -r["score"], r["title"]))
# Order: Core, Alpha, Zed, Beta
```

</details>

**66.** Orders: newest first, then largest order ID?

<details>
<summary>Answer</summary>

Both rules go highest first, and you can't put a minus sign on a date string, so use `reverse=True` for the whole tuple.

```python
orders = [{"id": 101, "date": "2026-03-01"},
          {"id": 105, "date": "2026-03-02"},
          {"id": 103, "date": "2026-03-02"}]

sorted(orders, key=lambda o: (o["date"], o["id"]), reverse=True)
# Order of ids: 105, 103, 101
```

</details>

**67.** Task queue: blocked, in progress, to do, then completed, with the earliest due date first in each status?

<details>
<summary>Answer</summary>

Give each status a position number in a dict, then sort by that number.

```python
order = {"blocked": 0, "in_progress": 1, "todo": 2, "done": 3}

tasks = [{"name": "A", "status": "done",        "due": "2026-01-01"},
         {"name": "B", "status": "todo",        "due": "2026-02-01"},
         {"name": "C", "status": "blocked",     "due": "2026-03-01"},
         {"name": "D", "status": "todo",        "due": "2026-01-15"},
         {"name": "E", "status": "in_progress", "due": "2026-01-20"}]

sorted(tasks, key=lambda t: (order[t["status"]], t["due"]))
# Order: C, E, D, B, A
```

</details>

### Dictionaries and lists

**68.** If you add keys in the order `"z"`, `"a"`, `"m"`, what order do you see when printing, and after sorting?

<details>
<summary>Answer</summary>

Printing shows insertion order. Dictionaries keep insertion order, which is not the same as sorted order.

```python
d = {}
d["z"] = 1; d["a"] = 2; d["m"] = 3
list(d)     # ['z', 'a', 'm']
sorted(d)   # ['a', 'm', 'z']
```

</details>

**69.** What is the time complexity of iterating, inserting, and deleting in a list and a dictionary?

<details>
<summary>Answer</summary>

| Structure | Operation | Average | Worst | Why |
|---|---|---|---|---|
| List | Iterate | O(n) | O(n) | Visits every item |
| List | Insert at end (`append`) | O(1) | O(n) | Occasionally resizes |
| List | Insert at beginning or middle | O(n) | O(n) | Later items shift right |
| List | Delete at end (`pop()`) | O(1) | O(1) | Nothing shifts |
| List | Delete at beginning or middle | O(n) | O(n) | Later items shift left |
| Dict | Iterate | O(n) | O(n) | Visits every entry |
| Dict | Insert by key | O(1) | O(n) | Hash lookup; collisions or a resize are slower |
| Dict | Delete by key | O(1) | O(n) | Hash lookup; collisions are slower |

</details>

**70.** Why can't a list be a dictionary key?

<details>
<summary>Answer</summary>

A list can change, so its hash wouldn't stay stable, and Python makes lists unhashable. Use a tuple instead.

```python
{[1, 2]: "x"}    # TypeError: unhashable type: 'list'
{(1, 2): "x"}    # OK
```

</details>

**71.** How do you create a dictionary from different kinds of input?

<details>
<summary>Answer</summary>

| Input | Code | Result |
|---|---|---|
| Known keys and values | `{"a": 1, "b": 2}` | `{'a': 1, 'b': 2}` |
| Named arguments | `dict(a=1, b=2)` | `{'a': 1, 'b': 2}` |
| Key-value pairs | `dict([("a", 1), ("b", 2)])` | `{'a': 1, 'b': 2}` |
| Two lists | `dict(zip(["a", "b"], [1, 2]))` | `{'a': 1, 'b': 2}` |
| Keys sharing a default | `dict.fromkeys(["a", "b"], 0)` | `{'a': 0, 'b': 0}` |
| Positions as keys | `dict(enumerate(["x", "y"]))` | `{0: 'x', 1: 'y'}` |
| `key=value` string | `dict(p.split("=") for p in "a=1,b=2".split(","))` | `{'a': '1', 'b': '2'}` |
| JSON string | `json.loads('{"a": 1}')` | `{'a': 1}` |
| Items to count | `dict(Counter(["cat", "dog", "cat"]))` | `{'cat': 2, 'dog': 1}` |
| Two dictionaries | `{"a": 1} \| {"b": 2}` | `{'a': 1, 'b': 2}` |

`Counter` comes from `collections`, and `|` on dictionaries needs Python 3.9+.

</details>

**72.** How do you use a dictionary comprehension to give each key its own empty list?

<details>
<summary>Answer</summary>

```python
keys = ["train", "test"]
{key: [] for key in keys}    # {'train': [], 'test': []}
```

Avoid `dict.fromkeys(keys, [])`: every key would share the same list.

</details>

**73.** How do you make each number a key and its square the value?

<details>
<summary>Answer</summary>

```python
numbers = [1, 2, 3]
{n: n ** 2 for n in numbers}    # {1: 1, 2: 4, 3: 9}
```

</details>

**74.** How do you make each word a key and its length the value?

<details>
<summary>Answer</summary>

```python
words = ["cat", "horse"]
{w: len(w) for w in words}    # {'cat': 3, 'horse': 5}
```

</details>

**75.** How do you make each user's ID a key and the full user dictionary the value?

<details>
<summary>Answer</summary>

This lets you find a user directly by ID instead of searching the list.

```python
users = [{"id": 1, "name": "Asha"}, {"id": 2, "name": "Ben"}]
{u["id"]: u for u in users}
# {1: {'id': 1, 'name': 'Asha'}, 2: {'id': 2, 'name': 'Ben'}}
```

</details>

**76.** How do you keep only the entries with scores of 60 or higher?

<details>
<summary>Answer</summary>

```python
scores = {"asha": 75, "ben": 40, "cara": 60}
{name: s for name, s in scores.items() if s >= 60}
# {'asha': 75, 'cara': 60}
```

</details>

**77.** How do you create a list from different kinds of data?

<details>
<summary>Answer</summary>

| Input | Code | Result |
|---|---|---|
| Individual values | `[1, 2, 3]` | `[1, 2, 3]` |
| Tuple | `list((1, 2))` | `[1, 2]` |
| String | `list("hi")` | `['h', 'i']` |
| Dictionary | `list({"a": 1})` | `['a']` (keys only) |
| Set | `list({1, 2})` | `[1, 2]` (order not guaranteed) |
| Range | `list(range(3))` | `[0, 1, 2]` |
| Two lists | `[1, 2] + [3]` | `[1, 2, 3]` |
| JSON array | `json.loads("[1, 2]")` | `[1, 2]` |

</details>

**78.** Using a list comprehension, how do you convert comma-separated text to integers, extract a field from dictionaries, and keep only items that meet a condition?

<details>
<summary>Answer</summary>

```python
[int(n) for n in "1,2,3".split(",")]     # [1, 2, 3]

users = [{"name": "Asha"}, {"name": "Ben"}]
[u["name"] for u in users]               # ['Asha', 'Ben']

[n for n in [1, 5, 8] if n > 3]          # [5, 8]
```

</details>

**79.** How do you remove duplicate labels and return them sorted alphabetically?

<details>
<summary>Answer</summary>

```python
labels = ["dog", "cat", "dog", "bird"]
sorted(set(labels))    # ['bird', 'cat', 'dog']
```

</details>

**80.** How do you keep only the models with 90% accuracy or higher, using a dictionary comprehension?

<details>
<summary>Answer</summary>

Add an `if` at the end to filter entries.

```python
models = {"rf": 0.93, "svm": 0.85, "gbm": 0.90}
{name: acc for name, acc in models.items() if acc >= 0.90}
# {'rf': 0.93, 'gbm': 0.9}
```

</details>

**81.** How do you map each class label to a numeric ID starting at 0?

<details>
<summary>Answer</summary>

```python
labels = ["cat", "dog", "bird"]
{label: i for i, label in enumerate(labels)}
# {'cat': 0, 'dog': 1, 'bird': 2}
```

</details>

**82.** How do you build a dictionary from an iterable?

<details>
<summary>Answer</summary>

Use `{key: value for item in iterable}`, or `dict()` if the iterable already holds pairs.

```python
{c: ord(c) for c in "ab"}           # {'a': 97, 'b': 98}
dict([("a", 1), ("b", 2)])          # {'a': 1, 'b': 2}
```

</details>

### enumerate, zip, and unpacking

**83.** How do you use `enumerate()` to print each feature with its position, starting at 1?

<details>
<summary>Answer</summary>

```python
features = ["age", "income"]
for position, feature in enumerate(features, start=1):
    print(position, feature)
# 1 age
# 2 income
```

</details>

**84.** Why use `strict=True` with `zip()`, and what happens if the inputs have different lengths?

<details>
<summary>Answer</summary>

Normally `zip()` silently stops at the shortest input, which can hide lost data. With `strict=True` (Python 3.10+), `list()` raises a `ValueError` instead.

```python
list(zip([1, 2, 3], ["a", "b"]))
# [(1, 'a'), (2, 'b')]: the 3 is silently lost

list(zip([1, 2, 3], ["a", "b"], strict=True))
# ValueError: zip() argument 2 is shorter than argument 1
```

</details>

**85.** How do you separate a list of `(name, score)` pairs into two tuples with `zip()`?

<details>
<summary>Answer</summary>

`*` passes each pair to `zip()` as a separate argument, so `zip()` groups the first items together and the second items together.

```python
pairs = [("asha", 90), ("ben", 80)]
names, scores = zip(*pairs)
# names = ('asha', 'ben'), scores = (90, 80)
```

</details>

**86.** How do you get a tuple of names and a tuple of scores from a dictionary with `zip()`?

<details>
<summary>Answer</summary>

`.items()` gives `(key, value)` pairs, so it works the same way as Q85.

```python
data = {"asha": 90, "ben": 80}
names, scores = zip(*data.items())
# names = ('asha', 'ben'), scores = (90, 80)
```

</details>

**87.** How do you extract `(name, score)` pairs from a list of dictionaries and separate them into two tuples?

<details>
<summary>Answer</summary>

```python
records = [{"name": "asha", "score": 90}, {"name": "ben", "score": 80}]
pairs = [(r["name"], r["score"]) for r in records]
names, scores = zip(*pairs)
# names = ('asha', 'ben'), scores = (90, 80)
```

</details>

**88.** How do you convert a tuple into a list?

<details>
<summary>Answer</summary>

```python
list((1, 2, 3))    # [1, 2, 3]
```

</details>

**89.** In one line, how do you put all the first items of a list of pairs into one list and all the second items into another?

<details>
<summary>Answer</summary>

`zip(*pairs)` gives tuples, and `map(list, ...)` turns each one into a list.

```python
pairs = [("asha", 90), ("ben", 80)]
names, scores = map(list, zip(*pairs))
# names = ['asha', 'ben'], scores = [90, 80]
```

</details>

**90.** How do you write a function that accepts any number of positional and keyword arguments, and returns them as a list and a dictionary?

<details>
<summary>Answer</summary>

`*args` collects positional arguments into a tuple. `**kwargs` collects keyword arguments into a dictionary.

```python
def collect(*args, **kwargs):
    return list(args), kwargs

collect(1, 2, lr=0.1, epochs=5)
# ([1, 2], {'lr': 0.1, 'epochs': 5})
```

</details>

**91.** When would you use `*args` and `**kwargs` instead of passing a list and a dictionary?

<details>
<summary>Answer</summary>

Use them when callers naturally write separate values, or when a wrapper or decorator forwards unknown arguments to another function. Pass a list or dictionary when the data is already one collection.

```python
print(1, 2, 3)                # separate values: *args style
total = sum([1, 2, 3])        # one collection: pass the list

def timed(func, *args, **kwargs):
    return func(*args, **kwargs)    # forwards whatever it receives
```

</details>

**92.** How do you unpack positional and keyword arguments when calling a function?

<details>
<summary>Answer</summary>

`*` unpacks a list or tuple into positional arguments. `**` unpacks a dictionary into keyword arguments.

```python
def train(x, y, lr, epochs):
    ...

data = [1, 2]
settings = {"lr": 0.1, "epochs": 5}
train(*data, **settings)    # same as train(1, 2, lr=0.1, epochs=5)
```

</details>

**93.** Why unpack training data and settings when calling an ML model's `fit()`, and how does it help with experiments?

<details>
<summary>Answer</summary>

Data and settings stay in their own variables, so each experiment only changes a settings dictionary and the `fit()` line stays the same.

```python
train_data = (X_train, y_train)
experiments = [{"epochs": 5, "batch_size": 32},
               {"epochs": 10, "batch_size": 64}]

for settings in experiments:
    model = build_model()
    model.fit(*train_data, **settings)
```

Here `build_model()` is your own function that returns a new model, as in Keras.

</details>

### Merging and safe dictionary access

**94.** How do you merge two dictionaries?

<details>
<summary>Answer</summary>

```python
a = {"x": 1, "y": 2}
b = {"y": 9, "z": 3}

a | b          # {'x': 1, 'y': 9, 'z': 3}  new dict (Python 3.9+)
{**a, **b}     # {'x': 1, 'y': 9, 'z': 3}  new dict
a.update(b)    # changes a in place
```

</details>

**95.** When two dictionaries share a key, which value is kept and where does the key sit? And how do you raise an error if any key appears in both?

<details>
<summary>Answer</summary>

The **right** dictionary's value wins. The shared key stays in its original position, and new keys go at the end.

```python
{"x": 1, "y": 2} | {"y": 9, "z": 3}
# {'x': 1, 'y': 9, 'z': 3}: y keeps its place with the new value
```

To merge only when no keys are shared, check the common keys first:

```python
def strict_merge(a, b):
    common = a.keys() & b.keys()
    if common:
        raise ValueError(f"Duplicate keys: {sorted(common)}")
    return a | b
```

</details>

**96.** Can `dict | list` work?

<details>
<summary>Answer</summary>

No. Both sides of `|` must be dictionaries, so convert the list of pairs first.

```python
{"a": 1} | [("b", 2)]          # TypeError: unsupported operand type(s) for |: 'dict' and 'list'
{"a": 1} | dict([("b", 2)])    # {'a': 1, 'b': 2}
```

The in-place form is different: `d |= [("b", 2)]` does work with a list of pairs.

</details>

**97.** What happens if you use `dictionary[key]` with a key that doesn't exist?

<details>
<summary>Answer</summary>

Python raises a `KeyError`.

```python
{"a": 1}["z"]    # KeyError: 'z'
```

</details>

**98.** How do you safely access a key that might be missing? When do you use `get()`, `in`, or `try/except`?

<details>
<summary>Answer</summary>

| Method | Style | Use when | Example |
|---|---|---|---|
| `get()` | Default value: no check needed | The key is optional and a default is fine | `d.get("age", 0)` |
| `in` | LBYL: "Look Before You Leap" (check first) | You need different logic if the key is present | `if "age" in d: ...` |
| `try/except KeyError` | EAFP: "Easier to Ask Forgiveness than Permission" (try first, handle the error) | The key should exist, so missing is unusual | `try: d["age"]`<br>`except KeyError: ...` |

`d.get("age")` returns `None` both when the key is missing and when its stored value is `None`. Use `in` to tell them apart.

</details>

### OOP

#### Classes and objects

**99.** What are the four pillars of OOP?

<details>
<summary>Answer</summary>

| Pillar | Meaning | Python example |
|---|---|---|
| Encapsulation | Keep data and the methods that use it together, and control access | `_name`, `@property` |
| Abstraction | Show what an object does and hide how | `abc.ABC`, `@abstractmethod` |
| Inheritance | Reuse and extend a base class | `class Classifier(Model)` |
| Polymorphism | The same call works on different types | `model.predict(x)` on any model |

</details>

**100.** What is the difference between a class and an object?

<details>
<summary>Answer</summary>

A **class** is the blueprint that defines attributes and methods. An **object** (instance) is one thing built from it, with its own data.

```python
class Model:
    def __init__(self, name):
        self.name = name

first = Model("rf")     # one object
second = Model("svm")   # another object from the same class
```

</details>

**101.** What is `__init__`, and what does `self` do?

<details>
<summary>Answer</summary>

`__init__` initializes an instance after it has been created. Python calls it automatically. `self` is the instance being initialized. It's a naming convention, not a keyword.

```python
class Model:
    def __init__(self, name, learning_rate=0.01):
        self.name = name
        self.learning_rate = learning_rate
        self.metrics = {}    # each instance gets its own dict
```

</details>

**102.** What is the difference between `__new__` and `__init__`?

<details>
<summary>Answer</summary>

| Method | Role |
|---|---|
| `__new__` | Creates and returns the instance |
| `__init__` | Initializes an instance that already exists |

`__init__` is often called a constructor, but strictly `__new__` constructs and `__init__` initializes. If `__new__` returns an object that isn't an instance of the class, `__init__` is skipped.

</details>

**103.** Can `__init__` return a value?

<details>
<summary>Answer</summary>

No. It must return `None`, otherwise Python raises a `TypeError`.

```python
class Invalid:
    def __init__(self):
        return 10

# Invalid()  # TypeError: __init__() should return None, not 'int'
```

</details>

**104.** Is `__init__` required, and is it inherited?

<details>
<summary>Answer</summary>

It's optional. A class without one inherits it from its parent, and ultimately from `object`. If a subclass defines its own `__init__`, the parent's isn't called automatically, so call `super().__init__(...)`.

</details>

**105.** What is the difference between a class attribute and an instance attribute?

<details>
<summary>Answer</summary>

A **class attribute** lives on the class and is shared by all instances. An **instance attribute** lives on one object. Assigning through `self` creates an instance attribute, even when a class attribute has the same name.

```python
class Model:
    count = 0          # class attribute
    tags = []          # shared by every instance: usually a bug

    def __init__(self):
        self.metrics = {}   # instance attribute

a = Model()
a.count += 1
print(a.count, Model.count)   # 1 0: a now has its own count
```

</details>

**106.** What is the difference between instance, class, and static methods?

<details>
<summary>Answer</summary>

| Method | Receives first | Typical purpose |
|---|---|---|
| Instance method | `self`: the instance | Read or change instance state |
| Class method | `cls`: the class | Alternative constructors, class-level data |
| Static method | Nothing extra | A related helper needing neither |

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
```

</details>

**107.** Why does an alternative constructor use `cls(...)`, and how do you choose a method type?

<details>
<summary>Answer</summary>

`cls(...)` builds the class it was called on, so a subclass gets instances of itself.

```python
class AdvancedConfig(ModelConfig):
    pass

print(type(AdvancedConfig.from_dict({"learning_rate": 0.02})).__name__)
# AdvancedConfig
```

| The method needs... | Use |
|---|---|
| Data from a specific instance | Instance method |
| To create instances, or use class-level data | Class method |
| Only its explicit arguments | Static method or module-level function |

</details>

#### Encapsulation and polymorphism

**108.** How does Python handle encapsulation? What do `_name` and `__name` mean?

<details>
<summary>Answer</summary>

Python has no truly private attributes. It uses conventions:

| Form | Meaning |
|---|---|
| `name` | Public |
| `_name` | Internal by convention, not enforced |
| `__name` | Name mangling: stored as `_ClassName__name`, which avoids clashes in subclasses |

```python
class Account:
    def __init__(self):
        self.__balance = 100

account = Account()
# account.__balance             # AttributeError
print(account._Account__balance)  # 100: still reachable
```

</details>

**109.** What is `@property`, and why use it?

<details>
<summary>Answer</summary>

`@property` lets a method be read like an attribute. Add a setter to validate values, without changing how callers use the attribute.

```python
class Model:
    def __init__(self, rate):
        self.rate = rate

    @property
    def rate(self):
        return self._rate

    @rate.setter
    def rate(self, value):
        if value <= 0:
            raise ValueError("rate must be positive")
        self._rate = value
```

</details>

**110.** What is polymorphism and duck typing?

<details>
<summary>Answer</summary>

**Polymorphism** means the same operation works on different types. **Duck typing** means Python checks whether an object has the needed behaviour, not its class: if it has `predict()`, you can call it.

```python
class Tree:
    def predict(self):
        return "tree"

class Net:
    def predict(self):
        return "net"

print([model.predict() for model in (Tree(), Net())])  # ['tree', 'net']
```

Python has no method overloading by signature: a second `def` with the same name replaces the first. Use default arguments or `*args`.

</details>

**111.** What is an abstract class, and how do you create one?

<details>
<summary>Answer</summary>

An abstract class defines an interface that subclasses must implement. You can't instantiate it until all its abstract methods are implemented.

```python
from abc import ABC, abstractmethod

class BaseModel(ABC):
    @abstractmethod
    def predict(self, x):
        ...

class Doubler(BaseModel):
    def predict(self, x):
        return x * 2

# BaseModel()  # TypeError: Can't instantiate abstract class
print(Doubler().predict(2))  # 4
```

</details>

#### Inheritance

**112.** Explain inheritance, method overriding, and `super()`.

<details>
<summary>Answer</summary>

**Inheritance** reuses behaviour from a base class. **Overriding** defines a method with the same name in the subclass. **`super()`** reaches the next implementation in the MRO.

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
        return f"{super().describe()}; classes: {self.classes}"
```

Python matches overrides by name only and doesn't check signatures. Every class ultimately inherits from `object`.

</details>

**113.** Why use `super()` over `Model.method(self)`, and `isinstance()` over `type() is`?

<details>
<summary>Answer</summary>

`super()` follows the MRO, so it supports cooperative multiple inheritance. A hardcoded parent name can skip classes or call one twice.

`isinstance(obj, Model)` also accepts subclasses, while `type(obj) is Model` only matches the exact class.

</details>

**114.** When should you prefer composition over inheritance?

<details>
<summary>Answer</summary>

Inheritance models **is-a** (a `Classifier` is a `Model`). Composition models **has-a** (a `Pipeline` has a scaler) and is usually simpler when one object just uses another.

```python
class Pipeline:
    def __init__(self, scaler):
        self.scaler = scaler    # has-a: easy to swap

    def run(self, values):
        return self.scaler.transform(values)
```

Use inheritance for a real, shallow, stable hierarchy. Use composition to swap components and avoid fragile deep hierarchies.

</details>

**115.** What is multiple inheritance and MRO? Explain the diamond problem.

<details>
<summary>Answer</summary>

**Multiple inheritance** means a class has more than one base. The **MRO** is the order Python searches classes, built with **C3 linearization**. Inspect it with `Cls.__mro__` or `Cls.mro()`.

In a **diamond**, two bases share an ancestor. The ancestor appears once in the MRO, so cooperative `super()` visits each class once.

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

D().process()   # D B C A (one per line)
print([cls.__name__ for cls in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']
```

`super()` in `B` reaches `C`, not `A`, because it means the next class in `type(self)`'s MRO, not the direct parent.

</details>

**116.** What is a mixin, and how do you use multiple inheritance safely?

<details>
<summary>Answer</summary>

A mixin is a small class that adds one behaviour, such as logging. List mixins **before** the main base, so their `super()` call can wrap it.

```python
class Model:
    def predict(self, x):
        return x * 2

class TimingMixin:
    def predict(self, x):
        return f"predicted {super().predict(x)}"

class TimedModel(TimingMixin, Model):
    pass

class WrongOrder(Model, TimingMixin):
    pass

print(TimedModel().predict(3))  # predicted 6
print(WrongOrder().predict(3))  # 6: the mixin never runs
```

Keep mixins small with no heavy `__init__`, and prefer composition when there's no real is-a relationship.

</details>

**117.** How does cooperative `__init__` work, and when can't Python build an MRO?

<details>
<summary>Answer</summary>

Each class takes its own arguments and forwards the rest with `**kwargs`, so every `__init__` runs once.

```python
class Base:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

class Named(Base):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name
```

Python raises `TypeError` when the listed base order contradicts the hierarchy, for example `class X(A, B)` where `B` is a subclass of `A`.

</details>

#### Dunder methods and dataclasses

**118.** What are dunder (magic) methods? Give common examples.

<details>
<summary>Answer</summary>

Special methods named `__name__` that Python calls for built-in operations.

| Method | Triggered by |
|---|---|
| `__init__` | Creating an instance |
| `__str__` | `str()`, `print()`, f-strings |
| `__repr__` | `repr()`, the REPL, containers |
| `__len__` | `len(obj)`: must return a non-negative int |
| `__call__` | `obj(...)` |
| `__iter__` | `iter(obj)`, `for` loops |
| `__getitem__` | `obj[key]` |
| `__eq__`, `__lt__`, `__add__` | `==`, `<`, `+` |
| `__enter__`, `__exit__` | `with` |

Use `len(obj)`, not `obj.__len__()`. Implicit lookup uses the class, so attaching `__len__` to an instance doesn't work.

</details>

**119.** What is the difference between `__str__` and `__repr__`?

<details>
<summary>Answer</summary>

`__str__` is the readable text for users. `__repr__` is the developer view, ideally showing how to recreate the object. If only `__repr__` exists, `print()` uses it, so define `__repr__` first.

```python
class Dataset:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Dataset {self.name}"

    def __repr__(self):
        return f"Dataset(name={self.name!r})"

print(str(Dataset("train")))     # Dataset train
print(repr(Dataset("train")))    # Dataset(name='train')
print([Dataset("train")])        # [Dataset(name='train')]
```

</details>

**120.** What happens to `__hash__` when you define `__eq__`?

<details>
<summary>Answer</summary>

Defining `__eq__` without `__hash__` sets `__hash__` to `None`, so instances become unhashable. This stops equal objects from having different hashes. Define `__hash__` from the same fields used for equality.

```python
class Label:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, Label) and self.name == other.name

    def __hash__(self):
        return hash(self.name)

print(len({Label("cat"), Label("cat")}))  # 1
```

</details>

**121.** What is operator overloading? What should a method return for unsupported types?

<details>
<summary>Answer</summary>

Defining dunder methods so operators work on your objects. Return `NotImplemented` for unsupported types, so Python can try the other operand and then raise `TypeError`.

```python
class Vector:
    def __init__(self, x):
        self.x = x

    def __add__(self, other):
        if not isinstance(other, Vector):
            return NotImplemented
        return Vector(self.x + other.x)

print((Vector(1) + Vector(2)).x)  # 3
```

</details>

**122.** What are dataclasses, and why are they useful?

<details>
<summary>Answer</summary>

`@dataclass` uses annotated fields to generate methods, which cuts boilerplate for classes that mainly store data. It generates `__init__`, `__repr__`, and `__eq__` by default. Add `order=True` for `<` and `>`.

```python
from dataclasses import dataclass, field

@dataclass
class ModelConfig:
    name: str
    learning_rate: float = 0.01
    features: list[str] = field(default_factory=list)

print(ModelConfig("rf") == ModelConfig("rf"))  # True
```

</details>

**123.** How do you set mutable defaults and validate values in a dataclass?

<details>
<summary>Answer</summary>

`features: list = []` raises `ValueError` at class definition. Use `field(default_factory=list)` so each instance gets its own list.

Annotations aren't enforced at runtime, so validate in `__post_init__`, which the generated `__init__` calls.

```python
from dataclasses import dataclass

@dataclass
class TrainingConfig:
    epochs: int

    def __post_init__(self):
        if self.epochs <= 0:
            raise ValueError("epochs must be positive")
```

</details>

**124.** What does `frozen=True` do? Is a default dataclass hashable?

<details>
<summary>Answer</summary>

`frozen=True` blocks field assignment with `FrozenInstanceError`, but it isn't deep immutability: a list stored in a field can still change.

A default dataclass isn't hashable, because `eq=True` without `frozen` sets `__hash__` to `None`. A frozen one is hashable.

</details>

**125.** What do `__slots__`, `slots=True`, and `kw_only=True` do? When do you use a dataclass vs the alternatives?

<details>
<summary>Answer</summary>

`__slots__` (or `slots=True`, Python 3.10+) replaces the per-instance `__dict__`: lower memory, and typos raise errors instead of creating attributes. `kw_only=True` forces keyword arguments.

| Choose | When |
|---|---|
| Plain class | Behaviour-heavy objects |
| `typing.NamedTuple` | Immutable, tuple-like records |
| Dataclass | Data containers with generated methods |
| Pydantic model | External data needing runtime validation |

A variable annotated with `typing.ClassVar` isn't treated as a dataclass field.

</details>

### Functions, Decorators and Generators

#### Functions

**126.** What are first-class and higher-order functions? Explain `map`, `filter`, and `reduce`.

<details>
<summary>Answer</summary>

Functions are objects: you can store them, pass them, and return them. A **higher-order** function takes or returns a function.

```python
from functools import reduce

nums = [1, 2, 3, 4]
print(list(map(lambda n: n * 2, nums)))        # [2, 4, 6, 8]
print(list(filter(lambda n: n % 2 == 0, nums)))  # [2, 4]
print(reduce(lambda a, b: a + b, nums))        # 10
```

`map` and `filter` are lazy. Comprehensions are usually more readable.

</details>

**127.** What kinds of function parameters does Python have?

<details>
<summary>Answer</summary>

```python
def fit(data, /, epochs=10, *args, lr=0.1, **kwargs):
    ...
```

| Part | Meaning |
|---|---|
| `data, /` | Positional-only |
| `epochs=10` | Positional or keyword, with a default |
| `*args` | Extra positional values, as a tuple |
| `lr=0.1` after `*` | Keyword-only |
| `**kwargs` | Extra keyword values, as a dict |

Python passes arguments by **object reference** (call by sharing): mutating an argument is visible to the caller, but rebinding it isn't.

</details>

**128.** Why are mutable default arguments risky?

<details>
<summary>Answer</summary>

Defaults are evaluated once, when the `def` runs, so every call shares the same object.

```python
def add(item, items=[]):
    items.append(item)
    return items

print(add(1), add(2))  # [1, 2] [1, 2]: same list

def add_safe(item, items=None):
    items = [] if items is None else items
    items.append(item)
    return items
```

</details>

**129.** What is a lambda, and when should you avoid it?

<details>
<summary>Answer</summary>

An anonymous function made from a single expression, whose value is returned automatically. Its best use is sorting keys and short callbacks.

```python
ranked = sorted(models, key=lambda model: model["accuracy"], reverse=True)
```

Avoid it when the logic needs several steps, a docstring, or a useful name in tracebacks. PEP 8 recommends `def` over `f = lambda x: ...`.

</details>

**130.** What are a lambda's limits? Is it faster than `def`?

<details>
<summary>Answer</summary>

It holds one expression, so no statements: only a conditional expression, and no `raise` or `try`. It can have defaults, `*args`, and `**kwargs`, and it captures outer variables. Its `__name__` is `<lambda>`.

It isn't faster: a lambda and an equivalent `def` compile to the same kind of function. It's a readability choice.

```python
grade = lambda s: "pass" if s >= 50 else "fail"
print(grade(60))  # pass
```

</details>

#### Closures

**131.** What is a closure?

<details>
<summary>Answer</summary>

A function that keeps access to variables from its enclosing function, even after that function has returned. It uses the **E** in LEGB. Values are held in cell objects in `function.__closure__`, which is `None` for a non-closure.

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

triple = make_multiplier(3)
print(triple(5))  # 15
print(triple.__closure__[0].cell_contents)  # 3
```

</details>

**132.** How do you keep state in a closure? When is `nonlocal` needed?

<details>
<summary>Answer</summary>

Use `nonlocal` to **reassign** an enclosing variable. Without it you get `UnboundLocalError`. It isn't needed for reading or for mutation such as `list.append()`.

```python
def make_counter():
    count = 0
    def increment():
        nonlocal count
        count += 1
        return count
    return increment

counter = make_counter()
print(counter(), counter())  # 1 2
```

</details>

**133.** What is late binding in closures, and how do you fix it?

<details>
<summary>Answer</summary>

A closure looks the variable up when it's **called**, not when it's created, so loop functions all see the final value.

```python
print([f() for f in [lambda: n for n in range(3)]])       # [2, 2, 2]
print([f() for f in [lambda n=n: n for n in range(3)]])   # [0, 1, 2]
```

Fix it with a default argument, a factory function, or `functools.partial`.

</details>

**134.** When is a class better than a closure? Where are closures used?

<details>
<summary>Answer</summary>

Closures power decorators, callbacks, function factories, and small state such as counters.

| Situation | Usually better |
|---|---|
| One behaviour with a little configuration | Closure |
| State callers need to inspect or reset | Class |
| Several operations on the same state | Class |
| Sending work to `multiprocessing` | Module-level function or class |

Nested functions can't be pickled, because pickle stores functions by importable name.

</details>

#### Decorators

**135.** What is a decorator, and how do you write one?

<details>
<summary>Answer</summary>

A callable that takes a function or class and returns its replacement. It adds behaviour without editing the function's body. Uses: logging, timing, caching, auth checks, and retries.

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
    return first + second

print(add(2, 3))
# Calling add
# Finished
# 5
```

`@log_call` is roughly `add = log_call(add)`. If the wrapper doesn't return the result, callers get `None`.

</details>

**136.** Why use `functools.wraps`?

<details>
<summary>Answer</summary>

Without it, the decorated function reports the wrapper's `__name__` and `__doc__`. `@wraps` copies that metadata and adds `__wrapped__`, a reference to the original function.

</details>

**137.** How do you write a decorator that takes arguments?

<details>
<summary>Answer</summary>

Add a third level: a factory that returns the real decorator. `@retry(attempts=3)` means `retry(attempts=3)(function)`.

```python
from functools import wraps

def retry(attempts):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            for attempt in range(1, attempts + 1):
                try:
                    return function(*args, **kwargs)
                except ConnectionError:
                    print(f"Attempt {attempt} failed")
            raise ConnectionError("All attempts failed")
        return wrapper
    return decorator
```

</details>

**138.** When does a decorator run? In what order do stacked decorators apply?

<details>
<summary>Answer</summary>

The decorator runs **once**, when the definition executes. The wrapper runs on **every call**.

Stacked decorators apply **bottom-up**, so the top wrapper runs first.

```python
@first
@second
def task(): ...
# Same as: task = first(second(task))
```

Plain wrappers don't suit async functions or generators, because they finish when the coroutine or generator is created, not when it runs.

</details>

**139.** Which built-in decorators should you know?

<details>
<summary>Answer</summary>

| Decorator | Purpose |
|---|---|
| `@property` | Read a method like an attribute |
| `@classmethod`, `@staticmethod` | Method types |
| `@functools.lru_cache` | Cache results by arguments |
| `@functools.wraps` | Keep function metadata |
| `@dataclass` | Generate class methods |
| `@functools.total_ordering` | Fill in comparison methods |
| `@abstractmethod` | Require a method in subclasses |

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci(n):
    return n if n < 2 else fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(30))  # 832040
```

</details>

**140.** What is the difference between a function decorator and a class decorator?

<details>
<summary>Answer</summary>

A **function decorator** receives a function and usually returns a wrapper. A **class decorator** receives a class and usually returns it after modifying or registering it. Both run when the definition executes, not per call or per instance.

```python
model_registry = {}

def register_model(cls):
    model_registry[cls.__name__] = cls
    return cls

@register_model
class SimpleModel:
    pass

print(list(model_registry))  # ['SimpleModel']
```

</details>

**141.** How do you write a decorator as a class? Why can it break methods?

<details>
<summary>Answer</summary>

Store the function in `__init__` and run it in `__call__`. Instances are handy for keeping state, such as a call count.

```python
class CountCalls:
    def __init__(self, function):
        self.function = function
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.function(*args, **kwargs)
```

On a method it breaks: without `__get__`, the instance isn't bound, so `self` isn't passed.

</details>

**142.** Class decorator vs inheritance vs metaclass: which do you choose? What is a metaclass?

<details>
<summary>Answer</summary>

A **metaclass** is the class of a class: it controls class creation. `type` is the default.

| Approach | Affects subclasses automatically? | Typical use |
|---|---|---|
| Class decorator | No | Explicit one-off change or registration |
| Base class with `__init_subclass__` | Yes | Register every subclass |
| Metaclass | Yes | Deep control, rarely needed |

```python
model_registry = {}

class BaseModel:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        model_registry[cls.__name__] = cls

class Forest(BaseModel):
    pass

print(list(model_registry))  # ['Forest']
```

</details>

#### Iterators and generators

**143.** What is the difference between an iterable and an iterator?

<details>
<summary>Answer</summary>

An **iterable** can give an iterator through `iter()`. An **iterator** produces values with `next()` and tracks its position. It has `__next__()`, and its `__iter__()` returns itself. It raises `StopIteration` at the end.

| Feature | Iterable (list) | Iterator (list iterator) |
|---|---|---|
| `iter(obj)` | A new iterator | The same iterator |
| `next(obj)` | Not supported | Supported |
| Second traversal | Starts again | Continues, so empty when exhausted |

Use `next(iterator, default)` to avoid catching `StopIteration`.

</details>

**144.** How does a `for` loop work internally?

<details>
<summary>Answer</summary>

```python
items = [1, 2]
iterator = iter(items)
while True:
    try:
        item = next(iterator)
    except StopIteration:
        break
    print(item)
```

</details>

**145.** How do you write a custom iterable and a custom iterator?

<details>
<summary>Answer</summary>

For a reusable iterable, `__iter__()` returns a **new** iterator each time, and a generator is the simplest way. An iterator returns `self` and is single-use.

```python
class Dataset:
    def __init__(self, samples):
        self.samples = samples

    def __iter__(self):
        for sample in self.samples:
            yield sample

class Countdown:
    def __init__(self, start):
        self.current = start

    def __iter__(self):
        return self

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        self.current -= 1
        return self.current + 1

data = Dataset([1, 2])
print(list(data), list(data))    # [1, 2] [1, 2]
countdown = Countdown(2)
print(list(countdown), list(countdown))  # [2, 1] []
```

</details>

**146.** What is a generator, and how does `yield` work?

<details>
<summary>Answer</summary>

A function with `yield` in its body. Calling it doesn't run the body: it returns a generator object, which is an iterator. Each `next()` runs to the next `yield`, hands out the value, and pauses, keeping local variables. When the body ends, `StopIteration` is raised. It can't be restarted: call the function again.

```python
def scores():
    print("Starting")
    yield 0.85
    print("Resuming")
    yield 0.93

g = scores()         # nothing printed yet
print(next(g))       # Starting, then 0.85
print(next(g))       # Resuming, then 0.93
```

</details>

**147.** What is the difference between a generator expression and a list comprehension?

<details>
<summary>Answer</summary>

`[x for x in items]` builds the whole list now. `(x for x in items)` produces values on demand, uses little memory, and is single-use.

```python
squares = (n ** 2 for n in range(4))
print(next(squares))  # 0
print(list(squares))  # [1, 4, 9]
print(sum(n ** 2 for n in range(4)))  # 14: no extra brackets needed
```

</details>

**148.** What do `yield from`, `send()`, and `close()` do?

<details>
<summary>Answer</summary>

`yield from` yields every value from another iterable. `send(value)` resumes a generator and makes the paused `yield` evaluate to `value`. `close()` raises `GeneratorExit` inside, so `finally` blocks run.

```python
def averager():
    total, count, average = 0, 0, None
    while True:
        value = yield average
        total += value
        count += 1
        average = total / count

tracker = averager()
next(tracker)            # advance to the first yield
print(tracker.send(10))  # 10.0
print(tracker.send(20))  # 15.0
```

</details>

**149.** When would you use a generator instead of a list?

<details>
<summary>Answer</summary>

| Use a generator for | Use a list for |
|---|---|
| Large or streaming data | Indexing and `len()` |
| Single-pass work and pipelines | Sorting |
| Stopping early (`any()`, `next()`) | Several passes |

```python
from itertools import islice

def batches(iterable, size):
    iterator = iter(iterable)
    while batch := list(islice(iterator, size)):
        yield batch

print(list(batches(range(5), 2)))  # [[0, 1], [2, 3], [4]]
```

Read a huge file by iterating over the file object, not with `readlines()`.

</details>

**150.** What are common mistakes and false claims about generators?

<details>
<summary>Answer</summary>

- `list(gen)` materializes everything, so the memory benefit is lost.
- A second pass over a generator silently gets nothing.
- `gen[0]` and `len(gen)` raise `TypeError`.
- A generator doesn't remove an existing input list from memory.
- Generators aren't always faster: each value has a per-item cost. They mainly save memory and skipped work.

</details>

**151.** What is the difference between `return` and `yield`?

<details>
<summary>Answer</summary>

| Feature | `return` | `yield` |
|---|---|---|
| Effect | Ends the call | Pauses the generator |
| Local state | Lost | Kept |
| Results | One per call | Many across iteration |

`return value` in a generator ends iteration, and `value` goes into `StopIteration.value`. A `for` loop doesn't see it, but `result = yield from inner()` captures it.

`yield [1, 2]` gives one list. `yield from [1, 2]` gives `1` and `2` separately.

</details>

**152.** How does a single `yield` change a whole function?

<details>
<summary>Answer</summary>

The choice is made at compile time: with `yield` anywhere in the body, every call returns a generator, even if that line never runs.

```python
def get_values(as_list):
    if as_list:
        return [1, 2]
    yield 3

print(list(get_values(False)))  # [3]
print(list(get_values(True)))   # []
```

Errors inside also appear only when it's consumed, not when it's called. To validate immediately, check arguments in an ordinary wrapper function.

</details>

### Exceptions and Context Managers

#### Exceptions

**153.** What is the exception hierarchy? `BaseException` vs `Exception`?

<details>
<summary>Answer</summary>

`BaseException` is the root. `Exception` is the base of ordinary errors. `KeyboardInterrupt` and `SystemExit` inherit directly from `BaseException`, so `except Exception` doesn't catch them.

| Common exception | Raised when |
|---|---|
| `ValueError` | Right type, bad value: `int("x")` |
| `TypeError` | Wrong type: `"1" + 1` |
| `KeyError` / `IndexError` | Missing key or index |
| `AttributeError` | Missing attribute |
| `ZeroDivisionError` | Division by zero |
| `FileNotFoundError` | Missing file (an `OSError`) |
| `StopIteration` | Iterator exhausted |

A `SyntaxError` happens when code is parsed, before it runs, so a `try` in the same file can't catch it.

</details>

**154.** How do `try`, `except`, `else`, and `finally` work?

<details>
<summary>Answer</summary>

| Clause | Runs |
|---|---|
| `try` | The code that may fail |
| `except` | When a matching exception is raised |
| `else` | When `try` completes with no exception, `return`, `break`, or `continue` |
| `finally` | Always, as control leaves the statement |

```python
def divide(first, second):
    try:
        result = first / second
    except ZeroDivisionError:
        print("Cannot divide by zero")
    else:
        print(f"Result: {result}")
    finally:
        print("Finished")

divide(10, 2)   # Result: 5.0, then Finished
divide(10, 0)   # Cannot divide by zero, then Finished
```

Exceptions raised in `else` aren't caught by the `except` above it. `finally` can't run if the process is killed.

</details>

**155.** Why catch specific exceptions? How do you catch several?

<details>
<summary>Answer</summary>

Broad handlers hide unrelated bugs. Bare `except:` also catches `KeyboardInterrupt` and `SystemExit`. Keep `try` blocks small so each handler protects one operation.

```python
try:
    value = int(text) / divisor
except (ValueError, ZeroDivisionError) as error:
    print(error)
```

The first matching handler wins, top to bottom, so put specific exceptions before general ones.

</details>

**156.** Why is `return` in `finally` dangerous?

<details>
<summary>Answer</summary>

It replaces the pending return value or silently swallows a pending exception. Python 3.14+ gives a `SyntaxWarning`.

```python
def example():
    try:
        return "original"
    finally:
        print("Cleanup")

print(example())   # Cleanup, then original
```

</details>

**157.** What happens to the `as` name after `except`? What is `except*`?

<details>
<summary>Answer</summary>

The name is deleted when the handler ends. This breaks a reference cycle between the exception, its traceback, and the frame. To keep it, assign it to another name inside the handler.

`except*` (Python 3.11+) handles an `ExceptionGroup`, which holds several unrelated exceptions, such as failures from concurrent tasks.

</details>

**158.** What is the difference between `raise` and `assert`?

<details>
<summary>Answer</summary>

`raise` signals a real error. `assert` checks an internal assumption while developing. Assertions are removed by `python -O`, so never use them to validate user input.

```python
def rate(value):
    if value <= 0:
        raise ValueError("value must be positive")
    assert isinstance(value, float), "internal check"
```

</details>

**159.** How do you create and raise custom exceptions?

<details>
<summary>Answer</summary>

Inherit from `Exception` or a suitable subclass, then `raise` it. Inheriting from `ValueError` lets `except ValueError` catch it too.

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

Skipping `super().__init__()` can leave `args` and the message empty.

</details>

**160.** How do you design custom exceptions well?

<details>
<summary>Answer</summary>

- Create one base exception, so callers can catch all of your errors with one handler.
- Don't inherit from `BaseException`, because `except Exception` would miss it.
- Reuse a built-in exception when it already expresses the meaning.
- Catch the custom type where you can recover or report.

```python
class PipelineError(Exception): ...
class DataError(PipelineError): ...
class ModelError(PipelineError): ...
```

</details>

**161.** How do you add context to an exception without changing its type?

<details>
<summary>Answer</summary>

Use `add_note()` (Python 3.11+), then a bare `raise`. Notes go in `__notes__` and appear below the message in a traceback.

```python
try:
    try:
        raise ValueError("NaN loss")
    except ValueError as error:
        error.add_note("while training fold 3")
        raise
except ValueError as error:
    print(error.__notes__)  # ['while training fold 3']
```

</details>

**162.** What is exception chaining with `raise ... from ...`?

<details>
<summary>Answer</summary>

It links a new, meaningful exception to the low-level one that caused it, so the original stays available for debugging.

```python
class InvalidConfigurationError(Exception):
    pass

def parse_epochs(value):
    try:
        return int(value)
    except ValueError as error:
        raise InvalidConfigurationError("epochs must be an integer") from error

try:
    parse_epochs("twenty")
except InvalidConfigurationError as error:
    print(type(error.__cause__).__name__)  # ValueError
```

</details>

**163.** What is the difference between `__cause__`, `__context__`, `from None`, and bare `raise`?

<details>
<summary>Answer</summary>

| Form | Behaviour | Traceback |
|---|---|---|
| `raise New() from error` | Sets `__cause__` | "direct cause" |
| `raise New()` in `except` | Sets `__context__` automatically | "During handling" |
| `raise New() from None` | Sets `__suppress_context__` | Earlier error hidden |
| Bare `raise` | Re-raises the current exception unchanged | Original traceback |

`from None` hides the earlier exception but doesn't delete `__context__`. After `from`, use an exception instance, an exception class, or `None`.

</details>

#### Context managers

**164.** What is a context manager, and how does `with` work?

<details>
<summary>Answer</summary>

An object with `__enter__()` and `__exit__()` that manages setup and cleanup around a block.

1. Evaluate the expression.
2. Call `__enter__()`.
3. Bind its return value to the `as` name.
4. Run the block.
5. Call `__exit__()`, even if the block raised.

```python
with open("data.txt", "w", encoding="utf-8") as file:
    file.write("rows")
print(file.closed)  # True
```

The `as` name still exists after the block, but the resource is usually closed. The `as` value isn't always the manager: a lock returns `True`.

</details>

**165.** How can a context manager suppress an exception? What if `__enter__()` fails?

<details>
<summary>Answer</summary>

A truthy return from `__exit__()` suppresses the exception. `False` or `None` lets it propagate. `contextlib.suppress(FileNotFoundError)` is a ready-made example.

If `__enter__()` raises, `__exit__()` isn't called, so entry code must clean up anything it partly acquired.

</details>

**166.** Does every context manager close its resource?

<details>
<summary>Answer</summary>

No. It depends on the implementation. A `sqlite3` connection manages a **transaction**: it commits on success and rolls back on an exception, but doesn't close the connection.

Async code uses `async with`, which awaits `__aenter__()` and `__aexit__()`.

</details>

**167.** How do you write a custom context manager with `__enter__` and `__exit__`?

<details>
<summary>Answer</summary>

```python
class ManagedFile:
    def __init__(self, path):
        self.path = path

    def __enter__(self):
        self.file = open(self.path, "w", encoding="utf-8")
        return self.file             # bound by `as`

    def __exit__(self, exc_type, exc_value, traceback):
        self.file.close()
        return False                 # don't suppress exceptions
```

The three `__exit__` arguments are all `None` on a normal exit. Don't re-raise in `__exit__()`: return a falsy value. If cleanup raises, the new error replaces the old one, which is kept as `__context__`.

</details>

**168.** How does `@contextmanager` work?

<details>
<summary>Answer</summary>

It turns a generator into a context manager. Code before `yield` is setup, the yielded value goes to `as`, and code after it is cleanup. Yield exactly once, and wrap `yield` in `try/finally`, otherwise an exception skips cleanup.

```python
from contextlib import contextmanager

@contextmanager
def eval_mode(model):
    previous = model.training
    model.training = False
    try:
        yield model
    finally:
        model.training = previous
```

Use a class when the manager needs extra methods, shared state, or fine control over suppression.

</details>

**169.** What is the difference between `finally` and a context manager for cleanup?

<details>
<summary>Answer</summary>

Both run cleanup on normal exit and on exceptions.

| Aspect | `try/finally` | Context manager |
|---|---|---|
| Cleanup lives in | The `finally` block | `__exit__()` or after `yield` |
| Reuse | Repeated at each call site | Written once |
| Suppressing exceptions | Only through bad control flow | Truthy `__exit__()` return |
| Best for | One-off cleanup | Reusable, scoped resources |

```python
lock.acquire()
try:
    update()
finally:
    lock.release()

with lock:     # the same, shorter
    update()
```

</details>

**170.** Why acquire a resource before `try`? What are the limits of cleanup?

<details>
<summary>Answer</summary>

If acquisition fails inside `try`, `finally` would release something you never acquired. So acquire first.

For several resources, clean up the ones already acquired if a later one fails. `contextlib.ExitStack` helps when the list is chosen at runtime. Neither approach runs if the process is killed or loses power.

</details>

### Memory Management and GIL

#### Memory management

**171.** How does Python manage memory and garbage collection?

<details>
<summary>Answer</summary>

Automatically. CPython mainly uses **reference counting**: an object is usually reclaimed when its last reference disappears. A **cyclic garbage collector** handles reference cycles. Objects live on a private heap, and names are references to them.

```python
import sys

items = [1, 2, 3]
alias = items
print(sys.getrefcount(items))  # 3: items, alias, and the call's argument
```

</details>

**172.** Why do reference cycles need a separate collector?

<details>
<summary>Answer</summary>

Objects in a cycle keep each other's counts above zero, so reference counting can't free them. The cyclic collector detects unreachable groups. Force it with `gc.collect()`. For parent-child links, use a `weakref` for the back reference to avoid the cycle.

```python
import gc

first = []
second = []
first.append(second)
second.append(first)
del first, second
print(gc.collect() >= 2)  # True: the cycle was found
```

</details>

**173.** Does `del x` destroy an object?

<details>
<summary>Answer</summary>

No. It removes one reference (a name binding). The object is reclaimed only when nothing refers to it.

```python
first = [1, 2]
second = first
del first
print(second)  # [1, 2]
```

</details>

**174.** Why is `__del__` a poor cleanup tool? Why not rely on GC to close files?

<details>
<summary>Answer</summary>

GC manages **memory**. Files, sockets, connections, and locks need release at a predictable time.

`__del__` timing isn't guaranteed, it may not run at interpreter exit, and exceptions inside it are ignored. Use `with`, `try/finally`, or `weakref.finalize()`.

</details>

**175.** Does freed memory return to the OS? Do all Python implementations work this way?

<details>
<summary>Answer</summary>

Not necessarily: Python may keep freed memory for reuse. So process memory may not drop after deleting objects.

Other implementations differ: PyPy uses a tracing GC with no reference counts, so object cleanup timing isn't immediate.

</details>

**176.** How can a Python program leak memory, and how do you find it?

<details>
<summary>Answer</summary>

Objects stay reachable by accident: growing global lists or caches, unbounded `lru_cache`, stored tracebacks, or closures holding big objects.

Use `tracemalloc` to find allocations, `gc.get_objects()` to inspect, and `sys.getsizeof()` for a single object's shallow size.

```python
import tracemalloc

tracemalloc.start()
data = [0] * 1000
current, peak = tracemalloc.get_traced_memory()
print(peak >= current)  # True
tracemalloc.stop()
```

</details>

#### Copying

**177.** What is the difference between assignment, shallow copy, and deep copy?

<details>
<summary>Answer</summary>

| Operation | New outer object? | Nested objects |
|---|---|---|
| `b = a` | No | Same |
| Shallow: `copy.copy(a)` | Yes | Shared |
| Deep: `copy.deepcopy(a)` | Yes | Copied |

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)
deep = copy.deepcopy(original)

shallow[0].append(99)
print(original)  # [[1, 2, 99], [3, 4]]
print(deep)      # [[1, 2], [3, 4]]
```

</details>

**178.** What makes a shallow copy? Why not always use `deepcopy()`?

<details>
<summary>Answer</summary>

`list.copy()`, `lst[:]`, `list(lst)`, `dict.copy()`, and `copy.copy()` are all shallow. That's enough when nested values are immutable or won't be mutated.

`deepcopy()` costs time and memory, and fails for objects such as locks (`cannot pickle '_thread.lock' object`). It handles cycles with a memo dictionary. Customize copying with `__copy__` and `__deepcopy__`.

</details>

**179.** What is wrong with `[[0] * 3] * 3` and `dict.fromkeys(keys, [])`?

<details>
<summary>Answer</summary>

Both repeat a reference to one list.

```python
grid = [[0] * 3] * 3
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]

grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1
print(grid)   # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]

metrics = {name: [] for name in ["train", "valid"]}  # a separate list for each key
```

</details>

#### GIL

**180.** What is the GIL, and why does it exist?

<details>
<summary>Answer</summary>

The **Global Interpreter Lock** lets only one thread at a time run Python bytecode in a GIL-enabled CPython interpreter. It protects reference counting and internals simply and cheaply. Not every Python runtime has one.

</details>

**181.** How does the GIL affect CPU-bound and I/O-bound threads?

<details>
<summary>Answer</summary>

| Work | Threads help? | Why |
|---|---|---|
| Pure-Python CPU | Usually not | Only one thread runs bytecode |
| I/O waits | Yes | The GIL is released while waiting |
| Native code such as NumPy | Often | It can release the GIL |

For CPU-bound Python, use processes, vectorized or compiled code, or free-threaded CPython.

</details>

**182.** Does the GIL make your code thread-safe?

<details>
<summary>Answer</summary>

No. It protects the interpreter, not your logic. `counter += 1` is several steps, so threads can interleave. Protect it with a lock.

```python
from threading import Lock, Thread

counter = 0
lock = Lock()

def increment():
    global counter
    for _ in range(1_000):
        with lock:
            counter += 1

threads = [Thread(target=increment) for _ in range(2)]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()
print(counter)  # 2000
```

</details>

**183.** What is free-threaded Python? Why not just remove the GIL?

<details>
<summary>Answer</summary>

An optional separate CPython build (experimental in 3.13, officially supported from 3.14) where threads can run Python code in parallel. It isn't the default. Shared state still needs synchronization.

Removal is hard because reference counting needs another way to stay thread-safe, which can slow single-threaded code, many C extensions assume the GIL protects them, and the GIL's scheduling may hide races in existing code.

</details>

### Concurrency (Threading, Multiprocessing, Asyncio)

#### Choosing the right tool

**184.** What is the difference between CPU-bound and I/O-bound work?

<details>
<summary>Answer</summary>

**CPU-bound** work is slow because of computation, such as feature extraction. **I/O-bound** work is slow because it waits for networks, disks, or databases. Find which one you have before choosing a tool.

</details>

**185.** When should you use threading, multiprocessing, or asyncio?

<details>
<summary>Answer</summary>

| Approach | Best for | Main trade-off |
|---|---|---|
| Threading | Blocking I/O with sync libraries such as `requests` | Races; GIL limits CPU parallelism |
| Multiprocessing | Substantial CPU-bound Python | Startup, pickling, and memory costs |
| Asyncio | Thousands of network calls with async libraries | Blocking code stalls the loop |

</details>

**186.** What is the difference between a thread and a process?

<details>
<summary>Answer</summary>

| Aspect | Thread | Process |
|---|---|---|
| Memory | Shared | Separate by default |
| Startup cost | Low | Higher |
| Communication | Shared variables | Pickled messages, queues, shared memory |
| Crash | Can take down the process | Isolated |
| CPU parallelism for Python | No, with the GIL | Yes |

</details>

**187.** What is the difference between concurrency and parallelism?

<details>
<summary>Answer</summary>

**Concurrency** is *managing* tasks with overlapping lifetimes, which works on one core. **Parallelism** is *running* tasks at the same instant, which needs several cores.

| Tool | Concurrent? | Parallel for Python code? |
|---|---|---|
| Asyncio | Yes | No: one thread |
| Threads (GIL) | Yes | No |
| Processes | Yes | Yes |

Neither guarantees speed: startup, data transfer, and coordination add overhead.

</details>

**188.** Can a program be both concurrent and parallel?

<details>
<summary>Answer</summary>

Yes. A common ML design uses asyncio or threads for many waiting requests, while a process pool or native library uses several cores for the heavy computation. One large NumPy multiplication can be parallel inside the library without being concurrent at the Python level.

</details>

#### Threading

**189.** How do you create a thread? What do `join()` and daemon threads do?

<details>
<summary>Answer</summary>

```python
from threading import Thread

def work(name):
    print(name)

thread = Thread(target=work, args=("t1",))
thread.start()    # begins running
thread.join()     # waits for it to finish
```

Call `start()`, not `run()`: `run()` executes in the current thread. A **daemon** thread (`daemon=True`) doesn't keep the program alive, and is stopped abruptly at exit.

</details>

**190.** What is a race condition, and how do you prevent it?

<details>
<summary>Answer</summary>

A bug where the result depends on thread timing, usually from unprotected read-modify-write on shared data. Protect it with a `Lock`, or avoid sharing by using a `Queue`.

| Tool | Use |
|---|---|
| `Lock` | One thread at a time |
| `RLock` | The same thread can re-acquire it |
| `Semaphore` | At most N at a time |
| `Event` | Signal between threads |

</details>

**191.** What is a deadlock, and how do you avoid it?

<details>
<summary>Answer</summary>

Two threads each hold a lock the other needs, so both wait forever.

```python
# Thread 1: with lock_a: with lock_b: ...
# Thread 2: with lock_b: with lock_a: ...  # deadlock risk
```

Avoid it by always acquiring locks in the same order, holding them briefly, and using timeouts: `lock.acquire(timeout=1)`.

</details>

**192.** How do you share work between threads safely?

<details>
<summary>Answer</summary>

`queue.Queue` is thread-safe and handles locking for you, which suits producer-consumer designs.

```python
from queue import Queue
from threading import Thread

tasks = Queue()

def worker():
    while (item := tasks.get()) is not None:
        print(item * 2)

thread = Thread(target=worker)
thread.start()
tasks.put(21)
tasks.put(None)    # sentinel: tells the worker to stop
thread.join()      # prints 42
```

</details>

**193.** What is `ThreadPoolExecutor`? What is the difference between `map` and `submit`?

<details>
<summary>Answer</summary>

It runs tasks in a pool of reusable threads. `map` returns results in input order. `submit` returns a `Future`, and `as_completed` gives them as they finish.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def load(item_id):
    return f"item-{item_id}"

with ThreadPoolExecutor(max_workers=3) as executor:
    print(list(executor.map(load, [1, 2])))     # ['item-1', 'item-2']
    futures = [executor.submit(load, 3)]
    for future in as_completed(futures):
        print(future.result())                  # item-3
```

</details>

#### Multiprocessing

**194.** How do you use a process pool? Why the `__main__` guard?

<details>
<summary>Answer</summary>

```python
from concurrent.futures import ProcessPoolExecutor

def sum_squares(limit):
    return sum(n * n for n in range(limit))

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        print(list(executor.map(sum_squares, [10, 20])))  # [285, 2470]
```

Workers import your module (the default on Windows and macOS), so without the guard they'd start the pool again. Functions must be module-level, and inputs and results must be picklable. Small tasks may run slower, because the overhead outweighs the work.

</details>

**195.** How do processes share data?

<details>
<summary>Answer</summary>

They don't share memory by default. Options: `multiprocessing.Queue` or `Pipe` for messages, and `shared_memory` or memory mapping for large arrays. Avoid resending big data: use a pool initializer, or have each worker load its own partition.

</details>

#### Asyncio

**196.** How do `async` and `await` work?

<details>
<summary>Answer</summary>

`async def` defines a coroutine function, and calling it creates a coroutine object that hasn't run yet. `await` runs an awaitable: a coroutine, task, future, or object with `__await__`. When it must wait, the **event loop** runs another ready task. `asyncio.run()` creates a loop, runs the top-level coroutine, and closes the loop.

An `await` that finishes immediately doesn't give up control. Use `await asyncio.sleep(0)` to yield explicitly.

</details>

**197.** How do you run coroutines concurrently?

<details>
<summary>Answer</summary>

Awaiting one after another is sequential. Use `gather()`, `create_task()`, or `TaskGroup`.

```python
import asyncio

async def fetch(name):
    await asyncio.sleep(0.01)
    return f"{name}: ready"

async def main():
    print([await fetch("a"), await fetch("b")])            # sequential
    print(await asyncio.gather(fetch("a"), fetch("b")))    # concurrent
    async with asyncio.TaskGroup() as group:               # Python 3.11+
        task = group.create_task(fetch("c"))
    print(task.result())

asyncio.run(main())
```

</details>

**198.** What blocks the event loop, and how do you avoid it?

<details>
<summary>Answer</summary>

Any blocking call or heavy computation on the loop thread, such as `time.sleep()` or `requests.get()`. Use `await asyncio.sleep()`, async libraries, or `asyncio.to_thread()`. Adding `async` doesn't make blocking work asynchronous.

```python
import asyncio
import time

def blocking_read():
    time.sleep(0.01)
    return "loaded"

async def main():
    print(await asyncio.to_thread(blocking_read))  # loaded

asyncio.run(main())
```

</details>

**199.** How do you limit concurrent async requests and add timeouts?

<details>
<summary>Answer</summary>

Use `asyncio.Semaphore` for the limit and `asyncio.wait_for()` or `asyncio.timeout()` for time limits, so you don't overload the services you call.

```python
import asyncio

async def fetch(limit, item):
    async with limit:
        await asyncio.sleep(0.01)
        return item

async def main():
    limit = asyncio.Semaphore(2)
    print(await asyncio.gather(*(fetch(limit, i) for i in range(4))))
    # [0, 1, 2, 3]

asyncio.run(main())
```

</details>

**200.** What are common asyncio mistakes?

<details>
<summary>Answer</summary>

- Calling a coroutine without awaiting or scheduling it.
- Using `time.sleep()` on the event-loop thread.
- Calling `asyncio.run()` inside a running loop, such as a notebook: use `await main()`.
- Creating tasks with no reference, which can lose results and exceptions.
- Expecting `async` to speed up CPU-bound code.

</details>

**201.** Can you combine asyncio with threads and processes?

<details>
<summary>Answer</summary>

Yes. Asyncio can hand off work without blocking the loop.

| Combination | Use it for |
|---|---|
| `asyncio.to_thread()` | A blocking sync call |
| `loop.run_in_executor(process_pool, ...)` | CPU-heavy Python work |

</details>

#### ML performance

**202.** How would you speed up a CPU-bound ML preprocessing task?

<details>
<summary>Answer</summary>

1. Confirm it's CPU-bound, and profile on representative data.
2. Improve the algorithm and remove repeated work: this is usually the biggest win.
3. Replace Python loops with NumPy or compiled operations.
4. Split independent heavy work across processes.
5. Tune batch size and worker count.
6. Measure runtime, peak memory, and outputs, comparing floats with `math.isclose()`.

Don't add processes first: they multiply a bad algorithm's cost and add overhead.

</details>

**203.** What should you watch for when parallelizing ML preprocessing?

<details>
<summary>Answer</summary>

| Issue | What to do |
|---|---|
| `chunksize` | Larger cuts overhead, but hurts load balancing |
| Huge data | Use an initializer, memory mapping, shared memory, or per-worker loading |
| Oversubscription | More active threads than cores: coordinate processes with BLAS/OpenMP threads |
| Data leakage | Fit scalers and encoders on training data only |
| Reproducibility | Control ordering, seeds, and error handling |
| Native code | Threads may work if it releases the GIL: benchmark |
| Custom kernels | Consider Numba or Cython, including deployment costs |

</details>

---

## Part B: Predict the Output (MCQ practice)

- [Basics and Data Types](#basics-and-data-types) (M1–M73)
  - Basics (M1–M16)
    - Basics theory (M1–M10)
    - ML libraries and tools (M11–M16)
  - Variables (M17–M41)
    - Dynamic typing (M17–M22)
    - Shared references (M23–M32)
    - Scope (LEGB) (M33–M41)
  - Operators (M42–M51)
    - Equality and identity (M42–M47)
    - Membership and comparison (M48–M51)
  - Data types (M52–M73)
    - bool, None, and truthiness (M52–M57)
    - Mutable and immutable (M58–M63)
    - list, tuple, set, and dict (M64–M73)
- [Data Structures and Comprehensions](#data-structures-and-comprehensions) (M74–M184)
  - Lists (M74–M105)
    - append and extend (M74–M83)
    - Slicing and reversing (M84–M98)
    - Removing duplicates (M99–M105)
  - Sorting (M106–M135)
    - Basic sorting (M106–M124)
    - Sorting by multiple criteria (M125–M135)
  - Dictionaries (M136–M154)
    - Dictionaries and complexity (M136–M141)
    - Merging and safe dictionary access (M142–M154)
  - Comprehensions and iteration (M155–M184)
    - Creating dictionaries and lists (M155–M175)
    - enumerate, zip, and unpacking (M176–M184)
- [OOP](#oop-1) (M185–M242)
  - Classes and objects (M185–M199)
    - `__init__` and `self` (M185–M190)
    - Class and instance attributes (M191–M193)
    - Instance, class, and static methods (M194–M199)
  - Four pillars (M200–M216)
    - Pillars and encapsulation (M200–M206)
    - Polymorphism and abstract classes (M207–M210)
    - Inheritance and composition (M211–M216)
  - Multiple inheritance (M217–M224)
    - MRO and the diamond problem (M217–M221)
    - Mixins (M222–M224)
  - Special methods and dataclasses (M225–M242)
    - Dunder methods (M225–M233)
    - Dataclasses (M234–M242)
- [Functions, Decorators and Generators](#functions-decorators-and-generators-1) (M243–M309)
  - Functions (M243–M262)
    - `*args` and `**kwargs` (M243–M250)
    - Function basics (M251–M257)
    - Lambda functions (M258–M262)
  - Closures and decorators (M263–M284)
    - Closures (M263–M270)
    - Decorators (M271–M278)
    - Class decorators (M279–M284)
  - Iterators and generators (M285–M309)
    - Iterables and iterators (M285–M291)
    - Generators (M292–M299)
    - Generators vs lists (M300–M304)
    - `return` vs `yield` (M305–M309)
- [Exceptions and Context Managers](#exceptions-and-context-managers-1) (M310–M353)
  - Exceptions (M310–M336)
    - `try`, `except`, `else`, and `finally` (M310–M323)
    - Custom exceptions (M324–M330)
    - Exception chaining (M331–M336)
  - Context managers (M337–M353)
    - `with` and context managers (M337–M345)
    - Custom context managers (M346–M350)
    - `finally` vs context managers (M351–M353)
- [Memory Management and GIL](#memory-management-and-gil-1) (M354–M380)
  - Memory management (M354–M372)
    - Reference counting and garbage collection (M354–M364)
    - Shallow and deep copy (M365–M372)
  - GIL (M373–M380)
    - The Global Interpreter Lock (M373–M380)
- [Concurrency (Threading, Multiprocessing, Asyncio)](#concurrency-threading-multiprocessing-asyncio-1) (M381–M430)
  - Choosing the right tool (M381–M389)
    - Threads, processes, and asyncio (M381–M389)
  - Threading (M390–M402)
    - Threads and locks (M390–M402)
  - Multiprocessing (M403–M407)
    - Process pools (M403–M407)
  - Asyncio (M408–M423)
    - `async` and `await` (M408–M423)
  - ML performance (M424–M430)
    - Speeding up CPU-bound preprocessing (M424–M430)

### Basics and Data Types

#### Basics

##### Basics theory

**M1.** Why can Python be used for heavy ML work even though pure-Python loops are slow?

- A) Dynamic typing removes the need for type checks
- B) Python compiles every loop to machine code
- C) The heavy maths runs in compiled native or GPU code
- D) The GIL spreads loops across all CPU cores

<details>
<summary>Answer</summary>

**C) The heavy maths runs in compiled native or GPU code**. Libraries like NumPy and PyTorch do the work in C/C++ or on a GPU. (See Q1, Q4.)

</details>

**M2.** Which of these is NOT one of Python's key features?

- A) Large ecosystem of libraries
- B) Multiple programming styles
- C) Cross-platform support
- D) Every variable must declare a fixed type

<details>
<summary>Answer</summary>

**D) Every variable must declare a fixed type**. Python is dynamically typed, so variables are never declared with a fixed type. (See Q1.)

</details>

**M3.** Which of these is NOT a key feature of Python?

- A) Readable, concise syntax
- B) Dynamic typing
- C) Huge ecosystem and community
- D) Manual memory management
- E) Integration with native code

<details>
<summary>Answer</summary>

**D) Manual memory management**. Python manages memory automatically. Its key features are readable, concise syntax, dynamic typing, multiple programming styles, cross-platform support, a huge ecosystem and community, and integration with native code. (See Q1.)

</details>

**M4.** What does this print?

```python
print(list(map(lambda n: n * 2, [1, 2])))
```

- A) `[1, 2, 1, 2]`
- B) `[2, 4]`
- C) `TypeError`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**B) `[2, 4]`**. `map()` applies the lambda to each item. (See Q2.)

</details>

**M5.** `list(map(lambda n: n * 2, nums))` is an example of which style?

- A) Declarative SQL
- B) Object-oriented
- C) Functional
- D) Procedural

<details>
<summary>Answer</summary>

**C) Functional**. It transforms data with functions instead of changing state step by step. (See Q2.)

</details>

**M6.** Which style groups data and behaviour together using classes?

- A) Functional
- B) Object-oriented
- C) Procedural
- D) Vectorized

<details>
<summary>Answer</summary>

**B) Object-oriented**. OOP uses classes, objects, attributes, and methods. (See Q2.)

</details>

**M7.** Which code is an example of the procedural style?

- A) `list(map(lambda n: n * 2, nums))`
- B) `class Doubler:` with a `run()` method
- C) `for n in nums: out.append(n * 2)`
- D) `[n * 2 for n in nums]`

<details>
<summary>Answer</summary>

**C) `for n in nums: out.append(n * 2)`**. Procedural code does the task step by step with loops and variables. (See Q2.)

</details>

**M8.** `map()`, `filter()`, `lambda`, and comprehensions belong to which programming style?

- A) Procedural
- B) Functional
- C) Object-oriented
- D) None of them

<details>
<summary>Answer</summary>

**B) Functional**. These tools transform data with functions instead of changing state step by step. (See Q2.)

</details>

**M9.** Which is an example of object-oriented programming?

- A) `sum(scores)`
- B) `for n in nums: out.append(n * 2)`
- C) A class with a method
- D) None of them

<details>
<summary>Answer</summary>

**C) A class with a method**. OOP groups data and behaviour into classes, objects, attributes, and methods. `sum()` is a built-in function, and a `for` loop is procedural. (See Q2.)

</details>

**M10.** Which line best shows Python being concise?

- A) `count = count + 1`
- B) `if s > 0: total = total + 1`
- C) `avg = sum(scores) / len(scores)`
- D) `for s in scores: total = total + s`

<details>
<summary>Answer</summary>

**C) `avg = sum(scores) / len(scores)`**. Built-ins finish the whole task in one clear line. (See Q3.)

</details>

##### ML libraries and tools

**M11.** Which library is the usual choice for loading and cleaning tabular data?

- A) Matplotlib
- B) PyTorch
- C) FastAPI
- D) pandas

<details>
<summary>Answer</summary>

**D) pandas**. pandas works with DataFrames. (See Q5.)

</details>

**M12.** Which tool is commonly used to serve a trained model as an API?

- A) Jupyter
- B) FastAPI
- C) NumPy
- D) Matplotlib

<details>
<summary>Answer</summary>

**B) FastAPI**. FastAPI exposes model predictions through HTTP endpoints. (See Q5.)

</details>

**M13.** Which library is the standard choice for classical ML like random forests?

- A) Matplotlib
- B) pandas
- C) scikit-learn
- D) FastAPI

<details>
<summary>Answer</summary>

**C) scikit-learn**. scikit-learn covers classical ML models and pipelines. (See Q5.)

</details>

**M14.** MLflow and FastAPI come under which ML task categories, in that order?

- A) Deployment and Data preparation
- B) Experimentation and Deployment
- C) Visualization and Deep learning
- D) Data preparation and Numerical computing

<details>
<summary>Answer</summary>

**B) Experimentation and Deployment**. MLflow tracks runs and metrics; FastAPI serves the model as an API. (See Q5.)

The 7 categories:

| Category | Tools |
|---|---|
| Numerical computing | NumPy |
| Data preparation | pandas |
| Visualization | Matplotlib, Seaborn |
| Classical ML | scikit-learn |
| Deep learning (3) | PyTorch, TensorFlow, Keras |
| Experimentation (2) | Jupyter, MLflow |
| Deployment (2) | FastAPI, Docker |

</details>

**M15.** Which code is vectorized?

- A) `[n * 2 for n in nums]`
- B) `list(map(lambda n: n * 2, nums))`
- C) `for n in nums: out.append(n * 2)`
- D) `arr * 2`

<details>
<summary>Answer</summary>

**D) `arr * 2`**. The NumPy array operation runs on the whole array in compiled code. (See Q6.)

</details>

**M16.** What does this print?

```python
print([1, 2] * 2)
```

- A) `TypeError`
- B) `[1, 2, 1, 2]`
- C) `[2, 4]`
- D) `[1, 2, 2]`

<details>
<summary>Answer</summary>

**B) `[1, 2, 1, 2]`**. `*` repeats a Python list. A NumPy array would multiply each value and give `[2 4]`. (See Q6.)

</details>

#### Variables

##### Dynamic typing

**M17.** What does this print?

```python
x = 5
x = "hi"
print(type(x).__name__)
```

- A) `TypeError`
- B) `int`
- C) `object`
- D) `str`

<details>
<summary>Answer</summary>

**D) `str`**. The name `x` now refers to a string. The type belongs to the object. (See Q7, Q8, Q9.)

</details>

**M18.** In Python, a type belongs to:

- A) The module
- B) The line of code
- C) The object
- D) The variable name

<details>
<summary>Answer</summary>

**C) The object**. A name only refers to an object. (See Q8.)

</details>

**M19.** What does this print?

```python
def f():
    return "1" + 1

print("defined")
```

- A) `TypeError`
- B) `11`
- C) `defined`
- D) `SyntaxError`

<details>
<summary>Answer</summary>

**C) `defined`**. The function body never ran, so the invalid operation hasn't failed yet. (See Q10.)

</details>

**M20.** What does this print?

```python
print("1" + 1)
```

- A) `2`
- B) `ValueError`
- C) `11`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. Python won't mix `str` and `int` with `+`. (See Q10.)

</details>

**M21.** What does this print?

```python
def double(x: int) -> int:
    return x * 2

print(double("ab"))
```

- A) `abab`
- B) `TypeError`
- C) `ValueError`
- D) `None`

<details>
<summary>Answer</summary>

**A) `abab`**. Type hints aren't enforced at runtime. (See Q12.)

</details>

**M22.** Which tool checks type hints without running the code?

- A) mypy
- B) pytest-cov
- C) pandas
- D) pickle

<details>
<summary>Answer</summary>

**A) mypy**. mypy is a static type checker. Pydantic validates at runtime. (See Q12.)

</details>

##### Shared references

**M23.** What is the difference between reassignment and mutation?

- A) Both create a new object
- B) Reassignment changes the object; mutation changes the name
- C) Reassignment points the name at a different object; mutation changes the object itself
- D) Both change the object itself

<details>
<summary>Answer</summary>

**C) Reassignment points the name at a different object; mutation changes the object itself**. `items = [9]` is reassignment, and `items.append(3)` is mutation. Other names sharing that list see a mutation, but not a reassignment. (See Q14.)

</details>

**M24.** With `items = [1, 2]`, which line modifies the list in place instead of reassigning `items`?

- A) `items = items + [3]`
- B) `items = [1, 2, 3]`
- C) `items = sorted(items)`
- D) `items.append(3)`

<details>
<summary>Answer</summary>

**D) `items.append(3)`**. `append()` changes the same list object. The other three build a new list and point `items` at it. (See Q15.)

</details>

**M25.** With `b = [1, 2]`, which line is a mutation?

- A) `b = [9]`
- B) `b = b + [3]`
- C) `b[:] = [9]`
- D) `b = b[::-1]`

<details>
<summary>Answer</summary>

**C) `b[:] = [9]`**. Assigning to a slice replaces the contents of the same list. The other three build a new list and point `b` at it, so they are reassignments. (See Q14.)

</details>

**M26.** With `b = [1, 2]`, which line is a reassignment?

- A) `b.append(3)`
- B) `b = b + [3]`
- C) `b[:] = [9]`
- D) `b += [3]`

<details>
<summary>Answer</summary>

**B) `b = b + [3]`**. `b + [3]` builds a new list and `b =` points the name at it. `append()`, slice assignment, and `+=` on a list all change the same object. (See Q15.)

</details>

**M27.** What does this print?

```python
a = [1, 2]
b = a
b = [9]
print(a)
```

- A) `[]`
- B) `[9]`
- C) `[1, 2, 9]`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**D) `[1, 2]`**. Reassigning `b` changes only the binding of `b`. (See Q14.)

</details>

**M28.** What does this print?

```python
a = [1, 2]
b = a
b.append(3)
print(a)
```

- A) `[1, 2, 3]`
- B) `[3]`
- C) `[1, 2]`
- D) `None`

<details>
<summary>Answer</summary>

**A) `[1, 2, 3]`**. Both names refer to the same list. (See Q15, Q16.)

</details>

**M29.** What does this print?

```python
a = [1, 2]
b = a
b = b + [3]
print(a)
```

- A) `[1, 2, 3]`
- B) `[1, 2]`
- C) `None`
- D) `[3]`

<details>
<summary>Answer</summary>

**B) `[1, 2]`**. `b + [3]` builds a new list, so `a` doesn't change. (See Q15.)

</details>

**M30.** What does this print?

```python
a = [1, 2]
b = a
b += [3]
print(a)
```

- A) `TypeError`
- B) `[1, 2]`
- C) `[3]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**D) `[1, 2, 3]`**. `+=` on a list changes it in place. (See Q15.)

</details>

**M31.** What does this print?

```python
a = [1, 2]
b = a.copy()
b.append(3)
print(a)
```

- A) `[3]`
- B) `[1, 2]`
- C) `None`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**B) `[1, 2]`**. `copy()` makes a separate list. (See Q16.)

</details>

**M32.** What does this print?

```python
a = [[1], [2]]
b = a.copy()
b[0].append(9)
print(a)
```

- A) `[[9], [2]]`
- B) `[[1, 9], [2]]`
- C) `[[1], [2]]`
- D) `TypeError`

<details>
<summary>Answer</summary>

**B) `[[1, 9], [2]]`**. `copy()` is shallow, so the inner lists are still shared. `copy.deepcopy()` copies those too. (See Q16.)

</details>

##### Scope (LEGB)

**M33.** What is the order of Python's name lookup?

- A) Local → Global → Enclosing → Built-in
- B) Built-in → Global → Enclosing → Local
- C) Global → Local → Enclosing → Built-in
- D) Local → Enclosing → Global → Built-in

<details>
<summary>Answer</summary>

**D) Local → Enclosing → Global → Built-in**. This is the LEGB rule. (See Q27.)

</details>

**M34.** What does this print?

```python
x = 1

def f():
    x = 2

f()
print(x)
```

- A) `2`
- B) `None`
- C) `NameError`
- D) `1`

<details>
<summary>Answer</summary>

**D) `1`**. `x = 2` creates a separate local variable. (See Q27, Q28.)

</details>

**M35.** What does this print?

```python
x = 1

def f():
    print(x)

f()
```

- A) `NameError`
- B) `1`
- C) `UnboundLocalError`
- D) `None`

<details>
<summary>Answer</summary>

**B) `1`**. Reading a global name works without any keyword. (See Q27.)

</details>

**M36.** What does this print?

```python
def outer():
    x = "enclosing"
    def inner():
        return x
    return inner()

print(outer())
```

- A) `NameError`
- B) `local`
- C) `None`
- D) `enclosing`

<details>
<summary>Answer</summary>

**D) `enclosing`**. `inner` finds `x` in the enclosing function. (See Q28.)

</details>

**M37.** Which keyword lets a nested function change a variable in its outer function?

- A) `global`
- B) `local`
- C) `outer`
- D) `nonlocal`

<details>
<summary>Answer</summary>

**D) `nonlocal`**. `global` targets the module level instead. (See Q29.)

</details>

**M38.** Which keyword lets a function change a module-level variable?

- A) `static`
- B) `module`
- C) `nonlocal`
- D) `global`

<details>
<summary>Answer</summary>

**D) `global`**. `global` points the name at the module scope. (See Q29.)

</details>

**M39.** What does this print?

```python
def outer():
    n = 1
    def inner():
        nonlocal n
        n += 1
    inner()
    return n

print(outer())
```

- A) `None`
- B) `1`
- C) `UnboundLocalError`
- D) `2`

<details>
<summary>Answer</summary>

**D) `2`**. `nonlocal` updates the enclosing `n`. (See Q29.)

</details>

**M40.** What does this print?

```python
def outer():
    n = 1
    def inner():
        n = 5
    inner()
    return n

print(outer())
```

- A) `1`
- B) `UnboundLocalError`
- C) `None`
- D) `5`

<details>
<summary>Answer</summary>

**A) `1`**. Without `nonlocal`, `n = 5` is a new local variable. (See Q29.)

</details>

**M41.** What does this print?

```python
count = 0

def inc():
    count += 1

inc()
```

- A) `UnboundLocalError`
- B) `NameError`
- C) `1`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `UnboundLocalError`**. Assigning makes `count` local, and it's read before it has a value. (See Q30.)

</details>

#### Operators

##### Equality and identity

**M42.** What does this print?

```python
a = [1]
b = [1]
print(a == b, a is b)
```

- A) `True False`
- B) `False False`
- C) `False True`
- D) `True True`

<details>
<summary>Answer</summary>

**A) `True False`**. Same contents, but two different objects. (See Q23, Q24.)

</details>

**M43.** What does each line print?

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

**M44.** What does this print?

```python
x = 1
y = 1.0
print(x == y, x is y)
```

- A) `True False`
- B) `False False`
- C) `True True`
- D) `False True`

<details>
<summary>Answer</summary>

**A) `True False`**. The values are equal, but one is an `int` and the other a `float`. (See Q23.)

</details>

**M45.** Which check compares identity?

- A) `a != b`
- B) `a = b`
- C) `a is b`
- D) `a == b`

<details>
<summary>Answer</summary>

**C) `a is b`**. `is` asks whether both names are the same object. (See Q24.)

</details>

**M46.** What does each line print?

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

**M47.** What is the correct way to check for None?

- A) `if x:`
- B) `x = None`
- C) `x is None`
- D) `x == None`

<details>
<summary>Answer</summary>

**C) `x is None`**. `if x:` would also treat `0` and `""` as missing. (See Q25.)

</details>

##### Membership and comparison

**M48.** How do you check whether a dict `d` has no key `"k"`?

- A) `d == "k"`
- B) `not d`
- C) `"k" not in d`
- D) `d is None`

<details>
<summary>Answer</summary>

**C) `"k" not in d`**. `in` checks keys. (See Q25.)

</details>

**M49.** What does this print?

```python
print([1, 2] == [2, 1], {1, 2} == {2, 1}, {"a": 1, "b": 2} == {"b": 2, "a": 1})
```

- A) `False True True`
- B) `False False True`
- C) `False True False`
- D) `True True True`

<details>
<summary>Answer</summary>

**A) `False True True`**. List order matters. Set and dict order doesn't matter for `==`. (See Q26.)

</details>

**M50.** What does this print?

```python
print("apple" < "banana", [1, 2] < [1, 3])
```

- A) `False True`
- B) `True False`
- C) `TypeError`
- D) `True True`

<details>
<summary>Answer</summary>

**D) `True True`**. Strings and lists compare item by item. (See Q26.)

</details>

**M51.** What does this print?

```python
print({"a": 1} < {"b": 2})
```

- A) `TypeError`
- B) `True`
- C) `KeyError`
- D) `False`

<details>
<summary>Answer</summary>

**A) `TypeError`**. Dictionaries support `==` but not `<`. (See Q26.)

</details>

#### Data types

##### bool, None, and truthiness

**M52.** What does each line print?

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

**M53.** What does each line print?

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

**M54.** What does each line print?

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

**M55.** What does this print?

```python
print(type(None).__name__, type(False).__name__)
```

- A) `object bool`
- B) `NoneType bool`
- C) `NoneType int`
- D) `None bool`

<details>
<summary>Answer</summary>

**B) `NoneType bool`**. `None` has its own type, `NoneType`. (See Q31.)

</details>

**M56.** What does this print?

```python
print(not "", not [], not (), not {}, not set(), not range(0))
```

- A) `True True True True True True`
- B) `False False False False False False`
- C) `True True True True False True`
- D) `True True True False False True`

<details>
<summary>Answer</summary>

**A) `True True True True True True`**. All empty collections are falsy. (See Q32.)

</details>

**M57.** What does this print?

```python
print(bool(" "), bool({0}), bool(None))
```

- A) `True True False`
- B) `False True False`
- C) `False False False`
- D) `True False False`

<details>
<summary>Answer</summary>

**A) `True True False`**. A space and `{0}` are not empty. `None` is falsy. (See Q32.)

</details>

##### Mutable and immutable

**M58.** Which group contains only immutable types?

- A) `int`, `set`, `dict`
- B) `int`, `str`, `tuple`
- C) `list`, `dict`, `set`
- D) `str`, `list`, `tuple`

<details>
<summary>Answer</summary>

**B) `int`, `str`, `tuple`**. `list`, `dict`, and `set` are mutable. (See Q13.)

</details>

**M59.** What does this print?

```python
s = "hi"
s.upper()
print(s)
```

- A) `AttributeError`
- B) `hi`
- C) `None`
- D) `HI`

<details>
<summary>Answer</summary>

**B) `hi`**. Strings are immutable, and the new string `HI` was never saved. (See Q13.)

</details>

**M60.** What does this print?

```python
t = ([1], 2)
t[0].append(5)
print(t)
```

- A) `([5], 2)`
- B) `([1], 2)`
- C) `TypeError`
- D) `([1, 5], 2)`

<details>
<summary>Answer</summary>

**D) `([1, 5], 2)`**. The tuple still holds the same list, and that list changed itself. (See Q17.)

</details>

**M61.** What does this print?

```python
t = (1, 2)
t[0] = 5
```

- A) `TypeError`
- B) `(5, 2)`
- C) `ValueError`
- D) `(1, 2)`

<details>
<summary>Answer</summary>

**A) `TypeError`**. A tuple's items can't be replaced. (See Q17.)

</details>

**M62.** Which of these can be a dictionary key?

- A) `(1, (2, 3))`
- B) `[1, 2]`
- C) `(1, [2])`
- D) `{1: 2}`

<details>
<summary>Answer</summary>

**A) `(1, (2, 3))`**. A tuple is hashable only if everything inside it is hashable. (See Q18.)

</details>

**M63.** What does this print?

```python
d = {(1, [2]): "x"}
```

- A) `ValueError`
- B) `KeyError`
- C) `SyntaxError`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. The list inside makes the tuple unhashable. (See Q18.)

</details>

##### list, tuple, set, and dict

**M64.** Which collection automatically removes duplicates?

- A) `list`
- B) `set`
- C) `tuple`
- D) `str`

<details>
<summary>Answer</summary>

**B) `set`**. A set keeps unique values only. (See Q19.)

</details>

**M65.** You need a fixed record that can also be a dictionary key. Which do you choose?

- A) `dict`
- B) `list`
- C) `set`
- D) `tuple`

<details>
<summary>Answer</summary>

**D) `tuple`**. A tuple is immutable and hashable if its items are. (See Q19.)

</details>

**M66.** What does this print?

```python
print(len({1, 2, 2, 3}))
```

- A) `3`
- B) `2`
- C) `4`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `3`**. The duplicate `2` is removed. (See Q19.)

</details>

**M67.** What does this print?

```python
print(type({}).__name__, type(set()).__name__)
```

- A) `dict dict`
- B) `set set`
- C) `dict set`
- D) `set dict`

<details>
<summary>Answer</summary>

**C) `dict set`**. `{}` is an empty dict. Use `set()` for an empty set. (See Q19.)

</details>

**M68.** What does this print?

```python
print(type((1)).__name__, type((1,)).__name__)
```

- A) `tuple tuple`
- B) `tuple int`
- C) `int tuple`
- D) `int int`

<details>
<summary>Answer</summary>

**C) `int tuple`**. The comma makes a tuple, not the brackets. (See Q19.)

</details>

**M69.** Which of these does NOT support indexing like `x[0]`?

- A) `list`
- B) `tuple`
- C) `set`
- D) `str`

<details>
<summary>Answer</summary>

**C) `set`**. Sets are unordered, so they have no positions. (See Q20.)

</details>

**M70.** Which group contains only ordered sequences?

- A) `list`, `set`, `str`, `range`
- B) `dict`, `list`, `set`, `tuple`
- C) `list`, `tuple`, `str`, `range`
- D) `set`, `dict`, `tuple`, `str`

<details>
<summary>Answer</summary>

**C) `list`, `tuple`, `str`, `range`**. `dict` keeps insertion order but isn't a sequence, and `set` is unordered. (See Q20.)

</details>

**M71.** What is the average time for `x in some_set`?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**A) O(1)**. Sets use a hash table. (See Q21.)

</details>

**M72.** What is the time for `x in some_list`?

- A) O(log n)
- B) O(1)
- C) O(n²)
- D) O(n)

<details>
<summary>Answer</summary>

**D) O(n)**. A list is scanned item by item. (See Q21.)

</details>

**M73.** What does this print?

```python
s = {[1, 2]}
```

- A) `TypeError`
- B) `KeyError`
- C) `{[1, 2]}`
- D) `{1, 2}`

<details>
<summary>Answer</summary>

**A) `TypeError`**. Set elements must be hashable, and lists aren't. (See Q22.)

</details>

### Data Structures and Comprehensions

#### Lists

##### append and extend

**M74.** What does this print?

```python
a = [1]
a.append("hi")
print(a)
```

- A) `[1, 'h', 'i']`
- B) `['hi']`
- C) `[1, 'hi']`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `[1, 'hi']`**. `append()` adds one element. (See Q33, Q34.)

</details>

**M75.** What does this print?

```python
a = [1]
a.extend("hi")
print(a)
```

- A) `[1, 'h', 'i']`
- B) `['hi']`
- C) `[1, 'hi']`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `[1, 'h', 'i']`**. `extend()` loops over the string. (See Q33, Q34.)

</details>

**M76.** What does this print?

```python
a = []
a.extend("I love AI".split())
print(a)
```

- A) `['I', ' ', 'l']`
- B) `['I', 'love', 'AI']`
- C) `['I love AI']`
- D) `None`

<details>
<summary>Answer</summary>

**B) `['I', 'love', 'AI']`**. `split()` gives words, and `extend()` adds each one. (See Q35.)

</details>

**M77.** What does this print?

```python
a = [0]
a.extend(range(1, 3))
print(a)
```

- A) `[0, range(1, 3)]`
- B) `TypeError`
- C) `[0, 1, 2]`
- D) `[0, 1, 2, 3]`

<details>
<summary>Answer</summary>

**C) `[0, 1, 2]`**. `range(1, 3)` gives 1 and 2. (See Q36.)

</details>

**M78.** What does this print?

```python
a = []
a.extend({"x": 1, "y": 2})
print(a)
```

- A) `TypeError`
- B) `['x', 'y']`
- C) `[1, 2]`
- D) `[('x', 1), ('y', 2)]`

<details>
<summary>Answer</summary>

**B) `['x', 'y']`**. Looping over a dict gives its keys. (See Q37.)

</details>

**M79.** What does this print?

```python
a = [1]
print(a.extend([2]))
```

- A) `[2]`
- B) `[1, 2]`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**D) `None`**. `extend()` changes the list and returns `None`. (See Q38.)

</details>

**M80.** What does this print?

```python
a = [1]
b = a.append(2)
print(a, b)
```

- A) `None None`
- B) `[1, 2] None`
- C) `[1, 2] [1, 2]`
- D) `[1] [1, 2]`

<details>
<summary>Answer</summary>

**B) `[1, 2] None`**. `append()` changes `a` in place and returns `None`. (See Q38.)

</details>

**M81.** What happens?

```python
numbers = [1, 2]
numbers.extend(3)
```

<details>
<summary>Answer</summary>

`TypeError: 'int' object is not iterable`. `extend()` needs an iterable, so use `append(3)` or `extend([3])`.

</details>

**M82.** Starting from `[1, 2]` each time, what's the result of each call?

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

**M83.** What gets printed?

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

##### Slicing and reversing

**M84.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[1:3])
```

- A) `[10, 20]`
- B) `[10, 20, 30]`
- C) `[20, 30, 40]`
- D) `[20, 30]`

<details>
<summary>Answer</summary>

**D) `[20, 30]`**. Start is included, stop is excluded. (See Q44, Q46.)

</details>

**M85.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[0:5:2])
```

- A) `[10, 30]`
- B) `[20, 40]`
- C) `[10, 30, 50]`
- D) `[10, 20]`

<details>
<summary>Answer</summary>

**C) `[10, 30, 50]`**. The step of 2 takes indices 0, 2, and 4. (See Q45.)

</details>

**M86.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[:2] + n[2:] == n)
```

- A) `True`
- B) `False`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**A) `True`**. Because stop is excluded, the two slices fit together with no overlap. (See Q46.)

</details>

**M87.** What does this print?

```python
n = [10, 20, 30]
print(n[::-1])
```

- A) `[10, 20, 30]`
- B) `ValueError`
- C) `[30, 20, 10]`
- D) `[30]`

<details>
<summary>Answer</summary>

**C) `[30, 20, 10]`**. A step of `-1` walks backwards. (See Q47.)

</details>

**M88.** What does this print?

```python
n = [1, 2, 3]
print(n.reverse())
```

- A) `[1, 2, 3]`
- B) `[3, 2, 1]`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**D) `None`**. `reverse()` works in place and returns `None`. (See Q47.)

</details>

**M89.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[-2:])
```

- A) `[50]`
- B) `[40, 50]`
- C) `[10, 20, 30]`
- D) `[10, 20]`

<details>
<summary>Answer</summary>

**B) `[40, 50]`**. `-2` starts at the second-last item. (See Q48.)

</details>

**M90.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[1:-1])
```

- A) `[20, 30, 40, 50]`
- B) `[20, 30, 40]`
- C) `[10, 20, 30, 40]`
- D) `[30]`

<details>
<summary>Answer</summary>

**B) `[20, 30, 40]`**. This removes the first and last items. (See Q48.)

</details>

**M91.** What does this print?

```python
n = [10, 20]
print(n[5:])
```

- A) `[]`
- B) `IndexError`
- C) `None`
- D) `[10, 20]`

<details>
<summary>Answer</summary>

**A) `[]`**. Slices never go out of range. `n[5]` would raise `IndexError`. (See Q44.)

</details>

**M92.** What does this print?

```python
n = [10, 20, 30, 40, 50]
print(n[4:1:-1])
```

- A) `[50, 40, 30, 20]`
- B) `[40, 30, 20]`
- C) `[]`
- D) `[50, 40, 30]`

<details>
<summary>Answer</summary>

**D) `[50, 40, 30]`**. It goes backwards from index 4 and stops before index 1. (See Q45.)

</details>

**M93.** What does this print?

```python
print("python"[::2])
```

- A) `yhn`
- B) `pto`
- C) `python`
- D) `nohtyp`

<details>
<summary>Answer</summary>

**B) `pto`**. Strings can be sliced too. (See Q45.)

</details>

**M94.** What does this print?

```python
a = [1, 2, 3]
b = a[:]
b[0] = 9
print(a)
```

- A) `[9]`
- B) `[9, 2, 3]`
- C) `[1, 2, 3]`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `[1, 2, 3]`**. `a[:]` makes a shallow copy. (See Q16, Q44.)

</details>

**M95.** What does this print?

```python
print([1, 2, 3][::0])
```

- A) `[1, 2, 3]`
- B) `TypeError`
- C) `ValueError`
- D) `[]`

<details>
<summary>Answer</summary>

**C) `ValueError`**. A slice step can't be zero. (See Q51.)

</details>

**M96.** With `numbers = [10, 20, 30, 40, 50, 60]`, what does each print?

```python
print(numbers[-3:])
print(numbers[:-2])
print(numbers[-4:-1])
```

<details>
<summary>Answer</summary>

`[40, 50, 60]` (last three) · `[10, 20, 30, 40]` (all except the last two) · `[30, 40, 50]` (start at 30, stop before 60).

</details>

**M97.** With `numbers = [10, 20, 30, 40, 50]`, what does each give?

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

**M98.** Which of these reverses `items = [1, 2, 3]`, and what does each return?

A) `items[::-1]`  B) `reversed(items)`  C) `items.reverse()`  D) `items.sort(reverse=True)`

<details>
<summary>Answer</summary>

All four end up with the order `3, 2, 1`, but they return different things:
A → new list `[3, 2, 1]` · B → an iterator (wrap it in `list()`) · C → reverses in place, returns `None` · D → sorts descending in place, returns `None` (same result here only because the list was already sorted).

</details>

##### Removing duplicates

**M99.** Which option removes duplicates and keeps first-seen order?

- A) `list(set(items))`
- B) `list(dict.fromkeys(items))`
- C) `items.sort()`
- D) `sorted(set(items))`

<details>
<summary>Answer</summary>

**B) `list(dict.fromkeys(items))`**. Dict keys are unique and keep insertion order. (See Q39.)

</details>

**M100.** What does this print?

```python
print(list(dict.fromkeys("banana")))
```

- A) `['b', 'a', 'n']`
- B) `['a', 'b', 'n']`
- C) `['banana']`
- D) `['b', 'a', 'n', 'a']`

<details>
<summary>Answer</summary>

**A) `['b', 'a', 'n']`**. Each letter stays where it first appeared. (See Q39, Q40.)

</details>

**M101.** `[3, 1, 2, 3, 1]` after removing duplicates and preserving order is:

- A) `[2, 3, 1]`
- B) `[3, 1, 2]`
- C) `[3, 2, 1]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**B) `[3, 1, 2]`**. Each value keeps its first position. (See Q40.)

</details>

**M102.** Does `list(set(items))` guarantee order?

- A) Yes, always insertion order
- B) No, sets are unordered
- C) Only for lists of strings
- D) Yes, always sorted

<details>
<summary>Answer</summary>

**B) No, sets are unordered**. Use `dict.fromkeys()` to keep order. (See Q41.)

</details>

**M103.** Which pandas call gives the number of unique values in a Series?

- A) `s.value_counts()`
- B) `s.count()`
- C) `s.nunique()`
- D) `s.unique()`

<details>
<summary>Answer</summary>

**C) `s.nunique()`**. `unique()` returns the values, and `count()` returns non-null rows. (See Q42.)

</details>

**M104.** What does `s.drop_duplicates()` return for a pandas Series?

- A) A dictionary
- B) A set
- C) A Series
- D) A Python list

<details>
<summary>Answer</summary>

**C) A Series**. Add `.tolist()` to get a list. (See Q42.)

</details>

**M105.** What does this print?

```python
print(sorted(set(["pear", "apple", "pear"])))
```

- A) `['pear', 'apple']`
- B) `['apple', 'pear']`
- C) `{'apple', 'pear'}`
- D) `['apple', 'pear', 'pear']`

<details>
<summary>Answer</summary>

**B) `['apple', 'pear']`**. `set()` removes duplicates, and `sorted()` returns a sorted list. (See Q43.)

</details>

#### Sorting

##### Basic sorting

**M106.** What does this print?

```python
a = [3, 1, 2]
r = a.sort()
print(r, a)
```

- A) `[1, 2, 3] [1, 2, 3]`
- B) `None [1, 2, 3]`
- C) `[1, 2, 3] [3, 1, 2]`
- D) `None [3, 1, 2]`

<details>
<summary>Answer</summary>

**B) `None [1, 2, 3]`**. `.sort()` works in place and returns `None`. (See Q49.)

</details>

**M107.** What does this print?

```python
a = [3, 1]
print(sorted(a), a)
```

- A) `[3, 1] [1, 3]`
- B) `None [1, 3]`
- C) `[1, 3] [3, 1]`
- D) `[1, 3] [1, 3]`

<details>
<summary>Answer</summary>

**C) `[1, 3] [3, 1]`**. `sorted()` returns a new list. (See Q49.)

</details>

**M108.** Which types have a `.sort()` method?

- A) `list` and `set`
- B) `list` and `tuple`
- C) All iterables
- D) Only `list`

<details>
<summary>Answer</summary>

**D) Only `list`**. `sorted()` works on any iterable, but `.sort()` belongs to lists. (See Q49.)

</details>

**M109.** What does this print?

```python
m = [{"n": "a", "acc": 0.8}, {"n": "b", "acc": 0.9}]
print([x["n"] for x in sorted(m, key=lambda x: x["acc"], reverse=True)])
```

- A) `['b', 'a']`
- B) `KeyError`
- C) `[0.9, 0.8]`
- D) `['a', 'b']`

<details>
<summary>Answer</summary>

**A) `['b', 'a']`**. Sort by accuracy, highest first, then pick out the names. (See Q50, Q56.)

</details>

**M110.** What does this print?

```python
d = {"a": 2, "b": 1}
print(sorted(d, key=d.get))
```

- A) `['a', 'b']`
- B) `[('b', 1), ('a', 2)]`
- C) `['b', 'a']`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**C) `['b', 'a']`**. Sorting a dict gives keys, ordered here by their values. (See Q52.)

</details>

**M111.** What does this print?

```python
print(type(sorted("cab")).__name__, type(sorted((2, 1))).__name__)
```

- A) `str tuple`
- B) `str list`
- C) `list tuple`
- D) `list list`

<details>
<summary>Answer</summary>

**D) `list list`**. `sorted()` always returns a list. (See Q53.)

</details>

**M112.** What does this print?

```python
print("".join(sorted("cab")))
```

- A) `['a', 'b', 'c']`
- B) `abc`
- C) `TypeError`
- D) `cab`

<details>
<summary>Answer</summary>

**B) `abc`**. `join()` turns the sorted list back into a string. (See Q53.)

</details>

**M113.** What does this print?

```python
print(sorted(["b", "A", "C"]))
```

- A) `['b', 'C', 'A']`
- B) `TypeError`
- C) `['A', 'C', 'b']`
- D) `['A', 'b', 'C']`

<details>
<summary>Answer</summary>

**C) `['A', 'C', 'b']`**. Uppercase letters sort before lowercase. (See Q54.)

</details>

**M114.** What does this print?

```python
print(sorted(["b", "A", "C"], key=str.lower))
```

- A) `['a', 'b', 'c']`
- B) `['A', 'b', 'C']`
- C) `TypeError`
- D) `['A', 'C', 'b']`

<details>
<summary>Answer</summary>

**B) `['A', 'b', 'C']`**. The key only changes the comparison. Items stay unchanged. (See Q54.)

</details>

**M115.** What does this print?

```python
print(sorted(["10", "9", "100"]))
```

- A) `['10', '100', '9']`
- B) `[9, 10, 100]`
- C) `['9', '10', '100']`
- D) `['100', '10', '9']`

<details>
<summary>Answer</summary>

**A) `['10', '100', '9']`**. Strings compare character by character. (See Q54.)

</details>

**M116.** What does this print?

```python
print(sorted(["10", "9", "100"], key=int))
```

- A) `['10', '100', '9']`
- B) `TypeError`
- C) `['9', '10', '100']`
- D) `[9, 10, 100]`

<details>
<summary>Answer</summary>

**C) `['9', '10', '100']`**. It sorts by number, but the items stay as strings. (See Q54.)

</details>

**M117.** What does this print?

```python
print(sorted(["kiwi", "fig", "pear"], key=len))
```

- A) `['fig', 'kiwi', 'pear']`
- B) `['fig', 'pear', 'kiwi']`
- C) `['kiwi', 'pear', 'fig']`
- D) `['kiwi', 'fig', 'pear']`

<details>
<summary>Answer</summary>

**A) `['fig', 'kiwi', 'pear']`**. Python's sort is stable, so `kiwi` stays before `pear`. (See Q54.)

</details>

**M118.** What does this print?

```python
print(sorted([1, "a"]))
```

- A) `ValueError`
- B) `TypeError`
- C) `['a', 1]`
- D) `[1, 'a']`

<details>
<summary>Answer</summary>

**B) `TypeError`**. `int` and `str` can't be compared. (See Q54.)

</details>

**M119.** What does this print?

```python
d = {"b": 1, "a": 2}
print(sorted(d))
```

- A) `['b', 'a']`
- B) `[('a', 2), ('b', 1)]`
- C) `[1, 2]`
- D) `['a', 'b']`

<details>
<summary>Answer</summary>

**D) `['a', 'b']`**. Sorting a dict sorts its keys only. (See Q55.)

</details>

**M120.** What does this print?

```python
d = {"a": 3, "b": 1}
print(dict(sorted(d.items(), key=lambda p: p[1])))
```

- A) `{'a': 3, 'b': 1}`
- B) `['b', 'a']`
- C) `[('b', 1), ('a', 3)]`
- D) `{'b': 1, 'a': 3}`

<details>
<summary>Answer</summary>

**D) `{'b': 1, 'a': 3}`**. `p[1]` is the value, and `dict()` rebuilds a dictionary. (See Q55.)

</details>

**M121.** What does this print?

```python
print(sorted(["cat", "dog", "apple"], reverse=True))
```

- A) `['apple', 'dog', 'cat']`
- B) `['dog', 'cat', 'apple']`
- C) `['cat', 'dog', 'apple']`
- D) `['apple', 'cat', 'dog']`

<details>
<summary>Answer</summary>

**B) `['dog', 'cat', 'apple']`**. `reverse=True` gives Z to A. (See Q57.)

</details>

**M122.** What does this print?

```python
print(sum(c in "aeiou" for c in "apple"))
```

- A) `TypeError`
- B) `1`
- C) `5`
- D) `2`

<details>
<summary>Answer</summary>

**D) `2`**. Each `True` counts as 1, so `sum()` counts the vowels. (See Q58.)

</details>

**M123.** What does this print?

```python
print(sorted(["java", "Python"], key=lambda w: "py" not in w.lower()))
```

- A) `['java', 'Python']`
- B) `TypeError`
- C) `[False, True]`
- D) `['Python', 'java']`

<details>
<summary>Answer</summary>

**D) `['Python', 'java']`**. `False` sorts before `True`, so words containing "py" go first. (See Q58, Q59.)

</details>

**M124.** What does this print?

```python
d = {"a12": 1, "abc": 2}
print(dict(sorted(d.items(), key=lambda p: sum(c.isdigit() for c in p[0]))))
```

- A) `['abc', 'a12']`
- B) `TypeError`
- C) `{'abc': 2, 'a12': 1}`
- D) `{'a12': 1, 'abc': 2}`

<details>
<summary>Answer</summary>

**C) `{'abc': 2, 'a12': 1}`**. `abc` has 0 digits, and `a12` has 2. (See Q59.)

</details>

##### Sorting by multiple criteria

**M125.** What does this print?

```python
rows = [("a", 2), ("b", 1), ("c", 2)]
print(sorted(rows, key=lambda t: (-t[1], t[0])))
```

- A) `[('c', 2), ('a', 2), ('b', 1)]`
- B) `[('b', 1), ('a', 2), ('c', 2)]`
- C) `TypeError`
- D) `[('a', 2), ('c', 2), ('b', 1)]`

<details>
<summary>Answer</summary>

**D) `[('a', 2), ('c', 2), ('b', 1)]`**. Highest number first, then A to Z. (See Q60.)

</details>

**M126.** What does this print?

```python
print(sorted([True, False, True]))
```

- A) `[True, False, True]`
- B) `[True, True, False]`
- C) `TypeError`
- D) `[False, True, True]`

<details>
<summary>Answer</summary>

**D) `[False, True, True]`**. `False` is 0 and `True` is 1. (See Q61.)

</details>

**M127.** Which key puts in-stock products first?

- A) `p["in_stock"]`
- B) `not p["in_stock"]`
- C) `len(p)`
- D) `-p["price"]`

<details>
<summary>Answer</summary>

**B) `not p["in_stock"]`**. Items in stock get `False`, which sorts first. (See Q61.)

</details>

**M128.** In a sort key, how do you put the highest severity first?

- A) `-t["severity"]`
- B) `t["severity"][::-1]`
- C) `t["severity"]`
- D) `not t["severity"]`

<details>
<summary>Answer</summary>

**A) `-t["severity"]`**. The minus sign flips number order. (See Q62.)

</details>

**M129.** Why do ISO dates like `"2026-01-05"` sort correctly as plain text?

- A) Year, month, and day run from largest to smallest unit
- B) Dashes are ignored while sorting
- C) Strings sort by length first
- D) Python detects dates automatically

<details>
<summary>Answer</summary>

**A) Year, month, and day run from largest to smallest unit**. Text comparison goes left to right, the same order as date size. (See Q62, Q66.)

</details>

**M130.** What is the best key for department, last name, then first name, all A to Z?

- A) `[-e["dept"], e["last"]]`
- B) `(e["dept"], e["last"], e["first"])`
- C) `len(e["dept"])`
- D) `e["dept"] + e["last"]`

<details>
<summary>Answer</summary>

**B) `(e["dept"], e["last"], e["first"])`**. A tuple key compares each part in turn. (See Q63.)

</details>

**M131.** What does this print?

```python
print(sorted(["a"], key=lambda s: -s))
```

- A) `[]`
- B) `['a']`
- C) `TypeError`
- D) `ValueError`

<details>
<summary>Answer</summary>

**C) `TypeError`**. You can't negate a string, so use `reverse=True` or a separate sort pass. (See Q64.)

</details>

**M132.** Sort key for highest rating first, then cheapest, then shortest:

- A) `(t["rating"], -t["price"], -t["days"])`
- B) `(-t["rating"], t["price"], t["days"])`
- C) `(t["rating"], t["price"], t["days"])`
- D) `(-t["rating"], -t["price"], -t["days"])`

<details>
<summary>Answer</summary>

**B) `(-t["rating"], t["price"], t["days"])`**. Only the rating needs reversing. (See Q64.)

</details>

**M133.** Sort key for exact matches first, then highest score, then title A to Z:

- A) `(r["exact"], -r["score"], r["title"])`
- B) `(not r["exact"], -r["score"], r["title"])`
- C) `(not r["exact"], r["score"], -r["title"])`
- D) `(r["exact"], r["score"], r["title"])`

<details>
<summary>Answer</summary>

**B) `(not r["exact"], -r["score"], r["title"])`**. Use `not` for True-first and a minus sign for highest-first. (See Q65.)

</details>

**M134.** Date and ID must both go highest first, and the date is a string. What do you use?

- A) `key=lambda o: (o["date"], o["id"]), reverse=True`
- B) `key=lambda o: not o["date"]`
- C) `key=lambda o: (o["date"], -o["id"])`
- D) `key=lambda o: (-o["date"], -o["id"])`

<details>
<summary>Answer</summary>

**A) `key=lambda o: (o["date"], o["id"]), reverse=True`**. `reverse=True` flips the whole tuple, and a date string can't be negated. (See Q66.)

</details>

**M135.** What does this print?

```python
order = {"blocked": 0, "todo": 1, "done": 2}
print(sorted(["done", "blocked", "todo"], key=lambda s: order[s]))
```

- A) `['done', 'todo', 'blocked']`
- B) `['blocked', 'done', 'todo']`
- C) `[0, 1, 2]`
- D) `['blocked', 'todo', 'done']`

<details>
<summary>Answer</summary>

**D) `['blocked', 'todo', 'done']`**. The dict gives each status its position. (See Q67.)

</details>

#### Dictionaries

##### Dictionaries and complexity

**M136.** What does this print?

```python
d = {}
d["z"] = 1
d["a"] = 2
print(list(d), sorted(d))
```

- A) `['z', 'a'] ['z', 'a']`
- B) `['z', 'a'] ['a', 'z']`
- C) `[1, 2] ['a', 'z']`
- D) `['a', 'z'] ['a', 'z']`

<details>
<summary>Answer</summary>

**B) `['z', 'a'] ['a', 'z']`**. Insertion order isn't the same as sorted order. (See Q68.)

</details>

**M137.** What is the time to insert at the beginning of a list?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**C) O(n)**. Every existing item has to shift right. (See Q69.)

</details>

**M138.** What is the amortized time of `list.append()`?

- A) O(log n)
- B) O(1)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**B) O(1)**. A resize is only needed occasionally. (See Q69.)

</details>

**M139.** Which operation is slowest on a large list?

- A) `items.append(1)`
- B) `items[5]`
- C) `items.pop(0)`
- D) `items.pop()`

<details>
<summary>Answer</summary>

**C) `items.pop(0)`**. `pop(0)` shifts every remaining item left. (See Q69.)

</details>

**M140.** What is the average time to look up, insert, or delete by key in a dict?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n log n)

<details>
<summary>Answer</summary>

**A) O(1)**. Dicts use a hash table. The worst case is O(n). (See Q69.)

</details>

**M141.** Why can't a list be a dict key?

- A) It's mutable, so it's unhashable
- B) Keys must be strings
- C) Lists have no order
- D) It's too large to store

<details>
<summary>Answer</summary>

**A) It's mutable, so it's unhashable**. A key's hash must stay stable. Use a tuple instead. (See Q70.)

</details>

##### Merging and safe dictionary access

**M142.** What does this print?

```python
print({"x": 1, "y": 2} | {"y": 9, "z": 3})
```

- A) `{'x': 1, 'z': 3, 'y': 9}`
- B) `{'x': 1, 'y': 2, 'z': 3}`
- C) `{'x': 1, 'y': 9, 'z': 3}`
- D) `KeyError`

<details>
<summary>Answer</summary>

**C) `{'x': 1, 'y': 9, 'z': 3}`**. The right value wins, the key keeps its place, and new keys go at the end. (See Q94, Q95.)

</details>

**M143.** What does this print?

```python
print({**{"a": 1}, **{"a": 2, "b": 3}})
```

- A) `{'a': 2, 'b': 3}`
- B) `TypeError`
- C) `{'a': 1, 'b': 3}`
- D) `{'a': [1, 2], 'b': 3}`

<details>
<summary>Answer</summary>

**A) `{'a': 2, 'b': 3}`**. Later dictionaries overwrite earlier ones. (See Q94.)

</details>

**M144.** What does this print?

```python
a = {"x": 1}
r = a.update({"y": 2})
print(r, a)
```

- A) `None {'x': 1}`
- B) `{'x': 1, 'y': 2} {'x': 1, 'y': 2}`
- C) `None {'x': 1, 'y': 2}`
- D) `{'x': 1, 'y': 2} {'x': 1}`

<details>
<summary>Answer</summary>

**C) `None {'x': 1, 'y': 2}`**. `update()` changes the dict in place and returns `None`. (See Q94.)

</details>

**M145.** What does this print?

```python
print({"a": 1, "b": 2}.keys() & {"b": 3}.keys())
```

- A) `{'a', 'b'}`
- B) `{'b'}`
- C) `TypeError`
- D) `{'a'}`

<details>
<summary>Answer</summary>

**B) `{'b'}`**. Key views support set operators, so `&` finds shared keys. (See Q95.)

</details>

**M146.** What does this print?

```python
print({"a": 1} | [("b", 2)])
```

- A) `KeyError`
- B) `[('b', 2)]`
- C) `{'a': 1, 'b': 2}`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. Both sides of `|` must be dictionaries. (See Q96.)

</details>

**M147.** What does this print?

```python
d = {"a": 1}
d |= [("b", 2)]
print(d)
```

- A) `[('b', 2)]`
- B) `{'a': 1}`
- C) `TypeError`
- D) `{'a': 1, 'b': 2}`

<details>
<summary>Answer</summary>

**D) `{'a': 1, 'b': 2}`**. The in-place form accepts a list of pairs. (See Q96.)

</details>

**M148.** What does this print?

```python
d = {"a": 1}
print(d["z"])
```

- A) `0`
- B) `IndexError`
- C) `KeyError`
- D) `None`

<details>
<summary>Answer</summary>

**C) `KeyError`**. Square brackets raise an error for a missing key. (See Q97.)

</details>

**M149.** What does this print?

```python
d = {"a": 1}
print(d.get("z"), d.get("z", 0))
```

- A) `0 0`
- B) `None None`
- C) `KeyError`
- D) `None 0`

<details>
<summary>Answer</summary>

**D) `None 0`**. `get()` returns `None` or your default. (See Q98.)

</details>

**M150.** What does this print?

```python
print({"a": None}.get("a", "x"))
```

- A) `KeyError`
- B) `None`
- C) `a`
- D) `x`

<details>
<summary>Answer</summary>

**B) `None`**. The key exists, so its stored value is returned, not the default. (See Q98.)

</details>

**M151.** What does this print?

```python
print("z" in {"z": 1}, 1 in {"z": 1})
```

- A) `False True`
- B) `True True`
- C) `True False`
- D) `False False`

<details>
<summary>Answer</summary>

**C) `True False`**. `in` checks keys, not values. (See Q98.)

</details>

**M152.** Which one is LBYL (Look Before You Leap)?

- A) try `d["k"]`, then `except KeyError`
- B) `if "k" in d: use(d["k"])`
- C) `d.setdefault("k", 0)`
- D) `d.get("k", 0)`

<details>
<summary>Answer</summary>

**B) `if "k" in d: use(d["k"])`**. LBYL checks first. (See Q98.)

</details>

**M153.** Which one is EAFP (Easier to Ask Forgiveness than Permission)?

- A) `if "k" in d: use(d["k"])`
- B) `len(d) > 0`
- C) `d.get("k", 0)`
- D) try `d["k"]`, then `except KeyError`

<details>
<summary>Answer</summary>

**D) try `d["k"]`, then `except KeyError`**. EAFP tries first and handles the error. (See Q98.)

</details>

**M154.** Which is the simplest choice when a missing key should just give a default?

- A) `d.get(key, default)`
- B) `if key in d`
- C) `try/except KeyError`
- D) `d[key]`

<details>
<summary>Answer</summary>

**A) `d.get(key, default)`**. `get()` needs no extra branch. (See Q98.)

</details>

#### Comprehensions and iteration

##### Creating dictionaries and lists

**M155.** What does this print?

```python
print({"a": 1, "a": 2})
```

- A) `KeyError`
- B) `{'a': 1}`
- C) `{'a': [1, 2]}`
- D) `{'a': 2}`

<details>
<summary>Answer</summary>

**D) `{'a': 2}`**. The last value wins for a repeated key. (See Q71.)

</details>

**M156.** What does this print?

```python
print(dict(zip(["a", "b"], [1, 2, 3])))
```

- A) `TypeError`
- B) `{'a': 1, 'b': 2, None: 3}`
- C) `ValueError`
- D) `{'a': 1, 'b': 2}`

<details>
<summary>Answer</summary>

**D) `{'a': 1, 'b': 2}`**. `zip()` stops at the shortest input. (See Q71.)

</details>

**M157.** What does this print?

```python
print(dict(enumerate("ab")))
```

- A) `{'a': 0, 'b': 1}`
- B) `{0: 'a', 1: 'b'}`
- C) `{1: 'a', 2: 'b'}`
- D) `['a', 'b']`

<details>
<summary>Answer</summary>

**B) `{0: 'a', 1: 'b'}`**. `enumerate()` gives `(index, item)` pairs. (See Q71, Q81.)

</details>

**M158.** What does this print?

```python
print(dict.fromkeys(["a", "b"], 0))
```

- A) `{'a': 0, 'b': 0}`
- B) `{0: 'a', 0: 'b'}`
- C) `{'a': 0}`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `{'a': 0, 'b': 0}`**. Every key gets the same default value. (See Q71.)

</details>

**M159.** What does this print?

```python
from collections import Counter
print(Counter("aab")["a"])
```

- A) `1`
- B) `3`
- C) `KeyError`
- D) `2`

<details>
<summary>Answer</summary>

**D) `2`**. `Counter` counts repeated items. (See Q71.)

</details>

**M160.** What does this print?

```python
import json
print(json.loads('{"a": 1}')["a"])
```

- A) `{'a': 1}`
- B) `a`
- C) `KeyError`
- D) `1`

<details>
<summary>Answer</summary>

**D) `1`**. `json.loads()` turns a JSON string into a dict. (See Q71.)

</details>

**M161.** What does this print?

```python
d = dict.fromkeys(["a", "b"], [])
d["a"].append(1)
print(d)
```

- A) `{'a': [1], 'b': []}`
- B) `KeyError`
- C) `{'a': [1], 'b': [1]}`
- D) `{'a': 1, 'b': []}`

<details>
<summary>Answer</summary>

**C) `{'a': [1], 'b': [1]}`**. Every key shares the same list. (See Q72.)

</details>

**M162.** What does this print?

```python
d = {k: [] for k in ["a", "b"]}
d["a"].append(1)
print(d)
```

- A) `KeyError`
- B) `{'a': [1], 'b': [1]}`
- C) `{'a': [1], 'b': []}`
- D) `{'a': 1, 'b': []}`

<details>
<summary>Answer</summary>

**C) `{'a': [1], 'b': []}`**. The comprehension makes a new list for each key. (See Q72.)

</details>

**M163.** What does this print?

```python
print({n: n * n for n in [1, 2, 3]})
```

- A) `{1: 2, 2: 4, 3: 6}`
- B) `{1: 1, 2: 4, 3: 9}`
- C) `[1, 4, 9]`
- D) `{1, 4, 9}`

<details>
<summary>Answer</summary>

**B) `{1: 1, 2: 4, 3: 9}`**. Each number becomes a key, and its square the value. (See Q73.)

</details>

**M164.** What does this print?

```python
print({w: len(w) for w in ["hi", "hey"]})
```

- A) `{'hi': 2, 'hey': 3}`
- B) `[2, 3]`
- C) `{2: 'hi', 3: 'hey'}`
- D) `{'hi': 3, 'hey': 3}`

<details>
<summary>Answer</summary>

**A) `{'hi': 2, 'hey': 3}`**. Each word becomes a key, and its length the value. (See Q74.)

</details>

**M165.** What does this print?

```python
users = [{"id": 7, "name": "Asha"}]
print({u["id"]: u for u in users}[7]["name"])
```

- A) `KeyError`
- B) `TypeError`
- C) `7`
- D) `Asha`

<details>
<summary>Answer</summary>

**D) `Asha`**. Now users can be found directly by ID. (See Q75.)

</details>

**M166.** What does this print?

```python
print({k: v for k, v in {"a": 40, "b": 60}.items() if v >= 60})
```

- A) `{'a': 40, 'b': 60}`
- B) `{'b': 60}`
- C) `{}`
- D) `{'a': 40}`

<details>
<summary>Answer</summary>

**B) `{'b': 60}`**. The `if` at the end filters entries. (See Q76, Q80.)

</details>

**M167.** What does this print?

```python
print(list({"a": 1}))
```

- A) `[1]`
- B) `TypeError`
- C) `['a']`
- D) `[('a', 1)]`

<details>
<summary>Answer</summary>

**C) `['a']`**. A dict gives its keys when you loop over it. (See Q77.)

</details>

**M168.** What does this print?

```python
print(list("hi"), list(range(2)))
```

- A) `['hi'] [0, 1]`
- B) `['hi'] [2]`
- C) `['h', 'i'] [0, 1]`
- D) `['h', 'i'] [1, 2]`

<details>
<summary>Answer</summary>

**C) `['h', 'i'] [0, 1]`**. `list()` loops over any iterable. (See Q77.)

</details>

**M169.** What does this print?

```python
print([1, 2] + [3])
```

- A) `[1, 2, [3]]`
- B) `TypeError`
- C) `[4, 5]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**D) `[1, 2, 3]`**. `+` joins two lists into a new one. (See Q77.)

</details>

**M170.** What does this print?

```python
print([int(n) for n in "1,2".split(",")])
```

- A) `[12]`
- B) `['1', '2']`
- C) `[1, 2]`
- D) `ValueError`

<details>
<summary>Answer</summary>

**C) `[1, 2]`**. `split()` gives strings, and `int()` converts each one. (See Q78.)

</details>

**M171.** What does this print?

```python
print([x * 2 for x in range(3) if x])
```

- A) `[2]`
- B) `[2, 4]`
- C) `[0, 2, 4]`
- D) `[0, 1, 2]`

<details>
<summary>Answer</summary>

**B) `[2, 4]`**. `0` is falsy, so it's skipped. (See Q78.)

</details>

**M172.** What does this print?

```python
print(sorted(set(["dog", "cat", "dog"])))
```

- A) `['dog', 'cat']`
- B) `{'cat', 'dog'}`
- C) `['cat', 'dog', 'dog']`
- D) `['cat', 'dog']`

<details>
<summary>Answer</summary>

**D) `['cat', 'dog']`**. Remove duplicates, then sort. (See Q79.)

</details>

**M173.** What does this print?

```python
print({label: i for i, label in enumerate(["cat", "dog"])})
```

- A) `{'cat': 1, 'dog': 2}`
- B) `{0: 'cat', 1: 'dog'}`
- C) `['cat', 'dog']`
- D) `{'cat': 0, 'dog': 1}`

<details>
<summary>Answer</summary>

**D) `{'cat': 0, 'dog': 1}`**. Labels become keys, and positions become IDs. (See Q81.)

</details>

**M174.** What does this print?

```python
print({v: k for k, v in {"a": 1, "b": 2}.items()})
```

- A) `{'a': 1, 'b': 2}`
- B) `{1: 2}`
- C) `TypeError`
- D) `{1: 'a', 2: 'b'}`

<details>
<summary>Answer</summary>

**D) `{1: 'a', 2: 'b'}`**. Swapping `k` and `v` inverts the dictionary. (See Q82.)

</details>

**M175.** What does this print?

```python
print({c: 1 for c in "aab"})
```

- A) `{'a': 1, 'b': 1}`
- B) `{'a': 2, 'b': 1}`
- C) `['a', 'a', 'b']`
- D) `{'a': 1, 'a': 1, 'b': 1}`

<details>
<summary>Answer</summary>

**A) `{'a': 1, 'b': 1}`**. Repeated keys collapse into one. (See Q82.)

</details>

##### enumerate, zip, and unpacking

**M176.** What does this print?

```python
print(list(enumerate(["a", "b"], start=1)))
```

- A) `[(1, 'a'), (2, 'b')]`
- B) `[('a', 1), ('b', 2)]`
- C) `{1: 'a', 2: 'b'}`
- D) `[(0, 'a'), (1, 'b')]`

<details>
<summary>Answer</summary>

**A) `[(1, 'a'), (2, 'b')]`**. `start=1` sets the first number. (See Q83.)

</details>

**M177.** What does this print?

```python
print(list(zip([1, 2], "abc")))
```

- A) `[(1, 'a'), (2, 'b')]`
- B) `[(1, 'a'), (2, 'b'), (None, 'c')]`
- C) `[1, 2, 'a', 'b', 'c']`
- D) `ValueError`

<details>
<summary>Answer</summary>

**A) `[(1, 'a'), (2, 'b')]`**. Without `strict=True`, `zip()` silently drops the extra item. (See Q84.)

</details>

**M178.** What does this print?

```python
print(list(zip([1, 2], "abc", strict=True)))
```

- A) `TypeError`
- B) `IndexError`
- C) `[(1, 'a'), (2, 'b')]`
- D) `ValueError`

<details>
<summary>Answer</summary>

**D) `ValueError`**. `strict=True` raises an error when lengths differ. (See Q84.)

</details>

**M179.** What does this print?

```python
names, scores = zip(*[("a", 1), ("b", 2)])
print(names, scores)
```

- A) `['a', 'b'] [1, 2]`
- B) `('a', 1) ('b', 2)`
- C) `TypeError`
- D) `('a', 'b') (1, 2)`

<details>
<summary>Answer</summary>

**D) `('a', 'b') (1, 2)`**. `zip(*pairs)` separates the pairs into tuples. (See Q85.)

</details>

**M180.** What does this print?

```python
names, scores = zip(*{"a": 1, "b": 2}.items())
print(scores)
```

- A) `('a', 'b')`
- B) `[1, 2]`
- C) `(1, 2)`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `(1, 2)`**. `.items()` gives pairs. (See Q86.)

</details>

**M181.** What does this print?

```python
rows = [{"n": "a", "s": 1}, {"n": "b", "s": 2}]
names, scores = zip(*[(r["n"], r["s"]) for r in rows])
print(names)
```

- A) `KeyError`
- B) `['a', 'b']`
- C) `(1, 2)`
- D) `('a', 'b')`

<details>
<summary>Answer</summary>

**D) `('a', 'b')`**. Build pairs first, then unzip them. (See Q87.)

</details>

**M182.** What does this print?

```python
print(list((1, 2)))
```

- A) `[1, 2]`
- B) `[(1, 2)]`
- C) `(1, 2)`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `[1, 2]`**. `list()` converts a tuple. (See Q88.)

</details>

**M183.** What does this print?

```python
a, b = map(list, zip(*[("x", 1), ("y", 2)]))
print(a, b)
```

- A) `('x', 'y') (1, 2)`
- B) `['x', 'y'] [1, 2]`
- C) `TypeError`
- D) `['x', 1] ['y', 2]`

<details>
<summary>Answer</summary>

**B) `['x', 'y'] [1, 2]`**. `map(list, ...)` turns each tuple into a list. (See Q89.)

</details>

**M184.** What does this print?

```python
first, *rest = [1, 2, 3]
print(rest)
```

- A) `3`
- B) `(2, 3)`
- C) `[2, 3]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**C) `[2, 3]`**. `*rest` collects the remaining items into a list. (See Q92.)

</details>

### OOP

#### Classes and objects

##### `__init__` and `self`

**M185.** When does Python call `__init__`?

- A) Automatically, after the instance is created
- B) Before the instance exists
- C) Only when you call it directly
- D) When the class is defined

<details>
<summary>Answer</summary>

**A) Automatically, after the instance is created**. Python calls it right after `__new__` creates the instance. (See Q101.)

</details>

**M186.** Which method actually creates a new instance?

- A) `__call__`
- B) `__repr__`
- C) `__new__`
- D) `__init__`

<details>
<summary>Answer</summary>

**C) `__new__`**. `__new__` creates the instance, and `__init__` initializes it. (See Q102.)

</details>

**M187.** What does this print?
```python
class Model:
    def __init__(self):
        return 10

try:
    Model()
except TypeError:
    print("TypeError")
```

- A) `None`
- B) `10`
- C) `TypeError`
- D) Nothing

<details>
<summary>Answer</summary>

**C) `TypeError`**. `__init__` must return `None`. (See Q103.)

</details>

**M188.** What does this print?
```python
class Model:
    def __init__(self, name):
        self.name = name

class Classifier(Model):
    pass

print(Classifier("rf").name)
```

- A) `rf`
- B) `AttributeError`
- C) `None`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `rf`**. A subclass without its own `__init__` inherits the parent's. (See Q104.)

</details>

**M189.** What does this print?
```python
class Model:
    def __init__(self):
        self.name = "base"

class Classifier(Model):
    def __init__(self):
        self.size = 1

print(hasattr(Classifier(), "name"))
```

- A) `base`
- B) `True`
- C) `AttributeError`
- D) `False`

<details>
<summary>Answer</summary>

**D) `False`**. The subclass `__init__` replaces the parent's, and `super().__init__()` was never called. (See Q104.)

</details>

**M190.** Is `self` a keyword in Python?

- A) No, it's a built-in function
- B) No, it's a naming convention for the first parameter
- C) Yes, it's reserved
- D) Yes, but only inside `__init__`

<details>
<summary>Answer</summary>

**B) No, it's a naming convention for the first parameter**. Any name would work, but always use `self`. (See Q101.)

</details>

##### Class and instance attributes

**M191.** What does this print?
```python
class Model:
    tags = []

a = Model()
b = Model()
a.tags.append("x")
print(b.tags)
```

- A) `AttributeError`
- B) `['x']`
- C) `None`
- D) `[]`

<details>
<summary>Answer</summary>

**B) `['x']`**. `tags` is a class attribute shared by all instances, and `append()` mutates it. (See Q105.)

</details>

**M192.** What does this print?
```python
class Model:
    count = 0

a = Model()
a.count += 1
print(a.count, Model.count)
```

- A) `1 0`
- B) `1 1`
- C) `0 1`
- D) `0 0`

<details>
<summary>Answer</summary>

**A) `1 0`**. `a.count += 1` reads the class value, then creates an instance attribute. (See Q105.)

</details>

**M193.** What does this print?
```python
class Model:
    count = 0

a = Model()
Model.count = 5
print(a.count)
```

- A) `None`
- B) `AttributeError`
- C) `0`
- D) `5`

<details>
<summary>Answer</summary>

**D) `5`**. `a` has no instance attribute, so lookup finds the class attribute. (See Q105.)

</details>

##### Instance, class, and static methods

**M194.** What does a class method receive as its first argument?

- A) Nothing
- B) The class it was called on
- C) The parent class only
- D) The instance

<details>
<summary>Answer</summary>

**B) The class it was called on**. It receives `cls`. (See Q106.)

</details>

**M195.** What does a static method receive automatically?

- A) Nothing extra
- B) `self`
- C) `cls`
- D) Both `self` and `cls`

<details>
<summary>Answer</summary>

**A) Nothing extra**. It behaves like a plain function stored on the class. (See Q106.)

</details>

**M196.** What does this print?
```python
class Config:
    @classmethod
    def make(cls):
        return cls()

class Advanced(Config):
    pass

print(type(Advanced.make()).__name__)
```

- A) `Advanced`
- B) `type`
- C) `TypeError`
- D) `Config`

<details>
<summary>Answer</summary>

**A) `Advanced`**. `cls` is the class the method was called on, so subclasses get instances of themselves. (See Q107.)

</details>

**M197.** What is the most typical use of a class method?

- A) An alternative constructor such as `from_dict()`
- B) Making a method private
- C) Changing one instance's data
- D) Speeding up attribute access

<details>
<summary>Answer</summary>

**A) An alternative constructor such as `from_dict()`**. It builds an instance in a subclass-friendly way. (See Q107.)

</details>

**M198.** What does this print?
```python
class Tool:
    def helper(value):
        return value

try:
    print(Tool().helper(1))
except TypeError:
    print("TypeError")
```

- A) `None`
- B) `TypeError`
- C) `1`
- D) `Tool`

<details>
<summary>Answer</summary>

**B) `TypeError`**. Without `@staticmethod`, a call through an instance passes an extra argument. (See Q106.)

</details>

**M199.** Can you call a class method on an instance?

- A) No, it raises `TypeError`
- B) Yes, and it still receives the class
- C) No, it raises `AttributeError`
- D) Yes, and it receives the instance

<details>
<summary>Answer</summary>

**B) Yes, and it still receives the class**. Both `Model.make()` and `model.make()` pass the class as `cls`. (See Q106.)

</details>

#### Four pillars

##### Pillars and encapsulation

**M200.** Which of these is NOT one of the four pillars of OOP?

- A) Encapsulation
- B) Polymorphism
- C) Abstraction
- D) Compilation

<details>
<summary>Answer</summary>

**D) Compilation**. The four pillars are encapsulation, abstraction, inheritance, and polymorphism. (See Q99.)

</details>

**M201.** Which statement about a class and an object is correct?

- A) An object is the blueprint, and a class is an instance
- B) A class is the blueprint, and an object is an instance built from it
- C) They're two names for the same thing
- D) A class can create only one object

<details>
<summary>Answer</summary>

**B) A class is the blueprint, and an object is an instance built from it**. One class can create many objects. (See Q100.)

</details>

**M202.** What does a single leading underscore, as in `_name`, mean?

- A) Internal by convention, not enforced
- B) Truly private
- C) Name mangled by Python
- D) A class attribute

<details>
<summary>Answer</summary>

**A) Internal by convention, not enforced**. Python doesn't enforce it. (See Q108.)

</details>

**M203.** What does this print?
```python
class Account:
    def __init__(self):
        self.__balance = 100

print(Account()._Account__balance)
```

- A) `100`
- B) `AttributeError`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**A) `100`**. `__balance` is name-mangled to `_Account__balance`, so it's still reachable. (See Q108.)

</details>

**M204.** What does this print?
```python
class Account:
    def __init__(self):
        self.__balance = 100

try:
    print(Account().__balance)
except AttributeError:
    print("AttributeError")
```

- A) `AttributeError`
- B) `None`
- C) `TypeError`
- D) `100`

<details>
<summary>Answer</summary>

**A) `AttributeError`**. Name mangling stores it as `_Account__balance`. (See Q108.)

</details>

**M205.** What does this print?
```python
class Circle:
    def __init__(self, r):
        self.r = r

    @property
    def diameter(self):
        return self.r * 2

print(Circle(2).diameter)
```

- A) `<bound method>`
- B) `2`
- C) `TypeError`
- D) `4`

<details>
<summary>Answer</summary>

**D) `4`**. `@property` lets a method be read like an attribute, with no parentheses. (See Q109.)

</details>

**M206.** What does this print?
```python
class Circle:
    @property
    def r(self):
        return 1

circle = Circle()
try:
    circle.r = 5
    print("set")
except AttributeError:
    print("AttributeError")
```

- A) `5`
- B) `set`
- C) `AttributeError`
- D) `1`

<details>
<summary>Answer</summary>

**C) `AttributeError`**. A property without a setter is read-only. (See Q109.)

</details>

##### Polymorphism and abstract classes

**M207.** What is duck typing?

- A) Python checks whether an object has the needed behaviour, not its class
- B) Every class must inherit a common base
- C) Types are checked at compile time
- D) Python converts objects to the needed type

<details>
<summary>Answer</summary>

**A) Python checks whether an object has the needed behaviour, not its class**. If it has `predict()`, you can call it. (See Q110.)

</details>

**M208.** What does this print?
```python
class Model:
    def predict(self):
        return "one"

    def predict(self):
        return "two"

print(Model().predict())
```

- A) `SyntaxError`
- B) `one`
- C) `two`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `two`**. Python has no overloading: the second `def` replaces the first. (See Q110.)

</details>

**M209.** What does this print?
```python
from abc import ABC, abstractmethod

class Base(ABC):
    @abstractmethod
    def run(self):
        ...

try:
    Base()
    print("created")
except TypeError:
    print("TypeError")
```

- A) `AttributeError`
- B) `created`
- C) `None`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. A class with unimplemented abstract methods can't be instantiated. (See Q111.)

</details>

**M210.** What does this print?
```python
from abc import ABC, abstractmethod

class Base(ABC):
    @abstractmethod
    def run(self):
        ...

class Child(Base):
    pass

try:
    Child()
    print("created")
except TypeError:
    print("TypeError")
```

- A) `TypeError`
- B) `None`
- C) `AttributeError`
- D) `created`

<details>
<summary>Answer</summary>

**A) `TypeError`**. `Child` didn't implement `run()`, so it's still abstract. (See Q111.)

</details>

##### Inheritance and composition

**M211.** Which statement about `super()` is correct?

- A) It always means the direct parent
- B) It creates a parent instance
- C) It finds the next implementation in the MRO
- D) It only works in `__init__`

<details>
<summary>Answer</summary>

**C) It finds the next implementation in the MRO**. It follows the MRO of `type(self)`. (See Q112.)

</details>

**M212.** What does this print?
```python
class Model:
    def describe(self):
        return "base"

class Tree(Model):
    def describe(self):
        return "tree " + super().describe()

print(Tree().describe())
```

- A) `tree`
- B) `base`
- C) `RecursionError`
- D) `tree base`

<details>
<summary>Answer</summary>

**D) `tree base`**. The override calls the parent version through `super()`. (See Q112.)

</details>

**M213.** Does Python check that an override has the same signature as its parent?

- A) Only for `__init__`
- B) Yes, at the first call
- C) No, it matches by name only
- D) Yes, at class definition

<details>
<summary>Answer</summary>

**C) No, it matches by name only**. A different signature isn't an error. (See Q112.)

</details>

**M214.** What does this print?
```python
class A:
    pass

class B(A):
    pass

b = B()
print(isinstance(b, A), type(b) is A)
```

- A) `False True`
- B) `True True`
- C) `False False`
- D) `True False`

<details>
<summary>Answer</summary>

**D) `True False`**. `isinstance()` accepts subclasses, while `type() is` matches the exact class. (See Q113.)

</details>

**M215.** What is the root class of every Python class?

- A) `object`
- B) `Base`
- C) `class`
- D) `type`

<details>
<summary>Answer</summary>

**A) `object`**. Every class ultimately inherits from `object`. (See Q112.)

</details>

**M216.** A `Pipeline` uses a scaler that you want to swap easily. What fits best?

- A) Inheritance
- B) A metaclass
- C) Multiple inheritance
- D) Composition

<details>
<summary>Answer</summary>

**D) Composition**. Composition models has-a, and inheritance models is-a. (See Q114.)

</details>

#### Multiple inheritance

##### MRO and the diamond problem

**M217.** Which algorithm does Python use to build the MRO?

- A) C3 linearization
- B) Breadth-first search
- C) Depth-first search
- D) Topological sort by name

<details>
<summary>Answer</summary>

**A) C3 linearization**. C3 respects base order and lists each class once. (See Q115.)

</details>

**M218.** How do you inspect a class's MRO?

- A) `dir(Cls)`
- B) `Cls.__mro__` or `Cls.mro()`
- C) `Cls.__bases__` only
- D) `type(Cls)`

<details>
<summary>Answer</summary>

**B) `Cls.__mro__` or `Cls.mro()`**. Both show the search order. (See Q115.)

</details>

**M219.** What does this print?
```python
class A:
    def who(self):
        return "A"

class B(A):
    def who(self):
        return "B"

class C(A):
    def who(self):
        return "C"

class D(B, C):
    pass

print(D().who())
```

- A) `A`
- B) `TypeError`
- C) `C`
- D) `B`

<details>
<summary>Answer</summary>

**D) `B`**. The MRO is `D, B, C, A, object`, so `B` is found first. (See Q115.)

</details>

**M220.** What does this print?
```python
class A:
    def who(self):
        return "A"

class B(A):
    def who(self):
        return "B" + super().who()

class C(A):
    def who(self):
        return "C" + super().who()

class D(B, C):
    pass

print(D().who())
```

- A) `BACA`
- B) `BCA`
- C) `BA`
- D) `CBA`

<details>
<summary>Answer</summary>

**B) `BCA`**. `super()` in `B` goes to `C`, the next class in `D`'s MRO. (See Q115.)

</details>

**M221.** What does this print?
```python
class A:
    pass

class B(A):
    pass

try:
    class C(A, B):
        pass
    print("ok")
except TypeError:
    print("TypeError")
```

- A) `ok`
- B) `AttributeError`
- C) `None`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. `A` before its own subclass `B` contradicts the hierarchy, so no consistent MRO exists. (See Q117.)

</details>

##### Mixins

**M222.** Where should a mixin go in the list of bases?

- A) Order never matters
- B) It must be the only base
- C) Before the main base class
- D) After the main base class

<details>
<summary>Answer</summary>

**C) Before the main base class**. Then its `super()` call can wrap the base's method. (See Q116.)

</details>

**M223.** What does this print?
```python
class Model:
    def predict(self):
        return "model"

class Mixin:
    def predict(self):
        return "mixin " + super().predict()

class Good(Mixin, Model):
    pass

class Bad(Model, Mixin):
    pass

print(Good().predict(), "|", Bad().predict())
```

- A) `mixin model | mixin model`
- B) `model | model`
- C) `model | mixin model`
- D) `mixin model | model`

<details>
<summary>Answer</summary>

**D) `mixin model | model`**. In `Bad`, `Model.predict()` is found first and the mixin never runs. (See Q116.)

</details>

**M224.** Why do cooperative `__init__` methods accept `**kwargs`?

- A) To make `__init__` run faster
- B) To create class attributes
- C) Each class takes its arguments and forwards the rest
- D) To avoid calling `super()`

<details>
<summary>Answer</summary>

**C) Each class takes its arguments and forwards the rest**. Every class in the MRO then gets what it needs. (See Q117.)

</details>

#### Special methods and dataclasses

##### Dunder methods

**M225.** What does this print?
```python
class Data:
    def __len__(self):
        return 3

print(len(Data()))
```

- A) `0`
- B) `None`
- C) `TypeError`
- D) `3`

<details>
<summary>Answer</summary>

**D) `3`**. `len()` calls `__len__`. (See Q118.)

</details>

**M226.** What does this print?
```python
class Data:
    def __call__(self, x):
        return x * 2

print(Data()(4))
```

- A) `8`
- B) `None`
- C) `4`
- D) `TypeError`

<details>
<summary>Answer</summary>

**A) `8`**. `__call__` makes an instance callable. (See Q118.)

</details>

**M227.** What does this print?
```python
class Data:
    def __repr__(self):
        return "repr"

print(Data())
```

- A) `repr`
- B) `TypeError`
- C) `<Data object>`
- D) `None`

<details>
<summary>Answer</summary>

**A) `repr`**. With no `__str__`, `print()` falls back to `__repr__`. (See Q119.)

</details>

**M228.** What does this print?
```python
class Data:
    def __str__(self):
        return "str"

    def __repr__(self):
        return "repr"

print([Data()], str(Data()))
```

- A) `[str] repr`
- B) `[repr] str`
- C) `[str] str`
- D) `[repr] repr`

<details>
<summary>Answer</summary>

**B) `[repr] str`**. Containers show `__repr__` of their items. (See Q119.)

</details>

**M229.** What does this print?
```python
class Data:
    def __len__(self):
        return -1

try:
    print(len(Data()))
except ValueError:
    print("ValueError")
```

- A) `-1`
- B) `TypeError`
- C) `ValueError`
- D) `0`

<details>
<summary>Answer</summary>

**C) `ValueError`**. `__len__` must return a non-negative integer. (See Q118.)

</details>

**M230.** What does this print?
```python
class Data:
    def __getitem__(self, index):
        return index * 2

print(Data()[3])
```

- A) `None`
- B) `TypeError`
- C) `6`
- D) `3`

<details>
<summary>Answer</summary>

**C) `6`**. `obj[key]` calls `__getitem__`. (See Q118.)

</details>

**M231.** What does this print?
```python
class Label:
    def __eq__(self, other):
        return True

try:
    print(len({Label()}))
except TypeError:
    print("TypeError")
```

- A) `1`
- B) `0`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**C) `TypeError`**. Defining `__eq__` sets `__hash__` to `None`, so instances are unhashable. (See Q120.)

</details>

**M232.** What should `__add__` return for an unsupported type?

- A) `NotImplemented`
- B) `None`
- C) `NotImplementedError`
- D) `False`

<details>
<summary>Answer</summary>

**A) `NotImplemented`**. Python then tries the other operand, and raises `TypeError` if that fails too. (See Q121.)

</details>

**M233.** Should you call `obj.__len__()` directly?

- A) Yes, it's always faster
- B) Yes, it's required for custom classes
- C) Only inside a class
- D) No, use `len(obj)`

<details>
<summary>Answer</summary>

**D) No, use `len(obj)`**. Use the normal operation. (See Q118.)

</details>

##### Dataclasses

**M234.** What does `@dataclass` generate by default?

- A) `__init__` only
- B) `__new__` and `__del__`
- C) `__hash__` and `__lt__`
- D) `__init__`, `__repr__`, and `__eq__`

<details>
<summary>Answer</summary>

**D) `__init__`, `__repr__`, and `__eq__`**. Ordering needs `order=True`. (See Q122.)

</details>

**M235.** What does this print?
```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int

print(Point(1) == Point(1), Point(1) is Point(1))
```

- A) `True False`
- B) `False True`
- C) `True True`
- D) `False False`

<details>
<summary>Answer</summary>

**A) `True False`**. The generated `__eq__` compares fields, and they're separate objects. (See Q122.)

</details>

**M236.** What does this print?
```python
from dataclasses import dataclass

try:
    @dataclass
    class Config:
        tags: list = []
    print("ok")
except ValueError:
    print("ValueError")
```

- A) `TypeError`
- B) `[]`
- C) `ValueError`
- D) `ok`

<details>
<summary>Answer</summary>

**C) `ValueError`**. Use `field(default_factory=list)`. (See Q123.)

</details>

**M237.** What does this print?
```python
from dataclasses import dataclass

@dataclass
class Config:
    epochs: int

print(Config("ten").epochs)
```

- A) `0`
- B) `TypeError`
- C) `ten`
- D) `ValueError`

<details>
<summary>Answer</summary>

**C) `ten`**. Annotations aren't enforced at runtime. (See Q123.)

</details>

**M238.** Where do you validate field values in a dataclass?

- A) `__validate__`
- B) `__post_init__`
- C) `__new__`
- D) `__init__`, always by hand

<details>
<summary>Answer</summary>

**B) `__post_init__`**. The generated `__init__` calls it after assigning the fields. (See Q123.)

</details>

**M239.** What does this print?
```python
from dataclasses import dataclass, FrozenInstanceError

@dataclass(frozen=True)
class Version:
    tags: list

version = Version([])
version.tags.append("x")
print(version.tags)
```

- A) `FrozenInstanceError`
- B) `TypeError`
- C) `['x']`
- D) `[]`

<details>
<summary>Answer</summary>

**C) `['x']`**. `frozen=True` isn't deep immutability: the list itself can still change. (See Q124.)

</details>

**M240.** What does this print?
```python
from dataclasses import dataclass

@dataclass
class Point:
    x: int

try:
    print(len({Point(1)}))
except TypeError:
    print("TypeError")
```

- A) `None`
- B) `TypeError`
- C) `0`
- D) `1`

<details>
<summary>Answer</summary>

**B) `TypeError`**. `eq=True` without `frozen` sets `__hash__` to `None`. (See Q124.)

</details>

**M241.** External API data needs runtime validation and parsing. What fits best?

- A) A set
- B) `typing.NamedTuple`
- C) A Pydantic model
- D) A plain dataclass

<details>
<summary>Answer</summary>

**C) A Pydantic model**. Dataclasses don't validate types at runtime. (See Q125.)

</details>

**M242.** What is the main benefit of `slots=True` or `__slots__`?

- A) Automatic validation
- B) Lower memory per instance, and typos raise errors
- C) Deep immutability
- D) Thread safety

<details>
<summary>Answer</summary>

**B) Lower memory per instance, and typos raise errors**. There's no per-instance `__dict__`. (See Q125.)

</details>

### Functions, Decorators and Generators

#### Functions

##### `*args` and `**kwargs`

**M243.** What does this print?

```python
def f(*a, **k):
    return type(a).__name__, type(k).__name__

print(f(1, x=2))
```

- A) `('tuple', 'set')`
- B) `('tuple', 'dict')`
- C) `('list', 'list')`
- D) `('list', 'dict')`

<details>
<summary>Answer</summary>

**B) `('tuple', 'dict')`**. `*args` is a tuple, and `**kwargs` is a dict. (See Q90.)

</details>

**M244.** What does this print?

```python
def f(*a, **k):
    return list(a), k

print(f(1, 2, lr=0.1))
```

- A) `([1, 2], {'lr': 0.1})`
- B) `([1, 2, 0.1], {})`
- C) `TypeError`
- D) `((1, 2), {'lr': 0.1})`

<details>
<summary>Answer</summary>

**A) `([1, 2], {'lr': 0.1})`**. `a` is converted with `list()`. (See Q90.)

</details>

**M245.** What does this print?

```python
def f(a, *args):
    return args

print(f(1))
```

- A) `None`
- B) `[]`
- C) `TypeError`
- D) `()`

<details>
<summary>Answer</summary>

**D) `()`**. With no extra arguments, `*args` is an empty tuple. (See Q90.)

</details>

**M246.** When are `*args` and `**kwargs` most useful?

- A) You want faster loops
- B) The data is already one list
- C) A function must take exactly two arguments
- D) A wrapper forwards unknown arguments to another function

<details>
<summary>Answer</summary>

**D) A wrapper forwards unknown arguments to another function**. Decorators and wrappers use this a lot. (See Q91.)

</details>

**M247.** What does this print?

```python
def add(a, b):
    return a + b

print(add(*[1, 2]))
```

- A) `[1, 2]`
- B) `TypeError`
- C) `3`
- D) `None`

<details>
<summary>Answer</summary>

**C) `3`**. `*` unpacks the list into positional arguments. (See Q92.)

</details>

**M248.** What does this print?

```python
def add(a, b):
    return a + b

print(add(**{"a": 1, "b": 2}))
```

- A) `KeyError`
- B) `ab`
- C) `TypeError`
- D) `3`

<details>
<summary>Answer</summary>

**D) `3`**. `**` unpacks the dict into keyword arguments. (See Q92.)

</details>

**M249.** What does this print?

```python
def add(a, b):
    return a + b

print(add(**{"a": 1, "c": 2}))
```

- A) `KeyError`
- B) `TypeError`
- C) `1`
- D) `3`

<details>
<summary>Answer</summary>

**B) `TypeError`**. The dict keys must match the parameter names. (See Q92.)

</details>

**M250.** Why write `model.fit(*train_data, **settings)` in experiments?

- A) It turns off validation
- B) It saves the model automatically
- C) Each run changes only the settings dict
- D) It makes training run faster

<details>
<summary>Answer</summary>

**C) Each run changes only the settings dict**. The `fit()` line stays the same across experiments. (See Q93.)

</details>

##### Function basics

**M251.** What does this print?
```python
print(list(filter(lambda n: n > 1, [1, 2, 3])))
```

- A) `[1]`
- B) `[False, True, True]`
- C) `[2, 3]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**C) `[2, 3]`**. `filter()` keeps items where the function is true. (See Q126.)

</details>

**M252.** What does this print?
```python
from functools import reduce

print(reduce(lambda a, b: a * b, [1, 2, 3, 4]))
```

- A) `[1, 2, 6, 24]`
- B) `4`
- C) `10`
- D) `24`

<details>
<summary>Answer</summary>

**D) `24`**. `reduce()` combines items into one value. (See Q126.)

</details>

**M253.** What does this print?
```python
result = map(str, [1, 2])
print(type(result).__name__)
```

- A) `list`
- B) `str`
- C) `tuple`
- D) `map`

<details>
<summary>Answer</summary>

**D) `map`**. `map()` is a lazy iterator. (See Q126.)

</details>

**M254.** What does this print?
```python
def add(item, items=[]):
    items.append(item)
    return items

add(1)
print(add(2))
```

- A) `TypeError`
- B) `[2]`
- C) `[1]`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**D) `[1, 2]`**. Defaults are evaluated once, so every call shares the same list. (See Q128.)

</details>

**M255.** What does this print?
```python
def change(items):
    items.append(1)
    items = [9]

data = []
change(data)
print(data)
```

- A) `[1, 9]`
- B) `[1]`
- C) `[9]`
- D) `[]`

<details>
<summary>Answer</summary>

**B) `[1]`**. Mutation is visible to the caller, but rebinding the parameter isn't. (See Q127.)

</details>

**M256.** What does this print?
```python
def fit(data, *, lr=0.1):
    return lr

try:
    print(fit(1, 0.5))
except TypeError:
    print("TypeError")
```

- A) `TypeError`
- B) `0.5`
- C) `0.1`
- D) `1`

<details>
<summary>Answer</summary>

**A) `TypeError`**. Parameters after `*` are keyword-only. (See Q127.)

</details>

**M257.** What does this print?
```python
def fit(data, /):
    return data

try:
    print(fit(data=1))
except TypeError:
    print("TypeError")
```

- A) `data`
- B) `None`
- C) `TypeError`
- D) `1`

<details>
<summary>Answer</summary>

**C) `TypeError`**. Parameters before `/` are positional-only. (See Q127.)

</details>

##### Lambda functions

**M258.** What is a lambda?

- A) An anonymous function made from a single expression
- B) A function that can hold many statements
- C) A class with one method
- D) A faster version of `def`

<details>
<summary>Answer</summary>

**A) An anonymous function made from a single expression**. Its expression's value is returned automatically. (See Q129.)

</details>

**M259.** Which of these is valid inside a lambda?

- A) A `raise` statement
- B) A `try` statement
- C) A conditional expression like `x if x else 0`
- D) An `if` statement block

<details>
<summary>Answer</summary>

**C) A conditional expression like `x if x else 0`**. A lambda can hold one expression only. (See Q130.)

</details>

**M260.** What does this print?
```python
print((lambda a, b=2: a * b)(3))
```

- A) `3`
- B) `2`
- C) `6`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `6`**. Lambdas can have default arguments. (See Q130.)

</details>

**M261.** What does this print?
```python
f = lambda: None
print(f.__name__)
```

- A) `lambda`
- B) `f`
- C) `<lambda>`
- D) `None`

<details>
<summary>Answer</summary>

**C) `<lambda>`**. Lambdas are anonymous, so tracebacks are less helpful. (See Q130.)

</details>

**M262.** Is a lambda faster than an equivalent `def`?

- A) Only when sorting
- B) Yes, always
- C) No, it's a readability choice
- D) Only without arguments

<details>
<summary>Answer</summary>

**C) No, it's a readability choice**. Both compile to the same kind of function. (See Q130.)

</details>

#### Closures and decorators

##### Closures

**M263.** Which LEGB scope does a closure use?

- A) Built-in
- B) Enclosing
- C) Local only
- D) Global

<details>
<summary>Answer</summary>

**B) Enclosing**. It keeps access to variables from its enclosing function. (See Q131.)

</details>

**M264.** What does this print?
```python
def outer():
    x = 1
    def inner():
        return x
    x = 2
    return inner

print(outer()())
```

- A) `NameError`
- B) `2`
- C) `1`
- D) `None`

<details>
<summary>Answer</summary>

**B) `2`**. A closure refers to the variable, not a copy of its value. (See Q131.)

</details>

**M265.** What does this print?
```python
def make():
    count = 0
    def add():
        count += 1
        return count
    return add

try:
    print(make()())
except UnboundLocalError:
    print("UnboundLocalError")
```

- A) `0`
- B) `1`
- C) `UnboundLocalError`
- D) `NameError`

<details>
<summary>Answer</summary>

**C) `UnboundLocalError`**. Assigning makes `count` local. Add `nonlocal count`. (See Q132.)

</details>

**M266.** What does this print?
```python
def make():
    items = []
    def add(x):
        items.append(x)
        return items
    return add

add = make()
add(1)
print(add(2))
```

- A) `[1, 2]`
- B) `[]`
- C) `UnboundLocalError`
- D) `[2]`

<details>
<summary>Answer</summary>

**A) `[1, 2]`**. `append()` is mutation, so `nonlocal` isn't needed. (See Q132.)

</details>

**M267.** What does this print?
```python
print([f() for f in [lambda: n for n in range(3)]])
```

- A) `[2, 2, 2]`
- B) `[0, 0, 0]`
- C) `[0, 1, 2]`
- D) `NameError`

<details>
<summary>Answer</summary>

**A) `[2, 2, 2]`**. Late binding: `n` is looked up when the function is called. (See Q133.)

</details>

**M268.** What does this print?
```python
print([f() for f in [lambda n=n: n for n in range(3)]])
```

- A) `[2, 2, 2]`
- B) `[0, 0, 0]`
- C) `TypeError`
- D) `[0, 1, 2]`

<details>
<summary>Answer</summary>

**D) `[0, 1, 2]`**. A default argument stores the current value. (See Q133.)

</details>

**M269.** Why can't a closure be sent to a `multiprocessing` worker?

- A) Closures hold the GIL
- B) Nested functions can't be pickled
- C) Closures run only on one core
- D) Workers have no event loop

<details>
<summary>Answer</summary>

**B) Nested functions can't be pickled**. Pickle stores functions by importable name. (See Q134.)

</details>

**M270.** State must be inspected and reset by callers. What fits best?

- A) A generator expression
- B) A lambda
- C) A class
- D) A closure

<details>
<summary>Answer</summary>

**C) A class**. Closures suit one behaviour with a little configuration. (See Q134.)

</details>

##### Decorators

**M271.** What does `@log_call` above `def add` roughly mean?

- A) `log_call(add())`
- B) `log_call = add(log_call)`
- C) `add = log_call(add)`
- D) `add = log_call`

<details>
<summary>Answer</summary>

**C) `add = log_call(add)`**. The decorator receives the function and returns its replacement. (See Q135.)

</details>

**M272.** What does this print?
```python
def deco(function):
    print("decorating")
    return function

@deco
def run():
    print("running")
```

- A) `decorating running`
- B) `running`
- C) Nothing
- D) `decorating`

<details>
<summary>Answer</summary>

**D) `decorating`**. The decorator runs once, at definition. `run()` was never called. (See Q138.)

</details>

**M273.** What does this print?
```python
def deco(function):
    def wrapper():
        function()
    return wrapper

@deco
def get():
    return 5

print(get())
```

- A) `5`
- B) `TypeError`
- C) `wrapper`
- D) `None`

<details>
<summary>Answer</summary>

**D) `None`**. The wrapper doesn't return the result. (See Q135.)

</details>

**M274.** What does this print?
```python
def deco(function):
    def wrapper():
        return function()
    return wrapper

@deco
def get():
    pass

print(get.__name__)
```

- A) `deco`
- B) `wrapper`
- C) `None`
- D) `get`

<details>
<summary>Answer</summary>

**B) `wrapper`**. Without `@wraps`, the wrapper's metadata shows. (See Q136.)

</details>

**M275.** What does this print?
```python
def bold(function):
    return lambda: "b" + function()

def italic(function):
    return lambda: "i" + function()

@bold
@italic
def text():
    return "x"

print(text())
```

- A) `xib`
- B) `ibx`
- C) `xbi`
- D) `bix`

<details>
<summary>Answer</summary>

**D) `bix`**. Decorators apply bottom-up, and the top wrapper runs first. (See Q138.)

</details>

**M276.** How does `@retry(attempts=3)` work?

- A) It needs a class
- B) Python calls the function three times automatically
- C) `retry` receives the function and `attempts` together
- D) `retry(attempts=3)` returns the real decorator

<details>
<summary>Answer</summary>

**D) `retry(attempts=3)` returns the real decorator**. It's a factory: `retry(attempts=3)(function)`. (See Q137.)

</details>

**M277.** What does this print?
```python
from functools import lru_cache

calls = []

@lru_cache(maxsize=None)
def square(n):
    calls.append(n)
    return n * n

square(2)
square(2)
print(len(calls))
```

- A) `1`
- B) `0`
- C) `2`
- D) `None`

<details>
<summary>Answer</summary>

**A) `1`**. The second call returns the cached result. (See Q139.)

</details>

**M278.** What does `functools.wraps` add to the wrapper?

- A) Automatic retries
- B) A cache
- C) Timing information
- D) The original's metadata and a `__wrapped__` reference

<details>
<summary>Answer</summary>

**D) The original's metadata and a `__wrapped__` reference**. It keeps `__name__` and `__doc__`. (See Q136.)

</details>

##### Class decorators

**M279.** What does a class decorator usually return?

- A) The same class, modified or registered
- B) `None`
- C) A new instance
- D) A wrapper function

<details>
<summary>Answer</summary>

**A) The same class, modified or registered**. It runs once per class definition. (See Q140.)

</details>

**M280.** What does this print?
```python
seen = []

def register(cls):
    seen.append(cls.__name__)
    return cls

@register
class Model:
    pass

Model()
Model()
print(len(seen))
```

- A) `0`
- B) `2`
- C) `1`
- D) `3`

<details>
<summary>Answer</summary>

**C) `1`**. A class decorator runs when the class is defined, not per instance. (See Q140.)

</details>

**M281.** What does this print?
```python
def broken(cls):
    pass

@broken
class Model:
    pass

print(Model)
```

- A) `<class 'Model'>`
- B) `None`
- C) `TypeError`
- D) `broken`

<details>
<summary>Answer</summary>

**B) `None`**. The decorator's return value replaces the class. (See Q140.)

</details>

**M282.** What does this print?
```python
class Count:
    def __init__(self, function):
        self.function = function
        self.calls = 0

    def __call__(self):
        self.calls += 1
        return self.function()

@Count
def run():
    return 1

run()
run()
print(run.calls)
```

- A) `0`
- B) `2`
- C) `1`
- D) `AttributeError`

<details>
<summary>Answer</summary>

**B) `2`**. A decorator written as a class keeps state on its instance. (See Q141.)

</details>

**M283.** Which registers every subclass without decorating each one?

- A) `@staticmethod`
- B) `__post_init__`
- C) `__init_subclass__`
- D) `@dataclass`

<details>
<summary>Answer</summary>

**C) `__init_subclass__`**. A class decorator affects only the classes it's applied to. (See Q142.)

</details>

**M284.** What is a metaclass?

- A) An abstract class
- B) A class with no methods
- C) The class of a class, which controls class creation
- D) A parent class with one child

<details>
<summary>Answer</summary>

**C) The class of a class, which controls class creation**. `type` is the default metaclass. (See Q142.)

</details>

#### Iterators and generators

##### Iterables and iterators

**M285.** Which object is an iterator?

- A) `{"a": 1}`
- B) The result of `iter([1, 2])`
- C) `[1, 2]`
- D) `"ab"`

<details>
<summary>Answer</summary>

**B) The result of `iter([1, 2])`**. Lists, strings, and dicts are iterables, not iterators. (See Q143.)

</details>

**M286.** What does this print?
```python
try:
    print(next([1, 2]))
except TypeError:
    print("TypeError")
```

- A) `StopIteration`
- B) `1`
- C) `TypeError`
- D) `2`

<details>
<summary>Answer</summary>

**C) `TypeError`**. A list is an iterable, not an iterator. (See Q143.)

</details>

**M287.** What does this print?
```python
it = iter([1, 2])
print(iter(it) is it)
```

- A) `False`
- B) `True`
- C) `TypeError`
- D) `None`

<details>
<summary>Answer</summary>

**B) `True`**. An iterator's `__iter__()` returns itself. (See Q143.)

</details>

**M288.** What does this print?
```python
it = iter([1, 2])
list(it)
print(list(it))
```

- A) `None`
- B) `[]`
- C) `[1, 2]`
- D) `StopIteration`

<details>
<summary>Answer</summary>

**B) `[]`**. An exhausted iterator stays exhausted. (See Q143.)

</details>

**M289.** What does this print?
```python
print(next(iter([]), "done"))
```

- A) `None`
- B) `StopIteration`
- C) `[]`
- D) `done`

<details>
<summary>Answer</summary>

**D) `done`**. `next(iterator, default)` avoids `StopIteration`. (See Q143.)

</details>

**M290.** Which exception signals that an iterator has no more values?

- A) `StopIteration`
- B) `IndexError`
- C) `GeneratorExit`
- D) `EOFError`

<details>
<summary>Answer</summary>

**A) `StopIteration`**. A `for` loop catches it and stops. (See Q144.)

</details>

**M291.** What must `__iter__()` return for a reusable custom iterable?

- A) `None`
- B) A new iterator each time
- C) A list
- D) `self`

<details>
<summary>Answer</summary>

**B) A new iterator each time**. Returning `self` makes it single-use. (See Q145.)

</details>

##### Generators

**M292.** What does this print?
```python
def gen():
    print("start")
    yield 1

g = gen()
print("made")
```

- A) `start`
- B) `1`
- C) `made`
- D) `start made`

<details>
<summary>Answer</summary>

**C) `made`**. Calling a generator function doesn't run its body. (See Q146.)

</details>

**M293.** What does this print?
```python
def gen():
    yield 1
    yield 2

g = gen()
print(next(g), next(g), next(g, "end"))
```

- A) `StopIteration`
- B) `1 2 None`
- C) `1 2 end`
- D) `1 1 1`

<details>
<summary>Answer</summary>

**C) `1 2 end`**. The third call finds the body finished and uses the default. (See Q146.)

</details>

**M294.** What does this print?
```python
def gen():
    x = 1
    yield x
    x += 1
    yield x

print(list(gen()))
```

- A) `[1, 2]`
- B) `[1]`
- C) `[2, 2]`
- D) `[1, 1]`

<details>
<summary>Answer</summary>

**A) `[1, 2]`**. Local variables are kept between yields. (See Q146.)

</details>

**M295.** What does this print?
```python
print(type(n for n in [1]).__name__)
```

- A) `list`
- B) `generator`
- C) `SyntaxError`
- D) `tuple`

<details>
<summary>Answer</summary>

**B) `generator`**. Parentheses make a generator expression, not a tuple. (See Q147.)

</details>

**M296.** What does this print?
```python
g = (n for n in range(3))
print(sum(g), sum(g))
```

- A) `TypeError`
- B) `3 0`
- C) `3 3`
- D) `0 3`

<details>
<summary>Answer</summary>

**B) `3 0`**. The first `sum()` used up the generator. (See Q147.)

</details>

**M297.** What does this print?
```python
def inner():
    yield 1
    yield 2

def outer():
    yield from inner()
    yield 3

print(list(outer()))
```

- A) `[1, 3]`
- B) `[3]`
- C) `[1, 2, 3]`
- D) `[[1, 2], 3]`

<details>
<summary>Answer</summary>

**C) `[1, 2, 3]`**. `yield from` yields every value from another iterable. (See Q148.)

</details>

**M298.** What does `generator.close()` raise inside the generator?

- A) `RuntimeError`
- B) `KeyboardInterrupt`
- C) `GeneratorExit`
- D) `StopIteration`

<details>
<summary>Answer</summary>

**C) `GeneratorExit`**. `finally` blocks then run. (See Q148.)

</details>

**M299.** What does this print?
```python
def echo():
    value = yield
    yield value * 2

g = echo()
next(g)
print(g.send(5))
```

- A) `None`
- B) `5`
- C) `10`
- D) `TypeError`

<details>
<summary>Answer</summary>

**C) `10`**. `send()` makes the paused `yield` evaluate to the value. (See Q148.)

</details>

##### Generators vs lists

**M300.** When is a list better than a generator?

- A) You read a huge file once
- B) You need indexing, sorting, or several passes
- C) You stop early at the first match
- D) You process an endless stream

<details>
<summary>Answer</summary>

**B) You need indexing, sorting, or several passes**. Generators suit single-pass, large, or streaming work. (See Q149.)

</details>

**M301.** What does this print?
```python
g = (n for n in range(3))
try:
    print(len(g))
except TypeError:
    print("TypeError")
```

- A) `3`
- B) `TypeError`
- C) `None`
- D) `0`

<details>
<summary>Answer</summary>

**B) `TypeError`**. Generators have no length, and they can't be indexed. (See Q150.)

</details>

**M302.** What does this print?
```python
seen = []

def check(n):
    seen.append(n)
    return n > 0

any(check(n) for n in [1, 2, 3])
print(seen)
```

- A) `[3]`
- B) `[1, 2, 3]`
- C) `[1]`
- D) `[]`

<details>
<summary>Answer</summary>

**C) `[1]`**. `any()` with a generator stops at the first true value. (See Q149.)

</details>

**M303.** Which statement about generators is true?

- A) They can be restarted
- B) They remove the input list from memory
- C) They always run faster
- D) They use less memory for intermediate results

<details>
<summary>Answer</summary>

**D) They use less memory for intermediate results**. They mainly save memory and skipped work. (See Q150.)

</details>

**M304.** How do you read a huge file lazily?

- A) `list(file)`
- B) `file.readlines()`
- C) `file.read()`
- D) Iterate over the file object

<details>
<summary>Answer</summary>

**D) Iterate over the file object**. Those others load everything. (See Q149.)

</details>

##### `return` vs `yield`

**M305.** What does this print?
```python
def one():
    yield [1, 2]

def many():
    yield from [1, 2]

print(list(one()), list(many()))
```

- A) `[1, 2] [[1, 2]]`
- B) `[1, 2] [1, 2]`
- C) `[[1, 2]] [1, 2]`
- D) `[[1, 2]] [[1, 2]]`

<details>
<summary>Answer</summary>

**C) `[[1, 2]] [1, 2]`**. `yield` gives one list, and `yield from` gives each element. (See Q151.)

</details>

**M306.** What does this print?
```python
def gen():
    yield 1
    return 2

print(list(gen()))
```

- A) `[1, 2]`
- B) `[1]`
- C) `2`
- D) `[2]`

<details>
<summary>Answer</summary>

**B) `[1]`**. `return` ends iteration, and its value goes into `StopIteration.value`. (See Q151.)

</details>

**M307.** What does this print?
```python
def gen():
    yield 1
    return "done"

g = gen()
next(g)
try:
    next(g)
except StopIteration as error:
    print(error.value)
```

- A) `StopIteration`
- B) `1`
- C) `done`
- D) `None`

<details>
<summary>Answer</summary>

**C) `done`**. The return value travels on the exception. (See Q151.)

</details>

**M308.** What does this print?
```python
def get(flag):
    if flag:
        return [1, 2]
    yield 3

print(list(get(True)))
```

- A) `TypeError`
- B) `[1, 2]`
- C) `[]`
- D) `[3]`

<details>
<summary>Answer</summary>

**C) `[]`**. With `yield` in the body, every call returns a generator, and `return` just ends it. (See Q152.)

</details>

**M309.** What does this print?
```python
def read(path):
    with open(path, encoding="utf-8") as file:
        yield from file

rows = read("missing-file.csv")
print("no error yet")
```

- A) `None`
- B) `[]`
- C) `FileNotFoundError`
- D) `no error yet`

<details>
<summary>Answer</summary>

**D) `no error yet`**. Errors in a generator appear only when it's consumed. (See Q152.)

</details>

### Exceptions and Context Managers

#### Exceptions

##### `try`, `except`, `else`, and `finally`

**M310.** Which of these does `except Exception` NOT catch?

- A) `ZeroDivisionError`
- B) `ValueError`
- C) `KeyError`
- D) `KeyboardInterrupt`

<details>
<summary>Answer</summary>

**D) `KeyboardInterrupt`**. `KeyboardInterrupt` inherits directly from `BaseException`. (See Q153.)

</details>

**M311.** What does `int("x")` raise?

- A) `SyntaxError`
- B) `ValueError`
- C) `TypeError`
- D) `KeyError`

<details>
<summary>Answer</summary>

**B) `ValueError`**. Right type, bad value. (See Q153.)

</details>

**M312.** What does `"1" + 1` raise?

- A) `ValueError`
- B) `AttributeError`
- C) `SyntaxError`
- D) `TypeError`

<details>
<summary>Answer</summary>

**D) `TypeError`**. The operation doesn't support these types. (See Q153.)

</details>

**M313.** What does this print?
```python
try:
    print("a", end=" ")
except ValueError:
    print("b", end=" ")
else:
    print("c", end=" ")
finally:
    print("d")
```

- A) `a d`
- B) `a b d`
- C) `a c d`
- D) `a b c d`

<details>
<summary>Answer</summary>

**C) `a c d`**. With no exception, `else` runs, and then `finally`. (See Q154.)

</details>

**M314.** What does this print?
```python
try:
    1 / 0
except ZeroDivisionError:
    print("a", end=" ")
else:
    print("b", end=" ")
finally:
    print("c")
```

- A) `a c`
- B) `b c`
- C) `c`
- D) `a b c`

<details>
<summary>Answer</summary>

**A) `a c`**. `else` is skipped when an exception is raised. (See Q154.)

</details>

**M315.** What does this print?
```python
def run():
    try:
        return "try"
    finally:
        print("clean", end=" ")

print(run())
```

- A) `clean try`
- B) `clean`
- C) `try`
- D) `try clean`

<details>
<summary>Answer</summary>

**A) `clean try`**. `finally` runs before the function hands back its value. (See Q156.)

</details>

**M316.** What does this print?
```python
import warnings

warnings.simplefilter("ignore")

def run():
    try:
        return "try"
    finally:
        return "finally"

print(run())
```

- A) `SyntaxError`
- B) `try`
- C) `None`
- D) `finally`

<details>
<summary>Answer</summary>

**D) `finally`**. `return` in `finally` replaces the pending return value. (See Q156.)

</details>

**M317.** What does this print?
```python
import warnings

warnings.simplefilter("ignore")

def run():
    try:
        1 / 0
    finally:
        return "swallowed"

print(run())
```

- A) `ZeroDivisionError`
- B) `SyntaxError`
- C) `None`
- D) `swallowed`

<details>
<summary>Answer</summary>

**D) `swallowed`**. `return` in `finally` silently discards the pending exception. (See Q156.)

</details>

**M318.** What does this print?
```python
try:
    try:
        pass
    except ValueError:
        print("inner")
    else:
        raise ValueError
except ValueError:
    print("outer")
```

- A) `inner outer`
- B) Nothing
- C) `outer`
- D) `inner`

<details>
<summary>Answer</summary>

**C) `outer`**. Exceptions in `else` aren't caught by the `except` above it. (See Q154.)

</details>

**M319.** What does this print?
```python
try:
    int("x")
except Exception:
    print("general")
except ValueError:
    print("value")
```

- A) `SyntaxError`
- B) `general value`
- C) `general`
- D) `value`

<details>
<summary>Answer</summary>

**C) `general`**. The first matching handler wins, so put specific ones first. (See Q155.)

</details>

**M320.** Why avoid bare `except:`?

- A) It runs slower
- B) It also catches `KeyboardInterrupt` and `SystemExit`
- C) It's a syntax error
- D) It can't catch `ValueError`

<details>
<summary>Answer</summary>

**B) It also catches `KeyboardInterrupt` and `SystemExit`**. It hides unrelated failures too. (See Q155.)

</details>

**M321.** What does this print?
```python
try:
    int("x")
except ValueError as error:
    pass

try:
    print(error)
except NameError:
    print("NameError")
```

- A) `NameError`
- B) `None`
- C) `invalid literal`
- D) `ValueError`

<details>
<summary>Answer</summary>

**A) `NameError`**. The `as` name is deleted when the handler ends. (See Q157.)

</details>

**M322.** What does `python -O` do to your code?

- A) `assert` statements are removed
- B) `raise` statements are removed
- C) `try` blocks are skipped
- D) All exceptions are ignored

<details>
<summary>Answer</summary>

**A) `assert` statements are removed**. So never use `assert` to validate user input. (See Q158.)

</details>

**M323.** Does `finally` run if the process is killed?

- A) Yes, always
- B) Yes, unless there's a `return`
- C) Only on Windows
- D) No

<details>
<summary>Answer</summary>

**D) No**. Nothing can run after a kill or a power loss. (See Q154.)

</details>

##### Custom exceptions

**M324.** Which is the correct base for an ordinary custom exception?

- A) `SystemExit`
- B) `Exception`
- C) `object`
- D) `BaseException`

<details>
<summary>Answer</summary>

**B) `Exception`**. `except Exception` would miss a `BaseException` subclass. (See Q159.)

</details>

**M325.** What does this print?
```python
class AppError(ValueError):
    pass

try:
    raise AppError("bad")
except ValueError as error:
    print(type(error).__name__)
```

- A) `bad`
- B) `ValueError`
- C) `AppError`
- D) `Exception`

<details>
<summary>Answer</summary>

**C) `AppError`**. A handler for the parent catches the subclass. (See Q159.)

</details>

**M326.** Why create one base exception for a package?

- A) It's required by Python
- B) Callers can catch all of its errors with one handler
- C) It runs faster
- D) It removes the need for messages

<details>
<summary>Answer</summary>

**B) Callers can catch all of its errors with one handler**. Specific errors inherit from it. (See Q160.)

</details>

**M327.** What does this print?
```python
class MyError(Exception):
    def __init__(self, code):
        self.code = code
        super().__init__(f"code {code}")

try:
    raise MyError(7)
except MyError as error:
    print(error.code, error)
```

- A) `code 7 code 7`
- B) `7 code 7`
- C) `7 7`
- D) `7 None`

<details>
<summary>Answer</summary>

**B) `7 code 7`**. Structured data is stored on attributes, and the message goes to `super().__init__()`. (See Q159.)

</details>

**M328.** When should you NOT create a custom exception?

- A) When it inherits from `Exception`
- B) When a built-in already expresses the meaning
- C) When callers must catch it
- D) When you need a clear message

<details>
<summary>Answer</summary>

**B) When a built-in already expresses the meaning**. Add a type only if it adds meaning. (See Q160.)

</details>

**M329.** What does this print?
```python
class Bad(Exception):
    pass

try:
    raise Bad
except Bad as error:
    print(repr(str(error)))
```

- A) `TypeError`
- B) `None`
- C) `'Bad'`
- D) `''`

<details>
<summary>Answer</summary>

**D) `''`**. `raise Bad` creates an instance with no arguments, so the message is empty. (See Q159.)

</details>

**M330.** Which adds context to an exception without changing its type?

- A) `del error`
- B) `raise New() from error`
- C) `error.message = "..."`
- D) `error.add_note("...")`

<details>
<summary>Answer</summary>

**D) `error.add_note("...")`**. Python 3.11+ stores notes in `__notes__`. (See Q161.)

</details>

##### Exception chaining

**M331.** What does this print?
```python
try:
    try:
        int("x")
    except ValueError as error:
        raise KeyError("k") from error
except KeyError as error:
    print(type(error.__cause__).__name__)
```

- A) `None`
- B) `ValueError`
- C) `TypeError`
- D) `KeyError`

<details>
<summary>Answer</summary>

**B) `ValueError`**. `from` stores the original as `__cause__`. (See Q162.)

</details>

**M332.** What does this print?
```python
try:
    try:
        int("x")
    except ValueError:
        raise KeyError("k")
except KeyError as error:
    print(error.__cause__, type(error.__context__).__name__)
```

- A) `ValueError ValueError`
- B) `None None`
- C) `None ValueError`
- D) `ValueError None`

<details>
<summary>Answer</summary>

**C) `None ValueError`**. Implicit chaining sets `__context__`, not `__cause__`. (See Q163.)

</details>

**M333.** What does this print?
```python
try:
    try:
        int("x")
    except ValueError:
        raise KeyError("k") from None
except KeyError as error:
    print(error.__suppress_context__, error.__context__ is None)
```

- A) `False True`
- B) `False False`
- C) `True False`
- D) `True True`

<details>
<summary>Answer</summary>

**C) `True False`**. `from None` hides the earlier exception but doesn't delete `__context__`. (See Q163.)

</details>

**M334.** What does a bare `raise` do inside `except`?

- A) Raises `RuntimeError`
- B) Creates a new exception
- C) Re-raises the current exception unchanged
- D) Clears the exception

<details>
<summary>Answer</summary>

**C) Re-raises the current exception unchanged**. The original traceback is kept. (See Q163.)

</details>

**M335.** Which traceback text appears with explicit chaining?

- A) "During handling of the above exception"
- B) "Task was destroyed"
- C) "The above exception was the direct cause"
- D) "Exception ignored in"

<details>
<summary>Answer</summary>

**C) "The above exception was the direct cause"**. Implicit chaining shows "During handling". (See Q163.)

</details>

**M336.** What does this print?
```python
try:
    raise ValueError("bad") from "text"
except TypeError:
    print("TypeError")
```

- A) `ValueError`
- B) `text`
- C) `TypeError`
- D) `bad`

<details>
<summary>Answer</summary>

**C) `TypeError`**. After `from`, use an exception instance, an exception class, or `None`. (See Q163.)

</details>

#### Context managers

##### `with` and context managers

**M337.** Which two methods make an object a context manager?

- A) `__open__` and `__close__`
- B) `__enter__` and `__exit__`
- C) `__iter__` and `__next__`
- D) `__init__` and `__del__`

<details>
<summary>Answer</summary>

**B) `__enter__` and `__exit__`**. `with` calls them around the block. (See Q164.)

</details>

**M338.** What is bound to the name after `as`?

- A) The return value of `__exit__()`
- B) `None` always
- C) The return value of `__enter__()`
- D) The context manager always

<details>
<summary>Answer</summary>

**C) The return value of `__enter__()`**. It doesn't have to be the manager. (See Q164.)

</details>

**M339.** What does this print?
```python
class CM:
    def __enter__(self):
        print("in", end=" ")

    def __exit__(self, *args):
        print("out", end=" ")

with CM() as value:
    print(value, end=" ")
print()
```

- A) `in CM out`
- B) `None in out`
- C) `in out None`
- D) `in None out`

<details>
<summary>Answer</summary>

**D) `in None out`**. `__enter__()` returned nothing, so `value` is `None`. (See Q167.)

</details>

**M340.** What does this print?
```python
class CM:
    def __enter__(self):
        return self

    def __exit__(self, *args):
        return True

with CM():
    1 / 0
print("after")
```

- A) `after`
- B) `None`
- C) Nothing
- D) `ZeroDivisionError`

<details>
<summary>Answer</summary>

**A) `after`**. A truthy return from `__exit__()` suppresses the exception. (See Q165.)

</details>

**M341.** What does this print?
```python
class CM:
    def __enter__(self):
        return self

    def __exit__(self, *args):
        print("exit")

try:
    with CM():
        raise ValueError
except ValueError:
    print("caught")
```

- A) `caught` then `exit`, on two lines
- B) `exit` only
- C) `caught` only
- D) `exit` then `caught`, on two lines

<details>
<summary>Answer</summary>

**D) `exit` then `caught`, on two lines**. `__exit__()` runs first, and returning `None` lets the exception propagate. (See Q165.)

</details>

**M342.** What does this print?
```python
class CM:
    def __enter__(self):
        raise ValueError

    def __exit__(self, *args):
        print("exit")

try:
    with CM():
        pass
except ValueError:
    print("caught")
```

- A) `exit`
- B) `exit caught`
- C) `caught`
- D) Nothing

<details>
<summary>Answer</summary>

**C) `caught`**. If `__enter__()` raises, `__exit__()` isn't called. (See Q165.)

</details>

**M343.** What does this print?
```python
from threading import Lock

with Lock() as value:
    print(value)
```

- A) `False`
- B) `<Lock>`
- C) `True`
- D) `None`

<details>
<summary>Answer</summary>

**C) `True`**. A lock's `__enter__()` returns `True`, not the lock. (See Q164.)

</details>

**M344.** What does a `sqlite3` connection's `with` block do on success?

- A) Closes the connection
- B) Deletes the database
- C) Commits the transaction and leaves the connection open
- D) Rolls back

<details>
<summary>Answer</summary>

**C) Commits the transaction and leaves the connection open**. Read the docs to know what a manager does on exit. (See Q166.)

</details>

**M345.** What does this print?
```python
from contextlib import suppress

with suppress(KeyError):
    {}["x"]
print("ok")
```

- A) `None`
- B) Nothing
- C) `ok`
- D) `KeyError`

<details>
<summary>Answer</summary>

**C) `ok`**. `contextlib.suppress` ignores the listed exceptions. (See Q165.)

</details>

##### Custom context managers

**M346.** What are the three `__exit__()` arguments on a normal exit?

- A) All `None`
- B) Empty strings
- C) `0`, `0`, `0`
- D) All `False`

<details>
<summary>Answer</summary>

**A) All `None`**. They hold exception details only if one occurred. (See Q167.)

</details>

**M347.** How should `__exit__()` let an exception propagate?

- A) Return `True`
- B) Call `sys.exit()`
- C) Re-raise it with `raise`
- D) Return `False` or `None`

<details>
<summary>Answer</summary>

**D) Return `False` or `None`**. Don't re-raise it yourself. (See Q167.)

</details>

**M348.** What does this print?
```python
from contextlib import contextmanager

@contextmanager
def cm():
    print("in", end=" ")
    yield 5
    print("out", end=" ")

with cm() as value:
    print(value, end=" ")
print()
```

- A) `in 5 out`
- B) `in out 5`
- C) `in out`
- D) `5 in out`

<details>
<summary>Answer</summary>

**A) `in 5 out`**. Code before `yield` is setup, and code after it is cleanup. (See Q168.)

</details>

**M349.** What does this print?
```python
from contextlib import contextmanager

@contextmanager
def cm():
    yield
    print("out")

try:
    with cm():
        raise ValueError
except ValueError:
    print("caught")
```

- A) `out`
- B) `out` then `caught`, on two lines
- C) `caught`
- D) Nothing

<details>
<summary>Answer</summary>

**C) `caught`**. Without `try/finally`, an exception skips the cleanup. (See Q168.)

</details>

**M350.** How many times must a `@contextmanager` generator yield?

- A) Exactly once
- B) Any number of times
- C) At least twice
- D) Zero or once

<details>
<summary>Answer</summary>

**A) Exactly once**. Yielding more raises `RuntimeError`. (See Q168.)

</details>

##### `finally` vs context managers

**M351.** What is the main difference between `finally` and a context manager?

- A) `finally` is slower
- B) `finally` is inline code, and a context manager is reusable
- C) Only `finally` runs on exceptions
- D) Only a context manager runs on exceptions

<details>
<summary>Answer</summary>

**B) `finally` is inline code, and a context manager is reusable**. Both run cleanup on normal exit and on exceptions. (See Q169.)

</details>

**M352.** Why acquire a resource before `try`?

- A) It suppresses exceptions
- B) `try` can't contain calls
- C) It runs faster
- D) So cleanup runs only for a resource that was acquired

<details>
<summary>Answer</summary>

**D) So cleanup runs only for a resource that was acquired**. Otherwise `finally` may release something you never acquired. (See Q170.)

</details>

**M353.** Which helps manage a list of resources chosen at runtime?

- A) `functools.partial`
- B) `contextlib.ExitStack`
- C) `itertools.chain`
- D) `gc.collect`

<details>
<summary>Answer</summary>

**B) `contextlib.ExitStack`**. It unwinds whatever was entered. (See Q170.)

</details>

### Memory Management and GIL

#### Memory management

##### Reference counting and garbage collection

**M354.** What is CPython's main memory management mechanism?

- A) Stack allocation
- B) Reference counting
- C) Manual `free()`
- D) Only a tracing collector

<details>
<summary>Answer</summary>

**B) Reference counting**. A cyclic collector backs it up. (See Q171.)

</details>

**M355.** What does the cyclic collector handle?

- A) Files left open
- B) All objects, on every assignment
- C) Unreachable groups of objects that refer to each other
- D) Only strings

<details>
<summary>Answer</summary>

**C) Unreachable groups of objects that refer to each other**. Reference counting can't free a cycle. (See Q172.)

</details>

**M356.** What does `del x` do?

- A) Removes one reference to the object
- B) Frees memory back to the OS
- C) Clears the whole list
- D) Always destroys the object

<details>
<summary>Answer</summary>

**A) Removes one reference to the object**. The object survives while other references exist. (See Q173.)

</details>

**M357.** What does this print?
```python
a = [1]
b = a
del a
print(b)
```

- A) `[1]`
- B) `[]`
- C) `None`
- D) `NameError`

<details>
<summary>Answer</summary>

**A) `[1]`**. Only the name `a` was removed. (See Q173.)

</details>

**M358.** What does this print?
```python
import gc

a = []
b = [a]
a.append(b)
del a, b
print(gc.collect() > 0)
```

- A) `True`
- B) `None`
- C) `False`
- D) `0`

<details>
<summary>Answer</summary>

**A) `True`**. The cycle needed the collector. (See Q172.)

</details>

**M359.** How do you avoid a parent-child reference cycle?

- A) Disable reference counting
- B) Use a weak reference for the back link
- C) Call `del` on the class
- D) Use a tuple

<details>
<summary>Answer</summary>

**B) Use a weak reference for the back link**. A `weakref` doesn't keep its target alive. (See Q172.)

</details>

**M360.** Why is `__del__` a poor cleanup tool?

- A) It only works on lists
- B) It raises `SyntaxError`
- C) Its timing isn't guaranteed, and it may not run at exit
- D) It runs twice

<details>
<summary>Answer</summary>

**C) Its timing isn't guaranteed, and it may not run at exit**. Use `with` or `weakref.finalize()`. (See Q174.)

</details>

**M361.** Why use `with` for files instead of relying on garbage collection?

- A) GC deletes the file
- B) `with` uses less RAM
- C) GC can't see files
- D) GC manages memory, and files need release at a predictable time

<details>
<summary>Answer</summary>

**D) GC manages memory, and files need release at a predictable time**. Cleanup may be delayed by a cycle or another Python implementation. (See Q174.)

</details>

**M362.** After deleting a huge list, process memory stays high. Why?

- A) `del` is ignored on lists
- B) Python never frees memory
- C) Python may keep freed memory for reuse
- D) The GIL holds the memory

<details>
<summary>Answer</summary>

**C) Python may keep freed memory for reuse**. Memory isn't always returned to the OS right away. (See Q175.)

</details>

**M363.** Which tool helps find where memory is allocated?

- A) `pickle`
- B) `tracemalloc`
- C) `itertools`
- D) `timeit`

<details>
<summary>Answer</summary>

**B) `tracemalloc`**. It tracks allocations. (See Q176.)

</details>

**M364.** Which implementation uses a tracing GC, with no reference counts?

- A) CPython
- B) pip
- C) Cython
- D) PyPy

<details>
<summary>Answer</summary>

**D) PyPy**. Don't rely on immediate cleanup timing. (See Q175.)

</details>

##### Shallow and deep copy

**M365.** What does this print?
```python
a = [[1]]
b = a[:]
b[0].append(2)
print(a)
```

- A) `TypeError`
- B) `[[1]]`
- C) `[[1, 2]]`
- D) `[1, 2]`

<details>
<summary>Answer</summary>

**C) `[[1, 2]]`**. A slice is a shallow copy, so the inner list is shared. (See Q177.)

</details>

**M366.** What does this print?
```python
a = [[1]]
b = a[:]
b.append(2)
print(a)
```

- A) `[[1]]`
- B) `[[1, 2]]`
- C) `TypeError`
- D) `[[1], 2]`

<details>
<summary>Answer</summary>

**A) `[[1]]`**. The outer list is new, so changing it doesn't touch `a`. (See Q177.)

</details>

**M367.** What does this print?
```python
import copy

a = [[1]]
b = copy.deepcopy(a)
b[0].append(2)
print(a, a[0] is b[0])
```

- A) `[[1]] False`
- B) `[[1, 2]] True`
- C) `[[1, 2]] False`
- D) `[[1]] True`

<details>
<summary>Answer</summary>

**A) `[[1]] False`**. A deep copy copies nested objects too. (See Q177.)

</details>

**M368.** Which of these is NOT a shallow copy of a list `lst`?

- A) `alias = lst`
- B) `list(lst)`
- C) `lst[:]`
- D) `lst.copy()`

<details>
<summary>Answer</summary>

**A) `alias = lst`**. Assignment copies nothing: both names share the list. (See Q178.)

</details>

**M369.** How does `deepcopy()` handle cycles?

- A) It calls `gc.collect()`
- B) It skips them
- C) It uses a memo of already copied objects
- D) It raises `RecursionError`

<details>
<summary>Answer</summary>

**C) It uses a memo of already copied objects**. Each object is copied only once. (See Q178.)

</details>

**M370.** Which dunder customizes `copy.deepcopy()`?

- A) `__deepcopy__`
- B) `__new__`
- C) `__clone__`
- D) `__copy__` only

<details>
<summary>Answer</summary>

**A) `__deepcopy__`**. `__copy__` customizes a shallow copy. (See Q178.)

</details>

**M371.** What does this print?
```python
grid = [[0] * 2] * 2
grid[0][0] = 1
print(grid)
```

- A) `[[1, 1], [1, 1]]`
- B) `[[1, 0], [1, 0]]`
- C) `TypeError`
- D) `[[1, 0], [0, 0]]`

<details>
<summary>Answer</summary>

**B) `[[1, 0], [1, 0]]`**. All rows are the same list. (See Q179.)

</details>

**M372.** What does this print?
```python
d = dict.fromkeys(["a", "b"], [])
d["a"].append(1)
print(d)
```

- A) `{'a': [1], 'b': []}`
- B) `TypeError`
- C) `{'a': [1], 'b': [1]}`
- D) `{'a': [], 'b': []}`

<details>
<summary>Answer</summary>

**C) `{'a': [1], 'b': [1]}`**. Every key shares one list. (See Q179.)

</details>

#### GIL

##### The Global Interpreter Lock

**M373.** What does the GIL allow?

- A) Only one lock per thread
- B) Only one thread at a time to run Python bytecode in an interpreter
- C) Only one coroutine per program
- D) Only one process at a time on the machine

<details>
<summary>Answer</summary>

**B) Only one thread at a time to run Python bytecode in an interpreter**. It's per interpreter. (See Q180.)

</details>

**M374.** Why does CPython have a GIL?

- A) To stop multiprocessing
- B) To protect reference counting and internals simply
- C) To encrypt memory
- D) To make loops faster

<details>
<summary>Answer</summary>

**B) To protect reference counting and internals simply**. It keeps the interpreter simple and cheap. (See Q180.)

</details>

**M375.** Which work gains most from threads in GIL-enabled CPython?

- A) Recursive Python maths
- B) Pure-Python number crunching
- C) Long Python `for` loops
- D) Waiting on network or disk I/O

<details>
<summary>Answer</summary>

**D) Waiting on network or disk I/O**. The GIL is released while waiting. (See Q181.)

</details>

**M376.** Why can threads still speed up NumPy work?

- A) NumPy removes the GIL for good
- B) Its native code can release the GIL
- C) NumPy has no arrays in memory
- D) NumPy runs only in processes

<details>
<summary>Answer</summary>

**B) Its native code can release the GIL**. Check the library, and benchmark. (See Q181.)

</details>

**M377.** Is `counter += 1` thread-safe?

- A) Yes, because of the GIL
- B) No, protect it with a lock
- C) Only on one core
- D) Yes, for integers

<details>
<summary>Answer</summary>

**B) No, protect it with a lock**. It's several steps, and threads can interleave. (See Q182.)

</details>

**M378.** Does every Python runtime have a GIL?

- A) Only Python 2
- B) Yes, it's part of the language
- C) Only on Linux
- D) No

<details>
<summary>Answer</summary>

**D) No**. Free-threaded CPython and other implementations don't. (See Q180.)

</details>

**M379.** Is free-threaded CPython the default build?

- A) Yes, since 3.13
- B) Yes, since 3.14
- C) It was removed in 3.14
- D) No, it's an optional separate build

<details>
<summary>Answer</summary>

**D) No, it's an optional separate build**. Shared state still needs synchronization. (See Q183.)

</details>

**M380.** Which is a reason the GIL is hard to remove?

- A) It would break `print()`
- B) Many C extensions assume it protects them
- C) Lists depend on it for sorting
- D) Python has no threads

<details>
<summary>Answer</summary>

**B) Many C extensions assume it protects them**. Single-threaded speed and existing races are concerns too. (See Q183.)

</details>

### Concurrency (Threading, Multiprocessing, Asyncio)

#### Choosing the right tool

##### Threads, processes, and asyncio

**M381.** Which is CPU-bound work?

- A) Reading from a slow disk
- B) Computing features in a Python loop
- C) Querying a remote database
- D) Waiting for an API response

<details>
<summary>Answer</summary>

**B) Computing features in a Python loop**. It's slow because of computation, not waiting. (See Q184.)

</details>

**M382.** Best fit for blocking I/O with the `requests` library?

- A) Multiprocessing
- B) Threading
- C) Asyncio with `requests`
- D) A single `for` loop

<details>
<summary>Answer</summary>

**B) Threading**. `requests` is synchronous, so threads overlap its waits. (See Q185.)

</details>

**M383.** Best fit for pure-Python CPU work?

- A) `time.sleep()`
- B) Multiprocessing, or vectorize it
- C) Threading
- D) Asyncio

<details>
<summary>Answer</summary>

**B) Multiprocessing, or vectorize it**. Processes use several cores despite the GIL. (See Q185.)

</details>

**M384.** Best fit for thousands of concurrent network calls?

- A) Asyncio with async libraries
- B) `deepcopy()`
- C) A plain loop
- D) One process per call

<details>
<summary>Answer</summary>

**A) Asyncio with async libraries**. It coordinates many waiting operations cheaply. (See Q185.)

</details>

**M385.** Which statement is true?

- A) Neither shares memory
- B) Threads share memory, and processes don't by default
- C) Both always share memory
- D) Processes share memory, and threads don't

<details>
<summary>Answer</summary>

**B) Threads share memory, and processes don't by default**. So threads have races, and processes pay for pickling. (See Q186.)

</details>

**M386.** Which statement about asyncio is true?

- A) It runs Python code in parallel across cores
- B) It removes the GIL
- C) It starts one process per task
- D) It's concurrent on one thread

<details>
<summary>Answer</summary>

**D) It's concurrent on one thread**. Tasks take turns at `await` points. (See Q187.)

</details>

**M387.** Does concurrency need multiple CPU cores?

- A) Yes, always
- B) Only for asyncio
- C) Only for threads
- D) No

<details>
<summary>Answer</summary>

**D) No**. Tasks can take turns on one core. (See Q187.)

</details>

**M388.** Why might parallel code run slower?

- A) The GIL doubles every loop
- B) Startup, data transfer, and coordination overhead
- C) Python disables caching
- D) Parallel code ignores the CPU

<details>
<summary>Answer</summary>

**B) Startup, data transfer, and coordination overhead**. Small tasks often suffer most. (See Q187.)

</details>

**M389.** Can a program be both concurrent and parallel?

- A) Yes
- B) Only with the GIL disabled
- C) No, they're opposites
- D) Only on Linux

<details>
<summary>Answer</summary>

**A) Yes**. Async I/O plus a process pool is a common design. (See Q188.)

</details>

#### Threading

##### Threads and locks

**M390.** What does this print?
```python
from threading import Thread

items = []
thread = Thread(target=items.append, args=(1,))
thread.start()
thread.join()
print(items)
```

- A) `[1]`
- B) `None`
- C) `1`
- D) `[]`

<details>
<summary>Answer</summary>

**A) `[1]`**. Threads share memory, and `join()` waits for it to finish. (See Q189.)

</details>

**M391.** What is wrong with calling `thread.run()` instead of `thread.start()`?

- A) It runs in the current thread
- B) It starts a process
- C) It deadlocks
- D) It raises `TypeError`

<details>
<summary>Answer</summary>

**A) It runs in the current thread**. `start()` is what creates the new thread. (See Q189.)

</details>

**M392.** What does this print?
```python
from threading import Thread

try:
    print(Thread(target=print).join())
except RuntimeError:
    print("RuntimeError")
```

- A) `RuntimeError`
- B) `None`
- C) `True`
- D) Nothing

<details>
<summary>Answer</summary>

**A) `RuntimeError`**. You can't join a thread that hasn't started. (See Q189.)

</details>

**M393.** What does `daemon=True` mean?

- A) The thread doesn't keep the program alive
- B) The thread ignores the GIL
- C) The thread runs at high priority
- D) The thread gets its own process

<details>
<summary>Answer</summary>

**A) The thread doesn't keep the program alive**. It's stopped abruptly at exit. (See Q189.)

</details>

**M394.** What is a race condition?

- A) Two programs on one CPU
- B) The result depends on thread timing
- C) A thread that never starts
- D) A loop that's too fast

<details>
<summary>Answer</summary>

**B) The result depends on thread timing**. It usually comes from unprotected shared data. (See Q190.)

</details>

**M395.** Two threads each hold a lock the other needs. What is this?

- A) Deadlock
- B) Starvation of the GIL
- C) Race condition
- D) Oversubscription

<details>
<summary>Answer</summary>

**A) Deadlock**. Acquire locks in a consistent order. (See Q191.)

</details>

**M396.** What does this print?
```python
from threading import Lock

lock = Lock()
lock.acquire()
print(lock.acquire(timeout=0.01))
```

- A) `False`
- B) `None`
- C) It hangs forever
- D) `True`

<details>
<summary>Answer</summary>

**A) `False`**. A plain `Lock` can't be re-acquired, and the timeout gives up. (See Q191.)

</details>

**M397.** What does this print?
```python
from threading import RLock

lock = RLock()
with lock:
    with lock:
        print("ok")
```

- A) It hangs forever
- B) `None`
- C) `ok`
- D) `RuntimeError`

<details>
<summary>Answer</summary>

**C) `ok`**. The same thread can re-acquire an `RLock`. (See Q190.)

</details>

**M398.** Which tool allows at most N threads into a section?

- A) `Event`
- B) `Thread`
- C) `Lock`
- D) `Semaphore`

<details>
<summary>Answer</summary>

**D) `Semaphore`**. A `Lock` allows just one. (See Q190.)

</details>

**M399.** Which class is a thread-safe producer-consumer queue?

- A) `queue.Queue`
- B) `collections.Counter`
- C) `dict`
- D) `list`

<details>
<summary>Answer</summary>

**A) `queue.Queue`**. It handles the locking for you. (See Q192.)

</details>

**M400.** What does `executor.submit()` return?

- A) `None`
- B) The result directly
- C) A thread name
- D) A `Future`

<details>
<summary>Answer</summary>

**D) A `Future`**. Call `future.result()` for the value. (See Q193.)

</details>

**M401.** In which order does `executor.map()` return results?

- A) Completion order
- B) Sorted order
- C) Random order
- D) Input order

<details>
<summary>Answer</summary>

**D) Input order**. `as_completed()` gives completion order. (See Q193.)

</details>

**M402.** What does this print?
```python
from concurrent.futures import ThreadPoolExecutor

def fail():
    raise ValueError("bad")

with ThreadPoolExecutor() as executor:
    future = executor.submit(fail)
    print(type(future.exception()).__name__)
```

- A) `ValueError`
- B) `Future`
- C) `None`
- D) `RuntimeError`

<details>
<summary>Answer</summary>

**A) `ValueError`**. The exception is stored on the future until you ask for it. (See Q193.)

</details>

#### Multiprocessing

##### Process pools

**M403.** Why must process-pool functions be module-level?

- A) They must be picklable and importable
- B) The GIL requires it
- C) Lambdas are illegal in Python
- D) They'd run slower otherwise

<details>
<summary>Answer</summary>

**A) They must be picklable and importable**. Workers receive them by qualified name. (See Q194.)

</details>

**M404.** Why use `if __name__ == "__main__":` with process pools?

- A) To enable the GIL
- B) It's only a style choice
- C) To make imports faster
- D) So workers importing the module don't start the pool again

<details>
<summary>Answer</summary>

**D) So workers importing the module don't start the pool again**. The default start method on Windows and macOS imports your module. (See Q194.)

</details>

**M405.** Why might a process pool be slower than a loop?

- A) Startup and pickling costs outweigh small tasks
- B) The GIL blocks processes
- C) Pools run one task only
- D) Processes can't use CPU

<details>
<summary>Answer</summary>

**A) Startup and pickling costs outweigh small tasks**. Measure with a real workload. (See Q194.)

</details>

**M406.** Which is a good way to share a large array between processes?

- A) `shared_memory` or memory mapping
- B) A global variable
- C) A `Lock`
- D) `deepcopy()`

<details>
<summary>Answer</summary>

**A) `shared_memory` or memory mapping**. Don't resend big data for every task. (See Q195.)

</details>

**M407.** What happens to a global variable changed in a worker process?

- A) It raises `RuntimeError`
- B) The parent sees it at once
- C) Every worker sees it
- D) The parent doesn't see the change

<details>
<summary>Answer</summary>

**D) The parent doesn't see the change**. Processes have separate memory. (See Q195.)

</details>

#### Asyncio

##### `async` and `await`

**M408.** What does this print?
```python
async def get():
    return 1

coro = get()
print(type(coro).__name__)
coro.close()
```

- A) `int`
- B) `coroutine`
- C) `function`
- D) `Future`

<details>
<summary>Answer</summary>

**B) `coroutine`**. Calling it creates a coroutine object that hasn't run yet. (See Q196.)

</details>

**M409.** What does this print?
```python
import asyncio

async def get():
    return 1

print(asyncio.run(get()))
```

- A) `RuntimeError`
- B) `1`
- C) `None`
- D) `<coroutine>`

<details>
<summary>Answer</summary>

**B) `1`**. `asyncio.run()` runs the coroutine and returns its result. (See Q196.)

</details>

**M410.** Which of these can you NOT `await`?

- A) A plain `int`
- B) A task
- C) A future
- D) A coroutine

<details>
<summary>Answer</summary>

**A) A plain `int`**. Awaitables are coroutines, tasks, futures, and objects with `__await__`. (See Q196.)

</details>

**M411.** What does this print?
```python
import asyncio

async def work(name):
    print(name, "start", end=" | ")
    await asyncio.sleep(0)
    print(name, "end", end=" | ")

async def main():
    await asyncio.gather(work("A"), work("B"))

asyncio.run(main())
print()
```

- A) `A end | B end | A start | B start | `
- B) `A start | B start | A end | B end | `
- C) `A start | A end | B start | B end | `
- D) `B start | A start | B end | A end | `

<details>
<summary>Answer</summary>

**B) `A start | B start | A end | B end | `**. `sleep(0)` gives up control, so the tasks take turns. (See Q197.)

</details>

**M412.** What does this print?
```python
import asyncio

async def work(name):
    print(name, "start", end=" | ")
    await asyncio.sleep(0)
    print(name, "end", end=" | ")

async def main():
    await work("A")
    await work("B")

asyncio.run(main())
print()
```

- A) `A start | B start | A end | B end | `
- B) `B start | B end | A start | A end | `
- C) `A end | B end | A start | B start | `
- D) `A start | A end | B start | B end | `

<details>
<summary>Answer</summary>

**D) `A start | A end | B start | B end | `**. Awaiting one after another is sequential. (See Q197.)

</details>

**M413.** What does this print?
```python
import asyncio

async def get(n):
    await asyncio.sleep(0.02 - n / 100)
    return n

async def main():
    print(await asyncio.gather(get(0), get(1)))

asyncio.run(main())
```

- A) `[1, 0]`
- B) `1`
- C) `[0, 1]`
- D) `(0, 1)`

<details>
<summary>Answer</summary>

**C) `[0, 1]`**. `gather()` keeps argument order, not completion order. (See Q197.)

</details>

**M414.** Which does NOT run coroutines concurrently?

- A) `await` on each one in turn
- B) `asyncio.create_task()`
- C) `asyncio.TaskGroup`
- D) `asyncio.gather()`

<details>
<summary>Answer</summary>

**A) `await` on each one in turn**. Sequential awaits start the second after the first ends. (See Q197.)

</details>

**M415.** What happens if you call `time.sleep(5)` in a coroutine?

- A) The whole event loop is blocked
- B) Only that task pauses
- C) It raises `RuntimeError`
- D) It becomes async automatically

<details>
<summary>Answer</summary>

**A) The whole event loop is blocked**. Use `await asyncio.sleep(5)`. (See Q198.)

</details>

**M416.** How do you call blocking code from async code?

- A) `await asyncio.to_thread(func)`
- B) `asyncio.block(func)`
- C) `async func()`
- D) `await func()`

<details>
<summary>Answer</summary>

**A) `await asyncio.to_thread(func)`**. It moves the call off the loop thread. (See Q198.)

</details>

**M417.** What does this print?
```python
import asyncio

async def main():
    print(await asyncio.to_thread(len, "abc"))

asyncio.run(main())
```

- A) `None`
- B) `abc`
- C) `TypeError`
- D) `3`

<details>
<summary>Answer</summary>

**D) `3`**. `to_thread()` runs a sync function in a thread and returns its result. (See Q198.)

</details>

**M418.** How do you limit concurrent async requests?

- A) `asyncio.Semaphore`
- B) `asyncio.Limit`
- C) `time.sleep()`
- D) `threading.Event`

<details>
<summary>Answer</summary>

**A) `asyncio.Semaphore`**. Respect the capacity of the services you call. (See Q199.)

</details>

**M419.** What does this print?
```python
import asyncio

async def slow():
    await asyncio.sleep(1)

async def main():
    try:
        await asyncio.wait_for(slow(), timeout=0.01)
    except TimeoutError:
        print("TimeoutError")

asyncio.run(main())
```

- A) `CancelledError`
- B) `TimeoutError`
- C) `None`
- D) Nothing

<details>
<summary>Answer</summary>

**B) `TimeoutError`**. `wait_for()` cancels the task at the timeout. (See Q199.)

</details>

**M420.** What does this print?
```python
import asyncio

async def inner():
    return 1

async def main():
    coro = inner()
    try:
        asyncio.run(coro)
    except RuntimeError:
        print("RuntimeError")
    finally:
        coro.close()

asyncio.run(main())
```

- A) `1`
- B) Nothing
- C) `None`
- D) `RuntimeError`

<details>
<summary>Answer</summary>

**D) `RuntimeError`**. `asyncio.run()` can't be called from a running loop. (See Q200.)

</details>

**M421.** Why can't you use `asyncio.run()` in a notebook?

- A) Notebooks don't support Python 3
- B) A loop is already running, so use `await main()`
- C) Notebooks have no threads
- D) `asyncio` isn't installed there

<details>
<summary>Answer</summary>

**B) A loop is already running, so use `await main()`**. `await` works at the top level in those notebooks. (See Q200.)

</details>

**M422.** How do you yield control explicitly in a coroutine?

- A) `pass`
- B) `yield`
- C) `time.sleep(0)`
- D) `await asyncio.sleep(0)`

<details>
<summary>Answer</summary>

**D) `await asyncio.sleep(0)`**. An `await` that doesn't need to wait doesn't give up control. (See Q196.)

</details>

**M423.** How do you run CPU-heavy Python from async code?

- A) Add `async` to the function
- B) `loop.run_in_executor(process_pool, ...)`
- C) `await time.sleep()`
- D) `asyncio.to_thread()` for true parallelism

<details>
<summary>Answer</summary>

**B) `loop.run_in_executor(process_pool, ...)`**. A process pool keeps the loop free and uses several cores. (See Q201.)

</details>

#### ML performance

##### Speeding up CPU-bound preprocessing

**M424.** What is the first step to speed up CPU-bound preprocessing?

- A) Buy a GPU
- B) Rewrite it in C
- C) Confirm it's CPU-bound, and profile it
- D) Add more processes

<details>
<summary>Answer</summary>

**C) Confirm it's CPU-bound, and profile it**. Find the operation that's actually expensive. (See Q202.)

</details>

**M425.** What is usually the biggest win?

- A) `deepcopy()`
- B) More `async` keywords
- C) A better algorithm or vectorization
- D) More threads

<details>
<summary>Answer</summary>

**C) A better algorithm or vectorization**. Processes multiply a bad algorithm's cost. (See Q202.)

</details>

**M426.** What is oversubscription?

- A) Too many imports
- B) Too many `await` statements
- C) More active threads than cores
- D) A pool with one worker

<details>
<summary>Answer</summary>

**C) More active threads than cores**. For example, processes multiplied by BLAS threads. (See Q203.)

</details>

**M427.** What does a larger `chunksize` trade off?

- A) Threads for processes
- B) More memory for faster imports
- C) Accuracy for speed
- D) Lower scheduling overhead for worse load balancing

<details>
<summary>Answer</summary>

**D) Lower scheduling overhead for worse load balancing**. Tasks of varied cost need smaller chunks. (See Q203.)

</details>

**M428.** How do you avoid leakage when scaling features?

- A) Fit statistics on training data only
- B) Fit separately on validation data
- C) Fit on all data together
- D) Scale after training

<details>
<summary>Answer</summary>

**A) Fit statistics on training data only**. Reuse the training statistics for validation and inference. (See Q203.)

</details>

**M429.** How should you compare float outputs after parallelizing?

- A) By comparing `id()`
- B) With `is`
- C) With a tolerance, such as `math.isclose()`
- D) With `==` only

<details>
<summary>Answer</summary>

**C) With a tolerance, such as `math.isclose()`**. Order of operations can change tiny float results. (See Q202.)

</details>

**M430.** Which tool can compile a custom numeric kernel?

- A) Numba or Cython
- B) `tracemalloc`
- C) `pickle`
- D) `functools`

<details>
<summary>Answer</summary>

**A) Numba or Cython**. Include compilation and deployment costs in the decision. (See Q203.)

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

### Python basics and libraries

**R7.** Why is Python popular for ML?

<details>
<summary>Answer</summary>

Simple syntax, plus fast libraries that run native code underneath.

</details>

**R8.** Name six key Python features.

<details>
<summary>Answer</summary>

Readable syntax, dynamic typing, multiple styles, cross-platform, large ecosystem, native code integration.

</details>

**R9.** What are the three main programming styles in Python?

<details>
<summary>Answer</summary>

Procedural, functional, and object-oriented.

</details>

**R10.** What are the main tools of the functional style?

<details>
<summary>Answer</summary>

`map()`, `filter()`, `lambda`, and comprehensions.

</details>

**R11.** Readable vs concise?

<details>
<summary>Answer</summary>

Readable = easy to understand. Concise = fewer lines for the same task.

</details>

**R12.** What does integration with native code mean?

<details>
<summary>Answer</summary>

Python calls compiled C, C++, or GPU code that does the heavy work.

</details>

**R13.** Name the library for: arrays, tables, classical ML, deep learning, plots, APIs.

<details>
<summary>Answer</summary>

NumPy, pandas, scikit-learn, PyTorch, Matplotlib, FastAPI.

</details>

**R14.** Which tool is used for experimenting interactively?

<details>
<summary>Answer</summary>

Jupyter notebooks.

</details>

**R15.** What is vectorization?

<details>
<summary>Answer</summary>

Running an operation on a whole array without a Python loop, like `arr * 2`.

</details>

**R16.** Why is NumPy fast?

<details>
<summary>Answer</summary>

Whole-array work runs in compiled code, without Python's per-element overhead.

</details>

### Types and mutability

**R17.** What is dynamic typing?

<details>
<summary>Answer</summary>

Types are checked at runtime, and you never declare them.

</details>

**R18.** What is `type(x)` actually telling you?

<details>
<summary>Answer</summary>

The type of the object that `x` refers to.

</details>

**R19.** Is `x = 1` then `x = "a"` allowed?

<details>
<summary>Answer</summary>

Yes, reassignment can point a name at any type.

</details>

**R20.** Does `"1" + 1` fail when defined inside a function?

<details>
<summary>Answer</summary>

No, only when that line runs.

</details>

**R21.** Do type hints stop wrong types at runtime?

<details>
<summary>Answer</summary>

No. Use mypy for static checks or Pydantic for runtime validation.

</details>

**R22.** Name the mutable types.

<details>
<summary>Answer</summary>

`list`, `dict`, `set`, `bytearray`.

</details>

**R23.** Name the immutable types.

<details>
<summary>Answer</summary>

`int`, `float`, `bool`, `str`, `tuple`, `frozenset`.

</details>

**R24.** What is a binding?

<details>
<summary>Answer</summary>

A name referring to an object.

</details>

**R25.** What does in place mean?

<details>
<summary>Answer</summary>

The same object is changed, and no new one is created.

</details>

**R26.** `list += [x]` or `list = list + [x]`: which changes in place?

<details>
<summary>Answer</summary>

`+=` changes in place. `list + [x]` builds a new list.

</details>

**R27.** What is a shared reference?

<details>
<summary>Answer</summary>

Two names pointing to the same object.

</details>

**R28.** How do you copy a list?

<details>
<summary>Answer</summary>

`a.copy()`, `list(a)`, or `a[:]`. All of these are shallow.

</details>

**R29.** Shallow vs deep copy?

<details>
<summary>Answer</summary>

Shallow copies only the outer object. `copy.deepcopy()` copies nested objects too.

</details>

**R30.** Can a list inside a tuple change?

<details>
<summary>Answer</summary>

Yes. The tuple can't swap the list, but the list can change itself.

</details>

**R31.** What does hashable mean?

<details>
<summary>Answer</summary>

The object has a hash value that never changes.

</details>

**R32.** When is a tuple hashable?

<details>
<summary>Answer</summary>

Only when all of its items are hashable.

</details>

**R33.** Why can't a list be a dict key?

<details>
<summary>Answer</summary>

It's mutable, so it's unhashable.

</details>

### Collections

**R34.** List vs tuple?

<details>
<summary>Answer</summary>

A list can change. A tuple is fixed and can be a dict key.

</details>

**R35.** When do you use a set?

<details>
<summary>Answer</summary>

To remove duplicates or for fast membership checks.

</details>

**R36.** When do you use a dict?

<details>
<summary>Answer</summary>

For key-to-value lookups.

</details>

**R37.** How do you make an empty set?

<details>
<summary>Answer</summary>

`set()`, because `{}` is an empty dict.

</details>

**R38.** How do you make a one-item tuple?

<details>
<summary>Answer</summary>

With a trailing comma: `(1,)`.

</details>

**R39.** Which collections are ordered sequences?

<details>
<summary>Answer</summary>

`list`, `tuple`, `str`, and `range`.

</details>

**R40.** Does a dict keep order?

<details>
<summary>Answer</summary>

Yes, insertion order, but it isn't a sequence.

</details>

**R41.** List vs set membership speed?

<details>
<summary>Answer</summary>

List is O(n). Set and dict are O(1) on average.

</details>

**R42.** What must set items and dict keys be?

<details>
<summary>Answer</summary>

Hashable.

</details>

### Identity, None, and truthiness

**R43.** `==` vs `is`?

<details>
<summary>Answer</summary>

`==` compares contents. `is` compares objects.

</details>

**R44.** How do you see an object's identity?

<details>
<summary>Answer</summary>

`id(x)`.

</details>

**R45.** How do you check for None?

<details>
<summary>Answer</summary>

`x is None`.

</details>

**R46.** Why avoid `if not x` to check for None?

<details>
<summary>Answer</summary>

It's also true for `0`, `""`, and `[]`.

</details>

**R47.** Which operator compares any two values for equality?

<details>
<summary>Answer</summary>

`==`.

</details>

**R48.** Can dictionaries use `<`?

<details>
<summary>Answer</summary>

No, it raises `TypeError`.

</details>

**R49.** What is `type(None)`?

<details>
<summary>Answer</summary>

`NoneType`.

</details>

**R50.** What is `type(False)`?

<details>
<summary>Answer</summary>

`bool`, which is a subclass of `int`.

</details>

**R51.** How do you check any collection is empty?

<details>
<summary>Answer</summary>

`if not items:`.

</details>

**R52.** List the falsy values.

<details>
<summary>Answer</summary>

`None`, `False`, `0`, `0.0`, and empty collections.

</details>

### Scope

**R53.** What does LEGB stand for?

<details>
<summary>Answer</summary>

Local, Enclosing, Global, Built-in.

</details>

**R54.** Variable in the outer function?

<details>
<summary>Answer</summary>

Enclosing.

</details>

**R55.** Variable in the current function?

<details>
<summary>Answer</summary>

Local.

</details>

**R56.** Variable at module level?

<details>
<summary>Answer</summary>

Global.

</details>

**R57.** `global` vs `nonlocal`?

<details>
<summary>Answer</summary>

`global` is for module variables. `nonlocal` is for enclosing function variables.

</details>

**R58.** What causes UnboundLocalError?

<details>
<summary>Answer</summary>

Reading a local variable before it's assigned.

</details>

**R59.** How do you fix `count += 1` on a global?

<details>
<summary>Answer</summary>

Add `global count`, or better, pass it in and return it.

</details>

### Lists: append, duplicates, slicing

**R60.** `append()` vs `extend()`?

<details>
<summary>Answer</summary>

`append()` adds one item. `extend()` adds each item of an iterable.

</details>

**R61.** Adding a whole object or its elements?

<details>
<summary>Answer</summary>

Whole object: `append()`. Elements: `extend()`.

</details>

**R62.** What does `extend("hi")` add?

<details>
<summary>Answer</summary>

`'h'` and `'i'`.

</details>

**R63.** Can `extend()` take a range?

<details>
<summary>Answer</summary>

Yes, any iterable: `extend(range(1, 4))`.

</details>

**R64.** What does `extend(dict)` add?

<details>
<summary>Answer</summary>

The keys.

</details>

**R65.** What do `append()` and `extend()` return?

<details>
<summary>Answer</summary>

`None`, because they change the list in place.

</details>

**R66.** Remove duplicates, keep order?

<details>
<summary>Answer</summary>

`list(dict.fromkeys(items))`.

</details>

**R67.** What does preserving order mean?

<details>
<summary>Answer</summary>

Values stay where they first appeared.

</details>

**R68.** Is `list(set(items))` ordered?

<details>
<summary>Answer</summary>

Not guaranteed.

</details>

**R69.** Unique values in a pandas Series?

<details>
<summary>Answer</summary>

`s.unique()` or `s.drop_duplicates()`.

</details>

**R70.** Unique words in A to Z order?

<details>
<summary>Answer</summary>

`sorted(set(words))`.

</details>

**R71.** How do you take part of a list?

<details>
<summary>Answer</summary>

Slicing: `items[start:stop]`.

</details>

**R72.** What is the slice syntax?

<details>
<summary>Answer</summary>

`items[start:stop:step]`.

</details>

**R73.** Is the stop index included?

<details>
<summary>Answer</summary>

No. Start is included, stop is excluded.

</details>

**R74.** How do you reverse a list into a new list?

<details>
<summary>Answer</summary>

`items[::-1]`.

</details>

**R75.** How do you reverse in place?

<details>
<summary>Answer</summary>

`items.reverse()`.

</details>

**R76.** First 3 items?

<details>
<summary>Answer</summary>

`items[:3]`.

</details>

**R77.** Last 3 items?

<details>
<summary>Answer</summary>

`items[-3:]`.

</details>

**R78.** Without the first and last?

<details>
<summary>Answer</summary>

`items[1:-1]`.

</details>

**R79.** Every second item?

<details>
<summary>Answer</summary>

`items[::2]`.

</details>

**R80.** Can a slice step be zero?

<details>
<summary>Answer</summary>

No, it raises `ValueError`.

</details>

**R81.** Slice past the end of a list?

<details>
<summary>Answer</summary>

It gives a shorter or empty list, with no error.

</details>

### Sorting

**R82.** `sorted()` vs `.sort()`?

<details>
<summary>Answer</summary>

`sorted()` returns a new list. `.sort()` changes the list and returns `None`.

</details>

**R83.** Sort model dicts by accuracy, highest first?

<details>
<summary>Answer</summary>

`sorted(models, key=lambda m: m["accuracy"], reverse=True)`.

</details>

**R84.** Sort dict keys by value?

<details>
<summary>Answer</summary>

`sorted(d, key=d.get)`.

</details>

**R85.** What does `sorted()` return for a string, set, or tuple?

<details>
<summary>Answer</summary>

Always a list.

</details>

**R86.** What does `key=` do?

<details>
<summary>Answer</summary>

It gives the value used for comparing each item.

</details>

**R87.** Sort strings ignoring case?

<details>
<summary>Answer</summary>

`key=str.lower`.

</details>

**R88.** Sort number strings by value?

<details>
<summary>Answer</summary>

`key=int`.

</details>

**R89.** Is Python's sort stable?

<details>
<summary>Answer</summary>

Yes, equal items keep their original order.

</details>

**R90.** Sort a dict and keep a dict?

<details>
<summary>Answer</summary>

`dict(sorted(d.items()))`.

</details>

**R91.** In `sorted(d.items(), key=lambda p: ...)`, what are `p[0]` and `p[1]`?

<details>
<summary>Answer</summary>

The key and the value.

</details>

**R92.** What does `reverse=True` do?

<details>
<summary>Answer</summary>

It gives largest first, or Z to A.

</details>

**R93.** How do you count vowels in a sort key?

<details>
<summary>Answer</summary>

`sum(c in "aeiou" for c in w.lower())`.

</details>

**R94.** How do you put words containing "py" first?

<details>
<summary>Answer</summary>

`key=lambda w: "py" not in w.lower()`.

</details>

**R95.** How do you apply a rule to dict keys while sorting?

<details>
<summary>Answer</summary>

Use `p[0]` inside the key on `d.items()`.

</details>

**R96.** How do you sort by several rules?

<details>
<summary>Answer</summary>

Return a tuple from the key.

</details>

**R97.** How do you sort numbers highest first inside a tuple key?

<details>
<summary>Answer</summary>

Negate them: `-x["marks"]`.

</details>

**R98.** How do you put `True` values first?

<details>
<summary>Answer</summary>

`not x["flag"]`, because `False` sorts first.

</details>

**R99.** Do ISO date strings sort correctly?

<details>
<summary>Answer</summary>

Yes, oldest first.

</details>

**R100.** All rules A to Z: which key?

<details>
<summary>Answer</summary>

A plain tuple of the fields.

</details>

**R101.** What is the key for rating high, price low, days low?

<details>
<summary>Answer</summary>

`(-rating, price, days)`.

</details>

**R102.** What is the key for exact first, score high, title A to Z?

<details>
<summary>Answer</summary>

`(not exact, -score, title)`.

</details>

**R103.** Both rules highest first, with a date string?

<details>
<summary>Answer</summary>

A tuple key with `reverse=True`.

</details>

**R104.** How do you sort by a custom status order?

<details>
<summary>Answer</summary>

Map each status to a number with a dict.

</details>

### Dictionaries and complexity

**R105.** Does a dict keep insertion order?

<details>
<summary>Answer</summary>

Yes, since Python 3.7. That isn't the same as sorted order.

</details>

**R106.** List insert or delete at the start?

<details>
<summary>Answer</summary>

O(n), because items shift.

</details>

**R107.** List `append()` and `pop()`?

<details>
<summary>Answer</summary>

O(1) amortized for `append()`, and O(1) for `pop()`.

</details>

**R108.** Dict lookup, insert, or delete by key?

<details>
<summary>Answer</summary>

O(1) on average, O(n) worst case.

</details>

**R109.** Iterating a list or dict?

<details>
<summary>Answer</summary>

O(n).

</details>

**R110.** Name four ways to build a dict.

<details>
<summary>Answer</summary>

`{...}`, `dict(a=1)`, `dict(zip(k, v))`, and a comprehension.

</details>

**R111.** Keys sharing one default value?

<details>
<summary>Answer</summary>

`dict.fromkeys(keys, 0)`.

</details>

**R112.** Count repeated items?

<details>
<summary>Answer</summary>

`collections.Counter(items)`.

</details>

**R113.** `key=value` string to a dict?

<details>
<summary>Answer</summary>

`dict(p.split("=") for p in s.split(","))`.

</details>

**R114.** JSON string to a dict?

<details>
<summary>Answer</summary>

`json.loads(s)`.

</details>

**R115.** Give each key its own list?

<details>
<summary>Answer</summary>

`{k: [] for k in keys}`.

</details>

**R116.** What is the trap in `dict.fromkeys(keys, [])`?

<details>
<summary>Answer</summary>

All keys share one list.

</details>

**R117.** Number to its square?

<details>
<summary>Answer</summary>

`{n: n ** 2 for n in nums}`.

</details>

**R118.** Word to its length?

<details>
<summary>Answer</summary>

`{w: len(w) for w in words}`.

</details>

**R119.** Index users by ID?

<details>
<summary>Answer</summary>

`{u["id"]: u for u in users}`.

</details>

**R120.** Keep scores of 60 or higher?

<details>
<summary>Answer</summary>

`{k: v for k, v in d.items() if v >= 60}`.

</details>

**R121.** Tuple, string, or range to a list?

<details>
<summary>Answer</summary>

`list(x)`.

</details>

**R122.** JSON array to a list?

<details>
<summary>Answer</summary>

`json.loads(s)`.

</details>

**R123.** Comma text to integers?

<details>
<summary>Answer</summary>

`[int(n) for n in s.split(",")]`.

</details>

**R124.** Extract one field from dicts?

<details>
<summary>Answer</summary>

`[d["name"] for d in rows]`.

</details>

**R125.** Unique sorted labels?

<details>
<summary>Answer</summary>

`sorted(set(labels))`.

</details>

**R126.** Models with at least 90% accuracy?

<details>
<summary>Answer</summary>

`{m: a for m, a in d.items() if a >= 0.90}`.

</details>

**R127.** Label to ID from 0?

<details>
<summary>Answer</summary>

`{l: i for i, l in enumerate(labels)}`.

</details>

**R128.** What is the dict comprehension pattern?

<details>
<summary>Answer</summary>

`{key: value for item in iterable}`.

</details>

### enumerate, zip, and unpacking

**R129.** Index with values, starting at 1?

<details>
<summary>Answer</summary>

`enumerate(items, start=1)`.

</details>

**R130.** What does `zip()` do with unequal lengths?

<details>
<summary>Answer</summary>

It silently stops at the shortest.

</details>

**R131.** What does `strict=True` do?

<details>
<summary>Answer</summary>

It raises `ValueError` if lengths differ (Python 3.10+).

</details>

**R132.** Separate pairs into two tuples?

<details>
<summary>Answer</summary>

`names, scores = zip(*pairs)`.

</details>

**R133.** Separate a dict into names and scores?

<details>
<summary>Answer</summary>

`zip(*d.items())`.

</details>

**R134.** List of dicts into two tuples?

<details>
<summary>Answer</summary>

Build pairs with a comprehension, then use `zip(*pairs)`.

</details>

**R135.** Tuple to a list?

<details>
<summary>Answer</summary>

`list(t)`.

</details>

**R136.** Pairs into two lists in one line?

<details>
<summary>Answer</summary>

`a, b = map(list, zip(*pairs))`.

</details>

**R137.** What type is `*args`?

<details>
<summary>Answer</summary>

A tuple.

</details>

**R138.** What type is `**kwargs`?

<details>
<summary>Answer</summary>

A dict.

</details>

**R139.** When do you use `*args` and `**kwargs`?

<details>
<summary>Answer</summary>

For flexible calls and wrappers that forward arguments.

</details>

**R140.** `*` and `**` in a function call?

<details>
<summary>Answer</summary>

`*` unpacks positional arguments. `**` unpacks keyword arguments.

</details>

**R141.** Why unpack settings into `fit()`?

<details>
<summary>Answer</summary>

Each experiment changes only the settings dict.

</details>

### Merging and safe access

**R142.** Three ways to merge dicts?

<details>
<summary>Answer</summary>

`a | b`, `{**a, **b}`, and `a.update(b)`.

</details>

**R143.** Which merge changes `a` in place?

<details>
<summary>Answer</summary>

`a.update(b)` or `a |= b`.

</details>

**R144.** Shared key: which value is kept?

<details>
<summary>Answer</summary>

The right dictionary's value.

</details>

**R145.** Where does a shared key sit?

<details>
<summary>Answer</summary>

In its original position. New keys go at the end.

</details>

**R146.** How do you find shared keys?

<details>
<summary>Answer</summary>

`a.keys() & b.keys()`.

</details>

**R147.** Does `dict | list` work?

<details>
<summary>Answer</summary>

No, it raises `TypeError`.

</details>

**R148.** What does `d[key]` do for a missing key?

<details>
<summary>Answer</summary>

It raises `KeyError`.

</details>

**R149.** What does `d.get(key)` return for a missing key?

<details>
<summary>Answer</summary>

`None`, or the default you pass.

</details>

**R150.** What does LBYL mean?

<details>
<summary>Answer</summary>

Look Before You Leap: check first with `in`.

</details>

**R151.** What does EAFP mean?

<details>
<summary>Answer</summary>

Easier to Ask Forgiveness than Permission: use `try/except`.

</details>

### OOP

#### `__init__` and `self`

**R152.** When is `__init__` called?

<details>
<summary>Answer</summary>

Automatically, after the instance is created.

</details>

**R153.** What is `self`?

<details>
<summary>Answer</summary>

The instance being initialized.

</details>

**R154.** Is `self` a keyword?

<details>
<summary>Answer</summary>

No; it is a convention for the first parameter.

</details>

**R155.** Which method creates the instance?

<details>
<summary>Answer</summary>

`__new__`.

</details>

**R156.** What must `__init__` return?

<details>
<summary>Answer</summary>

`None`.

</details>

**R157.** When is `__init__` skipped?

<details>
<summary>Answer</summary>

When `__new__` returns an object that isn't an instance of the class.

</details>

**R158.** Where should a per-instance list be created?

<details>
<summary>Answer</summary>

Inside `__init__`.

</details>

**R159.** Is a dict created in the class body shared by instances?

<details>
<summary>Answer</summary>

Yes.

</details>

**R160.** Is the parent `__init__` called automatically?

<details>
<summary>Answer</summary>

Only if the subclass doesn't define its own `__init__`.

</details>

#### Instance, class, and static methods

**R161.** What does an instance method receive first?

<details>
<summary>Answer</summary>

The instance, `self`.

</details>

**R162.** What does a class method receive first?

<details>
<summary>Answer</summary>

The class it was called on, `cls`.

</details>

**R163.** What does a static method receive first?

<details>
<summary>Answer</summary>

Nothing extra.

</details>

**R164.** Can you call a class method on an instance?

<details>
<summary>Answer</summary>

Yes; it still receives the class.

</details>

**R165.** What is a typical class method?

<details>
<summary>Answer</summary>

An alternative constructor such as `from_dict()`.

</details>

**R166.** Why use `cls(...)` instead of the class name?

<details>
<summary>Answer</summary>

Subclasses then get instances of themselves.

</details>

**R167.** Can a static method access instance data?

<details>
<summary>Answer</summary>

Only through objects passed explicitly.

</details>

**R168.** What happens if you forget `@staticmethod`?

<details>
<summary>Answer</summary>

Calls through an instance pass an extra argument.

</details>

**R169.** Does `self.count += 1` update a class attribute?

<details>
<summary>Answer</summary>

No; it creates an instance attribute.

</details>

#### Encapsulation and polymorphism

**R170.** What are the four pillars of OOP?

<details>
<summary>Answer</summary>

Encapsulation, abstraction, inheritance, and polymorphism.

</details>

**R171.** What is the difference between a class and an object?

<details>
<summary>Answer</summary>

A class is the blueprint; an object is an instance built from it.

</details>

**R172.** What is a class attribute?

<details>
<summary>Answer</summary>

An attribute on the class, shared by all instances.

</details>

**R173.** Does Python have truly private attributes?

<details>
<summary>Answer</summary>

No; it uses naming conventions.

</details>

**R174.** What does `_name` mean?

<details>
<summary>Answer</summary>

Internal by convention, not enforced.

</details>

**R175.** What does `__name` do?

<details>
<summary>Answer</summary>

Name mangling: it is stored as `_ClassName__name`.

</details>

**R176.** What does `@property` do?

<details>
<summary>Answer</summary>

It lets a method be read like an attribute.

</details>

**R177.** How do you make a property read-only?

<details>
<summary>Answer</summary>

Don't define a setter.

</details>

**R178.** What is polymorphism?

<details>
<summary>Answer</summary>

The same call works on different types.

</details>

**R179.** What is duck typing?

<details>
<summary>Answer</summary>

Python checks for the behaviour, not the class.

</details>

**R180.** Does Python support method overloading?

<details>
<summary>Answer</summary>

No; a second `def` with the same name replaces the first.

</details>

**R181.** How do you create an abstract class?

<details>
<summary>Answer</summary>

Inherit from `abc.ABC` and use `@abstractmethod`.

</details>

**R182.** Can you instantiate an abstract class?

<details>
<summary>Answer</summary>

No; it raises `TypeError`.

</details>

**R183.** Is-a vs has-a?

<details>
<summary>Answer</summary>

Is-a suggests inheritance; has-a suggests composition.

</details>

#### Inheritance

**R184.** What is inheritance?

<details>
<summary>Answer</summary>

A subclass reusing a base class's attributes and methods.

</details>

**R185.** What is overriding?

<details>
<summary>Answer</summary>

Defining a method with the same name in the subclass.

</details>

**R186.** Which version runs for a subclass instance?

<details>
<summary>Answer</summary>

The first one found in the MRO, usually the subclass's.

</details>

**R187.** What does `super()` return?

<details>
<summary>Answer</summary>

A proxy that finds the next implementation in the MRO.

</details>

**R188.** Does Python check override signatures?

<details>
<summary>Answer</summary>

No; matching is by name only.

</details>

**R189.** `isinstance()` vs `type() is`?

<details>
<summary>Answer</summary>

`isinstance()` accepts subclasses.

</details>

**R190.** Why prefer `super()` over `Model.method(self)`?

<details>
<summary>Answer</summary>

It follows the MRO and supports cooperative inheritance.

</details>

**R191.** What is the root of every class?

<details>
<summary>Answer</summary>

`object`.

</details>

#### Multiple inheritance

**R192.** What is multiple inheritance?

<details>
<summary>Answer</summary>

A class with more than one direct base class.

</details>

**R193.** What is the MRO?

<details>
<summary>Answer</summary>

The order Python searches classes for attributes.

</details>

**R194.** Which algorithm builds the MRO?

<details>
<summary>Answer</summary>

C3 linearization.

</details>

**R195.** How do you inspect the MRO?

<details>
<summary>Answer</summary>

`Cls.__mro__` or `Cls.mro()`.

</details>

**R196.** What is the diamond problem?

<details>
<summary>Answer</summary>

Two bases share an ancestor, risking duplicate or ambiguous calls.

</details>

**R197.** How does Python solve the diamond problem?

<details>
<summary>Answer</summary>

The ancestor appears once in the MRO, and cooperative `super()` visits each class once.

</details>

**R198.** Does `super()` always mean the direct parent?

<details>
<summary>Answer</summary>

No; it means the next class in `type(self)`'s MRO.

</details>

**R199.** Why use `**kwargs` in cooperative `__init__`?

<details>
<summary>Answer</summary>

Each class takes its arguments and forwards the rest.

</details>

**R200.** When does Python raise `TypeError` for an MRO?

<details>
<summary>Answer</summary>

When no consistent MRO exists.

</details>

**R201.** Where should mixins go in the base list?

<details>
<summary>Answer</summary>

Usually before the main base class.

</details>

#### Dunder methods

**R202.** What is a dunder method?

<details>
<summary>Answer</summary>

A special method named `__name__` that Python calls for built-in operations.

</details>

**R203.** What calls `__str__`?

<details>
<summary>Answer</summary>

`str()`, `print()`, and f-strings.

</details>

**R204.** What calls `__repr__`?

<details>
<summary>Answer</summary>

`repr()`, the REPL, `!r`, and containers.

</details>

**R205.** If only `__repr__` exists, what does `print()` show?

<details>
<summary>Answer</summary>

The `__repr__` result.

</details>

**R206.** What must `__len__` return?

<details>
<summary>Answer</summary>

A non-negative `int`.

</details>

**R207.** What does `__call__` enable?

<details>
<summary>Answer</summary>

Calling an instance like `obj(...)`.

</details>

**R208.** Should you call `obj.__len__()` directly?

<details>
<summary>Answer</summary>

No; use `len(obj)`.

</details>

**R209.** Does attaching `__len__` to an instance work?

<details>
<summary>Answer</summary>

No; implicit lookup uses the class.

</details>

**R210.** What should an operator return for unsupported types?

<details>
<summary>Answer</summary>

`NotImplemented`.

</details>

**R211.** What does defining `__eq__` do to `__hash__`?

<details>
<summary>Answer</summary>

Sets it to `None` unless you define `__hash__`.

</details>

#### Dataclasses

**R212.** What does `@dataclass` generate by default?

<details>
<summary>Answer</summary>

`__init__`, `__repr__`, and `__eq__`.

</details>

**R213.** How do you add `<` and `>` to a dataclass?

<details>
<summary>Answer</summary>

`@dataclass(order=True)`.

</details>

**R214.** Why `field(default_factory=list)`?

<details>
<summary>Answer</summary>

Each instance gets its own list.

</details>

**R215.** What happens with `features: list = []` in a dataclass?

<details>
<summary>Answer</summary>

`ValueError` at class definition.

</details>

**R216.** Are type annotations enforced?

<details>
<summary>Answer</summary>

No.

</details>

**R217.** Where do you validate values in a dataclass?

<details>
<summary>Answer</summary>

`__post_init__`.

</details>

**R218.** What does `frozen=True` raise on assignment?

<details>
<summary>Answer</summary>

`FrozenInstanceError`.

</details>

**R219.** Is a frozen dataclass deeply immutable?

<details>
<summary>Answer</summary>

No; mutable field values can still change.

</details>

**R220.** Is a default dataclass hashable?

<details>
<summary>Answer</summary>

No; `eq=True` without `frozen` sets `__hash__` to `None`.

</details>

**R221.** Which version added `slots=` and `kw_only=`?

<details>
<summary>Answer</summary>

Python 3.10.

</details>

### Functions, Decorators and Generators

#### Function basics

**R222.** What is a first-class function?

<details>
<summary>Answer</summary>

A function you can store, pass, and return like any object.

</details>

**R223.** What is a higher-order function?

<details>
<summary>Answer</summary>

A function that takes or returns another function.

</details>

**R224.** Does `map()` return a list?

<details>
<summary>Answer</summary>

No; it returns a lazy iterator.

</details>

**R225.** Where does `reduce` come from?

<details>
<summary>Answer</summary>

`functools`.

</details>

**R226.** When are default arguments evaluated?

<details>
<summary>Answer</summary>

Once, when the `def` runs.

</details>

**R227.** What is the safe default for a list parameter?

<details>
<summary>Answer</summary>

`None`, then create the list inside the function.

</details>

**R228.** What does `/` mean in a parameter list?

<details>
<summary>Answer</summary>

Parameters before it are positional-only.

</details>

**R229.** What does a bare `*` mean in a parameter list?

<details>
<summary>Answer</summary>

Parameters after it are keyword-only.

</details>

**R230.** How does Python pass arguments?

<details>
<summary>Answer</summary>

By object reference, also called call by sharing.

</details>

#### Lambda functions

**R231.** What is a lambda?

<details>
<summary>Answer</summary>

An anonymous function defined by one expression.

</details>

**R232.** What does a lambda return?

<details>
<summary>Answer</summary>

The value of its expression.

</details>

**R233.** What is a lambda's `__name__`?

<details>
<summary>Answer</summary>

`<lambda>`.

</details>

**R234.** Can a lambda have default arguments?

<details>
<summary>Answer</summary>

Yes, plus `*args` and `**kwargs`.

</details>

**R235.** Can a lambda contain `if`?

<details>
<summary>Answer</summary>

Only a conditional expression, not an `if` statement.

</details>

**R236.** Can a lambda raise or catch exceptions?

<details>
<summary>Answer</summary>

It cannot contain `raise` or `try`.

</details>

**R237.** What is the most common use of a lambda?

<details>
<summary>Answer</summary>

Sorting keys and short callbacks.

</details>

**R238.** Should you write `f = lambda x: ...`?

<details>
<summary>Answer</summary>

No; PEP 8 recommends `def`.

</details>

**R239.** Is a lambda faster than `def`?

<details>
<summary>Answer</summary>

No.

</details>

**R240.** Can a lambda capture outer variables?

<details>
<summary>Answer</summary>

Yes, like any nested function, including late binding.

</details>

#### Closures

**R241.** What is a closure?

<details>
<summary>Answer</summary>

A function that keeps access to variables from its enclosing function.

</details>

**R242.** Which LEGB scope does a closure use?

<details>
<summary>Answer</summary>

Enclosing.

</details>

**R243.** Where are captured values stored?

<details>
<summary>Answer</summary>

In cell objects in `function.__closure__`.

</details>

**R244.** What is `__closure__` for a non-closure?

<details>
<summary>Answer</summary>

`None`.

</details>

**R245.** Does a closure copy the value?

<details>
<summary>Answer</summary>

No; it refers to the variable and sees later changes.

</details>

**R246.** When is `nonlocal` needed?

<details>
<summary>Answer</summary>

To reassign an enclosing function's variable.

</details>

**R247.** What happens if you reassign an enclosing variable without `nonlocal`?

<details>
<summary>Answer</summary>

`UnboundLocalError` when the name is read before assignment.

</details>

**R248.** Is `nonlocal` needed for `list.append()`?

<details>
<summary>Answer</summary>

No; that is mutation, not rebinding.

</details>

**R249.** Why does `[lambda: n for n in range(3)]` give `[2, 2, 2]`?

<details>
<summary>Answer</summary>

Late binding: `n` is looked up at call time.

</details>

**R250.** How do you fix late binding?

<details>
<summary>Answer</summary>

Default argument, factory function, or `functools.partial`.

</details>

#### Decorators

**R251.** What is a decorator?

<details>
<summary>Answer</summary>

A callable that takes a function or class and returns its replacement.

</details>

**R252.** What does `@log_call` mean?

<details>
<summary>Answer</summary>

Roughly `add = log_call(add)`.

</details>

**R253.** When does the decorator run?

<details>
<summary>Answer</summary>

Once, when the decorated definition executes.

</details>

**R254.** When does the wrapper run?

<details>
<summary>Answer</summary>

On every call to the decorated function.

</details>

**R255.** Why does a wrapper use `*args, **kwargs`?

<details>
<summary>Answer</summary>

To accept and forward any arguments.

</details>

**R256.** What if the wrapper doesn't return?

<details>
<summary>Answer</summary>

Callers get `None`.

</details>

**R257.** What does `@wraps` do?

<details>
<summary>Answer</summary>

Copies metadata and sets `__wrapped__`.

</details>

**R258.** What is the order of stacked decorators?

<details>
<summary>Answer</summary>

Applied bottom-up; the top wrapper runs first.

</details>

**R259.** How do decorator arguments work?

<details>
<summary>Answer</summary>

A factory returns the actual decorator.

</details>

**R260.** What are common uses of decorators?

<details>
<summary>Answer</summary>

Logging, timing, caching, auth checks, retries.

</details>

#### Class decorators

**R261.** What does a function decorator receive?

<details>
<summary>Answer</summary>

A function.

</details>

**R262.** What does a class decorator receive?

<details>
<summary>Answer</summary>

A class.

</details>

**R263.** What does a class decorator usually return?

<details>
<summary>Answer</summary>

The same class, modified or registered.

</details>

**R264.** When is a function or class decorator applied?

<details>
<summary>Answer</summary>

When the decorated definition executes.

</details>

**R265.** Does a class decorator run per instance?

<details>
<summary>Answer</summary>

No; once per class definition.

</details>

**R266.** Can a decorator be implemented as a class?

<details>
<summary>Answer</summary>

Yes, using `__init__` and `__call__`.

</details>

**R267.** Why can a class-based decorator break methods?

<details>
<summary>Answer</summary>

Without `__get__`, `self` is not passed.

</details>

**R268.** Built-in class decorator examples?

<details>
<summary>Answer</summary>

`@dataclass`, `@functools.total_ordering`.

</details>

**R269.** Built-in function decorator examples?

<details>
<summary>Answer</summary>

`@lru_cache`, `@property`, `@staticmethod`.

</details>

**R270.** Alternative for registering all subclasses?

<details>
<summary>Answer</summary>

`__init_subclass__`.

</details>

#### Iterables and iterators

**R271.** What is an iterable?

<details>
<summary>Answer</summary>

An object `iter()` can get an iterator from.

</details>

**R272.** What is an iterator?

<details>
<summary>Answer</summary>

An object with `__next__()` whose `__iter__()` returns itself.

</details>

**R273.** What signals the end of an iterator?

<details>
<summary>Answer</summary>

`StopIteration`.

</details>

**R274.** Is a list an iterator?

<details>
<summary>Answer</summary>

No; it is an iterable.

</details>

**R275.** Is a generator an iterator?

<details>
<summary>Answer</summary>

Yes, and also an iterable.

</details>

**R276.** What does `iter(iterator)` return?

<details>
<summary>Answer</summary>

The same iterator.

</details>

**R277.** Can you loop over a list twice?

<details>
<summary>Answer</summary>

Yes; each loop gets a new iterator.

</details>

**R278.** Can you loop over a generator twice?

<details>
<summary>Answer</summary>

No; the second loop gets nothing.

</details>

**R279.** How do you avoid catching `StopIteration`?

<details>
<summary>Answer</summary>

`next(iterator, default)`.

</details>

**R280.** How should a reusable custom iterable work?

<details>
<summary>Answer</summary>

`__iter__()` returns a new iterator, for example a generator.

</details>

#### Generators

**R281.** What makes a function a generator function?

<details>
<summary>Answer</summary>

`yield` in its body.

</details>

**R282.** What does calling a generator function return?

<details>
<summary>Answer</summary>

A generator object (an iterator).

</details>

**R283.** When does a generator body start running?

<details>
<summary>Answer</summary>

On the first `next()`.

</details>

**R284.** What does `yield` do?

<details>
<summary>Answer</summary>

Produces a value and pauses the function.

</details>

**R285.** What happens to a generator on the next `next()`?

<details>
<summary>Answer</summary>

Execution resumes right after the `yield`.

</details>

**R286.** Are a generator's local variables kept between values?

<details>
<summary>Answer</summary>

Yes, between yields.

</details>

**R287.** What happens when a generator body ends?

<details>
<summary>Answer</summary>

`StopIteration` is raised.

</details>

**R288.** Can a generator be restarted?

<details>
<summary>Answer</summary>

No; call the function again.

</details>

**R289.** What is a generator expression?

<details>
<summary>Answer</summary>

`(expr for x in iterable)`.

</details>

**R290.** What does `yield from` do?

<details>
<summary>Answer</summary>

Yields every value from another iterable.

</details>

#### Generators vs lists

**R291.** When to use a generator?

<details>
<summary>Answer</summary>

Large, streaming, or single-pass data; pipelines; early stopping.

</details>

**R292.** When to use a list?

<details>
<summary>Answer</summary>

Indexing, `len()`, sorting, or several passes.

</details>

**R293.** What does a generator store?

<details>
<summary>Answer</summary>

Its current state, not all results.

</details>

**R294.** Does a generator reduce input memory?

<details>
<summary>Answer</summary>

No; an existing input list stays in memory.

</details>

**R295.** Does `any()` with a generator stop early?

<details>
<summary>Answer</summary>

Yes, at the first true value.

</details>

**R296.** Can you index a generator?

<details>
<summary>Answer</summary>

No; `TypeError`.

</details>

**R297.** Can you call `len()` on a generator?

<details>
<summary>Answer</summary>

No; `TypeError`.

</details>

**R298.** What does `list(generator)` do?

<details>
<summary>Answer</summary>

Materializes all remaining values.

</details>

**R299.** Is a generator always faster?

<details>
<summary>Answer</summary>

No; it mainly saves memory and skipped work.

</details>

**R300.** How do you read a huge file lazily?

<details>
<summary>Answer</summary>

Iterate over the file object, not `readlines()`.

</details>

#### `return` vs `yield`

**R301.** What does `return` do?

<details>
<summary>Answer</summary>

Ends the call and sends one result to the caller.

</details>

**R302.** When does the generator body run?

<details>
<summary>Answer</summary>

When values are requested with `next()` or iteration.

</details>

**R303.** Are local variables kept between `yield`s?

<details>
<summary>Answer</summary>

Yes.

</details>

**R304.** What does `return value` do in a generator?

<details>
<summary>Answer</summary>

Ends iteration; `value` goes into `StopIteration.value`.

</details>

**R305.** Does a `for` loop see a generator's return value?

<details>
<summary>Answer</summary>

No.

</details>

**R306.** How do you capture a generator's return value?

<details>
<summary>Answer</summary>

`result = yield from inner()`.

</details>

**R307.** Can a generator be iterated twice?

<details>
<summary>Answer</summary>

No; create a new one or store the values.

</details>

**R308.** What does `yield from [1, 2]` produce?

<details>
<summary>Answer</summary>

`1` and `2` as separate items.

</details>

### Exceptions and Context Managers

#### `try`, `except`, `else`, and `finally`

**R309.** What is the root of the exception hierarchy?

<details>
<summary>Answer</summary>

`BaseException`.

</details>

**R310.** Does `except Exception` catch `KeyboardInterrupt`?

<details>
<summary>Answer</summary>

No.

</details>

**R311.** How do you catch several exception types in one handler?

<details>
<summary>Answer</summary>

Use a tuple: `except (ValueError, KeyError):`.

</details>

**R312.** `raise` vs `assert`?

<details>
<summary>Answer</summary>

`raise` signals real errors; `assert` checks internal assumptions.

</details>

**R313.** What removes `assert` statements?

<details>
<summary>Answer</summary>

Running with `python -O`.

</details>

**R314.** When does `except` run?

<details>
<summary>Answer</summary>

When a matching exception is raised in the `try` block.

</details>

**R315.** When does `else` run?

<details>
<summary>Answer</summary>

When the `try` block completes without an exception, `return`, `break`, or `continue`.

</details>

**R316.** When does `finally` run?

<details>
<summary>Answer</summary>

Whenever control leaves the statement, in almost all cases.

</details>

**R317.** Are exceptions in `else` caught by the `except` above?

<details>
<summary>Answer</summary>

No.

</details>

**R318.** Which handler wins if several match?

<details>
<summary>Answer</summary>

The first one, top to bottom.

</details>

**R319.** Why avoid bare `except:`?

<details>
<summary>Answer</summary>

It also catches `KeyboardInterrupt` and `SystemExit`.

</details>

**R320.** What does `return` in `finally` do?

<details>
<summary>Answer</summary>

Replaces the return value or swallows a pending exception.

</details>

**R321.** Does Python warn about `return` in `finally`?

<details>
<summary>Answer</summary>

Yes, a `SyntaxWarning` from Python 3.14 (PEP 765).

</details>

**R322.** Is `finally` guaranteed if the process is killed?

<details>
<summary>Answer</summary>

No.

</details>

**R323.** Why keep `try` blocks small?

<details>
<summary>Answer</summary>

So each handler clearly protects one operation.

</details>

#### Custom exceptions

**R324.** How do you define a custom exception?

<details>
<summary>Answer</summary>

`class MyError(Exception): pass`.

</details>

**R325.** How do you raise a custom exception?

<details>
<summary>Answer</summary>

`raise MyError("message")`.

</details>

**R326.** What does `raise MyError` without parentheses do?

<details>
<summary>Answer</summary>

Raises an instance created with no arguments.

</details>

**R327.** Why inherit a custom exception from `ValueError`?

<details>
<summary>Answer</summary>

So `except ValueError` also catches it.

</details>

**R328.** Why create a base package exception?

<details>
<summary>Answer</summary>

Callers can catch all of your errors with one handler.

</details>

**R329.** How do you attach structured data to a custom exception?

<details>
<summary>Answer</summary>

Set attributes in `__init__` and call `super().__init__(message)`.

</details>

**R330.** What if a custom exception skips `super().__init__()`?

<details>
<summary>Answer</summary>

`args` and the message may be empty.

</details>

**R331.** Why not inherit from `BaseException`?

<details>
<summary>Answer</summary>

`except Exception` would miss it, like `KeyboardInterrupt`.

</details>

**R332.** When should you not create a custom exception?

<details>
<summary>Answer</summary>

When a built-in already expresses the meaning.

</details>

**R333.** How do you add context without changing the type?

<details>
<summary>Answer</summary>

`error.add_note(...)` in Python 3.11+.

</details>

#### Exception chaining

**R334.** What does `raise New(...) from error` do?

<details>
<summary>Answer</summary>

Raises `New` with `error` stored as `__cause__`.

</details>

**R335.** Why chain exceptions?

<details>
<summary>Answer</summary>

To give a meaningful error while keeping the original for debugging.

</details>

**R336.** What is `__context__`?

<details>
<summary>Answer</summary>

The exception being handled when the new one was raised, set automatically.

</details>

**R337.** What is `__cause__`?

<details>
<summary>Answer</summary>

The explicit cause set with `from`.

</details>

**R338.** How does the traceback differ for explicit and implicit chaining?

<details>
<summary>Answer</summary>

"direct cause" for explicit, "During handling" for implicit.

</details>

**R339.** What does `from None` do?

<details>
<summary>Answer</summary>

Sets `__suppress_context__` so the earlier exception is not displayed.

</details>

**R340.** Does `from None` delete `__context__`?

<details>
<summary>Answer</summary>

No.

</details>

**R341.** What does a bare `raise` do?

<details>
<summary>Answer</summary>

Re-raises the current exception unchanged.

</details>

**R342.** When use `from None`?

<details>
<summary>Answer</summary>

When internal details would only confuse the user.

</details>

**R343.** What can follow `from`?

<details>
<summary>Answer</summary>

An exception instance, an exception class, or `None`.

</details>

#### Context managers

**R344.** Which helper ignores chosen exceptions in a `with` block?

<details>
<summary>Answer</summary>

`contextlib.suppress`.

</details>

**R345.** What does `async with` call?

<details>
<summary>Answer</summary>

`__aenter__()` and `__aexit__()`, awaited.

</details>

**R346.** What is a context manager?

<details>
<summary>Answer</summary>

An object with `__enter__()` and `__exit__()` that wraps a block.

</details>

**R347.** What does `with` call first?

<details>
<summary>Answer</summary>

`__enter__()`.

</details>

**R348.** What is bound after `as`?

<details>
<summary>Answer</summary>

The return value of `__enter__()`.

</details>

**R349.** Is the `as` value always the manager?

<details>
<summary>Answer</summary>

No; for example, a lock returns `True`.

</details>

**R350.** Does `__exit__()` run if the block raises?

<details>
<summary>Answer</summary>

Yes, if entry succeeded.

</details>

**R351.** Does `__exit__()` run if `__enter__()` raises?

<details>
<summary>Answer</summary>

No.

</details>

**R352.** How does a context manager suppress an exception?

<details>
<summary>Answer</summary>

`__exit__()` returns a truthy value.

</details>

**R353.** What does returning `None` from `__exit__()` do?

<details>
<summary>Answer</summary>

Lets the exception propagate.

</details>

**R354.** Does the `as` name exist after the block?

<details>
<summary>Answer</summary>

Yes, but the resource is usually closed or released.

</details>

**R355.** Does every manager close its resource?

<details>
<summary>Answer</summary>

No; `sqlite3` connections manage transactions instead.

</details>

#### Custom context managers

**R356.** Which two methods make a context manager?

<details>
<summary>Answer</summary>

`__enter__()` and `__exit__()`.

</details>

**R357.** What does `__enter__()` return?

<details>
<summary>Answer</summary>

The value bound by `as`.

</details>

**R358.** What if `__enter__()` returns nothing?

<details>
<summary>Answer</summary>

The `as` name is `None`.

</details>

**R359.** What arguments does `__exit__()` receive?

<details>
<summary>Answer</summary>

`exc_type`, `exc_value`, `traceback`.

</details>

**R360.** What are the `__exit__()` arguments on a normal exit?

<details>
<summary>Answer</summary>

All `None`.

</details>

**R361.** How do you let the exception propagate?

<details>
<summary>Answer</summary>

Return `False` or `None`.

</details>

**R362.** Should `__exit__()` re-raise the exception?

<details>
<summary>Answer</summary>

No; return a falsy value instead.

</details>

**R363.** What if cleanup in `__exit__()` raises?

<details>
<summary>Answer</summary>

The new error replaces the old one, which is kept as `__context__`.

</details>

**R364.** What is a lighter alternative to writing `__enter__()` and `__exit__()`?

<details>
<summary>Answer</summary>

`@contextlib.contextmanager` with `try/finally` around `yield`.

</details>

#### `finally` vs context managers

**R365.** Do `finally` and a context manager both run on exceptions?

<details>
<summary>Answer</summary>

Yes, both run cleanup while the exception propagates.

</details>

**R366.** What is the main difference between `finally` and a context manager?

<details>
<summary>Answer</summary>

`finally` is inline code; a context manager is a reusable abstraction.

</details>

**R367.** Where does context-manager cleanup live?

<details>
<summary>Answer</summary>

In `__exit__()` or after the `yield` in `@contextmanager`.

</details>

**R368.** Why put acquisition before `try`?

<details>
<summary>Answer</summary>

So cleanup only runs for a resource that was acquired.

</details>

**R369.** How many times must a `@contextmanager` generator yield?

<details>
<summary>Answer</summary>

Exactly once.

</details>

**R370.** How do you manage a runtime list of resources?

<details>
<summary>Answer</summary>

`contextlib.ExitStack`.

</details>

**R371.** Can `finally` suppress an exception?

<details>
<summary>Answer</summary>

Only through control flow like `return`, which is bad practice.

</details>

**R372.** Can a context manager suppress an exception?

<details>
<summary>Answer</summary>

Yes, by returning a truthy value from `__exit__()`.

</details>

**R373.** Is cleanup guaranteed if the process is killed?

<details>
<summary>Answer</summary>

No.

</details>

### Memory Management and GIL

#### Memory management

**R374.** Who frees Python objects?

<details>
<summary>Answer</summary>

The runtime, automatically.

</details>

**R375.** What is CPython's main memory mechanism?

<details>
<summary>Answer</summary>

Reference counting.

</details>

**R376.** What does the cyclic collector handle?

<details>
<summary>Answer</summary>

Unreachable groups of objects that refer to each other.

</details>

**R377.** Why can't reference counting free a cycle?

<details>
<summary>Answer</summary>

The objects keep each other's counts above zero.

</details>

**R378.** Does `del x` destroy the object?

<details>
<summary>Answer</summary>

No; it removes one reference.

</details>

**R379.** When is an object reclaimed in CPython?

<details>
<summary>Answer</summary>

Usually when its last reference disappears.

</details>

**R380.** Does freed memory go back to the OS immediately?

<details>
<summary>Answer</summary>

Not necessarily; Python may keep it for reuse.

</details>

**R381.** How can you force a garbage collection?

<details>
<summary>Answer</summary>

`gc.collect()`.

</details>

**R382.** How do you avoid a parent-child cycle?

<details>
<summary>Answer</summary>

Use a weak reference for the back link.

</details>

**R383.** How should files be closed?

<details>
<summary>Answer</summary>

With a context manager, not by relying on GC.

</details>

**R384.** Which tool tracks memory allocations?

<details>
<summary>Answer</summary>

`tracemalloc`.

</details>

**R385.** How do you see an object's reference count?

<details>
<summary>Answer</summary>

`sys.getrefcount(obj)`, which includes the call's own reference.

</details>

**R386.** What does `sys.getsizeof()` measure?

<details>
<summary>Answer</summary>

One object's shallow size.

</details>

**R387.** Why is `__del__` a poor cleanup tool?

<details>
<summary>Answer</summary>

Its timing is not guaranteed, and it may not run at exit.

</details>

#### Shallow and deep copy

**R388.** Does `b = a` copy a list?

<details>
<summary>Answer</summary>

No; both names refer to the same list.

</details>

**R389.** What does a shallow copy share?

<details>
<summary>Answer</summary>

The nested objects.

</details>

**R390.** What does a deep copy share?

<details>
<summary>Answer</summary>

No mutable objects with the original.

</details>

**R391.** Is `lst[:]` shallow or deep?

<details>
<summary>Answer</summary>

Shallow.

</details>

**R392.** Is `dict.copy()` shallow or deep?

<details>
<summary>Answer</summary>

Shallow.

</details>

**R393.** When is a shallow copy enough?

<details>
<summary>Answer</summary>

When nested values are immutable or will not be mutated.

</details>

**R394.** How does `deepcopy()` handle cycles?

<details>
<summary>Answer</summary>

It uses a memo dictionary of already copied objects.

</details>

**R395.** Why not always use `deepcopy()`?

<details>
<summary>Answer</summary>

It costs time and memory and fails for some objects.

</details>

**R396.** How do you customize copying?

<details>
<summary>Answer</summary>

Define `__copy__` or `__deepcopy__`.

</details>

**R397.** What is wrong with `[[0] * 3] * 3`?

<details>
<summary>Answer</summary>

All rows are the same list.

</details>

#### GIL

**R398.** What does GIL stand for?

<details>
<summary>Answer</summary>

Global Interpreter Lock.

</details>

**R399.** What does the GIL allow?

<details>
<summary>Answer</summary>

Only one thread at a time to run Python bytecode in an interpreter.

</details>

**R400.** Why does CPython have a GIL?

<details>
<summary>Answer</summary>

To protect reference counting and internals simply and cheaply.

</details>

**R401.** Do threads speed up pure-Python CPU work?

<details>
<summary>Answer</summary>

Usually not, in GIL-enabled CPython.

</details>

**R402.** Do threads help with I/O-bound work?

<details>
<summary>Answer</summary>

Yes; waits release the GIL.

</details>

**R403.** Can NumPy benefit from threads?

<details>
<summary>Answer</summary>

Often, when its operations release the GIL.

</details>

**R404.** How do you parallelize CPU-bound Python?

<details>
<summary>Answer</summary>

Processes, vectorized or compiled code, or free-threaded CPython.

</details>

**R405.** Is `counter += 1` thread-safe?

<details>
<summary>Answer</summary>

No; protect it with a lock.

</details>

**R406.** Is free-threaded CPython the default?

<details>
<summary>Answer</summary>

No; it is an optional separate build.

</details>

**R407.** Does every Python runtime have a GIL?

<details>
<summary>Answer</summary>

No.

</details>

### Concurrency (Threading, Multiprocessing, Asyncio)

#### Choosing the right tool

**R408.** What is CPU-bound work?

<details>
<summary>Answer</summary>

Work that is slow because of computation.

</details>

**R409.** What is I/O-bound work?

<details>
<summary>Answer</summary>

Work that is slow because it waits for networks, disks, or databases.

</details>

**R410.** Best fit for blocking I/O with `requests`?

<details>
<summary>Answer</summary>

Threading.

</details>

**R411.** Best fit for pure-Python CPU work?

<details>
<summary>Answer</summary>

Multiprocessing, or vectorize it.

</details>

**R412.** Best fit for thousands of network calls?

<details>
<summary>Answer</summary>

Asyncio with async libraries.

</details>

**R413.** Do threads share memory?

<details>
<summary>Answer</summary>

Yes.

</details>

**R414.** Do processes share memory?

<details>
<summary>Answer</summary>

No, not by default.

</details>

**R415.** Why must process-pool functions be module-level?

<details>
<summary>Answer</summary>

They must be picklable and importable.

</details>

**R416.** Why might a process pool be slower?

<details>
<summary>Answer</summary>

Startup and serialization costs outweigh small tasks.

</details>

**R417.** What stalls an event loop?

<details>
<summary>Answer</summary>

Any blocking call or heavy computation on the loop thread.

</details>

**R418.** How do you limit concurrent async requests?

<details>
<summary>Answer</summary>

`asyncio.Semaphore`.

</details>

**R419.** How do you run a blocking call from async code?

<details>
<summary>Answer</summary>

`asyncio.to_thread()`.

</details>

#### Concurrency vs parallelism

**R420.** What is concurrency?

<details>
<summary>Answer</summary>

Several tasks making progress in overlapping time periods.

</details>

**R421.** What is parallelism?

<details>
<summary>Answer</summary>

Several tasks executing at the same instant.

</details>

**R422.** Does concurrency need multiple cores?

<details>
<summary>Answer</summary>

No.

</details>

**R423.** Does CPU parallelism need multiple cores?

<details>
<summary>Answer</summary>

Yes.

</details>

**R424.** Is asyncio parallel?

<details>
<summary>Answer</summary>

No; it is concurrent on one thread.

</details>

**R425.** Are CPython threads parallel for Python code?

<details>
<summary>Answer</summary>

Not in GIL-enabled CPython.

</details>

**R426.** Which Python tool gives CPU parallelism for Python code?

<details>
<summary>Answer</summary>

Processes, or free-threaded CPython.

</details>

**R427.** Can concurrency make CPU-bound code faster?

<details>
<summary>Answer</summary>

Not by itself.

</details>

**R428.** Why might parallel code be slower?

<details>
<summary>Answer</summary>

Startup, data transfer, and coordination overhead.

</details>

**R429.** Can a program be both concurrent and parallel?

<details>
<summary>Answer</summary>

Yes.

</details>

#### Threading

**R430.** How do you start a thread?

<details>
<summary>Answer</summary>

Create `Thread(target=...)`, then call `start()`.

</details>

**R431.** What does `join()` do?

<details>
<summary>Answer</summary>

It waits for the thread to finish.

</details>

**R432.** What happens if you call `run()` instead of `start()`?

<details>
<summary>Answer</summary>

It runs in the current thread.

</details>

**R433.** What is a daemon thread?

<details>
<summary>Answer</summary>

One that doesn't keep the program alive.

</details>

**R434.** What is a race condition?

<details>
<summary>Answer</summary>

A bug where the result depends on thread timing.

</details>

**R435.** What is a deadlock?

<details>
<summary>Answer</summary>

Threads each hold a lock another needs, so all wait forever.

</details>

**R436.** How do you avoid deadlock?

<details>
<summary>Answer</summary>

Use a consistent lock order, short holds, and timeouts.

</details>

**R437.** `Lock` vs `RLock`?

<details>
<summary>Answer</summary>

The same thread can re-acquire an `RLock`.

</details>

**R438.** Which queue is thread-safe?

<details>
<summary>Answer</summary>

`queue.Queue`.

</details>

**R439.** What does `executor.submit()` return?

<details>
<summary>Answer</summary>

A `Future`.

</details>

**R440.** `executor.map()` vs `as_completed()`?

<details>
<summary>Answer</summary>

Input order vs completion order.

</details>

#### Asyncio

**R441.** What does `async def` define?

<details>
<summary>Answer</summary>

A coroutine function.

</details>

**R442.** What does calling an `async def` function return?

<details>
<summary>Answer</summary>

A coroutine object that hasn't run yet.

</details>

**R443.** What can you `await`?

<details>
<summary>Answer</summary>

Coroutines, tasks, futures, and objects with `__await__`.

</details>

**R444.** What does `asyncio.run()` do?

<details>
<summary>Answer</summary>

Creates a loop, runs the top-level coroutine, closes the loop.

</details>

**R445.** How do you run two coroutines concurrently?

<details>
<summary>Answer</summary>

`asyncio.gather()`, `create_task()`, or `TaskGroup`.

</details>

**R446.** Does every `await` give up control?

<details>
<summary>Answer</summary>

No; only one that actually has to wait.

</details>

**R447.** How do you yield control explicitly?

<details>
<summary>Answer</summary>

`await asyncio.sleep(0)`.

</details>

**R448.** What happens if you call `time.sleep()` in a coroutine?

<details>
<summary>Answer</summary>

The whole event loop is blocked.

</details>

**R449.** Why can't you call `asyncio.run()` in a notebook?

<details>
<summary>Answer</summary>

A loop is already running; use `await main()`.

</details>

**R450.** In which order does `gather()` return results?

<details>
<summary>Answer</summary>

Argument order.

</details>

**R451.** Which version added `asyncio.TaskGroup`?

<details>
<summary>Answer</summary>

Python 3.11.

</details>

**R452.** How do you add a timeout to an awaitable?

<details>
<summary>Answer</summary>

`asyncio.wait_for()` or `asyncio.timeout()`.

</details>

#### ML performance

**R453.** What is the first step to speed up CPU-bound preprocessing?

<details>
<summary>Answer</summary>

Confirm it is CPU-bound and profile on representative data.

</details>

**R454.** Why not add processes immediately when speeding up preprocessing?

<details>
<summary>Answer</summary>

They multiply a bad algorithm's cost and add overhead.

</details>

**R455.** What is usually the biggest win when speeding up preprocessing?

<details>
<summary>Answer</summary>

A better algorithm or vectorization.

</details>

**R456.** When do processes help most?

<details>
<summary>Answer</summary>

Independent, substantial, pure-Python CPU work.

</details>

**R457.** What must process-pool tasks be?

<details>
<summary>Answer</summary>

Picklable inputs, results, and module-level functions.

</details>

**R458.** What does `chunksize` trade off?

<details>
<summary>Answer</summary>

Lower scheduling overhead vs worse load balancing.

</details>

**R459.** How do you avoid resending big data?

<details>
<summary>Answer</summary>

Initializer, memory mapping, shared memory, or per-worker loading.

</details>

**R460.** What is oversubscription?

<details>
<summary>Answer</summary>

More active threads than cores, e.g. processes times BLAS threads.

</details>

**R461.** How do you compare float outputs?

<details>
<summary>Answer</summary>

With a tolerance, such as `math.isclose()`.

</details>

**R462.** How do you avoid leakage when scaling?

<details>
<summary>Answer</summary>

Fit statistics on training data only.

</details>

---

## Part D: Practice Programs and Problems

Q numbers refer to Part A. Theory-only questions Q1, Q3, Q4, Q5 are not included.

### Rewrite one small program from memory (every 3 days, 20–30 min)

#### Basics and Data Types

| # | Program | What to write | Qs |
|---|---|---|---|
| 1 | Three styles | Double a list with a `for` loop, with `map` and `lambda`, with a comprehension, and with a `Doubler` class | 2 |
| 2 | Loop vs NumPy | Double 1 million numbers both ways and time them; show `[1, 2] * 2` vs `arr * 2` | 6 |
| 3 | Dynamic typing | Rebind `x` from int to str and print its type; catch `"1" + 1`; call `double(x: int)` with `"ab"` | 7–10, 12 |
| 4 | Mutation tracker | Print `id()` before and after `append`, `b[:] =`, `+=`, `b = [9]`, `b = b + [3]`, `b = b[::-1]`, `a.copy()`; then `b[0].append(9)`, then `deepcopy` | 13–16 |
| 5 | Hashable checker | Try `(1, (2, 3))`, `(1, [2])`, `[1, 2]` as dict keys and set items, with `try/except`; change a list inside a tuple | 17, 18, 22, 70 |
| 6 | Collection comparison | Show order, duplicates, and indexing for list, tuple, set, dict; time `in` on a list vs a set | 19–21 |
| 7 | Equality vs identity | `==` vs `is` on two equal lists, a shared name, `1` and `1.0`, 256 and 257; compare strings and lists with `<`; catch the dict `<` error | 23, 24, 26 |
| 8 | Missing value checker | `classify(value)` returns `"None"`, `"empty"`, or `"has value"` for `None`, `""`, `[]`, `()`, `{}`, `set()`, `range(0)`, `0`; also print `type(None)`, `type(False)`, and use `not in` | 25, 31, 32 |
| 9 | Scope demo | LEGB example, a `global` counter, `nonlocal` in a nested function, and a caught `UnboundLocalError` | 27–30 |

#### Data Structures and Comprehensions

| # | Program | What to write | Qs |
|---|---|---|---|
| 10 | List builder | Use `append` and `extend` with a character, a word, `split()`, `range()`, a dict, and a nested list; print what they return | 33–38 |
| 11 | Remove duplicates | `dict.fromkeys` vs `set`, `sorted(set(words))`, pandas `drop_duplicates()` and `unique()` | 39–43, 79 |
| 12 | Slicing sheet | First 3, last 3, all but first, all but last, all but both, every second, 3rd onwards, reverse; catch the step `0` error | 44–48, 51 |
| 13 | `sorted` vs `.sort` | Show the return values, sort a string, set, and tuple, and use `reverse=True` | 49, 53, 57 |
| 14 | Sort strings | All 16 rules, from length through vowels, digits, `"py"` first, and custom priority to multiple criteria | 54, 58 |
| 15 | Sort a dictionary | All 19 rules, including by value, plus insertion order vs sorted order | 52, 55, 59, 68 |
| 16 | Model ranking | Sort model dicts by accuracy, highest first, and return only the names | 50, 56 |
| 17 | Speed test | Time `insert(0, x)` vs `append(x)` on a list, and dict lookup vs list search | 69 |
| 18 | Create a dictionary | Every input type: pairs, `zip`, `fromkeys`, `enumerate`, `key=value` text, JSON, `Counter`, `{**a, **b}` | 71, 82 |
| 19 | Dict comprehensions | Empty lists, squares, word lengths, users by ID, scores of 60+, models at 90%+, labels to IDs | 72–76, 80, 81 |
| 20 | Create a list | Every source: tuple, string, dict, set, range, JSON, plus comprehensions that convert, extract, and filter | 77, 78 |
| 21 | `enumerate` and `zip` | `enumerate(start=1)`, `strict=True`, `zip(*pairs)` on pairs, a dict, and dict rows; `map(list, zip(*pairs))`; tuple to list | 83–89 |
| 22 | Merge and safe access | `\|`, `**`, `update()`, `\|=`; shared keys; `dict \| list` error; `KeyError`, `get()`, `in`, `try/except` | 94–98 |

#### OOP

| # | Program | What to write | Qs |
|---|---|---|---|
| 23 | Model class | Write `__init__` with a per-instance dict; print when `__new__` and `__init__` run; show a class attribute vs an instance attribute and an inherited `__init__` | 100–105 |
| 24 | Config methods | An instance method, `from_dict()` as a class method, `is_valid_rate()` as a static method, and a subclass that gets its own type from `from_dict()` | 106, 107 |
| 25 | Encapsulated account | `_name`, `__balance`, name mangling, and a `@property` with a validating setter | 108, 109 |
| 26 | Model hierarchy | Abstract `BaseModel` with `predict()`, two subclasses, `super()` in an override, a polymorphic loop, and `isinstance()` vs `type() is` | 99, 110–113 |
| 27 | Pipeline by composition | A `Pipeline` that has a scaler, then swap the scaler without changing `Pipeline` | 114 |
| 28 | Diamond and mixins | `A`, `B`, `C`, `D` printing the call order; print `__mro__`; mixin in the right and wrong order; cooperative `__init__`; catch a failed MRO | 115–117 |
| 29 | Dataset with dunders | `__str__`, `__repr__`, `__len__`, `__call__`, `__iter__`, `__getitem__`, `__eq__`, `__hash__`, and `__add__` returning `NotImplemented` | 118–121 |
| 30 | Dataclass config | `default_factory`, `__post_init__` validation, `order=True`, `frozen=True` with a list field, `slots=True`, `kw_only=True` | 122–125 |

#### Functions, Decorators and Generators

| # | Program | What to write | Qs |
|---|---|---|---|
| 31 | Flexible function | Use `/`, a default, `*args`, keyword-only, and `**kwargs`; call it with `*` and `**` unpacking; show mutation vs rebinding of an argument | 90–92, 127 |
| 32 | Functional tools | `map`, `filter`, `reduce`, a lambda sort key, and a lambda rewritten as `def` | 126, 129, 130 |
| 33 | Mutable default bug | Show the shared list bug, then fix it with `None` | 128 |
| 34 | Closures | `make_multiplier`, a counter with `nonlocal`, print `__closure__`, late binding with its fix, and the same counter as a class | 131–134 |
| 35 | Basic decorators | `log_call` with and without `@wraps`, printing `__name__`; stack two decorators and show the order | 135, 136, 138 |
| 36 | Decorator with arguments | `retry(attempts)` with three levels of nesting, and `lru_cache` on Fibonacci | 137, 139 |
| 37 | Class decorators | `register_model`, a `CountCalls` class decorator, and the same registry with `__init_subclass__` | 140–142 |
| 38 | Iterators | Rewrite a `for` loop with `iter()` and `next()`; a reusable `Dataset`; a single-use `Countdown` | 143–145 |
| 39 | Generators | Print where a generator pauses; a generator expression; `yield from`; `send()` and `close()` | 146–148 |
| 40 | Batches | A `batches()` generator with `islice`, and show the common mistakes: second pass, `len()`, `list()` | 149, 150 |
| 41 | `return` vs `yield` | Capture a generator return value; `yield` vs `yield from`; the single-`yield` trap; a late `FileNotFoundError` | 151, 152 |

#### Exceptions and Context Managers

| # | Program | What to write | Qs |
|---|---|---|---|
| 42 | Safe divide | All four clauses, a tuple of exceptions, handler order, `return` in `finally`, the deleted `as` name, and `raise` vs `assert` | 153–158 |
| 43 | Custom exceptions | A base `PipelineError`, an exception with attributes, and `add_note()` | 159–161 |
| 44 | Chaining | `from error`, an implicit chain, `from None`, and bare `raise`; print `__cause__` and `__context__` | 162, 163 |
| 45 | Context manager class | Print the `__exit__` arguments; suppress an exception; show a failing `__enter__()` | 164, 165, 167 |
| 46 | `@contextmanager` | `eval_mode` with `try/finally`, and a `sqlite3` transaction rollback | 166, 168 |
| 47 | Lock cleanup | The same lock with `try/finally`, `with`, and a `@contextmanager` helper | 169, 170 |

#### Memory Management and GIL

| # | Program | What to write | Qs |
|---|---|---|---|
| 48 | Reference tracker | `sys.getrefcount`, `del`, a cycle with `gc.collect()`, and a `weakref` back link | 171–174 |
| 49 | Memory profile | Use `tracemalloc` to compare a list and a generator, and `sys.getsizeof()` for one object | 149, 175, 176 |
| 50 | Copy lab | Assignment, shallow, and deep copy on nested lists; the `[[0] * 3] * 3` and `dict.fromkeys()` traps | 177–179 |
| 51 | GIL demo | Time CPU work with threads vs processes, and sleeping I/O with threads | 180, 181, 183 |
| 52 | Lock demo | Increment a shared counter with threads, with and without a `Lock` | 182, 190 |

#### Concurrency (Threading, Multiprocessing, Asyncio)

| # | Program | What to write | Qs |
|---|---|---|---|
| 53 | Three ways to wait | Simulate 5 I/O waits sequentially, with threads, and with asyncio, and print the times | 184–188 |
| 54 | Thread basics | `start()`, `join()`, `start()` vs `run()`, and a daemon thread | 189 |
| 55 | Deadlock and fix | Show two locks taken in opposite order, then fix it with one order and a timeout | 191 |
| 56 | Producer-consumer | A `Queue` with a worker thread and a sentinel value | 192 |
| 57 | Executor | `map()`, `submit()`, `as_completed()`, and `future.exception()` | 193 |
| 58 | Process pool | The `__main__` guard, a module-level function, a lambda that fails to pickle, and `shared_memory` | 194, 195 |
| 59 | Async basics | Sequential awaits vs `gather()`, `create_task()`, and `TaskGroup`, with timing | 196, 197 |
| 60 | Async safety | `time.sleep()` vs `asyncio.sleep()`, `to_thread()`, `Semaphore`, `wait_for()`, and `run_in_executor()` | 198–201 |
| 61 | Preprocessing speedup | Time a loop, NumPy, and a process pool on the same task, changing `chunksize` | 202, 203 |

### Solve 1–2 Python problems without searching syntax (weekly, 30–45 min)

#### Basics and Data Types

| # | Problem | Qs |
|---|---|---|
| 1 | Count how many marks are 50 or more using `sum()` on booleans, with no `if` counter | bool as int |
| 2 | Scale a list of numbers to the 0–1 range, first with a loop, then with NumPy and no loop | 6 |
| 3 | Write `safe_add(a, b)` with type hints that rejects non-numbers with a clear error | 10, 12 |
| 4 | Copy a nested config, change the copy, and prove the original didn't change | 13–16 |
| 5 | Track visited `(x, y)` grid positions in a dict and count the repeat visits | 18, 22 |
| 6 | Find items common to two lists of 100,000 values, and explain why a set is faster | 21 |
| 7 | Report the empty fields in a record, keeping `0` and `False` as valid values | 25, 32 |
| 8 | Build a click counter with a nested function, then fix a version that raises `UnboundLocalError` | 29, 30 |

#### Data Structures and Comprehensions

| # | Problem | Qs |
|---|---|---|
| 9 | Turn a list of sentences into one flat list of words | 33–35 |
| 10 | Get unique tags, ignoring case and keeping first-seen order | 39, 40 |
| 11 | Rotate a list by `k` places, and check for a palindrome, using only slicing | 45–47 |
| 12 | Count word frequency without `Counter`, then show the top 3, with ties in A–Z order | 52, 71 |
| 13 | Group students by grade into a dict of lists | 72, 75 |
| 14 | Swap the keys and values of a dict, and decide what happens with duplicate values | 73, 81 |
| 15 | Parse `"name=Ana,age=25"` into a dict with `age` as an int | 71, 78 |
| 16 | Filter models above a threshold, then return the top 2 names | 56, 80 |
| 17 | Split dict rows into a names list and a scores list, then find the average and the topper | 87, 89 |
| 18 | Two-sum: find two numbers that add to a target, in O(n) using a dict | 21, 69 |
| 19 | Merge default and user settings, raising an error if a chosen key appears in both | 95 |
| 20 | Read `config["db"]["port"]` safely when either key may be missing | 97, 98 |
| 21 | Write your own sample data for the 8 scenarios: students, products, tickets, employees, trips, search results, orders, tasks | 60–67 |

#### OOP

| # | Problem | Qs |
|---|---|---|
| 22 | Build a `Temperature` class with a `celsius` property that rejects values below −273.15, and a read-only `fahrenheit` | 109 |
| 23 | Count how many objects a class creates, then fix a class whose instances share a list by mistake | 105 |
| 24 | Create an abstract `Shape` with `area()`, add `Circle` and `Square`, and total the area of a mixed list | 110, 111 |
| 25 | Build a `Money` class with `+`, `==`, `<`, and a clear `__repr__`, usable in a set | 119–121 |
| 26 | Build an `Inventory` class that supports `len()`, `in`, `[]`, and `for` loops | 118 |
| 27 | Write a `LoggingMixin` that wraps `save()`, and explain the MRO | 116 |
| 28 | Create `Employee` and `Manager`, where `Manager.pay()` adds a bonus through `super()` | 112 |
| 29 | Load a dataclass from a dict with a `from_dict()` class method, and reject bad values | 107, 123 |

#### Functions, Decorators and Generators

| # | Problem | Qs |
|---|---|---|
| 30 | Write `make_scaler(mean, std)`, which returns a ready-to-use scaling function | 131 |
| 31 | Fix a list of callbacks that all print the last loop value | 133 |
| 32 | Write `@timer`, which prints the run time and keeps the function name | 135, 136 |
| 33 | Write `@limit_calls(n)`, which raises an error after `n` calls | 132, 137 |
| 34 | Write `@memoize` with your own dict, without `lru_cache` | 131, 139 |
| 35 | Build a plugin registry with a decorator, then with `__init_subclass__` | 140, 142 |
| 36 | Write a generator that reads a large file and yields only lines containing a word | 149 |
| 37 | Chain generators into a pipeline: read, parse, filter, batch | 148, 149 |
| 38 | Flatten a nested list of any depth with a recursive generator and `yield from` | 148 |
| 39 | Write an infinite Fibonacci generator and take the first 10 values with `islice` | 146 |
| 40 | Write a reusable `Chunked` iterable that can be looped over twice | 145 |
| 41 | Write `train(data, **settings)`, which forwards settings to `fit()`, and run 3 experiments | 91–93 |

#### Exceptions and Context Managers

| # | Problem | Qs |
|---|---|---|
| 42 | Parse a list of text rows into ints, and collect the bad rows with their errors | 154, 155 |
| 43 | Retry a flaky function, then raise an application error chained to the last failure | 162, 163 |
| 44 | Design exceptions for bank withdrawals: a base error, `InsufficientFunds` with the amounts | 159, 160 |
| 45 | Write a `Timer` context manager that reports the time even when the block fails | 167 |
| 46 | Write a `transaction(data)` context manager that restores a dict if the block fails | 165, 168 |
| 47 | Write a `change_dir(path)` context manager that always restores the working directory | 168, 170 |

#### Memory Management and GIL

| # | Problem | Qs |
|---|---|---|
| 48 | Find why memory grows in a function with an unbounded cache, using `tracemalloc`, then bound it | 176 |
| 49 | Build a parent-child tree where the parent link is a `weakref` | 172 |
| 50 | Create a 3×3 board, clone it, and prove the two are independent | 177, 179 |
| 51 | Write your own `deep_copy()` for nested lists and dicts | 177, 178 |

#### Concurrency (Threading, Multiprocessing, Asyncio)

| # | Problem | Qs |
|---|---|---|
| 52 | Classify 8 real tasks as CPU-bound or I/O-bound, and pick a tool for each with a reason | 184, 185 |
| 53 | Download 20 simulated URLs with a thread pool, and compare the time with a loop | 185, 193 |
| 54 | Build a thread-safe `Counter` class and test it with 4 threads | 190 |
| 55 | Reproduce a deadlock with two locks, then fix it | 191 |
| 56 | Build a worker pool: N threads, a task `Queue`, and a results list | 192 |
| 57 | Count primes below N sequentially and with a process pool, and explain the speedup | 181, 194 |
| 58 | Fetch 100 simulated URLs with asyncio, at most 5 at a time, with timeouts and a failure list | 197, 199 |
| 59 | Fix an async service that calls a blocking function and runs heavy CPU work | 198, 201 |
| 60 | Profile a text-cleaning job, then speed it up, and report the time and memory before and after | 202, 203 |

---

## Part E: Simple Answers with Real-Life Examples

### OOP

**E1.** Can `__init__()` return a value such as an integer, or must it return `None`?

<details>
<summary>Answer</summary>

It must return `None`. Its only job is to set up the new object. If you return a number, Python raises a `TypeError`.

```python
class Bad:
    def __init__(self):
        return 10

try:
    Bad()
except TypeError as error:
    print(error)  # __init__() should return None, not 'int'
```

**Real-life example:** When you set up a new phone, you add your language and accounts. The setup doesn't give you a second phone. You just get the same phone, ready to use.

</details>

**E2.** Is `self` a reserved keyword in Python or a naming convention?

<details>
<summary>Answer</summary>

It's a naming convention, not a keyword. Python passes the object as the first argument, whatever you call it. The code below works, but always use `self` so others can read your code.

```python
class Car:
    def show(this):
        return "works"

print(Car().show())  # works
```

**Real-life example:** Everyone at school says "Good morning" to the teacher. No law forces those words, but everyone uses them, so everyone understands.

</details>

**E3.** What is an instance of a class, and which instance does `self` refer to inside a method?

<details>
<summary>Answer</summary>

An **instance** is one real object made from a class. Inside a method, `self` is the object you called the method on: the one before the dot.

```python
class Car:
    def __init__(self, color):
        self.color = color

    def show(self):
        return self.color

red = Car("red")
blue = Car("blue")

print(red.show())   # red: here self is the red object
print(blue.show())  # blue: here self is the blue object
```

**Real-life example:** A car design is the class, and each car on the road is an instance. When you press your key, only your car unlocks. That's `self`: the exact car being used.

</details>

**E4.** What do you mean by `self` and instance?

<details>
<summary>Answer</summary>

They point to the same object. The difference is who is talking:

| Word | Where you use it | Meaning |
|---|---|---|
| Instance | Outside the class, such as `first` | The real object |
| `self` | Inside the class | "This object" |

```python
class Student:
    def __init__(self, name):
        self.name = name

    def same_as(self, other):
        return self is other

first = Student("Asha")
print(first.same_as(first))  # True: self and first are the same object
```

**Real-life example:** Your friends call you by your name. You call yourself "I". It's the same person. The name is like the instance, and "I" is like `self`.

</details>

**E5.** Is a mutable class attribute shared?

<details>
<summary>Answer</summary>

Yes. A list or dict written in the class body belongs to the class, so all objects share one copy. If one object changes it, all of them see the change. To give each object its own copy, create it in `__init__`.

```python
class Team:
    members = []              # shared by all

    def __init__(self):
        self.tasks = []       # separate for each object

a = Team()
b = Team()
a.members.append("Asha")
a.tasks.append("report")

print(b.members)  # ['Asha']: shared
print(b.tasks)    # []: not shared
```

**Real-life example:** The office whiteboard is shared: anything one person writes, everyone sees. Your personal notebook is yours alone.

</details>

**E6.** Can a child class use its parent class's `__init__()` if it doesn't define its own?

<details>
<summary>Answer</summary>

Yes. If the child has no `__init__`, Python uses the parent's automatically. If the child writes its own, the parent's no longer runs by itself, so call `super().__init__()`.

```python
class Parent:
    def __init__(self, name):
        self.name = name

class Child(Parent):
    pass

print(Child("Asha").name)  # Asha
```

**Real-life example:** A new branch of a shop with no rules of its own follows head office's opening rules. If it writes its own rules, it must add head office's rules itself if it still wants them.

</details>

**E7.** How can you read and modify the state of an object created from a Python class? Show six different examples in a table with Task, Method Call, and Result columns.

<details>
<summary>Answer</summary>

An object's **state** is the data it holds. You read and change it through its methods.

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
        self.history = []

    def get_balance(self):
        return self.balance

    def deposit(self, amount):
        self.balance += amount
        self.history.append(amount)

    def withdraw(self, amount):
        self.balance -= amount
        self.history.append(-amount)

    def change_owner(self, name):
        self.owner = name

    def get_owner(self):
        return self.owner

    def get_history(self):
        return self.history

account = BankAccount("Asha", 1000)
print(account.get_balance())   # 1000
account.deposit(500)
print(account.balance)         # 1500
account.withdraw(200)
print(account.balance)         # 1300
account.change_owner("Ben")
print(account.get_owner())     # Ben
print(account.get_history())   # [500, -200]
```

| Task | Method Call | Result |
|---|---|---|
| Read the balance | `account.get_balance()` | `1000` |
| Add money | `account.deposit(500)` | `balance` is now `1500` |
| Remove money | `account.withdraw(200)` | `balance` is now `1300` |
| Change the owner | `account.change_owner("Ben")` | `owner` is now `"Ben"` |
| Read the owner | `account.get_owner()` | `"Ben"` |
| Read the history | `account.get_history()` | `[500, -200]` |

**Real-life example:** With your bank account, you check the balance, deposit, and withdraw through the ATM. You don't change the bank's records by hand. Methods are the ATM buttons.

</details>

**E8.** How do you declare a subclass in Python? Show the syntax and where to put the parent class name.

<details>
<summary>Answer</summary>

Put the parent class name in brackets after the child class name.

```python
class Animal:
    def eat(self):
        return "eating"

class Dog(Animal):      # Animal is the parent
    def bark(self):
        return "woof"

dog = Dog()
print(dog.eat())   # eating: from the parent
print(dog.bark())  # woof: its own
```

**Real-life example:** A dog is an animal, so it can eat like all animals, and it can also bark. Writing `Dog(Animal)` tells Python this family link.

</details>

**E9.** What are the different ways to call a Python instance method after an object is created?

<details>
<summary>Answer</summary>

```python
class Greeter:
    def hello(self):
        return "hello"

    def twice(self):
        return self.hello() * 2

class Loud(Greeter):
    def hello(self):
        return super().hello().upper()

g = Greeter()
print(g.hello())               # hello
print(Greeter.hello(g))        # hello
say = g.hello
print(say())                   # hello
print(getattr(g, "hello")())   # hello
print(g.twice())               # hellohello
print(Loud().hello())          # HELLO
```

| Way | Example | When to use it |
|---|---|---|
| Through the object | `g.hello()` | Normal way: use this |
| Through the class | `Greeter.hello(g)` | Rare: you pass the object yourself |
| Save it in a variable | `say = g.hello` then `say()` | Passing it as a callback |
| By name | `getattr(g, "hello")()` | The name is known only at runtime |
| Inside the class | `self.hello()` | One method calling another |
| From a child class | `super().hello()` | Using the parent's version |

**Real-life example:** To reach a friend, you can call directly, save the number and tap it later, search by name, or ask someone to call them. It's the same friend through different routes.

</details>

**E10.** What is the difference between instance, class, and static methods?

<details>
<summary>Answer</summary>

| Type | Gets first | Use it for |
|---|---|---|
| Instance method | `self`: the object | Working with one object's data |
| Class method | `cls`: the class | Data shared by the class, or making objects |
| Static method | Nothing | A helper that needs neither |

```python
class Pizza:
    size_unit = "inch"

    def __init__(self, size):
        self.size = size

    def describe(self):
        return f"{self.size} {self.size_unit}"

    @classmethod
    def large(cls):
        return cls(12)

    @staticmethod
    def is_valid(size):
        return size > 0

print(Pizza(8).describe())    # 8 inch
print(Pizza.large().size)     # 12
print(Pizza.is_valid(-1))     # False
```

**Real-life example:** In a pizza shop, "How big is this pizza?" is about one pizza (instance). "Make the standard large pizza" is a shop-level rule (class). "Is this size a positive number?" is a general check that needs no pizza or shop (static).

</details>

**E11.** Can a class method read and update attributes stored on the class?

<details>
<summary>Answer</summary>

Yes. It receives the class as `cls`, so it can read and change class attributes. All objects see the change.

```python
class Student:
    school = "City School"

    @classmethod
    def rename_school(cls, name):
        cls.school = name

first = Student()
second = Student()
Student.rename_school("Green School")

print(first.school)   # Green School
print(second.school)  # Green School
```

**Real-life example:** When a school changes its name, the principal updates it once. Every student's school name changes together, with no need to visit each student.

</details>

**E12.** Why use a class method if we have instance methods?

<details>
<summary>Answer</summary>

An instance method needs an object first. A class method doesn't, which helps in three cases:

- Creating an object in another way, such as from a dict.
- Reading or changing data shared by the class.
- Giving a child class objects of its own type, because `cls` is whichever class called it.

```python
class User:
    def __init__(self, name):
        self.name = name

    @classmethod
    def from_dict(cls, data):
        return cls(data["name"])

class Admin(User):
    pass

print(type(Admin.from_dict({"name": "Asha"})).__name__)  # Admin
```

**Real-life example:** To open a bank account, you go to the bank itself, because you don't have an account yet. The bank is like the class, and your account is like an instance.

</details>

**E13.** Why use an is-a relationship?

<details>
<summary>Answer</summary>

Use inheritance when the child really is a kind of the parent. You reuse the parent's code, and any code that works with the parent also works with the child.

```python
class Vehicle:
    def start(self):
        return "started"

class Car(Vehicle):
    pass

class Bike(Vehicle):
    pass

for vehicle in (Car(), Bike()):
    print(vehicle.start())  # started (printed twice)
```

If it isn't truly is-a, use has-a (composition) instead: a car **has an** engine, but a car isn't an engine.

**Real-life example:** A car is a vehicle and a bike is a vehicle, so both can start and stop. Traffic rules for vehicles apply to both, without writing separate rules.

</details>

**E14.** What are the different forms of `super()`?

<details>
<summary>Answer</summary>

| Form | Use it for |
|---|---|
| `super().__init__(...)` | Running the parent's setup |
| `super().method()` | Using the parent's method, then adding to it |
| `super().attribute` | Reading the parent's class attribute |
| `super(Child, self).method()` | The older way of writing the same call |
| `super().create()` in a class method | Calling the parent's class method |

```python
class Parent:
    role = "parent"

    def __init__(self, name):
        self.name = name

    def show(self):
        return f"name: {self.name}"

    @classmethod
    def create(cls):
        return cls("new")

class Child(Parent):
    def __init__(self, name):
        super().__init__(name)

    def show(self):
        return super().show() + " (child)"

    def old_style(self):
        return super(Child, self).show()

    def parent_role(self):
        return super().role

    @classmethod
    def create(cls):
        return super().create()

child = Child("Asha")
print(child.show())         # name: Asha (child)
print(child.old_style())    # name: Asha
print(child.parent_role())  # parent
print(Child.create().name)  # new
```

**Real-life example:** At work you follow your manager's process, then add your own final step. `super()` is "do what my manager's process says first".

</details>

**E15.** What is multiple inheritance and MRO? When are mixins used?

<details>
<summary>Answer</summary>

**Multiple inheritance:** a class has more than one parent.

**MRO (method resolution order):** the fixed order Python searches classes to find a method. See it with `Class.__mro__`.

**Mixin:** a small class that adds one extra ability, such as logging. Use a mixin when several unrelated classes need the same small feature. Put it before the main parent.

```python
class LogMixin:
    def save(self):
        return "log, " + super().save()

class Model:
    def save(self):
        return "saved"

class Report:
    def save(self):
        return "report saved"

class LoggedModel(LogMixin, Model):
    pass

class LoggedReport(LogMixin, Report):
    pass

print(LoggedModel().save())   # log, saved
print(LoggedReport().save())  # log, report saved
print([c.__name__ for c in LoggedModel.__mro__])
# ['LoggedModel', 'LogMixin', 'Model', 'object']
```

**Real-life example:** You add a phone cover with a card holder to any phone. The cover is a mixin: one small extra feature that fits many phones. The MRO is like a queue: Python asks the first person in line, then the next.

</details>

**E16.** What is the diamond inheritance problem?

<details>
<summary>Answer</summary>

It happens when two parents share one grandparent, so the shape looks like a diamond. The question is which version runs, and whether the grandparent runs twice. Python solves this with the MRO: each class appears once, and `super()` moves to the next class in that order.

```text
    A
   / \
  B   C
   \ /
    D
```

```python
class A:
    def show(self):
        print("A")

class B(A):
    def show(self):
        print("B")
        super().show()

class C(A):
    def show(self):
        print("C")
        super().show()

class D(B, C):
    def show(self):
        print("D")
        super().show()

D().show()
# D
# B
# C
# A
```

`A` runs only once. `super()` in `B` goes to `C`, not straight to `A`, because `C` comes next in `D`'s order.

**Real-life example:** Your father and mother both took the same family recipe from your grandmother. You wouldn't cook her step twice. You follow one clear order, and her step happens once.

</details>

### Lambda and decorators

**E17.** What is a lambda function, and when should you avoid it?

<details>
<summary>Answer</summary>

A lambda is a small function with no name, written in one line. It returns the value of one expression. It's best for short jobs, such as a sorting key.

```python
words = ["banana", "fig", "apple"]
print(sorted(words, key=lambda word: len(word)))
# ['fig', 'apple', 'banana']
```

**Avoid it when** the logic needs several steps, error handling, or a clear name. It isn't faster than `def`, so use `def` for anything you reuse.

**Real-life example:** A sticky note is good for a quick reminder, like "buy milk". For a long procedure you need a proper document. A lambda is the sticky note, and `def` is the document.

</details>

**E18.** How do you find the best model and sort by several fields using a lambda function?

<details>
<summary>Answer</summary>

Pass a lambda as `key`. For several fields, return a tuple. Python compares the first value, then the next one if they tie. Put a minus sign before a number to sort it from highest to lowest.

```python
models = [
    {"name": "rf", "accuracy": 0.93, "time": 20},
    {"name": "svm", "accuracy": 0.93, "time": 10},
    {"name": "lr", "accuracy": 0.88, "time": 2},
]

best = max(models, key=lambda m: m["accuracy"])
print(best["name"])  # rf

ranked = sorted(models, key=lambda m: (-m["accuracy"], m["time"]))
print([m["name"] for m in ranked])  # ['svm', 'rf', 'lr']
```

`rf` and `svm` tie on accuracy, so the faster `svm` comes first in the ranking. `max()` returns the first of the tied items.

**Real-life example:** A class ranks students by highest marks. If two tie, the one who finished the exam faster comes first.

</details>

**E19.** What is a decorator, and how do you write one?

<details>
<summary>Answer</summary>

A decorator is a function that wraps another function to add extra behaviour, without changing that function's code.

1. Write a function that takes a function.
2. Inside it, write a `wrapper` that adds the extra work and calls the original.
3. Return the wrapper.
4. Put `@name` above the function.

```python
from functools import wraps

def log_call(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print("Starting")
        result = function(*args, **kwargs)
        print("Finished")
        return result
    return wrapper

@log_call
def add(a, b):
    return a + b

print(add(2, 3))
# Starting
# Finished
# 5
```

**Real-life example:** Gift wrapping adds a nice cover, but the gift inside stays the same. Or think of a phone case: the phone doesn't change, but it gets extra protection.

</details>

**E20.** What is the difference between a function decorator and a class decorator?

<details>
<summary>Answer</summary>

| | Function decorator | Class decorator |
|---|---|---|
| Decorates | A function | A class |
| Usually returns | A wrapper function | The same class |
| Typical use | Logging, timing, caching | Registering or changing a class |
| Example | `@lru_cache` | `@dataclass` |

Both run once, when the definition runs.

```python
registry = []

def register(cls):
    registry.append(cls.__name__)
    return cls

@register
class Model:
    pass

print(registry)  # ['Model']
```

**Real-life example:** A function decorator is like a security check at each visit: it acts each time someone enters. A class decorator is like registering a new company: it happens once, when the company is created.

</details>

### Dunder methods and dataclasses

**E21.** What are dunder/magic methods? Give examples.

<details>
<summary>Answer</summary>

They are special methods with double underscores on both sides. Python calls them for you when you use normal operations like `print()`, `len()`, or `+`.

| Method | Called by |
|---|---|
| `__init__` | Creating an object |
| `__str__` | `print(obj)` |
| `__len__` | `len(obj)` |
| `__call__` | `obj()` |
| `__add__` | `a + b` |
| `__eq__` | `a == b` |

```python
class Cart:
    def __init__(self, items):
        self.items = items

    def __str__(self):
        return f"Cart with {len(self)} items"

    def __len__(self):
        return len(self.items)

    def __add__(self, other):
        return Cart(self.items + other.items)

cart = Cart(["pen"]) + Cart(["book"])
print(cart)       # Cart with 2 items
print(len(cart))  # 2
```

**Real-life example:** When you press a car's accelerator, you don't handle the engine yourself. The car does the hidden work. You use `+` or `len()`, and the dunder method does the hidden work.

</details>

**E22.** What is the `dataclass` decorator? Why is it useful?

<details>
<summary>Answer</summary>

`@dataclass` writes common code for a class that mainly stores data. You list the fields, and Python creates `__init__`, `__repr__`, and `__eq__`. You write less code and make fewer mistakes.

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    marks: int = 0

first = Student("Asha", 90)
print(first)                         # Student(name='Asha', marks=90)
print(first == Student("Asha", 90))  # True
```

**Real-life example:** You fill in a ready-made form with just name and marks. You don't draw the whole form by hand each time. `@dataclass` is the ready-made form.

</details>

**E23.** How do you add validation when using the `dataclass` decorator?

<details>
<summary>Answer</summary>

Write a `__post_init__` method. Python runs it right after the fields are set, so you can check the values and raise an error. Type hints alone don't check anything.

```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    marks: int

    def __post_init__(self):
        if not 0 <= self.marks <= 100:
            raise ValueError("marks must be between 0 and 100")

try:
    Student("Asha", 150)
except ValueError as error:
    print(error)  # marks must be between 0 and 100
```

**Real-life example:** After you fill in a form, the clerk checks it before accepting it. If your age says 150, the clerk rejects it. `__post_init__` is that clerk.

</details>

### Generators

**E24.** What is a generator, and how does `yield` work?

<details>
<summary>Answer</summary>

A generator gives values one at a time, only when asked. `yield` hands out one value and pauses the function. It remembers where it stopped, and the next request continues from there.

```python
def tokens():
    print("Token 1 ready")
    yield 1
    print("Token 2 ready")
    yield 2

queue = tokens()
print(next(queue))
print(next(queue))
# Token 1 ready
# 1
# Token 2 ready
# 2
```

**Real-life example:** A bank token machine gives one token when you press the button, then waits. It doesn't print all the day's tokens in the morning.

</details>

**E25.** When would you use a generator instead of a list?

<details>
<summary>Answer</summary>

Use a **generator** when the data is large, you read it once, or you may stop early, because it doesn't keep everything in memory. Use a **list** when you need indexing, sorting, `len()`, or several passes.

```python
import sys

as_list = [n for n in range(100_000)]
as_gen = (n for n in range(100_000))

print(sys.getsizeof(as_list) > sys.getsizeof(as_gen))  # True
print(sum(as_gen))  # 4999950000
```

**Real-life example:** Streaming a movie plays it piece by piece, so your phone needs little space. Downloading the full movie takes space, but you can jump around and watch it again. Streaming is a generator, and downloading is a list.

</details>

**E26.** What is the difference between `return` and `yield`?

<details>
<summary>Answer</summary>

| `return` | `yield` |
|---|---|
| Ends the function | Pauses the function |
| Gives one result | Gives many values, one at a time |
| Local variables are lost | Local variables are kept |

```python
def with_return():
    return [1, 2, 3]

def with_yield():
    yield 1
    yield 2
    yield 3

print(with_return())       # [1, 2, 3]
print(list(with_yield()))  # [1, 2, 3]
```

**Real-life example:** `return` is a waiter bringing the full meal at once, and the order is finished. `yield` is a waiter bringing one course, then waiting until you're ready for the next.

</details>

### Exceptions and Context Managers

**E27.** How do `try`, `except`, `else`, and `finally` work?

<details>
<summary>Answer</summary>

| Part | When it runs |
|---|---|
| `try` | Runs the risky code |
| `except` | Only if an error happens |
| `else` | Only if no error happens |
| `finally` | Always, at the end |

```python
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Cannot divide by zero")
    else:
        print("Result:", result)
    finally:
        print("Finished")

divide(10, 2)
divide(10, 0)
# Result: 5.0
# Finished
# Cannot divide by zero
# Finished
```

**Real-life example:** Withdrawing money at an ATM. `try`: enter the amount. `except`: not enough balance, so show a message. `else`: take your cash. `finally`: your card comes back in every case.

</details>

**E28.** How do you create and raise custom exceptions?

<details>
<summary>Answer</summary>

Create a class that inherits from `Exception`. Raise it with `raise`, and catch it by name. This gives your error a clear meaning.

```python
class NotEnoughBalance(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise NotEnoughBalance("Your balance is too low")
    return balance - amount

try:
    withdraw(100, 500)
except NotEnoughBalance as error:
    print(error)  # Your balance is too low
```

**Real-life example:** A hospital writes the exact problem, like "broken arm", not just "sick". A custom exception gives a clear name to the exact problem.

</details>

**E29.** What is exception chaining using `raise ... from ...`?

<details>
<summary>Answer</summary>

You catch a low-level error and raise a clearer one, while keeping the original as the cause. The user sees a simple message, and developers can still find the real reason. The original is stored in `__cause__`.

```python
class ConfigError(Exception):
    pass

def read_epochs(text):
    try:
        return int(text)
    except ValueError as error:
        raise ConfigError("epochs must be a number") from error

try:
    read_epochs("ten")
except ConfigError as error:
    print(error)                        # epochs must be a number
    print(type(error.__cause__).__name__)  # ValueError
```

**Real-life example:** A shop tells you "Delivery delayed". Its records also keep the real cause: "truck broke down". You get a simple message, and the manager can still see what happened.

</details>

**E30.** What is the difference between exception chaining and a custom exception?

<details>
<summary>Answer</summary>

They answer different questions, and they often work together.

| | Custom exception | Exception chaining |
|---|---|---|
| What it is | A new error type | A link between two errors |
| Question it answers | What kind of error is it? | What caused this error? |
| How you write it | `class MyError(Exception)` | `raise New() from error` |

```python
class PaymentError(Exception):    # custom exception
    pass

try:
    try:
        1 / 0
    except ZeroDivisionError as error:
        raise PaymentError("Payment failed") from error    # chaining
except PaymentError as error:
    print(error)                           # Payment failed
    print(type(error.__cause__).__name__)  # ZeroDivisionError
```

**Real-life example:** "Delivery delayed" is the custom name for the problem. Noting "because the truck broke down" is the chaining: it links the problem to its cause.

</details>

**E31.** What is a context manager, and how does `with` work?

<details>
<summary>Answer</summary>

A context manager handles setup and cleanup for you. `with` calls `__enter__()` at the start and `__exit__()` at the end, even if an error happens inside.

```python
class Room:
    def __enter__(self):
        print("Lights on")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("Lights off")

with Room():
    print("Working")
# Lights on
# Working
# Lights off
```

**Real-life example:** A room with automatic lights turns them on when you enter and off when you leave. You never have to remember the switch.

</details>

**E32.** In programming, what are the scenarios where a context manager is used?

<details>
<summary>Answer</summary>

Use one whenever something must be opened and later closed, or set and later restored.

| Scenario | Example | What it does at the end |
|---|---|---|
| Files | `with open("data.txt") as file:` | Closes the file |
| Thread locks | `with lock:` | Releases the lock |
| Database transactions | `with connection:` | Commits, or rolls back on error |
| Temporary folders | `with TemporaryDirectory() as path:` | Deletes the folder |
| Thread pools | `with ThreadPoolExecutor() as pool:` | Waits for and shuts down workers |
| Ignoring an error | `with suppress(KeyError):` | Ignores that error |
| ML evaluation | `with torch.no_grad():` | Restores gradient tracking |

**1. Files: save and load project settings**

```python
import json

settings = {"learning_rate": 0.01, "epochs": 10}

with open("config.json", "w", encoding="utf-8") as file:
    json.dump(settings, file)

with open("config.json", encoding="utf-8") as file:
    loaded = json.load(file)

print(loaded["epochs"])  # 10
print(file.closed)       # True
```

The file closes by itself, even if `json.load()` fails.

**2. Thread locks: count requests safely**

```python
from threading import Lock, Thread

request_count = 0
lock = Lock()

def handle_requests():
    global request_count
    for _ in range(1_000):
        with lock:
            request_count += 1

threads = [Thread(target=handle_requests) for _ in range(4)]
for thread in threads:
    thread.start()
for thread in threads:
    thread.join()

print(request_count)  # 4000
```

The lock lets one thread at a time update the count, and it's released even if an error happens.

**3. Database transactions: undo a failed payment**

```python
import sqlite3

connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE accounts (name TEXT, balance INTEGER)")

with connection:
    connection.execute("INSERT INTO accounts VALUES ('Asha', 1000)")

try:
    with connection:
        connection.execute("UPDATE accounts SET balance = balance - 500")
        raise ValueError("Payment failed")
except ValueError:
    print("Rolled back")  # Rolled back

print(connection.execute("SELECT balance FROM accounts").fetchone())  # (1000,)
connection.close()
```

The first block commits. The second fails, so the balance goes back to `1000`. This `with` doesn't close the connection, so call `close()` yourself.

**4. Temporary folders: process an uploaded file**

```python
from pathlib import Path
from tempfile import TemporaryDirectory

with TemporaryDirectory() as folder:
    upload = Path(folder) / "upload.csv"
    upload.write_text("name,score\nAsha,90\n", encoding="utf-8")
    rows = upload.read_text(encoding="utf-8").splitlines()
    print(len(rows))      # 2

print(upload.exists())    # False
```

The folder and everything in it are deleted when the block ends, so no temporary files are left behind.

**5. Thread pools: fetch many pages together**

```python
from concurrent.futures import ThreadPoolExecutor
from time import sleep

def fetch_page(page):
    sleep(0.01)    # stands in for a network call
    return f"page {page} loaded"

with ThreadPoolExecutor(max_workers=3) as pool:
    results = list(pool.map(fetch_page, [1, 2, 3]))

print(results)  # ['page 1 loaded', 'page 2 loaded', 'page 3 loaded']
```

When the block ends, the pool waits for its work to finish, then shuts down its threads.

**6. Ignoring an error: remove an item that may be missing**

```python
from contextlib import suppress

cache = {"user_1": "Asha"}

with suppress(KeyError):
    del cache["user_2"]      # missing, so KeyError is ignored

print("Still running")       # Still running
```

Use this only when the error is truly fine to ignore. Any other error still reaches the caller.

**7. ML evaluation: predict without tracking gradients** (needs PyTorch)

```python
import torch

model = torch.nn.Linear(2, 1)
data = torch.ones(1, 2)

model.eval()
with torch.no_grad():
    prediction = model(data)

print(prediction.requires_grad)   # False
print(torch.is_grad_enabled())    # True
```

Prediction uses less memory because gradients aren't tracked. Tracking comes back on after the block, so training can continue. `model.eval()` is a separate step that switches layers like dropout to evaluation mode.

**Real-life example:** When you borrow a library book or rent a car, you must return it. A context manager makes sure the return always happens, even if something goes wrong.

</details>

**E33.** What is the difference between `finally` and a context manager for cleanup?

<details>
<summary>Answer</summary>

`finally` runs cleanup code you write yourself, each time. A context manager keeps the cleanup inside the object, so `with` runs it for you. Both clean up, even after an error.

```python
from threading import Lock

lock = Lock()

lock.acquire()
try:
    print("Working")
finally:
    lock.release()     # you write the cleanup

with lock:             # cleanup happens for you
    print("Working")
```

Use `with` when a ready-made context manager exists. Use `finally` for one-off cleanup, such as resetting a status.

**Real-life example:** `finally` is cleaning your own room after work: you must do it yourself each time. A context manager is hotel housekeeping: it's already built in, and it happens when you leave.

</details>

### Asyncio

**E34.** How do `async` and `await` work in Python?

<details>
<summary>Answer</summary>

`async def` creates a function that can pause. `await` means "wait here, and let other tasks run meanwhile". One thread switches between tasks while they wait. This suits waiting work like network calls, not heavy calculations.

```python
import asyncio

async def cook(dish):
    print("Start", dish)
    await asyncio.sleep(0.01)    # waiting: other tasks can run
    print("Done", dish)

async def main():
    await asyncio.gather(cook("rice"), cook("dal"))

asyncio.run(main())
# Start rice
# Start dal
# Done rice
# Done dal
```

`asyncio.gather()` runs them together, and `asyncio.run()` starts everything.

**Real-life example:** One cook puts rice on the stove. While it boils, the cook starts the dal, instead of standing and watching the rice. Nobody works in parallel: one person just uses the waiting time well.

</details>
