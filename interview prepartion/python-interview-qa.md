# Python Interview Question: Key Features and Popularity for ML

**Difficulty:** 🟢 Beginner

## Question: What Are Python's Key Features, and Why Is It Popular for ML?

**Answer:** Python is a high-level, dynamically typed, general-purpose language known for readable syntax, fast development, and a large ecosystem. It is popular for machine learning because it makes data preparation, experimentation, model training, and deployment convenient. Much of the heavy computation in ML libraries runs in optimized native code or on GPUs, not in Python itself.

| Key feature | Why it helps |
| --- | --- |
| Readable, concise syntax | Code is easier to write, understand, and maintain |
| Dynamic typing | Quick experimentation without explicit type declarations |
| Automatic memory management | Less manual memory-management work |
| Multiple programming styles | Supports procedural, object-oriented, and functional approaches |
| Cross-platform support | Runs on Windows, Linux, and macOS |
| Large ecosystem and community | Reusable libraries, documentation, and learning resources |
| Integration with native code | Python can call optimized C, C++, and GPU implementations |

## 1. The Main Language Features

### Readable, Concise Syntax

Python uses indentation to mark blocks and has a small set of keywords. Common tasks often take only a few lines.

```python
scores = [0.72, 0.91, 0.65, 0.88]

passed = [score for score in scores if score >= 0.7]
average = sum(passed) / len(passed)

print(passed)             # [0.72, 0.91, 0.88]
print(round(average, 3))  # 0.837
```

The code reads almost like a description of the task: keep the scores of at least 0.7, then average them.

### Dynamic Typing

You do not declare a variable's type. Types belong to objects, and a name can refer to objects of different types over time.

```python
value = 10
print(type(value).__name__)  # int

value = "ten"
print(type(value).__name__)  # str
```

### Automatic Memory Management

You do not allocate or free memory by hand. CPython, the standard implementation, uses reference counting plus a cyclic garbage collector to reclaim objects that are no longer reachable.

```python
import sys

batch = [1, 2, 3]
alias = batch

# The count includes the temporary reference made by the call itself.
print(sys.getrefcount(batch))  # 3
```

The exact reference count is a CPython implementation detail, so do not rely on it in real code.

### Multiple Programming Styles

The same task can be written procedurally, functionally, or with classes.

```python
features = [1.0, 2.0, 3.0]

# Procedural
doubled = []
for value in features:
    doubled.append(value * 2)

# Functional
doubled_map = list(map(lambda value: value * 2, features))

# Object-oriented
class Scaler:
    def __init__(self, factor):
        self.factor = factor

    def transform(self, values):
        return [value * self.factor for value in values]

print(doubled)                          # [2.0, 4.0, 6.0]
print(doubled_map)                      # [2.0, 4.0, 6.0]
print(Scaler(2).transform(features))    # [2.0, 4.0, 6.0]
```

### Cross-Platform Support and Native Integration

Pure Python code usually runs unchanged on Windows, Linux, and macOS. Python can also call compiled code through C extensions, `ctypes`, Cython, or bindings such as pybind11. This is how ML libraries expose fast C, C++, and CUDA code through a Python interface.

## 2. Connecting the Features to ML Development

ML work is iterative: load data, inspect it, try a transformation, train a model, check a metric, and repeat. Python's features fit that loop.

| Feature | How it helps ML work |
| --- | --- |
| Readable syntax | Experiments and pipelines are easy for teammates to review |
| Dynamic typing | Quick prototyping in notebooks without type declarations |
| Interactive use | Jupyter and the REPL let you run one step and inspect the result |
| Large ecosystem | Data loading, training, evaluation, and serving tools already exist |
| Native integration | Heavy math runs in optimized native code or on GPUs |
| General-purpose language | The same language handles scripts, APIs, tests, and automation |

The last point matters in practice. A team can prepare data, train a model, and serve it through an API without switching languages.

## 3. Relevant Library Examples

| Stage | Library | Typical use |
| --- | --- | --- |
| Numerical computing | NumPy | Fast n-dimensional arrays and vectorized math |
| Data preparation | pandas | Tables, cleaning, joins, and group-by operations |
| Visualization | Matplotlib | Plots of data distributions and training curves |
| Classical ML | scikit-learn | Regression, classification, clustering, and pipelines |
| Deep learning | PyTorch, TensorFlow | Neural networks, automatic differentiation, and GPU training |
| Experimentation | Jupyter notebooks | Interactive experiments and explanations |
| Deployment | FastAPI | Serving trained models through APIs |

A typical scikit-learn workflow is short because the library hides the numerical work:

```python
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

model = LogisticRegression()
model.fit(X_train, y_train)
print(model.score(X_test, y_test))
```

This sketch assumes `X` and `y` already hold features and labels. The point is the shape of the workflow, not the specific numbers.

## 4. Python's Popularity Does Not Mean Python Itself Is Fast

Python code is executed by an interpreter. In CPython, source code is compiled to bytecode, and a virtual machine runs that bytecode. Each operation in a Python loop carries overhead such as dynamic type checks and object creation.

ML libraries avoid most of that overhead by running whole operations in native code. With NumPy, one Python call can process an entire array.

```python
import numpy as np

values = list(range(1_000_000))
array = np.arange(1_000_000)

# Pure Python: the interpreter runs one loop iteration per element.
python_total = sum(value * value for value in values)

# NumPy: one call runs the loop in compiled code.
numpy_total = int((array * array).sum())

print(python_total == numpy_total)  # True
print(numpy_total)                  # 333332833333500000
```

Both give the same result, but the vectorized NumPy version is typically many times faster on CPU. The exact speedup depends on the hardware, data size, and operation.

| Work done in | Speed characteristics |
| --- | --- |
| A pure Python loop | Interpreter overhead on every element |
| NumPy or pandas vectorized operations | Loop runs in optimized C code |
| PyTorch or TensorFlow on a GPU | Operations run as parallel GPU kernels |

**A useful way to describe Python in ML is as the orchestration layer.** Python describes what to compute, and native libraries do the expensive computation.

## 5. Practical Trade-Offs

### Runtime Type Errors

Dynamic typing speeds up prototyping, but some mistakes appear only when the code runs.

```python
def normalize(value, max_value):
    return value / max_value

print(normalize(5, 10))  # 0.5

try:
    normalize("5", 10)
except TypeError as error:
    print(error)  # unsupported operand type(s) for /: 'str' and 'int'
```

Teams reduce this risk with type hints checked by tools such as mypy, tests, and data validation.

### Slow CPU-Heavy Python Loops

Element-by-element loops in pure Python are slow for large numerical workloads. The usual fix is to vectorize with NumPy or pandas, or move the hot loop to compiled code with tools such as Numba or Cython.

### The Global Interpreter Lock

In standard CPython builds, the Global Interpreter Lock (GIL) allows only one thread to execute Python bytecode at a time. Threads still help with I/O-bound work, and many native libraries release the GIL during heavy computation. For CPU-bound pure Python work, multiprocessing is a common choice. Python 3.13 added an experimental free-threaded build that can run without the GIL.

| Trade-off | Common mitigation |
| --- | --- |
| Type errors appear at runtime | Type hints with mypy, tests, input validation |
| Slow pure Python loops | Vectorization, Numba, Cython |
| GIL limits CPU-bound threads | Multiprocessing, native libraries that release the GIL |
| Higher memory use per object | NumPy arrays instead of lists of Python numbers |

## 6. Follow-Up: Is Python Compiled or Interpreted?

Both descriptions are partly true for CPython. Source code is first compiled to bytecode, which is then executed by the CPython virtual machine. The bytecode is not native machine code.

```python
import dis

def scale(value):
    return value * 2

instructions = [instruction.opname for instruction in dis.get_instructions(scale)]
print("BINARY_OP" in instructions)  # True
```

`dis` shows the bytecode instructions. The exact opcode names change between Python versions, so treat them as an implementation detail. Other implementations exist, such as PyPy, which uses a just-in-time compiler.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Name the main language features | Readable syntax, dynamic typing, automatic memory management |
| Connect features to ML development | Fast iteration in notebooks, one language for the whole workflow |
| Give relevant library examples | NumPy, pandas, scikit-learn, PyTorch, FastAPI |
| Popularity does not mean Python runs everything fast | Vectorized NumPy instead of a Python loop |
| Mention a practical trade-off | Runtime type errors or slow CPU-heavy loops |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What kind of language is Python? | High-level, dynamically typed, general-purpose |
| Does Python require type declarations? | No; types belong to objects |
| How does CPython manage memory? | Reference counting plus a cyclic garbage collector |
| Which library handles arrays? | NumPy |
| Which library handles tables? | pandas |
| Which libraries handle deep learning? | PyTorch and TensorFlow |
| How are trained models often served? | Through an API, for example with FastAPI |
| Why are ML libraries fast? | They run heavy work in native code or on GPUs |
| What is a cost of dynamic typing? | Some type errors appear only at runtime |
| How do you speed up a slow numeric loop? | Vectorize it with NumPy or move it to compiled code |

## 9. Interview-Ready Answer

> Python is popular because its readable syntax, dynamic typing, automatic memory management, and large ecosystem make development fast. For ML, it covers the whole workflow, from data preparation with NumPy and pandas, to training with scikit-learn or PyTorch, to deployment through APIs such as FastAPI. Jupyter notebooks make iterative experimentation easy. Python loops can be slow, but ML libraries run most of their computation in optimized native code or on GPUs, so Python mainly acts as the orchestration layer. The trade-offs are that some type errors appear only at runtime and CPU-heavy pure Python loops are slow, which teams handle with tests, type checkers, and vectorization.

---

# Python Dynamic Typing: Five Questions and Answers with Examples

**Difficulty:** 🟢 Beginner

## Main Interview Question: How Does Dynamic Typing Work in Python?

Python is dynamically typed. Objects have types, and a variable name can refer to objects of different types while the program runs. You do not need to declare a variable's type before assigning a value.

```python
value = 10
print(type(value))  # <class 'int'>

value = "Python"
print(type(value))  # <class 'str'>
```

Python checks whether an operation is supported when that operation executes. Type hints describe intended types but do not automatically enforce them at runtime.

| Point | Meaning |
| --- | --- |
| Types belong to objects | The object `10` has type `int` |
| Names can be reassigned | `value` can later refer to a string |
| Unsupported operations fail at runtime | `10 + "5"` raises `TypeError` |
| Dynamic typing differs from weak typing | Reassignment does not mean arbitrary automatic conversions |
| Type hints are not runtime validation | An annotation alone does not reject an incompatible argument |

## Question 1: What Does “Types Belong to Objects, Not Permanently to Variable Names” Mean?

**Answer:** An object is a value-bearing entity in Python. A variable name is a name bound to an object. The object has a type; the name is not permanently restricted to that type by normal Python assignment.

```python
value = 10
print(type(value))  # <class 'int'>

value = "Python"
print(type(value))  # <class 'str'>
```

First, `value` refers to the integer object `10`. After reassignment, it refers to the string object `"Python"`.

**The integer did not become a string. The name was bound to a different object.**

### Object vs Variable Name

```python
age = 25
```

| Part | What it is | Role |
| --- | --- | --- |
| `age` | Variable name | Refers to an object |
| `25` | Integer object | Has a type, value and identity |
| `=` | Assignment syntax | Binds the name to the object |

```python
print(age)        # 25: the object's value
print(type(age))  # <class 'int'>: the object's type
print(id(age))    # An integer representing the object's identity
```

The exact output of `id()` varies. An object's identity remains constant during its lifetime; an identity value can be reused after an object is destroyed. Do not assume `id()` is a memory address in every Python implementation.

### Multiple Names Can Refer to One Object

```python
first = [10, 20]
second = first

print(first is second)  # True

second.append(30)

print(first)   # [10, 20, 30]
print(second)  # [10, 20, 30]
```

`second = first` does not copy the list. Both names refer to the same list object. Since a list is mutable, modifying it through either name changes the shared object.

### Reassignment Does Not Modify the Original Object

```python
first = [10, 20]
second = first

second = "Hello"

print(first)   # [10, 20]
print(second)  # Hello
```

Now `second` refers to a string. `first` still refers to the original list.

| Operation | What changes? |
| --- | --- |
| `second = first` | A second name refers to the same object |
| `second.append(30)` | The shared list object changes |
| `second = "Hello"` | The binding of `second` changes |

**Interview takeaway:** Objects have types; variable names refer to objects.

## Question 2: Can a Variable Name Refer to Different Types Over Time?

**Answer:** Yes. Python permits a name to be reassigned to objects of different types.

```python
data = 100
print(data, type(data))  # 100 <class 'int'>

data = "Hello"
print(data, type(data))  # Hello <class 'str'>

data = [1, 2, 3]
print(data, type(data))  # [1, 2, 3] <class 'list'>
```

| Assignment | Object type referred to by `data` |
| --- | --- |
| `data = 100` | `int` |
| `data = "Hello"` | `str` |
| `data = [1, 2, 3]` | `list` |

These assignments are valid. However, keeping a name's meaning and expected type consistent usually makes real application code easier to understand.

**Interview takeaway:** Reassignment can change the type of object a name refers to; it does not change the original object's type.

## Question 3: When Does Python Detect an Invalid Operation?

**Answer:** Python checks whether the objects support an operation when that operation executes. Unsupported combinations commonly raise `TypeError`.

```python
age = 25

print(age + 5)  # 30

try:
    print(age + "5")
except TypeError:
    print("Cannot add an integer and a string directly.")
```

Integer addition works. The integer/string combination does not support this addition.

### Convert Explicitly According to Your Intention

```python
age = 25

# Numeric addition:
print(age + int("5"))  # 30

# String concatenation:
print(str(age) + "5")  # 255
```

The second result is the string `"255"`; `print()` does not display its quotation marks.

| Expression | Result |
| --- | --- |
| `25 + 5` | Integer `30` |
| `25 + "5"` | `TypeError` |
| `25 + int("5")` | Integer `30` |
| `str(25) + "5"` | String `"255"` |

Without a handler, an exception stops the current execution path and propagates to the caller. In a simple top-level script, an unhandled exception terminates the script.

Dynamic typing does not mean every kind of error waits until execution: invalid Python syntax can be rejected before the code runs.

**Interview takeaway:** Unsupported operations are detected when executed, based on the objects involved.

## Question 4: How Is Dynamic Typing Different from Weak Typing?

**Answer:** Dynamic typing concerns how types are associated and checked. Strong versus weak typing informally describes how strictly a language treats incompatible values and implicit conversions. The terms strong and weak do not have one universal formal definition.

Python is commonly described as both **dynamically typed** and **strongly typed**.

| Concept | Python example | Explanation |
| --- | --- | --- |
| Dynamic typing | `number = 10`, then `number = "ten"` | A name can refer to different object types |
| Strong typing | `10 + "20"` raises `TypeError` | Python does not silently interpret this string as a number |
| Compatible numeric conversion | `10 + 2.5` produces `12.5` | Strong typing does not prohibit all implicit conversions |

```python
number = 10
number = "ten"  # Valid reassignment

try:
    result = 10 + "20"
except TypeError:
    print("Explicit conversion is needed for numeric addition.")

print(10 + int("20"))  # 30
print(10 + 2.5)        # 12.5
```

An operation's meaning also depends on the operand types:

```python
print(3 * 2)     # 6: numeric multiplication
print("Hi" * 2)  # HiHi: string repetition
```

String repetition is a supported operation, not an automatic conversion of `"Hi"` into a number.

**Interview takeaway:** Dynamic typing does not mean arbitrary implicit conversions are allowed.

## Question 5: Do Type Hints Automatically Validate Types at Runtime?

**Answer:** No. Python annotations describe intended types. Editors and static type checkers can use them, but annotations alone do not enforce argument or return types during ordinary execution.

```python
def double(number: int) -> int:
    return number * 2

print(double(5))     # 10
print(double("Hi"))  # HiHi
```

The second call runs because multiplying a string by an integer repeats the string. The function returns a string despite the `-> int` annotation.

| Annotation | Intended meaning | Automatically enforced? |
| --- | --- | --- |
| `number: int` | Argument should be an integer | No |
| `-> int` | Return value should be an integer | No |

A static type checker can flag `double("Hi")` without running the function. Runtime validation requires additional code or an appropriate validation library.

### Add Explicit Runtime Validation

```python
def double(number: int) -> int:
    if not isinstance(number, int):
        raise TypeError("number must be an integer")

    return number * 2

print(double(5))  # 10

try:
    print(double("Hi"))
except TypeError as error:
    print(error)  # number must be an integer
```

### Useful Detail: Booleans Are a Subclass of Integers

```python
print(isinstance(True, int))  # True
```

Therefore, the validation above accepts `True` and returns `2`. If your requirement is to accept exactly built-in integers, excluding booleans and integer subclasses, use:

```python
def double_exact_int(number: int) -> int:
    if type(number) is not int:
        raise TypeError("number must be exactly a built-in int")

    return number * 2
```

Choose validation according to your requirements rather than applying exact-type checks everywhere.

**Interview takeaway:** Type hints communicate expectations; runtime validation enforces them during execution.

## Quick Revision Table

| Question | One-line answer |
| --- | --- |
| Where does the type belong? | To the object, not permanently to its variable name |
| Can a name refer to different types? | Yes, through reassignment |
| When does an unsupported operation fail? | When that operation executes |
| Does dynamic mean weak typing? | No; Python is dynamic and commonly described as strongly typed |
| Do annotations enforce types? | No; use static checking or explicit runtime validation as needed |
| What is the difference between an object and a name? | The object has identity, type and value; the name refers to it |
| Does assigning one list name to another copy the list? | No; both names refer to the same list |
| Is reassignment the same as mutation? | No; reassignment changes a binding, while mutation changes an object |

## Interview-Ready Answer

> Python is dynamically typed because types belong to objects, and variable names can refer to objects of different types during execution. Unsupported operations, such as adding an integer to a string, raise errors when executed. Python is also commonly described as strongly typed because it does not silently convert incompatible values for every operation. Type hints document expected types and support static checking, but they do not automatically validate types at runtime.

---

# Python Interview Question: Mutable vs Immutable Objects

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between Mutable and Immutable Objects?

**Answer:** Mutable objects can be changed in place after creation. Immutable objects cannot. Reassigning a variable is different from modifying the object it refers to.

| Mutable objects | Immutable objects |
| --- | --- |
| `list`, `dict`, `set`, `bytearray` | `int`, `float`, `bool`, `str`, `tuple`, `frozenset` |

## 1. In-Place Modification vs Reassignment

### Mutable Example: Modify a List

```python
numbers = [10, 20]
original = numbers

numbers.append(30)

print(numbers)              # [10, 20, 30]
print(numbers is original)  # True
```

The list changes while remaining the same object. Both names refer to that object.

### Immutable Example: Reassign an Integer Name

```python
first = 10
second = first

second += 5

print(first)   # 10
print(second)  # 15
```

`second` now refers to the integer object `15`. The original integer `10` was not modified.

| Operation | Meaning |
| --- | --- |
| `numbers.append(30)` | Modify the existing list |
| `second += 5` for an integer | Calculate a result and bind the name to that result |
| `numbers = [99]` | Bind the name to a different list |

The behavior of `+=` depends on the object type. For example, list `+=` normally modifies the existing list, while integer `+=` rebinds the name.

## 2. Shared References

Multiple names can refer to the same object. Assignment does not automatically copy it.

```python
first = [10, 20]
second = first

second.append(30)

print(first)            # [10, 20, 30]
print(second)           # [10, 20, 30]
print(first is second)  # True
```

The change appears through both names because there is one shared list.

To create a separate outer list, use a shallow copy:

```python
first = [10, 20]
second = first.copy()

second.append(30)

print(first)            # [10, 20]
print(second)           # [10, 20, 30]
print(first is second)  # False
```

A shallow copy does not recursively copy nested objects. Nested mutable objects can still be shared.

## 3. How Function Arguments Behave

Function parameters are local names bound to the objects passed by the caller. This is often described as passing by assignment or object sharing.

### Mutating a Shared Object Affects the Caller

```python
def add_number(items):
    items.append(30)

numbers = [10, 20]
add_number(numbers)

print(numbers)  # [10, 20, 30]
```

The parameter `items` and the caller's name `numbers` refer to the same list. The function modifies that list.

### Reassigning the Parameter Does Not Reassign the Caller’s Name

```python
def replace_list(items):
    items = [99]

numbers = [10, 20]
replace_list(numbers)

print(numbers)  # [10, 20]
```

The assignment changes only the local binding of `items`.

### An Immutable Argument Example

```python
def increase(value):
    value += 5
    return value

number = 10
result = increase(number)

print(number)  # 10
print(result)  # 15
```

The function returns the new value. The caller's `number` binding remains unchanged.

| Inside the function | Effect |
| --- | --- |
| `items.append(30)` | Mutates the shared list |
| `items = [99]` | Rebinds only the local parameter |
| `value += 5` for an integer | Rebinds the local name to an integer result |
| `return value` | Makes the result available to the caller |

## 4. A Tuple Can Contain a Mutable Object

Tuple immutability means its element references cannot be replaced. A referenced object may still be mutable.

```python
record = ([1, 2], "active")

record[0].append(3)

print(record)  # ([1, 2, 3], 'active')
```

This is allowed because it modifies the list inside the tuple. The tuple still refers to the same list.

Replacing a tuple element is prohibited:

```python
record = ([1, 2], "active")

try:
    record[0] = []
except TypeError:
    print("Cannot replace a tuple element.")
```

| Operation | Allowed? | Reason |
| --- | --- | --- |
| `record[0].append(3)` | Yes | The contained list is mutable |
| `record[0] = []` | No | A tuple element cannot be replaced |
| `record = ([], "inactive")` | Yes | Reassigns the name to another tuple |

**Tuple immutability does not imply deep immutability.**

## 5. Dictionary Keys Must Be Hashable

A hashable object has a hash value that remains stable during its lifetime. Its equality behavior must be compatible with hashing: equal objects must have equal hashes.

Strings and tuples of hashable elements can be dictionary keys:

```python
scores = {
    "Alice": 90,
    (1, 2): "pair",
}

print(scores["Alice"])  # 90
print(scores[(1, 2)])   # pair
```

Lists cannot be dictionary keys:

```python
scores = {}

try:
    scores[[1, 2]] = "pair"
except TypeError:
    print("A list is unhashable.")
```

A tuple containing a list is also unhashable:

```python
key = ([1, 2], "active")

try:
    hash(key)
except TypeError:
    print("This tuple contains an unhashable list.")
```

| Object | Hashable? |
| --- | --- |
| `10` | Yes |
| `"Python"` | Yes |
| `(1, 2)` | Yes |
| `[1, 2]` | No |
| `([1, 2], "active")` | No |
| `frozenset({1, 2})` | Yes |

**A tuple is hashable only when all its elements are hashable.** Hashability and immutability are related, but they are not interchangeable definitions. Some user-defined mutable objects can be hashable, so avoid claiming that every mutable object is unhashable.

## 6. Follow-Up: Why Are Mutable Default Arguments Risky?

Default argument objects are created when the function definition executes, rather than on every call.

### Problem: One Default List Is Reused

```python
def add_item(item, items=[]):
    items.append(item)
    return items

print(add_item("A"))  # ['A']
print(add_item("B"))  # ['A', 'B']
print(add_item("C"))  # ['A', 'B', 'C']
```

Calls that omit `items` reuse the same default list. Changes from earlier calls remain in it.

### Solution: Use `None` to Create a Fresh List When Omitted

```python
def add_item(item, items=None):
    if items is None:
        items = []

    items.append(item)
    return items

print(add_item("A"))  # ['A']
print(add_item("B"))  # ['B']
```

Each call without a supplied list creates its own list.

### Explicitly Supplied Lists Are Still Modified

```python
def add_item(item, items=None):
    if items is None:
        items = []

    items.append(item)
    return items

existing = ["A"]
result = add_item("B", existing)

print(existing)           # ['A', 'B']
print(result is existing) # True
```

The `None` pattern avoids a shared default. It does not automatically copy a list supplied by the caller.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Mutation changes an object in place | `items.append(30)` |
| Reassignment changes a name's binding | `items = [99]` |
| Multiple names can share one object | `second = first` |
| Function parameters share supplied objects | Mutating a passed list is visible to the caller |
| Tuple immutability is not necessarily deep | A contained list can change |
| Dictionary keys must be hashable | A tuple containing a list cannot be a key |
| Mutable defaults are reused | `items=[]` can retain values between calls |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What is mutable? | An object that supports changes to its state in place |
| What is immutable? | An object whose state cannot be changed after creation |
| Does assignment copy a list? | No; it binds another name to the same object |
| Can an immutable name be reassigned? | Names are not classified as mutable or immutable; their objects are |
| Can a tuple contain a list? | Yes |
| Can that contained list change? | Yes |
| Can a tuple containing a list be a dictionary key? | No |
| Why avoid `items=[]` as a default? | Calls reuse the same default list |
| Does using `None` prevent mutation of a caller's list? | No; explicit mutation still affects a supplied list |

## 9. Interview-Ready Answer

> Mutable objects, such as lists and dictionaries, can be modified in place. Immutable objects, such as integers, strings, and tuples, cannot. Reassignment changes which object a name refers to, whereas mutation changes the object itself. Shared references make mutations visible through other names and function arguments. A tuple can contain mutable objects, so its immutability is not necessarily deep. Dictionary keys must be hashable, and mutable default arguments should usually be avoided because their objects are reused across calls.

---

# Python Interview Question: List vs Tuple vs Set vs Dict

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between List, Tuple, Set, and Dict? When Do You Use Each?

**Answer:** Lists and tuples are ordered sequences that allow duplicates; lists are mutable and tuples are immutable. Sets store unique hashable elements without a guaranteed positional order. Dictionaries map hashable keys to values, are mutable, and preserve insertion order. Choose a collection based on the operations you need.

| Collection | Main characteristics | Example | When to use |
| --- | --- | --- | --- |
| `list` | Ordered, mutable, allows duplicates | `[10, 20, 10]` | A sequence that needs updates |
| `tuple` | Ordered, immutable sequence, allows duplicates | `(10, 20)` | A fixed collection or record |
| `set` | Unique hashable elements, no guaranteed positional order | `{10, 20}` | Deduplication and membership checks |
| `dict` | Key-value mapping, mutable, preserves insertion order | `{"name": "Ashwani"}` | Looking up values by key |

## 1. Order, Mutability, Duplicates, and Access Patterns

### List: An Ordered, Changeable Sequence

```python
scores = [85, 90, 85]
scores.append(95)
scores[0] = 80

print(scores)     # [80, 90, 85, 95]
print(scores[1])  # 90
print(len(scores))  # 4
```

Lists keep elements in position order, allow duplicates, and support indexing, slicing, appending, and in-place changes.

### Tuple: A Fixed Sequence or Record

```python
coordinates = (28.61, 77.21)
latitude, longitude = coordinates

print(latitude)        # 28.61
print(coordinates[1])  # 77.21

try:
    coordinates[0] = 0.0
except TypeError:
    print("Tuples cannot be changed in place.")
```

Tuples support indexing and slicing like lists, but their element references cannot be replaced. They suit fixed records, such as a coordinate pair or an image shape `(height, width, channels)`, and multiple return values.

A one-element tuple needs a trailing comma:

```python
print(type((5)).__name__)   # int
print(type((5,)).__name__)  # tuple
```

### Set: Unique Elements Without Positions

```python
unique_categories = {"ML", "NLP", "ML"}

print(len(unique_categories))    # 2
print("NLP" in unique_categories)  # True

try:
    unique_categories[0]
except TypeError:
    print("Sets do not support indexing.")
```

Sets drop duplicates automatically. They have no indexes, and you should not rely on their iteration order. They also support set algebra:

```python
train_labels = {"cat", "dog", "bird"}
test_labels = {"dog", "fish"}

print(sorted(train_labels & test_labels))  # ['dog']
print(sorted(test_labels - train_labels))  # ['fish']
print(sorted(train_labels | test_labels))  # ['bird', 'cat', 'dog', 'fish']
```

`sorted()` is used here so the printed order is predictable.

### Dict: Values Looked Up by Key

```python
model_config = {
    "learning_rate": 0.01,
    "epochs": 20,
}

model_config["batch_size"] = 32

print(model_config["epochs"])           # 20
print(model_config.get("dropout", 0.0))  # 0.0
print(list(model_config))               # ['learning_rate', 'epochs', 'batch_size']
```

Keys are unique; assigning to an existing key replaces its value. Since Python 3.7, the language guarantees that dictionaries preserve insertion order.

| Property | `list` | `tuple` | `set` | `dict` |
| --- | --- | --- | --- | --- |
| Ordered | Yes | Yes | No positional order | Insertion order (3.7+) |
| Mutable | Yes | No | Yes | Yes |
| Duplicates | Allowed | Allowed | Not allowed | Keys unique, values may repeat |
| Access | By index | By index | Membership only | By key |
| Empty literal | `[]` | `()` | `set()` | `{}` |

### Important Syntax: `{}` Is a Dict

```python
empty_dict = {}
empty_set = set()   # {} creates a dict, not a set

print(type(empty_dict).__name__)  # dict
print(type(empty_set).__name__)   # set
```

## 2. Sets Need Hashable Elements; Dicts Need Hashable Keys

Sets and dictionaries are hash tables. They compute a hash of each element or key to decide where to store it, so these must be hashable.

```python
seen = set()
seen.add((1, 2))       # A tuple of hashable values is hashable

try:
    seen.add([1, 2])
except TypeError as error:
    print(error)  # unhashable type: 'list'

lookup = {("user", 1): "Ashwani"}
print(lookup[("user", 1)])  # Ashwani
```

Dictionary **values** can be anything, including lists and other dictionaries. Only the keys must be hashable.

| Can be used as | `int`, `str`, `tuple` of hashables, `frozenset` | `list`, `dict`, `set` |
| --- | --- | --- |
| Set element | Yes | No |
| Dict key | Yes | No |
| Dict value | Yes | Yes |

If you need a set of sets, use `frozenset`, the immutable and hashable version of `set`.

```python
groups = {frozenset({"a", "b"}), frozenset({"b", "a"})}
print(len(groups))  # 1
```

## 3. Membership Cost: O(n) vs O(1) on Average

`x in some_list` scans elements one by one, so it is typically O(n). Sets and dictionaries hash the value and jump to the matching slot, so membership is O(1) on average. The worst case can degrade when many hashes collide.

```python
vocabulary_list = [f"word{i}" for i in range(100_000)]
vocabulary_set = set(vocabulary_list)

print("word99999" in vocabulary_list)  # True
print("word99999" in vocabulary_set)   # True
```

Both answers are the same, but the list check compares up to 100,000 strings, while the set check usually does one hash lookup. For a dictionary, `key in d` checks keys, not values; `value in d.values()` is a linear scan.

| Operation | `list` | `set` / `dict` |
| --- | --- | --- |
| `x in collection` | O(n) | O(1) average |
| Access by position | O(1) | Not supported |
| Access by key | Not supported | O(1) average (dict) |
| Append at end | O(1) amortized | Add is O(1) average |
| Insert at front | O(n) | Not applicable |

The trade-off: sets and dictionaries use more memory per element than lists or tuples.

## 4. Choose by the Operations You Need, Not by the Syntax

| Need | Choose | Example |
| --- | --- | --- |
| Ordered data you will append to or edit | `list` | Loss values per epoch |
| A fixed record or a hashable composite key | `tuple` | `(height, width, channels)` |
| Fast "have I seen this?" checks | `set` | Already-processed file IDs |
| Remove duplicates (order not needed) | `set` | Unique labels |
| Look up a value by name or ID | `dict` | Hyperparameters, word-to-index maps |
| Count occurrences | `dict` or `collections.Counter` | Label frequencies |

A small ML-flavored example combines them:

```python
samples = [
    ("img1.png", "cat"),
    ("img2.png", "dog"),
    ("img3.png", "cat"),
]

labels = sorted({label for _, label in samples})
label_to_index = {label: index for index, label in enumerate(labels)}
encoded = [label_to_index[label] for _, label in samples]

print(labels)          # ['cat', 'dog']
print(label_to_index)  # {'cat': 0, 'dog': 1}
print(encoded)         # [0, 1, 0]
```

Each sample is a tuple record, a set finds unique labels, a dictionary maps labels to indexes, and a list holds the encoded sequence.

## 5. Follow-Up: When Would You Choose a Tuple Over a List?

Choose a tuple when the data should not change, when you need it as a dictionary key or set element, or when it represents a record with a fixed structure.

```python
cache = {}
cache[(224, 224, 3)] = "resnet_input"

print(cache[(224, 224, 3)])  # resnet_input
```

A tuple is hashable only when all its elements are hashable. Tuple immutability is also shallow: a tuple containing a list cannot be a key, and that list can still change.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Compare order, mutability, duplicates, and access | Lists and tuples are indexed; sets are not |
| Sets need hashable elements | `set().add([1, 2])` raises `TypeError` |
| Dictionaries need hashable keys | A tuple key works; a list key does not |
| List membership is O(n) | `x in items` scans the list |
| Set and dict membership is O(1) on average | Hash lookup |
| Choose based on operations | Use a dict for lookup by key, a set for dedup |
| Know `{}` is an empty dict | Use `set()` for an empty set |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| Which collections are ordered sequences? | `list` and `tuple` |
| Which collection is immutable? | `tuple` |
| Which collection removes duplicates? | `set` |
| Do dicts preserve order? | Yes, insertion order, guaranteed since Python 3.7 |
| What does `{}` create? | An empty `dict` |
| How do you make an empty set? | `set()` |
| Can a list be a dict key? | No; it is unhashable |
| Can a dict value be a list? | Yes |
| What is the cost of `x in list`? | O(n) |
| What is the cost of `x in set`? | O(1) on average |

## 8. Interview-Ready Answer

> A list is an ordered, mutable sequence that allows duplicates, so I use it for data I will append to or edit. A tuple is an ordered, immutable sequence that suits fixed records and can be a dictionary key when its elements are hashable. A set holds unique hashable elements without positions, which makes it ideal for deduplication and fast membership checks. A dictionary maps hashable keys to values and preserves insertion order, so I use it for lookups by key, such as configs or label-to-index maps. Membership in a list is O(n), while sets and dictionaries give O(1) average lookups at the cost of extra memory. I choose based on the operations I need, and I remember that `{}` creates a dict, not a set.

---

# Python Interview Question: `is` vs `==`

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `is` and `==`?

**Answer:** `==` compares **equality**: whether two objects have equal values. `is` compares **identity**: whether two names refer to the same object. Use `is` for singletons such as `None`, and `==` for ordinary values.

| Operator | Compares | Can be customized? | Typical use |
| --- | --- | --- | --- |
| `==` | Values, via `__eq__` | Yes | Numbers, strings, lists, records |
| `is` | Object identity | No | `None`, `True`/`False` sentinels, same-object checks |

## 1. Identity vs Equality

```python
first = [1, 2]
second = [1, 2]
third = first

print(first == second)  # True
print(first is second)  # False
print(first is third)   # True
```

`first` and `second` are two separate lists with equal contents. `third` is another name for the same list as `first`.

### What Identity Means

Every object has an identity that stays constant during its lifetime. `id()` returns it. In CPython, it is the object's memory address, but treat it as an opaque number.

```python
first = [1, 2]
third = first

print(id(first) == id(third))  # True
print(first is third)          # True
```

`a is b` behaves like `id(a) == id(b)` while both objects are alive.

### Shared Identity Means Shared Changes

```python
first = [1, 2]
second = [1, 2]
third = first

third.append(3)

print(first)   # [1, 2, 3]
print(second)  # [1, 2]
```

This is why identity matters: a mutation through one name is visible through every name for the same object.

### `==` Can Be Customized; `is` Cannot

`==` calls the `__eq__` method, so each class decides what "equal" means. `is` cannot be overridden.

```python
class ModelVersion:
    def __init__(self, name, version):
        self.name = name
        self.version = version

    def __eq__(self, other):
        if not isinstance(other, ModelVersion):
            return NotImplemented
        return (self.name, self.version) == (other.name, other.version)

a = ModelVersion("bert", 2)
b = ModelVersion("bert", 2)

print(a == b)  # True
print(a is b)  # False
```

Without `__eq__`, a class inherits the default from `object`, which compares identity. Defining `__eq__` without `__hash__` also makes instances unhashable.

| Comparison | `a == b` | `a is b` |
| --- | --- | --- |
| Two separate equal lists | `True` | `False` |
| Two names for one list | `True` | `True` |
| Custom class without `__eq__` | Same as `is` | Identity |

## 2. Use `is None` to Check for `None`

`None` is a singleton: there is only one `None` object in a Python process. `is None` is the idiomatic, fast, and safe check.

```python
result = None
if result is None:
    print("No result")  # No result
```

`== None` can be fooled by a class whose `__eq__` returns `True` for everything:

```python
class AlwaysEqual:
    def __eq__(self, other):
        return True

value = AlwaysEqual()

print(value == None)  # True
print(value is None)  # False
```

`is None` also matters with NumPy arrays and pandas objects, where `==` compares element-wise:

```python
import numpy as np

predictions = np.array([1, 0, 1])

print(predictions == None)  # [False False False]
print(predictions is None)  # False
```

`predictions == None` returns an array, and using that array in an `if` statement raises `ValueError` because its truth value is ambiguous. PEP 8 recommends `is` and `is not` for comparisons with singletons like `None`.

## 3. Avoid `is` for Comparing Strings and Numbers

Use `==` to compare ordinary values:

```python
status = "ready"
if status == "ready":
    print("Start processing")  # Start processing
```

Two equal strings or numbers are not guaranteed to be the same object. Strings built at runtime are often separate objects:

```python
prefix = "rea"
status = prefix + "dy"

print(status == "ready")  # True
print(status is "ready")  # False
```

The `is` version gives the wrong answer here even though the values are equal. Since Python 3.8, comparing with a literal using `is` also triggers a `SyntaxWarning` ("did you mean '=='?").

Floats can also be equal without being identical:

```python
learning_rate = float("0.001")

print(learning_rate == 0.001)  # True
print(learning_rate is 0.001)  # False
```

| Check | Correct operator |
| --- | --- |
| Is the value missing? | `x is None` |
| Is the value present? | `x is not None` |
| Do two strings match? | `a == b` |
| Do two numbers match? | `a == b` (or `math.isclose` for floats) |
| Are these the same object? | `a is b` |

## 4. Caching and Interning Can Make a Wrong `is` Seem to Work

CPython reuses some objects to save memory. This can make a wrong `is` comparison return `True` in a quick test and `False` in production.

### Small Integer Caching

CPython caches integers from -5 to 256. Each value in that range has a single shared object.

```python
a = int("256")
b = int("256")
c = int("257")
d = int("257")

print(a is b)  # True
print(c is d)  # False
print(c == d)  # True
```

The integers are created at runtime with `int()` so the compiler cannot merge the constants. Literals written in the same code block may still be shared, which makes results even less predictable.

### String Interning

CPython automatically interns many short strings that look like identifiers, such as names and some literals. Strings created at runtime usually are not interned.

```python
import sys

a = "model"
b = "model"
c = "".join(["mod", "el"])

print(a is b)                  # True
print(a is c)                  # False
print(a is sys.intern(c))      # True
```

`sys.intern()` can deliberately intern strings, for example to save memory when many identical keys repeat. Even then, use `==` to compare their values.

**These caching rules are CPython implementation details.** They can change between versions and implementations, so never rely on them for correctness.

## 5. Follow-Up: When Is `is` the Right Choice Besides `None`?

- **Sentinel objects:** a unique `object()` marks "no argument passed" when `None` is a valid value.
- **`NotImplemented` and `Ellipsis`:** also singletons.
- **Checking for the same object**, for example to detect whether a function returned its input or a copy.

```python
_MISSING = object()

def get_param(params, key, default=_MISSING):
    value = params.get(key, _MISSING)
    if value is _MISSING:
        if default is _MISSING:
            raise KeyError(key)
        return default
    return value

params = {"dropout": None}

print(get_param(params, "dropout"))      # None
print(get_param(params, "epochs", 10))   # 10
```

Here `None` is a legitimate stored value, so the sentinel distinguishes "missing" from "set to `None`."

For booleans, prefer a plain truth test such as `if flag:`. PEP 8 discourages both `flag == True` and `flag is True`, except when you deliberately need to distinguish `True` from other truthy values.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `==` checks equality of values | `[1, 2] == [1, 2]` is `True` |
| `is` checks identity | Two separate equal lists are not `is` |
| Use `is None` for `None` | `if result is None:` |
| Avoid `is` for strings and numbers | `status == "ready"` |
| Caching and interning can hide bugs | Small ints and short strings may be shared |
| `==` can be customized; `is` cannot | `__eq__` on a class |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `==` compare? | Values, through `__eq__` |
| What does `is` compare? | Object identity |
| What does `id()` return? | An identity number that is constant during the object's lifetime |
| How do you check for `None`? | `x is None` |
| Why not `x == None`? | `__eq__` can be overridden, and arrays compare element-wise |
| Should you compare strings with `is`? | No; use `==` |
| Which ints does CPython cache? | -5 to 256, an implementation detail |
| Why might `a is b` work for short strings? | CPython may intern them |
| What does `is` with a literal trigger? | A `SyntaxWarning` since Python 3.8 |
| Can a class override `is`? | No |

## 8. Interview-Ready Answer

> `==` checks whether two objects have equal values, and it can be customized with `__eq__`. `is` checks whether two names refer to the exact same object, and it cannot be overridden. For example, two separate lists `[1, 2]` are equal but not identical. I use `is` for singletons, most commonly `if result is None`, because it is reliable even with NumPy arrays or classes that override equality. I avoid `is` for strings and numbers, because CPython's small-integer caching and string interning can make a wrong comparison seem to work in testing and then fail with values created at runtime.

---

# Python Interview Question: Variable Scope and the LEGB Rule

**Difficulty:** 🟡 Intermediate

## Question: What Is Variable Scope? Explain the LEGB Rule.

**Answer:** Scope determines where a name can be accessed. For ordinary name lookup inside functions, Python searches four scopes in **LEGB** order: Local, Enclosing, Global, and Built-in, and uses the first match. Assigning to a name inside a function makes it local unless you declare it `global` or `nonlocal`.

| Letter | Scope | Meaning |
| --- | --- | --- |
| L | Local | Names inside the current function |
| E | Enclosing | Names in surrounding function scopes |
| G | Global | Names in the current module |
| B | Built-in | Names such as `len`, `print`, and `sum` |

## 1. The Four Levels in the Correct Order

### All Three User Scopes Define the Name

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

Lookup stops at the first scope that defines the name, so `inner()` prints `"Local"`.

### Remove the Local Assignment: Lookup Finds Enclosing

```python
course = "Global"

def outer():
    course = "Enclosing"

    def inner():
        print(course)

    inner()

outer()  # Enclosing
```

### Remove the Enclosing Assignment Too: Lookup Finds Global

```python
course = "Global"

def outer():
    def inner():
        print(course)

    inner()

outer()  # Global
```

### Built-in: The Last Place Python Looks

```python
import builtins

print(len([1, 2, 3]))           # 3
print("len" in dir(builtins))   # True
```

`len` is not defined in your module, so Python finds it in the `builtins` module. If no scope defines a name, Python raises `NameError`.

```python
def predict():
    return undefined_model

try:
    predict()
except NameError as error:
    print(error)  # name 'undefined_model' is not defined
```

### Shadowing a Built-in

A global or local name with the same name as a built-in hides it, because G and L come before B.

```python
def total_loss(losses):
    sum = 0
    for loss in losses:
        sum += loss
    return sum

print(total_loss([0.5, 0.25]))  # 0.75
print(sum([1, 2]))              # 3
```

The local `sum` hides the built-in only inside the function. Shadowing `list`, `sum`, `id`, or `input` at module level is a common source of confusing bugs, so avoid it.

| What creates a new scope | What does not |
| --- | --- |
| A function (`def`, `lambda`) | `if`, `for`, `while`, `with`, `try` blocks |
| A class body (with special rules) | Indentation alone |
| A comprehension (Python 3) | A plain block of statements |

```python
for epoch in range(3):
    last_loss = 0.1 * epoch

print(epoch)      # 2
print(last_loss)  # 0.2

squares = [n * n for n in range(3)]
try:
    print(n)
except NameError:
    print("Comprehension variables do not leak in Python 3.")
```

Loop variables remain in the enclosing scope after the loop, but comprehension variables do not.

## 2. `global` vs `nonlocal`

### `global` Rebinds a Module-Level Name

```python
count = 0

def increment():
    global count
    count += 1

increment()
increment()
print(count)  # 2
```

### `nonlocal` Rebinds a Name in an Enclosing Function Scope

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

`nonlocal` searches enclosing function scopes only. It never refers to a global name, and the name must already exist in an enclosing function.

```python
code = """
def increment():
    nonlocal count
    count += 1
"""

try:
    compile(code, "<example>", "exec")
except SyntaxError as error:
    print(error.msg)  # no binding for nonlocal 'count' found
```

### A Practical `nonlocal` Example: A Closure Counter

```python
def make_batch_counter():
    batches = 0

    def record_batch():
        nonlocal batches
        batches += 1
        return batches

    return record_batch

counter = make_batch_counter()
counter()
counter()
print(counter())  # 3
```

The inner function keeps access to `batches` after `make_batch_counter()` has returned. This is a closure.

| Keyword | Rebinds a name in | Must the name already exist? |
| --- | --- | --- |
| `global` | The module (global) scope | No; it can create the global |
| `nonlocal` | The nearest enclosing function scope | Yes |

### You Do Not Need These Keywords to Mutate

`global` and `nonlocal` are needed only to **rebind** a name. Mutating an object found through LEGB lookup works without them.

```python
history = []

def log_loss(value):
    history.append(value)

log_loss(0.9)
log_loss(0.7)
print(history)  # [0.9, 0.7]
```

Heavy use of `global` makes code harder to test. In ML code, prefer passing state as arguments, returning values, or storing state on an object such as a trainer class.

## 3. Assigning to a Name Inside a Function Makes It Local

Python decides a name's scope when it compiles the function, not when each line runs. If a function assigns to a name anywhere in its body, that name is local throughout the whole function, unless it is declared `global` or `nonlocal`.

Assignment includes more than `=`:

| Binding operation | Example |
| --- | --- |
| Assignment | `x = 1` |
| Augmented assignment | `x += 1` |
| `for` loop target | `for x in items:` |
| Import | `import x` |
| Function or class definition | `def x(): ...` |
| `with ... as` and `except ... as` | `with open(path) as x:` |

```python
threshold = 0.5

def show_threshold():
    print(threshold)

def change_threshold():
    threshold = 0.9
    return threshold

show_threshold()             # 0.5
print(change_threshold())    # 0.9
print(threshold)             # 0.5
```

`change_threshold()` creates a new local `threshold`. It does not change the global one.

## 4. The Common Error: `UnboundLocalError`

```python
count = 10

def update():
    print(count)  # UnboundLocalError
    count = 20    # Makes count local throughout this function
```

Because `update()` assigns to `count`, the compiler marks `count` as local for the whole function. The `print(count)` line reads the local name before it has a value.

```python
count = 10

def update():
    print(count)
    count = 20

try:
    update()
except UnboundLocalError as error:
    print(type(error).__name__)  # UnboundLocalError
```

The same thing happens with `count += 1`, which reads `count` before writing it.

`UnboundLocalError` is a subclass of `NameError`.

### Fixes

```python
count = 10

# Fix 1: declare the global (if you really mean to change it)
def update_global():
    global count
    print(count)
    count = 20

# Fix 2 (usually better): pass the value in and return the result
def update_pure(current):
    return current + 10

update_global()               # 10
print(count)                  # 20
print(update_pure(count))     # 30
```

| Situation | Result |
| --- | --- |
| Read a global, never assign it | Works; lookup finds the global |
| Assign a name, then read it | Works; it is local |
| Read a name, then assign it later | `UnboundLocalError` |
| `global name` before assigning | Rebinds the module-level name |

## 5. Follow-Up: Late Binding in Closures

Closures look up enclosing names when the inner function **runs**, not when it is created. This surprises people in loops.

```python
callbacks = [lambda: step for step in range(3)]
print([callback() for callback in callbacks])  # [2, 2, 2]

callbacks = [lambda step=step: step for step in range(3)]
print([callback() for callback in callbacks])  # [0, 1, 2]
```

All three lambdas in the first version share one `step` variable, which ends at `2`. A default argument captures the current value at definition time.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Name all four levels in order | Local, Enclosing, Global, Built-in |
| Lookup uses the first match | A local `course` hides the global one |
| `global` rebinds a module-level name | `global count` |
| `nonlocal` rebinds an enclosing function's name | Closure counter |
| Assignment makes a name local | `x = ...` anywhere in the function body |
| Explain `UnboundLocalError` | Reading `count` before a later `count = 20` |
| Mutation does not need `global` | `history.append(value)` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does LEGB stand for? | Local, Enclosing, Global, Built-in |
| Which scope is searched first? | Local |
| Where do `len` and `print` live? | The built-in scope |
| Does an `if` or `for` block create a scope? | No |
| Do comprehension variables leak in Python 3? | No |
| What does `global` do? | Lets a function rebind a module-level name |
| What does `nonlocal` do? | Lets a nested function rebind an enclosing function's name |
| Can `nonlocal` refer to a global? | No |
| What makes a name local? | Any binding of it in the function body |
| What causes `UnboundLocalError`? | Reading a local name before it is assigned |

## 8. Interview-Ready Answer

> Scope determines where a name is visible. When Python looks up a name inside a function, it follows the LEGB rule: Local, then Enclosing function scopes, then Global module scope, then Built-ins, and it uses the first match. Assigning to a name anywhere inside a function makes it local for the whole function, which is why reading a global and then assigning to it later raises `UnboundLocalError`. To rebind a module-level name I would use `global`, and to rebind a variable from an enclosing function, for example in a closure counter, I would use `nonlocal`. Mutating an object, like appending to a global list, does not need either keyword. In practice I avoid `global` and pass state explicitly, because it makes code easier to test.

---

# Python Interview Question: `None` vs `False` vs `0` vs Empty Containers

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `None`, `False`, `0`, and an Empty Container?

**Answer:** These values have different types and meanings, but all of them evaluate as false in a Boolean condition. `None` means no value, `False` is a logical result, `0` is a valid number, and an empty container holds no elements. Use a specific check when the distinction matters.

| Value | Type | Typical meaning |
| --- | --- | --- |
| `None` | `NoneType` | No value, missing value, or no result |
| `False` | `bool` | A negative logical result |
| `0` | `int` | A valid numeric value of zero |
| `[]`, `{}`, `set()`, `()` | Collection types | A collection containing no elements |
| `""` | `str` | An empty string |

## 1. Meaning, Type, and Truth Value Are Different Things

### Every One of These Is Falsy

```python
values = [None, False, 0, [], {}, set(), (), ""]
for value in values:
    print(repr(value), bool(value))
# Every Boolean conversion above is False
```

Output:

```text
None False
False False
0 False
[] False
{} False
set() False
() False
'' False
```

### But Their Types Differ

```python
values = [None, False, 0, [], {}, set(), (), ""]
print([type(value).__name__ for value in values])
# ['NoneType', 'bool', 'int', 'list', 'dict', 'set', 'tuple', 'str']
```

### And They Are Not Equal to Each Other (Mostly)

```python
print(None == False)  # False
print(None == 0)      # False
print([] == ())       # False
print([] == False)    # False
print(0 == 0.0)       # True
print(False == 0)     # True
```

Being falsy does not make two values equal. `None` is equal only to itself. The one surprising row is `False == 0`, explained in section 4.

### What Makes an Object Falsy

Python's truth testing considers an object false if:

| Rule | Examples |
| --- | --- |
| It is `None` or `False` | `None`, `False` |
| It is a numeric zero | `0`, `0.0`, `0j`, `Decimal(0)` |
| It is an empty sequence or collection | `""`, `[]`, `()`, `{}`, `set()`, `range(0)` |
| Its class defines `__bool__` returning `False` | Custom objects |
| Its class defines `__len__` returning `0` (and no `__bool__`) | Custom containers |

Everything else is truthy, including `"0"`, `" "`, `[0]`, and `[None]`.

```python
print(bool("0"))     # True
print(bool([0]))     # True
print(bool(-1))      # True
print(bool(0.0))     # False
```

## 2. Use `is None` When You Specifically Want to Check for Absence

A valid zero should not accidentally be treated as missing.

### The Bug: A Truthiness Check Rejects a Real Zero

```python
score = 0
if not score:
    print("Missing score")  # Wrong: treats a valid zero as missing
```

This prints `Missing score`, even though `0` is a real score.

### The Fix: Check Specifically for `None`

```python
score = 0
if score is None:
    print("Missing score")
else:
    print(f"Score: {score}")  # Score: 0
```

### A Common ML Version: Default Hyperparameters

```python
def configure(learning_rate=None, dropout=None):
    learning_rate = learning_rate if learning_rate is not None else 0.001
    dropout = dropout or 0.5     # Bug: an explicit 0.0 is replaced
    return learning_rate, dropout

print(configure(dropout=0.0))  # (0.001, 0.5)
```

The caller asked for no dropout, but `or` replaced `0.0` with `0.5`. The `is not None` style used for `learning_rate` is the safe version.

```python
def configure(learning_rate=None, dropout=None):
    if learning_rate is None:
        learning_rate = 0.001
    if dropout is None:
        dropout = 0.5
    return learning_rate, dropout

print(configure(dropout=0.0))  # (0.001, 0.0)
```

| Pattern | Treats `0` / `""` / `[]` as missing? |
| --- | --- |
| `if not value:` | Yes |
| `value or default` | Yes |
| `if value is None:` | No |
| `default if value is None else value` | No |

## 3. Use `if not items` When You Intentionally Check for an Empty Collection

When every falsy value really means "nothing to do," the truthiness check is idiomatic and recommended by PEP 8.

```python
def average_loss(losses):
    if not losses:
        return None
    return sum(losses) / len(losses)

print(average_loss([0.4, 0.6]))  # 0.5
print(average_loss([]))          # None
```

`if not losses` is clearer than `if len(losses) == 0`. However, it treats `None` and `[]` the same way. That is fine here, but not when they mean different things.

### When `None` and `[]` Mean Different Things

An empty list might mean "the search finished but found nothing," while `None` might mean "no result was provided." Your application defines these meanings.

```python
def describe(results):
    if results is None:
        return "Search not run yet"
    if not results:
        return "Search ran, nothing found"
    return f"Found {len(results)} results"

print(describe(None))         # Search not run yet
print(describe([]))           # Search ran, nothing found
print(describe(["doc1"]))     # Found 1 results
```

### Caution: NumPy Arrays and pandas Objects

`if not array` does not mean "is empty" for NumPy arrays. A multi-element array raises `ValueError` because its truth value is ambiguous. Use `array.size == 0` for NumPy and `df.empty` for pandas.

```python
import numpy as np

predictions = np.array([0, 1])

try:
    if not predictions:
        pass
except ValueError:
    print("Truth value of a multi-element array is ambiguous.")

print(predictions.size == 0)  # False
```

## 4. `False == 0` Is `True`, but `False is 0` Is Not a Valid Comparison

`bool` is a subclass of `int`. `True` behaves like `1` and `False` behaves like `0` in arithmetic and equality.

```python
print(issubclass(bool, int))   # True
print(False == 0)              # True
print(True == 1)               # True
print(True + True)             # 2
print(sum([True, False, True]))  # 2
```

The last line is useful in ML: summing a list of Boolean "correct prediction" flags counts the correct predictions.

`False is 0` is a different question: are these the same object? They are not, and using `is` with a literal triggers a `SyntaxWarning` in Python 3.8+. Do not use `is` to compare values.

```python
zero = 0
print(False is zero)  # False
```

Because `False == 0` and their hashes match, they collide as dictionary keys:

```python
counts = {0: "zero"}
counts[False] = "false"

print(counts)  # {0: 'false'}
```

The key stays `0` and the value is replaced, because `False` and `0` count as the same key.

## 5. Don't Assume Every Falsy Value Means "Missing"

| Value | Usually means | Wrong to treat as missing when |
| --- | --- | --- |
| `None` | Missing or not provided | Rarely wrong |
| `0` / `0.0` | A real zero | Counts, scores, dropout, bias terms |
| `False` | A real "no" answer | A flag the user set explicitly |
| `""` | An empty string | An optional suffix or empty text field |
| `[]` / `{}` | An empty collection | A completed search with no matches |

> **Useful rule:** Use a specific check when the distinction matters. Use a truthiness check when all falsy values should be handled the same way.

## 6. Follow-Up: How Do You Check for Missing Values in pandas or NumPy Data?

`None` is not the only missing-value marker in data work. pandas uses `NaN` (and `pd.NA` / `NaT`) for missing entries. `NaN` is truthy and is not equal to itself, so neither `is None` nor `==` finds it.

```python
import math

value = float("nan")

print(bool(value))        # True
print(value == value)     # False
print(value is None)      # False
print(math.isnan(value))  # True
```

Use `math.isnan()` for a single float, and `pd.isna()` or `df.isna()` for pandas data.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Distinguish meaning, type, and truth value | All are falsy, but types and meanings differ |
| Use `is None` to check for absence | `if score is None:` |
| Use `if not items` for intentional empty checks | `if not losses: return None` |
| `False == 0` because `bool` subclasses `int` | `True + True == 2` |
| `False is 0` is not a valid value comparison | Use `==` for values, `is` for identity |
| Not every falsy value means missing | A score of `0` is valid |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What type is `None`? | `NoneType` |
| Are `None`, `False`, `0`, `""`, and `[]` all falsy? | Yes |
| Is `None == False`? | No |
| Is `False == 0`? | Yes; `bool` is a subclass of `int` |
| Should you write `False is 0`? | No; it compares identity and warns |
| Is `"0"` truthy? | Yes; it is a non-empty string |
| Is `[0]` truthy? | Yes; the list is not empty |
| How do you check for a missing value? | `x is None` |
| Why is `value or default` risky? | It replaces valid falsy values such as `0` |
| How do you check if a NumPy array is empty? | `array.size == 0` |

## 9. Interview-Ready Answer

> `None`, `False`, `0`, and empty containers are all falsy, so they all fail an `if` check, but they mean different things. `None` represents a missing value or no result, `False` is a logical answer, `0` is a valid number, and an empty list or dict is a collection with no elements. When the distinction matters, such as a score of zero or a dropout of `0.0`, I check `if value is None` instead of `if not value`, because truthiness would treat the valid zero as missing. When all empty or falsy values should be handled the same way, `if not items` is idiomatic. I also know that `False == 0` is `True` because `bool` is a subclass of `int`, but I never compare values with `is`.

---

# Python Interview Question: `append()` vs `extend()`

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `append()` and `extend()`?

**Answer:** `append()` adds its argument as **one element** at the end of a list. `extend()` iterates over its argument and adds **each element separately**. Both modify the original list in place and return `None`.

| Operation | Effect |
| --- | --- |
| `items.append(value)` | Adds `value` as one element |
| `items.extend(iterable)` | Adds each element from the iterable |

## 1. Adding One Object vs Adding the Elements of an Iterable

### `append()` Adds Exactly One Element

```python
numbers = [1, 2]
numbers.append(3)

print(numbers)       # [1, 2, 3]
print(len(numbers))  # 3
```

Whatever you pass becomes the new last element, whether it is a number, a string, a tuple, or another list. The length always grows by exactly one.

### `extend()` Adds Each Element of an Iterable

```python
numbers = [1, 2]
numbers.extend((3, 4, 5))

print(numbers)       # [1, 2, 3, 4, 5]
print(len(numbers))  # 5
```

The length grows by the number of elements in the iterable. `extend()` accepts any iterable: a list, tuple, set, range, generator, or dictionary.

```python
batch_ids = [0]
batch_ids.extend(range(1, 4))
print(batch_ids)  # [0, 1, 2, 3]

columns = ["id"]
columns.extend({"age": 30, "income": 5000})
print(columns)  # ['id', 'age', 'income']

squares = []
squares.extend(n * n for n in range(4))
print(squares)  # [0, 1, 4, 9]
```

Extending with a dictionary adds its keys, because iterating over a dictionary yields keys.

### `extend()` Requires an Iterable

```python
numbers = [1, 2]

try:
    numbers.extend(3)
except TypeError as error:
    print(error)  # 'int' object is not iterable
```

To add one number, use `append(3)` or `extend([3])`.

## 2. What Happens When You Add a List to Another List

This is the case interviewers usually ask about.

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

`append()` creates a nested list. The new last element is the list `[3, 4]` itself.

```python
numbers = [1, 2]
numbers.append([3, 4])

print(len(numbers))  # 3
print(numbers[-1])   # [3, 4]
```

### Appended Lists Are Shared, Not Copied

`append()` stores a reference to the object you pass, so later changes to that object show up inside the outer list.

```python
row = [0.1, 0.2]
matrix = []
matrix.append(row)

row.append(0.3)
print(matrix)  # [[0.1, 0.2, 0.3]]
```

`extend()` copies the element references into the list, so changing the source list later does not change the target. The elements themselves are still shared if they are mutable.

```python
source = [1, 2]
target = [0]
target.extend(source)

source.append(3)
print(target)  # [0, 1, 2]
```

### A String Is Also an Iterable

```python
letters = ["a"]
letters.extend("bc")
print(letters)  # ['a', 'b', 'c']
```

This is a common surprise when building a list of tokens or labels:

```python
labels = ["cat"]
labels.extend("dog")
print(labels)  # ['cat', 'd', 'o', 'g']

labels = ["cat"]
labels.append("dog")
print(labels)  # ['cat', 'dog']
```

To add one string, use `append()`. To add several strings, pass a list of them to `extend()`.

| Call | Result starting from `[1, 2]` |
| --- | --- |
| `append(3)` | `[1, 2, 3]` |
| `append([3, 4])` | `[1, 2, [3, 4]]` |
| `extend([3, 4])` | `[1, 2, 3, 4]` |
| `extend((3, 4))` | `[1, 2, 3, 4]` |
| `extend("ab")` | `[1, 2, 'a', 'b']` |
| `extend(3)` | `TypeError` |

## 3. Both Modify the Original List and Return `None`

### The Common Mistake

```python
numbers = [1, 2]
result = numbers.append(3)
print(result)   # None
print(numbers)  # [1, 2, 3]
```

Methods that change a list in place, such as `append()`, `extend()`, `sort()`, and `reverse()`, return `None`. This makes it clear that no new list was created.

A typical bug is reassigning the result:

```python
features = ["age", "income"]
features = features.extend(["score"])

print(features)  # None
```

The list was extended, but the name `features` now refers to `None`, so the list is lost. Call the method without assigning:

```python
features = ["age", "income"]
features.extend(["score"])

print(features)  # ['age', 'income', 'score']
```

### In-Place Changes Are Visible Through Every Reference

```python
history = [0.9]
alias = history

history.extend([0.7, 0.5])
print(alias)  # [0.9, 0.7, 0.5]
```

## 4. Follow-Up: How Do `+`, `+=`, and Slice Assignment Compare?

`+` creates a **new list** and requires both operands to be lists. `+=` on a list behaves like `extend()`: it modifies the list in place and accepts any iterable.

```python
base = [1, 2]
alias = base

combined = base + [3]
print(combined)  # [1, 2, 3]
print(base)      # [1, 2]

base += (3, 4)
print(base)           # [1, 2, 3, 4]
print(alias is base)  # True

try:
    base + (5,)
except TypeError as error:
    print(error)  # can only concatenate list (not "tuple") to list
```

Slice assignment can also insert many elements at any position:

```python
numbers = [1, 4]
numbers[1:1] = [2, 3]
print(numbers)  # [1, 2, 3, 4]

numbers.insert(0, 0)
print(numbers)  # [0, 1, 2, 3, 4]
```

| Operation | Creates a new list? | Accepts any iterable? | Where it adds |
| --- | --- | --- | --- |
| `a.append(x)` | No | Not applicable (adds one object) | End |
| `a.extend(it)` | No | Yes | End |
| `a += it` | No | Yes | End |
| `a + b` | Yes | No; `b` must be a list | End of the copy |
| `a.insert(i, x)` | No | Not applicable (adds one object) | Index `i` |
| `a[i:i] = it` | No | Yes | Index `i` |

### Performance

`append()` is O(1) amortized. `extend()` is O(k), where k is the number of elements added. Calling `extend()` once is usually faster than calling `append()` in a Python loop for each element, because the loop runs in C. Repeated `a = a + b` in a loop copies the list each time and can become quadratic.

```python
losses = []
for epoch_losses in [[0.9, 0.8], [0.7], [0.6, 0.5]]:
    losses.extend(epoch_losses)

print(losses)  # [0.9, 0.8, 0.7, 0.6, 0.5]
```

## 5. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `append()` adds one object | `append([3, 4])` gives `[1, 2, [3, 4]]` |
| `extend()` adds each element of an iterable | `extend([3, 4])` gives `[1, 2, 3, 4]` |
| A string is an iterable | `extend("bc")` adds `'b'` and `'c'` |
| Both modify the original list | Aliases see the change |
| Both return `None` | `result = numbers.append(3)` makes `result` `None` |

## 6. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `append()` add? | Its argument, as one element |
| What does `extend()` add? | Each element of its iterable argument |
| Result of `[1, 2].append([3, 4])`? | `[1, 2, [3, 4]]` |
| Result of `[1, 2].extend([3, 4])`? | `[1, 2, 3, 4]` |
| What does `extend("ab")` add? | `'a'` and `'b'` separately |
| What does `extend(3)` do? | Raises `TypeError` |
| What do both methods return? | `None` |
| Do they create a new list? | No; they modify the list in place |
| How is `+=` on a list like `extend()`? | It modifies in place and accepts any iterable |
| How is `+` different? | It creates a new list and needs a list operand |

## 7. Interview-Ready Answer

> `append()` adds its argument to the end of a list as a single element, so appending `[3, 4]` to `[1, 2]` gives a nested list `[1, 2, [3, 4]]`. `extend()` iterates over its argument and adds each element separately, giving `[1, 2, 3, 4]`. Because `extend()` iterates, extending with a string adds individual characters, and passing a non-iterable like an integer raises `TypeError`. Both methods modify the list in place and return `None`, so writing `items = items.append(x)` is a bug. For comparison, `+=` on a list behaves like `extend()`, while `+` creates a new list.

---

# Python Interview Question: Removing Duplicates While Preserving Order

**Difficulty:** 🟡 Intermediate

## Question: How Do You Remove Duplicates From a List While Preserving Order?

**Answer:** For **hashable elements**, use `list(dict.fromkeys(items))`. Dictionaries preserve insertion order and store each key only once, so each value keeps the position where it first appears. A loop with a `seen` set does the same thing explicitly. For **unhashable elements**, such as lists, fall back to equality checks or convert each element to a hashable form.

| Approach | Preserves order? | Element requirement | Expected time |
| --- | --- | --- | --- |
| `list(dict.fromkeys(items))` | Yes | Hashable | O(n) |
| Loop with a `seen` set | Yes | Hashable | O(n) |
| Loop with `not in` a list | Yes | Supports `==` | O(n²) comparisons |
| `list(set(items))` | No guarantee | Hashable | O(n) |

## 1. Keep Each Value at the Position Where It First Appears

"Preserving order" means the result lists each distinct value once, in the order of its **first** occurrence.

```python
numbers = [3, 1, 3, 2, 1, 4]
unique_numbers = list(dict.fromkeys(numbers))
print(unique_numbers)  # [3, 1, 2, 4]
```

`3` comes first because it appears first. Its second occurrence is ignored.

### Why `dict.fromkeys()` Works

`dict.fromkeys(iterable)` builds a dictionary whose keys come from the iterable, each with the value `None`. Inserting a key that already exists does not move it. Since Python 3.7, dictionaries are guaranteed to preserve insertion order.

```python
numbers = [3, 1, 3, 2, 1, 4]
print(dict.fromkeys(numbers))  # {3: None, 1: None, 2: None, 4: None}
```

### The Explicit Approach: Track Seen Values in a Set

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

Both approaches take **O(n) expected time** for ordinary hashable values, because set and dictionary membership checks are O(1) on average. `dict.fromkeys()` is shorter and runs its loop in C. The explicit loop is easier to customize.

### Deduplicating by a Key

The loop version can deduplicate by part of each element. For example, keep the first record for each user ID:

```python
records = [
    {"user_id": 7, "score": 0.91},
    {"user_id": 3, "score": 0.75},
    {"user_id": 7, "score": 0.60},
]

seen_ids = set()
first_records = []

for record in records:
    if record["user_id"] not in seen_ids:
        seen_ids.add(record["user_id"])
        first_records.append(record)

print([record["score"] for record in first_records])  # [0.91, 0.75]
```

To keep the **last** occurrence instead, a dictionary comprehension can overwrite values while keeping each key's first position:

```python
records = [
    {"user_id": 7, "score": 0.91},
    {"user_id": 3, "score": 0.75},
    {"user_id": 7, "score": 0.60},
]

latest = {record["user_id"]: record for record in records}
print([record["score"] for record in latest.values()])  # [0.6, 0.75]
```

Assigning to an existing key replaces its value but does not change its position.

## 2. Why `list(set(items))` Does Not Guarantee Order

A set removes duplicates, but it does not remember insertion order. Its iteration order depends on hash values and the table's internal layout.

```python
words = ["nlp", "ml", "nlp", "cv", "ml"]

print(list(dict.fromkeys(words)))  # ['nlp', 'ml', 'cv']
print(sorted(set(words)))          # ['cv', 'ml', 'nlp']
```

`list(set(words))` may come back in any order. For strings, the order can even change between runs, because string hashing is randomized per process by default (see `PYTHONHASHSEED`).

For small integers, a set may *appear* to preserve or sort order because CPython hashes small integers to themselves. That is a coincidence of the implementation, not a guarantee:

```python
print(list(set([3, 1, 3, 2])))  # [1, 2, 3]
```

The output above happens to be sorted, not in first-appearance order `[3, 1, 2]`. Use `list(set(items))` only when order does not matter, and `sorted(set(items))` when you want sorted unique values.

| Goal | Use |
| --- | --- |
| Unique values, first-appearance order | `list(dict.fromkeys(items))` |
| Unique values, sorted | `sorted(set(items))` |
| Unique values, order irrelevant | `set(items)` |
| Count of unique values | `len(set(items))` |

## 3. Dictionary Keys and Set Elements Must Be Hashable

Both fast approaches rely on hashing. If the list contains unhashable elements, such as lists or dictionaries, they raise `TypeError`.

```python
rows = [[1, 2], [3, 4], [1, 2]]

try:
    list(dict.fromkeys(rows))
except TypeError as error:
    print(error)  # unhashable type: 'list'
```

### Option 1: Equality Checks (Simple, but Slow)

```python
rows = [[1, 2], [3, 4], [1, 2]]
unique_rows = []

for row in rows:
    if row not in unique_rows:
        unique_rows.append(row)

print(unique_rows)  # [[1, 2], [3, 4]]
```

`row not in unique_rows` scans the result list with `==`. This approach can need **O(n²) equality comparisons**, which is fine for small lists but slow for large datasets.

### Option 2: Convert Each Element to a Hashable Key

If the elements can be converted to a hashable form, such as lists to tuples, you get O(n) expected time again:

```python
rows = [[1, 2], [3, 4], [1, 2]]
seen = set()
unique_rows = []

for row in rows:
    key = tuple(row)
    if key not in seen:
        seen.add(key)
        unique_rows.append(row)

print(unique_rows)  # [[1, 2], [3, 4]]
```

For a list of flat dictionaries, `tuple(sorted(d.items()))` can serve as the key, provided the values are hashable.

| Element type | Approach |
| --- | --- |
| `int`, `str`, `tuple` of hashables | `dict.fromkeys()` or a `seen` set |
| Lists | Convert to `tuple` as the key |
| Flat dictionaries | `tuple(sorted(d.items()))` as the key |
| Arbitrary objects with only `==` | Equality scan, O(n²) |

### Watch Out: Equal Values Count as Duplicates

Hash-based deduplication uses equality. Values that compare equal, such as `1`, `1.0`, and `True`, are treated as the same, and the first one wins.

```python
values = [1, 1.0, True, 2]
print(list(dict.fromkeys(values)))  # [1, 2]
```

## 4. Follow-Up: How Do You Do This in pandas?

For tabular data, pandas has built-in methods that keep the first occurrence by default:

```python
import pandas as pd

labels = pd.Series(["cat", "dog", "cat", "bird"])
print(labels.drop_duplicates().tolist())  # ['cat', 'dog', 'bird']
print(list(labels.unique()))              # ['cat', 'dog', 'bird']
```

`DataFrame.drop_duplicates(subset=["user_id"], keep="first")` deduplicates rows by selected columns. `keep="last"` keeps the last occurrence instead.

## 5. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Keep each value at its first position | `[3, 1, 3, 2, 1, 4]` becomes `[3, 1, 2, 4]` |
| Use `dict.fromkeys()` for hashable values | `list(dict.fromkeys(items))` |
| Know the explicit `seen` set pattern | Supports deduplication by a key |
| `list(set(items))` does not guarantee order | Set order depends on hashes |
| Keys and set elements must be hashable | Lists raise `TypeError` |
| Know the cost of each approach | O(n) expected vs O(n²) comparisons |

## 6. Quick Revision

| Question | Short answer |
| --- | --- |
| Shortest order-preserving dedup? | `list(dict.fromkeys(items))` |
| Since when do dicts preserve insertion order? | Guaranteed since Python 3.7 |
| Does `list(set(items))` preserve order? | No guarantee |
| How do you get sorted unique values? | `sorted(set(items))` |
| Time complexity of the set or dict approach? | O(n) expected |
| What if the elements are lists? | Use tuples as keys, or an O(n²) equality scan |
| Why does `dict.fromkeys(rows)` fail on lists? | Lists are unhashable |
| How do you dedupe by a field? | Track the field value in a `seen` set |
| Are `1` and `1.0` duplicates? | Yes; they compare equal |
| pandas equivalent? | `drop_duplicates()` or `unique()` |

## 7. Interview-Ready Answer

> For hashable values, I use `list(dict.fromkeys(items))`, because dictionaries keep keys unique and preserve insertion order, so each value stays at its first position. An equivalent explicit version loops over the list and uses a `seen` set, which also lets me deduplicate by a field such as a user ID. Both run in O(n) expected time. I avoid `list(set(items))` when order matters, because sets do not guarantee any order. If the elements are unhashable, like lists, I convert each one to a tuple for the `seen` set, or fall back to an equality scan, which costs O(n²) comparisons.

---

# Python Interview Question: List Slicing and Negative Indices

**Difficulty:** 🟢 Beginner

## Question: How Does List Slicing Work, Including Negative Indices?

**Answer:** The slicing syntax is `items[start:stop:step]`. The slice begins at `start`, stops before `stop`, and moves by `step` positions each time. Negative indices count from the end, so `-1` is the last element. Slicing a list creates a new, shallow list.

| Part | Meaning | Default |
| --- | --- | --- |
| `start` | Index where the slice begins | Beginning (or end, when `step` is negative) |
| `stop` | Index where the slice stops; this position is excluded | End (or past the beginning, when `step` is negative) |
| `step` | How far to move between elements; cannot be zero | `1` |

## 1. `start`, `stop`, and `step`

Any of the three parts can be omitted. Omitted parts use their defaults.

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[1:4])   # [20, 30, 40]
print(numbers[:3])    # [10, 20, 30]
print(numbers[2:])    # [30, 40, 50]
print(numbers[:])     # [10, 20, 30, 40, 50]
print(numbers[::2])   # [10, 30, 50]
print(numbers[1::2])  # [20, 40]
```

| Expression | Meaning | Result |
| --- | --- | --- |
| `numbers[1:4]` | Indices 1, 2 and 3 | `[20, 30, 40]` |
| `numbers[:3]` | From the beginning up to index 3 | `[10, 20, 30]` |
| `numbers[2:]` | From index 2 to the end | `[30, 40, 50]` |
| `numbers[::2]` | Every second element | `[10, 30, 50]` |
| `numbers[1::2]` | Every second element, starting at index 1 | `[20, 40]` |

### The Step Cannot Be Zero

```python
numbers = [10, 20, 30, 40, 50]

try:
    numbers[::0]
except ValueError as error:
    print(error)  # slice step cannot be zero
```

### Slicing Works on Other Sequences

The same syntax works on strings, tuples, and `range` objects. Each returns an object of its own type.

```python
print("Python"[1:4])           # yth
print((1, 2, 3, 4)[::2])       # (1, 3)
print(range(10)[2:8:2])        # range(2, 8, 2)
print(list(range(10)[2:8:2]))  # [2, 4, 6]
```

### A Slice Is a `slice` Object

`items[1:4]` is equivalent to `items[slice(1, 4)]`. Named slice objects can make repeated column or window selections readable.

```python
row = ["2024-01-01", "sensor_7", 21.5, 0.43, "ok"]

measurements = slice(2, 4)

print(row[measurements])  # [21.5, 0.43]
print(measurements.indices(len(row)))  # (2, 4, 1)
```

`slice.indices(length)` shows the concrete `(start, stop, step)` values Python uses for a sequence of that length.

## 2. The Stop Index Is Excluded

The element at `stop` is never included. This half-open design has useful consequences:

- `len(items[a:b])` equals `b - a` when `0 <= a <= b <= len(items)`.
- `items[:k]` and `items[k:]` split a list into two parts with no overlap and no gap.

```python
numbers = [10, 20, 30, 40, 50]

print(len(numbers[1:4]))  # 3
print(numbers[:2] + numbers[2:] == numbers)  # True
```

### Practical ML Example: Train/Test Split

```python
samples = list(range(10))  # Imagine 10 shuffled training examples

split = int(len(samples) * 0.8)

train = samples[:split]
test = samples[split:]

print(train)  # [0, 1, 2, 3, 4, 5, 6, 7]
print(test)   # [8, 9]
print(len(train) + len(test) == len(samples))  # True
```

Because `stop` is excluded, the same `split` value can be used for both slices without losing or duplicating a sample.

### Empty Slices

If `start` is already at or past `stop` for a positive step, the slice is empty rather than an error.

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[3:1])  # []
print(numbers[2:2])  # []
```

## 3. Negative Indices and Reverse Slicing

### Negative Indices Count from the End

For a list of length `n`, the negative index `-k` refers to the same position as `n - k`.

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[-1])    # 50
print(numbers[-2])    # 40
print(numbers[-3:])   # [30, 40, 50]
print(numbers[:-1])   # [10, 20, 30, 40]
print(numbers[-4:-1]) # [20, 30, 40]
```

| Index | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Value | 10 | 20 | 30 | 40 | 50 |
| Negative index | -5 | -4 | -3 | -2 | -1 |

Common idioms: `items[-k:]` takes the last `k` elements, and `items[:-k]` drops the last `k` elements.

### Negative Step Moves Backward

With a negative `step`, the slice starts at `start` and moves toward the beginning. The `stop` index is still excluded.

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[::-1])     # [50, 40, 30, 20, 10]
print(numbers[4:1:-1])   # [50, 40, 30]
print(numbers[::-2])     # [50, 30, 10]
print(numbers[-1:-4:-1]) # [50, 40, 30]
```

In `numbers[4:1:-1]`, the slice visits indices 4, 3 and 2. Index 1 is excluded.

### Pitfall: Direction Must Match the Boundaries

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[1:4:-1])  # []
```

With a negative step, `start` must be to the right of `stop`, otherwise the slice is empty.

### `[::-1]` vs `reversed()` vs `.reverse()`

| Option | Returns | Modifies the original? |
| --- | --- | --- |
| `numbers[::-1]` | A new reversed list | No |
| `reversed(numbers)` | A reverse iterator | No |
| `numbers.reverse()` | `None` | Yes, in place |

## 4. Slicing Creates a New, Shallow List

A list slice is a new list object. Changing the new list's structure does not affect the original.

```python
original = [10, 20, 30]
copy = original[:]

copy.append(40)

print(original)          # [10, 20, 30]
print(copy)              # [10, 20, 30, 40]
print(copy is original)  # False
```

### The Copy Is Shallow

The new list contains references to the same element objects. Nested mutable objects are shared.

```python
batches = [[1, 2], [3, 4]]
copy = batches[:]

copy[0].append(99)

print(batches)                   # [[1, 2, 99], [3, 4]]
print(copy[0] is batches[0])     # True
```

Use `copy.deepcopy()` when nested objects must be independent.

**Comparison note:** NumPy array slicing behaves differently. A basic NumPy slice is usually a *view* that shares memory with the original array, so modifying the slice can modify the original. Python list slicing always builds a new list.

## 5. Follow-Up: Out-of-Range Slices and Slice Assignment

### Slices Tolerate Out-of-Range Boundaries; Indexing Does Not

Slice boundaries are clamped to the valid range. A single index must refer to an existing element.

```python
numbers = [10, 20, 30, 40, 50]

print(numbers[:100])    # [10, 20, 30, 40, 50]
print(numbers[-100:2])  # [10, 20]
print(numbers[10:20])   # []

try:
    print(numbers[100])
except IndexError as error:
    print(error)  # list index out of range
```

| Expression | Result |
| --- | --- |
| `numbers[:100]` | Whole list |
| `numbers[10:20]` | `[]` |
| `numbers[100]` | `IndexError` |

This tolerance can hide bugs. For example, `samples[:batch_size]` silently returns fewer items when the list is shorter than expected.

### Slice Assignment Modifies the List in Place

A slice on the left side of `=` replaces that part of the existing list. A simple slice can be replaced by a sequence of a different length.

```python
numbers = [10, 20, 30, 40, 50]
alias = numbers

numbers[1:3] = [99]

print(numbers)           # [10, 99, 40, 50]
print(alias is numbers)  # True
```

An extended slice (with a step other than 1) requires a replacement of the same length:

```python
numbers = [10, 20, 30, 40, 50]

numbers[::2] = [0, 0, 0]
print(numbers)  # [0, 20, 0, 40, 0]

try:
    numbers[::2] = [1]
except ValueError as error:
    print(error)  # attempt to assign sequence of size 1 to extended slice of size 3
```

`del` also works with slices:

```python
numbers = [10, 20, 30, 40, 50]

del numbers[::2]
print(numbers)  # [20, 40]
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Explain `start`, `stop`, and `step` | `numbers[1:4]`, `numbers[::2]` |
| The stop index is excluded | `numbers[1:4]` returns indices 1 to 3 |
| Negative indices count from the end | `numbers[-1]` is the last element |
| A negative step slices backward | `numbers[::-1]` reverses |
| Slicing creates a new, shallow list | `copy = items[:]` shares nested objects |
| Slices clamp boundaries; indexing does not | `numbers[:100]` works, `numbers[100]` raises `IndexError` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is the slice syntax? | `items[start:stop:step]` |
| Is `stop` included? | No; it is excluded |
| What does `-1` refer to? | The last element |
| How do you reverse a list with slicing? | `items[::-1]` |
| What does `items[-3:]` return? | The last three elements |
| Can `step` be zero? | No; it raises `ValueError` |
| Does `items[:100]` fail on a short list? | No; slice boundaries are clamped |
| Does `items[100]` fail on a short list? | Yes; it raises `IndexError` |
| Is a list slice a copy? | Yes, a new shallow copy |
| Does slice assignment create a new list? | No; it modifies the existing list in place |

## 8. Interview-Ready Answer

> List slicing uses `items[start:stop:step]`, where `start` is included, `stop` is excluded, and `step` controls the direction and spacing. Negative indices count from the end, so `-1` is the last element and `items[-3:]` returns the last three elements. A negative step slices backward, which is why `items[::-1]` returns a reversed copy. Slice boundaries that are out of range are clamped, but indexing a single missing position raises `IndexError`. Finally, slicing a list creates a new, shallow list: the outer list is new, but nested objects are still shared with the original.

---

# Python Interview Question: `sorted()` vs `.sort()`

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `sorted()` and `.sort()`?

**Answer:** `sorted()` accepts any iterable and returns a **new sorted list**, leaving the input unchanged. `list.sort()` is a list method that sorts the existing list **in place** and returns `None`. Both accept `key` and `reverse`, and both are stable.

| Feature | `sorted()` | `.sort()` |
| --- | --- | --- |
| Kind | Built-in function | Method of `list` |
| Accepted input | Any iterable of sortable elements | A list |
| Modifies the original | No | Yes |
| Return value | New list | `None` |
| Supports `key` and `reverse` | Yes | Yes |
| Stable | Yes | Yes |

## 1. Creating a New List vs Modifying an Existing One

### `sorted()` Leaves the Original Unchanged

```python
numbers = [3, 1, 2]
ordered = sorted(numbers)

print(ordered)            # [1, 2, 3]
print(numbers)            # [3, 1, 2]
print(ordered is numbers) # False
```

### `.sort()` Changes the List Itself

```python
numbers = [3, 1, 2]
alias = numbers

numbers.sort()

print(numbers)  # [1, 2, 3]
print(alias)    # [1, 2, 3]
```

Every name that refers to the list sees the sorted order, because there is only one list object.

### `sorted()` Works on Any Iterable

`.sort()` exists only on lists. `sorted()` accepts tuples, strings, sets, dictionaries, generators, and other iterables. It always returns a list.

```python
print(sorted((3, 1, 2)))                # [1, 2, 3]
print(sorted("python"))                 # ['h', 'n', 'o', 'p', 't', 'y']
print(sorted({"b": 2, "a": 1}))         # ['a', 'b']
print(sorted(n * n for n in [3, -1, 2]))  # [1, 4, 9]

try:
    (3, 1, 2).sort()
except AttributeError as error:
    print(error)  # 'tuple' object has no attribute 'sort'
```

Sorting a dictionary directly sorts its **keys**. Use `.items()` to sort key-value pairs.

### Which One Should You Use?

| Situation | Better choice |
| --- | --- |
| You need to keep the original order | `sorted()` |
| The input is not a list | `sorted()` |
| You own the list and no longer need the old order | `.sort()` |
| The list is large and you want to avoid a second list | `.sort()` |

`sorted()` builds a new list of all the elements and then sorts it, so it uses extra memory proportional to the number of elements. `.sort()` reorders the existing list.

## 2. What Each One Returns

### Pitfall: Assigning the Result of `.sort()`

```python
numbers = [3, 1, 2]
result = numbers.sort()

print(numbers)  # [1, 2, 3]
print(result)   # None
```

A common bug is `numbers = numbers.sort()`, which sorts the list and then rebinds `numbers` to `None`.

```python
numbers = [3, 1, 2]
numbers = numbers.sort()

print(numbers)  # None
```

Returning `None` is a Python convention for methods that mutate an object in place, such as `list.append()`, `list.reverse()`, and `dict.update()`. It signals that no new object was created.

### Pitfall: Chaining `.sort()`

```python
scores = [0.9, 0.7, 0.8]

try:
    best = scores.sort()[0]
except TypeError as error:
    print(error)  # 'NoneType' object is not subscriptable

best = sorted(scores)[-1]
print(best)  # 0.9
```

| Expression | Value |
| --- | --- |
| `sorted([3, 1, 2])` | `[1, 2, 3]` |
| `[3, 1, 2].sort()` | `None` |
| `sorted("cab")` | `['a', 'b', 'c']` |

## 3. `key`, `reverse`, and Stable Sorting

### `key`: Sort by a Computed Value

`key` is a function that is called once for each element. Elements are compared by the values it returns.

```python
words = ["banana", "fig", "Cherry", "apple"]

print(sorted(words))                 # ['Cherry', 'apple', 'banana', 'fig']
print(sorted(words, key=len))        # ['fig', 'apple', 'banana', 'Cherry']
print(sorted(words, key=str.lower))  # ['apple', 'banana', 'Cherry', 'fig']
```

By default, strings are compared by character code points, so uppercase letters sort before lowercase letters. `key=str.lower` gives case-insensitive ordering.

### Practical ML Example: Rank Models by Accuracy

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

`operator.itemgetter("accuracy")` is an equivalent, slightly faster alternative to the lambda.

### Sort a Dictionary by Its Values

```python
feature_importance = {"age": 0.2, "income": 0.5, "experience": 0.3}

top_features = sorted(
    feature_importance.items(),
    key=lambda item: item[1],
    reverse=True,
)

print(top_features)  # [('income', 0.5), ('experience', 0.3), ('age', 0.2)]
print(dict(top_features))  # {'income': 0.5, 'experience': 0.3, 'age': 0.2}
```

### Stable Sorting

Both sorts are **stable**: elements with equal keys keep their original relative order. `reverse=True` also preserves stability; equal elements are not reversed relative to each other.

```python
runs = [
    ("run_a", 0.90),
    ("run_b", 0.85),
    ("run_c", 0.90),
    ("run_d", 0.85),
]

print(sorted(runs, key=lambda run: run[1]))
# [('run_b', 0.85), ('run_d', 0.85), ('run_a', 0.9), ('run_c', 0.9)]

print(sorted(runs, key=lambda run: run[1], reverse=True))
# [('run_a', 0.9), ('run_c', 0.9), ('run_b', 0.85), ('run_d', 0.85)]
```

`run_a` stays ahead of `run_c`, and `run_b` stays ahead of `run_d`, in both directions.

### Sorting by Multiple Criteria

Return a tuple from `key`. Tuples are compared element by element.

```python
models = [
    ("svm", 0.91, 12.0),
    ("rf", 0.93, 30.0),
    ("xgb", 0.93, 18.0),
]

# Highest accuracy first; for ties, shortest training time first
ranked = sorted(models, key=lambda m: (-m[1], m[2]))
print([name for name, _, _ in ranked])  # ['xgb', 'rf', 'svm']
```

Negation works for numeric keys. For non-numeric mixed directions, stability allows sorting in multiple passes, starting with the least important key:

```python
models = [
    ("svm", 0.91, 12.0),
    ("rf", 0.93, 30.0),
    ("xgb", 0.93, 18.0),
]

models.sort(key=lambda m: m[2])                # secondary key first
models.sort(key=lambda m: m[1], reverse=True)  # primary key last
print([name for name, _, _ in models])  # ['xgb', 'rf', 'svm']
```

## 4. Follow-Up: Common Errors and Performance

### Elements Must Be Comparable

Python 3 does not order unrelated types, such as integers and strings.

```python
try:
    sorted([3, "two", 1])
except TypeError as error:
    print(error)  # '<' not supported between instances of 'str' and 'int'
```

`None` values in data are a frequent cause of this error. Filter them out or handle them in `key`, for example `key=lambda x: (x is None, x)` to place `None` values last.

### `key` and `reverse` Are Keyword-Only

```python
try:
    sorted([3, 1, 2], None, True)
except TypeError as error:
    print("Pass key and reverse by keyword.")
```

Python 3 removed the old `cmp` argument. To reuse a two-argument comparison function, wrap it with `functools.cmp_to_key()`.

### Complexity

CPython's list sorting algorithm is an adaptive, stable merge sort (Timsort and its later refinements). It runs in O(n log n) time in the worst case and can approach O(n) on data that is already mostly sorted. Both `sorted()` and `.sort()` use the same algorithm; the main difference is whether a new list is created.

## 5. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `sorted()` creates a new list | `ordered = sorted(numbers)` leaves `numbers` unchanged |
| `.sort()` modifies the existing list | `numbers.sort()` |
| `.sort()` returns `None` | `numbers = numbers.sort()` is a bug |
| `sorted()` accepts any iterable | `sorted("python")`, `sorted(my_dict)` |
| `key` customizes the sort order | `key=lambda model: model["accuracy"]` |
| `reverse=True` sorts in descending order | Rank models from best to worst |
| Sorting is stable | Ties keep their original order |

## 6. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `sorted()` return? | A new list |
| What does `.sort()` return? | `None` |
| Which one modifies the original? | `.sort()` |
| Can you call `.sort()` on a tuple? | No; use `sorted()` |
| What does `sorted(my_dict)` sort? | The dictionary's keys |
| How do you sort in descending order? | `reverse=True` |
| How often is the `key` function called? | Once per element |
| What does "stable" mean? | Equal keys keep their original relative order |
| How do you sort by two criteria? | Return a tuple from `key` |
| Can you sort `[1, "a"]` in Python 3? | No; it raises `TypeError` |

## 7. Interview-Ready Answer

> `sorted()` is a built-in function that accepts any iterable and returns a new sorted list, so the original data stays unchanged. `list.sort()` is a list method that sorts the list in place and returns `None`, which is why `numbers = numbers.sort()` is a common bug. Both accept a `key` function, called once per element, and a `reverse` flag. Both are stable, so items with equal keys keep their original order, which allows multi-pass sorting by several criteria. I use `sorted()` when I need to keep the original or when the input isn't a list, and `.sort()` when I own a list and want to avoid creating a copy.

---

# Python Interview Question: How Dictionaries Work Internally

**Difficulty:** 🟡 Intermediate

## Question: How Does a Dictionary Work Internally?

**Answer:** A Python dictionary is a **hash table** that maps keys to values. To insert or look up a key, Python computes the key's hash, uses it to find a candidate slot, and then checks that the stored key is equal to the requested key. When different keys compete for the same slot, Python probes other slots. Lookup, insertion, and deletion are **O(1) on average** and **O(n) in the worst case**.

| Concept | Meaning |
| --- | --- |
| Hash | An integer computed from the key by `hash(key)` |
| Slot | A position in the table chosen from the hash |
| Collision | Different keys mapping to the same slot |
| Probing | Trying other slots until the right key or an empty slot is found |
| Hashable key | A key whose hash is stable and consistent with equality |
| Insertion order | Iteration order is the order keys were first inserted (Python 3.7+) |

## 1. Hash Tables, Hashing, and Collisions

### The Lookup Process

```python
model_scores = {
    "logistic_regression": 0.88,
    "random_forest": 0.93,
}

print(model_scores["random_forest"])  # 0.93
```

Conceptually, `model_scores["random_forest"]` does the following:

1. Python calculates `hash("random_forest")`.
2. It uses that hash to choose a candidate slot in the table.
3. If the slot is empty, the key is not present and Python raises `KeyError`.
4. If the slot holds an entry, Python compares the stored hash and then the stored key with the requested key.
5. If the keys are equal, it returns the value. If not, a collision has occurred, and Python probes the next candidate slot.

Insertion follows the same search. If an equal key is found, its value is replaced. Otherwise, the new key-value pair is stored in an empty slot.

### CPython Implementation Details

These details are specific to CPython and can change between versions, but they are useful in an interview:

| Detail | CPython behavior |
| --- | --- |
| Layout | Since 3.6, a compact design: a small index table points into a dense array of `(hash, key, value)` entries |
| Collision resolution | Open addressing: probing other slots in the same table, not chaining linked lists |
| Probe sequence | Uses a pseudo-random perturbation of the hash so collisions spread out |
| Cached hashes | Each entry stores the key's hash, so comparisons can skip keys with different hashes, and resizing does not recompute hashes |
| Resizing | The table grows when it becomes about two-thirds full, so insertion is O(1) amortized |

The dense entries array is also why CPython dictionaries preserve insertion order.

### Hash Values Are Integers

```python
print(hash(42))                      # 42
print(hash((1, 2)) == hash((1, 2)))  # True
print(isinstance(hash("cat"), int))  # True
```

Do not rely on specific hash values for strings. In CPython, string and bytes hashes are randomized per process by default (controlled by `PYTHONHASHSEED`), so `hash("cat")` usually differs between runs.

## 2. Why Keys Must Be Hashable

A dictionary can find a key again only if two rules hold:

- **A key's hash must stay the same for its whole lifetime.** Otherwise Python would search in the wrong slot.
- **Equal keys must have equal hashes.** Otherwise two equal keys could be stored in different slots.

### Hashable and Unhashable Keys

```python
coordinates = {
    (10, 20): "Location A",  # Tuple of integers: hashable
}
print(coordinates[(10, 20)])  # Location A

try:
    invalid = {[10, 20]: "Location A"}
except TypeError as error:
    print(error)  # unhashable type: 'list'
```

| Key | Hashable? | Reason |
| --- | --- | --- |
| `"random_forest"` | Yes | Strings are immutable |
| `42`, `3.5` | Yes | Numbers are immutable |
| `(10, 20)` | Yes | A tuple of hashable elements |
| `frozenset({"a", "b"})` | Yes | Immutable set |
| `[10, 20]` | No | Lists can change |
| `{"a": 1}` | No | Dictionaries can change |
| `([1], 2)` | No | Contains an unhashable list |

### Why a Changing Hash Would Break Lookup

Lists are unhashable precisely to prevent this problem. A user-defined class can still create it by computing its hash from mutable data:

```python
class FeatureSet:
    def __init__(self, names):
        self.names = names

    def __eq__(self, other):
        return self.names == other.names

    def __hash__(self):
        return hash(tuple(self.names))  # Depends on mutable data: a bad idea

key = FeatureSet(["age"])
cache = {key: "model_v1"}

key.names.append("income")  # The hash of key changes

print(key in cache)  # False
print(len(cache))    # 1
```

The entry is still in the dictionary, but it is stored in the slot chosen by the old hash, so Python can no longer find it.

### Defining `__eq__` Removes the Default `__hash__`

If a class defines `__eq__` without `__hash__`, Python sets `__hash__` to `None`, making instances unhashable.

```python
class Experiment:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return self.name == other.name

try:
    {Experiment("baseline"): 0.9}
except TypeError as error:
    print(error)  # unhashable type: 'Experiment'
```

A frozen dataclass (`@dataclass(frozen=True)`) is a common way to get a hashable value object.

## 3. Average Lookup Complexity

| Operation | Average | Worst case |
| --- | --- | --- |
| `d[key]` | O(1) | O(n) |
| `d[key] = value` | O(1) amortized | O(n) |
| `del d[key]` | O(1) | O(n) |
| `key in d` | O(1) | O(n) |
| Iteration | O(n) | O(n) |

The worst case occurs when many keys collide, for example when a poorly written `__hash__` returns the same value for every key. Resizing occasionally costs O(n), but it is rare enough that insertions are O(1) amortized.

### Dictionary vs List Membership

```python
labels = [f"class_{i}" for i in range(100_000)]
label_set = dict.fromkeys(labels)

print("class_99999" in labels)     # True
print("class_99999" in label_set)  # True
```

Both checks give the same answer, but the list check scans elements one by one (O(n)), while the dictionary check jumps to a candidate slot (O(1) on average). This is why dictionaries and sets are preferred for vocabulary lookups, label maps, and caches.

### A Bad Hash Still Works, Just Slowly

```python
class BadKey:
    def __init__(self, value):
        self.value = value

    def __eq__(self, other):
        return self.value == other.value

    def __hash__(self):
        return 1  # Every key collides

table = {BadKey(i): i for i in range(1000)}

print(table[BadKey(500)])  # 500
print(len(table))          # 1000
```

The dictionary remains correct because equality is still checked, but every lookup must probe through many colliding entries.

## 4. Insertion Order vs Sorted Order

Since Python 3.7, dictionaries are guaranteed to preserve **insertion order**. (In CPython 3.6 this was an implementation detail.) Insertion order is not the same as sorted order.

```python
scores = {"z": 90, "a": 80, "m": 85}

print(list(scores))          # ['z', 'a', 'm']
print(sorted(scores))        # ['a', 'm', 'z']
print(dict(sorted(scores.items())))  # {'a': 80, 'm': 85, 'z': 90}
```

### Updating vs Re-inserting

```python
scores = {"z": 90, "a": 80, "m": 85}

scores["z"] = 95        # Updating keeps the original position
print(list(scores))     # ['z', 'a', 'm']

del scores["z"]
scores["z"] = 95        # Deleting and re-inserting moves the key to the end
print(list(scores))     # ['a', 'm', 'z']
```

### Equality Ignores Order

```python
first = {"a": 1, "b": 2}
second = {"b": 2, "a": 1}

print(first == second)            # True
print(list(first) == list(second))  # False
```

Two dictionaries are equal when they contain the same key-value pairs, regardless of order. `collections.OrderedDict` is different: comparing two `OrderedDict` objects is order-sensitive.

## 5. Follow-Up: Does the Same Hash Mean the Same Key?

No. Two keys with the same hash are not necessarily the same key. Python also checks equality.

### Equal Hashes, Different Keys

In CPython, `-1` is reserved internally as an error signal, so `hash(-1)` returns `-2`. The integers `-1` and `-2` therefore have the same hash but are different keys:

```python
print(hash(-1) == hash(-2))  # True

values = {-1: "minus one", -2: "minus two"}

print(len(values))  # 2
print(values[-1])   # minus one
```

The hash only selects where to look. Equality decides whether the key matches.

### Equal Keys Are the Same Key

The reverse is also true: keys that compare equal and have equal hashes are treated as one key, even if their types differ.

```python
print(1 == 1.0 == True)                    # True
print(hash(1) == hash(1.0) == hash(True))  # True

mixed = {1: "int"}
mixed[1.0] = "float"
mixed[True] = "bool"

print(mixed)  # {1: 'bool'}
```

The first key object, `1`, is kept, and its value is replaced twice. This can surprise you when building a dictionary from mixed numeric and boolean data.

| Situation | Same dictionary key? |
| --- | --- |
| Same hash, not equal (`-1` and `-2` in CPython) | No |
| Equal and same hash (`1`, `1.0`, `True`) | Yes |

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Dictionaries are hash tables | `hash(key)` selects a candidate slot |
| Collisions are resolved by probing | Different keys can share a hash or slot |
| Equality confirms the match | Same hash does not mean same key |
| Keys must be hashable | `{[10, 20]: ...}` raises `TypeError` |
| A key's hash must not change | Mutating a key's hashed data breaks lookup |
| Average complexity is O(1) | Worst case is O(n) with many collisions |
| Insertion order is preserved (3.7+) | `list({"z": 1, "a": 2})` is `['z', 'a']` |
| Insertion order is not sorted order | Use `sorted(d)` or `dict(sorted(d.items()))` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What data structure backs a dictionary? | A hash table |
| What is the average lookup cost? | O(1) |
| What is the worst-case lookup cost? | O(n), when many keys collide |
| How does CPython resolve collisions? | Open addressing with a perturbed probe sequence |
| Why can't a list be a key? | It is mutable and unhashable |
| What two rules must a key's hash follow? | Stable for its lifetime; equal keys have equal hashes |
| Does an equal hash mean an equal key? | No; equality is also checked |
| Are `1` and `True` different keys? | No; they are equal and have equal hashes |
| Are dictionaries ordered? | Yes, by insertion order (guaranteed since 3.7) |
| Does `{"a": 1, "b": 2} == {"b": 2, "a": 1}`? | Yes; equality ignores order |

## 8. Interview-Ready Answer

> A Python dictionary is a hash table. When I look up or insert a key, Python computes its hash, uses it to choose a candidate slot, and then checks that the stored key is actually equal to mine; if different keys collide, CPython probes other slots using open addressing. That makes lookup, insertion, and deletion O(1) on average, but O(n) in the worst case if many keys collide. Keys must be hashable, meaning their hash never changes and equal keys have equal hashes, which is why lists can't be keys but tuples of hashable values can. Since Python 3.7, dictionaries preserve insertion order, but that is not sorted order. Also, the same hash doesn't mean the same key, because equality is always checked.

---

# Python Interview Question: Dictionary Comprehensions

**Difficulty:** 🟢 Beginner

## Question: What Are Dictionary Comprehensions? Give a Practical ML Example.

**Answer:** A dictionary comprehension builds a new dictionary from an iterable in a single expression. For each item, it evaluates a key expression and a value expression, and an optional `if` condition decides whether the item is included. A common ML use is label encoding: mapping class names to integer IDs.

```python
{key_expression: value_expression for item in iterable if condition}
```

| Part | Role | Example |
| --- | --- | --- |
| `key_expression` | Computes each key | `label` |
| `value_expression` | Computes each value | `index` |
| `for item in iterable` | Loops over the source data | `for index, label in enumerate(labels)` |
| `if condition` | Optional filter | `if score >= 0.90` |

## 1. Comprehension Syntax

### Basic Example

```python
squares = {number: number ** 2 for number in range(1, 5)}
print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16}
```

### The Equivalent Loop

A comprehension is a more compact way to write this loop:

```python
squares = {}
for number in range(1, 5):
    squares[number] = number ** 2

print(squares)  # {1: 1, 2: 4, 3: 9, 4: 16}
```

Both produce the same dictionary. The comprehension is usually clearer when the logic fits on a few lines.

### Braces With a Colon Make a Dictionary

| Syntax | Result type |
| --- | --- |
| `[x for x in data]` | `list` |
| `{x for x in data}` | `set` |
| `{x: f(x) for x in data}` | `dict` |
| `(x for x in data)` | Generator, not a tuple |

```python
data = [1, 2, 2]

print(type({x for x in data}))     # <class 'set'>
print(type({x: x for x in data}))  # <class 'dict'>
```

### The Loop Variable Does Not Leak

In Python 3, comprehension variables are local to the comprehension.

```python
number = "unchanged"
squares = {number: number ** 2 for number in range(3)}

print(number)  # unchanged
```

## 2. Build a Dictionary from an Iterable

### From Two Parallel Lists

```python
features = ["age", "income", "experience"]
importance = [0.2, 0.5, 0.3]

feature_importance = {
    feature: score
    for feature, score in zip(features, importance)
}

print(feature_importance)  # {'age': 0.2, 'income': 0.5, 'experience': 0.3}
```

When no transformation is needed, `dict(zip(features, importance))` is simpler.

### Transforming an Existing Dictionary

Use `.items()` to loop over key-value pairs.

```python
raw_scores = {"precision": 0.91234, "recall": 0.87654, "f1": 0.89401}

rounded = {metric: round(value, 2) for metric, value in raw_scores.items()}
print(rounded)  # {'precision': 0.91, 'recall': 0.88, 'f1': 0.89}
```

### Inverting a Mapping

```python
label_to_id = {"bird": 0, "cat": 1, "dog": 2}

id_to_label = {index: label for label, index in label_to_id.items()}
print(id_to_label)  # {0: 'bird', 1: 'cat', 2: 'dog'}
```

Inverting is safe only when the values are unique and hashable. If two keys share a value, only one survives in the inverted dictionary.

### Duplicate Keys: The Last One Wins

```python
runs = [("rf", 0.90), ("svm", 0.85), ("rf", 0.93)]

latest = {name: score for name, score in runs}
print(latest)  # {'rf': 0.93, 'svm': 0.85}
```

A dictionary cannot contain duplicate keys. Later values replace earlier ones, while the key keeps the position where it was first inserted.

## 3. Use an Optional Condition to Filter Entries

### Filtering with `if`

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

### Filtering vs Transforming

An `if` at the end **filters** items. A conditional expression in the value position **transforms** every item without removing any.

```python
model_scores = {
    "logistic_regression": 0.88,
    "random_forest": 0.93,
    "decision_tree": 0.85,
}

status = {
    name: ("pass" if score >= 0.90 else "fail")
    for name, score in model_scores.items()
}

print(status)
# {'logistic_regression': 'fail', 'random_forest': 'pass', 'decision_tree': 'fail'}
```

| Form | Effect |
| --- | --- |
| `{k: v for k, v in d.items() if cond}` | Keeps only matching items |
| `{k: (a if cond else b) for k, v in d.items()}` | Keeps all items with a computed value |

### Practical Example: Drop Missing Values

```python
record = {"age": 42, "income": None, "city": "Pune", "score": None}

clean = {key: value for key, value in record.items() if value is not None}
print(clean)  # {'age': 42, 'city': 'Pune'}
```

Using `is not None` keeps legitimate falsy values such as `0` or `""`, which `if value` would drop.

## 4. Practical ML Example: Label Encoding

Many models need integer class IDs rather than strings.

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

Sorting the unique labels makes the mapping deterministic. Iterating over a set directly would give an arbitrary order, so the IDs could change between runs.

### Decoding Predictions

```python
label_to_id = {"bird": 0, "cat": 1, "dog": 2}
id_to_label = {index: label for label, index in label_to_id.items()}

predictions = [2, 0, 1]
print([id_to_label[p] for p in predictions])  # ['dog', 'bird', 'cat']
```

### Build the Mapping from Training Data Only

In a real ML workflow, build the mapping from the **training labels** and reuse it for validation, testing, and inference. Rebuilding it from each dataset could assign different IDs to the same class. Also decide how to handle labels that were not seen during training.

```python
train_labels = ["cat", "dog", "cat", "bird"]
label_to_id = {
    label: index
    for index, label in enumerate(sorted(set(train_labels)))
}

UNKNOWN_ID = -1
test_labels = ["dog", "fish", "cat"]

encoded_test = [label_to_id.get(label, UNKNOWN_ID) for label in test_labels]
print(encoded_test)  # [2, -1, 1]
```

Using `label_to_id[label]` would raise `KeyError` for `"fish"`. Whether to raise, map to an "unknown" ID, or skip the sample is a design decision.

### Another ML Example: Normalizing Feature Importances

```python
importance = {"age": 2.0, "income": 5.0, "experience": 3.0}
total = sum(importance.values())

normalized = {feature: value / total for feature, value in importance.items()}
print(normalized)  # {'age': 0.2, 'income': 0.5, 'experience': 0.3}
```

## 5. Follow-Up: When Should You Avoid a Dictionary Comprehension?

### Prefer a Loop for Complex Logic or Side Effects

A comprehension should build a dictionary. If you need several steps, error handling, or logging, a normal loop is easier to read and debug.

### `dict.fromkeys()` for a Constant Value, With a Caveat

```python
metrics = dict.fromkeys(["precision", "recall"], 0.0)
print(metrics)  # {'precision': 0.0, 'recall': 0.0}
```

With a mutable value, `fromkeys()` shares **one** object between all keys. A comprehension creates a new object for each key.

```python
shared = dict.fromkeys(["train", "test"], [])
shared["train"].append(1)
print(shared)  # {'train': [1], 'test': [1]}

separate = {split: [] for split in ["train", "test"]}
separate["train"].append(1)
print(separate)  # {'train': [1], 'test': []}
```

### Counting: Use `Counter` Instead

A comprehension such as `{label: labels.count(label) for label in set(labels)}` works but scans the list once per unique label. `collections.Counter(labels)` counts in a single pass.

```python
from collections import Counter

labels = ["cat", "dog", "cat", "bird"]
print(Counter(labels))  # Counter({'cat': 2, 'dog': 1, 'bird': 1})
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Understand the comprehension syntax | `{k: v for item in iterable}` |
| Build a dictionary from an iterable | `{label: i for i, label in enumerate(labels)}` |
| Use an optional condition to filter | `if score >= 0.90` |
| Distinguish filtering from transforming values | `if` at the end vs `a if cond else b` in the value |
| Apply it to an ML task | Label encoding, filtering models, normalizing scores |
| Know that duplicate keys keep the last value | `{name: s for name, s in runs}` |
| Reuse the training mapping at inference | Handle unseen labels with `.get()` or an error |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is the syntax? | `{key: value for item in iterable if condition}` |
| How do you loop over a dictionary's pairs? | Use `.items()` |
| What happens with duplicate keys? | The last value wins |
| Does the loop variable leak in Python 3? | No |
| How do you filter entries? | Add `if condition` at the end |
| How do you change values conditionally without filtering? | Use `a if cond else b` in the value expression |
| Why sort unique labels before encoding? | To make the ID mapping deterministic |
| Which data should define the label mapping? | The training data |
| How do you handle unseen labels? | Raise, map to an unknown ID, or skip; decide explicitly |
| Why avoid `dict.fromkeys(keys, [])`? | All keys share one list |

## 8. Interview-Ready Answer

> A dictionary comprehension builds a new dictionary in one expression using the form `{key: value for item in iterable if condition}`, where the `if` part is optional and filters items. It is a concise replacement for a loop that assigns `d[key] = value`, and duplicate keys simply keep the last value. A practical ML example is label encoding: I take the sorted unique training labels and write `{label: index for index, label in enumerate(unique_labels)}` to map each class to an integer ID. I build that mapping from the training data only, reuse it for validation and inference, and decide explicitly how to handle unseen labels. I also use comprehensions to filter models above a score threshold or to transform metric values, but I switch to a regular loop when the logic gets complex.

---

# Python Interview Question: `enumerate()` and `zip()`

**Difficulty:** 🟢 Beginner

## Question: How Do `enumerate()` and `zip()` Work?

**Answer:** `enumerate()` pairs each value from an iterable with a counter, producing `(index, value)` tuples. `zip()` combines corresponding elements from several iterables into tuples. Both return lazy iterators, and by default `zip()` stops at the shortest input.

| Function | Produces | Typical use |
| --- | --- | --- |
| `enumerate(iterable, start=0)` | `(count, value)` tuples | Loop with an index and a value |
| `zip(*iterables)` | Tuples of corresponding elements | Loop over parallel sequences |
| `zip(..., strict=True)` | Same, but checks lengths (Python 3.10+) | Catch mismatched data |
| `itertools.zip_longest()` | Pads shorter inputs | Keep all elements from the longest input |

## 1. `enumerate()`: Get an Index and a Value

```python
features = ["age", "income", "experience"]

for index, feature in enumerate(features):
    print(index, feature)
# 0 age
# 1 income
# 2 experience
```

Each item is a tuple `(index, value)`, which the `for` loop unpacks into two names.

### Changing the Starting Number

```python
features = ["age", "income", "experience"]

for position, feature in enumerate(features, start=1):
    print(position, feature)
# 1 age
# 2 income
# 3 experience
```

`start` changes only the counter. It does not skip any elements.

### Replacing `range(len(...))`

```python
features = ["age", "income", "experience"]

# Less readable:
for i in range(len(features)):
    print(i, features[i])

# Preferred:
for i, feature in enumerate(features):
    print(i, feature)
```

Both loops print the same lines. `enumerate()` avoids manual indexing and also works on iterables that do not support indexing, such as files and generators.

### Practical ML Example: Logging Training Progress

```python
epoch_losses = [0.92, 0.61, 0.45]

for epoch, loss in enumerate(epoch_losses, start=1):
    print(f"Epoch {epoch}: loss={loss:.2f}")
# Epoch 1: loss=0.92
# Epoch 2: loss=0.61
# Epoch 3: loss=0.45
```

### Finding the Positions of Matching Items

```python
predictions = [1, 0, 1, 1]
labels = [1, 1, 1, 0]

wrong = [i for i, (p, y) in enumerate(zip(predictions, labels)) if p != y]
print(wrong)  # [1, 3]
```

## 2. `zip()`: Combine Corresponding Elements

```python
features = ["age", "income", "experience"]
importance = [0.2, 0.5, 0.3]

for feature, score in zip(features, importance):
    print(feature, score)
# age 0.2
# income 0.5
# experience 0.3
```

`zip()` takes the first element of each input, then the second, and so on.

```python
features = ["age", "income", "experience"]
importance = [0.2, 0.5, 0.3]

print(list(zip(features, importance)))
# [('age', 0.2), ('income', 0.5), ('experience', 0.3)]
```

### Turning Pairs into a Dictionary

```python
features = ["age", "income", "experience"]
importance = [0.2, 0.5, 0.3]

feature_importance = dict(zip(features, importance))
print(feature_importance)
# {'age': 0.2, 'income': 0.5, 'experience': 0.3}
```

### More Than Two Iterables

```python
names = ["rf", "svm"]
accuracy = [0.93, 0.91]
train_time = [30.0, 12.0]

for name, acc, seconds in zip(names, accuracy, train_time):
    print(name, acc, seconds)
# rf 0.93 30.0
# svm 0.91 12.0
```

### Practical ML Example: Computing Accuracy

```python
predictions = [1, 0, 1, 1, 0]
labels = [1, 0, 0, 1, 0]

correct = sum(p == y for p, y in zip(predictions, labels))
accuracy = correct / len(labels)

print(accuracy)  # 0.8
```

## 3. Both Return Iterators

`enumerate()` and `zip()` do not build lists. They return **iterators** that produce one tuple at a time, on demand.

```python
features = ["age", "income"]

pairs = enumerate(features)

print(pairs)        # <enumerate object at 0x...>
print(next(pairs))  # (0, 'age')
print(next(pairs))  # (1, 'income')
```

The exact address in the first line varies between runs.

### Iterators Can Be Consumed Only Once

```python
features = ["age", "income"]
importance = [0.2, 0.5]

pairs = zip(features, importance)

print(list(pairs))  # [('age', 0.2), ('income', 0.5)]
print(list(pairs))  # []
```

After the iterator is exhausted, it produces nothing more. Call `zip()` again or store the result with `list()` if you need to reuse it.

### Why Laziness Is Useful

- Memory use stays small, even for very large or streamed inputs.
- They work with other iterators, such as file lines or generator expressions.
- Work happens only when values are requested.

```python
squares = (n * n for n in range(1_000_000))

for index, value in enumerate(squares):
    if index == 3:
        break
    print(index, value)
# 0 0
# 1 1
# 2 4
```

Only four squares are ever computed. The remaining 999,996 are never produced, and no list of a million items is built.

| Property | `enumerate()` | `zip()` |
| --- | --- | --- |
| Returns | An iterator | An iterator |
| Reusable after exhaustion? | No | No |
| Materialize with | `list(enumerate(x))` | `list(zip(a, b))` |

## 4. What Happens When Inputs Have Different Lengths?

### Default: Stop at the Shortest Iterable

```python
print(list(zip(["a", "b", "c"], [1, 2])))
# [('a', 1), ('b', 2)]
```

The extra element `"c"` is silently dropped. In ML data pipelines this can hide bugs, for example when a feature list and a label list are accidentally misaligned.

### `strict=True` (Python 3.10+)

Use `strict=True` when mismatched lengths should raise an error.

```python
try:
    list(zip(["a", "b", "c"], [1, 2], strict=True))
except ValueError as error:
    print(error)  # zip() argument 2 is shorter than argument 1
```

The check happens **while the iterator is consumed**, not when `zip()` is called. Pairs produced before the mismatch was detected have already been yielded:

```python
pairs = zip(["a", "b", "c"], [1, 2], strict=True)

print(next(pairs))  # ('a', 1)
print(next(pairs))  # ('b', 2)

try:
    next(pairs)
except ValueError:
    print("Length mismatch detected on the third item.")
```

### `itertools.zip_longest()`: Pad the Shorter Inputs

```python
from itertools import zip_longest

print(list(zip_longest(["a", "b", "c"], [1, 2], fillvalue=0)))
# [('a', 1), ('b', 2), ('c', 0)]
```

| Option | Behavior when lengths differ |
| --- | --- |
| `zip(a, b)` | Stops at the shortest; extra items are ignored |
| `zip(a, b, strict=True)` | Raises `ValueError` (Python 3.10+) |
| `zip_longest(a, b, fillvalue=x)` | Continues to the longest, filling gaps with `x` |

## 5. Follow-Up: Unzipping and Common Pitfalls

### Unzipping with `zip(*pairs)`

The `*` operator unpacks a list of pairs into separate arguments, so `zip()` regroups them.

```python
pairs = [("age", 0.2), ("income", 0.5), ("experience", 0.3)]

names, scores = zip(*pairs)

print(names)   # ('age', 'income', 'experience')
print(scores)  # (0.2, 0.5, 0.3)
```

The results are tuples. If `pairs` is empty, `zip(*pairs)` produces nothing, and unpacking into two names raises `ValueError`.

### Pitfall: Zipping the Same Iterator Twice

```python
data = iter([1, 2, 3, 4])

print(list(zip(data, data)))  # [(1, 2), (3, 4)]
```

Both arguments are the same iterator, so each tuple consumes two consecutive items. This is sometimes used deliberately to group items into pairs, but it surprises people who expect `[(1, 1), (2, 2), ...]`.

### Pitfall: Reusing an Exhausted Iterator

```python
features = ["age", "income"]
indexed = enumerate(features)

as_dict = dict(indexed)
print(as_dict)        # {0: 'age', 1: 'income'}
print(list(indexed))  # []
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Use `enumerate()` to get an index and a value | `for i, feature in enumerate(features)` |
| Change the counter's starting value | `enumerate(features, start=1)` |
| Use `zip()` to combine corresponding elements | `for feature, score in zip(features, importance)` |
| Build a dictionary from two lists | `dict(zip(features, importance))` |
| Know that both return iterators | A second `list(pairs)` is empty |
| By default, `zip()` stops at the shortest input | Extra items are silently dropped |
| Detect or handle mismatched lengths | `strict=True` (3.10+) or `zip_longest()` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `enumerate()` yield? | `(index, value)` tuples |
| What is the default start? | `0` |
| What does `zip()` yield? | Tuples of corresponding elements |
| Do they return lists? | No; they return iterators |
| Can you loop over the same `zip` object twice? | No; it is exhausted after one pass |
| What happens with unequal lengths? | `zip()` stops at the shortest input |
| How do you make unequal lengths an error? | `zip(..., strict=True)` in Python 3.10+ |
| When is the `strict` error raised? | When the iterator is consumed and the mismatch is reached |
| How do you keep all items from the longest input? | `itertools.zip_longest()` |
| How do you unzip a list of pairs? | `zip(*pairs)` |

## 8. Interview-Ready Answer

> `enumerate()` wraps an iterable and yields `(index, value)` tuples, so I can loop with a counter instead of using `range(len(...))`, and its `start` argument changes the first number. `zip()` takes several iterables and yields tuples of their corresponding elements, which is useful for parallel lists like feature names and importance scores, or for `dict(zip(keys, values))`. Both return lazy iterators, so they use little memory but can be consumed only once. By default `zip()` stops at the shortest input and silently drops extra items, which can hide data misalignment. In Python 3.10+ I use `strict=True` to raise a `ValueError` on mismatched lengths, or `itertools.zip_longest()` when I want to pad the shorter input.

---

# Python Interview Question: `*args` vs `**kwargs`

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `*args` and `**kwargs`?

**Answer:** In a function definition, `*args` collects any extra **positional arguments** into a tuple, and `**kwargs` collects any extra **keyword arguments** into a dictionary. In a function call, `*` and `**` do the opposite: they **unpack** an existing iterable or mapping into separate arguments. The names `args` and `kwargs` are only conventions; the stars provide the behavior.

| Feature | `*args` | `**kwargs` |
| --- | --- | --- |
| Collects | Extra positional arguments | Extra keyword arguments |
| Resulting type | `tuple` | `dict` |
| Empty when nothing extra is passed | `()` | `{}` |
| Unpacking in a call | `f(*values)` from any iterable | `f(**settings)` from a mapping |

## 1. Positional vs Keyword Arguments

A **positional argument** is matched to a parameter by its position. A **keyword argument** is matched by its name.

```python
def train(model_name, epochs):
    print(model_name, epochs)

train("Random Forest", 5)                # Positional
train(model_name="Random Forest", epochs=5)  # Keyword
train("Random Forest", epochs=5)         # Mixed
# Random Forest 5
# Random Forest 5
# Random Forest 5
```

Positional arguments must come before keyword arguments in a call:

```python
# train(epochs=5, "Random Forest")
# SyntaxError: positional argument follows keyword argument
```

### Collecting Both Kinds

```python
def show_arguments(*args, **kwargs):
    print(args)
    print(kwargs)

show_arguments(10, 20, model="Random Forest", epochs=5)
# (10, 20)
# {'model': 'Random Forest', 'epochs': 5}
```

`10` and `20` are positional, so they go into `args`. `model` and `epochs` are keyword arguments, so they go into `kwargs`.

## 2. `args` Becomes a Tuple and `kwargs` Becomes a Dictionary

```python
def inspect(*args, **kwargs):
    print(type(args), type(kwargs))
    print(args, kwargs)

inspect()
inspect(1, 2, lr=0.01)
# <class 'tuple'> <class 'dict'>
# () {}
# <class 'tuple'> <class 'dict'>
# (1, 2) {'lr': 0.01}
```

- `args` is always a tuple, even when it holds a single value or none.
- `kwargs` is always a new dictionary, and it preserves the order in which the keyword arguments were passed (guaranteed since Python 3.6).
- Modifying `kwargs` inside the function does not modify a dictionary the caller unpacked with `**`.

```python
def tweak(**kwargs):
    kwargs["epochs"] = 99
    return kwargs

settings = {"epochs": 10}
result = tweak(**settings)

print(settings)  # {'epochs': 10}
print(result)    # {'epochs': 99}
```

### Practical ML Example

Regular parameters are filled first. Remaining positional arguments go into the `*` parameter, and remaining keyword arguments go into the `**` parameter.

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

### Iterating Over Collected Arguments

```python
def mean_score(*scores):
    return sum(scores) / len(scores)

def build_config(**options):
    return {key.upper(): value for key, value in options.items()}

print(mean_score(0.8, 0.9, 1.0))            # 0.9
print(build_config(lr=0.01, batch_size=32))  # {'LR': 0.01, 'BATCH_SIZE': 32}
```

## 3. Collecting Arguments vs Unpacking Them

The same symbols mean different things depending on where they appear.

| Location | `*` | `**` |
| --- | --- | --- |
| Function definition | Collects extra positional arguments | Collects extra keyword arguments |
| Function call | Unpacks an iterable into positional arguments | Unpacks a mapping into keyword arguments |

### Unpacking in a Call

```python
def train_model(learning_rate, epochs):
    print(learning_rate, epochs)

settings = {"learning_rate": 0.01, "epochs": 20}
train_model(**settings)  # 0.01 20

values = [0.02, 10]
train_model(*values)     # 0.02 10
```

The dictionary keys must match parameter names, and the number of unpacked values must match the parameters:

```python
def train_model(learning_rate, epochs):
    print(learning_rate, epochs)

try:
    train_model(**{"learning_rate": 0.01, "epochs": 20, "batch_size": 32})
except TypeError as error:
    print(error)  # train_model() got an unexpected keyword argument 'batch_size'

try:
    train_model(*[0.01])
except TypeError as error:
    print(error)  # train_model() missing 1 required positional argument: 'epochs'
```

### Forwarding Arguments: The Wrapper Pattern

Combining collection and unpacking lets a function pass along arguments it does not need to know about. This is how most decorators and wrapper functions work.

```python
def fit(model_name, epochs=10, learning_rate=0.001):
    return f"{model_name}: epochs={epochs}, lr={learning_rate}"

def logged_fit(*args, **kwargs):
    print("Calling fit with", args, kwargs)
    return fit(*args, **kwargs)

print(logged_fit("cnn", epochs=3))
# Calling fit with ('cnn',) {'epochs': 3}
# cnn: epochs=3, lr=0.001
```

### Unpacking in Literals

`*` and `**` also unpack inside list, tuple, set, and dictionary displays.

```python
base_features = ["age", "income"]
extra_features = ["experience"]

defaults = {"epochs": 10, "lr": 0.01}
overrides = {"lr": 0.001}

print([*base_features, *extra_features])  # ['age', 'income', 'experience']
print({**defaults, **overrides})          # {'epochs': 10, 'lr': 0.001}
```

## 4. The Names `args` and `kwargs` Are Only Conventions

The stars control the behavior. Any valid names work:

```python
def example(*values, **options):
    print(values, options)

example(1, 2, verbose=True)  # (1, 2) {'verbose': True}
```

Use `args` and `kwargs` for generic forwarding code, where everyone recognizes them. Use descriptive names such as `*features` or `**hyperparameters` when the meaning is specific.

## 5. Follow-Up: Parameter Order, Keyword-Only, and Positional-Only Parameters

### Parameter Order in a Definition

```python
def f(positional_only, /, standard, *args, keyword_only, **kwargs):
    ...
```

| Order | Kind |
| --- | --- |
| 1 | Positional-only parameters, before `/` (Python 3.8+) |
| 2 | Standard parameters |
| 3 | `*args` |
| 4 | Keyword-only parameters |
| 5 | `**kwargs`, which must be last |

### Parameters After `*args` Are Keyword-Only

```python
def evaluate(*metrics, threshold=0.5):
    print(metrics, threshold)

evaluate("precision", "recall", threshold=0.7)  # ('precision', 'recall') 0.7
evaluate("precision", 0.7)                      # ('precision', 0.7) 0.5
```

In the second call, `0.7` is collected into `metrics`; it is not assigned to `threshold`. A bare `*` creates keyword-only parameters without collecting extra positional arguments:

```python
def split_data(data, *, test_size=0.2, shuffle=True):
    return test_size, shuffle

print(split_data([1, 2, 3], test_size=0.3))  # (0.3, True)

try:
    split_data([1, 2, 3], 0.3)
except TypeError as error:
    print(error)  # split_data() takes 1 positional argument but 2 were given
```

Libraries such as scikit-learn use keyword-only parameters so calls stay readable, for example `train_test_split(X, y, test_size=0.2)`.

### Pitfall: Supplying the Same Argument Twice

```python
def train_model(learning_rate, epochs):
    print(learning_rate, epochs)

try:
    train_model(0.01, **{"learning_rate": 0.02, "epochs": 5})
except TypeError as error:
    print(error)  # train_model() got multiple values for argument 'learning_rate'
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Distinguish positional from keyword arguments | `train("rf", 5)` vs `train(model_name="rf", epochs=5)` |
| `args` becomes a tuple | `(10, 20)` |
| `kwargs` becomes a dictionary | `{'model': 'Random Forest', 'epochs': 5}` |
| Collecting happens in a definition | `def f(*args, **kwargs)` |
| Unpacking happens in a call | `train_model(**settings)`, `train_model(*values)` |
| The names are only conventions | `def example(*values, **options)` |
| Parameters after `*args` are keyword-only | `def evaluate(*metrics, threshold=0.5)` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `*args` collect? | Extra positional arguments |
| What does `**kwargs` collect? | Extra keyword arguments |
| What type is `args`? | `tuple` |
| What type is `kwargs`? | `dict` |
| What are they when nothing extra is passed? | `()` and `{}` |
| What does `*` do in a call? | Unpacks an iterable into positional arguments |
| What does `**` do in a call? | Unpacks a mapping into keyword arguments |
| Must they be named `args` and `kwargs`? | No; only the stars matter |
| Where must `**kwargs` appear? | Last in the parameter list |
| What are parameters after `*args`? | Keyword-only parameters |

## 8. Interview-Ready Answer

> In a function definition, `*args` collects any extra positional arguments into a tuple, and `**kwargs` collects any extra keyword arguments into a dictionary, so a function can accept a flexible number of inputs. In a function call, the same symbols work in reverse: `*` unpacks an iterable into positional arguments and `**` unpacks a dictionary into keyword arguments, which is handy for passing a hyperparameter config with `train(**config)`. Combining both lets wrappers and decorators forward arguments with `func(*args, **kwargs)`. Parameters placed after `*args` become keyword-only, and `**kwargs` must come last. The names `args` and `kwargs` are only conventions; the stars are what matter.

---

# Python Interview Question: Merging Dictionaries

**Difficulty:** 🟢 Beginner

## Question: How Do You Merge Two Dictionaries in Python?

**Answer:** Use the `|` operator (Python 3.9+) or `{**first, **second}` to create a new merged dictionary. Use `first.update(second)` or `first |= second` to modify an existing dictionary in place. When keys overlap, the **right-hand dictionary wins**. All of these merges are shallow: nested dictionaries are replaced, not combined.

| Method | Creates a new dictionary? | Python version |
| --- | --- | --- |
| `first \| second` | Yes | 3.9+ |
| `{**first, **second}` | Yes | 3.5+ |
| `first.update(second)` | No; modifies `first` | All |
| `first \|= second` | No; modifies `first` | 3.9+ |

## 1. Several Ways to Merge Dictionaries

### The `|` Operator (Python 3.9+)

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

`defaults` is unchanged. `config` is a new dictionary.

### Dictionary Unpacking

```python
defaults = {"learning_rate": 0.01, "epochs": 10}
overrides = {"epochs": 30, "batch_size": 32}

config = {**defaults, **overrides}
print(config)  # {'learning_rate': 0.01, 'epochs': 30, 'batch_size': 32}
```

Unpacking is useful before Python 3.9, and it can mix in literal keys:

```python
defaults = {"learning_rate": 0.01, "epochs": 10}

config = {**defaults, "epochs": 50, "seed": 42}
print(config)  # {'learning_rate': 0.01, 'epochs': 50, 'seed': 42}
```

### `update()` and `|=`: Modify an Existing Dictionary

```python
defaults = {"learning_rate": 0.01, "epochs": 10}
overrides = {"epochs": 30, "batch_size": 32}

defaults.update(overrides)
print(defaults)  # {'learning_rate': 0.01, 'epochs': 30, 'batch_size': 32}
```

```python
defaults = {"learning_rate": 0.01, "epochs": 10}
overrides = {"epochs": 30, "batch_size": 32}

defaults |= overrides
print(defaults)  # {'learning_rate': 0.01, 'epochs': 30, 'batch_size': 32}
```

`update()` also accepts keyword arguments and iterables of key-value pairs:

```python
config = {"epochs": 10}

config.update([("seed", 42)], dropout=0.3)
print(config)  # {'epochs': 10, 'seed': 42, 'dropout': 0.3}
```

### Merging More Than Two Dictionaries

```python
base = {"epochs": 10, "lr": 0.01}
experiment = {"lr": 0.001}
cli_args = {"epochs": 3}

print(base | experiment | cli_args)       # {'epochs': 3, 'lr': 0.001}
print({**base, **experiment, **cli_args})  # {'epochs': 3, 'lr': 0.001}
```

Each later dictionary overrides the earlier ones.

### `ChainMap`: Layered Lookups Without Copying

`collections.ChainMap` does not merge. It searches several dictionaries in order and returns the first match. Here the **first** mapping wins.

```python
from collections import ChainMap

defaults = {"epochs": 10, "lr": 0.01}
overrides = {"epochs": 30}

settings = ChainMap(overrides, defaults)

print(settings["epochs"])  # 30
print(settings["lr"])      # 0.01

defaults["lr"] = 0.05
print(settings["lr"])      # 0.05
```

Because nothing is copied, later changes to the underlying dictionaries are visible through the `ChainMap`.

## 2. Which Value Wins When Keys Overlap?

For `|`, `{**a, **b}`, `update()`, and `|=`, the **right-hand (later) value wins**.

```python
left = {"epochs": 10}
right = {"epochs": 30}

print(left | right)  # {'epochs': 30}
print(right | left)  # {'epochs': 10}
```

So the order of operands matters: `|` is not commutative when keys overlap.

### Key Order in the Result

The result keeps the insertion order of the left dictionary. An overlapping key keeps its **original position** but takes the **new value**. New keys from the right are added at the end.

```python
defaults = {"learning_rate": 0.01, "epochs": 10, "seed": 0}
overrides = {"epochs": 30, "batch_size": 32}

print(list(defaults | overrides))  # ['learning_rate', 'epochs', 'seed', 'batch_size']
```

| Expression | Value for an overlapping key |
| --- | --- |
| `a \| b` | From `b` |
| `{**a, **b}` | From `b` |
| `a.update(b)` | From `b` |
| `ChainMap(a, b)` | From `a` |

### Practical Pattern: Defaults, Then User Overrides

```python
DEFAULT_CONFIG = {"epochs": 10, "batch_size": 32, "optimizer": "adam"}

def build_config(user_config):
    return DEFAULT_CONFIG | user_config

print(build_config({"epochs": 5}))
# {'epochs': 5, 'batch_size': 32, 'optimizer': 'adam'}
print(DEFAULT_CONFIG)
# {'epochs': 10, 'batch_size': 32, 'optimizer': 'adam'}
```

Putting the defaults on the left and the overrides on the right gives the user's values priority, and the shared defaults stay untouched.

## 3. Creating a New Dictionary vs Updating an Existing One

### Updating Affects Every Reference

```python
defaults = {"epochs": 10}
alias = defaults

defaults |= {"epochs": 30}
print(alias)  # {'epochs': 30}

defaults = {"epochs": 10}
alias = defaults

defaults = defaults | {"epochs": 30}
print(alias)  # {'epochs': 10}
```

`|=` mutates the existing dictionary, so `alias` sees the change. `defaults = defaults | ...` creates a new dictionary and rebinds only `defaults`.

### Pitfall: `update()` Returns `None`

```python
defaults = {"epochs": 10}

config = defaults.update({"epochs": 30})
print(config)    # None
print(defaults)  # {'epochs': 30}
```

Like `list.sort()`, `update()` modifies in place and returns `None`. Use `|` when you need the merged dictionary as an expression.

### `|` Requires Dictionaries; `|=` Is More Flexible

```python
config = {"epochs": 10}

try:
    config | [("seed", 42)]
except TypeError as error:
    print(error)  # unsupported operand type(s) for |: 'dict' and 'list'

config |= [("seed", 42)]
print(config)  # {'epochs': 10, 'seed': 42}
```

`|` works between two dictionaries. `|=` behaves like `update()` and accepts any mapping or iterable of key-value pairs.

### Pitfall: `dict(a, **b)` Needs String Keys

An older idiom, `dict(first, **second)`, works only when the keys of `second` are strings, because `**` turns them into keyword arguments.

```python
first = {"a": 1}

print(dict(first, **{"b": 2}))  # {'a': 1, 'b': 2}

try:
    dict(first, **{1: "one"})
except TypeError:
    print("Keywords must be strings.")
```

Prefer `|` or `{**first, **second}`.

## 4. Ordinary Merging Is Shallow

### Nested Dictionaries Are Replaced, Not Combined

```python
first = {"model": {"depth": 5, "trees": 100}}
second = {"model": {"depth": 10}}

merged = first | second
print(merged)  # {'model': {'depth': 10}}
```

The whole value for `"model"` is replaced. The `"trees"` setting is lost.

### Nested Values Are Shared, Not Copied

The merged dictionary is new, but its values are the same objects.

```python
first = {"model": {"depth": 5}}
second = {"data": {"batch_size": 32}}

merged = first | second
merged["model"]["depth"] = 99

print(first)                               # {'model': {'depth': 99}}
print(merged["data"] is second["data"])    # True
```

Use `copy.deepcopy()` on the result if nested values must be independent.

### Writing a Recursive (Deep) Merge

```python
def deep_merge(base, override):
    result = dict(base)
    for key, value in override.items():
        if isinstance(result.get(key), dict) and isinstance(value, dict):
            result[key] = deep_merge(result[key], value)
        else:
            result[key] = value
    return result

first = {"model": {"depth": 5, "trees": 100}, "seed": 0}
second = {"model": {"depth": 10}, "seed": 42}

print(deep_merge(first, second))
# {'model': {'depth': 10, 'trees': 100}, 'seed': 42}
print(first)
# {'model': {'depth': 5, 'trees': 100}, 'seed': 0}
```

This function does not modify its inputs. Configuration libraries such as Hydra and OmegaConf provide a similar recursive merge for ML experiment configs.

## 5. Follow-Up: What If You Want to Combine Values Instead of Overwriting?

A normal merge keeps only one value per key. To combine values, write the rule explicitly.

### Summing Counts with `Counter`

```python
from collections import Counter

train_counts = Counter({"cat": 50, "dog": 40})
val_counts = Counter({"cat": 10, "bird": 5})

print(train_counts + val_counts)  # Counter({'cat': 60, 'dog': 40, 'bird': 5})
```

### A Custom Rule with a Comprehension

```python
run_1 = {"accuracy": 0.90, "f1": 0.85}
run_2 = {"accuracy": 0.94, "f1": 0.83}

best = {
    metric: max(run_1.get(metric, 0), run_2.get(metric, 0))
    for metric in run_1.keys() | run_2.keys()
}

print(dict(sorted(best.items())))  # {'accuracy': 0.94, 'f1': 0.85}
```

`run_1.keys() | run_2.keys()` is a set union of the keys, so its order is not guaranteed; sorting makes the output deterministic.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Show several ways to merge | `a \| b`, `{**a, **b}`, `a.update(b)`, `a \|= b` |
| The right-hand dictionary wins on overlapping keys | `{"epochs": 10} \| {"epochs": 30}` gives `30` |
| Distinguish creating from updating | `\|` returns a new dict; `update()` and `\|=` modify in place |
| Know the version requirement | `\|` and `\|=` need Python 3.9+ |
| `update()` returns `None` | `config = d.update(x)` is a bug |
| Ordinary merging is shallow | A nested `"model"` dict is replaced entirely |
| Combining values needs an explicit rule | `Counter` addition or a comprehension |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| Simplest way to merge into a new dict? | `first \| second` (Python 3.9+) |
| Alternative before Python 3.9? | `{**first, **second}` |
| How do you merge in place? | `first.update(second)` or `first \|= second` |
| Which value wins on a key conflict? | The right-hand (later) one |
| Where does an overlapping key appear in the result? | At its original position from the left dict |
| What does `update()` return? | `None` |
| Can `dict \| list` work? | No; `\|` needs two dicts, but `\|=` accepts pairs |
| Are nested dicts merged recursively? | No; the nested value is replaced |
| Are nested values copied? | No; the merged dict shares them |
| How does `ChainMap` differ? | It looks up layered dicts without copying, and the first mapping wins |

## 8. Interview-Ready Answer

> In Python 3.9 and later, I merge two dictionaries with `first | second`, which returns a new dictionary; before 3.9, `{**first, **second}` does the same. When keys overlap, the right-hand value wins, so I put defaults on the left and overrides on the right, for example `config = defaults | overrides`. If I want to modify an existing dictionary instead, I use `first.update(second)` or `first |= second`, keeping in mind that `update()` returns `None` and that the change is visible through every reference to that dictionary. All of these merges are shallow: a nested dictionary under the same key is replaced entirely, and nested values are shared rather than copied. When I need nested configs combined, I write a recursive merge or use a config library.

---

# Python Interview Question: Handling Missing Dictionary Keys

**Difficulty:** 🟡 Intermediate

## Question: How Do You Handle Missing Keys in a Dictionary Safely?

**Answer:** Choose the approach based on what a missing key means in your application. If the value is optional, read it with `get()` and a default. If the value is required, index it directly and handle `KeyError`. If you want a missing key to be filled in automatically, use `setdefault()` or `collections.defaultdict`.

| Approach | Use it to |
| --- | --- |
| `get()` | Read an optional value with a default |
| `key in dictionary` | Check whether a key exists |
| `try/except KeyError` | Handle a missing required value |
| `setdefault()` | Insert a default if the key is missing |
| `defaultdict` | Create defaults automatically when indexing |

## 1. When Direct Indexing Raises `KeyError`

Square-bracket indexing, `dictionary[key]`, returns the value when the key exists and raises `KeyError` when it does not.

```python
config = {"epochs": 20}

print(config["epochs"])  # 20

try:
    config["learning_rate"]
except KeyError as error:
    print(repr(error))  # KeyError('learning_rate')
```

Other operations that require the key also raise `KeyError`:

```python
config = {"epochs": 20}

print(config.pop("dropout", 0.0))  # 0.0

try:
    del config["dropout"]
except KeyError:
    print("Cannot delete a missing key.")  # Cannot delete a missing key.
```

`pop()` accepts a default, so it does not raise when one is supplied. `del` has no default.

`KeyError` is a subclass of `LookupError`, which is also the parent of `IndexError`:

```python
print(issubclass(KeyError, LookupError))    # True
print(issubclass(IndexError, LookupError))  # True
```

| Operation | Missing key behavior |
| --- | --- |
| `config["key"]` | Raises `KeyError` |
| `del config["key"]` | Raises `KeyError` |
| `config.pop("key")` | Raises `KeyError` |
| `config.pop("key", default)` | Returns `default` |
| `config.get("key")` | Returns `None` |
| `config.get("key", default)` | Returns `default` |

**A `KeyError` is often the correct behavior.** Silently replacing a required setting with a default can hide a configuration bug.

## 2. Choosing Between `get()`, Membership Checks, and `try/except`

### `get()` for Optional Values

```python
config = {"epochs": 20}
batch_size = config.get("batch_size", 32)

print(batch_size)            # 32
print(config)                # {'epochs': 20}
print(config.get("dropout")) # None
```

`get()` doesn't insert the default into the dictionary. Without a second argument, it returns `None`.

The default argument is evaluated before `get()` runs, even when the key exists:

```python
def expensive_default():
    print("computing default")
    return 32

config = {"batch_size": 64}
print(config.get("batch_size", expensive_default()))
# computing default
# 64
```

If the default is expensive to compute, check for the key first or use `try/except`.

### Membership Checks: "Look Before You Leap"

```python
record = {"score": None}

if "score" in record:
    print("The key exists, even though its value is None.")
```

`in` checks keys, not values. Use `in record.values()` to search values, which is a linear scan.

### `try/except KeyError`: "Easier to Ask Forgiveness"

```python
config = {"epochs": 20}

try:
    learning_rate = config["learning_rate"]
except KeyError:
    print("Required setting 'learning_rate' is missing.")
```

A common pattern converts the low-level `KeyError` into a clearer error for the caller:

```python
def get_required(config, key):
    try:
        return config[key]
    except KeyError:
        raise ValueError(f"Required setting {key!r} is missing") from None

try:
    get_required({"epochs": 20}, "learning_rate")
except ValueError as error:
    print(error)  # Required setting 'learning_rate' is missing
```

Keep the `try` block small. If it contains several lookups or function calls, a `KeyError` from unrelated code can be caught by mistake.

| Situation | Good choice |
| --- | --- |
| The key is optional and has a sensible default | `get(key, default)` |
| You need to branch on whether the key exists | `key in dictionary` |
| The key is required, and absence is an error | `dictionary[key]` with `try/except KeyError` |
| The key is usually present | `try/except` avoids a second lookup |
| The default is expensive to build | Membership check or `try/except` |

The membership-then-index pattern performs two lookups. That is usually negligible, but `try/except` or `get()` does one.

## 3. When `setdefault()` and `defaultdict` Are Useful

Both are designed for building up a dictionary, such as grouping or counting.

### `setdefault()` to Group Records

```python
groups = {}
groups.setdefault("cat", []).append("image_1.jpg")
groups.setdefault("cat", []).append("image_2.jpg")

print(groups)  # {'cat': ['image_1.jpg', 'image_2.jpg']}
```

`setdefault(key, default)` returns the existing value if the key exists. Otherwise it inserts `default` and returns it. Like `get()`, it evaluates its default argument on every call, so the second call above builds an empty list that is then discarded.

```python
labels = {"cat": ["image_1.jpg"]}
result = labels.setdefault("cat", [])

print(result)  # ['image_1.jpg']
```

### `defaultdict` to Count Labels

```python
from collections import defaultdict

counts = defaultdict(int)
for label in ["cat", "dog", "cat"]:
    counts[label] += 1

print(dict(counts))  # {'cat': 2, 'dog': 1}
```

The argument to `defaultdict` is a **factory**: a callable taking no arguments. `int()` returns `0`, `list()` returns `[]`, and a `lambda` can return any custom default.

```python
from collections import defaultdict

groups = defaultdict(list)
for path, label in [("a.jpg", "cat"), ("b.jpg", "dog"), ("c.jpg", "cat")]:
    groups[label].append(path)

print(dict(groups))  # {'cat': ['a.jpg', 'c.jpg'], 'dog': ['b.jpg']}

names = defaultdict(lambda: "unknown")
print(names[7])  # unknown
```

For counting specifically, `collections.Counter` is often clearer:

```python
from collections import Counter

counts = Counter(["cat", "dog", "cat"])

print(counts)            # Counter({'cat': 2, 'dog': 1})
print(counts["bird"])    # 0
print("bird" in counts)  # False
```

A `Counter` returns `0` for a missing key without inserting it.

| Tool | Default created | Inserts on lookup? | Typical use |
| --- | --- | --- | --- |
| `get()` | Per call argument | No | Optional values |
| `setdefault()` | Per call argument | Yes | Occasional grouping in a plain dict |
| `defaultdict` | Factory, only when missing | Yes | Grouping or counting in loops |
| `Counter` | `0` | No | Counting |

## 4. A Missing Key vs a Key Whose Value Is `None`

**Common mistake:** assuming `get()` replaces an existing `None`.

```python
config = {"batch_size": None}
print(config.get("batch_size", 32))  # None
```

The default is used only when the key is **missing**. If `None` should also mean "use the default", handle it explicitly:

```python
config = {"batch_size": None}

batch_size = config.get("batch_size")
if batch_size is None:
    batch_size = 32

print(batch_size)  # 32
```

Avoid using `or` for this. It replaces every falsy value, including valid values such as `0` and `0.0`:

```python
config = {"dropout": 0.0}

print(config.get("dropout") or 0.5)  # 0.5
```

Here a dropout of `0.0` was a deliberate setting, but `or` replaced it with `0.5`.

When `None` is a meaningful stored value, use a unique sentinel object to detect a missing key:

```python
_MISSING = object()

record = {"score": None}

value = record.get("score", _MISSING)
print(value is _MISSING)  # False

value = record.get("label", _MISSING)
print(value is _MISSING)  # True
```

| Dictionary | `"score" in d` | `d.get("score", 0)` |
| --- | --- | --- |
| `{}` | `False` | `0` |
| `{"score": None}` | `True` | `None` |
| `{"score": 0}` | `True` | `0` |

## 5. Follow-Up: What Are the Pitfalls of `defaultdict`?

### Reading a Missing Key Inserts It

```python
from collections import defaultdict

counts = defaultdict(int, {"cat": 2})

print(counts["bird"])  # 0
print(dict(counts))    # {'cat': 2, 'bird': 0}
```

Simply reading `counts["bird"]` added a `bird` entry. This can create unexpected keys, for example when a report loops over labels it expected to exist.

### `get()` and `in` Do Not Use the Factory

```python
from collections import defaultdict

counts = defaultdict(int, {"cat": 2})

print(counts.get("fish"))  # None
print("fish" in counts)    # False
print(dict(counts))        # {'cat': 2}
```

Only square-bracket access triggers the factory, through the `__missing__` hook. A `dict` subclass can define `__missing__` itself:

```python
class Settings(dict):
    def __missing__(self, key):
        return f"<{key} not set>"

settings = Settings(epochs=20)

print(settings["optimizer"])      # <optimizer not set>
print(settings.get("optimizer"))  # None
print(settings)                   # {'epochs': 20}
```

### Convert Before Returning

A `defaultdict` passed to other code keeps creating keys on lookup. Convert it with `dict(counts)` when the building phase is finished.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Direct indexing raises `KeyError` for missing keys | `config["learning_rate"]` |
| `get()` returns a default without inserting it | `config.get("batch_size", 32)` |
| Membership checks test keys | `"score" in record` |
| `try/except KeyError` suits required values | Raise a clear configuration error |
| `setdefault()` inserts and returns a default | `groups.setdefault("cat", []).append(...)` |
| `defaultdict` creates defaults with a factory | `defaultdict(int)` for counting |
| A missing key differs from a `None` value | `{"batch_size": None}.get("batch_size", 32)` is `None` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `d[key]` do for a missing key? | Raises `KeyError` |
| What does `d.get(key)` return for a missing key? | `None` |
| Does `get()` insert the default? | No |
| Does `setdefault()` insert the default? | Yes, and it returns the value |
| When is a `defaultdict` factory called? | When `d[key]` is used for a missing key |
| Does `defaultdict.get()` call the factory? | No |
| Does `get(key, 32)` replace a stored `None`? | No; the default is used only for missing keys |
| Why avoid `d.get(key) or default`? | It also replaces `0`, `0.0`, `""`, and empty containers |
| Best tool for counting labels? | `Counter` or `defaultdict(int)` |
| How do you distinguish missing from `None`? | Use `in` or a sentinel object |

## 8. Interview-Ready Answer

> The right approach depends on what a missing key means. For optional values, I use `get()` with a default, which doesn't insert anything. For required values, I index directly and handle `KeyError`, often converting it into a clearer error. When I'm building a dictionary, such as grouping files by label or counting classes, I use `setdefault()` or `defaultdict`, which insert defaults for missing keys. I keep in mind that `defaultdict` inserts a key even when I only read it. Finally, a missing key is different from a key whose value is `None`, so `get()` doesn't replace a stored `None`, and I avoid `or` because it also overrides valid falsy values like `0.0`.

---

# Python Interview Question: The `__init__` Method

**Difficulty:** 🟢 Beginner

## Question: What Is `__init__` in a Python Class?

**Answer:** `__init__` initializes an instance after it has been created. Python calls it automatically when you instantiate a class. `self` refers to the instance being initialized, and assigning `self.attribute = value` stores state on that particular instance.

| Method | Role |
| --- | --- |
| `__new__` | Creates and returns an instance |
| `__init__` | Initializes an instance that already exists |

## 1. Instance Initialization and the Role of `self`

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

Calling `Model("Random Forest")` creates a new object and then passes it to `__init__` as `self`, followed by the arguments you supplied. You never pass `self` yourself.

### `self` Is the Instance

```python
class Model:
    def __init__(self, name):
        self.name = name


model = Model("Random Forest")

print(vars(model))  # {'name': 'Random Forest'}
```

`vars(model)` shows the instance's attribute dictionary. Each `self.name = ...` assignment adds an entry to it.

`self` is a naming convention, not a keyword. Python passes the instance as the first positional argument whatever that parameter is called, but you should always call it `self`.

### Forgetting `self.` Creates a Local Variable

```python
class Model:
    def __init__(self, name):
        name = name.strip()  # Local variable only


model = Model(" Random Forest ")

print(hasattr(model, "name"))  # False
```

Without `self.`, the assignment binds a local name that disappears when `__init__` returns.

| Code inside `__init__` | Effect |
| --- | --- |
| `self.name = name` | Stores an attribute on the instance |
| `name = name.strip()` | Rebinds a local variable only |
| `self.metrics = {}` | Gives this instance its own dictionary |

## 2. `__init__` vs `__new__`

Normally `__new__` creates the instance and then `__init__` initializes it. You can see the order by overriding both:

```python
class Tracker:
    def __new__(cls, *args, **kwargs):
        print("__new__ creates the instance")
        return super().__new__(cls)

    def __init__(self, name):
        print("__init__ initializes it")
        self.name = name


tracker = Tracker("run-1")
print(tracker.name)  # run-1
```

Output:

```text
__new__ creates the instance
__init__ initializes it
run-1
```

| | `__new__` | `__init__` |
| --- | --- | --- |
| First argument | `cls`, the class | `self`, the new instance |
| Returns | The instance | Must return `None` |
| Typical need | Rare | Almost every class |

### When `__init__` Is Skipped

If `__new__` returns an object that isn't an instance of the requested class, that class's `__init__` isn't called.

```python
class Odd:
    def __new__(cls):
        return 42

    def __init__(self):
        print("never printed")


print(Odd())  # 42
```

### When You Actually Need `__new__`

`__new__` is mainly needed when the object's value must be fixed at creation time, such as subclasses of immutable types like `float`, `int`, `str`, or `tuple`. By the time `__init__` runs, an immutable value can no longer be changed.

```python
class Probability(float):
    def __new__(cls, value):
        if not 0 <= value <= 1:
            raise ValueError("probability must be in [0, 1]")
        return super().__new__(cls, value)


p = Probability(0.75)
print(p, isinstance(p, float))  # 0.75 True

try:
    Probability(1.5)
except ValueError as error:
    print(error)  # probability must be in [0, 1]
```

Other uses include singletons, caching instances, and metaclasses. For ordinary classes, `__init__` is the right place for setup.

## 3. `__init__` Must Return `None`

**Common mistake:** returning a value from `__init__`.

```python
class Invalid:
    def __init__(self):
        return 10


# Invalid()
# TypeError: __init__() should return None, not 'int'
```

The same error, caught:

```python
class Invalid:
    def __init__(self):
        return 10


try:
    Invalid()
except TypeError as error:
    print(error)  # __init__() should return None, not 'int'
```

A bare `return` or `return None` is allowed, for example to exit early. The value of `Model(...)` is always the instance, not the return value of `__init__`.

If you want a constructor-like function that returns something different, use a class method as an alternative constructor or a separate factory function.

```python
class Model:
    def __init__(self, name, learning_rate):
        self.name = name
        self.learning_rate = learning_rate

    @classmethod
    def from_dict(cls, settings):
        return cls(settings["name"], settings["learning_rate"])


model = Model.from_dict({"name": "SVM", "learning_rate": 0.1})
print(model.name)  # SVM
```

## 4. Initialize Attributes Separately for Each Instance

Each instance gets its own `metrics` dictionary because the dictionary is created inside `__init__`, which runs once per instance.

### Pitfall: A Mutable Class Attribute Is Shared

```python
class SharedModel:
    metrics = {}  # Class attribute, created once

    def __init__(self, name):
        self.name = name


first = SharedModel("first")
second = SharedModel("second")

first.metrics["accuracy"] = 0.9

print(second.metrics)                    # {'accuracy': 0.9}
print(first.metrics is second.metrics)   # True
```

`first.metrics` finds no instance attribute, so the lookup falls back to the single class attribute. Both instances mutate the same dictionary.

### Pitfall: A Mutable Default Argument Is Shared

```python
class Pipeline:
    def __init__(self, steps=[]):
        self.steps = steps


first = Pipeline()
second = Pipeline()

first.steps.append("scale")

print(second.steps)  # ['scale']
```

The default list is created once, when the `def` statement runs. Use `None` and create a new list inside `__init__`:

```python
class Pipeline:
    def __init__(self, steps=None):
        self.steps = [] if steps is None else list(steps)


first = Pipeline()
second = Pipeline()
first.steps.append("scale")

print(first.steps)   # ['scale']
print(second.steps)  # []
```

`list(steps)` also copies a list passed by the caller, so later changes to the caller's list don't affect the pipeline.

| Where state is created | Shared between instances? |
| --- | --- |
| `self.metrics = {}` inside `__init__` | No |
| `metrics = {}` in the class body | Yes |
| `def __init__(self, steps=[])` | Yes, when the default is used |
| `steps=None`, then `[]` inside `__init__` | No |

Immutable class attributes, such as `default_epochs = 10`, are safe as shared defaults because they can't be modified in place.

## 5. Follow-Up: Is `__init__` Required, and Is It Inherited?

`__init__` is optional. A class without one inherits `__init__` from its parent, ultimately from `object`, which accepts no extra arguments.

```python
class Model:
    def __init__(self, name):
        self.name = name


class Classifier(Model):
    pass


classifier = Classifier("Animal Classifier")
print(classifier.name)  # Animal Classifier
```

If a subclass defines its own `__init__`, the parent's `__init__` is not called automatically. Call `super().__init__(...)` when the parent's setup is needed.

`__init__` is often informally called a constructor. More precisely, `__new__` constructs the object and `__init__` initializes it.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `__init__` initializes a new instance | `Model("Random Forest")` calls `__init__` |
| `self` is the instance being initialized | `self.name = name` |
| `__new__` creates; `__init__` initializes | `__new__` is needed for immutable subclasses |
| `__init__` must return `None` | `return 10` raises `TypeError` |
| Per-instance state belongs in `__init__` | `self.metrics = {}` |
| Mutable class attributes and defaults are shared | `metrics = {}` in the class body |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| When is `__init__` called? | Automatically, after the instance is created |
| What is `self`? | The instance being initialized |
| Is `self` a keyword? | No; it is a convention for the first parameter |
| Which method creates the instance? | `__new__` |
| What must `__init__` return? | `None` |
| When is `__init__` skipped? | When `__new__` returns an object that isn't an instance of the class |
| Where should a per-instance list be created? | Inside `__init__` |
| Is a dict in the class body shared? | Yes |
| Is the parent `__init__` called automatically? | Only if the subclass doesn't define its own `__init__` |

## 8. Interview-Ready Answer

> `__init__` is the initializer that Python calls automatically after a new instance is created. Its first parameter, `self`, is that new instance, and assigning `self.attribute` stores state on it. Strictly speaking, `__new__` creates the object and `__init__` only sets it up, which is why `__new__` is needed for subclasses of immutable types like `float`. `__init__` must return `None`; returning anything else raises a `TypeError`. I create mutable attributes like lists and dictionaries inside `__init__` so each instance gets its own, rather than sharing a class attribute or a mutable default argument.

---

# Python Interview Question: Instance, Class, and Static Methods

**Difficulty:** 🟡 Intermediate

## Question: What Is the Difference Between Instance, Class, and Static Methods?

**Answer:** The difference is what Python passes automatically as the first argument. An instance method receives the instance (`self`), a class method receives the class it was called on (`cls`), and a static method receives nothing extra. Choose based on whether the method needs instance state, class-level behavior, or neither.

| Method type | Implicit first argument | Typical purpose |
| --- | --- | --- |
| Instance method | `self`: the instance | Read or modify instance state |
| Class method | `cls`: the class it's called on | Alternative constructors and class-level behavior |
| Static method | None | A related utility that needs neither the instance nor the class |

## 1. `self`, `cls`, and No Implicit First Argument

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

### What Python Passes Automatically

An instance method call is shorthand for calling the function on the class and passing the instance:

```python
class ModelConfig:
    def __init__(self, learning_rate):
        self.learning_rate = learning_rate

    def describe(self):
        return f"Learning rate: {self.learning_rate}"


config = ModelConfig(0.01)

print(config.describe())             # Learning rate: 0.01
print(ModelConfig.describe(config))  # Learning rate: 0.01
```

Class and static methods can be called through either the class or an instance. A class method called through an instance still receives the class, not the instance:

```python
class ModelConfig:
    @classmethod
    def which_class(cls):
        return cls.__name__

    @staticmethod
    def add(a, b):
        return a + b


config = ModelConfig()

print(ModelConfig.which_class())  # ModelConfig
print(config.which_class())       # ModelConfig
print(config.add(2, 3))           # 5
```

| Call | First argument received |
| --- | --- |
| `config.describe()` | `config` |
| `ModelConfig.describe(config)` | `config`, passed explicitly |
| `ModelConfig.from_dict(...)` | `ModelConfig` |
| `config.from_dict(...)` | `type(config)` |
| `ModelConfig.is_valid_rate(...)` | Nothing extra |

## 2. Using `@classmethod` and `@staticmethod` Correctly

### Pitfall: Forgetting `@staticmethod`

Without the decorator, a function in a class body is an instance method. It may still work when called on the class, but calling it on an instance passes the instance as an extra argument:

```python
class ModelConfig:
    def is_valid_rate(value):  # Missing @staticmethod
        return 0 < value <= 1


print(ModelConfig.is_valid_rate(0.01))  # True

try:
    ModelConfig().is_valid_rate(0.01)
except TypeError as error:
    print(error)
# ModelConfig.is_valid_rate() takes 1 positional argument but 2 were given
```

### Class Methods for Class-Level State

A class method can read and update attributes stored on the class:

```python
class Experiment:
    run_count = 0

    def __init__(self, name):
        self.name = name
        type(self).register()

    @classmethod
    def register(cls):
        cls.run_count += 1


Experiment("baseline")
Experiment("tuned")

print(Experiment.run_count)  # 2
```

Be careful with `self.run_count += 1` inside an instance method. It reads the class attribute but then creates an **instance** attribute, leaving the class counter unchanged:

```python
class Experiment:
    run_count = 0

    def start(self):
        self.run_count += 1


experiment = Experiment()
experiment.start()

print(experiment.run_count)  # 1
print(Experiment.run_count)  # 0
```

Note that `cls.run_count += 1` in a subclass call writes to the subclass, because `cls` is the subclass. If one counter should be shared across a hierarchy, write to the base class by name.

## 3. Instance Methods for Instance Behavior, Class Methods for Alternative Constructors

Use an instance method when the behavior depends on one object's data, such as `describe()`, `fit()`, or `predict()`.

Use a class method when you need another way to build an instance, such as from a dictionary, a JSON string, or a file:

```python
import json


class ModelConfig:
    def __init__(self, learning_rate, epochs=10):
        self.learning_rate = learning_rate
        self.epochs = epochs

    @classmethod
    def from_dict(cls, settings):
        return cls(settings["learning_rate"], settings.get("epochs", 10))

    @classmethod
    def from_json(cls, text):
        return cls.from_dict(json.loads(text))


config = ModelConfig.from_json('{"learning_rate": 0.05, "epochs": 30}')
print(config.learning_rate, config.epochs)  # 0.05 30
```

The standard library uses the same pattern:

```python
from datetime import date

print(dict.fromkeys(["cat", "dog"], 0))  # {'cat': 0, 'dog': 0}
print(int.from_bytes(b"\x01\x00", "big"))  # 256
print(date.fromisoformat("2024-01-15"))  # 2024-01-15
```

Use a static method for a helper that logically belongs with the class but needs no instance or class data, such as `is_valid_rate()`. A module-level function is an equally valid choice; a static method mainly groups the helper under the class's namespace.

## 4. How Class Methods Support Subclasses

`from_dict()` uses `cls(...)` instead of hardcoding `ModelConfig(...)`, so subclasses inherit a working alternative constructor:

```python
class ModelConfig:
    def __init__(self, learning_rate):
        self.learning_rate = learning_rate

    @classmethod
    def from_dict(cls, settings):
        return cls(settings["learning_rate"])


class AdvancedConfig(ModelConfig):
    pass


advanced = AdvancedConfig.from_dict({"learning_rate": 0.02})
print(type(advanced).__name__)  # AdvancedConfig
```

A static method that hardcodes the class name always returns the base class:

```python
class ModelConfig:
    def __init__(self, learning_rate):
        self.learning_rate = learning_rate

    @staticmethod
    def from_dict(settings):
        return ModelConfig(settings["learning_rate"])


class AdvancedConfig(ModelConfig):
    pass


advanced = AdvancedConfig.from_dict({"learning_rate": 0.02})
print(type(advanced).__name__)  # ModelConfig
```

`cls` also picks up class attributes that a subclass overrides:

```python
class Model:
    default_rate = 0.01

    def __init__(self, learning_rate):
        self.learning_rate = learning_rate

    @classmethod
    def with_defaults(cls):
        return cls(cls.default_rate)


class FineTuner(Model):
    default_rate = 0.0001


print(Model.with_defaults().learning_rate)      # 0.01
print(FineTuner.with_defaults().learning_rate)  # 0.0001
```

## 5. Follow-Up: How Do You Choose?

| The method needs... | Use |
| --- | --- |
| Data from a specific instance | Instance method |
| To create instances in a subclass-friendly way | Class method |
| Class-level attributes or configuration | Class method |
| Only its explicit arguments | Static method or module-level function |

A static method can still use objects you pass in explicitly. It just doesn't receive `self` or `cls` automatically.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Instance methods receive `self` | `config.describe()` |
| Class methods receive `cls` | `ModelConfig.from_dict(...)` |
| Static methods receive no implicit argument | `ModelConfig.is_valid_rate(0.01)` |
| Decorators are required for class and static methods | `@classmethod`, `@staticmethod` |
| Class methods are used for alternative constructors | `from_dict()`, `from_json()` |
| `cls(...)` makes constructors work for subclasses | `AdvancedConfig.from_dict(...)` returns `AdvancedConfig` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does an instance method receive first? | The instance, `self` |
| What does a class method receive first? | The class it was called on, `cls` |
| What does a static method receive first? | Nothing extra |
| Can you call a class method on an instance? | Yes; it still receives the class |
| What is a typical class method? | An alternative constructor such as `from_dict()` |
| Why use `cls(...)` instead of the class name? | Subclasses then get instances of themselves |
| Can a static method access instance data? | Only through objects passed explicitly |
| What happens if you forget `@staticmethod`? | Calls through an instance pass an extra argument |
| Does `self.count += 1` update a class attribute? | No; it creates an instance attribute |

## 8. Interview-Ready Answer

> The three method types differ in what Python passes automatically. An instance method receives `self`, so it works with one object's state, like `describe()` or `predict()`. A class method, marked with `@classmethod`, receives `cls`, the class it was called on, which makes it ideal for alternative constructors like `from_dict()`. Because it calls `cls(...)` rather than hardcoding the class name, a subclass calling it gets an instance of the subclass. A static method, marked with `@staticmethod`, receives nothing implicitly and is just a related utility, like a validation helper. I choose based on whether the method needs the instance, the class, or neither.

---

# Python Interview Question: Inheritance, Overriding, and `super()`

**Difficulty:** 🟡 Intermediate

## Question: Explain Inheritance, Method Overriding, and `super()`

**Answer:** Inheritance lets a subclass reuse behavior from a base class. Method overriding means a subclass defines a method with the same name as an inherited one, replacing it for instances of the subclass. `super()` gives access to the next implementation in the method resolution order (MRO), so an overriding method can extend the inherited behavior instead of rewriting it.

| Concept | Meaning |
| --- | --- |
| Inheritance | `class Classifier(Model)` reuses `Model`'s attributes and methods |
| Overriding | `Classifier` defines its own `describe()` |
| `super()` | Calls the next `describe()` in the MRO, here `Model.describe()` |

## 1. Reusing and Extending Behavior Through Inheritance

```python
class Model:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Model: {self.name}"

    def save(self):
        return f"Saving {self.name}"


class Classifier(Model):
    pass


classifier = Classifier("Animal Classifier")

print(classifier.describe())  # Model: Animal Classifier
print(classifier.save())      # Saving Animal Classifier
```

`Classifier` defines nothing, yet it has `__init__`, `describe()`, and `save()` because they are found on `Model`.

### How Attribute Lookup Works

When you access `classifier.save`, Python looks in the instance first, then in its class, then in each class of the MRO in order:

```python
class Model:
    pass


class Classifier(Model):
    pass


print([cls.__name__ for cls in Classifier.__mro__])
# ['Classifier', 'Model', 'object']
```

Every class ultimately inherits from `object`.

### "Is-a" Checks

```python
class Model:
    pass


class Classifier(Model):
    pass


classifier = Classifier()

print(isinstance(classifier, Model))  # True
print(issubclass(Classifier, Model))  # True
print(type(classifier) is Model)      # False
```

`isinstance()` accepts subclasses, which is usually what you want. `type(x) is Model` is an exact check that rejects subclasses.

## 2. Overriding a Parent Method

A subclass overrides a method by defining one with the same name. Python uses the first match in the MRO, so the subclass version wins.

```python
class Model:
    def predict(self, x):
        return 0


class ThresholdModel(Model):
    def predict(self, x):
        return 1 if x > 0.5 else 0


print(Model().predict(0.9))           # 0
print(ThresholdModel().predict(0.9))  # 1
```

### Base-Class Code Calls the Override

An override also takes effect when the base class calls the method through `self`. This is the basis of polymorphism and the "template method" pattern:

```python
class Model:
    def report(self):
        return f"[report] {self.describe()}"

    def describe(self):
        return "generic model"


class Classifier(Model):
    def describe(self):
        return "classifier"


print(Model().report())       # [report] generic model
print(Classifier().report())  # [report] classifier
```

`report()` is defined only in `Model`, but `self.describe()` resolves on the actual object, which is a `Classifier`.

### Keep Overrides Compatible

Python matches overrides by name only; it doesn't check signatures. An override should accept the same arguments and return a compatible result, so code written for the base class still works with the subclass. This is the Liskov substitution principle.

## 3. Using `super()` to Build on Inherited Behavior

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

### Pitfall: Forgetting `super().__init__()`

If a subclass defines its own `__init__`, Python doesn't call the base initializer automatically. Call `super().__init__(...)` when the base initialization is needed.

```python
class Model:
    def __init__(self, name):
        self.name = name

    def describe(self):
        return f"Model: {self.name}"


class Classifier(Model):
    def __init__(self, name, classes):
        self.classes = classes  # super().__init__(name) is missing


classifier = Classifier("Animal Classifier", ["cat", "dog"])

try:
    classifier.describe()
except AttributeError as error:
    print(error)  # 'Classifier' object has no attribute 'name'
```

The error appears later, far from the real bug, which makes it harder to diagnose.

### Forms of `super()`

| Form | Notes |
| --- | --- |
| `super().method()` | Python 3 zero-argument form; preferred |
| `super(Classifier, self).method()` | Explicit form; equivalent inside `Classifier` |
| `Model.method(self)` | Calls one fixed class directly; bypasses the MRO |

The zero-argument form works inside methods defined in a class body, because the compiler provides the enclosing class automatically.

## 4. `super()` Follows the MRO, Not One Fixed Parent

`super()` doesn't mean "my parent class". It means "the next class after this one in the MRO of `type(self)`". With single inheritance those are the same, but with multiple inheritance they can differ.

```python
class Model:
    def describe(self):
        return "Model"


class LoggingMixin:
    def describe(self):
        return "Logging -> " + super().describe()


class Classifier(LoggingMixin, Model):
    def describe(self):
        return "Classifier -> " + super().describe()


print(Classifier().describe())
# Classifier -> Logging -> Model

print([cls.__name__ for cls in Classifier.__mro__])
# ['Classifier', 'LoggingMixin', 'Model', 'object']
```

`LoggingMixin` doesn't inherit from `Model`, yet its `super().describe()` reaches `Model.describe()`. That is because, for a `Classifier` instance, `Model` comes after `LoggingMixin` in the MRO.

This is why cooperative classes call `super()` instead of naming a parent directly: each class hands control to whatever comes next in the final class's MRO.

## 5. Follow-Up: When Should You Prefer Composition?

Inheritance models an "is-a" relationship: a `Classifier` is a `Model`. When one object merely **uses** another, composition is usually simpler:

```python
class StandardScaler:
    def transform(self, values):
        mean = sum(values) / len(values)
        return [v - mean for v in values]


class Pipeline:
    def __init__(self, scaler):
        self.scaler = scaler  # Has-a relationship

    def run(self, values):
        return self.scaler.transform(values)


pipeline = Pipeline(StandardScaler())
print(pipeline.run([1, 2, 3]))  # [-1.0, 0.0, 1.0]
```

| Use inheritance when | Use composition when |
| --- | --- |
| The subclass truly is a kind of the base | One object uses another |
| Code should work with base and subclass interchangeably | You want to swap components easily |
| The hierarchy is shallow and stable | Deep hierarchies would become fragile |

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Inheritance reuses and extends behavior | `class Classifier(Model)` |
| Overriding replaces an inherited method | `Classifier.describe()` |
| Base-class code uses the override | `self.describe()` inside `Model.report()` |
| `super()` builds on inherited behavior | `super().describe()` |
| The base `__init__` isn't called automatically | Call `super().__init__(name)` |
| `super()` follows the MRO | A mixin's `super()` can reach a sibling class |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is inheritance? | A subclass reusing a base class's attributes and methods |
| What is overriding? | Defining a method with the same name in the subclass |
| Which version runs for a subclass instance? | The first one found in the MRO, usually the subclass's |
| What does `super()` return? | A proxy that finds the next implementation in the MRO |
| Is the parent `__init__` called automatically? | Not if the subclass defines its own `__init__` |
| Does Python check override signatures? | No; matching is by name only |
| `isinstance()` vs `type() is`? | `isinstance()` accepts subclasses |
| Why prefer `super()` over `Model.method(self)`? | It follows the MRO and supports cooperative inheritance |
| What is the root of every class? | `object` |

## 8. Interview-Ready Answer

> Inheritance lets a subclass reuse a base class's behavior, so a `Classifier` that inherits from `Model` automatically gets its methods. Overriding means the subclass defines a method with the same name, and because Python searches the MRO starting from the subclass, that version runs, even when base-class code calls it through `self`. `super()` lets the override extend the inherited behavior, such as calling `super().__init__(name)` and then adding new attributes. Python doesn't call the parent `__init__` automatically when a subclass defines its own, so forgetting `super().__init__()` is a common bug. Finally, `super()` means the next class in the MRO, not a fixed parent, which matters with multiple inheritance and mixins.

---

# Python Interview Question: Multiple Inheritance and MRO

**Difficulty:** 🔴 Advanced

## Question: What Is Multiple Inheritance and MRO?

**Answer:** Multiple inheritance means a class inherits from more than one base class. The MRO (method resolution order) is the order in which Python searches classes for methods and attributes. Python builds it with C3 linearization, which respects the order of the base classes and lists each class only once. `super()` follows this order, which is what makes cooperative multiple inheritance work.

| Term | Meaning |
| --- | --- |
| Multiple inheritance | `class D(B, C)` has two direct bases |
| MRO | The linear search order, such as `D, B, C, A, object` |
| C3 linearization | The algorithm Python uses to compute the MRO |
| Cooperative `super()` | Every class calls `super()` so each implementation runs once |

## 1. A Class That Inherits from More Than One Base Class

Multiple inheritance is most often used for **mixins**: small classes that add one focused capability.

```python
import json


class Model:
    def __init__(self, name):
        self.name = name


class JsonMixin:
    def to_json(self):
        return json.dumps(vars(self))


class LoggingMixin:
    def log(self, message):
        return f"[{type(self).__name__}] {message}"


class Classifier(JsonMixin, LoggingMixin, Model):
    pass


classifier = Classifier("spam-filter")

print(classifier.to_json())        # {"name": "spam-filter"}
print(classifier.log("trained"))   # [Classifier] trained
```

`Classifier` gets `to_json()` from one base, `log()` from another, and `__init__` from `Model`.

When two bases define the same name, the one that appears earlier in the MRO wins:

```python
class Fast:
    def mode(self):
        return "fast"


class Accurate:
    def mode(self):
        return "accurate"


class Hybrid(Fast, Accurate):
    pass


print(Hybrid().mode())  # fast
```

Swapping the order to `class Hybrid(Accurate, Fast)` would return `"accurate"`.

## 2. The Method Resolution Order (MRO)

You can inspect the order with `__mro__` (a tuple) or `mro()` (a list):

```python
class A: pass
class B(A): pass
class C(A): pass
class D(B, C): pass


print([cls.__name__ for cls in D.__mro__])
# ['D', 'B', 'C', 'A', 'object']

print(D.mro() == list(D.__mro__))  # True
```

### Rules C3 Guarantees

| Rule | In the example |
| --- | --- |
| A class comes before its bases | `D` before `B` and `C`; `B` before `A` |
| Bases keep the order they were listed in | `B` before `C`, as in `class D(B, C)` |
| Each class appears exactly once | `A` appears once, though both `B` and `C` inherit it |
| A shared base comes after all its subclasses | `A` comes after both `B` and `C` |

### How C3 Computes `D`'s MRO

C3 takes the class, then merges its bases' MROs and the list of bases:

```text
L[B] = [B, A, object]
L[C] = [C, A, object]
L[D] = D + merge([B, A, object], [C, A, object], [B, C])
```

At each step it picks the first head that doesn't appear in the **tail** (any position after the first) of another list:

1. `B` is a head and not in any tail. Take `B`.
2. `A` is now a head, but it is in the tail of `[C, A, object]`. Skip it. Take `C`.
3. `A` is no longer in any tail. Take `A`, then `object`.

Result: `D, B, C, A, object`.

The MRO is the same for attributes and methods. Data attributes on classes follow it too.

## 3. The Diamond Problem and Cooperative `super()` Calls

In a diamond, two bases share a common ancestor. Without a well-defined order, the ancestor's method might run twice or the result could depend on an arbitrary search.

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

`B` inherits directly from `A`, yet `super()` inside `B.process()` reaches `C.process()` for a `D` instance, because `C` comes next in `D`'s MRO. `A.process()` runs exactly once.

### Pitfall: Calling a Parent Directly Breaks the Chain

```python
class A:
    def process(self):
        print("A")


class B(A):
    def process(self):
        print("B")
        A.process(self)  # Hardcoded parent


class C(A):
    def process(self):
        print("C")
        A.process(self)


class D(B, C):
    def process(self):
        print("D")
        B.process(self)
        C.process(self)


D().process()
# D
# B
# A
# C
# A
```

`A.process()` runs twice. Hardcoded calls ignore the MRO, which is exactly the diamond problem.

### Cooperative `__init__` with `**kwargs`

Cooperative methods should use compatible signatures and call `super()` consistently. For `__init__`, a common pattern is for each class to take the arguments it needs and pass the rest along:

```python
class Model:
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name


class LoggingMixin:
    def __init__(self, log_level="INFO", **kwargs):
        super().__init__(**kwargs)
        self.log_level = log_level


class Classifier(LoggingMixin, Model):
    def __init__(self, classes, **kwargs):
        super().__init__(**kwargs)
        self.classes = classes


clf = Classifier(classes=["cat", "dog"], name="animals", log_level="DEBUG")

print(clf.name, clf.log_level, clf.classes)  # animals DEBUG ['cat', 'dog']
```

The chain is `Classifier -> LoggingMixin -> Model -> object`. By the time it reaches `object.__init__()`, every keyword argument has been consumed. If any were left over, `object.__init__()` would raise a `TypeError`.

| Cooperative rule | Reason |
| --- | --- |
| Every class in the chain calls `super()` | Otherwise later classes are skipped |
| Use keyword arguments | Positional order is hard to share across unknown classes |
| Consume your own arguments, forward the rest | `object.__init__()` accepts no extra arguments |
| A root class ends the chain | Something must stop calling `super()` for custom methods like `process()` |

## 4. Inspecting the MRO and Hierarchies That Can't Produce One

Python raises `TypeError` when it can't build a consistent MRO.

### A Base Listed Before Its Own Subclass

```python
class X: pass
class Y(X): pass


try:
    class Z(X, Y): pass
except TypeError as error:
    print(error)
# Cannot create a consistent method resolution
# order (MRO) for bases X, Y
```

`class Z(X, Y)` asks for `X` before `Y`, but `Y` is a subclass of `X` and must come first. Both rules can't hold. (CPython 3.12 prints this message across two lines, as shown; the exact wording can vary between versions.) The fix is `class Z(Y)` or `class Z(Y, X)`.

### Conflicting Orders in Two Bases

```python
class P: pass
class Q: pass
class First(P, Q): pass
class Second(Q, P): pass


try:
    class Both(First, Second): pass
except TypeError as error:
    print(error)
# Cannot create a consistent method resolution
# order (MRO) for bases P, Q
```

`First` requires `P` before `Q`, while `Second` requires `Q` before `P`.

| Tool | Use |
| --- | --- |
| `Cls.__mro__` | Tuple of classes in lookup order |
| `Cls.mro()` | The same order as a list |
| `Cls.__bases__` | Only the direct bases |
| `help(Cls)` | Shows the MRO in its "Method resolution order" section |

## 5. Follow-Up: How Do You Use Multiple Inheritance Safely?

Multiple inheritance works well for small mixins, such as logging or serialization behavior. Practical guidelines:

- Keep mixins small, focused, and free of heavy `__init__` logic.
- List mixins **before** the main base class, so their methods can wrap the base's methods with `super()`.
- Remember that a mixin's `super()` depends on the final class, not on the mixin's own bases.
- Prefer composition when classes don't share a real "is-a" relationship.

```python
class Model:
    def predict(self, x):
        return x * 2


class TimingMixin:
    def predict(self, x):
        result = super().predict(x)
        return f"predicted {result}"


class TimedModel(TimingMixin, Model):
    pass


class WrongOrder(Model, TimingMixin):
    pass


print(TimedModel().predict(3))  # predicted 6
print(WrongOrder().predict(3))  # 6
```

In `WrongOrder`, `Model.predict()` is found first and the mixin's wrapper never runs.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| A class can inherit from several bases | `class D(B, C)` |
| The MRO defines lookup order | `['D', 'B', 'C', 'A', 'object']` |
| C3 keeps base order and lists each class once | `A` appears once, after `B` and `C` |
| Cooperative `super()` solves the diamond problem | `A.process()` runs once |
| `super()` follows the instance's MRO | `B`'s `super()` reaches `C` |
| The MRO can be inspected | `D.__mro__`, `D.mro()` |
| Inconsistent hierarchies are rejected | `class Z(X, Y)` where `Y` subclasses `X` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is multiple inheritance? | A class with more than one direct base class |
| What is the MRO? | The order Python searches classes for attributes |
| Which algorithm builds it? | C3 linearization |
| How do you inspect it? | `Cls.__mro__` or `Cls.mro()` |
| What is the diamond problem? | Two bases share an ancestor, risking duplicate or ambiguous calls |
| How does Python solve it? | The ancestor appears once in the MRO, and cooperative `super()` visits each class once |
| Does `super()` always mean the direct parent? | No; it means the next class in `type(self)`'s MRO |
| Why use `**kwargs` in cooperative `__init__`? | Each class takes its arguments and forwards the rest |
| When does Python raise `TypeError`? | When no consistent MRO exists |
| Where should mixins go in the base list? | Usually before the main base class |

## 8. Interview-Ready Answer

> Multiple inheritance means a class has more than one base class, which in practice is mostly used for small mixins like logging or serialization. Python resolves attribute lookups using the method resolution order, computed with C3 linearization: a class comes before its bases, bases keep their listed order, and each class appears exactly once. I can inspect it with `__mro__` or `mro()`. In a diamond, like `D(B, C)` where both inherit from `A`, the MRO is `D, B, C, A, object`, and if every class calls `super()`, each method runs once, with `B`'s `super()` actually reaching `C`. Cooperative methods need compatible signatures, often using `**kwargs`. If the bases impose contradictory orders, Python refuses to create the class and raises a `TypeError`.

---

# Python Interview Question: Dunder (Magic) Methods

**Difficulty:** 🟡 Intermediate

## Question: What Are Dunder/Magic Methods? Give Examples Such as `__str__`, `__len__`, and `__call__`

**Answer:** Dunder methods are special methods whose names start and end with double underscores. They let your objects take part in built-in operations such as printing, `len()`, iteration, and being called like a function. You define them, and Python calls them for you when the matching syntax or built-in function is used.

| Method | Triggered by | Purpose |
| --- | --- | --- |
| `__init__` | Creating an instance | Initialize instance state |
| `__str__` | `str(obj)` or `print(obj)` | Return a readable string |
| `__repr__` | `repr(obj)` | Return a developer-oriented string |
| `__len__` | `len(obj)` | Return a non-negative integer length |
| `__call__` | `obj(...)` | Make an instance callable |
| `__iter__` | `iter(obj)` or a `for` loop | Provide an iterator |
| `__getitem__` | `obj[key]` | Support item access |

## 1. Special Methods with Double Underscores

"Dunder" is short for "double underscore". `__len__` is pronounced "dunder len". They are also called magic methods or special methods.

```python
class Dataset:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)


dataset = Dataset([10, 20, 30])

print(len(dataset))  # 3
```

You write `__len__`, but you call `len(dataset)`. Use the normal operations, such as `len(dataset)`, instead of calling `dataset.__len__()` yourself.

### Python Looks Them Up on the Class

For implicit calls like `len(obj)`, Python looks up the special method on the object's type, not on the instance. Attaching one to an instance has no effect:

```python
class Box:
    pass


box = Box()
box.__len__ = lambda: 5

try:
    len(box)
except TypeError as error:
    print(error)  # object of type 'Box' has no len()
```

### Not the Same as Name Mangling

| Name | Meaning |
| --- | --- |
| `__len__` | Dunder method: leading **and** trailing double underscores |
| `__secret` | Name-mangled attribute: leading double underscore only |
| `_internal` | Single underscore: "internal use" convention |

Avoid inventing your own `__names__`; that naming pattern is reserved for Python's use.

## 2. Connecting Dunder Methods to Built-In Operations and Protocols

A **protocol** is a set of methods that makes an object work with a language feature. Python checks for behavior, not for a specific base class, which is often called duck typing.

| Protocol | Methods | Enables |
| --- | --- | --- |
| Sized | `__len__` | `len(obj)` |
| Sequence-like access | `__getitem__` | `obj[i]`, slicing if you handle slices |
| Iteration | `__iter__` (and `__next__` on the iterator) | `for x in obj` |
| Membership | `__contains__` | `x in obj` |
| Truthiness | `__bool__`, falling back to `__len__` | `if obj:` |
| Comparison | `__eq__`, `__lt__`, ... | `==`, `<` |
| Arithmetic | `__add__`, `__mul__`, ... | `+`, `*` |
| Context manager | `__enter__`, `__exit__` | `with obj:` |
| Callable | `__call__` | `obj(...)` |

### `__getitem__` Gives Indexing, Slicing, and Iteration

```python
class Dataset:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)

    def __getitem__(self, index):
        return self.rows[index]


dataset = Dataset([10, 20, 30])

print(dataset[1])    # 20
print(dataset[-1])   # 30
print(dataset[:2])   # [10, 20]
print(20 in dataset) # True

for row in dataset:
    print(row)
# 10
# 20
# 30
```

Because `__getitem__` delegates to a list, slicing works too. Without `__iter__` or `__contains__`, Python falls back to calling `__getitem__` with `0, 1, 2, ...` until `IndexError` is raised. Defining `__iter__` explicitly is clearer.

### Operators and `NotImplemented`

```python
class Metrics:
    def __init__(self, correct, total):
        self.correct = correct
        self.total = total

    def __add__(self, other):
        if not isinstance(other, Metrics):
            return NotImplemented
        return Metrics(self.correct + other.correct, self.total + other.total)

    def __repr__(self):
        return f"Metrics(correct={self.correct}, total={self.total})"


print(Metrics(8, 10) + Metrics(9, 10))  # Metrics(correct=17, total=20)

try:
    Metrics(8, 10) + 5
except TypeError as error:
    print(error)  # unsupported operand type(s) for +: 'Metrics' and 'int'
```

Returning `NotImplemented` lets Python try the other operand's method, such as `int.__radd__`, and raise a clear `TypeError` if nothing works.

## 3. Implementing `__str__`, `__len__`, and `__call__` Correctly

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

### `__str__` Must Return a String

```python
class BadLabel:
    def __str__(self):
        return 42


try:
    str(BadLabel())
except TypeError as error:
    print(error)  # __str__ returned non-string (type int)
```

### `__len__` Must Return a Non-Negative Integer

```python
class NegativeLength:
    def __len__(self):
        return -1


class FloatLength:
    def __len__(self):
        return 2.5


try:
    len(NegativeLength())
except ValueError as error:
    print(error)  # __len__() should return >= 0

try:
    len(FloatLength())
except TypeError as error:
    print(error)  # 'float' object cannot be interpreted as an integer
```

`__len__` also controls truthiness when `__bool__` isn't defined, so an empty dataset is falsy:

```python
class Dataset:
    def __init__(self, rows):
        self.rows = list(rows)

    def __len__(self):
        return len(self.rows)


print(bool(Dataset([])))   # False
print(bool(Dataset([1])))  # True
```

### `__call__` Makes Instances Behave Like Functions

A callable object is useful when a function needs configuration or state, such as a preprocessing transform:

```python
class Normalizer:
    def __init__(self, mean, std):
        self.mean = mean
        self.std = std

    def __call__(self, value):
        return (value - self.mean) / self.std


normalize = Normalizer(mean=50, std=10)

print(normalize(70))       # 2.0
print(callable(normalize)) # True
print(list(map(normalize, [40, 50, 60])))  # [-1.0, 0.0, 1.0]
```

Frameworks use the same idea. For example, calling a PyTorch `nn.Module` instance as `model(x)` goes through `__call__`, which runs hooks and then `forward()`.

## 4. `__str__` vs `__repr__`

| | `__str__` | `__repr__` |
| --- | --- | --- |
| Audience | End users, logs, reports | Developers, debugging |
| Used by | `str()`, `print()`, `f"{obj}"` | `repr()`, the REPL, `f"{obj!r}"`, containers |
| Goal | Readable | Unambiguous; ideally looks like code that recreates the object |
| If missing | Falls back to `__repr__` | Falls back to `object.__repr__`, e.g. `<Dataset object at 0x...>` |

Containers use `repr()` for their elements, even when you print the container:

```python
class Dataset:
    def __init__(self, name):
        self.name = name

    def __str__(self):
        return f"Dataset {self.name}"

    def __repr__(self):
        return f"Dataset({self.name!r})"


datasets = [Dataset("train"), Dataset("test")]

print(datasets[0])     # Dataset train
print(datasets)        # [Dataset('train'), Dataset('test')]
print(f"{datasets[0]!r}")  # Dataset('train')
```

If you define only one, define `__repr__`, because `str()` falls back to it:

```python
class Run:
    def __repr__(self):
        return "Run(id=7)"


print(str(Run()))  # Run(id=7)
```

## 5. Follow-Up: What Happens to `__hash__` When You Define `__eq__`?

Defining `__eq__` without `__hash__` sets `__hash__` to `None`, making instances unhashable. This prevents equal objects from having different hashes.

```python
class Label:
    def __init__(self, name):
        self.name = name

    def __eq__(self, other):
        return isinstance(other, Label) and self.name == other.name


print(Label("cat") == Label("cat"))  # True

try:
    {Label("cat")}
except TypeError as error:
    print(error)  # unhashable type: 'Label'
```

To make it hashable, define `__hash__` based on the same fields used for equality, for example `return hash(self.name)`, and treat those fields as immutable.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Dunder methods have double underscores on both sides | `__len__`, `__str__` |
| Python calls them for built-in operations | `len(obj)` calls `type(obj).__len__(obj)` |
| They implement protocols | `__getitem__` and `__iter__` enable loops |
| `__str__` returns a readable string | `print(dataset)` |
| `__len__` returns a non-negative `int` | Returning `-1` raises `ValueError` |
| `__call__` makes instances callable | `normalize(70)` |
| `__str__` is readable; `__repr__` is for developers | Containers show `repr()` of elements |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is a dunder method? | A special method named `__name__` that Python calls for built-in operations |
| What calls `__str__`? | `str()`, `print()`, and f-strings |
| What calls `__repr__`? | `repr()`, the REPL, `!r`, and containers |
| If only `__repr__` exists, what does `print()` show? | The `__repr__` result |
| What must `__len__` return? | A non-negative `int` |
| What does `__call__` enable? | Calling an instance like `obj(...)` |
| Should you call `obj.__len__()` directly? | No; use `len(obj)` |
| Does attaching `__len__` to an instance work? | No; implicit lookup uses the class |
| What should an operator return for unsupported types? | `NotImplemented` |
| What does defining `__eq__` do to `__hash__`? | Sets it to `None` unless you define `__hash__` |

## 8. Interview-Ready Answer

> Dunder methods are special methods named with double underscores on both sides, like `__init__`, `__str__`, and `__len__`. They are how Python's built-in operations hook into my classes: `len(obj)` calls `__len__`, `print(obj)` calls `__str__`, and `obj(...)` calls `__call__`. Together they form protocols, so defining `__getitem__` or `__iter__` makes an object indexable or iterable without inheriting from any particular class. `__str__` should be readable for users, while `__repr__` should be unambiguous for developers, and `str()` falls back to `__repr__` if `__str__` is missing. Each method has a contract, for example `__len__` must return a non-negative integer. I call the built-in operations rather than the dunder methods directly.

---

# Python Interview Question: Dataclasses

**Difficulty:** 🟡 Intermediate

## Question: What Are Dataclasses, and Why Are They Useful?

**Answer:** A dataclass is a class decorated with `@dataclass` from the `dataclasses` module (Python 3.7+). It uses the annotated fields to generate common methods, which makes data containers shorter and easier to maintain. By default it generates `__init__`, `__repr__`, and `__eq__`, unless you turn that behavior off or define the method yourself. You can also request ordering comparisons with `order=True`.

| Option | Default | Effect |
| --- | --- | --- |
| `init` | `True` | Generate `__init__` |
| `repr` | `True` | Generate `__repr__` |
| `eq` | `True` | Generate `__eq__` |
| `order` | `False` | Generate `<`, `<=`, `>`, `>=` |
| `frozen` | `False` | Block field assignment after creation |
| `slots` | `False` | Use `__slots__` (Python 3.10+) |
| `kw_only` | `False` | Make fields keyword-only in `__init__` (Python 3.10+) |

## 1. Dataclasses Reduce Boilerplate for Classes That Mainly Store Data

Without a dataclass, a simple configuration class needs repetitive code:

```python
class ManualConfig:
    def __init__(self, name, learning_rate=0.01, epochs=10):
        self.name = name
        self.learning_rate = learning_rate
        self.epochs = epochs

    def __repr__(self):
        return (f"ManualConfig(name={self.name!r}, "
                f"learning_rate={self.learning_rate!r}, epochs={self.epochs!r})")

    def __eq__(self, other):
        if other.__class__ is not self.__class__:
            return NotImplemented
        return (self.name, self.learning_rate, self.epochs) == (
            other.name, other.learning_rate, other.epochs)


print(ManualConfig("Classifier"))
# ManualConfig(name='Classifier', learning_rate=0.01, epochs=10)
```

Each new field must be added in three places. The dataclass version lists each field once:

```python
from dataclasses import dataclass


@dataclass
class ModelConfig:
    name: str
    learning_rate: float = 0.01
    epochs: int = 10


print(ModelConfig("Classifier"))
# ModelConfig(name='Classifier', learning_rate=0.01, epochs=10)
```

A dataclass is still an ordinary class. You can add methods, properties, and class methods.

```python
from dataclasses import dataclass


@dataclass
class Split:
    train: int
    test: int

    def test_ratio(self):
        return self.test / (self.train + self.test)


print(Split(800, 200).test_ratio())  # 0.2
```

## 2. The Generated Methods: `__init__`, `__repr__`, and `__eq__`

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
print(first is second)  # False
```

`==` compares the fields in order, as if comparing tuples, and only when both objects have the same class. Without a dataclass, `==` would compare identity and return `False`.

### Ordering with `order=True`

```python
from dataclasses import dataclass


@dataclass(order=True)
class Result:
    score: float
    model: str


results = [Result(0.91, "svm"), Result(0.87, "tree"), Result(0.95, "boost")]

print(max(results))  # Result(score=0.95, model='boost')
print(sorted(results)[0].model)  # tree
```

Comparison uses fields in definition order, so put the sort key first.

### Fields Without Defaults Must Come First

```python
from dataclasses import dataclass

try:
    @dataclass
    class Broken:
        learning_rate: float = 0.01
        name: str
except TypeError as error:
    print(error)  # non-default argument 'name' follows default argument
```

The generated `__init__` follows normal function rules. (The message wording differs slightly in newer Python versions.)

### Hashing

With the default `eq=True` and `frozen=False`, the dataclass sets `__hash__` to `None`, so instances are unhashable. With `frozen=True` and `eq=True`, it generates a field-based `__hash__`.

```python
from dataclasses import dataclass


@dataclass
class Mutable:
    value: int


@dataclass(frozen=True)
class Frozen:
    value: int


print(Mutable.__hash__)         # None
print({Frozen(1), Frozen(1)})   # {Frozen(value=1)}
```

### Helpers

```python
from dataclasses import dataclass, asdict, astuple, replace, fields


@dataclass
class ModelConfig:
    name: str
    learning_rate: float = 0.01


config = ModelConfig("Classifier")

print(asdict(config))  # {'name': 'Classifier', 'learning_rate': 0.01}
print(astuple(config))  # ('Classifier', 0.01)
print(replace(config, learning_rate=0.1))  # ModelConfig(name='Classifier', learning_rate=0.1)
print([f.name for f in fields(config)])  # ['name', 'learning_rate']
```

`asdict()` is handy for logging hyperparameters or writing JSON. `replace()` creates a new instance with some fields changed.

## 3. `field(default_factory=...)` for Mutable Defaults

`default_factory=list` creates a separate list for each instance. (`list[str]` needs Python 3.9+.)

```python
from dataclasses import dataclass, field


@dataclass
class ModelConfig:
    name: str
    features: list[str] = field(default_factory=list)


first = ModelConfig("Classifier")
second = ModelConfig("Classifier")

first.features.append("age")
print(first.features)   # ['age']
print(second.features)  # []
```

A plain mutable default is rejected when the class is defined:

```python
from dataclasses import dataclass

try:
    @dataclass
    class Broken:
        features: list = []
except ValueError as error:
    print(error)
# mutable default <class 'list'> for field features is not allowed: use default_factory
```

This protects against the shared-default bug seen with ordinary functions. Before Python 3.11, only `list`, `dict`, and `set` defaults were rejected; since 3.11, any unhashable default is rejected.

### Other `field()` Options

```python
from dataclasses import dataclass, field


@dataclass
class TrainingRun:
    run_id: str
    api_key: str = field(repr=False)
    history: list = field(default_factory=list, compare=False)
    best_loss: float = field(init=False, default=float("inf"))


run = TrainingRun("run-1", api_key="secret")

print(run)  # TrainingRun(run_id='run-1', history=[], best_loss=inf)
print(TrainingRun("run-1", "a") == TrainingRun("run-1", "a", history=[1.0]))  # True
```

| `field()` argument | Effect |
| --- | --- |
| `default_factory=list` | New default object per instance |
| `repr=False` | Hide the field from `__repr__`, useful for secrets |
| `compare=False` | Exclude the field from `==` and ordering |
| `init=False` | Exclude the field from `__init__` parameters |

## 4. Type Hints Aren't Validation, and `frozen=True` Isn't Deep Immutability

### Annotations Are Not Enforced

```python
from dataclasses import dataclass


@dataclass
class TrainingConfig:
    epochs: int
    learning_rate: float


config = TrainingConfig(epochs="many", learning_rate=None)
print(config)  # TrainingConfig(epochs='many', learning_rate=None)
```

The annotations define the fields, but the generated `__init__` doesn't check types.

### Adding Validation with `__post_init__`

The generated `__init__` calls `__post_init__` after assigning the fields:

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

try:
    TrainingConfig(epochs=0, learning_rate=0.01)
except ValueError as error:
    print(error)  # epochs must be positive
```

These checks validate values. The annotations alone don't enforce types at runtime. Libraries such as Pydantic provide runtime type validation and conversion if you need it.

### Frozen Dataclasses

```python
from dataclasses import dataclass, FrozenInstanceError


@dataclass(frozen=True)
class ModelVersion:
    name: str
    version: int


model = ModelVersion("Classifier", 1)

# model.version = 2
# Raises dataclasses.FrozenInstanceError

try:
    model.version = 2
except FrozenInstanceError as error:
    print(error)  # cannot assign to field 'version'
```

`frozen=True` blocks ordinary reassignment of fields. It doesn't make mutable objects stored inside the fields immutable:

```python
from dataclasses import dataclass


@dataclass(frozen=True)
class FeatureSet:
    names: list


features = FeatureSet(["age"])
features.names.append("income")

print(features)  # FeatureSet(names=['age', 'income'])
```

Use immutable field types, such as `tuple` instead of `list`, when you need deeper immutability. A frozen instance containing a list is also unhashable, because hashing the fields fails on the list.

## 5. Follow-Up: What Do `slots=True` and `kw_only=True` Do?

Both require Python 3.10+.

```python
from dataclasses import dataclass


@dataclass(slots=True, kw_only=True)
class Hyperparameters:
    learning_rate: float = 0.01
    batch_size: int


params = Hyperparameters(batch_size=32)
print(params)  # Hyperparameters(learning_rate=0.01, batch_size=32)

try:
    params.momentum = 0.9
except AttributeError:
    print("No new attributes on a slots dataclass.")  # No new attributes on a slots dataclass.

try:
    Hyperparameters(0.01, 32)
except TypeError:
    print("Arguments must be passed by keyword.")  # Arguments must be passed by keyword.
```

| Option | Benefit |
| --- | --- |
| `slots=True` | Lower memory per instance, faster attribute access, and typos create errors instead of new attributes |
| `kw_only=True` | Clearer calls for many fields; default and non-default fields can appear in any order |

A class variable annotated with `typing.ClassVar` is not treated as a field.

| Alternative | When to choose it |
| --- | --- |
| Plain class | Behavior-heavy objects with custom initialization |
| `typing.NamedTuple` | Immutable, tuple-like records that should unpack and index |
| Dataclass | Mutable or frozen data containers with generated methods |
| Pydantic model | External data that needs runtime validation and parsing |

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Dataclasses reduce boilerplate for data containers | `@dataclass class ModelConfig` |
| `__init__`, `__repr__`, and `__eq__` are generated | `first == second` compares fields |
| `order=True` adds comparisons | `max(results)` |
| Mutable defaults need `default_factory` | `field(default_factory=list)` |
| Type hints aren't runtime validation | `epochs="many"` is accepted |
| `__post_init__` adds validation | Raise `ValueError` for non-positive epochs |
| `frozen=True` isn't deep immutability | A list field can still be appended to |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `@dataclass` generate by default? | `__init__`, `__repr__`, and `__eq__` |
| How do you add `<` and `>`? | `@dataclass(order=True)` |
| Why `field(default_factory=list)`? | Each instance gets its own list |
| What happens with `features: list = []`? | `ValueError` at class definition |
| Are type annotations enforced? | No |
| Where do you validate values? | `__post_init__` |
| What does `frozen=True` raise on assignment? | `FrozenInstanceError` |
| Is a frozen dataclass deeply immutable? | No; mutable field values can still change |
| Is a default dataclass hashable? | No; `eq=True` without `frozen` sets `__hash__` to `None` |
| Which version added `slots=` and `kw_only=`? | Python 3.10 |

## 8. Interview-Ready Answer

> A dataclass is a class decorated with `@dataclass`, which reads the annotated fields and generates `__init__`, `__repr__`, and `__eq__` for me, with optional ordering through `order=True`. That makes data containers like model configs or experiment results much shorter and less error-prone, because each field is declared once. For mutable defaults I use `field(default_factory=list)`, so each instance gets its own list, and plain mutable defaults are rejected anyway. The annotations aren't enforced at runtime, so I put value checks in `__post_init__`, or use a library like Pydantic for full validation. `frozen=True` prevents field reassignment and makes instances hashable, but it isn't deep immutability, since a list inside a field can still change.

---

# Python Interview Question: Lambda Functions

**Difficulty:** 🟢 Beginner

## Question: What Is a Lambda Function, and When Should You Avoid It?

**Answer:** A lambda is a small anonymous function written as a single expression. The expression's result is returned automatically. Lambdas are useful for short, throwaway callbacks such as sorting keys. Use a normal `def` when the logic needs several steps, exception handling, a docstring, or a meaningful name.

```python
lambda arguments: expression
```

| Feature | `lambda` | `def` |
| --- | --- | --- |
| Body | One expression | Any number of statements |
| Return | Implicit (the expression's value) | Explicit `return` (or `None`) |
| Name | Always `<lambda>` | The name you write |
| Docstring and annotations | Not supported in the syntax | Supported |
| Resulting object | A normal `function` object | A normal `function` object |

## 1. A Lambda Creates an Anonymous Function from a Single Expression

### Basic Syntax

```python
double = lambda number: number * 2
print(double(5))  # 10
```

This shows the syntax, but for a reusable named operation a normal `def` is usually clearer:

```python
def double(number):
    return number * 2

print(double(5))  # 10
```

### A Lambda Is an Ordinary Function Object

A lambda is not a special kind of function. It produces the same type of object as `def`. The only differences are the syntax and the name.

```python
square_lambda = lambda number: number ** 2

def square_def(number):
    return number ** 2

print(type(square_lambda) is type(square_def))  # True
print(square_lambda.__name__)                   # <lambda>
print(square_def.__name__)                      # square_def
```

### What a Lambda Can Contain

A lambda accepts the same parameter forms as `def`: defaults, `*args`, and `**kwargs`. Its body must be one expression, but a conditional expression is allowed.

```python
clip = lambda value, low=0.0, high=1.0: low if value < low else high if value > high else value

print(clip(-0.2))  # 0.0
print(clip(0.4))   # 0.4
print(clip(1.7))   # 1.0

total = lambda *values: sum(values)
print(total(1, 2, 3))  # 6
```

Statements such as `return`, `raise`, `try`, `for`, and ordinary assignment (`x = 1`) cannot appear in a lambda:

```python
# bad = lambda x: return x       # SyntaxError
# bad = lambda x: raise ValueError  # SyntaxError
```

| Allowed in a lambda | Not allowed in a lambda |
| --- | --- |
| Arithmetic, comparisons, function calls | `return`, `raise`, `assert` |
| Conditional expression `a if cond else b` | `if` / `elif` / `else` statements |
| Comprehensions | `for` and `while` loops |
| Default values, `*args`, `**kwargs` | Docstrings and type annotations |

## 2. Practical Use: Sorting Keys and Short Callbacks

The most common use is passing a short function as an argument, for example to `sorted()`, `min()`, `max()`, `map()`, or `filter()`.

### Sort Models by Accuracy

```python
models = [
    {"name": "Decision Tree", "accuracy": 0.85},
    {"name": "Random Forest", "accuracy": 0.93},
]

ranked = sorted(models, key=lambda model: model["accuracy"], reverse=True)
print([model["name"] for model in ranked])
# ['Random Forest', 'Decision Tree']
```

The lambda is defined exactly where it is used and has no use elsewhere, so a name would add nothing.

### Find the Best Model and Sort by Several Fields

```python
models = [
    {"name": "Decision Tree", "accuracy": 0.85, "latency_ms": 4},
    {"name": "Random Forest", "accuracy": 0.93, "latency_ms": 20},
    {"name": "Logistic Regression", "accuracy": 0.93, "latency_ms": 2},
]

best = max(models, key=lambda model: model["accuracy"])
print(best["name"])  # Random Forest

# Highest accuracy first, then lowest latency
ranked = sorted(models, key=lambda model: (-model["accuracy"], model["latency_ms"]))
print([model["name"] for model in ranked])
# ['Logistic Regression', 'Random Forest', 'Decision Tree']
```

`max()` returns the first maximal item it finds, so ties keep their original order.

### Alternatives That Are Often Clearer

For simple field access, `operator.itemgetter` and `operator.attrgetter` do the same job without a lambda. For transforming or filtering, a comprehension is usually more readable than `map()` or `filter()` with a lambda.

```python
from operator import itemgetter

scores = [("model_a", 0.81), ("model_b", 0.92), ("model_c", 0.77)]

print(sorted(scores, key=itemgetter(1)))
# [('model_c', 0.77), ('model_a', 0.81), ('model_b', 0.92)]

# map + lambda vs comprehension
percentages = list(map(lambda pair: round(pair[1] * 100), scores))
print(percentages)                                # [81, 92, 77]
print([round(score * 100) for _, score in scores])  # [81, 92, 77]
```

| Task | Lambda version | Often clearer |
| --- | --- | --- |
| Sort by a dict key | `key=lambda m: m["accuracy"]` | `key=itemgetter("accuracy")` |
| Sort by an attribute | `key=lambda m: m.score` | `key=attrgetter("score")` |
| Transform values | `map(lambda x: x * 2, xs)` | `[x * 2 for x in xs]` |
| Filter values | `filter(lambda x: x > 0, xs)` | `[x for x in xs if x > 0]` |

## 3. When to Avoid a Lambda: Use a Named Function

Avoid a lambda when the logic needs several steps, exception handling, a docstring, or a meaningful name for debugging:

```python
def normalize_score(score, minimum, maximum):
    if maximum <= minimum:
        raise ValueError("maximum must be greater than minimum")
    return (score - minimum) / (maximum - minimum)

print(normalize_score(75, 0, 100))  # 0.75
```

This needs validation and a `raise` statement, which a lambda cannot contain.

### Names Help Debugging

Every lambda is called `<lambda>`, so tracebacks and logs are less informative:

```python
import traceback

scale = lambda value: value / 0

try:
    scale(10)
except ZeroDivisionError as error:
    last_frame = traceback.extract_tb(error.__traceback__)[-1]
    print(last_frame.name)  # <lambda>
```

With `def scale(value): ...`, the traceback would show `scale` instead.

### Do Not Assign a Lambda to a Name

PEP 8 recommends `def` over binding a lambda to a name:

```python
# Discouraged
f1_score = lambda precision, recall: 2 * precision * recall / (precision + recall)

# Preferred
def f1_score(precision, recall):
    """Return the harmonic mean of precision and recall."""
    return 2 * precision * recall / (precision + recall)

print(round(f1_score(0.8, 0.6), 4))  # 0.6857
```

The `def` version has a real name, room for a docstring, and can grow without being rewritten.

| Situation | Choose |
| --- | --- |
| One-off key or callback, one short expression | `lambda` |
| Reused in several places | `def` |
| Needs validation, `try`/`except`, or loops | `def` |
| Needs a docstring or type hints | `def` |
| Would be assigned to a name anyway | `def` |
| Simple field lookup | `operator.itemgetter` / `attrgetter` |

## 4. Lambdas Capture Surrounding Variables Like Ordinary Functions

A lambda can read variables from the enclosing scope. It forms a closure in exactly the same way as a nested `def`.

```python
def make_threshold_filter(threshold):
    return lambda score: score >= threshold

passes = make_threshold_filter(0.9)
print(passes(0.93))  # True
print(passes(0.85))  # False
```

### Pitfall: Late Binding in Loops

Captured variables are looked up when the function is **called**, not when it is created:

```python
functions = [lambda: number for number in range(3)]
print([function() for function in functions])
# [2, 2, 2]
```

Bind the current value as a default argument to keep it:

```python
functions = [lambda number=number: number for number in range(3)]
print([function() for function in functions])
# [0, 1, 2]
```

This is not specific to lambdas. Functions defined with `def` inside a loop behave the same way.

## 5. Follow-Up: Is a Lambda Faster Than `def`?

No. A lambda and an equivalent `def` compile to the same kind of function object with essentially the same bytecode, so calling them costs the same. Choosing a lambda is a readability decision, not a performance one.

```python
import dis

add_lambda = lambda a, b: a + b

def add_def(a, b):
    return a + b

lambda_ops = [instr.opname for instr in dis.get_instructions(add_lambda)]
def_ops = [instr.opname for instr in dis.get_instructions(add_def)]

print(lambda_ops == def_ops)  # True
```

The exact bytecode is a CPython implementation detail and varies between versions, but the conclusion holds: there is no speed advantage to a lambda.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| A lambda is an anonymous single-expression function | `lambda number: number * 2` |
| The expression's value is returned automatically | No `return` keyword |
| Practical use as a short callback | `sorted(models, key=lambda m: m["accuracy"])` |
| Statements are not allowed | No `raise`, `try`, loops, or docstring |
| Use `def` for complex or reused logic | `normalize_score()` with validation |
| Lambdas capture surrounding variables | `lambda score: score >= threshold` |
| Lambdas are not faster than `def` | Same function type, same call cost |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is a lambda? | An anonymous function defined by one expression |
| What does it return? | The value of its expression |
| What is its `__name__`? | `<lambda>` |
| Can it have default arguments? | Yes, plus `*args` and `**kwargs` |
| Can it contain `if`? | Only a conditional expression, not an `if` statement |
| Can it raise or catch exceptions? | It cannot contain `raise` or `try` |
| Most common use? | Sorting keys and short callbacks |
| Should you write `f = lambda x: ...`? | No; PEP 8 recommends `def` |
| Is it faster than `def`? | No |
| Can it capture outer variables? | Yes, like any nested function, including late binding |

## 8. Interview-Ready Answer

> A lambda is an anonymous function defined by a single expression, and the value of that expression is returned automatically. It creates an ordinary function object, the same type that `def` creates, but its name is always `<lambda>` and it cannot contain statements, a docstring, or annotations. I use lambdas for short one-off callbacks, such as `sorted(models, key=lambda m: m["accuracy"])`. I avoid them when the logic needs several steps, validation, exception handling, documentation, or reuse, and I don't assign a lambda to a name because a `def` gives a clearer traceback. Lambdas capture surrounding variables just like nested functions, including the late-binding behavior in loops. They are not faster than `def`; the choice is about readability.

---

# Python Interview Question: Closures

**Difficulty:** 🟡 Intermediate

## Question: What Are Closures in Python?

**Answer:** A closure is a function that keeps access to variables from its enclosing function's scope, even after the outer function has finished running. Python stores these captured variables in cells attached to the inner function. Use `nonlocal` to reassign a captured variable, and watch for late binding when you create functions inside a loop.

| Term | Meaning |
| --- | --- |
| Enclosing function | The outer function that defines the variable |
| Inner function | The nested function that uses the variable |
| Free variable | A variable used by the inner function but defined in the enclosing scope |
| Closure | The inner function together with its captured free variables |

## 1. A Nested Function Keeps Access to Enclosing Variables

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

triple = make_multiplier(3)
print(triple(5))  # 15
```

`multiply()` uses `factor`, which is not one of its own parameters or local variables. Python resolves it in the enclosing scope, the **E** in the LEGB rule (Local, Enclosing, Global, Built-in).

### Each Call Creates a Separate Closure

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(10))  # 20
print(triple(10))  # 30
print(double is triple)  # False
```

Every call to `make_multiplier()` runs the body again, so each returned function has its own `factor`.

### ML Example: A Configured Preprocessing Function

```python
def make_scaler(mean, std):
    def scale(value):
        return (value - mean) / std
    return scale

scale_income = make_scaler(mean=50_000, std=10_000)
print(scale_income(65_000))  # 1.5
print(scale_income(40_000))  # -1.0
```

The training statistics are fixed once and reused for every value, without a class or global variables.

## 2. Captured Variables Stay Accessible After the Outer Function Returns

Normally a function's local variables disappear when it returns. When an inner function refers to them, Python keeps them alive in **cell objects** stored on the inner function.

```python
def make_multiplier(factor):
    def multiply(number):
        return number * factor
    return multiply

triple = make_multiplier(3)

print(triple.__code__.co_freevars)          # ('factor',)
print(triple.__closure__[0].cell_contents)  # 3
```

| Attribute | What it shows |
| --- | --- |
| `function.__code__.co_freevars` | Names of the captured variables |
| `function.__closure__` | A tuple of cells, one per free variable |
| `cell.cell_contents` | The current value stored in a cell |

A function that captures nothing is not a closure, and its `__closure__` is `None`:

```python
def plain(number):
    return number * 2

print(plain.__closure__)  # None
```

### The Cell Holds the Variable, Not a Snapshot

A closure captures the **variable**, not its value at creation time. If the enclosing scope changes the variable later, the inner function sees the new value.

```python
def make_reporter():
    status = "training"

    def report():
        return status

    status = "finished"
    return report

print(make_reporter()())  # finished
```

`report()` reads `status` when it is called, after the reassignment.

## 3. Use `nonlocal` to Rebind an Enclosing Variable

### Keeping State with `nonlocal`

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

### What Happens Without `nonlocal`

An assignment anywhere in a function makes that name local to the function. `count += 1` then tries to read a local `count` that has no value yet.

```python
def make_counter():
    count = 0

    def increment():
        count += 1
        return count

    return increment

counter = make_counter()

try:
    counter()
except UnboundLocalError as error:
    print(type(error).__name__)  # UnboundLocalError
```

### Mutating a Captured Object Does Not Need `nonlocal`

`nonlocal` is needed only to **rebind** the name. Mutating a captured mutable object is not rebinding.

```python
def make_loss_tracker():
    history = []

    def record(loss):
        history.append(loss)
        return len(history)

    return record

record = make_loss_tracker()
record(0.9)
print(record(0.7))  # 2
```

| Inside the inner function | Needs `nonlocal`? |
| --- | --- |
| `return count` (read only) | No |
| `count += 1` | Yes |
| `count = 0` | Yes |
| `history.append(loss)` | No; it mutates the list |
| `history = []` | Yes; it rebinds the name |

`nonlocal` only works for variables in an enclosing **function** scope. For module-level variables, use `global`. A `nonlocal` name that does not exist in an enclosing function is a `SyntaxError`.

## 4. Late Binding in Functions Created Inside Loops

### The Common Mistake

```python
functions = [lambda: number for number in range(3)]
print([function() for function in functions])
# [2, 2, 2]
```

These functions look up the shared variable when they're **called**, not when they're created, so they all see its final value. All three functions close over the same `number` variable.

The same thing happens with `def` and an ordinary loop:

```python
callbacks = []
for epoch in range(3):
    def report():
        return f"epoch {epoch}"
    callbacks.append(report)

print([callback() for callback in callbacks])
# ['epoch 2', 'epoch 2', 'epoch 2']
```

### Fix 1: Bind the Current Value as a Default Argument

If you want each function to keep the current value, bind it as a default argument:

```python
functions = [lambda number=number: number for number in range(3)]
print([function() for function in functions])
# [0, 1, 2]
```

Default values are evaluated when the function is created. The downside is that a caller could accidentally override the default.

### Fix 2: Use a Factory Function

Each factory call creates a new scope, so each closure gets its own variable:

```python
def make_reporter(epoch):
    def report():
        return f"epoch {epoch}"
    return report

callbacks = [make_reporter(epoch) for epoch in range(3)]
print([callback() for callback in callbacks])
# ['epoch 0', 'epoch 1', 'epoch 2']
```

### Fix 3: Use `functools.partial`

`partial` stores the argument value when it is created:

```python
from functools import partial

def report(epoch):
    return f"epoch {epoch}"

callbacks = [partial(report, epoch) for epoch in range(3)]
print([callback() for callback in callbacks])
# ['epoch 0', 'epoch 1', 'epoch 2']
```

| Fix | How it works | Trade-off |
| --- | --- | --- |
| `lambda n=n: n` | Default evaluated at creation | Callers can override the default |
| Factory function | New scope per call | Slightly more code |
| `functools.partial` | Stores the argument value | Not a closure; a `partial` object |

## 5. Follow-Up: Where Are Closures Used, and When Is a Class Better?

Closures are behind many common Python patterns:

- **Decorators:** the wrapper function closes over the decorated function.
- **Callbacks:** a configured function is passed to a training loop or event handler.
- **Function factories:** `make_scaler(mean, std)` returns a ready-to-use transformer.
- **Small pieces of state:** counters, caches, and running totals.

### Closure vs Class

The same counter written as a class:

```python
class Counter:
    def __init__(self):
        self.count = 0

    def __call__(self):
        self.count += 1
        return self.count

counter = Counter()
print(counter())       # 1
print(counter())       # 2
print(counter.count)   # 2
```

| Situation | Usually better |
| --- | --- |
| One behavior with a little fixed configuration | Closure |
| State that callers need to inspect or reset | Class |
| Several related operations on the same state | Class |
| Serialization with `pickle` (for example, `multiprocessing`) | Module-level function or class |

Nested functions, including closures, cannot be pickled by the standard `pickle` module, because pickle stores functions by their importable qualified name. This matters when sending work to `multiprocessing` workers.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| A nested function can use enclosing variables | `multiply()` uses `factor` |
| Captured variables outlive the outer call | `triple(5)` works after `make_multiplier()` returns |
| Python stores captured variables in cells | `triple.__closure__[0].cell_contents` |
| A closure captures the variable, not a snapshot | The inner function sees later reassignments |
| `nonlocal` is required to rebind | `nonlocal count; count += 1` |
| Mutation does not require `nonlocal` | `history.append(loss)` |
| Late binding in loops | `[lambda: n for n in range(3)]` gives `[2, 2, 2]` |
| Practical uses | Decorators, callbacks, configured preprocessing |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is a closure? | A function that keeps access to variables from its enclosing function |
| Which LEGB scope does it use? | Enclosing |
| Where are captured values stored? | In cell objects in `function.__closure__` |
| What is `__closure__` for a non-closure? | `None` |
| Does a closure copy the value? | No; it refers to the variable and sees later changes |
| When is `nonlocal` needed? | To reassign an enclosing function's variable |
| What happens without it? | `UnboundLocalError` when the name is read before assignment |
| Is `nonlocal` needed for `list.append()`? | No; that is mutation, not rebinding |
| Why does `[lambda: n for n in range(3)]` give `[2, 2, 2]`? | Late binding: `n` is looked up at call time |
| How do you fix late binding? | Default argument, factory function, or `functools.partial` |

## 8. Interview-Ready Answer

> A closure is a nested function that keeps access to variables from its enclosing function's scope, even after the outer function has returned. Python keeps those variables alive in cell objects attached to the inner function, which you can see through `__closure__`. For example, `make_multiplier(3)` returns a function that still knows `factor` is 3. A closure only reads captured variables by default; to reassign one, such as a counter, you declare it `nonlocal`, although mutating a captured list doesn't need that. Closures capture variables, not values, so functions created in a loop all see the loop variable's final value; I fix that with a default argument, a factory function, or `functools.partial`. Closures are the mechanism behind decorators, callbacks, and small configured functions such as a scaler that remembers training statistics.

---

# Python Interview Question: Decorators

**Difficulty:** 🟡 Intermediate

## Question: What Is a Decorator, and How Do You Write One?

**Answer:** A decorator is a callable that receives a function (or class) and returns the object that should replace it. A typical function decorator wraps the function to add behavior before or after it runs, without editing the function's body. A well-written wrapper passes all arguments through, returns the original result, and uses `functools.wraps` to keep the function's metadata.

| Part of a decorator | Purpose |
| --- | --- |
| Outer function `log_call(function)` | Receives the function being decorated |
| Inner `wrapper(*args, **kwargs)` | Runs extra code and calls the original function |
| `return result` | Keeps the original return value |
| `@wraps(function)` | Copies `__name__`, `__doc__`, and other metadata |
| `return wrapper` | The wrapper replaces the original name |

## 1. Extending Behavior Without Editing the Function's Body

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

`add()` contains only its own logic. Logging lives in one reusable place and can be applied to any function with one line.

The wrapper is a closure: it keeps access to `function` after `log_call()` has returned.

**Common uses:** logging, timing, caching, authorization checks, input validation, and retries.

## 2. `@decorator` Applies a Callable to a Function or Class

The `@log_call` line is roughly equivalent to:

```python
add = log_call(add)
```

Python defines the function, passes it to the decorator, and binds the name to whatever the decorator returns. ("Roughly" because with `@`, the undecorated function is never bound to the name first.)

### The Decorator Runs at Definition Time

```python
def register(function):
    print(f"Decorating {function.__name__}")
    return function


@register
def train():
    return "trained"


print("Module loaded")
print(train())
# Decorating train
# Module loaded
# trained
```

The decorator's own body runs once, when the `def` statement executes. The wrapper's body (if there is one) runs on every call.

### Any Callable Works, and It Can Return Anything

A decorator does not have to return a wrapper. It can return the same function, or a completely different object:

```python
def as_constant(function):
    return function()


@as_constant
def default_threshold():
    return 0.5


print(default_threshold)  # 0.5
```

This is legal but surprising; decorators that change what a name refers to should be used carefully.

### Stacking Decorators

Decorators are applied from the bottom up, and the outermost wrapper runs first:

```python
from functools import wraps


def tag(label):
    def decorator(function):
        @wraps(function)
        def wrapper(*args, **kwargs):
            print(f"enter {label}")
            return function(*args, **kwargs)
        return wrapper
    return decorator


@tag("outer")
@tag("inner")
def predict():
    return "cat"


print(predict())
# enter outer
# enter inner
# cat
```

This is equivalent to `predict = tag("outer")(tag("inner")(predict))`.

## 3. Pass Arguments Through and Return the Original Result

- `*args` and `**kwargs` pass all arguments through.
- `return result` keeps the original function's return value.

### Pitfall: Forgetting to Return the Result

```python
def broken_log(function):
    def wrapper(*args, **kwargs):
        print(f"Calling {function.__name__}")
        function(*args, **kwargs)  # result discarded
    return wrapper


@broken_log
def accuracy(correct, total):
    return correct / total


print(accuracy(9, 10))
# Calling accuracy
# None
```

The wrapper returns `None` implicitly, so every caller silently loses the value.

### Pitfall: A Fixed Signature

A wrapper written as `def wrapper(x):` breaks for functions with other parameters, keyword arguments, or defaults. `*args, **kwargs` accepts anything the original function accepts and forwards it unchanged.

```python
from functools import wraps


def log_call(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        print(f"args={args} kwargs={kwargs}")
        return function(*args, **kwargs)
    return wrapper


@log_call
def train(model, epochs=10, *, learning_rate=0.01):
    return f"{model}: {epochs} epochs at lr={learning_rate}"


print(train("cnn", 5, learning_rate=0.1))
# args=('cnn', 5) kwargs={'learning_rate': 0.1}
# cnn: 5 epochs at lr=0.1
```

## 4. Use `functools.wraps` When Writing Function Wrappers

`@wraps` keeps useful metadata (`__name__`, `__doc__`) and adds a `__wrapped__` reference to the original function.

### Without `@wraps`

```python
def log_call(function):
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper


@log_call
def add(first, second):
    """Return the sum of two numbers."""
    return first + second


print(add.__name__)  # wrapper
print(add.__doc__)   # None
```

Tracebacks, logs, `help()`, documentation tools, and test reports would all show `wrapper` instead of `add`.

### With `@wraps`

```python
import inspect
from functools import wraps


def log_call(function):
    @wraps(function)
    def wrapper(*args, **kwargs):
        return function(*args, **kwargs)
    return wrapper


@log_call
def add(first, second):
    """Return the sum of two numbers."""
    return first + second


print(add.__name__)               # add
print(add.__wrapped__(2, 3))      # 5
print(inspect.signature(add))     # (first, second)
```

`inspect.signature()` follows `__wrapped__`, so tools can see the original parameters.

| Attribute | Without `@wraps` | With `@wraps` |
| --- | --- | --- |
| `__name__` | `wrapper` | `add` |
| `__doc__` | `None` | The original docstring |
| `__wrapped__` | Missing | The original function |
| `inspect.signature()` | `(*args, **kwargs)` | `(first, second)` |

## 5. Follow-Up: How Do You Write a Decorator That Takes Arguments?

`@retry(attempts=3)` first calls `retry(attempts=3)`, which must return the real decorator. That gives three levels of nesting: the factory, the decorator, and the wrapper.

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
            raise ConnectionError(f"{function.__name__} failed after {attempts} attempts")
        return wrapper
    return decorator


calls = {"count": 0}


@retry(attempts=3)
def fetch_features():
    calls["count"] += 1
    if calls["count"] < 3:
        raise ConnectionError("feature store unavailable")
    return ["age", "income"]


print(fetch_features())
# Attempt 1 failed
# Attempt 2 failed
# ['age', 'income']
```

| Usage | What Python calls |
| --- | --- |
| `@log_call` | `log_call(function)` |
| `@retry(attempts=3)` | `retry(attempts=3)(function)` |

### Built-In Decorator Example: Caching

```python
from functools import lru_cache


@lru_cache(maxsize=None)
def fibonacci(n):
    return n if n < 2 else fibonacci(n - 1) + fibonacci(n - 2)


print(fibonacci(30))                   # 832040
print(fibonacci.cache_info().misses)   # 31
```

### Caveat: Async Functions and Generators

This wrapper is for ordinary synchronous functions. Async functions and generators may need wrappers written for how they run. For example, wrapping an `async def` function with a plain wrapper means the "Finished" message prints when the coroutine object is created, not when it completes; the wrapper should itself be `async def` and `await` the call.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Decorators extend behavior without editing the body | Logging added by `@log_call` |
| `@decorator` applies a callable at definition time | `add = log_call(add)` |
| The wrapper forwards all arguments | `wrapper(*args, **kwargs)` |
| The wrapper returns the original result | `return result` |
| `functools.wraps` preserves metadata | `add.__name__` stays `add` |
| Stacked decorators apply bottom-up | `@a @b def f` means `a(b(f))` |
| Decorators with arguments need a factory | `@retry(attempts=3)` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is a decorator? | A callable that takes a function or class and returns its replacement |
| What does `@log_call` mean? | Roughly `add = log_call(add)` |
| When does the decorator run? | Once, when the decorated definition executes |
| When does the wrapper run? | On every call to the decorated function |
| Why `*args, **kwargs`? | To accept and forward any arguments |
| What if the wrapper doesn't return? | Callers get `None` |
| What does `@wraps` do? | Copies metadata and sets `__wrapped__` |
| Order of stacked decorators? | Applied bottom-up; the top wrapper runs first |
| How do decorator arguments work? | A factory returns the actual decorator |
| Common uses? | Logging, timing, caching, auth checks, retries |

## 8. Interview-Ready Answer

> A decorator is a callable that takes a function or class and returns the object that replaces it, so `@log_call` above `def add` is roughly `add = log_call(add)`. Typically it defines an inner wrapper that runs extra code before or after calling the original function, which lets me add logging, timing, caching, or retries without editing the function's body. The wrapper should accept `*args` and `**kwargs`, forward them, and return the original result, otherwise callers silently get `None`. I always apply `functools.wraps` so the decorated function keeps its name, docstring, and a `__wrapped__` reference. The decorator itself runs once at definition time, while the wrapper runs on every call. If the decorator needs arguments, like `@retry(attempts=3)`, I add an outer factory that returns the real decorator.

---

# Python Interview Question: Function Decorators vs Class Decorators

**Difficulty:** 🟡 Intermediate

## Question: What Is the Difference Between a Function Decorator and a Class Decorator?

**Answer:** A **function decorator** receives a function and returns its replacement, often a wrapper. A **class decorator** receives a class and returns its replacement, often the same class after modifying or registering it. Both are applied once, when the decorated definition runs. Either kind of decorator can itself be written as a function or as a class.

| Aspect | Function decorator | Class decorator |
|---|---|---|
| Decorated target | Function | Class |
| Typical purpose | Wrap calls, log, cache, validate | Register or modify classes, generate methods |
| Typical return value | A new wrapper function | The same class, modified |
| When it's applied | When the decorated definition runs | When the decorated definition runs |
| Common example | `@functools.lru_cache` | `@dataclass` |

## 1. Decorating a Function vs Decorating a Class

### Function Decorator

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

The decorator receives the function object and returns a wrapper. Every call to `predict()` now goes through `wrapper()`.

### Class Decorator: Register Available Models

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

The decorator receives the class object, records it, and returns the **same** class. Instances behave exactly as if the decorator were not there.

### Class Decorator: Add a Method

A class decorator can also change the class it receives:

```python
def add_describe(cls):
    def describe(self):
        return f"{cls.__name__}({vars(self)})"

    cls.describe = describe
    return cls


@add_describe
class LinearModel:
    def __init__(self, learning_rate):
        self.learning_rate = learning_rate


print(LinearModel(0.01).describe())  # LinearModel({'learning_rate': 0.01})
```

| | Function decorator | Class decorator |
| --- | --- | --- |
| Receives | `predict` (a function) | `SimpleModel` (a class) |
| Equivalent assignment | `predict = announce(predict)` | `SimpleModel = register_model(SimpleModel)` |
| Usually affects | Every call | The class definition itself |

## 2. Either Kind of Decorator Can Be Written as a Function or a Class

"Function decorator" and "class decorator" describe **what is decorated**, not how the decorator is implemented.

**Terminology note:** "class-based decorator" can also mean a decorator *implemented* as a class with `__call__`. That kind of decorator can decorate a function, which is different from decorating a class.

| Implemented as | Decorates a function | Decorates a class |
| --- | --- | --- |
| A function | `announce`, `functools.wraps` | `register_model`, `dataclasses.dataclass` |
| A class | `CountCalls` below | A class whose `__init__` or `__call__` takes a class (rare) |

### A Decorator Implemented as a Class, Applied to a Function

```python
from functools import update_wrapper


class CountCalls:
    def __init__(self, function):
        update_wrapper(self, function)
        self.function = function
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.function(*args, **kwargs)


@CountCalls
def predict(features):
    return "cat"


predict([0.2, 0.4])
predict([0.1, 0.9])

print(predict.calls)            # 2
print(predict.__name__)         # predict
print(type(predict).__name__)   # CountCalls
```

`@CountCalls` creates a `CountCalls` instance. Calling `predict(...)` calls that instance's `__call__`. The class form is convenient when the decorator needs visible state, such as `calls`. `update_wrapper` does the same job as `@wraps` for an object.

### Pitfall: Class-Implemented Decorators on Methods

A plain function becomes a bound method when accessed through an instance. An instance of `CountCalls` does not, because it does not implement the descriptor method `__get__`. So `self` is never passed:

```python
from functools import update_wrapper


class CountCalls:
    def __init__(self, function):
        update_wrapper(self, function)
        self.function = function
        self.calls = 0

    def __call__(self, *args, **kwargs):
        self.calls += 1
        return self.function(*args, **kwargs)


class Model:
    @CountCalls
    def predict(self):
        return "cat"


try:
    Model().predict()
except TypeError as error:
    print(error)
# Model.predict() missing 1 required positional argument: 'self'
```

The exact message wording varies by Python version (this is 3.12). A function-based wrapper doesn't have this problem, because the wrapper is itself a function and binds normally. A class-based decorator for methods needs a `__get__` method.

## 3. When Decoration Happens

Both kinds are applied when the decorated `def` or `class` statement executes, which for module-level code means at import time.

`register_model()` runs once, when the class definition is executed, not every time an instance is created.

```python
def register_model(cls):
    print(f"Registering {cls.__name__}")
    return cls


print("Before class definition")


@register_model
class TreeModel:
    def __init__(self):
        print("Creating instance")


TreeModel()
TreeModel()
# Before class definition
# Registering TreeModel
# Creating instance
# Creating instance
```

| Event | Class decorator body runs? | Function wrapper body runs? |
| --- | --- | --- |
| Definition executes | Yes, once | No (only the outer decorator runs) |
| Instance created | No | Not applicable |
| Decorated function called | Not applicable | Yes, every call |

This is why registries work: importing the module that defines the classes fills the registry. A class defined in a module that is never imported is never registered.

## 4. Practical Examples

### Function Decorators

| Decorator | Purpose |
| --- | --- |
| `functools.lru_cache` / `functools.cache` | Cache results of a pure function |
| Custom `@log_call` | Log each call |
| Custom `@retry(attempts=3)` | Retry a flaky call |
| `@staticmethod`, `@classmethod`, `@property` | Change how a function behaves inside a class |

### Class Decorators

| Decorator | Purpose |
| --- | --- |
| `dataclasses.dataclass` | Generate `__init__`, `__repr__`, `__eq__` |
| `functools.total_ordering` | Fill in comparison methods from `__eq__` and one ordering method |
| Custom `@register_model` | Add a class to a registry |

### `@dataclass` Generates Methods

```python
from dataclasses import dataclass


@dataclass
class TrainingConfig:
    model: str
    epochs: int = 10


config = TrainingConfig("cnn")
print(config)                                # TrainingConfig(model='cnn', epochs=10)
print(config == TrainingConfig("cnn", 10))   # True
```

`@dataclass` inspects the class annotations when the class is defined and adds the generated methods to the class. It returns the same class object (unless `slots=True`, available from Python 3.10, is used; then it returns a new class).

## 5. Follow-Up: Class Decorator vs Inheritance or a Metaclass?

| Approach | Affects subclasses automatically? | Typical use |
| --- | --- | --- |
| Class decorator | No; each class must be decorated | Explicit, one-off modification or registration |
| Base class with `__init_subclass__` | Yes | Registering every subclass of a base |
| Metaclass | Yes | Deep control over class creation; rarely needed |

```python
model_registry = {}


class BaseModel:
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        model_registry[cls.__name__] = cls


class Forest(BaseModel):
    pass


class Boosting(BaseModel):
    pass


print(list(model_registry))  # ['Forest', 'Boosting']
```

A class decorator is usually the simplest and most explicit choice. Prefer `__init_subclass__` when every subclass should be handled without anyone remembering to add the decorator.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| A function decorator receives a function | `@announce` returns a wrapper |
| A class decorator receives a class | `@register_model` records and returns the class |
| The terms describe the target, not the implementation | A class with `__call__` can decorate a function |
| Decoration happens once at definition time | Registration runs at import, not per instance |
| Function wrappers run on every call | `"Running function"` prints for each call |
| Practical examples | Logging, caching, registration, `@dataclass` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does a function decorator receive? | A function |
| What does a class decorator receive? | A class |
| What does a class decorator usually return? | The same class, modified or registered |
| When is either applied? | When the decorated definition executes |
| Does a class decorator run per instance? | No; once per class definition |
| Can a decorator be implemented as a class? | Yes, using `__init__` and `__call__` |
| Why can a class-based decorator break methods? | Without `__get__`, `self` is not passed |
| Built-in class decorator examples? | `@dataclass`, `@functools.total_ordering` |
| Built-in function decorator examples? | `@lru_cache`, `@property`, `@staticmethod` |
| Alternative for registering all subclasses? | `__init_subclass__` |

## 8. Interview-Ready Answer

> The difference is the target. A function decorator receives a function and usually returns a wrapper that adds behavior to every call, such as logging, caching, or validation. A class decorator receives a class and usually returns the same class after modifying or registering it, as `@dataclass` does when it generates `__init__` and `__repr__`. Both are applied once, when the `def` or `class` statement runs, so a registration decorator runs at import time, not each time an instance is created. Either kind can itself be implemented as a function or as a class with `__call__`, so a "class-based decorator" might still decorate a function. One pitfall is that a class-based decorator used on methods needs `__get__`, otherwise `self` isn't passed.

---

# Python Interview Question: Iterables vs Iterators

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between an Iterable and an Iterator?

**Answer:** An **iterable** is any object Python can get an iterator from with `iter()`, such as a list, tuple, string, or generator. An **iterator** produces the next value each time you call `next()` on it. It implements `__next__()`, and its `__iter__()` returns itself. When it runs out of values, it raises `StopIteration`.

| Feature | Iterable | Iterator |
|---|---|---|
| Main purpose | Provide iteration | Produce values and track progress |
| Required method | `__iter__()` (or the older `__getitem__` protocol) | `__next__()` and `__iter__()` |
| `iter(obj)` | Returns an iterator | Returns the same iterator |
| `next(obj)` | Not necessarily supported | Supported |
| Repeated traversal | Depends on the object | Continues from the current position |
| Example | A list | A list iterator |

## 1. The Object You Iterate Over vs the Object That Tracks Progress

A list holds data. It does not remember how far a loop has gone. That position lives in a separate **iterator** object.

```python
numbers = [10, 20, 30]
iterator = iter(numbers)

print(type(numbers).__name__)   # list
print(type(iterator).__name__)  # list_iterator
```

### Several Independent Iterators over One List

Because the position is stored in the iterator, you can have several at once over the same list:

```python
features = ["age", "income", "experience"]

first = iter(features)
second = iter(features)

print(next(first))   # age
print(next(first))   # income
print(next(second))  # age
```

`first` and `second` track their own positions. This is why nested loops over the same list work:

```python
labels = ["cat", "dog"]
pairs = [(a, b) for a in labels for b in labels]
print(pairs)
# [('cat', 'cat'), ('cat', 'dog'), ('dog', 'cat'), ('dog', 'dog')]
```

| Object | Holds the data? | Knows the current position? |
| --- | --- | --- |
| `[10, 20, 30]` | Yes | No |
| `iter([10, 20, 30])` | No (refers to the list) | Yes |

## 2. `iter()`, `next()`, and `StopIteration`

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

| Call | Calls method | Result |
| --- | --- | --- |
| `iter(obj)` | `obj.__iter__()` | An iterator |
| `next(it)` | `it.__next__()` | The next value, or raises `StopIteration` |
| `next(it, default)` | `it.__next__()` | The next value, or `default` when exhausted |

### Using a Default Instead of Catching `StopIteration`

```python
scores = iter([0.91])

print(next(scores, None))  # 0.91
print(next(scores, None))  # None
```

### What a `for` Loop Does

A `for` loop gets an iterator, keeps asking it for values, and stops when `StopIteration` signals that it's exhausted. This loop:

```python
for score in [0.85, 0.93]:
    print(score)
# 0.85
# 0.93
```

behaves like this:

```python
iterator = iter([0.85, 0.93])
while True:
    try:
        score = next(iterator)
    except StopIteration:
        break
    print(score)
# 0.85
# 0.93
```

The same protocol is used by `list()`, `sum()`, `zip()`, `enumerate()`, unpacking, `in`, and comprehensions.

### A Non-Iterable Object

```python
try:
    iter(42)
except TypeError as error:
    print(error)  # 'int' object is not iterable
```

## 3. Iterators Are Themselves Iterable

An iterator's `__iter__()` returns itself. That is why you can pass an iterator anywhere an iterable is expected, including a `for` loop.

```python
iterator = iter(["age", "income", "experience"])
next(iterator)  # skip the first item

for feature in iterator:
    print(feature)
# income
# experience
```

The loop calls `iter(iterator)`, gets the same object back, and continues from its current position.

### Checking with `collections.abc`

```python
from collections.abc import Iterable, Iterator

numbers = [10, 20, 30]
iterator = iter(numbers)

print(isinstance(numbers, Iterable))   # True
print(isinstance(numbers, Iterator))   # False
print(isinstance(iterator, Iterable))  # True
print(isinstance(iterator, Iterator))  # True
```

`isinstance(obj, Iterable)` checks for `__iter__`. It does not detect objects that are iterable only through the older `__getitem__` protocol, so the most reliable test is to call `iter(obj)` and catch `TypeError`.

| Object | Iterable? | Iterator? |
| --- | --- | --- |
| `list`, `tuple`, `str`, `dict`, `set` | Yes | No |
| `range(5)` | Yes | No |
| `iter([1, 2])` | Yes | Yes |
| Generator object | Yes | Yes |
| `map(...)`, `filter(...)`, `zip(...)`, `enumerate(...)` | Yes | Yes |
| Open file object | Yes | Yes |

## 4. Containers Restart; Exhausted Iterators Stay Exhausted

Each `iter()` call on a container like a list creates a fresh iterator starting at the beginning, so you can loop over a list any number of times. An iterator only moves forward. Once exhausted, it stays exhausted.

**Important:** not every iterable can be restarted. A generator is both an iterable and an iterator, so looping over it uses up its values.

```python
squares = (number ** 2 for number in range(4))

print(sum(squares))   # 14
print(sum(squares))   # 0
```

The second `sum()` gets nothing, without any error.

### Pitfall: `map()` and `zip()` Are One-Shot Iterators

```python
scaled = map(lambda value: value / 100, [50, 75, 90])

print(max(scaled))   # 0.9
print(list(scaled))  # []
```

`max()` consumed every value. Convert to a list first if you need the results more than once.

### Pitfall: Checking Membership Consumes Values

```python
labels = iter(["cat", "dog", "bird"])

print("dog" in labels)  # True
print(list(labels))     # ['bird']
```

`in` advances the iterator until it finds a match.

### Pitfall: A Function That Iterates Twice

```python
def normalize(values):
    total = sum(values)
    return [value / total for value in values]


print(normalize([1, 3]))                  # [0.25, 0.75]
print(normalize(value for value in [1, 3]))  # []
```

`sum()` exhausts the generator, so the comprehension sees nothing. Functions that need two passes should accept a list, or call `list(values)` first.

| Iterable | Can be traversed again? |
| --- | --- |
| `list`, `tuple`, `dict`, `range` | Yes; each `iter()` starts over |
| Generator, `map`, `zip`, file object | No; values are consumed |

## 5. Follow-Up: How Do You Write a Custom Iterable?

The clean design separates the two roles: the iterable's `__iter__()` returns a **new** iterator each time. Writing `__iter__` as a generator function is the simplest way to do that.

```python
class Dataset:
    def __init__(self, samples):
        self.samples = samples

    def __iter__(self):
        for sample in self.samples:
            yield sample


data = Dataset(["img_1", "img_2"])

print(list(data))  # ['img_1', 'img_2']
print(list(data))  # ['img_1', 'img_2']
```

Each `list(data)` calls `__iter__()` again and gets a fresh generator, so the dataset can be traversed repeatedly.

### An Explicit Iterator Class

```python
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


countdown = Countdown(3)
print(list(countdown))  # [3, 2, 1]
print(list(countdown))  # []
```

`Countdown` is its own iterator, so it is single-use, just like a generator.

| Design | `__iter__` returns | Reusable? |
| --- | --- | --- |
| Iterable container (`Dataset`) | A new iterator | Yes |
| Iterator (`Countdown`) | `self` | No |

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Iterable and iterator are different roles | A list vs a `list_iterator` |
| `iter()` gets an iterator from an iterable | `iterator = iter(numbers)` |
| `next()` produces the next value | `next(iterator)` returns `10` |
| `StopIteration` signals the end | `for` loops stop on it |
| Iterators are iterable | `iter(iterator) is iterator` is `True` |
| Containers can be iterated again | `list(numbers)` still works |
| Exhausted iterators stay exhausted | `list(iterator)` gives `[]` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is an iterable? | An object `iter()` can get an iterator from |
| What is an iterator? | An object with `__next__()` whose `__iter__()` returns itself |
| What signals the end? | `StopIteration` |
| Is a list an iterator? | No; it is an iterable |
| Is a generator an iterator? | Yes, and also an iterable |
| What does `iter(iterator)` return? | The same iterator |
| Can you loop over a list twice? | Yes; each loop gets a new iterator |
| Can you loop over a generator twice? | No; the second loop gets nothing |
| How do you avoid catching `StopIteration`? | `next(iterator, default)` |
| How should a reusable custom iterable work? | `__iter__()` returns a new iterator, for example a generator |

## 8. Interview-Ready Answer

> An iterable is anything I can get an iterator from with `iter()`, such as a list, string, dict, or range. An iterator is the object that actually produces values and remembers the position: `next()` returns the next value, and it raises `StopIteration` when it's finished. Iterators are iterable too, because their `__iter__()` returns themselves, which is why a `for` loop accepts both. A `for` loop just calls `iter()` once and then `next()` until `StopIteration`. The practical difference is reuse: a list gives a fresh iterator each time, but a generator, `map`, `zip`, or file object is consumed, so a second pass silently gets nothing. When I write a reusable iterable class, I make `__iter__()` return a new iterator, usually by writing it as a generator.

---

# Python Interview Question: Generators and `yield`

**Difficulty:** 🟡 Intermediate

## Question: What Is a Generator, and How Does `yield` Work?

**Answer:** A **generator function** is a function with `yield` in its body. Calling it doesn't run the body. Instead it returns a generator object, which is an iterator. When a value is requested, the body runs until it reaches a `yield`. The generator hands out that value and pauses, keeping its local variables and its position. The next request resumes right after that `yield`.

| Term | Meaning |
| --- | --- |
| Generator function | A `def` whose body contains `yield` |
| Generator object | The iterator returned by calling a generator function |
| `yield value` | Produce `value` and pause |
| Generator expression | `(expr for item in iterable)`, a compact generator |
| Exhaustion | The body finishes, and `StopIteration` is raised |

## 1. Generators Are Iterators That Produce Values Lazily

A generator computes each value only when it is asked for one. It does not build the whole result list up front.

```python
from collections.abc import Iterator


def generate_ids(count):
    for number in range(count):
        yield f"sample_{number}"


ids = generate_ids(3)

print(type(ids).__name__)          # generator
print(isinstance(ids, Iterator))   # True
print(iter(ids) is ids)            # True
print(list(ids))                   # ['sample_0', 'sample_1', 'sample_2']
```

Because a generator is an iterator, it works with `for`, `next()`, `list()`, `sum()`, `zip()`, and anything else that consumes iterables.

### Lazy Evaluation Makes Infinite Sequences Possible

```python
from itertools import islice


def learning_rates(start, decay):
    rate = start
    while True:
        yield rate
        rate *= decay


print(list(islice(learning_rates(0.1, 0.5), 4)))
# [0.1, 0.05, 0.025, 0.0125]
```

The `while True` loop never finishes, but that is fine: the generator only runs as far as the consumer asks.

A generator produces values on demand instead of building the whole result list up front. It can still hold a lot of memory if its local variables or inputs refer to large objects.

## 2. Calling a Generator Function Does Not Run Its Body

The presence of `yield` anywhere in a function changes what calling it does. The call creates a generator object and returns immediately.

```python
import inspect


def generate_scores():
    print("Starting")
    yield 0.85


scores = generate_scores()
print(inspect.getgeneratorstate(scores))  # GEN_CREATED

print(next(scores))
# Starting
# 0.85
print(inspect.getgeneratorstate(scores))  # GEN_SUSPENDED
```

"Starting" is printed only when the first value is requested.

### Pitfall: Validation Is Delayed Too

```python
def batches(items, size):
    if size <= 0:
        raise ValueError("size must be positive")
    for start in range(0, len(items), size):
        yield items[start:start + size]


generator = batches([1, 2, 3], 0)  # no error yet
print("Generator created")

try:
    next(generator)
except ValueError as error:
    print(error)
# Generator created
# size must be positive
```

The error appears far from the bad call. To validate immediately, check arguments in a normal function and return an inner generator:

```python
def batches(items, size):
    if size <= 0:
        raise ValueError("size must be positive")

    def generate():
        for start in range(0, len(items), size):
            yield items[start:start + size]

    return generate()


try:
    batches([1, 2, 3], 0)
except ValueError as error:
    print(error)  # size must be positive
```

## 3. Execution Pauses and Resumes at `yield`

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

| Step | What runs | Result |
| --- | --- | --- |
| `generate_scores()` | Nothing in the body | A generator object |
| 1st `next()` | `print("Starting")`, then `yield 0.85` | `0.85`; paused |
| 2nd `next()` | `print("Resuming")`, then `yield 0.93` | `0.93`; paused |
| 3rd `next()` | `print("Finished")`, then the body ends | `StopIteration` |

A normal function's frame is discarded when it returns. A generator's frame is kept alive between `next()` calls, which is what lets it resume.

## 4. Local State Is Kept Between Values, and Exhaustion Is Final

### State Survives Each Pause

```python
def running_mean(values):
    total = 0
    for count, value in enumerate(values, start=1):
        total += value
        yield total / count


print(list(running_mean([0.8, 0.9, 1.0])))
# [0.8, 0.8500000000000001, 0.9]
```

`total` and `count` keep their values between yields, so the generator remembers its progress without a class or global variables.

The middle value shows normal floating-point rounding. Round for display:

```python
def running_mean(values):
    total = 0
    for count, value in enumerate(values, start=1):
        total += value
        yield total / count


print([round(mean, 2) for mean in running_mean([0.8, 0.9, 1.0])])
# [0.8, 0.85, 0.9]
```

### A Generator Cannot Be Restarted

```python
def generate_scores():
    yield 0.85
    yield 0.93


scores = generate_scores()
print(list(scores))  # [0.85, 0.93]
print(list(scores))  # []

print(list(generate_scores()))  # [0.85, 0.93]
```

To iterate again, call the generator function again to get a new generator.

### `return` Inside a Generator

A `return` statement ends the generator. A returned value is attached to the `StopIteration` exception; a `for` loop ignores it.

```python
def train_steps():
    yield "step 1"
    yield "step 2"
    return "done"


steps = train_steps()
print(next(steps))  # step 1
print(next(steps))  # step 2

try:
    next(steps)
except StopIteration as stop:
    print(stop.value)  # done
```

| State | Meaning |
| --- | --- |
| `GEN_CREATED` | Created; body not started |
| `GEN_RUNNING` | Currently executing |
| `GEN_SUSPENDED` | Paused at a `yield` |
| `GEN_CLOSED` | Finished or closed; only raises `StopIteration` |

## 5. Generator Expressions

A generator expression is a short way to create a generator. It looks like a list comprehension with parentheses.

```python
squares = (number ** 2 for number in range(4))
print(next(squares))  # 0
print(list(squares))  # [1, 4, 9]
```

When a generator expression is the only argument to a function, the extra parentheses can be dropped:

```python
losses = [0.9, 0.6, 0.4]
print(sum(loss ** 2 for loss in losses))  # 1.33
```

| Expression | Result type | Values computed |
| --- | --- | --- |
| `[x * 2 for x in data]` | `list` | All, immediately |
| `(x * 2 for x in data)` | `generator` | One at a time, on demand |

The leftmost iterable of a generator expression is evaluated immediately; the rest is evaluated lazily.

## 6. Follow-Up: `yield from`, `send()`, and `close()`

### Delegating with `yield from`

`yield from iterable` yields every value from another iterable, which is useful for combining generators:

```python
def train_files():
    yield "train_1.csv"
    yield "train_2.csv"


def all_files():
    yield from train_files()
    yield "validation.csv"


print(list(all_files()))
# ['train_1.csv', 'train_2.csv', 'validation.csv']
```

### Sending Values In and Closing Early

`yield` is also an expression. `generator.send(value)` resumes the generator and makes the paused `yield` evaluate to `value`. `close()` stops a generator early, raising `GeneratorExit` inside it so `finally` blocks run.

```python
def averager():
    total, count = 0, 0
    average = None
    try:
        while True:
            value = yield average
            total += value
            count += 1
            average = total / count
    finally:
        print("Cleaning up")


tracker = averager()
next(tracker)            # advance to the first yield
print(tracker.send(10))  # 10.0
print(tracker.send(20))  # 15.0
tracker.close()          # Cleaning up
```

Most everyday code only needs `yield` and iteration; `send()` is rare outside coroutine-style code.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Generators produce values lazily | Values computed one `next()` at a time |
| Generators are iterators | `iter(gen) is gen` is `True` |
| Calling the function does not run the body | `GEN_CREATED` before the first `next()` |
| `yield` pauses and `next()` resumes | "Starting", then "Resuming" |
| Local state is kept between values | `total` in `running_mean()` |
| Exhaustion raises `StopIteration` | The third `next()` in the example |
| An exhausted generator stays exhausted | The second `list()` gives `[]` |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What makes a function a generator function? | `yield` in its body |
| What does calling it return? | A generator object (an iterator) |
| When does the body start running? | On the first `next()` |
| What does `yield` do? | Produces a value and pauses the function |
| What happens on the next `next()`? | Execution resumes right after the `yield` |
| Are local variables kept? | Yes, between yields |
| What happens when the body ends? | `StopIteration` is raised |
| Can a generator be restarted? | No; call the function again |
| What is a generator expression? | `(expr for x in iterable)` |
| What does `yield from` do? | Yields every value from another iterable |

## 9. Interview-Ready Answer

> A generator function is any function that contains `yield`. Calling it doesn't execute the body; it returns a generator object, which is an iterator. Each `next()` runs the body until the next `yield`, hands out that value, and pauses with all its local variables and its position preserved, so the following `next()` resumes right after that `yield`. When the body finishes, the generator raises `StopIteration`, and from then on it stays exhausted. That makes generators a lazy way to produce sequences, including infinite ones, without building a full list. One thing I watch for is that argument validation inside a generator is also delayed until the first `next()`. Generator expressions such as `(x ** 2 for x in data)` give the same behavior in a compact form.

---

# Python Interview Question: Generators vs Lists

**Difficulty:** 🟡 Intermediate

## Question: When Would You Use a Generator Instead of a List?

**Answer:** Use a generator when you want to process values one at a time without storing every result, for example when reading large files, processing streams, or building pipelines. Use a list when you need indexing, sorting, repeated traversal, or all the results at once. Generators can cut memory use and unnecessary work, but they aren't automatically faster for every workload.

| Requirement | Usually suitable |
|---|---|
| Process a large input once | Generator |
| Work with an unbounded stream | Generator |
| Stop early after finding a result | Generator |
| Chain several processing steps | Generator |
| Access the fifth result directly | List |
| Know the number of results with `len()` | List |
| Sort all the results | List (or another materialized collection) |
| Reuse the results several times | List |

## 1. Generators Suit Streaming, Large Inputs, and Single-Pass Processing

### Produce Batches Without Building a List of All Batches

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

Because the input is consumed through `iter()`, this works with any iterable: a list, a `range`, a file, or another generator. (As covered for generators in general, the `ValueError` is raised on the first `next()`, not when `batches()` is called.)

### Read a Large File Line by Line

A file object is already a lazy iterator over lines. A generator can filter and parse it without loading the whole file. Here `io.StringIO` stands in for an opened file:

```python
import io


def read_labels(file):
    for line in file:
        line = line.strip()
        if line and not line.startswith("#"):
            yield line.split(",")[1]


fake_file = io.StringIO("# id,label\n1,cat\n2,dog\n\n3,cat\n")
print(list(read_labels(fake_file)))  # ['cat', 'dog', 'cat']
```

With a real file, `for line in open(path)` reads in buffered chunks, so a multi-gigabyte log can be processed with roughly constant memory. Calling `file.readlines()` instead would load every line into a list.

### Unbounded Streams

A list cannot represent an infinite sequence. A generator can, as long as the consumer stops:

```python
from itertools import count, islice

step_names = (f"step_{number}" for number in count(1))
print(list(islice(step_names, 3)))  # ['step_1', 'step_2', 'step_3']
```

## 2. Smaller Intermediate Storage and Delayed Computation

### Storage: A Generator Does Not Hold Its Results

```python
import sys

squares_list = [number ** 2 for number in range(1_000_000)]
squares_gen = (number ** 2 for number in range(1_000_000))

print(sys.getsizeof(squares_list) > 8_000_000)  # True
print(sys.getsizeof(squares_gen) < 1_000)       # True
print(sum(squares_gen) == sum(squares_list))    # True
```

The list stores a reference to every result (about 8 bytes each on a 64-bit CPython build), plus the integer objects themselves. The generator object stays small regardless of how many values it will produce. `sys.getsizeof()` reports only the object's own size, not the objects it refers to, and the exact numbers are CPython-specific.

### Delayed Computation: Stop Early and Skip Work

A generator computes values only as they are requested. If the consumer stops early, the remaining values are never computed.

```python
calls = {"count": 0}


def expensive_check(value):
    calls["count"] += 1
    return value > 2


values = [1, 2, 3, 4, 5, 6]

print(any(expensive_check(value) for value in values))  # True
print(calls["count"])                                   # 3

calls["count"] = 0
print(any([expensive_check(value) for value in values]))  # True
print(calls["count"])                                     # 6
```

`any()` stops at the first `True`. With a generator expression, only three checks run. With a list comprehension, all six run before `any()` even starts.

| Consumer | Stops early? |
| --- | --- |
| `any()`, `all()` | Yes, on the first deciding value |
| `next()` | Yes, after one value |
| `itertools.islice()`, `itertools.takewhile()` | Yes |
| A `for` loop with `break` | Yes |
| `sum()`, `list()`, `sorted()`, `max()` | No; they consume everything |

## 3. Building Pipelines

Chained generators pass one item at a time through every stage. No stage builds an intermediate list.

```python
def parse(lines):
    for line in lines:
        yield float(line)


def drop_outliers(values, limit):
    for value in values:
        if abs(value) <= limit:
            yield value


def scale(values, factor):
    for value in values:
        yield value * factor


raw = ["0.5", "120.0", "1.5", "-2.0"]
pipeline = scale(drop_outliers(parse(raw), limit=10), factor=2)
print(list(pipeline))  # [1.0, 3.0, -4.0]
```

Nothing runs until `list(pipeline)` asks for values. Then each item flows through `parse`, `drop_outliers`, and `scale` before the next item is read.

The same pipeline with generator expressions:

```python
raw = ["0.5", "120.0", "1.5", "-2.0"]

parsed = (float(line) for line in raw)
kept = (value for value in parsed if abs(value) <= 10)
scaled = (value * 2 for value in kept)

print(list(scaled))  # [1.0, 3.0, -4.0]
```

## 4. When a List Is the Better Fit

A generator only supports moving forward, one value at a time. Anything that needs random access, a length, or several passes calls for a list.

```python
scores = (score for score in [0.85, 0.93, 0.78])

try:
    scores[0]
except TypeError as error:
    print(error)  # 'generator' object is not subscriptable

try:
    len(scores)
except TypeError as error:
    print(error)  # object of type 'generator' has no len()
```

### Multiple Passes Need a List

Computing a mean and then a variance requires going over the data twice:

```python
def variance(values):
    values = list(values)  # materialize once, then reuse
    mean = sum(values) / len(values)
    return sum((value - mean) ** 2 for value in values) / len(values)


print(variance(score for score in [2, 4, 4, 4, 5, 5, 7, 9]))  # 4.0
```

Without `list(values)`, the first `sum()` would exhaust the generator and `len()` would fail.

### Sorting Needs All Values

```python
accuracies = (accuracy for accuracy in [0.85, 0.93, 0.78])
print(sorted(accuracies))  # [0.78, 0.85, 0.93]
```

`sorted()` accepts a generator, but it builds a full list internally. The memory saving disappears at that point.

| Need | Generator | List |
| --- | --- | --- |
| `items[4]` | No | Yes |
| `len(items)` | No | Yes |
| Iterate several times | No | Yes |
| Sort, reverse, shuffle in place | No | Yes |
| Inspect results in a debugger | Hard; inspecting consumes | Easy |
| Constant memory over a huge input | Yes | No |

## 5. Follow-Up: Common Mistakes and Performance Claims

### Converting to a List Materializes Everything

Converting a generator to a list materializes all of its remaining values:

```python
squares = (number ** 2 for number in range(5))
all_squares = list(squares)
print(all_squares)  # [0, 1, 4, 9, 16]
```

Writing a careful generator and then calling `list()` on it immediately gives up the memory benefit.

### Reusing a Generator by Mistake

```python
valid = (sample for sample in ["img_1", "img_2", "img_3"])

print(len(list(valid)))  # 3
print(list(valid))       # []
```

The first pass consumed every value, so the second pass silently gets nothing.

### Generators Are Not Always Faster

Generators cut memory use and avoid unnecessary work, but they aren't automatically faster for every workload. Each value involves resuming the generator's frame, which has a per-item cost. For small or medium data that fits comfortably in memory and is consumed fully, a list comprehension is often as fast or slightly faster in CPython. Measure with `timeit` on real data rather than assuming.

| Claim | Accurate? |
| --- | --- |
| "Generators use less memory for intermediate results" | Yes |
| "Generators avoid work when you stop early" | Yes |
| "Generators always make code faster" | No |
| "A generator removes the input list from memory" | No |

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Generators suit streaming and large inputs | Reading a file line by line, `batches()` |
| Generators suit single-pass processing | A pipeline consumed once |
| Smaller intermediate storage | Only the current batch is held |
| Delayed computation | `any()` stops after three checks |
| A list is better for indexing, sorting, reuse | `scores[0]`, `sorted()`, two passes for variance |
| Materializing removes the benefit | `list(generator)` |
| Generators are not always faster | Per-item overhead; measure first |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| When to use a generator? | Large, streaming, or single-pass data; pipelines; early stopping |
| When to use a list? | Indexing, `len()`, sorting, or several passes |
| What does a generator store? | Its current state, not all results |
| Does a generator reduce input memory? | No; an existing input list stays in memory |
| Does `any()` with a generator stop early? | Yes, at the first true value |
| Can you index a generator? | No; `TypeError` |
| Can you call `len()` on a generator? | No; `TypeError` |
| What does `list(generator)` do? | Materializes all remaining values |
| Is a generator always faster? | No; it mainly saves memory and skipped work |
| How do you read a huge file lazily? | Iterate over the file object, not `readlines()` |

## 8. Interview-Ready Answer

> I use a generator when data can be processed one item at a time: reading a large file line by line, streaming records, producing training batches, or chaining preprocessing steps into a pipeline. The generator holds only its current state, so intermediate results don't pile up in memory, and because values are computed on demand, consumers like `any()` or a loop with `break` can stop early and skip the rest of the work. I use a list when I need indexing, `len()`, sorting, or more than one pass over the data, because a generator can only be consumed once. I also keep in mind that calling `list()` on a generator materializes everything, and that a generator doesn't shrink an input list that already exists. Generators save memory and unnecessary computation, but they aren't automatically faster, so for small data a list comprehension is often just as good.

---

# Python Interview Question: `return` vs `yield`

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between `return` and `yield`?

**Answer:** `return` ends the current function call and gives its result to the caller. `yield` hands out a value from a generator and pauses it so it can resume later. Any function whose body contains `yield` is a generator function: calling it does not run the body but returns a generator object that produces values on demand.

| Feature | `return` | `yield` |
| --- | --- | --- |
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

The ordinary function returns a list immediately. The generator function returns an iterator that produces the scores as they are requested.

## 1. Ending a Function vs Pausing a Generator

### `return` Ends the Call

When `return` runs, the function call is finished. Its local variables are discarded, and any code after the `return` is never reached in that call.

```python
def first_score():
    return 0.85
    return 0.93  # Never reached


print(first_score())  # 0.85
print(first_score())  # 0.85
```

Each call starts again from the top. The second `return` is dead code.

### `yield` Pauses and Resumes

A generator runs only when a value is requested with `next()` or by a loop. It stops at each `yield`, hands out the value, and remembers exactly where it stopped.

```python
def generate_scores():
    print("Starting")
    yield 0.85
    print("Resuming")
    yield 0.93
    print("Finishing")


generator = generate_scores()
print("Generator created")

print(next(generator))
print(next(generator))

try:
    next(generator)
except StopIteration:
    print("Exhausted")
# Generator created
# Starting
# 0.85
# Resuming
# 0.93
# Finishing
# Exhausted
```

Notice that `"Starting"` is printed only after the first `next()`, not when the generator is created. When the body runs off the end, the generator raises `StopIteration`.

### Local State Is Kept Between Resumptions

Because the generator's frame is suspended rather than discarded, local variables survive between values.

```python
def running_mean(losses):
    total = 0
    for count, loss in enumerate(losses, start=1):
        total += loss
        yield total / count


print(list(running_mean([2, 4, 6])))  # [2.0, 3.0, 4.0]
```

`total` and `count` keep their values each time the generator resumes. An ordinary function would need to build and return the whole list at once.

| Situation | `return` | `yield` |
| --- | --- | --- |
| Code after the statement | Not run in this call | Runs on the next resumption |
| Local variables | Discarded | Preserved |
| Memory use for many results | Whole result built in memory | One value produced at a time |

## 2. What Calling Each Function Returns

Calling an ordinary function runs its body and gives you whatever it returns (or `None` if it has no `return`). Calling a generator function runs none of the body; it returns a generator object.

```python
import inspect


def get_scores():
    return [0.85, 0.93]


def generate_scores():
    yield 0.85
    yield 0.93


print(type(get_scores()).__name__)       # list
print(type(generate_scores()).__name__)  # generator

print(inspect.isgeneratorfunction(get_scores))       # False
print(inspect.isgeneratorfunction(generate_scores))  # True
```

A generator object is an iterator: it supports `next()` and can be used in a `for` loop, `list()`, `sum()`, and similar consumers.

### A Generator Is Single-Use

Once a generator is exhausted, it stays exhausted. A list can be iterated any number of times.

```python
def generate_scores():
    yield 0.85
    yield 0.93


scores = generate_scores()

print(list(scores))  # [0.85, 0.93]
print(list(scores))  # []
```

If you need to iterate again, call the generator function again to get a fresh generator, or store the values in a list.

## 3. What `return` Does Inside a Generator

Inside a generator, `return` ends the iteration. If it has a value, that value is attached to the `StopIteration` exception as `.value`.

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

A normal `for` loop does not give you this final return value as another item. It silently stops when `StopIteration` is raised.

```python
def sample():
    yield 10
    return "complete"


print(list(sample()))  # [10]
```

### Retrieving the Return Value With `yield from`

The return value is mainly useful when one generator delegates to another. The value of a `yield from` expression is the inner generator's return value.

```python
def load_batches():
    yield "batch-1"
    yield "batch-2"
    return 2


def pipeline():
    count = yield from load_batches()
    yield f"loaded {count} batches"


print(list(pipeline()))  # ['batch-1', 'batch-2', 'loaded 2 batches']
```

### Do Not Raise `StopIteration` Yourself

Since Python 3.7 (PEP 479), a `StopIteration` raised inside a generator body is converted into a `RuntimeError`. Use `return` to end a generator instead.

```python
def broken():
    yield 1
    raise StopIteration


try:
    list(broken())
except RuntimeError as error:
    print(error)  # generator raised StopIteration
```

## 4. Yielding One List vs Yielding Each Element

`yield` hands out exactly one object, even if that object is a list. `yield from` hands the iteration over to another iterable, so each of its elements is produced separately.

```python
def one_item():
    yield [1, 2]


def individual_items():
    yield from [1, 2]


print(list(one_item()))          # [[1, 2]]
print(list(individual_items()))  # [1, 2]
```

For a simple iterable, `yield from items` behaves like this loop:

```python
def individual_items():
    for item in [1, 2]:
        yield item


print(list(individual_items()))  # [1, 2]
```

`yield from` also forwards values sent with `.send()`, exceptions thrown in with `.throw()`, and closing, and it returns the inner generator's return value. The plain loop does not do those things.

| Statement | Produces |
| --- | --- |
| `yield [1, 2]` | One item: the list `[1, 2]` |
| `yield from [1, 2]` | Two items: `1`, then `2` |
| `yield from other_generator()` | Every item of the inner generator, then its return value as the expression's value |

## 5. Follow-Up: A Single `yield` Changes the Whole Function

Whether a function is a generator is decided when it is compiled, not when it runs. If `yield` appears anywhere in the body, every call returns a generator, even on a path where `yield` never executes.

```python
def get_values(as_list):
    if as_list:
        return [1, 2]
    yield 3


print(list(get_values(False)))  # [3]
print(list(get_values(True)))   # []
```

With `as_list=True`, the `return [1, 2]` ends the generator immediately. The list becomes the `StopIteration` value, so iteration produces nothing. Mixing "return a list" and "yield values" in one function is a common bug; split them into two functions.

A related pitfall: errors inside a generator appear only when it is consumed, not when it is called.

```python
def read_rows(path):
    with open(path, encoding="utf-8") as file:
        yield from file


rows = read_rows("missing.csv")  # No error yet
print("Generator created")       # Generator created

try:
    next(rows)
except FileNotFoundError:
    print("Error raised on first next()")  # Error raised on first next()
```

If you need validation to happen immediately, check arguments in an ordinary wrapper function before returning the generator.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `return` ends a call; `yield` pauses a generator | Code after `yield` runs on the next `next()` |
| Calling a generator function runs none of its body | `generate_scores()` returns a generator object |
| Ordinary functions return their result directly | `get_scores()` returns a list |
| Generators keep local state between values | A running mean keeps `total` |
| `return` inside a generator ends iteration | Its value is in `StopIteration.value` |
| `for` loops ignore the generator's return value | `list(sample())` gives `[10]` |
| `yield` vs `yield from` | `yield [1, 2]` gives one list; `yield from [1, 2]` gives two items |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `return` do? | Ends the call and sends one result to the caller |
| What does `yield` do? | Produces a value and pauses the generator |
| What does calling a generator function return? | A generator object; the body has not started |
| When does the generator body run? | When values are requested with `next()` or iteration |
| Are local variables kept between `yield`s? | Yes |
| What does `return value` do in a generator? | Ends iteration; `value` goes into `StopIteration.value` |
| Does a `for` loop see that return value? | No |
| How do you capture it? | `result = yield from inner()` |
| Can a generator be iterated twice? | No; create a new one or store the values |
| What does `yield from [1, 2]` produce? | `1` and `2` as separate items |

## 8. Interview-Ready Answer

> `return` ends a function call and sends one result back to the caller, discarding the function's local state. `yield` turns the function into a generator function: calling it returns a generator object without running the body, and each `next()` runs until the next `yield`, hands out a value, and pauses with its local state intact. That makes generators useful for producing large or streaming sequences one value at a time. Inside a generator, `return` ends the iteration, and any return value is carried on `StopIteration.value`, which a `for` loop ignores but `yield from` can capture. Finally, `yield some_list` produces the list as one item, while `yield from some_list` produces each element separately.

---

# Python Interview Question: `try`, `except`, `else`, and `finally`

**Difficulty:** 🟢 Beginner

## Question: How Do `try`, `except`, `else`, and `finally` Work?

**Answer:** `try` runs code that may raise an exception, and `except` handles a matching exception raised there. `else` runs only when the `try` block finishes without an exception, and `finally` runs cleanup code as control leaves the statement, whether it leaves normally, through a `return`, or with an exception propagating.

| Clause | Purpose |
| --- | --- |
| `try` | Run code that may raise an exception |
| `except` | Handle a matching exception raised in the `try` block |
| `else` | Run when the `try` block finishes without an exception |
| `finally` | Do cleanup as control leaves the statement |

## 1. The Purpose and Execution Order of Each Clause

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

The order is always `try`, then either a matching `except` or `else`, then `finally`. At most one `except` clause handles a given exception.

### What Happens When No Handler Matches

If the exception does not match any `except` clause, `finally` still runs, and then the exception continues to propagate to the caller.

```python
def divide(first, second):
    try:
        return first / second
    except ZeroDivisionError:
        print("Cannot divide by zero")
    finally:
        print("Division attempt finished")


try:
    divide(10, "2")
except TypeError as error:
    print(f"Caller saw: {type(error).__name__}")
# Division attempt finished
# Caller saw: TypeError
```

| Scenario | Clauses that run |
| --- | --- |
| No exception | `try`, `else`, `finally` |
| Exception matched by an `except` | `try` (up to the error), that `except`, `finally` |
| Exception not matched | `try` (up to the error), `finally`, then the exception propagates |
| `return` inside `try` | `try`, `finally`, then the function returns (`else` is skipped) |

The only valid combinations are `try` with at least one `except` or a `finally`. `else` is allowed only when there is at least one `except` clause.

## 2. Catch Specific Exceptions

Catch only the exceptions you expect and know how to handle. A broad handler can hide unrelated bugs.

### A Broad Handler Hides a Typo

```python
def load_learning_rate(config):
    try:
        return float(confg["lr"])  # Typo: confg
    except Exception:
        return 0.001


print(load_learning_rate({"lr": "0.01"}))  # 0.001
```

The real bug is a `NameError`, but the handler treats it like a missing setting and silently returns the default.

### A Specific Handler Lets Unrelated Bugs Surface

```python
def load_learning_rate(config):
    try:
        return float(config["lr"])
    except KeyError:
        return 0.001


print(load_learning_rate({"lr": "0.01"}))  # 0.01
print(load_learning_rate({}))              # 0.001

try:
    load_learning_rate({"lr": "fast"})
except ValueError as error:
    print(error)  # could not convert string to float: 'fast'
```

A missing key gets the default, but an invalid value is still reported.

### Multiple Handlers and Their Order

Handlers are checked from top to bottom, and the first matching one wins. A handler for a base class also catches its subclasses, so put more specific exceptions first.

```python
def read_value(data, key):
    try:
        return int(data[key])
    except (KeyError, IndexError):
        return "missing"
    except ValueError:
        return "invalid"


print(read_value({"epochs": "10"}, "epochs"))   # 10
print(read_value({}, "epochs"))                 # missing
print(read_value(["x"], 0))                     # invalid
```

| Handler | What it catches |
| --- | --- |
| `except KeyError:` | Only `KeyError` and its subclasses |
| `except (KeyError, ValueError):` | Either type |
| `except Exception:` | Almost all ordinary errors; use sparingly and usually log or re-raise |
| bare `except:` | Everything, including `KeyboardInterrupt` and `SystemExit`; avoid |

If you catch broadly at a top-level boundary (for example, to log a failed training job), log the error and re-raise it with a bare `raise` rather than hiding it.

## 3. `else` Runs Only When the `try` Block Completes Normally

`else` does not run if the `try` block exits through an exception, `return`, `break`, or `continue`.

```python
def check(value):
    try:
        if value is None:
            return "returned early"
        number = int(value)
    except ValueError:
        return "invalid"
    else:
        return f"parsed {number}"


print(check("5"))   # parsed 5
print(check(None))  # returned early
print(check("x"))   # invalid
```

### Exceptions in `else` Are Not Caught by the Preceding Handlers

This is the main reason to use `else`: it keeps the `try` block small, so the handler protects only the operation it is meant for.

```python
def parse_and_scale(value):
    try:
        number = int(value)
    except ValueError:
        return "invalid input"
    else:
        return 100 // number


print(parse_and_scale("4"))  # 25
print(parse_and_scale("x"))  # invalid input

try:
    parse_and_scale("0")
except ZeroDivisionError:
    print("ZeroDivisionError was not handled by the except clause")
# ZeroDivisionError was not handled by the except clause
```

The `ZeroDivisionError` from `else` propagates, because the `except ValueError` clause protects only the `try` block. Keep `try` blocks small, so it is clear which operation each handler protects.

## 4. Cleanup With `finally` and the Danger of Returning From It

`finally` normally runs even when an exception is propagating or a `return` happens.

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

The return value is computed before `finally` runs. Rebinding the variable inside `finally` does not change it.

```python
def example():
    status = "training"
    try:
        return status
    finally:
        status = "done"


print(example())  # training
```

`finally` cannot guarantee cleanup if the process is killed, crashes, loses power, or exits with `os._exit()`.

### Common Mistake: `return` Inside `finally`

A `return` inside `finally` can replace a pending return value or silently swallow a pending exception.

```python
def replaces_value():
    try:
        return "original"
    finally:
        return "from finally"


def swallows_error():
    try:
        raise ValueError("Corrupted checkpoint")
    finally:
        return "looks fine"


print(replaces_value())  # from finally
print(swallows_error())  # looks fine
```

The `ValueError` disappears completely, so the caller never learns the checkpoint was corrupted. The same applies to `break` and `continue` inside `finally`. Avoid control-flow statements there. Python 3.14+ emits a `SyntaxWarning` for `return`, `break`, or `continue` that exits a `finally` block (PEP 765); earlier versions accept it silently.

| In `finally` | Effect |
| --- | --- |
| Closing a file or releasing a lock | Correct use |
| `return` | Replaces the pending return value or discards the exception |
| `break` / `continue` in a loop | Also discards a pending exception |
| Raising a new exception | Replaces the pending one; the earlier one is kept as `__context__` |

## 5. Follow-Up: The `as` Name Is Deleted After the Handler

The name bound with `except ... as error` is removed when the handler ends. This breaks a reference cycle between the exception, its traceback, and the frame.

```python
try:
    int("x")
except ValueError as error:
    print("Handled")  # Handled

try:
    print(error)
except NameError:
    print("error is no longer defined")  # error is no longer defined
```

To keep the exception, assign it to another name inside the handler, for example `saved = error`.

Python 3.11+ also adds `except*` for handling an `ExceptionGroup`, which can contain several unrelated exceptions at once, such as failures from concurrent tasks. Ordinary code still uses plain `except`.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Each clause has a distinct purpose | `try` risky code, `except` handle, `else` success path, `finally` cleanup |
| Execution order | `try` → `except` or `else` → `finally` |
| Catch specific exceptions | `except KeyError` instead of `except Exception` |
| Order handlers from specific to general | A base-class handler catches subclasses |
| `else` runs only on normal completion | Skipped on exception or early `return` |
| `else` exceptions are not caught by earlier handlers | `ZeroDivisionError` in `else` propagates |
| `finally` runs on return and on propagation | `"Cleanup"` prints before the value is returned |
| `return` in `finally` is dangerous | It can swallow an exception |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| When does `except` run? | When a matching exception is raised in the `try` block |
| When does `else` run? | When the `try` block completes without an exception, `return`, `break`, or `continue` |
| When does `finally` run? | Whenever control leaves the statement, in almost all cases |
| Are exceptions in `else` caught by the `except` above? | No |
| Which handler wins if several match? | The first one, top to bottom |
| Why avoid bare `except:`? | It also catches `KeyboardInterrupt` and `SystemExit` |
| What does `return` in `finally` do? | Replaces the return value or swallows a pending exception |
| Does Python warn about it? | Yes, a `SyntaxWarning` from Python 3.14 (PEP 765) |
| Is `finally` guaranteed if the process is killed? | No |
| Why keep `try` blocks small? | So each handler clearly protects one operation |

## 8. Interview-Ready Answer

> The `try` block contains code that might fail, and each `except` clause handles a specific matching exception, checked from top to bottom. The `else` block runs only when the `try` block completes normally, and exceptions raised in `else` are not caught by the preceding handlers, which helps keep the protected region small. The `finally` block runs as control leaves the statement, whether it leaves normally, through a `return`, or with an exception propagating, so it is the place for cleanup. I catch specific exceptions rather than using a broad `except`, so unrelated bugs still surface. I also avoid `return`, `break`, or `continue` in `finally`, because they can replace a return value or silently swallow an exception, and Python 3.14 now warns about them.

---

# Python Interview Question: Custom Exceptions

**Difficulty:** 🟢 Beginner

## Question: How Do You Create and Raise Custom Exceptions?

**Answer:** A custom exception gives an application-specific failure a meaningful type. Define a class that inherits from `Exception` (or a more specific built-in subclass such as `ValueError`), then raise an instance of it with `raise`. Callers can then catch exactly that failure without catching unrelated errors.

| Step | Code |
| --- | --- |
| Define | `class ModelNotTrainedError(Exception): ...` |
| Raise | `raise ModelNotTrainedError("Train the model before prediction")` |
| Catch | `except ModelNotTrainedError as error:` |

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

A docstring is enough for the class body. The class does not need any methods to be useful; its type is the information.

## 1. Derive Application Exceptions From `Exception` or a Suitable Subclass

### Build a Small Hierarchy

A common pattern is one base exception for your package and specific subclasses beneath it. Callers can catch one specific failure or all of your package's failures.

```python
class PipelineError(Exception):
    """Base class for errors raised by the training pipeline."""


class DataValidationError(PipelineError):
    pass


class ModelNotTrainedError(PipelineError):
    pass


try:
    raise DataValidationError("Label column is missing")
except PipelineError as error:
    print(type(error).__name__)  # DataValidationError
    print(error)                 # Label column is missing

print(issubclass(ModelNotTrainedError, Exception))  # True
```

### Inherit From a Built-In When the Meaning Matches

If your error is a kind of invalid value, inheriting from `ValueError` lets existing code that catches `ValueError` handle it too.

```python
class InvalidFeatureCountError(ValueError):
    pass


try:
    raise InvalidFeatureCountError("Expected 4 features")
except ValueError as error:
    print(f"Caught as ValueError: {error}")
# Caught as ValueError: Expected 4 features
```

| Base class | Good for |
| --- | --- |
| `Exception` | General application errors |
| `ValueError` | A value of the right type but an invalid content |
| `TypeError` | An argument of the wrong type |
| `LookupError` / `KeyError` | Something requested by key or name is missing |
| `RuntimeError` | An error that fits no other category, such as invalid state |

If a custom type adds no useful meaning, reuse a built-in exception instead. `raise ValueError("learning rate must be positive")` is often enough.

## 2. Raise Meaningful Errors With Useful Messages

A good message says what went wrong and, when possible, what was expected. The message is passed to the constructor and becomes `str(error)`.

### Raising a Class vs an Instance

`raise` accepts either an instance or a class. A class is instantiated with no arguments, so there is no message.

```python
class ModelNotTrainedError(Exception):
    pass


try:
    raise ModelNotTrainedError
except ModelNotTrainedError as error:
    print(repr(str(error)))  # ''
    print(error.args)        # ()
```

Prefer raising an instance with a message.

### Store Structured Details on the Exception

You can add attributes so handlers can inspect the failure without parsing the message.

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

### Pitfall: Forgetting `super().__init__()`

If you override `__init__` without calling `super().__init__()`, the exception's `args` depend only on the positional arguments that were passed, and the message may be empty.

```python
class BrokenFeatureCountError(ValueError):
    def __init__(self, expected, actual):
        self.expected = expected
        self.actual = actual


error = BrokenFeatureCountError(expected=4, actual=2)
print(repr(str(error)))  # ''
print(error.args)        # ()
```

Calling `super().__init__(message)` gives the exception a proper message for logs and tracebacks.

## 3. Catch the Custom Type Where Recovery or Reporting Makes Sense

Raise the error where the problem is detected. Catch it where the code knows what to do about it, which is often higher up the call stack.

```python
class ModelNotTrainedError(Exception):
    pass


class Classifier:
    def __init__(self, trained):
        self.trained = trained

    def predict(self, features):
        if not self.trained:
            raise ModelNotTrainedError("Train the model before prediction")
        return "cat"


def predict_with_fallback(model, features):
    try:
        return model.predict(features)
    except ModelNotTrainedError:
        return "unknown"  # Recover with a safe default


print(predict_with_fallback(Classifier(trained=True), [1.2]))   # cat
print(predict_with_fallback(Classifier(trained=False), [1.2]))  # unknown
```

The handler catches only `ModelNotTrainedError`. Other bugs, such as a `TypeError` inside `predict`, still propagate and are not mistaken for an untrained model.

| Where | What to do |
| --- | --- |
| Where the problem is detected | `raise` a specific exception with a clear message |
| Where a fallback exists | Catch the specific type and recover |
| At an application boundary (API, CLI, job runner) | Catch, log, and report or re-raise |
| Where nothing useful can be done | Let it propagate |

## 4. Don't Derive Ordinary Application Errors From `BaseException`

`BaseException` is the root of all exceptions. A few special exceptions inherit from it directly, so that `except Exception` does not catch them.

| Direct subclass of `BaseException` | Meaning |
| --- | --- |
| `KeyboardInterrupt` | The user pressed Ctrl+C |
| `SystemExit` | `sys.exit()` was called |
| `GeneratorExit` | A generator or coroutine is being closed |
| `Exception` | The base for ordinary errors |

If your error inherits from `BaseException`, a normal `except Exception` handler misses it.

```python
class WrongBaseError(BaseException):
    pass


try:
    try:
        raise WrongBaseError("Invalid batch")
    except Exception:
        print("Handled as an ordinary error")
except BaseException as error:
    print(f"Escaped except Exception: {type(error).__name__}")
# Escaped except Exception: WrongBaseError
```

Generic error handling, logging middleware, and retry logic usually catch `Exception`, so the error would bypass all of them. Inherit from `Exception` instead.

## 5. Follow-Up: Adding Context With `add_note()` (Python 3.11+)

Sometimes you want to add information to an existing exception without changing its type. Python 3.11 added `add_note()`, which stores extra strings in `__notes__`. They are shown below the message in a traceback.

```python
def train_fold(fold):
    raise ValueError("NaN loss")


try:
    try:
        train_fold(3)
    except ValueError as error:
        error.add_note("while training fold 3")
        raise
except ValueError as error:
    print(error)            # NaN loss
    print(error.__notes__)  # ['while training fold 3']
```

The bare `raise` re-raises the same exception after adding the note. To translate a low-level error into a custom exception while keeping the original, use `raise CustomError(...) from error` (exception chaining).

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Derive from `Exception` or a suitable subclass | `class ModelNotTrainedError(Exception)` |
| A hierarchy allows broad or narrow handling | `except PipelineError` catches all pipeline errors |
| Built-in bases add compatibility | `InvalidFeatureCountError(ValueError)` is caught by `except ValueError` |
| Raise instances with clear messages | `raise ModelNotTrainedError("Train the model before prediction")` |
| Store structured details | `error.expected`, `error.actual` |
| Call `super().__init__()` when overriding `__init__` | Otherwise the message can be empty |
| Catch where recovery makes sense | Fall back to `"unknown"` for an untrained model |
| Avoid `BaseException` as a base | `except Exception` would not catch it |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| How do you define a custom exception? | `class MyError(Exception): pass` |
| How do you raise it? | `raise MyError("message")` |
| What does `raise MyError` without parentheses do? | Raises an instance created with no arguments |
| Why inherit from `ValueError`? | So `except ValueError` also catches it |
| Why create a base package exception? | Callers can catch all of your errors with one handler |
| How do you attach structured data? | Set attributes in `__init__` and call `super().__init__(message)` |
| What if you skip `super().__init__()`? | `args` and the message may be empty |
| Why not inherit from `BaseException`? | `except Exception` would miss it, like `KeyboardInterrupt` |
| When should you not create a custom exception? | When a built-in already expresses the meaning |
| How do you add context without changing the type? | `error.add_note(...)` in Python 3.11+ |

## 8. Interview-Ready Answer

> To create a custom exception, I define a class that inherits from `Exception`, or from a more specific built-in such as `ValueError` when the meaning matches, and I raise an instance with a clear message, for example `raise ModelNotTrainedError("Train the model before prediction")`. In a larger project I usually define one base exception for the package and specific subclasses, so callers can catch either a single failure or all of them. If the handler needs details, I store them as attributes and call `super().__init__()` with a readable message. I raise the error where the problem is detected and catch the specific type only where the code can recover or report it. I avoid inheriting from `BaseException`, because ordinary `except Exception` handlers would not catch it, and I reuse a built-in exception when a custom type adds no meaning.

---

# Python Interview Question: Exception Chaining With `raise ... from ...`

**Difficulty:** 🟡 Intermediate

## Question: What Is Exception Chaining Using `raise ... from ...`?

**Answer:** Exception chaining links a new exception to the exception that caused it. Use `raise NewError(...) from original_error` when you turn a low-level failure into an application-level one but want to keep the original cause. The original is stored in the new exception's `__cause__` attribute and is shown in the traceback.

| Form | Behavior |
| --- | --- |
| `raise NewError(...) from error` | Sets an explicit cause in `__cause__` |
| `raise NewError(...)` inside an `except` block | Keeps the implicit context in `__context__` |
| `raise NewError(...) from None` | Hides the earlier exception in the traceback |
| Bare `raise` inside an `except` block | Re-raises the exception being handled |

## 1. Turn a Low-Level Error Into a Meaningful Higher-Level Error

Low-level errors describe what failed mechanically, such as `int()` rejecting a string. The caller of a configuration loader cares about something higher-level: the configuration is invalid.

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

Callers now catch one meaningful type, `InvalidConfigurationError`, instead of having to know every low-level error that parsing might raise.

| Layer | Error | Message |
| --- | --- | --- |
| Low level | `ValueError` | `invalid literal for int() with base 10: 'twenty'` |
| Application level | `InvalidConfigurationError` | `epochs must be an integer` |

## 2. Keep the Original Cause for Debugging

The new exception carries the original one, so no information is lost.

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
    print(error.__cause__)  # invalid literal for int() with base 10: 'twenty'
```

If the error is not handled, the traceback shows both exceptions and marks the original one as the direct cause. Abbreviated, with file paths shortened, Python 3.12 prints:

```text
Traceback (most recent call last):
  File "train.py", line 5, in parse_epochs
    return int(value)
           ^^^^^^^^^^
ValueError: invalid literal for int() with base 10: 'twenty'

The above exception was the direct cause of the following exception:

Traceback (most recent call last):
  File "train.py", line 8, in <module>
    parse_epochs("twenty")
  File "train.py", line 7, in parse_epochs
    raise InvalidConfigurationError("epochs must be an integer") from error
InvalidConfigurationError: epochs must be an integer
```

The original exception is printed first, and the final line is the exception that actually reached the top level.

You can produce the same text yourself with the `traceback` module, which is useful for logging:

```python
import traceback


class InvalidConfigurationError(Exception):
    pass


try:
    try:
        int("twenty")
    except ValueError as error:
        raise InvalidConfigurationError("epochs must be an integer") from error
except InvalidConfigurationError as error:
    text = "".join(traceback.format_exception(error))

for line in text.splitlines():
    if line and not line.startswith((" ", "Traceback")):
        print(line)
# ValueError: invalid literal for int() with base 10: 'twenty'
# The above exception was the direct cause of the following exception:
# InvalidConfigurationError: epochs must be an integer
```

The single-argument form `traceback.format_exception(error)` requires Python 3.10+.

## 3. Explicit Chaining vs Implicit Exception Context

Python also chains exceptions automatically. If any exception is raised while another is being handled, the one being handled is stored in `__context__`. This is implicit chaining.

```python
try:
    try:
        int("twenty")
    except ValueError:
        raise RuntimeError("epochs must be an integer")
except RuntimeError as error:
    print(type(error.__context__).__name__)  # ValueError
    print(error.__cause__)                   # None
    print(error.__suppress_context__)        # False
```

The traceback for implicit chaining uses different wording, which tells the reader that the second error may be an accident rather than a deliberate translation:

```text
ValueError: invalid literal for int() with base 10: 'twenty'

During handling of the above exception, another exception occurred:

RuntimeError: epochs must be an integer
```

With `from error`, Python sets `__cause__` and also sets `__suppress_context__` to `True`, so only the cause is displayed. `__context__` is still set automatically.

```python
try:
    try:
        int("twenty")
    except ValueError as error:
        raise RuntimeError("epochs must be an integer") from error
except RuntimeError as error:
    print(type(error.__cause__).__name__)    # ValueError
    print(type(error.__context__).__name__)  # ValueError
    print(error.__suppress_context__)        # True
```

| Attribute | Set by | Traceback wording |
| --- | --- | --- |
| `__context__` | Automatically, when raising during handling | "During handling of the above exception, another exception occurred" |
| `__cause__` | Explicitly, with `from error` | "The above exception was the direct cause of the following exception" |
| `__suppress_context__` | `True` after any `from` clause | Hides `__context__` when displaying |

### Implicit Chaining Also Reveals Bugs in Handlers

Implicit chaining is useful when a handler itself fails by accident. You see both the original error and the bug in the handler.

```python
try:
    try:
        {}["lr"]
    except KeyError:
        print(undefined_name)  # Bug in the handler
except NameError as error:
    print(type(error.__context__).__name__)  # KeyError
```

## 4. What `from None` Changes

`raise NewError(...) from None` hides the earlier exception in the displayed traceback. This is useful when the low-level detail would only confuse the user, for example in a public API or CLI.

```python
class InvalidConfigurationError(Exception):
    pass


def parse_public_value(value):
    try:
        return int(value)
    except ValueError:
        raise InvalidConfigurationError("Invalid numeric setting") from None


try:
    parse_public_value("abc")
except InvalidConfigurationError as error:
    print(error.__cause__)                   # None
    print(error.__suppress_context__)        # True
    print(type(error.__context__).__name__)  # ValueError
```

`from None` only simplifies the traceback that is shown. It does not remove the earlier exception from `__context__`, so debugging tools can still inspect it. Use explicit chaining when the original cause helps with diagnosis, which is usually the case for internal code.

| Goal | Use |
| --- | --- |
| Translate an error and keep the cause visible | `raise NewError(...) from error` |
| Translate an error and hide noisy internals | `raise NewError(...) from None` |
| Log or clean up, then let the same error continue | Bare `raise` |

## 5. Follow-Up: Bare `raise` vs Raising a New Exception

A bare `raise` inside an `except` block re-raises the exception currently being handled, with its original traceback. Nothing new is chained.

```python
def load_checkpoint(path):
    try:
        raise FileNotFoundError(path)
    except FileNotFoundError:
        print("Logging the failure")
        raise


try:
    load_checkpoint("model.pt")
except FileNotFoundError as error:
    print(type(error).__name__)
    print(error.__context__)
# Logging the failure
# FileNotFoundError
# None
```

The expression after `from` must be an exception instance, an exception class, or `None`. Anything else raises a `TypeError`.

```python
try:
    raise ValueError("bad value") from "not an exception"
except TypeError as error:
    print(error)  # exception causes must derive from BaseException
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Translate low-level errors into meaningful ones | `ValueError` → `InvalidConfigurationError` |
| Keep the original cause | `raise ... from error` sets `__cause__` |
| The traceback shows both exceptions | "The above exception was the direct cause ..." |
| Implicit chaining happens automatically | Raising inside `except` sets `__context__` |
| Explicit and implicit chaining are reported differently | "direct cause" vs "During handling ..." |
| `from None` hides the context in the display | `__suppress_context__` is `True` |
| `from None` does not delete the context | `__context__` is still the `ValueError` |
| Bare `raise` re-raises the same exception | Useful after logging |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `raise New(...) from error` do? | Raises `New` with `error` stored as `__cause__` |
| Why chain exceptions? | To give a meaningful error while keeping the original for debugging |
| What is `__context__`? | The exception being handled when the new one was raised, set automatically |
| What is `__cause__`? | The explicit cause set with `from` |
| How does the traceback differ? | "direct cause" for explicit, "During handling" for implicit |
| What does `from None` do? | Sets `__suppress_context__` so the earlier exception is not displayed |
| Does `from None` delete `__context__`? | No |
| What does a bare `raise` do? | Re-raises the current exception unchanged |
| When use `from None`? | When internal details would only confuse the user |
| What can follow `from`? | An exception instance, an exception class, or `None` |

## 8. Interview-Ready Answer

> Exception chaining links a new exception to the one that caused it. When I translate a low-level failure into an application-level one, such as turning a `ValueError` from `int()` into an `InvalidConfigurationError`, I write `raise InvalidConfigurationError(...) from error`, which stores the original in `__cause__` and shows both in the traceback as a direct cause. Even without `from`, raising inside an `except` block chains implicitly through `__context__`, and the traceback says the second error occurred during handling of the first. `raise ... from None` sets `__suppress_context__`, so the earlier exception is hidden in the displayed traceback, although `__context__` is still kept. I use explicit chaining in internal code because the cause helps debugging, `from None` only when the internal detail is noise, and a bare `raise` when I just want to log and re-raise the same exception.

---

# Python Interview Question: Context Managers and `with`

**Difficulty:** 🟡 Intermediate

## Question: What Is a Context Manager, and How Does `with` Work?

**Answer:** A context manager defines setup and exit behavior around a block of code. The `with` statement uses it to manage resources such as files, locks, or temporary directories: it calls the manager's `__enter__()` before the block and its `__exit__()` after the block, even when the block raises an exception.

```python
from tempfile import TemporaryFile


with TemporaryFile(mode="w+t", encoding="utf-8") as file:
    file.write("training data\n")
    file.seek(0)
    print(file.read().strip())  # training data

print(file.closed)  # True
```

The file is closed automatically when the block ends. The name `file` still exists after the block, but it refers to a closed file.

| Context manager | Setup | Exit behavior |
| --- | --- | --- |
| `open(path)` | Opens the file | Closes the file |
| `threading.Lock()` | Acquires the lock | Releases the lock |
| `tempfile.TemporaryDirectory()` | Creates a directory | Deletes it and its contents |
| `decimal.localcontext()` | Copies the decimal context | Restores the previous context |
| `contextlib.suppress(...)` | Nothing | Suppresses the listed exceptions |

## 1. Managing a Resource Within a Clearly Defined Scope

The block under `with` is the resource's scope. The resource is set up when the block starts and cleaned up when it ends, so you cannot forget the cleanup or skip it on an error path.

### Without a Context Manager

```python
from pathlib import Path
from tempfile import TemporaryDirectory


with TemporaryDirectory() as directory:
    path = Path(directory) / "metrics.txt"

    file = open(path, "w", encoding="utf-8")
    try:
        file.write("loss=0.21\n")
    finally:
        file.close()

    print(file.closed)  # True
```

This is correct, but the cleanup must be written by hand every time.

### With a Context Manager

```python
from pathlib import Path
from tempfile import TemporaryDirectory


with TemporaryDirectory() as directory:
    path = Path(directory) / "metrics.txt"

    with open(path, "w", encoding="utf-8") as file:
        file.write("loss=0.21\n")

    print(file.closed)  # True
    print(path.read_text(encoding="utf-8").strip())  # loss=0.21

print(Path(directory).exists())  # False
```

Both the file and the temporary directory are cleaned up at the end of their blocks.

### Several Managers in One Statement

```python
from pathlib import Path
from tempfile import TemporaryDirectory


with TemporaryDirectory() as directory:
    source = Path(directory) / "raw.txt"
    source.write_text("a\nb\n", encoding="utf-8")

    with (
        open(source, encoding="utf-8") as reader,
        open(Path(directory) / "clean.txt", "w", encoding="utf-8") as writer,
    ):
        for line in reader:
            writer.write(line.upper())

    print(reader.closed, writer.closed)  # True True
```

The managers are entered from left to right and exited in reverse order. Parenthesized groups of managers are officially supported from Python 3.10; on older versions, write them on one line separated by commas.

## 2. Entering, Binding the `as` Value, and Exiting

For a synchronous context manager, the steps are:

1. Evaluate the context manager expression.
2. Call `__enter__()`.
3. Bind its return value to the name after `as`, if there is one.
4. Run the block.
5. Call `__exit__()` when leaving the block, including when an exception occurs.

### Tracing the Steps

```python
class Trace:
    def __enter__(self):
        print("enter")
        return "resource"

    def __exit__(self, exc_type, exc_value, traceback):
        print(f"exit, exception: {exc_type}")
        return False


with Trace() as value:
    print(f"inside with {value}")
# enter
# inside with resource
# exit, exception: None
```

### The `as` Value Need Not Be the Manager

The value `__enter__()` returns doesn't have to be the context manager itself. A file's `__enter__()` returns the file, but a lock's `__enter__()` returns `True`.

```python
from threading import Lock


lock = Lock()

with lock as result:
    print(result)         # True
    print(lock.locked())  # True

print(lock.locked())  # False
```

So `with Lock() as lock:` would not give you the lock object. Use `with lock:` on an existing lock instead.

### Roughly What `with` Does

Simplified, `with manager as value: block` behaves like this:

```python
class Trace:
    def __enter__(self):
        print("enter")
        return "resource"

    def __exit__(self, exc_type, exc_value, traceback):
        print(f"exit, exception: {exc_type}")
        return False


manager = Trace()
value = manager.__enter__()
try:
    print(f"inside with {value}")
except BaseException as error:
    if not manager.__exit__(type(error), error, error.__traceback__):
        raise
else:
    manager.__exit__(None, None, None)
# enter
# inside with resource
# exit, exception: None
```

The real statement looks up `__enter__` and `__exit__` on the type, not the instance, and also calls `__exit__` when the block exits with `return`, `break`, or `continue`.

## 3. Cleanup Happens on Normal Exit and When an Exception Propagates

Once entry succeeds, `__exit__()` always runs. When the block raises, `__exit__()` receives the exception's type, value, and traceback.

```python
class Trace:
    def __enter__(self):
        print("enter")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print(f"exit, exception: {exc_type.__name__}")
        return False


try:
    with Trace():
        raise ValueError("NaN loss")
except ValueError as error:
    print(f"Caller saw: {error}")
# enter
# exit, exception: ValueError
# Caller saw: NaN loss
```

The cleanup happens before the exception reaches the caller.

### If `__enter__()` Fails, `__exit__()` Is Not Called

```python
class FailingEntry:
    def __enter__(self):
        raise ConnectionError("GPU server unavailable")

    def __exit__(self, exc_type, exc_value, traceback):
        print("exit")  # Never printed
        return False


try:
    with FailingEntry():
        print("block")  # Never printed
except ConnectionError as error:
    print(error)  # GPU server unavailable
```

The `with` statement assumes nothing was acquired if entry fails. The entry code must clean up anything it partly acquired before raising.

## 4. Some Context Managers Suppress Exceptions

If `__exit__()` returns a truthy value, the exception from the block is suppressed and execution continues after the `with` statement. Returning `False` or `None` lets the exception propagate.

### `contextlib.suppress`

```python
from contextlib import suppress
import os


with suppress(FileNotFoundError):
    os.remove("old_checkpoint.pt")
    print("Removed")  # Not reached if the file is missing

print("Continuing")  # Continuing
```

When `os.remove()` raises `FileNotFoundError`, the rest of the block is skipped, but the program continues.

### A Custom Manager That Suppresses

```python
class IgnoreValueErrors:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, ValueError)


with IgnoreValueErrors():
    int("not a number")

print("Still running")  # Still running
```

| `__exit__()` returns | Effect |
| --- | --- |
| `None` (no `return`) | Exception propagates |
| `False` | Exception propagates |
| `True` or any truthy value | Exception is suppressed |

Suppression should be deliberate and narrow. Returning a truthy value by accident hides errors.

## 5. Follow-Up: What a Context Manager Does Depends on Its Implementation

A `with` statement does not always mean "close at the end". For example, a `sqlite3` connection used as a context manager manages a transaction: it commits on success and rolls back on an exception, but it does not close the connection.

```python
import sqlite3


connection = sqlite3.connect(":memory:")
connection.execute("CREATE TABLE runs (accuracy REAL)")

with connection:
    connection.execute("INSERT INTO runs VALUES (0.93)")

try:
    with connection:
        connection.execute("INSERT INTO runs VALUES (0.10)")
        raise ValueError("Bad run")
except ValueError:
    pass

print(connection.execute("SELECT accuracy FROM runs").fetchall())  # [(0.93,)]
connection.close()
```

The second insert was rolled back, and the connection was still open afterwards. Read the documentation to know what a manager does on exit.

Asynchronous code uses `async with`, which calls `__aenter__()` and `__aexit__()` and awaits them.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| A context manager scopes a resource to a block | A file is closed when `with open(...)` ends |
| `with` calls `__enter__()` then `__exit__()` | The trace prints `enter`, block, `exit` |
| The `as` name gets `__enter__()`'s return value | `with lock as result:` gives `True` |
| Cleanup runs on normal exit and on exceptions | `__exit__()` runs before the caller sees the error |
| A failed `__enter__()` skips `__exit__()` | Entry code must clean up partial work |
| A truthy `__exit__()` return suppresses the exception | `contextlib.suppress` |
| Behavior depends on the manager | `sqlite3` commits or rolls back, but does not close |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is a context manager? | An object with `__enter__()` and `__exit__()` that wraps a block |
| What does `with` call first? | `__enter__()` |
| What is bound after `as`? | The return value of `__enter__()` |
| Is the `as` value always the manager? | No; for example, a lock returns `True` |
| Does `__exit__()` run if the block raises? | Yes, if entry succeeded |
| Does `__exit__()` run if `__enter__()` raises? | No |
| How is an exception suppressed? | `__exit__()` returns a truthy value |
| What does returning `None` from `__exit__()` do? | Lets the exception propagate |
| Does the `as` name exist after the block? | Yes, but the resource is usually closed or released |
| Does every manager close its resource? | No; `sqlite3` connections manage transactions instead |

## 8. Interview-Ready Answer

> A context manager is an object that defines what happens on entry to and exit from a block of code, and the `with` statement uses it to manage resources like files, locks, and temporary directories within a clearly defined scope. Python evaluates the expression, calls `__enter__()`, binds its return value to the `as` name, runs the block, and then calls `__exit__()`, whether the block finishes normally or raises an exception. If `__enter__()` itself fails, `__exit__()` is not called, so entry code must clean up anything it partly acquired. `__exit__()` receives the exception details, and if it returns a truthy value the exception is suppressed, which is how `contextlib.suppress` works. What exit actually does depends on the manager, for example a `sqlite3` connection commits or rolls back a transaction rather than closing.

---

# Python Interview Question: Writing a Custom Context Manager

**Difficulty:** 🟡 Intermediate

## Question: How Do You Write a Custom Context Manager Using `__enter__` and `__exit__`?

**Answer:** Implement `__enter__()` to acquire the resource and return the value the block should use, and implement `__exit__(exc_type, exc_value, traceback)` to clean it up. `__exit__()` runs whether the block finishes normally or raises, and its return value decides whether an exception is suppressed: return `False` (or `None`) to let it propagate.

| Method | Called | Responsibility |
| --- | --- | --- |
| `__init__()` | When the manager object is created | Store configuration |
| `__enter__()` | At the start of the `with` block | Acquire the resource and return the value bound by `as` |
| `__exit__()` | When the block ends, normally or by exception | Release the resource; decide whether to suppress |

## 1. Implement the Context Manager Protocol

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

Once entry succeeds, `__exit__()` is called even if the block raises an exception. Returning `False` lets that exception continue outward after the cleanup.

Notice the split: `__init__()` only stores the path and mode, while `__enter__()` opens the file. Acquiring in `__enter__()` means each `with` statement gets a fresh resource, and nothing is opened if the object is created but never used in a `with`.

**Practical note:** built-in file objects already support `with`. This class only demonstrates the protocol. For ordinary file handling, `with open(...) as file:` is enough.

## 2. Return the Managed Value From `__enter__()`

Whatever `__enter__()` returns is bound to the name after `as`. Return the thing the block needs to use: often the resource, sometimes `self`.

| Return from `__enter__()` | Good when |
| --- | --- |
| The resource (`self.file`) | The block works directly with the resource |
| `self` | The manager has useful methods or collects results |
| Nothing | The block never needs an `as` value, such as a lock |

### Returning `self`: an ML Example

A manager that temporarily switches a model into evaluation mode and restores the previous mode afterwards:

```python
class Model:
    def __init__(self):
        self.training = True


class EvalMode:
    def __init__(self, model):
        self.model = model
        self.previous = None

    def __enter__(self):
        self.previous = self.model.training
        self.model.training = False
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.model.training = self.previous
        return False


model = Model()

with EvalMode(model) as context:
    print(model.training)     # False
    print(context.previous)   # True

print(model.training)  # True
```

Storing the previous state and restoring it, instead of always setting `training = True`, makes the manager correct even if the model was already in evaluation mode.

### Pitfall: Forgetting to Return

If `__enter__()` has no `return`, the `as` name is bound to `None`.

```python
class NoReturn:
    def __enter__(self):
        self.value = "resource"

    def __exit__(self, exc_type, exc_value, traceback):
        return False


with NoReturn() as value:
    print(value)  # None
```

## 3. The Three Exception Arguments to `__exit__()`

| `__exit__` argument | Meaning |
| --- | --- |
| `exc_type` | Exception class, or `None` if no exception occurred |
| `exc_value` | Exception instance, or `None` |
| `traceback` | Exception traceback, or `None` |

```python
class Inspect:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            print("Clean exit")
        else:
            print(exc_type.__name__)
            print(exc_value)
            print(type(traceback).__name__)
        return False


with Inspect():
    pass

try:
    with Inspect():
        raise KeyError("learning_rate")
except KeyError:
    pass
# Clean exit
# KeyError
# 'learning_rate'
# traceback
```

All three are `None` on a normal exit. On an exception, `exc_value` is the exception instance and `traceback` is a `traceback` object. The third parameter is often named `traceback` or `tb`; naming it `traceback` shadows the `traceback` module inside the method, which only matters if you use that module there.

`__exit__()` is also called with three `None` values when the block exits through `return`, `break`, or `continue`.

## 4. Clean Up Reliably and Avoid Suppressing Exceptions by Accident

### Be Explicit About Suppression

A truthy return value from `__exit__()` suppresses the exception. Returning `False` explicitly, as in `ManagedTextFile`, makes the intention clear. A bug such as `return self.file` or `return "done"` silently hides every error.

```python
class AccidentalSuppress:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return "closed"  # Truthy by accident


with AccidentalSuppress():
    raise ValueError("Corrupted batch")

print("The error disappeared")  # The error disappeared
```

### Suppress Only What You Mean To

If suppression is intended, limit it to specific exception types.

```python
class SkipMissingFiles:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        return exc_type is not None and issubclass(exc_type, FileNotFoundError)


with SkipMissingFiles():
    open("missing_shard.csv", encoding="utf-8")

print("Skipped a missing file")  # Skipped a missing file

try:
    with SkipMissingFiles():
        raise ValueError("Bad shard")
except ValueError as error:
    print(f"Still raised: {error}")  # Still raised: Bad shard
```

Do not re-raise the exception passed in to `__exit__()`. To let it propagate, return a falsy value; Python re-raises it for you.

### Cleanup That Raises Replaces the Original Error

If the cleanup itself raises an exception, that new error can replace the one already propagating. The earlier error is normally kept as its context.

```python
class FailingCleanup:
    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        raise RuntimeError("Could not release GPU memory")


try:
    with FailingCleanup():
        raise ValueError("NaN loss")
except Exception as error:
    print(type(error).__name__)              # RuntimeError
    print(type(error.__context__).__name__)  # ValueError
```

Keep cleanup code simple and unlikely to fail, so it does not hide the real problem.

### Clean Up Partial Work in `__enter__()`

If `__enter__()` acquires several things and a later step fails, `__exit__()` is not called. Release what was already acquired before letting the error propagate.

```python
class Connection:
    def __init__(self):
        print("Acquired connection")

    def close(self):
        print("Released connection")


class TrainingSession:
    def __init__(self, log_path):
        self.log_path = log_path

    def __enter__(self):
        self.connection = Connection()
        try:
            self.log = open(self.log_path, "w", encoding="utf-8")
        except BaseException:
            self.connection.close()  # Undo the partial acquisition
            raise
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.log.close()
        self.connection.close()
        return False


try:
    with TrainingSession("missing_dir/train.log"):
        print("Training")
except FileNotFoundError as error:
    print(type(error).__name__)
# Acquired connection
# Released connection
# FileNotFoundError
```

`"Training"` is never printed, and `__exit__()` is never called, so the `except` inside `__enter__()` is the only place the connection can be released.

`contextlib.ExitStack` can make multi-resource setup like this easier.

## 5. Follow-Up: The `@contextmanager` Alternative

For simple cases, `contextlib.contextmanager` turns a generator function into a context manager. Code before `yield` is the setup, the yielded value is bound by `as`, and code after `yield` is the cleanup.

```python
from contextlib import contextmanager


class Model:
    def __init__(self):
        self.training = True


@contextmanager
def eval_mode(model):
    previous = model.training
    model.training = False
    try:
        yield model
    finally:
        model.training = previous


model = Model()

with eval_mode(model):
    print(model.training)  # False

print(model.training)  # True
```

The `try/finally` is essential: without it, an exception in the block would skip the restore. A class with `__enter__` and `__exit__` is the better choice when the manager needs extra methods, state shared across uses, or fine control over suppression.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Implement both protocol methods | `__enter__()` and `__exit__()` on a class |
| Acquire in `__enter__()`, not `__init__()` | `ManagedTextFile` opens the file on entry |
| Return the managed value from `__enter__()` | `return self.file` or `return self` |
| Forgetting `return` binds `None` | `with NoReturn() as value:` gives `None` |
| Know the three `__exit__()` arguments | Type, instance, traceback, or three `None`s |
| Return `False` to let errors propagate | A truthy return suppresses them |
| Suppress narrowly when intended | Check `issubclass(exc_type, FileNotFoundError)` |
| A raising cleanup replaces the original error | The original becomes `__context__` |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| Which two methods make a context manager? | `__enter__()` and `__exit__()` |
| What does `__enter__()` return? | The value bound by `as` |
| What if `__enter__()` returns nothing? | The `as` name is `None` |
| What arguments does `__exit__()` receive? | `exc_type`, `exc_value`, `traceback` |
| What are they on a normal exit? | All `None` |
| How do you let the exception propagate? | Return `False` or `None` |
| Should `__exit__()` re-raise the exception? | No; return a falsy value instead |
| What if cleanup raises? | The new error replaces the old one, which is kept as `__context__` |
| Is `__exit__()` called if `__enter__()` fails? | No |
| What is a lighter alternative? | `@contextlib.contextmanager` with `try/finally` around `yield` |

## 8. Interview-Ready Answer

> To write a custom context manager, I define a class with `__enter__()` and `__exit__()`. `__enter__()` acquires the resource and returns the value the block should use, which is bound to the `as` name, so forgetting the `return` gives `None`. `__exit__()` receives the exception type, instance, and traceback, all `None` on a normal exit, and it runs whenever the block ends after a successful entry, so it is where I release the resource. I return `False` explicitly so exceptions propagate, and only suppress specific exception types on purpose, because any truthy return hides the error. I also keep cleanup simple, since an exception in `__exit__()` replaces the original one, and for simple cases I use `@contextmanager` with a `try/finally` around the `yield`.

---

# Python Interview Question: `finally` vs Context Managers for Cleanup

**Difficulty:** 🟡 Intermediate

## Question: What Is the Difference Between `finally` and a Context Manager for Cleanup?

**Answer:** A `finally` block puts cleanup code explicitly next to one particular operation. A context manager packages setup and cleanup into a reusable interface that you use with `with`. Both run cleanup on normal exit and when an exception propagates; the difference is where the cleanup logic lives and how easily it can be reused.

| Aspect | `try/finally` | Context manager |
| --- | --- | --- |
| Where cleanup lives | An explicit `finally` block | `__exit__()` or an equivalent abstraction |
| Reusability | Cleanup often repeated at each call site | Resource behavior written once |
| Setup | Written explicitly | Usually done in `__enter__()` |
| Exception suppression | Needs explicit handling or changed control flow | Supported through the `__exit__()` return value |
| Best for | One-off cleanup or custom control flow | Reusable, scoped resource management |

## 1. Both Run Cleanup on Normal Exit and When an Exception Is Raised

### Explicit Cleanup With `finally`

```python
from threading import Lock


lock = Lock()
lock.acquire()
try:
    print("Updating shared metrics")  # Updating shared metrics
finally:
    lock.release()

print(lock.locked())  # False
```

### The Same Resource Scope With `with`

```python
from threading import Lock


lock = Lock()
with lock:
    print("Updating shared metrics")  # Updating shared metrics

print(lock.locked())  # False
```

The lock's context manager handles both acquiring and releasing it.

### Both Release the Lock When the Block Raises

```python
from threading import Lock


lock = Lock()

lock.acquire()
try:
    try:
        raise ValueError("Metric is NaN")
    finally:
        lock.release()
except ValueError:
    print(f"finally released: {not lock.locked()}")

try:
    with lock:
        raise ValueError("Metric is NaN")
except ValueError:
    print(f"with released: {not lock.locked()}")
# finally released: True
# with released: True
```

In both cases, the lock is released before the exception reaches the outer handler. Neither approach catches the exception; it still propagates.

## 2. Explicit Cleanup Code vs a Reusable Resource-Management Protocol

With `finally`, every call site must repeat the acquire, `try`, and release pattern correctly. With a context manager, the pattern is written once, and each call site only says `with`.

### Writing a Reusable Context Manager With `contextlib`

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
    print("Updating shared metrics")  # Updating shared metrics

print(lock.locked())  # False
```

This shows how a context manager can wrap `try/finally`. The `try/finally` makes sure cleanup runs if the block raises an exception, because the exception is thrown into the generator at the `yield`.

### The Generator Must Yield Exactly Once

```python
from contextlib import contextmanager


@contextmanager
def never_yields():
    if False:
        yield


@contextmanager
def yields_twice():
    yield
    yield


for manager in (never_yields, yields_twice):
    try:
        with manager():
            pass
    except RuntimeError as error:
        print(error)
# generator didn't yield
# generator didn't stop
```

### Reuse in Practice: an ML Example

A helper that restores a setting after a temporary change, used in several places:

```python
from contextlib import contextmanager


config = {"batch_size": 32}


@contextmanager
def override(settings, key, value):
    previous = settings[key]
    settings[key] = value
    try:
        yield settings
    finally:
        settings[key] = previous


with override(config, "batch_size", 8):
    print(config["batch_size"])  # 8

print(config["batch_size"])  # 32
```

Writing this with `finally` at each call site would repeat the save, set, and restore steps every time.

## 3. Choose Context Managers for Resources With a Well-Defined, Scoped Lifetime

| Situation | Better choice | Why |
| --- | --- | --- |
| Files, locks, sockets, database transactions | Existing context manager | It already expresses the lifetime |
| The same setup and cleanup in several places | Custom context manager | Write the logic once |
| A one-off cleanup step, such as printing a summary or resetting a counter | `finally` | No reusable abstraction is needed |
| Cleanup that depends on custom control flow in one function | `finally` | Keeps the logic visible in place |
| A variable number of resources chosen at runtime | `contextlib.ExitStack` | Manages any number of managers |

Prefer an existing context manager when it clearly expresses the resource's lifetime. Use `finally` for cleanup that doesn't need a reusable abstraction.

```python
def train(epochs):
    completed = 0
    try:
        for epoch in range(epochs):
            if epoch == 2:
                raise RuntimeError("GPU out of memory")
            completed += 1
    finally:
        print(f"Completed {completed} of {epochs} epochs")


try:
    train(5)
except RuntimeError as error:
    print(error)
# Completed 2 of 5 epochs
# GPU out of memory
```

This summary is specific to one function, so a `finally` block is clearer than a new context manager.

## 4. Acquisition Failures, Exception Suppression, and the Limits of Cleanup

### Acquire the Resource Before the `try`

Acquire the resource *before* the `try`, so cleanup only runs once acquisition has succeeded, as in the lock example. If acquisition is inside the `try` and fails, `finally` tries to release something that was never acquired, and that new error replaces the real one.

```python
from threading import Lock


def failing_acquire(lock):
    raise TimeoutError("Could not acquire lock")


lock = Lock()

try:
    try:
        failing_acquire(lock)  # Wrong: acquisition inside try
        print("Updating shared metrics")
    finally:
        lock.release()
except RuntimeError as error:
    print(error)                             # release unlocked lock
    print(type(error.__context__).__name__)  # TimeoutError
```

The real problem, the `TimeoutError`, is now hidden behind a `RuntimeError` from the cleanup. A context manager avoids this structurally: if `__enter__()` fails, `__exit__()` is not called.

### Several Resources: Use `ExitStack`

If you acquire several resources and a later one fails, clean up the ones you already acquired. `contextlib.ExitStack` helps when the context managers are chosen at runtime.

```python
from contextlib import ExitStack
from pathlib import Path
from tempfile import TemporaryDirectory


with TemporaryDirectory() as directory:
    paths = [Path(directory) / f"shard_{i}.txt" for i in range(3)]
    for path in paths:
        path.write_text(f"{path.stem}\n", encoding="utf-8")

    with ExitStack() as stack:
        files = [stack.enter_context(open(p, encoding="utf-8")) for p in paths]
        print([file.readline().strip() for file in files])
# ['shard_0', 'shard_1', 'shard_2']

    print(all(file.closed for file in files))  # True
```

If opening the third file failed, `ExitStack` would still close the first two. `stack.callback(function)` registers plain cleanup functions as well.

### Suppression

A `finally` block cannot suppress an exception cleanly; only control flow such as `return` in `finally` discards it, which is a known bad practice (Python 3.14+ emits a `SyntaxWarning`, PEP 765). To handle an exception, add an `except` clause. A context manager can suppress deliberately by returning a truthy value from `__exit__()`, as `contextlib.suppress` does.

### The Limits of Cleanup

Neither approach guarantees cleanup if the process is killed, crashes, loses power, or calls `os._exit()`. For critical state, such as checkpoints, write to a temporary file and rename it atomically, so a partial write never replaces a good file.

## 5. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Both run cleanup on normal exit and on exceptions | The lock is released in both versions |
| `finally` is explicit cleanup at one call site | `lock.acquire()`, `try`, `finally: lock.release()` |
| A context manager is a reusable protocol | `with lock:` or `with managed_lock(lock):` |
| `@contextmanager` wraps `try/finally` around one `yield` | Yielding zero or two times raises `RuntimeError` |
| Prefer context managers for scoped resources | Files, locks, transactions |
| Use `finally` for one-off cleanup | Printing a training summary |
| Acquire before `try` | Otherwise a failed acquire triggers a bad release |
| Use `ExitStack` for many or dynamic resources | Opening a runtime list of shards |
| Cleanup is not guaranteed if the process is killed | Neither approach survives `os._exit()` or power loss |

## 6. Quick Revision

| Question | Short answer |
| --- | --- |
| Do both run on exceptions? | Yes, both run cleanup while the exception propagates |
| Main difference? | `finally` is inline code; a context manager is a reusable abstraction |
| Where does context-manager cleanup live? | In `__exit__()` or after the `yield` in `@contextmanager` |
| Why put acquisition before `try`? | So cleanup only runs for a resource that was acquired |
| Is `__exit__()` called if `__enter__()` fails? | No |
| How many times must a `@contextmanager` generator yield? | Exactly once |
| How do you manage a runtime list of resources? | `contextlib.ExitStack` |
| Can `finally` suppress an exception? | Only through control flow like `return`, which is bad practice |
| Can a context manager suppress one? | Yes, by returning a truthy value from `__exit__()` |
| Is cleanup guaranteed if the process is killed? | No |

## 7. Interview-Ready Answer

> Both `try/finally` and context managers run cleanup when a block finishes normally and when an exception propagates, so both are reliable for releasing resources. The difference is structure: `finally` places cleanup code explicitly at one call site, while a context manager packages setup and cleanup into a reusable `with` interface, either as a class with `__enter__()` and `__exit__()` or as a `@contextmanager` generator with `try/finally` around a single `yield`. I prefer an existing context manager for scoped resources like files, locks, and transactions, and use `finally` for one-off cleanup that doesn't need an abstraction. With `finally`, I acquire the resource before the `try`, so a failed acquisition doesn't trigger a bogus release, and for several or dynamically chosen resources I use `ExitStack`. Context managers can also suppress exceptions deliberately through `__exit__()`'s return value, and neither approach can guarantee cleanup if the process is killed or loses power.

---

# Python Interview Question: Memory Management and Garbage Collection

**Difficulty:** 🟡 Intermediate

## Question: How Does Python Manage Memory and Garbage Collection?

**Answer:** Python manages object memory automatically, so you never free objects by hand. CPython, the most widely used implementation, mainly uses **reference counting**: an object can usually be reclaimed as soon as nothing refers to it. A **cyclic garbage collector** backs this up by finding groups of objects that refer only to each other. For resources such as files and connections, use context managers instead of relying on garbage collection.

| Mechanism | What it handles | When it acts |
| --- | --- | --- |
| Reference counting (CPython) | Most objects | As soon as the last reference disappears |
| Cyclic garbage collector (CPython) | Unreachable reference cycles | Periodically, or when you call `gc.collect()` |
| Context managers (`with`) | Files, locks, connections, other external resources | Deterministically, when the `with` block exits |

## 1. CPython Uses Reference Counting and a Cyclic Collector

Every object in CPython keeps a count of how many references point to it. A reference can be a variable name, a list element, a dictionary value, an attribute, or an argument currently being used by a function.

### Reference Counting

```python
first = [1, 2, 3]
second = first
del first    # Removes one reference; second still refers to the list
del second   # The list can now be reclaimed
```

The list is created once. `second = first` adds a reference instead of copying the list. After both names are deleted, nothing refers to the list, and CPython can reclaim it immediately.

### Observing a Reference Count

`sys.getrefcount()` reports the current count in CPython. The exact number includes temporary references, such as the argument passed to `getrefcount()` itself, so do not memorize specific values. Compare the change instead:

```python
import sys

weights = [0.1, 0.2, 0.3]
before = sys.getrefcount(weights)

alias = weights
after = sys.getrefcount(weights)

print(after - before)  # 1
```

Binding another name to the list adds one reference. This function is a CPython implementation detail and should be used only for exploration, not in application logic.

### Seeing When an Object Is Reclaimed

A `__del__` method runs when an object is about to be destroyed. It makes the timing visible in this demo:

```python
class Batch:
    def __init__(self, name):
        self.name = name

    def __del__(self):
        print(f"{self.name} reclaimed")


first = Batch("batch-1")
second = first

del first
print("after del first")
del second
print("after del second")

# after del first
# batch-1 reclaimed
# after del second
```

In CPython, the object is reclaimed as soon as the last reference is removed, so the message appears between the two `print()` calls. Other implementations may run it later.

| Event | Effect on the list's reference count |
| --- | --- |
| `first = [1, 2, 3]` | A new object with one reference |
| `second = first` | One more reference |
| Passing the list to a function | Temporarily one more while the call runs |
| `del first` | One fewer reference |
| Last reference removed | CPython can reclaim the object |

## 2. Why Reference Cycles Need Extra Handling

Objects can refer to each other and form a cycle:

```python
first = []
second = []
first.append(second)
second.append(first)
del first
del second
```

After the `del` statements, no name refers to either list, but each list still refers to the other. Their reference counts never reach zero, so reference counting alone cannot reclaim them. CPython's cyclic garbage collector detects such **unreachable** groups and collects them.

### Watching the Collector Find a Cycle

Lists cannot have weak references, so this example uses a small class. A weak reference lets us check whether an object is still alive without keeping it alive.

```python
import gc
import weakref


class Node:
    def __init__(self, name):
        self.name = name
        self.peer = None


gc.disable()  # Prevent an automatic collection from running during the demo

encoder = Node("encoder")
decoder = Node("decoder")
encoder.peer = decoder
decoder.peer = encoder
probe = weakref.ref(encoder)

del encoder, decoder
print(probe() is None)  # False

found = gc.collect()
print(found > 0)        # True
print(probe() is None)  # True

gc.enable()
```

Before `gc.collect()`, the cycle keeps both nodes alive even though the program can no longer reach them. The collector finds the unreachable cycle and reclaims it. The return value is the number of unreachable objects found; the exact number depends on the Python version and object layout.

### Avoiding Cycles with Weak References

When a child needs a link back to its parent, a weak reference avoids creating a strong cycle:

```python
import weakref


class Pipeline:
    def __init__(self, name):
        self.name = name
        self.steps = []


class Step:
    def __init__(self, pipeline):
        self.pipeline_ref = weakref.ref(pipeline)


pipeline = Pipeline("preprocess")
step = Step(pipeline)
pipeline.steps.append(step)

print(step.pipeline_ref().name)    # preprocess
del pipeline
print(step.pipeline_ref() is None)  # True
```

The step does not keep the pipeline alive. Once the last strong reference is removed, CPython reclaims the pipeline immediately, without waiting for the cyclic collector.

### Notes About the Collector

- CPython's collector only tracks container objects that can take part in cycles, such as lists, dictionaries, and instances of most classes. Integers and strings cannot form cycles on their own.
- It runs automatically based on allocation activity. The details, such as generations and thresholds, have changed between CPython versions, so avoid quoting fixed numbers.
- `gc.collect()` forces a collection. It is occasionally useful in long-running jobs, but it rarely fixes a real leak.
- Since Python 3.4, cycles that contain objects with `__del__` methods can be collected too.

## 3. Removing a Reference Is Not Destroying an Object

`del` removes a name binding (or a container item). It does not destroy the object directly.

```python
features = [0.5, 0.7, 0.9]
cache = {"latest": features}

del features
print(cache["latest"])  # [0.5, 0.7, 0.9]
```

The list survives because the dictionary still refers to it. The object is reclaimed only when its **last** reference disappears.

### Hidden References Keep Objects Alive

In ML code, large objects often stay in memory because something still refers to them:

| Hidden reference | Example |
| --- | --- |
| A cache or global dictionary | `cache["latest"] = features` |
| A list of results kept for logging | `history.append(batch)` |
| An exception traceback | A stored exception keeps the frames and their local variables alive |
| Notebook output history | IPython's `Out` and `_` keep displayed results |
| A closure or bound method | A callback holds a reference to its object |

```python
history = []


def train_step(batch):
    loss = sum(batch) / len(batch)
    history.append(batch)  # Keeps every batch alive
    return loss


for batch in ([1.0, 2.0], [3.0, 4.0]):
    train_step(batch)

print(len(history))  # 2
```

Storing only what you need, such as the loss value instead of the whole batch, lets each batch be reclaimed.

## 4. Reclaimed Memory Is Not Always Returned to the Operating System

When CPython reclaims an object, its memory becomes free for **Python to reuse**. It is not necessarily returned to the operating system right away.

- CPython's small-object allocator (`pymalloc`) manages memory in larger blocks called arenas. An arena can be released only when every object in it is free.
- Some types keep free lists for reuse.
- The C library's allocator may also keep freed memory for later.

As a result, a process's memory use, as shown by Task Manager or `top`, may stay high after a large object is deleted, even though Python can reuse that memory.

### Measuring Python Allocations with `tracemalloc`

`tracemalloc` tracks memory allocated by Python, which is different from the process size reported by the operating system:

```python
import tracemalloc

tracemalloc.start()

features = [float(i) for i in range(200_000)]
with_data, _ = tracemalloc.get_traced_memory()

del features
after_del, peak = tracemalloc.get_traced_memory()
tracemalloc.stop()

print(after_del < with_data)  # True
print(peak >= with_data)      # True
```

The traced memory drops after `del`, because Python freed the objects. The operating system may still report a larger process size. Exact byte counts vary, so the example compares them instead of printing them.

| Measurement | What it tells you |
| --- | --- |
| `tracemalloc` | Memory allocated through Python's allocator, by source line |
| OS process size (RSS) | Total memory held by the process, including memory kept for reuse |
| Library-specific tools | Memory managed by native libraries, such as GPU memory in ML frameworks |

Native libraries manage their own memory. For example, ML frameworks often use caching allocators for GPU memory, so deleting a tensor may not immediately reduce the GPU memory shown by system tools.

## 5. Other Python Implementations Manage Memory Differently

Reference counting and the cyclic collector describe **CPython**. The language itself does not require them.

| Implementation | Memory management approach |
| --- | --- |
| CPython | Reference counting plus a cyclic garbage collector |
| PyPy | A tracing garbage collector; objects are not reclaimed immediately |
| Jython / IronPython | The JVM or .NET garbage collector |

Code that depends on an object being destroyed the moment its last reference disappears is relying on CPython behavior. Portable code uses explicit cleanup instead.

## 6. Follow-Up: Why Use Context Managers Instead of Relying on Garbage Collection?

Garbage collection manages **memory**. Files, sockets, database connections, and locks are external resources that should be released at a predictable time.

```python
with open("data.txt", "w", encoding="utf-8") as file:
    file.write("feature_a,feature_b\n")

with open("data.txt", encoding="utf-8") as file:
    content = file.read()

print(file.closed)      # True
print(content.strip())  # feature_a,feature_b
```

The `with` statement closes the file when the block exits, even if an exception occurs. Without it, the file closes only when the file object is reclaimed, which may be delayed by a cycle, a stored traceback, or a different Python implementation.

### Why `__del__` Is a Poor Cleanup Tool

- Its timing is not guaranteed outside CPython's simple reference-counting case.
- It is not guaranteed to run for objects still alive when the interpreter exits.
- Exceptions raised inside it are ignored, apart from a warning printed to standard error.

**Don't rely on garbage collection to close resources promptly.** Use `with`, `try`/`finally`, or `weakref.finalize()` for cleanup that must happen.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| CPython uses reference counting | An object is reclaimed when its last reference disappears |
| CPython also has a cyclic collector | Two lists that refer to each other are collected by `gc` |
| Cycles need extra handling | Their reference counts never reach zero on their own |
| `del` removes a reference, not the object | A cached list survives `del features` |
| Freed memory may not return to the OS | Process size can stay high after `del` |
| Other implementations differ | PyPy uses a tracing garbage collector |
| Resources need explicit cleanup | `with open(...) as file:` |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| Who frees Python objects? | The runtime, automatically |
| CPython's main mechanism? | Reference counting |
| What does the cyclic collector handle? | Unreachable groups of objects that refer to each other |
| Why can't reference counting free a cycle? | The objects keep each other's counts above zero |
| Does `del x` destroy the object? | No; it removes one reference |
| When is an object reclaimed in CPython? | Usually when its last reference disappears |
| Does freed memory go back to the OS immediately? | Not necessarily; Python may keep it for reuse |
| How can you force a collection? | `gc.collect()` |
| How do you avoid a parent-child cycle? | Use a weak reference for the back link |
| How should files be closed? | With a context manager, not by relying on GC |

## 9. Interview-Ready Answer

> Python manages memory automatically. CPython mainly uses reference counting, so an object can be reclaimed as soon as its last reference disappears. Reference counting cannot free objects that refer to each other in a cycle, so CPython also runs a cyclic garbage collector that finds and reclaims unreachable cycles. `del` only removes a reference; the object survives while anything else, such as a cache or a traceback, still refers to it. Reclaimed memory is often kept by Python for reuse rather than returned to the operating system immediately, and other implementations such as PyPy use different garbage collectors. For files, connections, and locks, I use context managers instead of relying on garbage collection.

---

# Python Interview Question: Shallow Copy vs Deep Copy

**Difficulty:** 🟡 Intermediate

## Question: What Are Shallow Copy and Deep Copy?

**Answer:** A **shallow copy** creates a new outer object but shares references to the nested objects. A **deep copy** recursively copies the nested objects too, as far as each object's copying behavior allows. Plain assignment copies nothing; it only binds another name to the same object.

| Operation | New outer object? | New nested objects? | Typical tool |
| --- | --- | --- | --- |
| Assignment | No | No | `alias = original` |
| Shallow copy | Yes | No, they are shared | `copy.copy()`, `list.copy()`, `lst[:]`, `dict.copy()` |
| Deep copy | Yes | Yes, recursively | `copy.deepcopy()` |

## 1. Assignment, Shallow Copy, and Deep Copy Are Different

### Assignment Does Not Copy

```python
original = [[1, 2], [3, 4]]
alias = original

print(alias is original)  # True

alias.append([5, 6])
print(original)  # [[1, 2], [3, 4], [5, 6]]
```

There is one list with two names. Any change made through `alias` is visible through `original`.

### Shallow Copy Creates a New Container

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)

print(shallow is original)        # False
print(shallow[0] is original[0])  # True
```

The outer list is new, but its elements are the same inner list objects.

### Deep Copy Creates New Nested Objects

```python
import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

print(deep is original)        # False
print(deep[0] is original[0])  # False
print(deep == original)        # True
```

The copy is equal in value, but it shares no mutable parts with the original.

## 2. The Difference Shows Up with Nested Mutable Objects

### Mutating a Nested Object After a Shallow Copy

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)

shallow[0].append(99)
print(original)  # [[1, 2, 99], [3, 4]]
```

The nested list is shared, so changing it affects both structures.

### Replacing an Element After a Shallow Copy

```python
import copy

original = [[1, 2], [3, 4]]
shallow = copy.copy(original)

shallow[0] = ["replaced"]
print(original)  # [[1, 2], [3, 4]]
print(shallow)   # [['replaced'], [3, 4]]
```

Replacing an element changes only the new outer list. Only **mutating** a shared nested object leaks into the original.

### Mutating a Nested Object After a Deep Copy

```python
import copy

original = [[1, 2], [3, 4]]
deep = copy.deepcopy(original)

deep[0].append(99)
print(original)  # [[1, 2], [3, 4]]
print(deep)      # [[1, 2, 99], [3, 4]]
```

### ML Example: Copying a Training Config

Experiment configs are often nested dictionaries. A shallow copy can silently change the base config:

```python
import copy

base_config = {"model": "resnet", "optimizer": {"name": "adam", "lr": 0.001}}

shallow_run = base_config.copy()
shallow_run["optimizer"]["lr"] = 0.01
print(base_config["optimizer"]["lr"])  # 0.01

base_config["optimizer"]["lr"] = 0.001
deep_run = copy.deepcopy(base_config)
deep_run["optimizer"]["lr"] = 0.1
print(base_config["optimizer"]["lr"])  # 0.001
```

| Change after copying | Shallow copy | Deep copy |
| --- | --- | --- |
| Append to a nested list | Visible in the original | Not visible |
| Replace a top-level element | Not visible | Not visible |
| Change a nested dict value | Visible in the original | Not visible |
| Add a top-level key | Not visible | Not visible |

If the nested values are all immutable, such as numbers, strings, or tuples of them, a shallow copy is enough, because nothing shared can be changed.

## 3. Common Ways to Make Shallow Copies

`list.copy()`, list slicing (`lst[:]`), and `dict.copy()` all make shallow copies. So do the type constructors and unpacking syntax:

```python
row = [1, 2]
matrix = [row, [3, 4]]

copies = [
    matrix.copy(),
    matrix[:],
    list(matrix),
    [*matrix],
]

for item in copies:
    print(item is matrix, item[0] is row)
# False True
# False True
# False True
# False True
```

```python
inner = {"lr": 0.001}
params = {"optimizer": inner}

for item in (params.copy(), dict(params), {**params}):
    print(item is params, item["optimizer"] is inner)
# False True
# False True
# False True
```

| Shallow copy method | Works for |
| --- | --- |
| `copy.copy(obj)` | Most objects, including custom classes |
| `lst.copy()`, `lst[:]`, `list(lst)` | Lists |
| `d.copy()`, `dict(d)`, `{**d}` | Dictionaries |
| `s.copy()`, `set(s)` | Sets |

### Copying Immutable Objects

Copying an immutable object is unnecessary, so `copy.copy()` may return the same object:

```python
import copy

shape = (3, 224, 224)
print(copy.copy(shape) is shape)  # True
```

Whether the same object is returned is an implementation detail. The important point is that you cannot observe a difference, because the tuple cannot change.

## 4. Deep Copying Has Costs and Limits

### Time and Memory

`deepcopy()` visits every reachable object and creates new copies of the mutable ones. For large structures, such as a dataset held as nested lists, this can take a lot of time and double the memory use. Copy only what you need to change, or rebuild a new structure from the original.

### Shared References and Cycles Are Preserved

`deepcopy()` keeps a memo dictionary of objects it has already copied. This preserves sharing inside the copied structure and prevents infinite recursion on cycles:

```python
import copy

shared = [1, 2]
data = [shared, shared]
deep = copy.deepcopy(data)

print(deep[0] is deep[1])  # True
print(deep[0] is shared)   # False

loop = []
loop.append(loop)
loop_copy = copy.deepcopy(loop)
print(loop_copy[0] is loop_copy)  # True
```

### Some Objects Should Not Be Deep-Copied

Objects that hold external resources or synchronization state, such as locks, open files, sockets, and database connections, cannot be copied meaningfully:

```python
import copy
import threading

state = {"counter": 0, "lock": threading.Lock()}

try:
    copy.deepcopy(state)
except TypeError as error:
    print(f"TypeError: {error}")
# TypeError: cannot pickle '_thread.lock' object
```

### Customizing Copy Behavior

A class can define `__copy__` or `__deepcopy__` to control what is copied. This example copies the config but shares a client that should not be duplicated:

```python
import copy


class Experiment:
    def __init__(self, config, client):
        self.config = config
        self.client = client

    def __deepcopy__(self, memo):
        return Experiment(copy.deepcopy(self.config, memo), self.client)


client = object()  # Stands in for a database or API client
first = Experiment({"layers": [64, 32]}, client)
second = copy.deepcopy(first)

second.config["layers"].append(16)
print(first.config["layers"])     # [64, 32]
print(second.client is client)    # True
```

### NumPy and DataFrames

Array libraries have their own copy rules. In NumPy, slicing usually returns a **view** that shares data, while `array.copy()` creates an independent copy of the data. In pandas, `DataFrame.copy()` is deep by default for its data. Check the library's documentation rather than assuming the list rules apply.

## 5. Follow-Up: The `[[0] * 3] * 3` Pitfall

Multiplying a list of lists repeats the **references**, not the inner lists:

```python
grid = [[0] * 3] * 3
grid[0][0] = 1

print(grid)                # [[1, 0, 0], [1, 0, 0], [1, 0, 0]]
print(grid[0] is grid[1])  # True
```

All three rows are the same list. Use a comprehension to create a separate list for each row:

```python
grid = [[0] * 3 for _ in range(3)]
grid[0][0] = 1

print(grid)  # [[1, 0, 0], [0, 0, 0], [0, 0, 0]]
```

The same problem appears with `dict.fromkeys(keys, [])`, which gives every key the same list:

```python
metrics = dict.fromkeys(["train", "valid"], [])
metrics["train"].append(0.9)
print(metrics)  # {'train': [0.9], 'valid': [0.9]}

metrics = {name: [] for name in ["train", "valid"]}
metrics["train"].append(0.9)
print(metrics)  # {'train': [0.9], 'valid': []}
```

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Assignment does not copy | `alias is original` is `True` |
| A shallow copy creates a new outer object | `shallow is original` is `False` |
| A shallow copy shares nested objects | `shallow[0] is original[0]` is `True` |
| A deep copy copies nested objects | Appending to `deep[0]` leaves `original` unchanged |
| Common shallow copy methods | `list.copy()`, `lst[:]`, `dict.copy()` |
| Deep copying has costs | Time and memory grow with the structure size |
| Not every object should be deep-copied | Locks, files, and connections |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| Does `b = a` copy a list? | No; both names refer to the same list |
| What does a shallow copy share? | The nested objects |
| What does a deep copy share? | No mutable objects with the original |
| Is `lst[:]` shallow or deep? | Shallow |
| Is `dict.copy()` shallow or deep? | Shallow |
| When is a shallow copy enough? | When nested values are immutable or will not be mutated |
| How does `deepcopy()` handle cycles? | It uses a memo dictionary of already copied objects |
| Why not always use `deepcopy()`? | It costs time and memory and fails for some objects |
| How do you customize copying? | Define `__copy__` or `__deepcopy__` |
| What is wrong with `[[0] * 3] * 3`? | All rows are the same list |

## 8. Interview-Ready Answer

> Assignment does not copy anything; it just binds another name to the same object. A shallow copy, made with `copy.copy()`, `list.copy()`, slicing, or `dict.copy()`, creates a new outer container but shares the nested objects, so mutating a nested list shows up in both. A deep copy, made with `copy.deepcopy()`, recursively copies nested objects, so the copy is fully independent, and it uses a memo to preserve shared references and handle cycles. I use a deep copy for nested configs or structures I plan to mutate, and a shallow copy when the nested values are immutable. Deep copying costs time and memory for large structures, and objects such as locks, files, or connections should not be deep-copied, so classes can customize this with `__deepcopy__`.

---

# Python Interview Question: The Global Interpreter Lock (GIL)

**Difficulty:** 🟡 Intermediate

## Question: What Is the GIL, and Why Does It Matter?

**Answer:** The **Global Interpreter Lock (GIL)** is a lock in GIL-enabled CPython that lets only one thread at a time run Python bytecode within an interpreter. It simplifies parts of CPython's object and memory management. As a result, CPU-heavy loops written in Python usually do not run in parallel across cores when you add threads. Threads still help with I/O-bound work and with native code that releases the GIL, and optional free-threaded CPython builds can remove the GIL altogether.

| Workload in GIL-enabled CPython | Do threads give a speedup? | Why |
| --- | --- | --- |
| Pure-Python CPU loops | Usually no | Only one thread runs Python bytecode at a time |
| Blocking I/O (network, disk, `sleep`) | Often yes | The GIL is released while waiting |
| Native computation that releases the GIL | Often yes | The C code runs outside the GIL |
| CPU-bound Python split across processes | Yes, if the tasks are large enough | Each process has its own interpreter and GIL |

## 1. What the GIL Is

GIL stands for **Global Interpreter Lock**. A thread must hold it to execute Python bytecode or to touch Python objects through the C API. The interpreter switches the GIL between threads periodically and whenever a thread blocks in an operation that releases it.

### Why CPython Has a GIL

CPython uses reference counting for memory management. Every assignment, function call, and container operation changes reference counts. Without a lock, two threads could update the same count at once and corrupt it, causing leaks or crashes.

A single global lock:

- Makes reference counting and many internal structures safe without fine-grained locks.
- Keeps single-threaded code fast, because it avoids locking overhead on every object.
- Made C extensions easier to write, because they could assume the GIL protects their Python object access.

The cost is that threads cannot execute Python bytecode in parallel within one interpreter.

### The GIL Is Specific to Some Implementations

The GIL is a property of **GIL-enabled CPython**, not of the Python language. Jython and IronPython have no GIL, PyPy has its own GIL, and CPython itself offers optional free-threaded builds (see section 5).

## 2. Effect on CPU-Bound Python Threads

### Example: CPU-Heavy Work Submitted to Threads

```python
from concurrent.futures import ThreadPoolExecutor


def sum_squares(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(sum_squares, [100_000, 100_000]))

    print(results[0] == results[1])  # True
```

This works, but two threads don't make it twice as fast. In GIL-enabled CPython this Python computation is still limited by the GIL, and thread scheduling adds overhead. If you time it, you will usually find it about as fast as running the two calls one after the other, and sometimes slower.

### The Usual Fix: Processes

Each process has its own interpreter and its own GIL, so CPU-bound Python work can run on several cores:

```python
from concurrent.futures import ProcessPoolExecutor


def sum_squares(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(sum_squares, [100_000, 100_000]))

    print(results[0] == results[1])  # True
```

Save this as a `.py` file to run it, especially on Windows. Processes have startup, serialization, and memory costs, so they pay off only for substantial tasks.

| Option for CPU-bound Python | Parallel across cores? | Main cost |
| --- | --- | --- |
| Threads (GIL-enabled CPython) | No, for Python bytecode | Thread switching overhead |
| Processes | Yes | Startup, pickling inputs and results, memory |
| Vectorized or compiled code | Often, inside the library | Rewriting the loop |
| Free-threaded CPython | Yes | Extension compatibility, single-thread overhead |

## 3. I/O Waits and Native Libraries Release the GIL

The GIL limits **running Python bytecode**, not waiting. Many blocking operations, such as reading a socket, reading a file, or `time.sleep()`, release the GIL while they wait, so other threads can run.

```python
from concurrent.futures import ThreadPoolExecutor
from time import sleep


def download_shard(shard_id):
    sleep(0.1)  # Simulates a blocking network wait; the GIL is released
    return f"shard-{shard_id}"


if __name__ == "__main__":
    with ThreadPoolExecutor(max_workers=4) as executor:
        shards = list(executor.map(download_shard, range(4)))

    print(shards)  # ['shard-0', 'shard-1', 'shard-2', 'shard-3']
```

The four waits overlap, so the whole run takes roughly as long as one wait instead of four.

### Native Extensions

Native extensions (for example, NumPy) can release the GIL while they compute in C. Large matrix multiplications, many NumPy operations on big arrays, compression libraries, and much of the work inside ML frameworks run outside the GIL. Threads calling such operations can use several cores. Whether a particular function releases the GIL depends on the library, so benchmark it.

| Activity | Holds the GIL? |
| --- | --- |
| A Python `for` loop doing arithmetic | Yes |
| Waiting in `socket.recv()` or `time.sleep()` | No, during the wait |
| Reading a large file | Usually not during the system call |
| A large NumPy matrix multiplication | Usually not during the computation |
| Converting results back into Python objects | Yes |

## 4. The GIL Is Not a Substitute for a Lock

The GIL makes individual bytecode instructions safe for the interpreter, but it does not make **your** multi-step operations atomic. A thread can be switched out between steps.

`counter += 1` reads the value, adds one, and stores the result. Two threads can read the same old value, and one update is lost. Whether you see lost updates in a small test depends on timing and on the Python version, which makes such bugs hard to reproduce. Protect shared multi-step operations explicitly:

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

The lock guarantees that only one thread performs the read-modify-write at a time.

### Safer Alternatives to Shared State

```python
from queue import Queue
from threading import Thread

results = Queue()


def score_batch(batch_id):
    results.put((batch_id, batch_id * 0.1))


if __name__ == "__main__":
    threads = [Thread(target=score_batch, args=(i,)) for i in range(3)]
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()

    print(sorted(results.get() for _ in range(3)))
    # [(0, 0.0), (1, 0.1), (2, 0.2)]
```

`queue.Queue` is thread-safe, so workers can hand results back without a manual lock. Returning values from `executor.map()` or futures avoids shared state entirely.

## 5. Free-Threaded CPython

Since Python 3.13, CPython offers optional free-threaded builds (experimental in 3.13, officially supported from 3.14). With the GIL disabled, threads can run Python code in parallel.

- The free-threaded build is a separate build, often installed as `python3.13t` or `python3.14t`. The standard build still has the GIL.
- Extension compatibility matters, because importing an extension that doesn't support it may turn the GIL back on.
- Single-threaded code may run somewhat slower on a free-threaded build.
- Shared state still needs synchronization. Removing the GIL makes races more likely, not less.

You can check which kind of build you are running:

```python
import sys
import sysconfig

free_threaded_build = bool(sysconfig.get_config_var("Py_GIL_DISABLED"))
is_gil_enabled = getattr(sys, "_is_gil_enabled", None)
gil_enabled = is_gil_enabled() if is_gil_enabled else True

print(free_threaded_build)  # False  (on a standard build)
print(gil_enabled)          # True   (on a standard build)
```

`sys._is_gil_enabled()` exists from Python 3.13. On older versions the GIL is always enabled, so the example falls back to `True`.

Other related work includes multiple interpreters in one process, each with its own GIL (a C-API feature since 3.12, with a standard-library module added in 3.14).

Source: [Python support for free threading](https://docs.python.org/3/howto/free-threading-python.html)

## 6. Follow-Up: Why Not Just Remove the GIL?

Removing the GIL is hard because:

- Reference counting and internal structures need another way to stay thread-safe, which can slow single-threaded code.
- Many C extensions were written assuming the GIL protects them.
- Existing Python code may contain races that the GIL's scheduling happened to hide.

Free-threaded CPython addresses these with techniques such as biased reference counting and per-object locks, and by letting extensions declare whether they support running without the GIL. That is why it was introduced as an optional build rather than a sudden change.

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| GIL means Global Interpreter Lock | One thread runs Python bytecode at a time per interpreter |
| CPU-bound Python threads don't scale | Two threads running `sum_squares` aren't twice as fast |
| I/O waits release the GIL | Threads overlap network or disk waits |
| Native code can release the GIL | Large NumPy operations can run in parallel threads |
| The GIL doesn't replace locks | `counter += 1` still needs a `Lock` |
| Not every runtime has a GIL | Free-threaded CPython, Jython, IronPython |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What does GIL stand for? | Global Interpreter Lock |
| What does it allow? | Only one thread at a time to run Python bytecode in an interpreter |
| Why does CPython have it? | To protect reference counting and internals simply and cheaply |
| Do threads speed up pure-Python CPU work? | Usually not, in GIL-enabled CPython |
| Do threads help with I/O-bound work? | Yes; waits release the GIL |
| Can NumPy benefit from threads? | Often, when its operations release the GIL |
| How do you parallelize CPU-bound Python? | Processes, vectorized or compiled code, or free-threaded CPython |
| Is `counter += 1` thread-safe? | No; protect it with a lock |
| Is free-threaded CPython the default? | No; it is an optional separate build |
| Does every Python runtime have a GIL? | No |

## 9. Interview-Ready Answer

> The GIL, or Global Interpreter Lock, is a lock in GIL-enabled CPython that lets only one thread at a time execute Python bytecode within an interpreter, which keeps reference counting and other internals simple and fast. Because of it, CPU-heavy pure-Python loops don't get faster with threads; for those I use processes, vectorized NumPy code, or compiled extensions. Threads still help for I/O-bound work, because blocking I/O releases the GIL, and for native library operations that release it during computation. The GIL is not a replacement for application-level locks, since multi-step operations such as `counter += 1` can still race. Finally, the GIL is not universal: CPython has optional free-threaded builds, experimental in 3.13 and officially supported from 3.14, where threads can run Python code in parallel if the extensions you use support it.

---

# Python Interview Question: Threading vs Multiprocessing vs Asyncio

**Difficulty:** 🟡 Intermediate

## Question: When Should You Use Threading, Multiprocessing, or Asyncio?

**Answer:** First work out what makes the workload slow (CPU or waiting on I/O), then choose. Use **threading** to overlap blocking I/O with synchronous libraries, **multiprocessing** for substantial CPU-bound Python work that must use several cores, and **asyncio** for many concurrent I/O operations with async-compatible libraries. Every option has overhead, so measure before and after. The examples assume ordinary GIL-enabled CPython.

| Approach | Suitable work | Main advantage | Main trade-off |
| --- | --- | --- | --- |
| Threading | Blocking I/O with synchronous libraries | Overlaps waiting, simple to integrate | Shared-state races; the GIL limits pure-Python CPU parallelism |
| Multiprocessing | Independent, substantial CPU-bound Python tasks | Uses multiple CPU cores despite the GIL | Process startup, serialization, communication, and memory costs |
| Asyncio | Many concurrent I/O operations with async-compatible libraries | Coordinates many waiting operations with cooperative tasks | Blocking code stalls the event loop |

## 1. Identify Whether the Work Is CPU-Bound or I/O-Bound

The right tool depends on where the time goes:

| Symptom | Likely bottleneck | First choice |
| --- | --- | --- |
| CPU near 100% on one core, Python loops in the profile | CPU-bound Python | Vectorize, or use processes |
| CPU mostly idle, time spent waiting on network or disk | I/O-bound | Threads or asyncio |
| Thousands of simultaneous connections | I/O-bound at high scale | Asyncio |
| Heavy NumPy or framework calls | Native computation | Benchmark threads; the library may already use several cores |

Profile with `cProfile` or a sampling profiler, and compare wall-clock time with CPU time. If wall-clock time is much larger than CPU time, the program is mostly waiting.

```python
import time

wall_start = time.perf_counter()
cpu_start = time.process_time()

time.sleep(0.1)                     # Waiting: uses wall time, almost no CPU
sum(i * i for i in range(200_000))  # Computing: uses CPU time

wall = time.perf_counter() - wall_start
cpu = time.process_time() - cpu_start
print(wall > cpu)  # True
```

The sleep adds wall-clock time but almost no CPU time, which is the signature of I/O-bound work.

## 2. Threading: Shared Memory for Blocking I/O

Threads run inside one process and share its memory. In GIL-enabled CPython, only one thread runs Python bytecode at a time, but blocking I/O releases the GIL, so waits overlap.

### Threading: Overlap Simulated Blocking I/O

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

The three waits overlap, so the total time is close to one wait. `executor.map()` returns results in input order, even if the tasks finish in a different order.

### When Threads Fit

- You use synchronous libraries such as `requests`, a database driver, or a cloud storage SDK.
- You need a modest number of concurrent operations, typically tens rather than thousands.
- You call native code that releases the GIL.

### Shared Memory Is a Benefit and a Risk

Threads can read the same objects without copying, but concurrent updates need a `Lock`, a `queue.Queue`, or returned results instead of shared mutation.

## 3. Multiprocessing: Separate Processes for CPU-Bound Work

Each process has its own interpreter, memory, and GIL, so CPU-bound Python work can run on several cores.

### Multiprocessing: Independent CPU Calculations

```python
from concurrent.futures import ProcessPoolExecutor


def sum_squares(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(sum_squares, [100_000, 200_000]))

    print(len(results))  # 2
```

Keep worker functions at module level and use the `__main__` guard. Inputs and results must be serializable (picklable) for the process pool. Small tasks may run slower, because the overhead outweighs the work. Save process-pool examples as `.py` scripts; interactive environments, especially on Windows, may not support them as written.

### Processes Do Not Share Memory

```python
from concurrent.futures import ProcessPoolExecutor

seen = []


def record(value):
    seen.append(value)  # Changes the worker's copy of the list
    return len(seen)


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=1) as executor:
        print(list(executor.map(record, [1, 2, 3])))  # [1, 2, 3]

    print(seen)  # []
```

The worker appended to its own `seen` list. The parent's list is unchanged. Results must be returned or sent through a queue, pipe, or shared-memory object.

### Worker Functions Must Be Picklable

```python
from concurrent.futures import ProcessPoolExecutor

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=1) as executor:
        try:
            list(executor.map(lambda value: value * 2, [1, 2]))
        except Exception as error:
            print(type(error).__name__)  # PicklingError
```

A lambda cannot be pickled, so it cannot be sent to a worker. Define a named function at module level instead.

## 4. Asyncio: Cooperative Concurrency for Many I/O Operations

Asyncio runs coroutines on one event-loop thread. A coroutine pauses at `await` when it has to wait, and the loop runs another ready task.

### Asyncio: Overlap Simulated Asynchronous I/O

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

`asyncio.gather()` returns results in the order the awaitables were passed.

### Limit Concurrency and Set Timeouts

In real services, limit how many requests are in flight, set timeouts, and respect the capacity of the API or database. Too much concurrency can overload the services you depend on.

```python
import asyncio


async def call_model_api(prompt, limit):
    async with limit:              # At most N calls run at once
        await asyncio.sleep(0.01)  # Simulates the network call
        return f"answer to {prompt}"


async def main():
    limit = asyncio.Semaphore(2)
    prompts = ["p1", "p2", "p3", "p4"]
    answers = await asyncio.gather(*(call_model_api(p, limit) for p in prompts))
    print(answers[-1])  # answer to p4

    try:
        await asyncio.wait_for(asyncio.sleep(1), timeout=0.05)
    except TimeoutError:
        print("request timed out")  # request timed out


if __name__ == "__main__":
    asyncio.run(main())
```

The semaphore keeps at most two calls in flight. Since Python 3.11, `asyncio.wait_for()` raises the built-in `TimeoutError`; older versions raise `asyncio.TimeoutError`.

### When Asyncio Fits

- Your libraries are async-compatible, such as `aiohttp`, `httpx`, or async database drivers.
- You handle many simultaneous connections, such as a web service or a crawler.
- You can keep blocking calls and heavy computation off the event loop.

A single blocking call, such as `time.sleep()` or a synchronous HTTP request, stalls every task on the loop.

## 5. Account for Overhead, Memory, Serialization, and Library Behavior

| Cost | Threads | Processes | Asyncio |
| --- | --- | --- | --- |
| Startup | Low | High (a new interpreter per worker) | Very low per task |
| Memory per worker | Small | Large (separate interpreter and data) | Very small per task |
| Data transfer | None; memory is shared | Pickling inputs and results | None; same thread |
| Main risk | Races on shared state | Serialization and memory blow-up | Blocking the event loop |
| CPU parallelism for Python code | No, in GIL-enabled CPython | Yes | No |

**ML nuance:** threads can work well for CPU-heavy native operations that release the GIL. Check how the library behaves and benchmark before switching to processes.

Other ML-specific points:

- Sending a large DataFrame or array to every worker can cost more than the computation. Send file paths or partition indices and let workers load their own data.
- Libraries such as NumPy, PyTorch, and scikit-learn may already use several threads internally. Adding many processes on top can oversubscribe the CPU.
- Data loaders in ML frameworks often provide their own worker processes. Use those settings instead of building a separate pool.

## 6. Follow-Up: Can You Combine Them?

Yes. Asyncio can hand blocking or CPU-heavy work to threads or processes without blocking the event loop:

```python
import asyncio
import time
from concurrent.futures import ProcessPoolExecutor


def blocking_read(path):
    time.sleep(0.05)  # Simulates a synchronous library call
    return f"read {path}"


def compute_features(size):
    return sum(i * i for i in range(size))


async def main():
    text = await asyncio.to_thread(blocking_read, "batch.csv")
    print(text)  # read batch.csv

    loop = asyncio.get_running_loop()
    with ProcessPoolExecutor(max_workers=2) as pool:
        total = await loop.run_in_executor(pool, compute_features, 1_000)
    print(total)  # 332833500


if __name__ == "__main__":
    asyncio.run(main())
```

| Combination | Use it for |
| --- | --- |
| `asyncio.to_thread()` | A blocking synchronous call inside async code |
| `loop.run_in_executor(process_pool, ...)` | CPU-heavy Python work inside async code |
| Threads inside a process pool | Rarely; it complicates resource control |

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Diagnose the bottleneck first | Compare wall time with CPU time, profile |
| Threads share memory | Results can be shared, but updates need locks |
| Processes have separate memory | A worker's changes to a global aren't visible in the parent |
| Processes need picklable work | Module-level functions, no lambdas |
| Asyncio is cooperative | Tasks switch only at `await` points |
| Blocking calls stall asyncio | `time.sleep()` freezes all tasks |
| Overhead and library behavior matter | Small tasks may be slower with processes |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| Best fit for blocking I/O with `requests`? | Threading |
| Best fit for pure-Python CPU work? | Multiprocessing, or vectorize it |
| Best fit for thousands of network calls? | Asyncio with async libraries |
| Do threads share memory? | Yes |
| Do processes share memory? | No, not by default |
| Why must process-pool functions be module-level? | They must be picklable and importable |
| Why might a process pool be slower? | Startup and serialization costs outweigh small tasks |
| What stalls an event loop? | Any blocking call or heavy computation on the loop thread |
| How do you limit concurrent async requests? | `asyncio.Semaphore` |
| How do you run a blocking call from async code? | `asyncio.to_thread()` |

## 9. Interview-Ready Answer

> I start by checking whether the work is CPU-bound or I/O-bound, for example by profiling and comparing wall time with CPU time. For blocking I/O with synchronous libraries, I use a thread pool, because waits release the GIL and threads are easy to integrate, but I protect any shared state. For substantial CPU-bound Python work, I use a process pool, since each process has its own interpreter and GIL, keeping in mind the startup, pickling, and memory costs. For many concurrent network operations with async-compatible libraries, I use asyncio with a semaphore and timeouts, and I keep blocking calls off the event loop with `asyncio.to_thread()`. In ML code I also check whether the library already releases the GIL or uses its own threads, and I benchmark before committing to an approach.

---

# Python Interview Question: How `async` and `await` Work

**Difficulty:** 🟡 Intermediate

## Question: How Do `async` and `await` Work in Python?

**Answer:** `async def` defines a coroutine function, and calling it creates a coroutine object. `await` runs or waits for an awaitable. When the wait needs to pause, the event loop can run another ready task. An awaitable that finishes immediately may not give up control. `asyncio.run()` runs a top-level coroutine in an event loop it manages, and tasks schedule coroutines so they make progress concurrently.

| Term | Meaning |
| --- | --- |
| Coroutine function | A function defined with `async def` |
| Coroutine object | What calling a coroutine function returns; it has not run yet |
| Awaitable | Something you can `await`: a coroutine, a `Task`, a `Future`, or an object with `__await__` |
| Event loop | The scheduler that runs tasks and resumes them when their waits complete |
| Task | A coroutine wrapped and scheduled to run on the event loop |

## 1. Coroutine Functions, Coroutine Objects, and the Event Loop

### Defining and Running a Coroutine

```python
import asyncio


async def load_config():
    await asyncio.sleep(0.01)  # Simulates reading from a remote store
    return {"model": "bert", "batch_size": 32}


config = asyncio.run(load_config())
print(config["batch_size"])  # 32
```

`asyncio.run()` creates an event loop, runs the coroutine until it finishes, returns its result, and closes the loop. A program usually calls it once, at the top level.

### What the Event Loop Does

The event loop keeps a queue of tasks that are ready to run. It runs one task until that task reaches an `await` that has to wait. The task is then suspended, and the loop runs the next ready task. When the awaited operation completes, such as a timer firing or data arriving on a socket, the loop marks the suspended task as ready again.

| Step | What happens |
| --- | --- |
| 1 | The loop runs a task's code |
| 2 | The task reaches `await` on something that must wait |
| 3 | The task is suspended, and its state is saved |
| 4 | The loop runs other ready tasks |
| 5 | The awaited operation completes |
| 6 | The loop resumes the task right after its `await` |

Everything happens on one thread. Tasks switch only at `await` points, which is why this is called **cooperative** concurrency.

## 2. Creating a Coroutine Is Not Running It

Calling a coroutine function only creates a coroutine object. Its body does not run until it is awaited or scheduled as a task.

```python
import asyncio


async def fetch_score():
    print("fetching")
    return 0.93


coro = fetch_score()            # Nothing is printed yet
print(type(coro).__name__)      # coroutine
coro.close()                    # Discard it without running it

print(asyncio.run(fetch_score()))
# fetching
# 0.93
```

If a coroutine object is never awaited, Python emits a `RuntimeWarning: coroutine ... was never awaited` when it is garbage-collected. That warning usually means a missing `await`.

### Three Ways to Make a Coroutine Run

| Way | Effect |
| --- | --- |
| `await coro` | Runs it inside the current coroutine and waits for its result |
| `asyncio.create_task(coro)` | Schedules it to run concurrently; you can await the task later |
| `asyncio.run(coro)` | Starts an event loop and runs it as the top-level entry point |

`create_task()` schedules the coroutine, but it starts running only when the current task yields control to the loop. Keep a reference to the task, and await it, so it is not lost and its exceptions are not silently dropped.

## 3. Coroutines Pause Cooperatively at Awaitables That Must Wait

```python
import asyncio


async def worker(name, delay):
    print(f"{name}: start")
    await asyncio.sleep(delay)
    print(f"{name}: end")


async def main():
    await asyncio.gather(worker("A", 0.05), worker("B", 0.01))


asyncio.run(main())
# A: start
# B: start
# B: end
# A: end
```

`A` starts, pauses at its sleep, and lets `B` start. `B`'s shorter wait ends first, so it finishes first.

### An Awaitable That Finishes Immediately May Not Yield

```python
import asyncio


async def cached_lookup():
    return "cached"  # No await inside, so it never suspends


async def other():
    print("other task ran")


async def main():
    task = asyncio.create_task(other())
    result = await cached_lookup()  # The scheduled task has not run yet
    print(result)
    await task


asyncio.run(main())
# cached
# other task ran
```

Awaiting `cached_lookup()` completed without suspending, so the loop never got a chance to run `other()` until `await task`. `await asyncio.sleep(0)` is the explicit way to yield control once:

```python
import asyncio


async def other():
    print("other task ran")


async def main():
    task = asyncio.create_task(other())
    await asyncio.sleep(0)  # Yield to the event loop
    print("main resumed")
    await task


asyncio.run(main())
# other task ran
# main resumed
```

## 4. Sequential Awaits vs Concurrent Tasks

Awaiting one operation after another does not run independent work concurrently.

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

The results are the same, but the sequential version takes about two waits, while the concurrent version takes about one.

### `TaskGroup` for Structured Concurrency (Python 3.11+)

```python
import asyncio


async def fetch_score(name):
    await asyncio.sleep(0.05)
    return f"{name}: ready"


async def main():
    async with asyncio.TaskGroup() as group:
        first = group.create_task(fetch_score("model-a"))
        second = group.create_task(fetch_score("model-b"))

    print(first.result(), "|", second.result())
    # model-a: ready | model-b: ready


asyncio.run(main())
```

The `async with` block waits for every task in the group. If one task fails, the group cancels the others and raises the error, which avoids forgotten background tasks.

| Pattern | Runs independent work concurrently? |
| --- | --- |
| `await a(); await b()` | No |
| `await asyncio.gather(a(), b())` | Yes |
| `create_task(a())`, `create_task(b())`, then await both | Yes |
| `async with asyncio.TaskGroup()` | Yes, with structured error handling |

## 5. Keep Blocking Operations Off the Event-Loop Thread

Adding `async` to a function doesn't make ordinary blocking work asynchronous. A blocking call holds the only event-loop thread, so no other task can run:

```python
import asyncio
import time


async def heartbeat():
    print("heartbeat")


async def main():
    task = asyncio.create_task(heartbeat())
    time.sleep(0.05)  # Blocks the loop; the heartbeat cannot run yet
    print("blocking call finished")
    await task


asyncio.run(main())
# blocking call finished
# heartbeat
```

### Offloading a Synchronous Blocking Operation

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

`asyncio.to_thread()` runs the function in a worker thread, so the event loop keeps serving other tasks while it waits.

In GIL-enabled CPython, moving CPU-heavy Python loops to a thread generally doesn't give you CPU parallelism. Use a process pool or optimized computation where it fits.

| Blocking operation | Async-friendly alternative |
| --- | --- |
| `time.sleep()` | `await asyncio.sleep()` |
| `requests.get()` | An async client such as `aiohttp` or `httpx.AsyncClient`, or `asyncio.to_thread()` |
| A synchronous database driver | An async driver, or `asyncio.to_thread()` |
| Heavy CPU work, such as feature extraction | `loop.run_in_executor()` with a process pool |

## 6. Follow-Up: Common Mistakes

- Calling a coroutine without awaiting or scheduling it.
- Using `time.sleep()` on the event-loop thread.
- Calling `asyncio.run()` from inside an event loop that's already running. In a notebook that supports top-level `await`, use `await main()` instead.
- Creating tasks without keeping a reference or awaiting them, which can lose results and exceptions.
- Expecting `async` alone to make CPU-bound code faster.

```python
import asyncio


async def inner():
    return 1


async def main():
    coro = inner()
    try:
        asyncio.run(coro)
    except RuntimeError as error:
        print(error)
    finally:
        coro.close()


asyncio.run(main())
# asyncio.run() cannot be called from a running event loop
```

Inside a running loop, use `await inner()` instead.

Source: [Coroutines and tasks](https://docs.python.org/3/library/asyncio-task.html)

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| `async def` creates a coroutine function | Calling it returns a coroutine object |
| Creating is not running | The body runs only when awaited or scheduled |
| The event loop schedules tasks | `asyncio.run()`, `create_task()` |
| Coroutines pause cooperatively | Switching happens only at an `await` that must wait |
| Sequential awaits don't overlap | Use `gather()`, tasks, or `TaskGroup` |
| Blocking calls stall the loop | Use `asyncio.sleep()` or `asyncio.to_thread()` |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| What does `async def` define? | A coroutine function |
| What does calling it return? | A coroutine object that hasn't run yet |
| What can you `await`? | Coroutines, tasks, futures, and objects with `__await__` |
| What does `asyncio.run()` do? | Creates a loop, runs the top-level coroutine, closes the loop |
| How do you run two coroutines concurrently? | `asyncio.gather()`, `create_task()`, or `TaskGroup` |
| Does every `await` give up control? | No; only one that actually has to wait |
| How do you yield control explicitly? | `await asyncio.sleep(0)` |
| What happens if you call `time.sleep()` in a coroutine? | The whole event loop is blocked |
| How do you call blocking code from async code? | `await asyncio.to_thread(func)` |
| Why can't you call `asyncio.run()` in a notebook? | A loop is already running; use `await main()` |

## 9. Interview-Ready Answer

> `async def` defines a coroutine function; calling it just creates a coroutine object, which runs only when it is awaited or scheduled as a task. An event loop, usually started with `asyncio.run()`, runs tasks on a single thread and switches between them only at `await` points that actually have to wait, so concurrency is cooperative. Awaiting coroutines one after another runs them sequentially, so for independent I/O I use `asyncio.gather()`, `create_task()`, or a `TaskGroup`. Because there is only one loop thread, a blocking call such as `time.sleep()` or a synchronous HTTP request stalls every task, so I use async libraries or offload the call with `asyncio.to_thread()`. CPU-heavy work belongs in a process pool or optimized code, because async does not make computation faster.

---

# Python Interview Question: Concurrency vs Parallelism

**Difficulty:** 🟢 Beginner

## Question: What Is the Difference Between Concurrency and Parallelism?

**Answer:** **Concurrency** means several tasks make progress during overlapping time periods. They may take turns, especially while one is waiting for I/O. **Parallelism** means several tasks run at the same instant on different execution resources, such as CPU cores. Concurrency is about structuring and managing overlapping work; parallelism is about executing work simultaneously.

| Aspect | Concurrency | Parallelism |
| --- | --- | --- |
| Main idea | Coordinate overlapping work | Run work simultaneously |
| Needs multiple CPU cores? | No | Yes, for CPU parallelism |
| Example | Several network requests waiting for responses | Separate processes computing features on different cores |
| Typical benefit | Better use of waiting time, responsiveness | Higher computational throughput |

## 1. Overlapping Task Lifetimes vs Simultaneous Execution

A simple way to picture the difference is a kitchen:

- **Concurrency:** one cook prepares three dishes. While the pasta boils, the cook chops vegetables for the salad. All three dishes are in progress at once, but the cook does one action at a time.
- **Parallelism:** three cooks each prepare one dish at the same moment.

In programming terms:

| Timeline | Concurrency on one core | Parallelism on two cores |
| --- | --- | --- |
| Step 1 | Task A runs | Task A runs on core 1, task B runs on core 2 |
| Step 2 | Task A waits; task B runs | Both continue |
| Step 3 | Task B waits; task A resumes | Both continue |
| Result | Both tasks were *in progress* together | Both tasks were *executing* together |

Concurrent tasks have overlapping **lifetimes**: each starts before the other finishes. Parallel tasks have overlapping **execution**: their instructions run at the same instant.

## 2. Concurrency Can Happen on a Single CPU Core

### Concurrent Tasks on One Event-Loop Thread

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

# A: started
# B: started
# A: finished
# B: finished
```

Both tasks can start before either one finishes. Their Python code takes turns on the event-loop thread, so this doesn't show simultaneous CPU computation. The total time is about one sleep, not two, because the waits overlap.

### Concurrency Is About Structure

Concurrency lets a program handle several things without waiting for each to finish first. An ML inference service, for example, can accept a new request while an earlier one waits for a database lookup:

```python
import asyncio


async def handle_request(request_id, lookup_delay):
    await asyncio.sleep(lookup_delay)  # Simulates waiting for a feature store
    return f"request {request_id}: scored"


async def main():
    results = await asyncio.gather(
        handle_request(1, 0.05),
        handle_request(2, 0.01),
    )
    print(results)


asyncio.run(main())
# ['request 1: scored', 'request 2: scored']
```

`asyncio.gather()` returns results in the order the tasks were passed, even though request 2 finished first.

## 3. Asyncio Gives Cooperative Concurrency; Processes Allow CPU Parallelism

### Work That Can Run in Parallel Across Processes

```python
from concurrent.futures import ProcessPoolExecutor


def calculate(limit):
    return sum(number * number for number in range(limit))


if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=2) as executor:
        results = list(executor.map(calculate, [100_000, 200_000]))

    print(len(results))  # 2
```

The OS may schedule the workers on separate cores. The actual speedup depends on CPU quotas, the number of available cores, the size of the workload, and the overhead. Save this as a `.py` script to run it, especially on Windows.

### Where Each Python Tool Fits

| Tool | Concurrency? | Parallel Python execution? |
| --- | --- | --- |
| `asyncio` | Yes, cooperative, on one thread | No |
| `threading` in GIL-enabled CPython | Yes, preemptive | No for Python bytecode; yes for native code that releases the GIL |
| `threading` in free-threaded CPython | Yes | Yes, on multiple cores |
| `multiprocessing` / `ProcessPoolExecutor` | Yes | Yes, on multiple cores |
| NumPy or BLAS operations | Inside the library | Often, using several native threads |

### Checking Available Cores

```python
import os

cores = os.cpu_count()
print(cores is None or cores >= 1)  # True
```

`os.cpu_count()` reports the number of logical CPUs, or `None` if it cannot be determined. Containers and CPU quotas can limit how many of them your program actually gets, so parallelism may be smaller than this number suggests. Python 3.13 added `os.process_cpu_count()`, which reports the CPUs usable by the current process.

## 4. Neither Approach Guarantees Faster Execution

### Concurrency Doesn't Speed Up Computation

If tasks never wait, taking turns on one thread just runs the same amount of work in a different order:

```python
import asyncio


async def compute(name):
    total = sum(i * i for i in range(10_000))  # No await: never yields
    return name, total


async def main():
    results = await asyncio.gather(compute("A"), compute("B"))
    print([name for name, _ in results])


asyncio.run(main())
# ['A', 'B']
```

Each coroutine runs to completion before the next starts, so this is no faster than calling the two computations one after the other.

### Parallelism Has Overhead

Starting processes, sending inputs, and collecting results all take time. For tiny tasks, the overhead can exceed the work saved:

| Situation | Likely result |
| --- | --- |
| A few large, independent CPU tasks | Good parallel speedup |
| Thousands of tiny tasks, one per process call | Slower than sequential; batch them |
| Tasks that need a lot of data copied to workers | Transfer cost may dominate |
| More workers than available cores | Extra switching, no extra speed |
| Part of the job must run sequentially | The speedup is limited by that sequential part |

The last row is known as **Amdahl's law**: if 20% of a job is inherently sequential, no number of cores can make it more than five times faster.

> **Interview-ready distinction:** concurrency is about *managing* overlapping tasks. Parallelism is about *running* tasks at the same time.

## 5. Follow-Up: Can a Program Be Both?

Yes. The two ideas are independent:

| Program | Concurrent? | Parallel? |
| --- | --- | --- |
| A simple sequential script | No | No |
| An asyncio web scraper | Yes | No |
| One large NumPy matrix multiplication using several cores | Not at the Python task level | Yes, inside the library |
| A web service using async I/O plus a process pool for model inference | Yes | Yes |

A common ML design combines both: asyncio or threads handle many waiting requests, while a process pool or a native library uses several cores for the heavy computation.

## 6. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Concurrency means overlapping lifetimes | Task B starts before task A finishes |
| Parallelism means simultaneous execution | Two processes compute on two cores at once |
| Concurrency works on one core | `asyncio` runs many tasks on one thread |
| Asyncio is cooperative concurrency | Tasks switch at `await` points |
| Processes enable CPU parallelism | `ProcessPoolExecutor` for CPU-bound Python |
| Neither guarantees a speedup | Tiny tasks or no waiting can make things slower |

## 7. Quick Revision

| Question | Short answer |
| --- | --- |
| What is concurrency? | Several tasks making progress in overlapping time periods |
| What is parallelism? | Several tasks executing at the same instant |
| Does concurrency need multiple cores? | No |
| Does CPU parallelism need multiple cores? | Yes |
| Is asyncio parallel? | No; it is concurrent on one thread |
| Are CPython threads parallel for Python code? | Not in GIL-enabled CPython |
| Which Python tool gives CPU parallelism for Python code? | Processes, or free-threaded CPython |
| Can concurrency make CPU-bound code faster? | Not by itself |
| Why might parallel code be slower? | Startup, data transfer, and coordination overhead |
| Can a program be both concurrent and parallel? | Yes |

## 8. Interview-Ready Answer

> Concurrency means several tasks make progress during overlapping time periods, for example by taking turns while one waits on I/O, so it can happen on a single core. Parallelism means tasks actually execute at the same instant on different cores or other execution units. In Python, asyncio gives cooperative concurrency on one thread, and threads in GIL-enabled CPython are concurrent but don't run Python bytecode in parallel. For CPU parallelism in Python code, I use processes, or native libraries that use several cores internally. Neither approach guarantees a speedup: concurrency only helps when there is waiting to overlap, and parallelism carries startup, transfer, and coordination costs, so I measure on real workloads.

---

# Python Interview Question: Speeding Up CPU-Bound ML Preprocessing

**Difficulty:** 🔴 Advanced

## Question: How Would You Speed Up a CPU-Bound ML Preprocessing Task in Python?

**Answer:** First confirm that the task spends most of its time computing, not waiting on files, a database, or a network service. Profile it on representative data, then optimize the dominant work: improve the algorithm, replace Python loops with vectorized or compiled operations, and only then split the remaining independent heavy work across processes. Finally, verify that the outputs are unchanged and measure runtime and memory end to end.

| Step | Action | Reason |
| --- | --- | --- |
| 1 | Measure a baseline and profile | Find the operation that's actually expensive |
| 2 | Improve the algorithm and remove repeated work | Reduce the amount of computation |
| 3 | Use NumPy or compiled library operations where suitable | Move repeated operations out of Python loops |
| 4 | Split independent heavy work into process tasks | Use the available CPU cores for Python computation |
| 5 | Tune batch size and worker count | Balance computation against coordination costs |
| 6 | Measure runtime, peak memory, and outputs | Confirm the improvement is real and correct |

## 1. Profile First Instead of Immediately Adding Workers

Adding workers to a slow algorithm multiplies the cost instead of removing it. A profile shows where the time actually goes.

### Example: Find the Expensive Step with `cProfile`

```python
import cProfile
import pstats


def tokenize(texts):
    return [text.lower().split() for text in texts]


def build_vocab(token_lists):
    vocab = []
    for tokens in token_lists:
        for token in tokens:
            if token not in vocab:  # Linear search through a list
                vocab.append(token)
    return vocab


def pipeline(texts):
    return build_vocab(tokenize(texts))


texts = [f"sample {i % 500} text number {i}" for i in range(2_000)]

profiler = cProfile.Profile()
profiler.enable()
vocab = pipeline(texts)
profiler.disable()

stats = pstats.Stats(profiler).stats
slowest = max(stats.items(), key=lambda item: item[1][2])  # Highest own time
print(slowest[0][2])  # build_vocab
print(len(vocab))     # 2003
```

In practice you would print the report with `pstats.Stats(profiler).sort_stats("cumulative").print_stats(10)` and read it. The example extracts the function with the highest own time to show that `build_vocab`, not tokenization, dominates.

### What to Measure

| Measurement | Tool |
| --- | --- |
| Which functions take the time | `cProfile`, or a sampling profiler such as `py-spy` |
| Which lines take the time | A line profiler |
| Wall-clock time of a stage | `time.perf_counter()` |
| CPU time vs waiting time | Compare `time.process_time()` with `time.perf_counter()` |
| Peak Python memory | `tracemalloc` |

If wall-clock time is much larger than CPU time, the job is waiting on I/O, and the right fix is different, such as faster storage, caching, threads, or asyncio.

## 2. Improve the Algorithm and Reduce Python-Level Loops

### Use the Right Data Structure

The vocabulary builder above checks membership in a list, which is O(n) per lookup. A dictionary gives O(1) average lookups and keeps insertion order:

```python
def build_vocab_slow(token_lists):
    vocab = []
    for tokens in token_lists:
        for token in tokens:
            if token not in vocab:
                vocab.append(token)
    return vocab


def build_vocab_fast(token_lists):
    return list(dict.fromkeys(token for tokens in token_lists for token in tokens))


token_lists = [f"sample {i % 500} text number {i}".split() for i in range(2_000)]

assert build_vocab_fast(token_lists) == build_vocab_slow(token_lists)
print(build_vocab_fast(token_lists)[:4])  # ['sample', '0', 'text', 'number']
```

The output is identical, and the cost drops from roughly quadratic to linear in the number of tokens.

### Remove Repeated Work

Categorical columns often repeat the same raw values. Caching a deterministic transformation avoids recomputing it:

```python
from functools import lru_cache

calls = 0


@lru_cache(maxsize=None)
def normalize_category(raw):
    global calls
    calls += 1
    return raw.strip().lower().replace(" ", "_")


column = [" New York", "new york ", " New York", "Paris"] * 1_000
cleaned = [normalize_category(value) for value in column]

print(cleaned[:4])  # ['new_york', 'new_york', 'new_york', 'paris']
print(calls)        # 3
```

Only three distinct raw strings exist, so the function body ran three times for 4,000 values. Use an unbounded cache only when the number of distinct inputs is known to be small.

| Common algorithmic fix | Example |
| --- | --- |
| Use sets or dicts for membership | `token in vocab_set` |
| Compute statistics once | Compute the mean outside the per-row loop |
| Cache deterministic transformations | `functools.lru_cache` |
| Avoid repeated string concatenation | `"".join(parts)` |
| Filter early | Drop unused rows and columns before expensive steps |

## 3. Choose Between Vectorization, Compiled Operations, and Processes

### The Pure-Python Loop

```python
from statistics import fmean, pstdev

training = [
    [10.0, 100.0],
    [20.0, 200.0],
    [30.0, 300.0],
]

columns = list(zip(*training))
means = [fmean(column) for column in columns]
stds = [pstdev(column) or 1.0 for column in columns]

scaled = [
    [(value - mean) / std for value, mean, std in zip(row, means, stds)]
    for row in training
]
print([round(row[0], 4) for row in scaled])  # [-1.2247, 0.0, 1.2247]
```

Every value passes through the Python interpreter, which is slow for millions of values.

### Vectorization Example: Scale Numeric Feature Columns

This requires NumPy, and the statistics come from the training data only:

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

### Process-Pool Example: Independent Python Feature Extraction

Save it as `preprocess.py` and run `python preprocess.py`:

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

The timing includes starting and shutting down the pool, so this small demo may be slower with processes. Judge the production benefit on representative workloads. The printed times vary from machine to machine.

### Choosing the Technique

| Situation | Best first choice |
| --- | --- |
| Numeric operations over arrays or columns | NumPy or pandas vectorization |
| An existing library function does the job | Use it; it is usually compiled and tested |
| A custom numeric loop that cannot be vectorized | Compile it with Numba or Cython |
| Independent, heavy, pure-Python work per record | A process pool |
| Native operations that release the GIL | Threads may be enough; benchmark them |
| Large batches of supported tensor operations | A GPU, if the transfer cost is justified |

For suitable custom numeric kernels, consider compiling them with tools such as Numba or Cython, and include the compilation and deployment costs in the decision.

## 4. Consider Memory, Serialization, Task Size, and Nested Parallelism

Process workers need importable functions and serializable inputs and results. A larger `chunksize` can reduce scheduling overhead, but it can hurt load balancing when tasks vary in cost.

### Send Shared Data Once per Worker

Sending a large lookup table with every task repeats the pickling cost. An `initializer` sends it once per worker:

```python
from concurrent.futures import ProcessPoolExecutor

_vocab = None


def init_worker(vocab):
    global _vocab
    _vocab = vocab


def encode(text):
    return [_vocab.get(token, 0) for token in text.split()]


if __name__ == "__main__":
    vocab = {"good": 1, "movie": 2, "bad": 3}
    texts = ["good movie", "bad movie", "unknown words"]

    with ProcessPoolExecutor(
        max_workers=2, initializer=init_worker, initargs=(vocab,)
    ) as executor:
        print(list(executor.map(encode, texts, chunksize=2)))
        # [[1, 2], [3, 2], [0, 0]]
```

For very large datasets, don't copy them to workers over and over. Consider memory mapping, shared memory, or having each worker load its own partition from disk.

### Avoid Nested Oversubscription

Several processes that each start many BLAS/OpenMP threads can slow things down. With 8 cores, 8 processes each running 8 NumPy threads compete for 64 threads' worth of work. Coordinate the worker count with the native libraries' thread counts, for example by setting environment variables before NumPy is imported:

```python
import os

os.environ["OMP_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
# Import NumPy and start the process pool after this point.

print(os.environ["OMP_NUM_THREADS"])  # 1
```

Which variable matters depends on the BLAS library your NumPy build uses. The `threadpoolctl` package can also limit native thread pools at runtime.

| Cost | How to reduce it |
| --- | --- |
| Process startup | Reuse one pool for the whole job |
| Pickling large inputs | Send paths or indices, use an initializer, memory mapping, or shared memory |
| Pickling large results | Return compact results, or write them to disk in the worker |
| Many tiny tasks | Increase `chunksize` or batch records |
| Uneven task sizes | Use a smaller `chunksize` for better load balancing |
| Peak memory | Process data in chunks; limit the number of workers |

## 5. Verify the Output and Measure End to End

A faster pipeline that produces different features is a bug. Compare the new output with the baseline on the same data:

- Use exact equality for integers, strings, and token IDs.
- Use a tolerance for floating-point results, such as `math.isclose()` or `numpy.allclose()`, because a different order of operations can change the last few digits.
- Keep the output order stable; `executor.map()` preserves input order, while `as_completed()` does not.
- Control random seeds in each worker if the preprocessing uses randomness.

```python
import math

baseline = [0.1 + 0.2, 1.0 / 3.0]
optimized = [0.3, 0.3333333333333333]

print(baseline == optimized)  # False
print(all(math.isclose(a, b) for a, b in zip(baseline, optimized)))  # True
```

Measure the whole pipeline, including loading, process startup, and writing results, not just the optimized function. Track peak memory as well, because vectorization and processes can both increase it.

## 6. Follow-Up: Additional ML Considerations

- Native routines that release the GIL may benefit from threads, with less transfer overhead. Benchmark the specific operation.
- GPUs only help when the operations are supported and the batch sizes justify the transfer and setup costs.
- Cache expensive deterministic transformations when it's safe, for example by saving preprocessed features to disk.
- Keep training and validation data separate to avoid data leakage: fit scalers, vocabularies, and encoders on training data only.
- Keep ordering, random seeds, numerical tolerance, and error handling under control when you change how the work runs.
- Make one failing record easy to identify, because errors inside worker processes are harder to debug.

Source: [concurrent.futures](https://docs.python.org/3/library/concurrent.futures.html)

## 7. What the Interviewer Expects

| Expected understanding | Example |
| --- | --- |
| Profile first | `cProfile` shows `build_vocab` dominates |
| Improve the algorithm | Replace list membership with a dict or set |
| Reduce Python-level loops | NumPy column scaling instead of nested loops |
| Pick the right technique | Vectorize, compile, or use processes depending on the workload |
| Account for overhead | Pickling, startup, `chunksize`, memory |
| Avoid nested parallelism | Limit BLAS/OpenMP threads per process |
| Verify correctness | Compare outputs with a tolerance; measure end to end |

## 8. Quick Revision

| Question | Short answer |
| --- | --- |
| First step? | Confirm it is CPU-bound and profile on representative data |
| Why not add processes immediately? | They multiply a bad algorithm's cost and add overhead |
| Biggest usual win? | A better algorithm or vectorization |
| When do processes help? | Independent, substantial, pure-Python CPU work |
| What must process tasks be? | Picklable inputs, results, and module-level functions |
| What does `chunksize` trade off? | Lower scheduling overhead vs worse load balancing |
| How do you avoid resending big data? | Initializer, memory mapping, shared memory, or per-worker loading |
| What is oversubscription? | More active threads than cores, e.g. processes times BLAS threads |
| How do you compare float outputs? | With a tolerance, such as `math.isclose()` |
| How do you avoid leakage when scaling? | Fit statistics on training data only |

## 9. Interview-Ready Answer

> I would first confirm the job is CPU-bound and profile the preprocessing pipeline on representative data to find the step that dominates. Then I would improve that algorithm, for example by using sets or dictionaries instead of list searches and caching repeated deterministic work, and replace suitable Python loops with NumPy or other compiled library operations. For the remaining independent CPU-heavy Python work, I would benchmark a process pool with sensible batching, sending large shared data once per worker rather than with every task. I would watch memory and transfer costs and limit native BLAS threads to avoid oversubscription. Before accepting the speedup, I would verify the outputs against the baseline with appropriate tolerances and measure end-to-end runtime and peak memory.
