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

---

## Part B: Predict the Output (MCQ practice)

- [Basics and Data Types](#basics-and-data-types) (M1–M69)
  - Basics (M1–M16)
    - Basics theory (M1–M10)
    - ML libraries and tools (M11–M16)
  - Variables (M17–M37)
    - Dynamic typing (M17–M22)
    - Shared references (M23–M28)
    - Scope (LEGB) (M29–M37)
  - Operators (M38–M47)
    - Equality and identity (M38–M43)
    - Membership and comparison (M44–M47)
  - Data types (M48–M69)
    - bool, None, and truthiness (M48–M53)
    - Mutable and immutable (M54–M59)
    - list, tuple, set, and dict (M60–M69)
- [Data Structures and Comprehensions](#data-structures-and-comprehensions) (M70–M180)
  - Lists (M70–M101)
    - append and extend (M70–M79)
    - Slicing and reversing (M80–M94)
    - Removing duplicates (M95–M101)
  - Sorting (M102–M131)
    - Basic sorting (M102–M120)
    - Sorting by multiple criteria (M121–M131)
  - Dictionaries (M132–M150)
    - Dictionaries and complexity (M132–M137)
    - Merging and safe dictionary access (M138–M150)
  - Comprehensions and iteration (M151–M180)
    - Creating dictionaries and lists (M151–M171)
    - enumerate, zip, and unpacking (M172–M180)
- [Functions](#functions) (M181–M188)
  - `*args` and `**kwargs` (M181–M188)

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

**M23.** What does this print?

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

**M24.** What does this print?

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

**M25.** What does this print?

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

**M26.** What does this print?

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

**M27.** What does this print?

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

**M28.** What does this print?

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

**M29.** What is the order of Python's name lookup?

- A) Local → Global → Enclosing → Built-in
- B) Built-in → Global → Enclosing → Local
- C) Global → Local → Enclosing → Built-in
- D) Local → Enclosing → Global → Built-in

<details>
<summary>Answer</summary>

**D) Local → Enclosing → Global → Built-in**. This is the LEGB rule. (See Q27.)

</details>

**M30.** What does this print?

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

**M31.** What does this print?

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

**M32.** What does this print?

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

**M33.** Which keyword lets a nested function change a variable in its outer function?

- A) `global`
- B) `local`
- C) `outer`
- D) `nonlocal`

<details>
<summary>Answer</summary>

**D) `nonlocal`**. `global` targets the module level instead. (See Q29.)

</details>

**M34.** Which keyword lets a function change a module-level variable?

- A) `static`
- B) `module`
- C) `nonlocal`
- D) `global`

<details>
<summary>Answer</summary>

**D) `global`**. `global` points the name at the module scope. (See Q29.)

</details>

**M35.** What does this print?

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

**M36.** What does this print?

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

**M37.** What does this print?

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

**M38.** What does this print?

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

**M39.** What does each line print?

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

**M40.** What does this print?

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

**M41.** Which check compares identity?

- A) `a != b`
- B) `a = b`
- C) `a is b`
- D) `a == b`

<details>
<summary>Answer</summary>

**C) `a is b`**. `is` asks whether both names are the same object. (See Q24.)

</details>

**M42.** What does each line print?

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

**M43.** What is the correct way to check for None?

- A) `if x:`
- B) `x = None`
- C) `x is None`
- D) `x == None`

<details>
<summary>Answer</summary>

**C) `x is None`**. `if x:` would also treat `0` and `""` as missing. (See Q25.)

</details>

##### Membership and comparison

**M44.** How do you check whether a dict `d` has no key `"k"`?

- A) `d == "k"`
- B) `not d`
- C) `"k" not in d`
- D) `d is None`

<details>
<summary>Answer</summary>

**C) `"k" not in d`**. `in` checks keys. (See Q25.)

</details>

**M45.** What does this print?

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

**M46.** What does this print?

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

**M47.** What does this print?

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

**M48.** What does each line print?

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

**M49.** What does each line print?

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

**M50.** What does each line print?

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

**M51.** What does this print?

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

**M52.** What does this print?

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

**M53.** What does this print?

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

**M54.** Which group contains only immutable types?

- A) `int`, `set`, `dict`
- B) `int`, `str`, `tuple`
- C) `list`, `dict`, `set`
- D) `str`, `list`, `tuple`

<details>
<summary>Answer</summary>

**B) `int`, `str`, `tuple`**. `list`, `dict`, and `set` are mutable. (See Q13.)

</details>

**M55.** What does this print?

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

**M56.** What does this print?

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

**M57.** What does this print?

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

**M58.** Which of these can be a dictionary key?

- A) `(1, (2, 3))`
- B) `[1, 2]`
- C) `(1, [2])`
- D) `{1: 2}`

<details>
<summary>Answer</summary>

**A) `(1, (2, 3))`**. A tuple is hashable only if everything inside it is hashable. (See Q18.)

</details>

**M59.** What does this print?

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

**M60.** Which collection automatically removes duplicates?

- A) `list`
- B) `set`
- C) `tuple`
- D) `str`

<details>
<summary>Answer</summary>

**B) `set`**. A set keeps unique values only. (See Q19.)

</details>

**M61.** You need a fixed record that can also be a dictionary key. Which do you choose?

- A) `dict`
- B) `list`
- C) `set`
- D) `tuple`

<details>
<summary>Answer</summary>

**D) `tuple`**. A tuple is immutable and hashable if its items are. (See Q19.)

</details>

**M62.** What does this print?

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

**M63.** What does this print?

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

**M64.** What does this print?

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

**M65.** Which of these does NOT support indexing like `x[0]`?

- A) `list`
- B) `tuple`
- C) `set`
- D) `str`

<details>
<summary>Answer</summary>

**C) `set`**. Sets are unordered, so they have no positions. (See Q20.)

</details>

**M66.** Which group contains only ordered sequences?

- A) `list`, `set`, `str`, `range`
- B) `dict`, `list`, `set`, `tuple`
- C) `list`, `tuple`, `str`, `range`
- D) `set`, `dict`, `tuple`, `str`

<details>
<summary>Answer</summary>

**C) `list`, `tuple`, `str`, `range`**. `dict` keeps insertion order but isn't a sequence, and `set` is unordered. (See Q20.)

</details>

**M67.** What is the average time for `x in some_set`?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**A) O(1)**. Sets use a hash table. (See Q21.)

</details>

**M68.** What is the time for `x in some_list`?

- A) O(log n)
- B) O(1)
- C) O(n²)
- D) O(n)

<details>
<summary>Answer</summary>

**D) O(n)**. A list is scanned item by item. (See Q21.)

</details>

**M69.** What does this print?

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

**M70.** What does this print?

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

**M71.** What does this print?

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

**M72.** What does this print?

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

**M73.** What does this print?

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

**M74.** What does this print?

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

**M75.** What does this print?

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

**M76.** What does this print?

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

**M77.** What happens?

```python
numbers = [1, 2]
numbers.extend(3)
```

<details>
<summary>Answer</summary>

`TypeError: 'int' object is not iterable`. `extend()` needs an iterable, so use `append(3)` or `extend([3])`.

</details>

**M78.** Starting from `[1, 2]` each time, what's the result of each call?

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

**M79.** What gets printed?

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

**M80.** What does this print?

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

**M81.** What does this print?

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

**M82.** What does this print?

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

**M83.** What does this print?

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

**M84.** What does this print?

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

**M85.** What does this print?

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

**M86.** What does this print?

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

**M87.** What does this print?

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

**M88.** What does this print?

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

**M89.** What does this print?

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

**M90.** What does this print?

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

**M91.** What does this print?

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

**M92.** With `numbers = [10, 20, 30, 40, 50, 60]`, what does each print?

```python
print(numbers[-3:])
print(numbers[:-2])
print(numbers[-4:-1])
```

<details>
<summary>Answer</summary>

`[40, 50, 60]` (last three) · `[10, 20, 30, 40]` (all except the last two) · `[30, 40, 50]` (start at 30, stop before 60).

</details>

**M93.** With `numbers = [10, 20, 30, 40, 50]`, what does each give?

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

**M94.** Which of these reverses `items = [1, 2, 3]`, and what does each return?

A) `items[::-1]`  B) `reversed(items)`  C) `items.reverse()`  D) `items.sort(reverse=True)`

<details>
<summary>Answer</summary>

All four end up with the order `3, 2, 1`, but they return different things:
A → new list `[3, 2, 1]` · B → an iterator (wrap it in `list()`) · C → reverses in place, returns `None` · D → sorts descending in place, returns `None` (same result here only because the list was already sorted).

</details>

##### Removing duplicates

**M95.** Which option removes duplicates and keeps first-seen order?

- A) `list(set(items))`
- B) `list(dict.fromkeys(items))`
- C) `items.sort()`
- D) `sorted(set(items))`

<details>
<summary>Answer</summary>

**B) `list(dict.fromkeys(items))`**. Dict keys are unique and keep insertion order. (See Q39.)

</details>

**M96.** What does this print?

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

**M97.** `[3, 1, 2, 3, 1]` after removing duplicates and preserving order is:

- A) `[2, 3, 1]`
- B) `[3, 1, 2]`
- C) `[3, 2, 1]`
- D) `[1, 2, 3]`

<details>
<summary>Answer</summary>

**B) `[3, 1, 2]`**. Each value keeps its first position. (See Q40.)

</details>

**M98.** Does `list(set(items))` guarantee order?

- A) Yes, always insertion order
- B) No, sets are unordered
- C) Only for lists of strings
- D) Yes, always sorted

<details>
<summary>Answer</summary>

**B) No, sets are unordered**. Use `dict.fromkeys()` to keep order. (See Q41.)

</details>

**M99.** Which pandas call gives the number of unique values in a Series?

- A) `s.value_counts()`
- B) `s.count()`
- C) `s.nunique()`
- D) `s.unique()`

<details>
<summary>Answer</summary>

**C) `s.nunique()`**. `unique()` returns the values, and `count()` returns non-null rows. (See Q42.)

</details>

**M100.** What does `s.drop_duplicates()` return for a pandas Series?

- A) A dictionary
- B) A set
- C) A Series
- D) A Python list

<details>
<summary>Answer</summary>

**C) A Series**. Add `.tolist()` to get a list. (See Q42.)

</details>

**M101.** What does this print?

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

**M102.** What does this print?

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

**M103.** What does this print?

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

**M104.** Which types have a `.sort()` method?

- A) `list` and `set`
- B) `list` and `tuple`
- C) All iterables
- D) Only `list`

<details>
<summary>Answer</summary>

**D) Only `list`**. `sorted()` works on any iterable, but `.sort()` belongs to lists. (See Q49.)

</details>

**M105.** What does this print?

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

**M106.** What does this print?

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

**M107.** What does this print?

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

**M108.** What does this print?

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

**M109.** What does this print?

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

**M110.** What does this print?

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

**M111.** What does this print?

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

**M112.** What does this print?

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

**M113.** What does this print?

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

**M114.** What does this print?

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

**M115.** What does this print?

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

**M116.** What does this print?

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

**M117.** What does this print?

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

**M118.** What does this print?

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

**M119.** What does this print?

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

**M120.** What does this print?

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

**M121.** What does this print?

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

**M122.** What does this print?

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

**M123.** Which key puts in-stock products first?

- A) `p["in_stock"]`
- B) `not p["in_stock"]`
- C) `len(p)`
- D) `-p["price"]`

<details>
<summary>Answer</summary>

**B) `not p["in_stock"]`**. Items in stock get `False`, which sorts first. (See Q61.)

</details>

**M124.** In a sort key, how do you put the highest severity first?

- A) `-t["severity"]`
- B) `t["severity"][::-1]`
- C) `t["severity"]`
- D) `not t["severity"]`

<details>
<summary>Answer</summary>

**A) `-t["severity"]`**. The minus sign flips number order. (See Q62.)

</details>

**M125.** Why do ISO dates like `"2026-01-05"` sort correctly as plain text?

- A) Year, month, and day run from largest to smallest unit
- B) Dashes are ignored while sorting
- C) Strings sort by length first
- D) Python detects dates automatically

<details>
<summary>Answer</summary>

**A) Year, month, and day run from largest to smallest unit**. Text comparison goes left to right, the same order as date size. (See Q62, Q66.)

</details>

**M126.** What is the best key for department, last name, then first name, all A to Z?

- A) `[-e["dept"], e["last"]]`
- B) `(e["dept"], e["last"], e["first"])`
- C) `len(e["dept"])`
- D) `e["dept"] + e["last"]`

<details>
<summary>Answer</summary>

**B) `(e["dept"], e["last"], e["first"])`**. A tuple key compares each part in turn. (See Q63.)

</details>

**M127.** What does this print?

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

**M128.** Sort key for highest rating first, then cheapest, then shortest:

- A) `(t["rating"], -t["price"], -t["days"])`
- B) `(-t["rating"], t["price"], t["days"])`
- C) `(t["rating"], t["price"], t["days"])`
- D) `(-t["rating"], -t["price"], -t["days"])`

<details>
<summary>Answer</summary>

**B) `(-t["rating"], t["price"], t["days"])`**. Only the rating needs reversing. (See Q64.)

</details>

**M129.** Sort key for exact matches first, then highest score, then title A to Z:

- A) `(r["exact"], -r["score"], r["title"])`
- B) `(not r["exact"], -r["score"], r["title"])`
- C) `(not r["exact"], r["score"], -r["title"])`
- D) `(r["exact"], r["score"], r["title"])`

<details>
<summary>Answer</summary>

**B) `(not r["exact"], -r["score"], r["title"])`**. Use `not` for True-first and a minus sign for highest-first. (See Q65.)

</details>

**M130.** Date and ID must both go highest first, and the date is a string. What do you use?

- A) `key=lambda o: (o["date"], o["id"]), reverse=True`
- B) `key=lambda o: not o["date"]`
- C) `key=lambda o: (o["date"], -o["id"])`
- D) `key=lambda o: (-o["date"], -o["id"])`

<details>
<summary>Answer</summary>

**A) `key=lambda o: (o["date"], o["id"]), reverse=True`**. `reverse=True` flips the whole tuple, and a date string can't be negated. (See Q66.)

</details>

**M131.** What does this print?

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

**M132.** What does this print?

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

**M133.** What is the time to insert at the beginning of a list?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**C) O(n)**. Every existing item has to shift right. (See Q69.)

</details>

**M134.** What is the amortized time of `list.append()`?

- A) O(log n)
- B) O(1)
- C) O(n)
- D) O(n²)

<details>
<summary>Answer</summary>

**B) O(1)**. A resize is only needed occasionally. (See Q69.)

</details>

**M135.** Which operation is slowest on a large list?

- A) `items.append(1)`
- B) `items[5]`
- C) `items.pop(0)`
- D) `items.pop()`

<details>
<summary>Answer</summary>

**C) `items.pop(0)`**. `pop(0)` shifts every remaining item left. (See Q69.)

</details>

**M136.** What is the average time to look up, insert, or delete by key in a dict?

- A) O(1)
- B) O(log n)
- C) O(n)
- D) O(n log n)

<details>
<summary>Answer</summary>

**A) O(1)**. Dicts use a hash table. The worst case is O(n). (See Q69.)

</details>

**M137.** Why can't a list be a dict key?

- A) It's mutable, so it's unhashable
- B) Keys must be strings
- C) Lists have no order
- D) It's too large to store

<details>
<summary>Answer</summary>

**A) It's mutable, so it's unhashable**. A key's hash must stay stable. Use a tuple instead. (See Q70.)

</details>

##### Merging and safe dictionary access

**M138.** What does this print?

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

**M139.** What does this print?

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

**M140.** What does this print?

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

**M141.** What does this print?

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

**M142.** What does this print?

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

**M143.** What does this print?

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

**M144.** What does this print?

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

**M145.** What does this print?

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

**M146.** What does this print?

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

**M147.** What does this print?

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

**M148.** Which one is LBYL (Look Before You Leap)?

- A) try `d["k"]`, then `except KeyError`
- B) `if "k" in d: use(d["k"])`
- C) `d.setdefault("k", 0)`
- D) `d.get("k", 0)`

<details>
<summary>Answer</summary>

**B) `if "k" in d: use(d["k"])`**. LBYL checks first. (See Q98.)

</details>

**M149.** Which one is EAFP (Easier to Ask Forgiveness than Permission)?

- A) `if "k" in d: use(d["k"])`
- B) `len(d) > 0`
- C) `d.get("k", 0)`
- D) try `d["k"]`, then `except KeyError`

<details>
<summary>Answer</summary>

**D) try `d["k"]`, then `except KeyError`**. EAFP tries first and handles the error. (See Q98.)

</details>

**M150.** Which is the simplest choice when a missing key should just give a default?

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

**M151.** What does this print?

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

**M152.** What does this print?

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

**M153.** What does this print?

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

**M154.** What does this print?

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

**M155.** What does this print?

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

**M156.** What does this print?

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

**M157.** What does this print?

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

**M158.** What does this print?

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

**M159.** What does this print?

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

**M160.** What does this print?

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

**M161.** What does this print?

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

**M162.** What does this print?

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

**M163.** What does this print?

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

**M164.** What does this print?

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

**M165.** What does this print?

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

**M166.** What does this print?

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

**M167.** What does this print?

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

**M168.** What does this print?

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

**M169.** What does this print?

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

**M170.** What does this print?

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

**M171.** What does this print?

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

**M172.** What does this print?

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

**M173.** What does this print?

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

**M174.** What does this print?

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

**M175.** What does this print?

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

**M176.** What does this print?

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

**M177.** What does this print?

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

**M178.** What does this print?

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

**M179.** What does this print?

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

**M180.** What does this print?

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

### Functions

#### `*args` and `**kwargs`

**M181.** What does this print?

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

**M182.** What does this print?

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

**M183.** What does this print?

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

**M184.** When are `*args` and `**kwargs` most useful?

- A) You want faster loops
- B) The data is already one list
- C) A function must take exactly two arguments
- D) A wrapper forwards unknown arguments to another function

<details>
<summary>Answer</summary>

**D) A wrapper forwards unknown arguments to another function**. Decorators and wrappers use this a lot. (See Q91.)

</details>

**M185.** What does this print?

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

**M186.** What does this print?

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

**M187.** What does this print?

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

**M188.** Why write `model.fit(*train_data, **settings)` in experiments?

- A) It turns off validation
- B) It saves the model automatically
- C) Each run changes only the settings dict
- D) It makes training run faster

<details>
<summary>Answer</summary>

**C) Each run changes only the settings dict**. The `fit()` line stays the same across experiments. (See Q93.)

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
