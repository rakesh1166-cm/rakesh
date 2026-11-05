# Python Topic-Wise Revision Quiz

**44 interview questions** and **434 rapid-fire questions** across 7 topics.

## How to Use

1. Pick **one topic** per session.
2. **Part A: Rapid-fire.** Answer each question in one line, out loud, then open **Answer**. These check that the core facts are in memory.
3. **Part B: Interview questions.** Answer as you would in an interview: definition → example → trade-off. Then open **Key points** and check what you missed, and compare with the **Model answer**.
4. Grade each interview question and tick the box when it's Strong:
   - 🟢 **Strong:** explanation, example, and trade-off
   - 🟡 **Partial:** missed an important point
   - 🔴 **Weak:** couldn't explain it
5. Write your topic score in the table below, and record Weak/Partial questions in [revision-log.md](revision-log.md).

> Open this file in **Markdown preview** (`Ctrl+Shift+V` in VS Code) so the answers stay hidden.
> For a graded quiz with follow-up questions, ask Claude: **"quiz me on <topic>"**.

Full explanations: [python-interview-qa.md](python-interview-qa.md) · Short notes: [python-qa.md](python-qa.md)

## Topics and Scores

| # | Topic | Interview Qs | Rapid-fire | Last score (rapid / interview) | Date |
|---|---|---|---|---|---|
| 1 | [Basics and Data Types](#basics-and-data-types) | 7 | 67 | __ / 67 · __ / 7 | |
| 2 | [Data Structures and Comprehensions](#data-structures-and-comprehensions) | 10 | 100 | __ / 100 · __ / 10 | |
| 3 | [OOP](#oop) | 6 | 57 | __ / 57 · __ / 6 | |
| 4 | [Functions, Decorators and Generators](#functions-decorators-and-generators) | 8 | 80 | __ / 80 · __ / 8 | |
| 5 | [Exceptions and Context Managers](#exceptions-and-context-managers) | 6 | 60 | __ / 60 · __ / 6 | |
| 6 | [Memory Management and GIL](#memory-management-and-gil) | 3 | 30 | __ / 30 · __ / 3 | |
| 7 | [Concurrency (Threading, Multiprocessing, Asyncio)](#concurrency-threading-multiprocessing-asyncio) | 4 | 40 | __ / 40 · __ / 4 | |

---

## Basics and Data Types

Covers: Q1; Q2; Q3; Q4; Q5; Q6; Q7.

### Part A: Rapid-Fire

#### From Q1: What Are Python's Key Features, and Why Is It Popular for ML?

**A1.** What kind of language is Python?

<details>
<summary>Answer</summary>

High-level, dynamically typed, general-purpose

</details>

**A2.** Does Python require type declarations?

<details>
<summary>Answer</summary>

No; types belong to objects

</details>

**A3.** How does CPython manage memory?

<details>
<summary>Answer</summary>

Reference counting plus a cyclic garbage collector

</details>

**A4.** Which library handles arrays?

<details>
<summary>Answer</summary>

NumPy

</details>

**A5.** Which library handles tables?

<details>
<summary>Answer</summary>

pandas

</details>

**A6.** Which libraries handle deep learning?

<details>
<summary>Answer</summary>

PyTorch and TensorFlow

</details>

**A7.** How are trained models often served?

<details>
<summary>Answer</summary>

Through an API, for example with FastAPI

</details>

**A8.** Why are ML libraries fast?

<details>
<summary>Answer</summary>

They run heavy work in native code or on GPUs

</details>

**A9.** What is a cost of dynamic typing?

<details>
<summary>Answer</summary>

Some type errors appear only at runtime

</details>

**A10.** How do you speed up a slow numeric loop?

<details>
<summary>Answer</summary>

Vectorize it with NumPy or move it to compiled code

</details>

#### From Q2: How Does Dynamic Typing Work in Python?

**A11.** Where does the type belong?

<details>
<summary>Answer</summary>

To the object, not permanently to its variable name

</details>

**A12.** Can a name refer to different types?

<details>
<summary>Answer</summary>

Yes, through reassignment

</details>

**A13.** When does an unsupported operation fail?

<details>
<summary>Answer</summary>

When that operation executes

</details>

**A14.** Does dynamic mean weak typing?

<details>
<summary>Answer</summary>

No; Python is dynamic and commonly described as strongly typed

</details>

**A15.** Do annotations enforce types?

<details>
<summary>Answer</summary>

No; use static checking or explicit runtime validation as needed

</details>

**A16.** What is the difference between an object and a name?

<details>
<summary>Answer</summary>

The object has identity, type and value; the name refers to it

</details>

**A17.** Does assigning one list name to another copy the list?

<details>
<summary>Answer</summary>

No; both names refer to the same list

</details>

**A18.** Is reassignment the same as mutation?

<details>
<summary>Answer</summary>

No; reassignment changes a binding, while mutation changes an object

</details>

#### From Q3: What Is the Difference Between Mutable and Immutable Objects?

**A19.** What is mutable?

<details>
<summary>Answer</summary>

An object that supports changes to its state in place

</details>

**A20.** What is immutable?

<details>
<summary>Answer</summary>

An object whose state cannot be changed after creation

</details>

**A21.** Does assignment copy a list?

<details>
<summary>Answer</summary>

No; it binds another name to the same object

</details>

**A22.** Can an immutable name be reassigned?

<details>
<summary>Answer</summary>

Names are not classified as mutable or immutable; their objects are

</details>

**A23.** Can a tuple contain a list?

<details>
<summary>Answer</summary>

Yes

</details>

**A24.** Can that contained list change?

<details>
<summary>Answer</summary>

Yes

</details>

**A25.** Can a tuple containing a list be a dictionary key?

<details>
<summary>Answer</summary>

No

</details>

**A26.** Why avoid `items=[]` as a default?

<details>
<summary>Answer</summary>

Calls reuse the same default list

</details>

**A27.** Does using `None` prevent mutation of a caller's list?

<details>
<summary>Answer</summary>

No; explicit mutation still affects a supplied list

</details>

#### From Q4: What Is the Difference Between List, Tuple, Set, and Dict? When Do You Use Each?

**A28.** Which collections are ordered sequences?

<details>
<summary>Answer</summary>

`list` and `tuple`

</details>

**A29.** Which collection is immutable?

<details>
<summary>Answer</summary>

`tuple`

</details>

**A30.** Which collection removes duplicates?

<details>
<summary>Answer</summary>

`set`

</details>

**A31.** Do dicts preserve order?

<details>
<summary>Answer</summary>

Yes, insertion order, guaranteed since Python 3.7

</details>

**A32.** What does `{}` create?

<details>
<summary>Answer</summary>

An empty `dict`

</details>

**A33.** How do you make an empty set?

<details>
<summary>Answer</summary>

`set()`

</details>

**A34.** Can a list be a dict key?

<details>
<summary>Answer</summary>

No; it is unhashable

</details>

**A35.** Can a dict value be a list?

<details>
<summary>Answer</summary>

Yes

</details>

**A36.** What is the cost of `x in list`?

<details>
<summary>Answer</summary>

O(n)

</details>

**A37.** What is the cost of `x in set`?

<details>
<summary>Answer</summary>

O(1) on average

</details>

#### From Q5: What Is the Difference Between `is` and `==`?

**A38.** What does `==` compare?

<details>
<summary>Answer</summary>

Values, through `__eq__`

</details>

**A39.** What does `is` compare?

<details>
<summary>Answer</summary>

Object identity

</details>

**A40.** What does `id()` return?

<details>
<summary>Answer</summary>

An identity number that is constant during the object's lifetime

</details>

**A41.** How do you check for `None`?

<details>
<summary>Answer</summary>

`x is None`

</details>

**A42.** Why not `x == None`?

<details>
<summary>Answer</summary>

`__eq__` can be overridden, and arrays compare element-wise

</details>

**A43.** Should you compare strings with `is`?

<details>
<summary>Answer</summary>

No; use `==`

</details>

**A44.** Which ints does CPython cache?

<details>
<summary>Answer</summary>

-5 to 256, an implementation detail

</details>

**A45.** Why might `a is b` work for short strings?

<details>
<summary>Answer</summary>

CPython may intern them

</details>

**A46.** What does `is` with a literal trigger?

<details>
<summary>Answer</summary>

A `SyntaxWarning` since Python 3.8

</details>

**A47.** Can a class override `is`?

<details>
<summary>Answer</summary>

No

</details>

#### From Q6: What Is Variable Scope? Explain the LEGB Rule.

**A48.** What does LEGB stand for?

<details>
<summary>Answer</summary>

Local, Enclosing, Global, Built-in

</details>

**A49.** Which scope is searched first?

<details>
<summary>Answer</summary>

Local

</details>

**A50.** Where do `len` and `print` live?

<details>
<summary>Answer</summary>

The built-in scope

</details>

**A51.** Does an `if` or `for` block create a scope?

<details>
<summary>Answer</summary>

No

</details>

**A52.** Do comprehension variables leak in Python 3?

<details>
<summary>Answer</summary>

No

</details>

**A53.** What does `global` do?

<details>
<summary>Answer</summary>

Lets a function rebind a module-level name

</details>

**A54.** What does `nonlocal` do?

<details>
<summary>Answer</summary>

Lets a nested function rebind an enclosing function's name

</details>

**A55.** Can `nonlocal` refer to a global?

<details>
<summary>Answer</summary>

No

</details>

**A56.** What makes a name local?

<details>
<summary>Answer</summary>

Any binding of it in the function body

</details>

**A57.** What causes `UnboundLocalError`?

<details>
<summary>Answer</summary>

Reading a local name before it is assigned

</details>

#### From Q7: What Is the Difference Between `None`, `False`, `0`, and an Empty Container?

**A58.** What type is `None`?

<details>
<summary>Answer</summary>

`NoneType`

</details>

**A59.** Are `None`, `False`, `0`, `""`, and `[]` all falsy?

<details>
<summary>Answer</summary>

Yes

</details>

**A60.** Is `None == False`?

<details>
<summary>Answer</summary>

No

</details>

**A61.** Is `False == 0`?

<details>
<summary>Answer</summary>

Yes; `bool` is a subclass of `int`

</details>

**A62.** Should you write `False is 0`?

<details>
<summary>Answer</summary>

No; it compares identity and warns

</details>

**A63.** Is `"0"` truthy?

<details>
<summary>Answer</summary>

Yes; it is a non-empty string

</details>

**A64.** Is `[0]` truthy?

<details>
<summary>Answer</summary>

Yes; the list is not empty

</details>

**A65.** How do you check for a missing value?

<details>
<summary>Answer</summary>

`x is None`

</details>

**A66.** Why is `value or default` risky?

<details>
<summary>Answer</summary>

It replaces valid falsy values such as `0`

</details>

**A67.** How do you check if a NumPy array is empty?

<details>
<summary>Answer</summary>

`array.size == 0`

</details>

### Part B: Interview Questions

#### Q1. What Are Python's Key Features, and Why Is It Popular for ML? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Name the main language features.
- Connect those features to ML development.
- Give relevant library examples.
- Explain that Python's popularity doesn't mean Python itself runs every computation fast.
- Mention a practical trade-off, such as runtime type errors or slow CPU-heavy Python loops.

</details>

<details>
<summary>Model answer</summary>

> Python is popular because its readable syntax, dynamic typing, automatic memory management, and large ecosystem make development fast. For ML, it covers the whole workflow, from data preparation with NumPy and pandas, to training with scikit-learn or PyTorch, to deployment through APIs such as FastAPI. Jupyter notebooks make iterative experimentation easy. Python loops can be slow, but ML libraries run most of their computation in optimized native code or on GPUs, so Python mainly acts as the orchestration layer. The trade-offs are that some type errors appear only at runtime and CPU-heavy pure Python loops are slow, which teams handle with tests, type checkers, and vectorization.

</details>

#### Q2. How Does Dynamic Typing Work in Python? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Types belong to objects, not permanently to variable names.
- A name can refer to different types over time.
- Invalid operations raise errors at runtime.
- Dynamic typing is different from weak typing.
- Type hints are not automatic runtime validation.

</details>

<details>
<summary>Model answer</summary>

> Python is dynamically typed because types belong to objects, and variable names can refer to objects of different types during execution. Unsupported operations, such as adding an integer to a string, raise errors when executed. Python is also commonly described as strongly typed because it does not silently convert incompatible values for every operation. Type hints document expected types and support static checking, but they do not automatically validate types at runtime.

</details>

#### Q3. What Is the Difference Between Mutable and Immutable Objects? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Understand in-place modification versus reassignment.
- Explain shared references and how function arguments behave.
- Know that tuple immutability doesn't make the tuple's contents deeply immutable.
- Know that dictionary keys must be hashable, and that a tuple containing a list is not hashable.

</details>

<details>
<summary>Model answer</summary>

> Mutable objects, such as lists and dictionaries, can be modified in place. Immutable objects, such as integers, strings, and tuples, cannot. Reassignment changes which object a name refers to, whereas mutation changes the object itself. Shared references make mutations visible through other names and function arguments. A tuple can contain mutable objects, so its immutability is not necessarily deep. Dictionary keys must be hashable, and mutable default arguments should usually be avoided because their objects are reused across calls.

</details>

#### Q4. What Is the Difference Between List, Tuple, Set, and Dict? When Do You Use Each? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Compare order, mutability, duplicates, and access patterns.
- Explain that sets need hashable elements and dictionaries need hashable keys.
- Know that list membership is typically O(n), while set and dictionary membership is O(1) on average.
- Choose a collection based on the operations you need, not just its syntax.

</details>

<details>
<summary>Model answer</summary>

> A list is an ordered, mutable sequence that allows duplicates, so I use it for data I will append to or edit. A tuple is an ordered, immutable sequence that suits fixed records and can be a dictionary key when its elements are hashable. A set holds unique hashable elements without positions, which makes it ideal for deduplication and fast membership checks. A dictionary maps hashable keys to values and preserves insertion order, so I use it for lookups by key, such as configs or label-to-index maps. Membership in a list is O(n), while sets and dictionaries give O(1) average lookups at the cost of extra memory. I choose based on the operations I need, and I remember that `{}` creates a dict, not a set.

</details>

#### Q5. What Is the Difference Between `is` and `==`? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain identity versus equality clearly.
- Use `is None` to check for `None`.
- Avoid `is` for comparing string or numeric values.
- Know that object caching or string interning can make a wrong `is` comparison seem to work.

</details>

<details>
<summary>Model answer</summary>

> `==` checks whether two objects have equal values, and it can be customized with `__eq__`. `is` checks whether two names refer to the exact same object, and it cannot be overridden. For example, two separate lists `[1, 2]` are equal but not identical. I use `is` for singletons, most commonly `if result is None`, because it is reliable even with NumPy arrays or classes that override equality. I avoid `is` for strings and numbers, because CPython's small-integer caching and string interning can make a wrong comparison seem to work in testing and then fail with values created at runtime.

</details>

#### Q6. What Is Variable Scope? Explain the LEGB Rule. 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain all four levels in the correct order.
- Distinguish `global` from `nonlocal`.
- Understand that assigning to a name inside a function normally makes that name local.
- Explain this common error:

</details>

<details>
<summary>Model answer</summary>

> Scope determines where a name is visible. When Python looks up a name inside a function, it follows the LEGB rule: Local, then Enclosing function scopes, then Global module scope, then Built-ins, and it uses the first match. Assigning to a name anywhere inside a function makes it local for the whole function, which is why reading a global and then assigning to it later raises `UnboundLocalError`. To rebind a module-level name I would use `global`, and to rebind a variable from an enclosing function, for example in a closure counter, I would use `nonlocal`. Mutating an object, like appending to a global list, does not need either keyword. In practice I avoid `global` and pass state explicitly, because it makes code easier to test.

</details>

#### Q7. What Is the Difference Between `None`, `False`, `0`, and an Empty Container? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish meaning, type, and truth value.
- Use `is None` when you specifically want to check for absence.
- Use `if not items` when you intentionally check for an empty collection.
- Know that `False == 0` is `True` because `bool` is a subclass of `int`, but `False is 0` is not a valid way to compare values.
- Don't assume every falsy value means "missing."

</details>

<details>
<summary>Model answer</summary>

> `None`, `False`, `0`, and empty containers are all falsy, so they all fail an `if` check, but they mean different things. `None` represents a missing value or no result, `False` is a logical answer, `0` is a valid number, and an empty list or dict is a collection with no elements. When the distinction matters, such as a score of zero or a dropout of `0.0`, I check `if value is None` instead of `if not value`, because truthiness would treat the valid zero as missing. When all empty or falsy values should be handled the same way, `if not items` is idiomatic. I also know that `False == 0` is `True` because `bool` is a subclass of `int`, but I never compare values with `is`.

</details>

---

## Data Structures and Comprehensions

Covers: Q8; Q9; Q10; Q11; Q12; Q13; Q14; Q15; Q16; Q17.

### Part A: Rapid-Fire

#### From Q8: What Is the Difference Between `append()` and `extend()`?

**A1.** What does `append()` add?

<details>
<summary>Answer</summary>

Its argument, as one element

</details>

**A2.** What does `extend()` add?

<details>
<summary>Answer</summary>

Each element of its iterable argument

</details>

**A3.** Result of `[1, 2].append([3, 4])`?

<details>
<summary>Answer</summary>

`[1, 2, [3, 4]]`

</details>

**A4.** Result of `[1, 2].extend([3, 4])`?

<details>
<summary>Answer</summary>

`[1, 2, 3, 4]`

</details>

**A5.** What does `extend("ab")` add?

<details>
<summary>Answer</summary>

`'a'` and `'b'` separately

</details>

**A6.** What does `extend(3)` do?

<details>
<summary>Answer</summary>

Raises `TypeError`

</details>

**A7.** What do both methods return?

<details>
<summary>Answer</summary>

`None`

</details>

**A8.** Do they create a new list?

<details>
<summary>Answer</summary>

No; they modify the list in place

</details>

**A9.** How is `+=` on a list like `extend()`?

<details>
<summary>Answer</summary>

It modifies in place and accepts any iterable

</details>

**A10.** How is `+` different?

<details>
<summary>Answer</summary>

It creates a new list and needs a list operand

</details>

#### From Q9: How Do You Remove Duplicates From a List While Preserving Order?

**A11.** Shortest order-preserving dedup?

<details>
<summary>Answer</summary>

`list(dict.fromkeys(items))`

</details>

**A12.** Since when do dicts preserve insertion order?

<details>
<summary>Answer</summary>

Guaranteed since Python 3.7

</details>

**A13.** Does `list(set(items))` preserve order?

<details>
<summary>Answer</summary>

No guarantee

</details>

**A14.** How do you get sorted unique values?

<details>
<summary>Answer</summary>

`sorted(set(items))`

</details>

**A15.** Time complexity of the set or dict approach?

<details>
<summary>Answer</summary>

O(n) expected

</details>

**A16.** What if the elements are lists?

<details>
<summary>Answer</summary>

Use tuples as keys, or an O(n²) equality scan

</details>

**A17.** Why does `dict.fromkeys(rows)` fail on lists?

<details>
<summary>Answer</summary>

Lists are unhashable

</details>

**A18.** How do you dedupe by a field?

<details>
<summary>Answer</summary>

Track the field value in a `seen` set

</details>

**A19.** Are `1` and `1.0` duplicates?

<details>
<summary>Answer</summary>

Yes; they compare equal

</details>

**A20.** pandas equivalent?

<details>
<summary>Answer</summary>

`drop_duplicates()` or `unique()`

</details>

#### From Q10: How Does List Slicing Work, Including Negative Indices?

**A21.** What is the slice syntax?

<details>
<summary>Answer</summary>

`items[start:stop:step]`

</details>

**A22.** Is `stop` included?

<details>
<summary>Answer</summary>

No; it is excluded

</details>

**A23.** What does `-1` refer to?

<details>
<summary>Answer</summary>

The last element

</details>

**A24.** How do you reverse a list with slicing?

<details>
<summary>Answer</summary>

`items[::-1]`

</details>

**A25.** What does `items[-3:]` return?

<details>
<summary>Answer</summary>

The last three elements

</details>

**A26.** Can `step` be zero?

<details>
<summary>Answer</summary>

No; it raises `ValueError`

</details>

**A27.** Does `items[:100]` fail on a short list?

<details>
<summary>Answer</summary>

No; slice boundaries are clamped

</details>

**A28.** Does `items[100]` fail on a short list?

<details>
<summary>Answer</summary>

Yes; it raises `IndexError`

</details>

**A29.** Is a list slice a copy?

<details>
<summary>Answer</summary>

Yes, a new shallow copy

</details>

**A30.** Does slice assignment create a new list?

<details>
<summary>Answer</summary>

No; it modifies the existing list in place

</details>

#### From Q11: What Is the Difference Between `sorted()` and `.sort()`?

**A31.** What does `sorted()` return?

<details>
<summary>Answer</summary>

A new list

</details>

**A32.** What does `.sort()` return?

<details>
<summary>Answer</summary>

`None`

</details>

**A33.** Which one modifies the original?

<details>
<summary>Answer</summary>

`.sort()`

</details>

**A34.** Can you call `.sort()` on a tuple?

<details>
<summary>Answer</summary>

No; use `sorted()`

</details>

**A35.** What does `sorted(my_dict)` sort?

<details>
<summary>Answer</summary>

The dictionary's keys

</details>

**A36.** How do you sort in descending order?

<details>
<summary>Answer</summary>

`reverse=True`

</details>

**A37.** How often is the `key` function called?

<details>
<summary>Answer</summary>

Once per element

</details>

**A38.** What does "stable" mean?

<details>
<summary>Answer</summary>

Equal keys keep their original relative order

</details>

**A39.** How do you sort by two criteria?

<details>
<summary>Answer</summary>

Return a tuple from `key`

</details>

**A40.** Can you sort `[1, "a"]` in Python 3?

<details>
<summary>Answer</summary>

No; it raises `TypeError`

</details>

#### From Q12: How Does a Dictionary Work Internally?

**A41.** What data structure backs a dictionary?

<details>
<summary>Answer</summary>

A hash table

</details>

**A42.** What is the average lookup cost?

<details>
<summary>Answer</summary>

O(1)

</details>

**A43.** What is the worst-case lookup cost?

<details>
<summary>Answer</summary>

O(n), when many keys collide

</details>

**A44.** How does CPython resolve collisions?

<details>
<summary>Answer</summary>

Open addressing with a perturbed probe sequence

</details>

**A45.** Why can't a list be a key?

<details>
<summary>Answer</summary>

It is mutable and unhashable

</details>

**A46.** What two rules must a key's hash follow?

<details>
<summary>Answer</summary>

Stable for its lifetime; equal keys have equal hashes

</details>

**A47.** Does an equal hash mean an equal key?

<details>
<summary>Answer</summary>

No; equality is also checked

</details>

**A48.** Are `1` and `True` different keys?

<details>
<summary>Answer</summary>

No; they are equal and have equal hashes

</details>

**A49.** Are dictionaries ordered?

<details>
<summary>Answer</summary>

Yes, by insertion order (guaranteed since 3.7)

</details>

**A50.** Does `{"a": 1, "b": 2} == {"b": 2, "a": 1}`?

<details>
<summary>Answer</summary>

Yes; equality ignores order

</details>

#### From Q13: What Are Dictionary Comprehensions? Give a Practical ML Example.

**A51.** What is the syntax?

<details>
<summary>Answer</summary>

`{key: value for item in iterable if condition}`

</details>

**A52.** How do you loop over a dictionary's pairs?

<details>
<summary>Answer</summary>

Use `.items()`

</details>

**A53.** What happens with duplicate keys?

<details>
<summary>Answer</summary>

The last value wins

</details>

**A54.** Does the loop variable leak in Python 3?

<details>
<summary>Answer</summary>

No

</details>

**A55.** How do you filter entries?

<details>
<summary>Answer</summary>

Add `if condition` at the end

</details>

**A56.** How do you change values conditionally without filtering?

<details>
<summary>Answer</summary>

Use `a if cond else b` in the value expression

</details>

**A57.** Why sort unique labels before encoding?

<details>
<summary>Answer</summary>

To make the ID mapping deterministic

</details>

**A58.** Which data should define the label mapping?

<details>
<summary>Answer</summary>

The training data

</details>

**A59.** How do you handle unseen labels?

<details>
<summary>Answer</summary>

Raise, map to an unknown ID, or skip; decide explicitly

</details>

**A60.** Why avoid `dict.fromkeys(keys, [])`?

<details>
<summary>Answer</summary>

All keys share one list

</details>

#### From Q14: How Do `enumerate()` and `zip()` Work?

**A61.** What does `enumerate()` yield?

<details>
<summary>Answer</summary>

`(index, value)` tuples

</details>

**A62.** What is the default start?

<details>
<summary>Answer</summary>

`0`

</details>

**A63.** What does `zip()` yield?

<details>
<summary>Answer</summary>

Tuples of corresponding elements

</details>

**A64.** Do they return lists?

<details>
<summary>Answer</summary>

No; they return iterators

</details>

**A65.** Can you loop over the same `zip` object twice?

<details>
<summary>Answer</summary>

No; it is exhausted after one pass

</details>

**A66.** What happens with unequal lengths?

<details>
<summary>Answer</summary>

`zip()` stops at the shortest input

</details>

**A67.** How do you make unequal lengths an error?

<details>
<summary>Answer</summary>

`zip(..., strict=True)` in Python 3.10+

</details>

**A68.** When is the `strict` error raised?

<details>
<summary>Answer</summary>

When the iterator is consumed and the mismatch is reached

</details>

**A69.** How do you keep all items from the longest input?

<details>
<summary>Answer</summary>

`itertools.zip_longest()`

</details>

**A70.** How do you unzip a list of pairs?

<details>
<summary>Answer</summary>

`zip(*pairs)`

</details>

#### From Q15: What Is the Difference Between `*args` and `**kwargs`?

**A71.** What does `*args` collect?

<details>
<summary>Answer</summary>

Extra positional arguments

</details>

**A72.** What does `**kwargs` collect?

<details>
<summary>Answer</summary>

Extra keyword arguments

</details>

**A73.** What type is `args`?

<details>
<summary>Answer</summary>

`tuple`

</details>

**A74.** What type is `kwargs`?

<details>
<summary>Answer</summary>

`dict`

</details>

**A75.** What are they when nothing extra is passed?

<details>
<summary>Answer</summary>

`()` and `{}`

</details>

**A76.** What does `*` do in a call?

<details>
<summary>Answer</summary>

Unpacks an iterable into positional arguments

</details>

**A77.** What does `**` do in a call?

<details>
<summary>Answer</summary>

Unpacks a mapping into keyword arguments

</details>

**A78.** Must they be named `args` and `kwargs`?

<details>
<summary>Answer</summary>

No; only the stars matter

</details>

**A79.** Where must `**kwargs` appear?

<details>
<summary>Answer</summary>

Last in the parameter list

</details>

**A80.** What are parameters after `*args`?

<details>
<summary>Answer</summary>

Keyword-only parameters

</details>

#### From Q16: How Do You Merge Two Dictionaries in Python?

**A81.** Simplest way to merge into a new dict?

<details>
<summary>Answer</summary>

`first | second` (Python 3.9+)

</details>

**A82.** Alternative before Python 3.9?

<details>
<summary>Answer</summary>

`{**first, **second}`

</details>

**A83.** How do you merge in place?

<details>
<summary>Answer</summary>

`first.update(second)` or `first |= second`

</details>

**A84.** Which value wins on a key conflict?

<details>
<summary>Answer</summary>

The right-hand (later) one

</details>

**A85.** Where does an overlapping key appear in the result?

<details>
<summary>Answer</summary>

At its original position from the left dict

</details>

**A86.** What does `update()` return?

<details>
<summary>Answer</summary>

`None`

</details>

**A87.** Can `dict | list` work?

<details>
<summary>Answer</summary>

No; `|` needs two dicts, but `|=` accepts pairs

</details>

**A88.** Are nested dicts merged recursively?

<details>
<summary>Answer</summary>

No; the nested value is replaced

</details>

**A89.** Are nested values copied?

<details>
<summary>Answer</summary>

No; the merged dict shares them

</details>

**A90.** How does `ChainMap` differ?

<details>
<summary>Answer</summary>

It looks up layered dicts without copying, and the first mapping wins

</details>

#### From Q17: How Do You Handle Missing Keys in a Dictionary Safely?

**A91.** What does `d[key]` do for a missing key?

<details>
<summary>Answer</summary>

Raises `KeyError`

</details>

**A92.** What does `d.get(key)` return for a missing key?

<details>
<summary>Answer</summary>

`None`

</details>

**A93.** Does `get()` insert the default?

<details>
<summary>Answer</summary>

No

</details>

**A94.** Does `setdefault()` insert the default?

<details>
<summary>Answer</summary>

Yes, and it returns the value

</details>

**A95.** When is a `defaultdict` factory called?

<details>
<summary>Answer</summary>

When `d[key]` is used for a missing key

</details>

**A96.** Does `defaultdict.get()` call the factory?

<details>
<summary>Answer</summary>

No

</details>

**A97.** Does `get(key, 32)` replace a stored `None`?

<details>
<summary>Answer</summary>

No; the default is used only for missing keys

</details>

**A98.** Why avoid `d.get(key) or default`?

<details>
<summary>Answer</summary>

It also replaces `0`, `0.0`, `""`, and empty containers

</details>

**A99.** Best tool for counting labels?

<details>
<summary>Answer</summary>

`Counter` or `defaultdict(int)`

</details>

**A100.** How do you distinguish missing from `None`?

<details>
<summary>Answer</summary>

Use `in` or a sentinel object

</details>

### Part B: Interview Questions

#### Q8. What Is the Difference Between `append()` and `extend()`? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain adding one object versus adding the elements of an iterable.
- Show what happens when you add a list to another list.
- Know that both modify the original list and return `None`.

</details>

<details>
<summary>Model answer</summary>

> `append()` adds its argument to the end of a list as a single element, so appending `[3, 4]` to `[1, 2]` gives a nested list `[1, 2, [3, 4]]`. `extend()` iterates over its argument and adds each element separately, giving `[1, 2, 3, 4]`. Because `extend()` iterates, extending with a string adds individual characters, and passing a non-iterable like an integer raises `TypeError`. Both methods modify the list in place and return `None`, so writing `items = items.append(x)` is a bug. For comparison, `+=` on a list behaves like `extend()`, while `+` creates a new list.

</details>

#### Q9. How Do You Remove Duplicates From a List While Preserving Order? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Keep each value at the position where it first appears.
- Explain why `list(set(items))` doesn't guarantee that order.
- Recognize that dictionary keys and set elements must be hashable.

</details>

<details>
<summary>Model answer</summary>

> For hashable values, I use `list(dict.fromkeys(items))`, because dictionaries keep keys unique and preserve insertion order, so each value stays at its first position. An equivalent explicit version loops over the list and uses a `seen` set, which also lets me deduplicate by a field such as a user ID. Both run in O(n) expected time. I avoid `list(set(items))` when order matters, because sets do not guarantee any order. If the elements are unhashable, like lists, I convert each one to a tuple for the `seen` set, or fall back to an equality scan, which costs O(n²) comparisons.

</details>

#### Q10. How Does List Slicing Work, Including Negative Indices? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain `start`, `stop`, and `step`.
- Know that the stop index is excluded.
- Explain negative indices and reverse slicing.
- Know that list slicing creates a new, shallow list.

</details>

<details>
<summary>Model answer</summary>

> List slicing uses `items[start:stop:step]`, where `start` is included, `stop` is excluded, and `step` controls the direction and spacing. Negative indices count from the end, so `-1` is the last element and `items[-3:]` returns the last three elements. A negative step slices backward, which is why `items[::-1]` returns a reversed copy. Slice boundaries that are out of range are clamped, but indexing a single missing position raises `IndexError`. Finally, slicing a list creates a new, shallow list: the outer list is new, but nested objects are still shared with the original.

</details>

#### Q11. What Is the Difference Between `sorted()` and `.sort()`? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish creating a new list from modifying an existing one.
- Know what each one returns.
- Understand `key`, `reverse`, and stable sorting.

</details>

<details>
<summary>Model answer</summary>

> `sorted()` is a built-in function that accepts any iterable and returns a new sorted list, so the original data stays unchanged. `list.sort()` is a list method that sorts the list in place and returns `None`, which is why `numbers = numbers.sort()` is a common bug. Both accept a `key` function, called once per element, and a `reverse` flag. Both are stable, so items with equal keys keep their original order, which allows multi-pass sorting by several criteria. I use `sorted()` when I need to keep the original or when the input isn't a list, and `.sort()` when I own a list and want to avoid creating a copy.

</details>

#### Q12. How Does a Dictionary Work Internally? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain hash tables, hashing, and collisions.
- Know why keys must be hashable.
- Explain the average lookup complexity.
- Distinguish insertion order from sorted order.

</details>

<details>
<summary>Model answer</summary>

> A Python dictionary is a hash table. When I look up or insert a key, Python computes its hash, uses it to choose a candidate slot, and then checks that the stored key is actually equal to mine; if different keys collide, CPython probes other slots using open addressing. That makes lookup, insertion, and deletion O(1) on average, but O(n) in the worst case if many keys collide. Keys must be hashable, meaning their hash never changes and equal keys have equal hashes, which is why lists can't be keys but tuples of hashable values can. Since Python 3.7, dictionaries preserve insertion order, but that is not sorted order. Also, the same hash doesn't mean the same key, because equality is always checked.

</details>

#### Q13. What Are Dictionary Comprehensions? Give a Practical ML Example. 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Understand the comprehension syntax.
- Build a dictionary from an iterable.
- Use an optional condition to filter entries.
- Apply it to a practical data or ML task.

</details>

<details>
<summary>Model answer</summary>

> A dictionary comprehension builds a new dictionary in one expression using the form `{key: value for item in iterable if condition}`, where the `if` part is optional and filters items. It is a concise replacement for a loop that assigns `d[key] = value`, and duplicate keys simply keep the last value. A practical ML example is label encoding: I take the sorted unique training labels and write `{label: index for index, label in enumerate(unique_labels)}` to map each class to an integer ID. I build that mapping from the training data only, reuse it for validation and inference, and decide explicitly how to handle unseen labels. I also use comprehensions to filter models above a score threshold or to transform metric values, but I switch to a regular loop when the logic gets complex.

</details>

#### Q14. How Do `enumerate()` and `zip()` Work? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Use `enumerate()` to get an index and a value.
- Use `zip()` to combine corresponding elements.
- Know that both return iterators.
- Understand what happens when the inputs have different lengths.

</details>

<details>
<summary>Model answer</summary>

> `enumerate()` wraps an iterable and yields `(index, value)` tuples, so I can loop with a counter instead of using `range(len(...))`, and its `start` argument changes the first number. `zip()` takes several iterables and yields tuples of their corresponding elements, which is useful for parallel lists like feature names and importance scores, or for `dict(zip(keys, values))`. Both return lazy iterators, so they use little memory but can be consumed only once. By default `zip()` stops at the shortest input and silently drops extra items, which can hide data misalignment. In Python 3.10+ I use `strict=True` to raise a `ValueError` on mismatched lengths, or `itertools.zip_longest()` when I want to pad the shorter input.

</details>

#### Q15. What Is the Difference Between `*args` and `**kwargs`? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish positional arguments from keyword arguments.
- Know that `args` becomes a tuple and `kwargs` becomes a dictionary.
- Explain collecting arguments versus unpacking them.
- Know that the names `args` and `kwargs` are only conventions.

</details>

<details>
<summary>Model answer</summary>

> In a function definition, `*args` collects any extra positional arguments into a tuple, and `**kwargs` collects any extra keyword arguments into a dictionary, so a function can accept a flexible number of inputs. In a function call, the same symbols work in reverse: `*` unpacks an iterable into positional arguments and `**` unpacks a dictionary into keyword arguments, which is handy for passing a hyperparameter config with `train(**config)`. Combining both lets wrappers and decorators forward arguments with `func(*args, **kwargs)`. Parameters placed after `*args` become keyword-only, and `**kwargs` must come last. The names `args` and `kwargs` are only conventions; the stars are what matter.

</details>

#### Q16. How Do You Merge Two Dictionaries in Python? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Show several ways to merge dictionaries.
- Explain which value wins when keys overlap.
- Distinguish creating a new dictionary from updating an existing one.
- Know that ordinary merging is shallow.

</details>

<details>
<summary>Model answer</summary>

> In Python 3.9 and later, I merge two dictionaries with `first | second`, which returns a new dictionary; before 3.9, `{**first, **second}` does the same. When keys overlap, the right-hand value wins, so I put defaults on the left and overrides on the right, for example `config = defaults | overrides`. If I want to modify an existing dictionary instead, I use `first.update(second)` or `first |= second`, keeping in mind that `update()` returns `None` and that the change is visible through every reference to that dictionary. All of these merges are shallow: a nested dictionary under the same key is replaced entirely, and nested values are shared rather than copied. When I need nested configs combined, I write a recursive merge or use a config library.

</details>

#### Q17. How Do You Handle Missing Keys in a Dictionary Safely? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Know when direct indexing raises `KeyError`.
- Choose between `get()`, membership checks, and `try/except`.
- Explain when `setdefault()` and `defaultdict` are useful.
- Distinguish a missing key from a key whose value is `None`.

</details>

<details>
<summary>Model answer</summary>

> The right approach depends on what a missing key means. For optional values, I use `get()` with a default, which doesn't insert anything. For required values, I index directly and handle `KeyError`, often converting it into a clearer error. When I'm building a dictionary, such as grouping files by label or counting classes, I use `setdefault()` or `defaultdict`, which insert defaults for missing keys. I keep in mind that `defaultdict` inserts a key even when I only read it. Finally, a missing key is different from a key whose value is `None`, so `get()` doesn't replace a stored `None`, and I avoid `or` because it also overrides valid falsy values like `0.0`.

</details>

---

## OOP

Covers: Q18; Q19; Q20; Q21; Q22; Q23.

### Part A: Rapid-Fire

#### From Q18: What Is `__init__` in a Python Class?

**A1.** When is `__init__` called?

<details>
<summary>Answer</summary>

Automatically, after the instance is created

</details>

**A2.** What is `self`?

<details>
<summary>Answer</summary>

The instance being initialized

</details>

**A3.** Is `self` a keyword?

<details>
<summary>Answer</summary>

No; it is a convention for the first parameter

</details>

**A4.** Which method creates the instance?

<details>
<summary>Answer</summary>

`__new__`

</details>

**A5.** What must `__init__` return?

<details>
<summary>Answer</summary>

`None`

</details>

**A6.** When is `__init__` skipped?

<details>
<summary>Answer</summary>

When `__new__` returns an object that isn't an instance of the class

</details>

**A7.** Where should a per-instance list be created?

<details>
<summary>Answer</summary>

Inside `__init__`

</details>

**A8.** Is a dict in the class body shared?

<details>
<summary>Answer</summary>

Yes

</details>

**A9.** Is the parent `__init__` called automatically?

<details>
<summary>Answer</summary>

Only if the subclass doesn't define its own `__init__`

</details>

#### From Q19: What Is the Difference Between Instance, Class, and Static Methods?

**A10.** What does an instance method receive first?

<details>
<summary>Answer</summary>

The instance, `self`

</details>

**A11.** What does a class method receive first?

<details>
<summary>Answer</summary>

The class it was called on, `cls`

</details>

**A12.** What does a static method receive first?

<details>
<summary>Answer</summary>

Nothing extra

</details>

**A13.** Can you call a class method on an instance?

<details>
<summary>Answer</summary>

Yes; it still receives the class

</details>

**A14.** What is a typical class method?

<details>
<summary>Answer</summary>

An alternative constructor such as `from_dict()`

</details>

**A15.** Why use `cls(...)` instead of the class name?

<details>
<summary>Answer</summary>

Subclasses then get instances of themselves

</details>

**A16.** Can a static method access instance data?

<details>
<summary>Answer</summary>

Only through objects passed explicitly

</details>

**A17.** What happens if you forget `@staticmethod`?

<details>
<summary>Answer</summary>

Calls through an instance pass an extra argument

</details>

**A18.** Does `self.count += 1` update a class attribute?

<details>
<summary>Answer</summary>

No; it creates an instance attribute

</details>

#### From Q20: Explain Inheritance, Method Overriding, and `super()`

**A19.** What is inheritance?

<details>
<summary>Answer</summary>

A subclass reusing a base class's attributes and methods

</details>

**A20.** What is overriding?

<details>
<summary>Answer</summary>

Defining a method with the same name in the subclass

</details>

**A21.** Which version runs for a subclass instance?

<details>
<summary>Answer</summary>

The first one found in the MRO, usually the subclass's

</details>

**A22.** What does `super()` return?

<details>
<summary>Answer</summary>

A proxy that finds the next implementation in the MRO

</details>

**A23.** Is the parent `__init__` called automatically?

<details>
<summary>Answer</summary>

Not if the subclass defines its own `__init__`

</details>

**A24.** Does Python check override signatures?

<details>
<summary>Answer</summary>

No; matching is by name only

</details>

**A25.** `isinstance()` vs `type() is`?

<details>
<summary>Answer</summary>

`isinstance()` accepts subclasses

</details>

**A26.** Why prefer `super()` over `Model.method(self)`?

<details>
<summary>Answer</summary>

It follows the MRO and supports cooperative inheritance

</details>

**A27.** What is the root of every class?

<details>
<summary>Answer</summary>

`object`

</details>

#### From Q21: What Is Multiple Inheritance and MRO?

**A28.** What is multiple inheritance?

<details>
<summary>Answer</summary>

A class with more than one direct base class

</details>

**A29.** What is the MRO?

<details>
<summary>Answer</summary>

The order Python searches classes for attributes

</details>

**A30.** Which algorithm builds it?

<details>
<summary>Answer</summary>

C3 linearization

</details>

**A31.** How do you inspect it?

<details>
<summary>Answer</summary>

`Cls.__mro__` or `Cls.mro()`

</details>

**A32.** What is the diamond problem?

<details>
<summary>Answer</summary>

Two bases share an ancestor, risking duplicate or ambiguous calls

</details>

**A33.** How does Python solve it?

<details>
<summary>Answer</summary>

The ancestor appears once in the MRO, and cooperative `super()` visits each class once

</details>

**A34.** Does `super()` always mean the direct parent?

<details>
<summary>Answer</summary>

No; it means the next class in `type(self)`'s MRO

</details>

**A35.** Why use `**kwargs` in cooperative `__init__`?

<details>
<summary>Answer</summary>

Each class takes its arguments and forwards the rest

</details>

**A36.** When does Python raise `TypeError`?

<details>
<summary>Answer</summary>

When no consistent MRO exists

</details>

**A37.** Where should mixins go in the base list?

<details>
<summary>Answer</summary>

Usually before the main base class

</details>

#### From Q22: What Are Dunder/Magic Methods? Give Examples Such as `__str__`, `__len__`, and `__call__`

**A38.** What is a dunder method?

<details>
<summary>Answer</summary>

A special method named `__name__` that Python calls for built-in operations

</details>

**A39.** What calls `__str__`?

<details>
<summary>Answer</summary>

`str()`, `print()`, and f-strings

</details>

**A40.** What calls `__repr__`?

<details>
<summary>Answer</summary>

`repr()`, the REPL, `!r`, and containers

</details>

**A41.** If only `__repr__` exists, what does `print()` show?

<details>
<summary>Answer</summary>

The `__repr__` result

</details>

**A42.** What must `__len__` return?

<details>
<summary>Answer</summary>

A non-negative `int`

</details>

**A43.** What does `__call__` enable?

<details>
<summary>Answer</summary>

Calling an instance like `obj(...)`

</details>

**A44.** Should you call `obj.__len__()` directly?

<details>
<summary>Answer</summary>

No; use `len(obj)`

</details>

**A45.** Does attaching `__len__` to an instance work?

<details>
<summary>Answer</summary>

No; implicit lookup uses the class

</details>

**A46.** What should an operator return for unsupported types?

<details>
<summary>Answer</summary>

`NotImplemented`

</details>

**A47.** What does defining `__eq__` do to `__hash__`?

<details>
<summary>Answer</summary>

Sets it to `None` unless you define `__hash__`

</details>

#### From Q23: What Are Dataclasses, and Why Are They Useful?

**A48.** What does `@dataclass` generate by default?

<details>
<summary>Answer</summary>

`__init__`, `__repr__`, and `__eq__`

</details>

**A49.** How do you add `<` and `>`?

<details>
<summary>Answer</summary>

`@dataclass(order=True)`

</details>

**A50.** Why `field(default_factory=list)`?

<details>
<summary>Answer</summary>

Each instance gets its own list

</details>

**A51.** What happens with `features: list = []`?

<details>
<summary>Answer</summary>

`ValueError` at class definition

</details>

**A52.** Are type annotations enforced?

<details>
<summary>Answer</summary>

No

</details>

**A53.** Where do you validate values?

<details>
<summary>Answer</summary>

`__post_init__`

</details>

**A54.** What does `frozen=True` raise on assignment?

<details>
<summary>Answer</summary>

`FrozenInstanceError`

</details>

**A55.** Is a frozen dataclass deeply immutable?

<details>
<summary>Answer</summary>

No; mutable field values can still change

</details>

**A56.** Is a default dataclass hashable?

<details>
<summary>Answer</summary>

No; `eq=True` without `frozen` sets `__hash__` to `None`

</details>

**A57.** Which version added `slots=` and `kw_only=`?

<details>
<summary>Answer</summary>

Python 3.10

</details>

### Part B: Interview Questions

#### Q18. What Is `__init__` in a Python Class? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain instance initialization and the role of `self`.
- Distinguish initialization (`__init__`) from instance creation (`__new__`).
- Know that `__init__` must return `None`.
- Initialize attributes separately for each instance.

</details>

<details>
<summary>Model answer</summary>

> `__init__` is the initializer that Python calls automatically after a new instance is created. Its first parameter, `self`, is that new instance, and assigning `self.attribute` stores state on it. Strictly speaking, `__new__` creates the object and `__init__` only sets it up, which is why `__new__` is needed for subclasses of immutable types like `float`. `__init__` must return `None`; returning anything else raises a `TypeError`. I create mutable attributes like lists and dictionaries inside `__init__` so each instance gets its own, rather than sharing a class attribute or a mutable default argument.

</details>

#### Q19. What Is the Difference Between Instance, Class, and Static Methods? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain `self`, `cls`, and methods with no implicit first argument.
- Use `@classmethod` and `@staticmethod` correctly.
- Use instance methods for instance behavior and class methods for alternative constructors.
- Understand how class methods support subclasses.

</details>

<details>
<summary>Model answer</summary>

> The three method types differ in what Python passes automatically. An instance method receives `self`, so it works with one object's state, like `describe()` or `predict()`. A class method, marked with `@classmethod`, receives `cls`, the class it was called on, which makes it ideal for alternative constructors like `from_dict()`. Because it calls `cls(...)` rather than hardcoding the class name, a subclass calling it gets an instance of the subclass. A static method, marked with `@staticmethod`, receives nothing implicitly and is just a related utility, like a validation helper. I choose based on whether the method needs the instance, the class, or neither.

</details>

#### Q20. Explain Inheritance, Method Overriding, and `super()` 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain reusing and extending behavior through inheritance.
- Show a subclass overriding a parent method.
- Use `super()` to build on inherited behavior.
- Know that `super()` follows the MRO rather than always meaning one fixed parent.

</details>

<details>
<summary>Model answer</summary>

> Inheritance lets a subclass reuse a base class's behavior, so a `Classifier` that inherits from `Model` automatically gets its methods. Overriding means the subclass defines a method with the same name, and because Python searches the MRO starting from the subclass, that version runs, even when base-class code calls it through `self`. `super()` lets the override extend the inherited behavior, such as calling `super().__init__(name)` and then adding new attributes. Python doesn't call the parent `__init__` automatically when a subclass defines its own, so forgetting `super().__init__()` is a common bug. Finally, `super()` means the next class in the MRO, not a fixed parent, which matters with multiple inheritance and mixins.

</details>

#### Q21. What Is Multiple Inheritance and MRO? 🔴

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain a class that inherits from more than one base class.
- Describe the method resolution order (MRO).
- Understand the diamond inheritance problem and cooperative `super()` calls.
- Know how to inspect the MRO and recognize hierarchies that can't produce one.

</details>

<details>
<summary>Model answer</summary>

> Multiple inheritance means a class has more than one base class, which in practice is mostly used for small mixins like logging or serialization. Python resolves attribute lookups using the method resolution order, computed with C3 linearization: a class comes before its bases, bases keep their listed order, and each class appears exactly once. I can inspect it with `__mro__` or `mro()`. In a diamond, like `D(B, C)` where both inherit from `A`, the MRO is `D, B, C, A, object`, and if every class calls `super()`, each method runs once, with `B`'s `super()` actually reaching `C`. Cooperative methods need compatible signatures, often using `**kwargs`. If the bases impose contradictory orders, Python refuses to create the class and raises a `TypeError`.

</details>

#### Q22. What Are Dunder/Magic Methods? Give Examples Such as `__str__`, `__len__`, and `__call__` 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain special methods with double underscores.
- Connect them to built-in operations and Python protocols.
- Implement `__str__`, `__len__`, and `__call__` correctly.
- Distinguish readable output (`__str__`) from the developer-oriented representation (`__repr__`).

</details>

<details>
<summary>Model answer</summary>

> Dunder methods are special methods named with double underscores on both sides, like `__init__`, `__str__`, and `__len__`. They are how Python's built-in operations hook into my classes: `len(obj)` calls `__len__`, `print(obj)` calls `__str__`, and `obj(...)` calls `__call__`. Together they form protocols, so defining `__getitem__` or `__iter__` makes an object indexable or iterable without inheriting from any particular class. `__str__` should be readable for users, while `__repr__` should be unambiguous for developers, and `str()` falls back to `__repr__` if `__str__` is missing. Each method has a contract, for example `__len__` must return a non-negative integer. I call the built-in operations rather than the dunder methods directly.

</details>

#### Q23. What Are Dataclasses, and Why Are They Useful? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain that dataclasses reduce boilerplate for classes that mainly store data.
- Name the generated methods, such as `__init__`, `__repr__`, and `__eq__`.
- Use `field(default_factory=...)` for mutable defaults that each instance gets separately.
- Know that type hints aren't runtime validation, and that `frozen=True` isn't deep immutability.

</details>

<details>
<summary>Model answer</summary>

> A dataclass is a class decorated with `@dataclass`, which reads the annotated fields and generates `__init__`, `__repr__`, and `__eq__` for me, with optional ordering through `order=True`. That makes data containers like model configs or experiment results much shorter and less error-prone, because each field is declared once. For mutable defaults I use `field(default_factory=list)`, so each instance gets its own list, and plain mutable defaults are rejected anyway. The annotations aren't enforced at runtime, so I put value checks in `__post_init__`, or use a library like Pydantic for full validation. `frozen=True` prevents field reassignment and makes instances hashable, but it isn't deep immutability, since a list inside a field can still change.

</details>

---

## Functions, Decorators and Generators

Covers: Q24; Q25; Q26; Q27; Q28; Q29; Q30; Q31.

### Part A: Rapid-Fire

#### From Q24: What Is a Lambda Function, and When Should You Avoid It?

**A1.** What is a lambda?

<details>
<summary>Answer</summary>

An anonymous function defined by one expression

</details>

**A2.** What does it return?

<details>
<summary>Answer</summary>

The value of its expression

</details>

**A3.** What is its `__name__`?

<details>
<summary>Answer</summary>

`<lambda>`

</details>

**A4.** Can it have default arguments?

<details>
<summary>Answer</summary>

Yes, plus `*args` and `**kwargs`

</details>

**A5.** Can it contain `if`?

<details>
<summary>Answer</summary>

Only a conditional expression, not an `if` statement

</details>

**A6.** Can it raise or catch exceptions?

<details>
<summary>Answer</summary>

It cannot contain `raise` or `try`

</details>

**A7.** Most common use?

<details>
<summary>Answer</summary>

Sorting keys and short callbacks

</details>

**A8.** Should you write `f = lambda x: ...`?

<details>
<summary>Answer</summary>

No; PEP 8 recommends `def`

</details>

**A9.** Is it faster than `def`?

<details>
<summary>Answer</summary>

No

</details>

**A10.** Can it capture outer variables?

<details>
<summary>Answer</summary>

Yes, like any nested function, including late binding

</details>

#### From Q25: What Are Closures in Python?

**A11.** What is a closure?

<details>
<summary>Answer</summary>

A function that keeps access to variables from its enclosing function

</details>

**A12.** Which LEGB scope does it use?

<details>
<summary>Answer</summary>

Enclosing

</details>

**A13.** Where are captured values stored?

<details>
<summary>Answer</summary>

In cell objects in `function.__closure__`

</details>

**A14.** What is `__closure__` for a non-closure?

<details>
<summary>Answer</summary>

`None`

</details>

**A15.** Does a closure copy the value?

<details>
<summary>Answer</summary>

No; it refers to the variable and sees later changes

</details>

**A16.** When is `nonlocal` needed?

<details>
<summary>Answer</summary>

To reassign an enclosing function's variable

</details>

**A17.** What happens without it?

<details>
<summary>Answer</summary>

`UnboundLocalError` when the name is read before assignment

</details>

**A18.** Is `nonlocal` needed for `list.append()`?

<details>
<summary>Answer</summary>

No; that is mutation, not rebinding

</details>

**A19.** Why does `[lambda: n for n in range(3)]` give `[2, 2, 2]`?

<details>
<summary>Answer</summary>

Late binding: `n` is looked up at call time

</details>

**A20.** How do you fix late binding?

<details>
<summary>Answer</summary>

Default argument, factory function, or `functools.partial`

</details>

#### From Q26: What Is a Decorator, and How Do You Write One?

**A21.** What is a decorator?

<details>
<summary>Answer</summary>

A callable that takes a function or class and returns its replacement

</details>

**A22.** What does `@log_call` mean?

<details>
<summary>Answer</summary>

Roughly `add = log_call(add)`

</details>

**A23.** When does the decorator run?

<details>
<summary>Answer</summary>

Once, when the decorated definition executes

</details>

**A24.** When does the wrapper run?

<details>
<summary>Answer</summary>

On every call to the decorated function

</details>

**A25.** Why `*args, **kwargs`?

<details>
<summary>Answer</summary>

To accept and forward any arguments

</details>

**A26.** What if the wrapper doesn't return?

<details>
<summary>Answer</summary>

Callers get `None`

</details>

**A27.** What does `@wraps` do?

<details>
<summary>Answer</summary>

Copies metadata and sets `__wrapped__`

</details>

**A28.** Order of stacked decorators?

<details>
<summary>Answer</summary>

Applied bottom-up; the top wrapper runs first

</details>

**A29.** How do decorator arguments work?

<details>
<summary>Answer</summary>

A factory returns the actual decorator

</details>

**A30.** Common uses?

<details>
<summary>Answer</summary>

Logging, timing, caching, auth checks, retries

</details>

#### From Q27: What Is the Difference Between a Function Decorator and a Class Decorator?

**A31.** What does a function decorator receive?

<details>
<summary>Answer</summary>

A function

</details>

**A32.** What does a class decorator receive?

<details>
<summary>Answer</summary>

A class

</details>

**A33.** What does a class decorator usually return?

<details>
<summary>Answer</summary>

The same class, modified or registered

</details>

**A34.** When is either applied?

<details>
<summary>Answer</summary>

When the decorated definition executes

</details>

**A35.** Does a class decorator run per instance?

<details>
<summary>Answer</summary>

No; once per class definition

</details>

**A36.** Can a decorator be implemented as a class?

<details>
<summary>Answer</summary>

Yes, using `__init__` and `__call__`

</details>

**A37.** Why can a class-based decorator break methods?

<details>
<summary>Answer</summary>

Without `__get__`, `self` is not passed

</details>

**A38.** Built-in class decorator examples?

<details>
<summary>Answer</summary>

`@dataclass`, `@functools.total_ordering`

</details>

**A39.** Built-in function decorator examples?

<details>
<summary>Answer</summary>

`@lru_cache`, `@property`, `@staticmethod`

</details>

**A40.** Alternative for registering all subclasses?

<details>
<summary>Answer</summary>

`__init_subclass__`

</details>

#### From Q28: What Is the Difference Between an Iterable and an Iterator?

**A41.** What is an iterable?

<details>
<summary>Answer</summary>

An object `iter()` can get an iterator from

</details>

**A42.** What is an iterator?

<details>
<summary>Answer</summary>

An object with `__next__()` whose `__iter__()` returns itself

</details>

**A43.** What signals the end?

<details>
<summary>Answer</summary>

`StopIteration`

</details>

**A44.** Is a list an iterator?

<details>
<summary>Answer</summary>

No; it is an iterable

</details>

**A45.** Is a generator an iterator?

<details>
<summary>Answer</summary>

Yes, and also an iterable

</details>

**A46.** What does `iter(iterator)` return?

<details>
<summary>Answer</summary>

The same iterator

</details>

**A47.** Can you loop over a list twice?

<details>
<summary>Answer</summary>

Yes; each loop gets a new iterator

</details>

**A48.** Can you loop over a generator twice?

<details>
<summary>Answer</summary>

No; the second loop gets nothing

</details>

**A49.** How do you avoid catching `StopIteration`?

<details>
<summary>Answer</summary>

`next(iterator, default)`

</details>

**A50.** How should a reusable custom iterable work?

<details>
<summary>Answer</summary>

`__iter__()` returns a new iterator, for example a generator

</details>

#### From Q29: What Is a Generator, and How Does `yield` Work?

**A51.** What makes a function a generator function?

<details>
<summary>Answer</summary>

`yield` in its body

</details>

**A52.** What does calling it return?

<details>
<summary>Answer</summary>

A generator object (an iterator)

</details>

**A53.** When does the body start running?

<details>
<summary>Answer</summary>

On the first `next()`

</details>

**A54.** What does `yield` do?

<details>
<summary>Answer</summary>

Produces a value and pauses the function

</details>

**A55.** What happens on the next `next()`?

<details>
<summary>Answer</summary>

Execution resumes right after the `yield`

</details>

**A56.** Are local variables kept?

<details>
<summary>Answer</summary>

Yes, between yields

</details>

**A57.** What happens when the body ends?

<details>
<summary>Answer</summary>

`StopIteration` is raised

</details>

**A58.** Can a generator be restarted?

<details>
<summary>Answer</summary>

No; call the function again

</details>

**A59.** What is a generator expression?

<details>
<summary>Answer</summary>

`(expr for x in iterable)`

</details>

**A60.** What does `yield from` do?

<details>
<summary>Answer</summary>

Yields every value from another iterable

</details>

#### From Q30: When Would You Use a Generator Instead of a List?

**A61.** When to use a generator?

<details>
<summary>Answer</summary>

Large, streaming, or single-pass data; pipelines; early stopping

</details>

**A62.** When to use a list?

<details>
<summary>Answer</summary>

Indexing, `len()`, sorting, or several passes

</details>

**A63.** What does a generator store?

<details>
<summary>Answer</summary>

Its current state, not all results

</details>

**A64.** Does a generator reduce input memory?

<details>
<summary>Answer</summary>

No; an existing input list stays in memory

</details>

**A65.** Does `any()` with a generator stop early?

<details>
<summary>Answer</summary>

Yes, at the first true value

</details>

**A66.** Can you index a generator?

<details>
<summary>Answer</summary>

No; `TypeError`

</details>

**A67.** Can you call `len()` on a generator?

<details>
<summary>Answer</summary>

No; `TypeError`

</details>

**A68.** What does `list(generator)` do?

<details>
<summary>Answer</summary>

Materializes all remaining values

</details>

**A69.** Is a generator always faster?

<details>
<summary>Answer</summary>

No; it mainly saves memory and skipped work

</details>

**A70.** How do you read a huge file lazily?

<details>
<summary>Answer</summary>

Iterate over the file object, not `readlines()`

</details>

#### From Q31: What Is the Difference Between `return` and `yield`?

**A71.** What does `return` do?

<details>
<summary>Answer</summary>

Ends the call and sends one result to the caller

</details>

**A72.** What does `yield` do?

<details>
<summary>Answer</summary>

Produces a value and pauses the generator

</details>

**A73.** What does calling a generator function return?

<details>
<summary>Answer</summary>

A generator object; the body has not started

</details>

**A74.** When does the generator body run?

<details>
<summary>Answer</summary>

When values are requested with `next()` or iteration

</details>

**A75.** Are local variables kept between `yield`s?

<details>
<summary>Answer</summary>

Yes

</details>

**A76.** What does `return value` do in a generator?

<details>
<summary>Answer</summary>

Ends iteration; `value` goes into `StopIteration.value`

</details>

**A77.** Does a `for` loop see that return value?

<details>
<summary>Answer</summary>

No

</details>

**A78.** How do you capture it?

<details>
<summary>Answer</summary>

`result = yield from inner()`

</details>

**A79.** Can a generator be iterated twice?

<details>
<summary>Answer</summary>

No; create a new one or store the values

</details>

**A80.** What does `yield from [1, 2]` produce?

<details>
<summary>Answer</summary>

`1` and `2` as separate items

</details>

### Part B: Interview Questions

#### Q24. What Is a Lambda Function, and When Should You Avoid It? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain that a lambda creates an anonymous function from a single expression.
- Show a practical use, such as a sorting key.
- Use a named function when the logic gets complex or needs documentation.
- Know that lambdas can capture surrounding variables, just like ordinary functions.

</details>

<details>
<summary>Model answer</summary>

> A lambda is an anonymous function defined by a single expression, and the value of that expression is returned automatically. It creates an ordinary function object, the same type that `def` creates, but its name is always `<lambda>` and it cannot contain statements, a docstring, or annotations. I use lambdas for short one-off callbacks, such as `sorted(models, key=lambda m: m["accuracy"])`. I avoid them when the logic needs several steps, validation, exception handling, documentation, or reuse, and I don't assign a lambda to a name because a `def` gives a clearer traceback. Lambdas capture surrounding variables just like nested functions, including the late-binding behavior in loops. They are not faster than `def`; the choice is about readability.

</details>

#### Q25. What Are Closures in Python? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain how a nested function keeps access to variables from an enclosing function.
- Know that the captured variables stay accessible after the outer function returns.
- Explain `nonlocal` for rebinding an enclosing variable.
- Recognize late binding in functions created inside loops.

</details>

<details>
<summary>Model answer</summary>

> A closure is a nested function that keeps access to variables from its enclosing function's scope, even after the outer function has returned. Python keeps those variables alive in cell objects attached to the inner function, which you can see through `__closure__`. For example, `make_multiplier(3)` returns a function that still knows `factor` is 3. A closure only reads captured variables by default; to reassign one, such as a counter, you declare it `nonlocal`, although mutating a captured list doesn't need that. Closures capture variables, not values, so functions created in a loop all see the loop variable's final value; I fix that with a default argument, a factory function, or `functools.partial`. Closures are the mechanism behind decorators, callbacks, and small configured functions such as a scaler that remembers training statistics.

</details>

#### Q26. What Is a Decorator, and How Do You Write One? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain changing or extending behavior without editing the decorated function's body.
- Understand that `@decorator` applies a callable to a function or class.
- Pass arguments through and return the original result correctly.
- Use `functools.wraps` when writing function wrappers.

</details>

<details>
<summary>Model answer</summary>

> A decorator is a callable that takes a function or class and returns the object that replaces it, so `@log_call` above `def add` is roughly `add = log_call(add)`. Typically it defines an inner wrapper that runs extra code before or after calling the original function, which lets me add logging, timing, caching, or retries without editing the function's body. The wrapper should accept `*args` and `**kwargs`, forward them, and return the original result, otherwise callers silently get `None`. I always apply `functools.wraps` so the decorated function keeps its name, docstring, and a `__wrapped__` reference. The decorator itself runs once at definition time, while the wrapper runs on every call. If the decorator needs arguments, like `@retry(attempts=3)`, I add an outer factory that returns the real decorator.

</details>

#### Q27. What Is the Difference Between a Function Decorator and a Class Decorator? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish decorating a function from decorating a class.
- Understand that either kind of decorator can itself be written as a function or a class.
- Explain when decoration happens.
- Give examples such as function logging and class registration.

</details>

<details>
<summary>Model answer</summary>

> The difference is the target. A function decorator receives a function and usually returns a wrapper that adds behavior to every call, such as logging, caching, or validation. A class decorator receives a class and usually returns the same class after modifying or registering it, as `@dataclass` does when it generates `__init__` and `__repr__`. Both are applied once, when the `def` or `class` statement runs, so a registration decorator runs at import time, not each time an instance is created. Either kind can itself be implemented as a function or as a class with `__call__`, so a "class-based decorator" might still decorate a function. One pitfall is that a class-based decorator used on methods needs `__get__`, otherwise `self` isn't passed.

</details>

#### Q28. What Is the Difference Between an Iterable and an Iterator? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish the object you iterate over from the object that tracks progress.
- Explain `iter()`, `next()`, and `StopIteration`.
- Know that iterators are themselves iterable.
- Understand that many containers can be iterated again from the start, while an exhausted iterator stays exhausted.

</details>

<details>
<summary>Model answer</summary>

> An iterable is anything I can get an iterator from with `iter()`, such as a list, string, dict, or range. An iterator is the object that actually produces values and remembers the position: `next()` returns the next value, and it raises `StopIteration` when it's finished. Iterators are iterable too, because their `__iter__()` returns themselves, which is why a `for` loop accepts both. A `for` loop just calls `iter()` once and then `next()` until `StopIteration`. The practical difference is reuse: a list gives a fresh iterator each time, but a generator, `map`, `zip`, or file object is consumed, so a second pass silently gets nothing. When I write a reusable iterable class, I make `__iter__()` return a new iterator, usually by writing it as a generator.

</details>

#### Q29. What Is a Generator, and How Does `yield` Work? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain generators as iterators that produce values lazily.
- Know that calling a generator function returns a generator without running its body.
- Explain how execution pauses and resumes at `yield`.
- Understand exhaustion and how local state is kept between values.

</details>

<details>
<summary>Model answer</summary>

> A generator function is any function that contains `yield`. Calling it doesn't execute the body; it returns a generator object, which is an iterator. Each `next()` runs the body until the next `yield`, hands out that value, and pauses with all its local variables and its position preserved, so the following `next()` resumes right after that `yield`. When the body finishes, the generator raises `StopIteration`, and from then on it stays exhausted. That makes generators a lazy way to produce sequences, including infinite ones, without building a full list. One thing I watch for is that argument validation inside a generator is also delayed until the first `next()`. Generator expressions such as `(x ** 2 for x in data)` give the same behavior in a compact form.

</details>

#### Q30. When Would You Use a Generator Instead of a List? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Choose generators for streaming, large inputs, and single-pass processing.
- Explain the smaller intermediate storage and delayed computation.
- Recognize when a list is the better fit.
- Avoid claiming that generators always make code faster.

</details>

<details>
<summary>Model answer</summary>

> I use a generator when data can be processed one item at a time: reading a large file line by line, streaming records, producing training batches, or chaining preprocessing steps into a pipeline. The generator holds only its current state, so intermediate results don't pile up in memory, and because values are computed on demand, consumers like `any()` or a loop with `break` can stop early and skip the rest of the work. I use a list when I need indexing, `len()`, sorting, or more than one pass over the data, because a generator can only be consumed once. I also keep in mind that calling `list()` on a generator materializes everything, and that a generator doesn't shrink an input list that already exists. Generators save memory and unnecessary computation, but they aren't automatically faster, so for small data a list comprehension is often just as good.

</details>

#### Q31. What Is the Difference Between `return` and `yield`? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain ending a function versus pausing a generator.
- Know what calling an ordinary function and a generator function returns.
- Understand what `return` does inside a generator.
- Distinguish yielding one list from yielding each element of a list.

</details>

<details>
<summary>Model answer</summary>

> `return` ends a function call and sends one result back to the caller, discarding the function's local state. `yield` turns the function into a generator function: calling it returns a generator object without running the body, and each `next()` runs until the next `yield`, hands out a value, and pauses with its local state intact. That makes generators useful for producing large or streaming sequences one value at a time. Inside a generator, `return` ends the iteration, and any return value is carried on `StopIteration.value`, which a `for` loop ignores but `yield from` can capture. Finally, `yield some_list` produces the list as one item, while `yield from some_list` produces each element separately.

</details>

---

## Exceptions and Context Managers

Covers: Q32; Q33; Q34; Q35; Q36; Q37.

### Part A: Rapid-Fire

#### From Q32: How Do `try`, `except`, `else`, and `finally` Work?

**A1.** When does `except` run?

<details>
<summary>Answer</summary>

When a matching exception is raised in the `try` block

</details>

**A2.** When does `else` run?

<details>
<summary>Answer</summary>

When the `try` block completes without an exception, `return`, `break`, or `continue`

</details>

**A3.** When does `finally` run?

<details>
<summary>Answer</summary>

Whenever control leaves the statement, in almost all cases

</details>

**A4.** Are exceptions in `else` caught by the `except` above?

<details>
<summary>Answer</summary>

No

</details>

**A5.** Which handler wins if several match?

<details>
<summary>Answer</summary>

The first one, top to bottom

</details>

**A6.** Why avoid bare `except:`?

<details>
<summary>Answer</summary>

It also catches `KeyboardInterrupt` and `SystemExit`

</details>

**A7.** What does `return` in `finally` do?

<details>
<summary>Answer</summary>

Replaces the return value or swallows a pending exception

</details>

**A8.** Does Python warn about it?

<details>
<summary>Answer</summary>

Yes, a `SyntaxWarning` from Python 3.14 (PEP 765)

</details>

**A9.** Is `finally` guaranteed if the process is killed?

<details>
<summary>Answer</summary>

No

</details>

**A10.** Why keep `try` blocks small?

<details>
<summary>Answer</summary>

So each handler clearly protects one operation

</details>

#### From Q33: How Do You Create and Raise Custom Exceptions?

**A11.** How do you define a custom exception?

<details>
<summary>Answer</summary>

`class MyError(Exception): pass`

</details>

**A12.** How do you raise it?

<details>
<summary>Answer</summary>

`raise MyError("message")`

</details>

**A13.** What does `raise MyError` without parentheses do?

<details>
<summary>Answer</summary>

Raises an instance created with no arguments

</details>

**A14.** Why inherit from `ValueError`?

<details>
<summary>Answer</summary>

So `except ValueError` also catches it

</details>

**A15.** Why create a base package exception?

<details>
<summary>Answer</summary>

Callers can catch all of your errors with one handler

</details>

**A16.** How do you attach structured data?

<details>
<summary>Answer</summary>

Set attributes in `__init__` and call `super().__init__(message)`

</details>

**A17.** What if you skip `super().__init__()`?

<details>
<summary>Answer</summary>

`args` and the message may be empty

</details>

**A18.** Why not inherit from `BaseException`?

<details>
<summary>Answer</summary>

`except Exception` would miss it, like `KeyboardInterrupt`

</details>

**A19.** When should you not create a custom exception?

<details>
<summary>Answer</summary>

When a built-in already expresses the meaning

</details>

**A20.** How do you add context without changing the type?

<details>
<summary>Answer</summary>

`error.add_note(...)` in Python 3.11+

</details>

#### From Q34: What Is Exception Chaining Using `raise ... from ...`?

**A21.** What does `raise New(...) from error` do?

<details>
<summary>Answer</summary>

Raises `New` with `error` stored as `__cause__`

</details>

**A22.** Why chain exceptions?

<details>
<summary>Answer</summary>

To give a meaningful error while keeping the original for debugging

</details>

**A23.** What is `__context__`?

<details>
<summary>Answer</summary>

The exception being handled when the new one was raised, set automatically

</details>

**A24.** What is `__cause__`?

<details>
<summary>Answer</summary>

The explicit cause set with `from`

</details>

**A25.** How does the traceback differ?

<details>
<summary>Answer</summary>

"direct cause" for explicit, "During handling" for implicit

</details>

**A26.** What does `from None` do?

<details>
<summary>Answer</summary>

Sets `__suppress_context__` so the earlier exception is not displayed

</details>

**A27.** Does `from None` delete `__context__`?

<details>
<summary>Answer</summary>

No

</details>

**A28.** What does a bare `raise` do?

<details>
<summary>Answer</summary>

Re-raises the current exception unchanged

</details>

**A29.** When use `from None`?

<details>
<summary>Answer</summary>

When internal details would only confuse the user

</details>

**A30.** What can follow `from`?

<details>
<summary>Answer</summary>

An exception instance, an exception class, or `None`

</details>

#### From Q35: What Is a Context Manager, and How Does `with` Work?

**A31.** What is a context manager?

<details>
<summary>Answer</summary>

An object with `__enter__()` and `__exit__()` that wraps a block

</details>

**A32.** What does `with` call first?

<details>
<summary>Answer</summary>

`__enter__()`

</details>

**A33.** What is bound after `as`?

<details>
<summary>Answer</summary>

The return value of `__enter__()`

</details>

**A34.** Is the `as` value always the manager?

<details>
<summary>Answer</summary>

No; for example, a lock returns `True`

</details>

**A35.** Does `__exit__()` run if the block raises?

<details>
<summary>Answer</summary>

Yes, if entry succeeded

</details>

**A36.** Does `__exit__()` run if `__enter__()` raises?

<details>
<summary>Answer</summary>

No

</details>

**A37.** How is an exception suppressed?

<details>
<summary>Answer</summary>

`__exit__()` returns a truthy value

</details>

**A38.** What does returning `None` from `__exit__()` do?

<details>
<summary>Answer</summary>

Lets the exception propagate

</details>

**A39.** Does the `as` name exist after the block?

<details>
<summary>Answer</summary>

Yes, but the resource is usually closed or released

</details>

**A40.** Does every manager close its resource?

<details>
<summary>Answer</summary>

No; `sqlite3` connections manage transactions instead

</details>

#### From Q36: How Do You Write a Custom Context Manager Using `__enter__` and `__exit__`?

**A41.** Which two methods make a context manager?

<details>
<summary>Answer</summary>

`__enter__()` and `__exit__()`

</details>

**A42.** What does `__enter__()` return?

<details>
<summary>Answer</summary>

The value bound by `as`

</details>

**A43.** What if `__enter__()` returns nothing?

<details>
<summary>Answer</summary>

The `as` name is `None`

</details>

**A44.** What arguments does `__exit__()` receive?

<details>
<summary>Answer</summary>

`exc_type`, `exc_value`, `traceback`

</details>

**A45.** What are they on a normal exit?

<details>
<summary>Answer</summary>

All `None`

</details>

**A46.** How do you let the exception propagate?

<details>
<summary>Answer</summary>

Return `False` or `None`

</details>

**A47.** Should `__exit__()` re-raise the exception?

<details>
<summary>Answer</summary>

No; return a falsy value instead

</details>

**A48.** What if cleanup raises?

<details>
<summary>Answer</summary>

The new error replaces the old one, which is kept as `__context__`

</details>

**A49.** Is `__exit__()` called if `__enter__()` fails?

<details>
<summary>Answer</summary>

No

</details>

**A50.** What is a lighter alternative?

<details>
<summary>Answer</summary>

`@contextlib.contextmanager` with `try/finally` around `yield`

</details>

#### From Q37: What Is the Difference Between `finally` and a Context Manager for Cleanup?

**A51.** Do both run on exceptions?

<details>
<summary>Answer</summary>

Yes, both run cleanup while the exception propagates

</details>

**A52.** Main difference?

<details>
<summary>Answer</summary>

`finally` is inline code; a context manager is a reusable abstraction

</details>

**A53.** Where does context-manager cleanup live?

<details>
<summary>Answer</summary>

In `__exit__()` or after the `yield` in `@contextmanager`

</details>

**A54.** Why put acquisition before `try`?

<details>
<summary>Answer</summary>

So cleanup only runs for a resource that was acquired

</details>

**A55.** Is `__exit__()` called if `__enter__()` fails?

<details>
<summary>Answer</summary>

No

</details>

**A56.** How many times must a `@contextmanager` generator yield?

<details>
<summary>Answer</summary>

Exactly once

</details>

**A57.** How do you manage a runtime list of resources?

<details>
<summary>Answer</summary>

`contextlib.ExitStack`

</details>

**A58.** Can `finally` suppress an exception?

<details>
<summary>Answer</summary>

Only through control flow like `return`, which is bad practice

</details>

**A59.** Can a context manager suppress one?

<details>
<summary>Answer</summary>

Yes, by returning a truthy value from `__exit__()`

</details>

**A60.** Is cleanup guaranteed if the process is killed?

<details>
<summary>Answer</summary>

No

</details>

### Part B: Interview Questions

#### Q32. How Do `try`, `except`, `else`, and `finally` Work? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain the purpose and execution order of each clause.
- Catch specific exceptions instead of hiding unrelated failures.
- Know that `else` runs only when the `try` block completes normally.
- Explain cleanup with `finally` and the danger of returning from it.

</details>

<details>
<summary>Model answer</summary>

> The `try` block contains code that might fail, and each `except` clause handles a specific matching exception, checked from top to bottom. The `else` block runs only when the `try` block completes normally, and exceptions raised in `else` are not caught by the preceding handlers, which helps keep the protected region small. The `finally` block runs as control leaves the statement, whether it leaves normally, through a `return`, or with an exception propagating, so it is the place for cleanup. I catch specific exceptions rather than using a broad `except`, so unrelated bugs still surface. I also avoid `return`, `break`, or `continue` in `finally`, because they can replace a return value or silently swallow an exception, and Python 3.14 now warns about them.

</details>

#### Q33. How Do You Create and Raise Custom Exceptions? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Derive application exceptions from `Exception` or a suitable subclass.
- Raise meaningful errors with useful messages.
- Catch the custom type where recovery or reporting makes sense.
- Don't derive ordinary application errors directly from `BaseException`.

</details>

<details>
<summary>Model answer</summary>

> To create a custom exception, I define a class that inherits from `Exception`, or from a more specific built-in such as `ValueError` when the meaning matches, and I raise an instance with a clear message, for example `raise ModelNotTrainedError("Train the model before prediction")`. In a larger project I usually define one base exception for the package and specific subclasses, so callers can catch either a single failure or all of them. If the handler needs details, I store them as attributes and call `super().__init__()` with a readable message. I raise the error where the problem is detected and catch the specific type only where the code can recover or report it. I avoid inheriting from `BaseException`, because ordinary `except Exception` handlers would not catch it, and I reuse a built-in exception when a custom type adds no meaning.

</details>

#### Q34. What Is Exception Chaining Using `raise ... from ...`? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Turn a low-level error into a meaningful higher-level error.
- Keep the original cause for debugging.
- Distinguish explicit chaining from implicit exception context.
- Understand what `from None` changes.

</details>

<details>
<summary>Model answer</summary>

> Exception chaining links a new exception to the one that caused it. When I translate a low-level failure into an application-level one, such as turning a `ValueError` from `int()` into an `InvalidConfigurationError`, I write `raise InvalidConfigurationError(...) from error`, which stores the original in `__cause__` and shows both in the traceback as a direct cause. Even without `from`, raising inside an `except` block chains implicitly through `__context__`, and the traceback says the second error occurred during handling of the first. `raise ... from None` sets `__suppress_context__`, so the earlier exception is hidden in the displayed traceback, although `__context__` is still kept. I use explicit chaining in internal code because the cause helps debugging, `from None` only when the internal detail is noise, and a bare `raise` when I just want to log and re-raise the same exception.

</details>

#### Q35. What Is a Context Manager, and How Does `with` Work? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain managing a resource within a clearly defined scope.
- Describe entering, binding the `as` value, and exiting.
- Know that cleanup happens on normal exit and when an exception propagates, as long as entry succeeded.
- Recognize that some context managers suppress exceptions.

</details>

<details>
<summary>Model answer</summary>

> A context manager is an object that defines what happens on entry to and exit from a block of code, and the `with` statement uses it to manage resources like files, locks, and temporary directories within a clearly defined scope. Python evaluates the expression, calls `__enter__()`, binds its return value to the `as` name, runs the block, and then calls `__exit__()`, whether the block finishes normally or raises an exception. If `__enter__()` itself fails, `__exit__()` is not called, so entry code must clean up anything it partly acquired. `__exit__()` receives the exception details, and if it returns a truthy value the exception is suppressed, which is how `contextlib.suppress` works. What exit actually does depends on the manager, for example a `sqlite3` connection commits or rolls back a transaction rather than closing.

</details>

#### Q36. How Do You Write a Custom Context Manager Using `__enter__` and `__exit__`? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Implement the context manager protocol.
- Return the managed value from `__enter__()`.
- Explain the three exception arguments to `__exit__()`.
- Clean up reliably and avoid suppressing exceptions by accident.

</details>

<details>
<summary>Model answer</summary>

> To write a custom context manager, I define a class with `__enter__()` and `__exit__()`. `__enter__()` acquires the resource and returns the value the block should use, which is bound to the `as` name, so forgetting the `return` gives `None`. `__exit__()` receives the exception type, instance, and traceback, all `None` on a normal exit, and it runs whenever the block ends after a successful entry, so it is where I release the resource. I return `False` explicitly so exceptions propagate, and only suppress specific exception types on purpose, because any truthy return hides the error. I also keep cleanup simple, since an exception in `__exit__()` replaces the original one, and for simple cases I use `@contextmanager` with a `try/finally` around the `yield`.

</details>

#### Q37. What Is the Difference Between `finally` and a Context Manager for Cleanup? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain that both can run cleanup on normal exit and when an exception is raised.
- Distinguish explicit cleanup code from a reusable resource-management protocol.
- Choose context managers for resources with a well-defined, scoped lifetime.
- Understand acquisition failures, exception suppression, and the limits of cleanup.

</details>

<details>
<summary>Model answer</summary>

> Both `try/finally` and context managers run cleanup when a block finishes normally and when an exception propagates, so both are reliable for releasing resources. The difference is structure: `finally` places cleanup code explicitly at one call site, while a context manager packages setup and cleanup into a reusable `with` interface, either as a class with `__enter__()` and `__exit__()` or as a `@contextmanager` generator with `try/finally` around a single `yield`. I prefer an existing context manager for scoped resources like files, locks, and transactions, and use `finally` for one-off cleanup that doesn't need an abstraction. With `finally`, I acquire the resource before the `try`, so a failed acquisition doesn't trigger a bogus release, and for several or dynamically chosen resources I use `ExitStack`. Context managers can also suppress exceptions deliberately through `__exit__()`'s return value, and neither approach can guarantee cleanup if the process is killed or loses power.

</details>

---

## Memory Management and GIL

Covers: Q38; Q39; Q40.

### Part A: Rapid-Fire

#### From Q38: How Does Python Manage Memory and Garbage Collection?

**A1.** Who frees Python objects?

<details>
<summary>Answer</summary>

The runtime, automatically

</details>

**A2.** CPython's main mechanism?

<details>
<summary>Answer</summary>

Reference counting

</details>

**A3.** What does the cyclic collector handle?

<details>
<summary>Answer</summary>

Unreachable groups of objects that refer to each other

</details>

**A4.** Why can't reference counting free a cycle?

<details>
<summary>Answer</summary>

The objects keep each other's counts above zero

</details>

**A5.** Does `del x` destroy the object?

<details>
<summary>Answer</summary>

No; it removes one reference

</details>

**A6.** When is an object reclaimed in CPython?

<details>
<summary>Answer</summary>

Usually when its last reference disappears

</details>

**A7.** Does freed memory go back to the OS immediately?

<details>
<summary>Answer</summary>

Not necessarily; Python may keep it for reuse

</details>

**A8.** How can you force a collection?

<details>
<summary>Answer</summary>

`gc.collect()`

</details>

**A9.** How do you avoid a parent-child cycle?

<details>
<summary>Answer</summary>

Use a weak reference for the back link

</details>

**A10.** How should files be closed?

<details>
<summary>Answer</summary>

With a context manager, not by relying on GC

</details>

#### From Q39: What Are Shallow Copy and Deep Copy?

**A11.** Does `b = a` copy a list?

<details>
<summary>Answer</summary>

No; both names refer to the same list

</details>

**A12.** What does a shallow copy share?

<details>
<summary>Answer</summary>

The nested objects

</details>

**A13.** What does a deep copy share?

<details>
<summary>Answer</summary>

No mutable objects with the original

</details>

**A14.** Is `lst[:]` shallow or deep?

<details>
<summary>Answer</summary>

Shallow

</details>

**A15.** Is `dict.copy()` shallow or deep?

<details>
<summary>Answer</summary>

Shallow

</details>

**A16.** When is a shallow copy enough?

<details>
<summary>Answer</summary>

When nested values are immutable or will not be mutated

</details>

**A17.** How does `deepcopy()` handle cycles?

<details>
<summary>Answer</summary>

It uses a memo dictionary of already copied objects

</details>

**A18.** Why not always use `deepcopy()`?

<details>
<summary>Answer</summary>

It costs time and memory and fails for some objects

</details>

**A19.** How do you customize copying?

<details>
<summary>Answer</summary>

Define `__copy__` or `__deepcopy__`

</details>

**A20.** What is wrong with `[[0] * 3] * 3`?

<details>
<summary>Answer</summary>

All rows are the same list

</details>

#### From Q40: What Is the GIL, and Why Does It Matter?

**A21.** What does GIL stand for?

<details>
<summary>Answer</summary>

Global Interpreter Lock

</details>

**A22.** What does it allow?

<details>
<summary>Answer</summary>

Only one thread at a time to run Python bytecode in an interpreter

</details>

**A23.** Why does CPython have it?

<details>
<summary>Answer</summary>

To protect reference counting and internals simply and cheaply

</details>

**A24.** Do threads speed up pure-Python CPU work?

<details>
<summary>Answer</summary>

Usually not, in GIL-enabled CPython

</details>

**A25.** Do threads help with I/O-bound work?

<details>
<summary>Answer</summary>

Yes; waits release the GIL

</details>

**A26.** Can NumPy benefit from threads?

<details>
<summary>Answer</summary>

Often, when its operations release the GIL

</details>

**A27.** How do you parallelize CPU-bound Python?

<details>
<summary>Answer</summary>

Processes, vectorized or compiled code, or free-threaded CPython

</details>

**A28.** Is `counter += 1` thread-safe?

<details>
<summary>Answer</summary>

No; protect it with a lock

</details>

**A29.** Is free-threaded CPython the default?

<details>
<summary>Answer</summary>

No; it is an optional separate build

</details>

**A30.** Does every Python runtime have a GIL?

<details>
<summary>Answer</summary>

No

</details>

### Part B: Interview Questions

#### Q38. How Does Python Manage Memory and Garbage Collection? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Mention CPython's reference counting and cyclic garbage collection.
- Explain why cycles need extra handling.
- Distinguish removing a reference from destroying an object.
- Know that reclaimed memory isn't always returned to the operating system right away.
- Recognize that other Python implementations may manage memory differently.

</details>

<details>
<summary>Model answer</summary>

> Python manages memory automatically. CPython mainly uses reference counting, so an object can be reclaimed as soon as its last reference disappears. Reference counting cannot free objects that refer to each other in a cycle, so CPython also runs a cyclic garbage collector that finds and reclaims unreachable cycles. `del` only removes a reference; the object survives while anything else, such as a cache or a traceback, still refers to it. Reclaimed memory is often kept by Python for reuse rather than returned to the operating system immediately, and other implementations such as PyPy use different garbage collectors. For files, connections, and locks, I use context managers instead of relying on garbage collection.

</details>

#### Q39. What Are Shallow Copy and Deep Copy? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Distinguish assignment, shallow copy, and deep copy.
- Show the difference using nested mutable objects.
- Know that `list.copy()`, list slicing (`lst[:]`), and `dict.copy()` all make shallow copies.
- Explain that deep copying can take a lot of time and memory, and that it doesn't suit every object (for example, objects that hold external resources).

</details>

<details>
<summary>Model answer</summary>

> Assignment does not copy anything; it just binds another name to the same object. A shallow copy, made with `copy.copy()`, `list.copy()`, slicing, or `dict.copy()`, creates a new outer container but shares the nested objects, so mutating a nested list shows up in both. A deep copy, made with `copy.deepcopy()`, recursively copies nested objects, so the copy is fully independent, and it uses a memo to preserve shared references and handle cycles. I use a deep copy for nested configs or structures I plan to mutate, and a shallow copy when the nested values are immutable. Deep copying costs time and memory for large structures, and objects such as locks, files, or connections should not be deep-copied, so classes can customize this with `__deepcopy__`.

</details>

#### Q40. What Is the GIL, and Why Does It Matter? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Expand GIL as Global Interpreter Lock.
- Explain its effect on CPU-bound Python threads in GIL-enabled CPython.
- Distinguish running Python code from I/O waits and native-library computation.
- Know that the GIL doesn't replace application-level synchronization.
- Mention optional free-threaded CPython instead of claiming every Python runtime has a GIL.

</details>

<details>
<summary>Model answer</summary>

> The GIL, or Global Interpreter Lock, is a lock in GIL-enabled CPython that lets only one thread at a time execute Python bytecode within an interpreter, which keeps reference counting and other internals simple and fast. Because of it, CPU-heavy pure-Python loops don't get faster with threads; for those I use processes, vectorized NumPy code, or compiled extensions. Threads still help for I/O-bound work, because blocking I/O releases the GIL, and for native library operations that release it during computation. The GIL is not a replacement for application-level locks, since multi-step operations such as `counter += 1` can still race. Finally, the GIL is not universal: CPython has optional free-threaded builds, experimental in 3.13 and officially supported from 3.14, where threads can run Python code in parallel if the extensions you use support it.

</details>

---

## Concurrency (Threading, Multiprocessing, Asyncio)

Covers: Q41; Q42; Q43; Q44.

### Part A: Rapid-Fire

#### From Q41: When Should You Use Threading, Multiprocessing, or Asyncio?

**A1.** Best fit for blocking I/O with `requests`?

<details>
<summary>Answer</summary>

Threading

</details>

**A2.** Best fit for pure-Python CPU work?

<details>
<summary>Answer</summary>

Multiprocessing, or vectorize it

</details>

**A3.** Best fit for thousands of network calls?

<details>
<summary>Answer</summary>

Asyncio with async libraries

</details>

**A4.** Do threads share memory?

<details>
<summary>Answer</summary>

Yes

</details>

**A5.** Do processes share memory?

<details>
<summary>Answer</summary>

No, not by default

</details>

**A6.** Why must process-pool functions be module-level?

<details>
<summary>Answer</summary>

They must be picklable and importable

</details>

**A7.** Why might a process pool be slower?

<details>
<summary>Answer</summary>

Startup and serialization costs outweigh small tasks

</details>

**A8.** What stalls an event loop?

<details>
<summary>Answer</summary>

Any blocking call or heavy computation on the loop thread

</details>

**A9.** How do you limit concurrent async requests?

<details>
<summary>Answer</summary>

`asyncio.Semaphore`

</details>

**A10.** How do you run a blocking call from async code?

<details>
<summary>Answer</summary>

`asyncio.to_thread()`

</details>

#### From Q42: How Do `async` and `await` Work in Python?

**A11.** What does `async def` define?

<details>
<summary>Answer</summary>

A coroutine function

</details>

**A12.** What does calling it return?

<details>
<summary>Answer</summary>

A coroutine object that hasn't run yet

</details>

**A13.** What can you `await`?

<details>
<summary>Answer</summary>

Coroutines, tasks, futures, and objects with `__await__`

</details>

**A14.** What does `asyncio.run()` do?

<details>
<summary>Answer</summary>

Creates a loop, runs the top-level coroutine, closes the loop

</details>

**A15.** How do you run two coroutines concurrently?

<details>
<summary>Answer</summary>

`asyncio.gather()`, `create_task()`, or `TaskGroup`

</details>

**A16.** Does every `await` give up control?

<details>
<summary>Answer</summary>

No; only one that actually has to wait

</details>

**A17.** How do you yield control explicitly?

<details>
<summary>Answer</summary>

`await asyncio.sleep(0)`

</details>

**A18.** What happens if you call `time.sleep()` in a coroutine?

<details>
<summary>Answer</summary>

The whole event loop is blocked

</details>

**A19.** How do you call blocking code from async code?

<details>
<summary>Answer</summary>

`await asyncio.to_thread(func)`

</details>

**A20.** Why can't you call `asyncio.run()` in a notebook?

<details>
<summary>Answer</summary>

A loop is already running; use `await main()`

</details>

#### From Q43: What Is the Difference Between Concurrency and Parallelism?

**A21.** What is concurrency?

<details>
<summary>Answer</summary>

Several tasks making progress in overlapping time periods

</details>

**A22.** What is parallelism?

<details>
<summary>Answer</summary>

Several tasks executing at the same instant

</details>

**A23.** Does concurrency need multiple cores?

<details>
<summary>Answer</summary>

No

</details>

**A24.** Does CPU parallelism need multiple cores?

<details>
<summary>Answer</summary>

Yes

</details>

**A25.** Is asyncio parallel?

<details>
<summary>Answer</summary>

No; it is concurrent on one thread

</details>

**A26.** Are CPython threads parallel for Python code?

<details>
<summary>Answer</summary>

Not in GIL-enabled CPython

</details>

**A27.** Which Python tool gives CPU parallelism for Python code?

<details>
<summary>Answer</summary>

Processes, or free-threaded CPython

</details>

**A28.** Can concurrency make CPU-bound code faster?

<details>
<summary>Answer</summary>

Not by itself

</details>

**A29.** Why might parallel code be slower?

<details>
<summary>Answer</summary>

Startup, data transfer, and coordination overhead

</details>

**A30.** Can a program be both concurrent and parallel?

<details>
<summary>Answer</summary>

Yes

</details>

#### From Q44: How Would You Speed Up a CPU-Bound ML Preprocessing Task in Python?

**A31.** First step?

<details>
<summary>Answer</summary>

Confirm it is CPU-bound and profile on representative data

</details>

**A32.** Why not add processes immediately?

<details>
<summary>Answer</summary>

They multiply a bad algorithm's cost and add overhead

</details>

**A33.** Biggest usual win?

<details>
<summary>Answer</summary>

A better algorithm or vectorization

</details>

**A34.** When do processes help?

<details>
<summary>Answer</summary>

Independent, substantial, pure-Python CPU work

</details>

**A35.** What must process tasks be?

<details>
<summary>Answer</summary>

Picklable inputs, results, and module-level functions

</details>

**A36.** What does `chunksize` trade off?

<details>
<summary>Answer</summary>

Lower scheduling overhead vs worse load balancing

</details>

**A37.** How do you avoid resending big data?

<details>
<summary>Answer</summary>

Initializer, memory mapping, shared memory, or per-worker loading

</details>

**A38.** What is oversubscription?

<details>
<summary>Answer</summary>

More active threads than cores, e.g. processes times BLAS threads

</details>

**A39.** How do you compare float outputs?

<details>
<summary>Answer</summary>

With a tolerance, such as `math.isclose()`

</details>

**A40.** How do you avoid leakage when scaling?

<details>
<summary>Answer</summary>

Fit statistics on training data only

</details>

### Part B: Interview Questions

#### Q41. When Should You Use Threading, Multiprocessing, or Asyncio? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Identify whether the work is CPU-bound or I/O-bound before choosing a tool.
- Explain shared-memory threads versus separate processes.
- Choose asyncio for cooperative concurrency with async-compatible operations.
- Account for overhead, memory, serialization, and library behavior.

</details>

<details>
<summary>Model answer</summary>

> I start by checking whether the work is CPU-bound or I/O-bound, for example by profiling and comparing wall time with CPU time. For blocking I/O with synchronous libraries, I use a thread pool, because waits release the GIL and threads are easy to integrate, but I protect any shared state. For substantial CPU-bound Python work, I use a process pool, since each process has its own interpreter and GIL, keeping in mind the startup, pickling, and memory costs. For many concurrent network operations with async-compatible libraries, I use asyncio with a semaphore and timeouts, and I keep blocking calls off the event loop with `asyncio.to_thread()`. In ML code I also check whether the library already releases the GIL or uses its own threads, and I benchmark before committing to an approach.

</details>

#### Q42. How Do `async` and `await` Work in Python? 🟡

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain coroutine functions, coroutine objects, and the event loop.
- Distinguish creating a coroutine from running or scheduling it.
- Understand that a coroutine pauses cooperatively at an awaitable that has to wait.
- Recognize that awaiting one thing after another doesn't run independent work concurrently.
- Keep blocking operations off the event-loop thread.

</details>

<details>
<summary>Model answer</summary>

> `async def` defines a coroutine function; calling it just creates a coroutine object, which runs only when it is awaited or scheduled as a task. An event loop, usually started with `asyncio.run()`, runs tasks on a single thread and switches between them only at `await` points that actually have to wait, so concurrency is cooperative. Awaiting coroutines one after another runs them sequentially, so for independent I/O I use `asyncio.gather()`, `create_task()`, or a `TaskGroup`. Because there is only one loop thread, a blocking call such as `time.sleep()` or a synchronous HTTP request stalls every task, so I use async libraries or offload the call with `asyncio.to_thread()`. CPU-heavy work belongs in a process pool or optimized code, because async does not make computation faster.

</details>

#### Q43. What Is the Difference Between Concurrency and Parallelism? 🟢

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Explain overlapping task lifetimes versus simultaneous execution.
- Know that concurrency can happen on a single CPU core.
- Connect asyncio to cooperative concurrency, and processes to possible CPU parallelism.
- Don't assume either approach guarantees faster execution.

</details>

<details>
<summary>Model answer</summary>

> Concurrency means several tasks make progress during overlapping time periods, for example by taking turns while one waits on I/O, so it can happen on a single core. Parallelism means tasks actually execute at the same instant on different cores or other execution units. In Python, asyncio gives cooperative concurrency on one thread, and threads in GIL-enabled CPython are concurrent but don't run Python bytecode in parallel. For CPU parallelism in Python code, I use processes, or native libraries that use several cores internally. Neither approach guarantees a speedup: concurrency only helps when there is waiting to overlap, and parallelism carries startup, transfer, and coordination costs, so I measure on real workloads.

</details>

#### Q44. How Would You Speed Up a CPU-Bound ML Preprocessing Task in Python? 🔴

- [ ] Answered Strong

<details>
<summary>Key points to cover</summary>

- Profile first instead of immediately adding workers.
- Improve the algorithm and reduce Python-level loops where possible.
- Choose between vectorization, compiled operations, and process parallelism based on the workload.
- Consider memory use, serialization, task size, and nested parallelism.
- Verify that the output is correct and measure end-to-end performance.

</details>

<details>
<summary>Model answer</summary>

> I would first confirm the job is CPU-bound and profile the preprocessing pipeline on representative data to find the step that dominates. Then I would improve that algorithm, for example by using sets or dictionaries instead of list searches and caching repeated deterministic work, and replace suitable Python loops with NumPy or other compiled library operations. For the remaining independent CPU-heavy Python work, I would benchmark a process pool with sensible batching, sending large shared data once per worker rather than with every task. I would watch memory and transfer costs and limit native BLAS threads to avoid oversubscription. Before accepting the speedup, I would verify the outputs against the baseline with appropriate tolerances and measure end-to-end runtime and peak memory.

</details>
