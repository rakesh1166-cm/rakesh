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

Sorting is smallest-first by default. `reverse=True` gives largest-first, for example the highest accuracy at the top.

```python
sorted([3, 1, 2])                 # [1, 2, 3]
sorted([3, 1, 2], reverse=True)   # [3, 2, 1]
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

| Method | Use when | Example |
|---|---|---|
| `get()` | The key is optional and a default is fine | `d.get("age", 0)` |
| `in` | You need different logic if the key is present | `if "age" in d: ...` |
| `try/except KeyError` | The key should exist, so missing is unusual | `try: d["age"]`<br>`except KeyError: ...` |

`d.get("age")` returns `None` both when the key is missing and when its stored value is `None`. Use `in` to tell them apart.

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
