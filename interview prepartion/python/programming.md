# OOP Programs

Write each program from memory first, then click **Answer** to check it. Every answer uses the exact code from Part E of `python-topicquiz.md`, and the **Fact** explains which question the program proves.

> Open the preview (Ctrl+Shift+V) so the arrows work.

## How to Practise

### Write a program without looking

Keep the **Answer** closed and use a blank `.py` file.

1. **Read only the Task.** Don't open the Answer.
2. **Write your own Steps** on paper, one action per line (about 2 minutes).
3. **Write rough pseudocode** with IF / ELSE / FOR (about 3 minutes).
4. **Write the code** in the blank file (10 minutes at most).
5. **Run it** and compare with the expected **Output**.
6. **Now open the Answer.** Compare it with your version and note what you missed.

### If you get stuck for more than 5 minutes

Open the hints one at a time:

| Hint level | Open this | Grade |
|---|---|---|
| 0 | Nothing | 🟢 Strong |
| 1 | Only **Steps** | 🟡 Partial |
| 2 | **Program flow** + **Pseudocode** | 🟡 Partial |
| 3 | **Code** | 🔴 Weak: rewrite it tomorrow from a blank file |

### Check you really understand it

- **Change it slightly** once it works. For example, add a `WalletPayment` class to Program 38, use an empty host in Program 24, or add a third user to Program 42.
- **Explain it out loud** in 30 seconds, the way you would in an interview.

### How many programs per day

Do about **6 a day, in 45–60 minutes**:

| Part | Count | What |
|---|---|---|
| New | 3 | The next 3 programs you haven't done yet |
| Review | 3 | Programs that are due again |

**When to repeat a program:**

- 🔴 Weak: the **next day**
- 🟡 Partial: after **3 days**
- 🟢 Strong: after **7 days**, then 14 days

### Schedule

- **Days 1–14:** all 42 programs, done for the first time.
- **Every 7th day:** a mock test. Pick 5 random programs, give yourself 30 minutes, and use no hints.
- **After day 14:** stop adding new programs and only review the due ones, about 4–5 a day, until every program is 🟢 Strong twice in a row.
- **On a busy day,** do 1 new and 2 review programs. Skipping a day is worse than doing a small day.

### Why expert trainers rarely make mistakes

Expert trainers aren't magic. Most of what you see comes from preparation and habits, and you can learn them.

1. **They've written that program many times before.** A trainer who shows a `BankAccount` class has probably written it 50+ times. It's memory and practice, not live problem-solving.
2. **Slides are prepared and tested.** Code on a slide was usually written in an editor, run and checked first, then pasted in.
3. **They plan before they write.** They first say or write the steps: "We need a class, `__init__` stores the balance, `deposit` adds…". It's the same **Steps → Pseudocode → Code** order used in this file.
4. **They write the skeleton first and fill it in later.** They write the class and method names first, then the body of each method:

   ```python
   class BankAccount:
       def __init__(self, owner, balance):
           pass                      # fill in later

       def deposit(self, amount):
           pass                      # fill in later

       def withdraw(self, amount):
           pass                      # fill in later
   ```

   Write the real parameter names, and put `pass` in each empty method so the skeleton already runs. Then replace each `pass` with the real code, one method at a time.

5. **They know common patterns, not just separate programs.** Most programs reuse a few patterns: store in `__init__`, validate then raise, loop and collect into a list, try/except/else/finally, `super().__init__()`.
6. **They keep examples small.** They use 2–3 objects, short names and simple numbers like 1000 and 500, which leaves little room for mistakes.
7. **They trace before saying "done".** They run through the code once with a sample input ("`deposit(500)` makes the balance 1500…"). This dry run catches most bugs without a computer.
8. **They do make mistakes, and fix them calmly.** Good trainers say "oops, I forgot `self`" and fix it. Interviewers expect small slips too. What they watch is whether you **notice and fix** them.

### Build the same skill yourself

| Expert habit | What to practise |
|---|---|
| Repetition | 6 programs a day from this file |
| Plan first | Always write Steps → Pseudocode before code |
| Skeleton first | Write the class and method names first, then the bodies |
| Know patterns | Notice which pattern each program uses |
| Dry run | Trace one input by hand before running the code |
| Small examples | Use simple values when practising |
| Explain aloud | Say each line out loud while writing, like teaching |

**Whiteboard practice:** once a week, write 2–3 programs on paper with a pen (no editor and no autocomplete), explaining out loud as you go. Then type them in and run them. This is the closest practice to a whiteboard interview.

### Skeleton patterns

Most programs in this file are built from a few patterns. Learn the skeleton, then fill in the details. Every skeleton below runs as it is.

**1. Class and object creation**

```python
class ClassName:
    def __init__(self, value):
        self.value = value            # store the data

    def method(self):
        pass                          # fill in: use self.value


obj = ClassName("data")               # create the object
obj.method()                          # call a method
```

Used in: Programs 1, 3, 9, 11, 14, 25, 26, 27, 30

**2. Inheritance with `super()`**

```python
class Parent:
    def __init__(self, name):
        self.name = name


class Child(Parent):
    def __init__(self, name, extra):
        super().__init__(name)        # parent stores its part
        self.extra = extra            # child stores its own part

    def method(self):
        pass                          # fill in: child's own behaviour
```

Used in: Programs 4–8, 13, 15, 21, 29, 39

**3. Class method (another way to create an object)**

```python
class ClassName:
    def __init__(self, a, b):
        self.a = a
        self.b = b

    @classmethod
    def from_dict(cls, data):
        return cls(data["a"], data["b"])    # builds and returns a new object

    @staticmethod
    def helper(x):
        return x                            # fill in: needs no self or cls
```

Used in: Programs 17, 19, 24, 35, 36, 37

**4. Validate, then raise**

```python
class ClassName:
    def __init__(self, value):
        if not value:                                 # fill in: the rule
            raise ValueError("value is required")     # stop with a clear message
        self.value = value
```

Used in: Programs 24, 34

**5. Exception handling: `try` / `except` / `else` / `finally`**

```python
try:
    result = 10 / 2                   # risky code
except ZeroDivisionError as error:
    print("Error:", error)            # runs only if it fails
else:
    print("Result:", result)          # runs only if it works
finally:
    print("Done")                     # always runs: cleanup
```

**6. Custom exception and chaining**

```python
class AppError(Exception):
    pass                              # uses Exception's __init__


def do_work(text):
    try:
        return int(text)              # low-level step that may fail
    except ValueError as error:
        raise AppError("clear message for the app") from error   # keep the cause


try:
    do_work("abc")
except AppError as error:
    print(error, "| cause:", repr(error.__cause__))
```

Used in: Programs 29, 33

**7. Decorator**

```python
from functools import wraps


def my_decorator(function):
    @wraps(function)                  # keeps the original name
    def wrapper(*args, **kwargs):
        # fill in: work before the call
        result = function(*args, **kwargs)
        # fill in: work after the call
        return result
    return wrapper


@my_decorator
def greet(name):
    return f"Hello, {name}"


print(greet("Asha"))
```

**8. Decorator that takes an argument**

```python
from functools import wraps


def repeat(times):                    # outer: takes the argument
    def decorator(function):          # middle: takes the function
        @wraps(function)
        def wrapper(*args, **kwargs):     # inner: runs on every call
            for _ in range(times):
                result = function(*args, **kwargs)
            return result
        return wrapper
    return decorator


@repeat(times=3)
def ping():
    print("ping")


ping()
```

**9. Context manager (`with`)**

```python
class Resource:
    def __enter__(self):
        print("setup")                # fill in: open, connect, lock
        return self

    def __exit__(self, exc_type, exc, tb):
        print("cleanup")              # fill in: close, disconnect, unlock
        return False                  # False: don't hide errors


with Resource() as resource:
    print("working")
```

**10. Generator**

```python
def generate(items):
    for item in items:
        if item:                      # fill in: the condition
            yield item                # hand out one value, then pause


for value in generate(["a", "", "b"]):
    print(value)
```

**11. Dataclass with validation**

```python
from dataclasses import dataclass, field


@dataclass
class Record:
    name: str
    score: int = 0
    tags: list = field(default_factory=list)   # safe default for a list

    def __post_init__(self):
        if self.score < 0:                     # fill in: the rule
            raise ValueError("score cannot be negative")


print(Record("Asha", 90))
```

**12. Mixin**

```python
class FeatureMixin:
    def feature(self):
        return f"feature for {self.name}"     # small extra ability


class Base:
    def __init__(self, name):
        self.name = name


class MyClass(FeatureMixin, Base):            # mixin goes first
    pass


print(MyClass("Asha").feature())
```

Used in: Programs 22, 40

**How to use these:** when you read a Task, first ask "which pattern is this?" Write that skeleton, run it, then fill in the details one method at a time.

When you're comfortable with the programs, move on to the bigger [20 Project Skeletons](#20-project-skeletons) at the end of this file.

### Tips to make fewer mistakes

**While planning**

1. **Read the Task twice.** Underline the inputs, defaults, rules and expected output before writing anything.
2. **Write the expected output first.** If you know you should get `1500`, you'll notice at once when you get something else.
3. **Choose clear names.** `balance`, `amount` and `order_id` are easier to get right than `b`, `x` and `n`.
4. **Use the same name everywhere.** If the Task says `order_id`, don't switch to `orderId` or `id` halfway through.

**While writing**

5. **Skeleton first, with `pass`.** Write the class and method names, run it, then fill in one method at a time.
6. **Write a small piece, then run it.** Don't write 30 lines and run them once. Run after every method.
7. **Finish each line's pairs right away.** When you type `(`, `[`, `{` or `"`, close it before typing what goes inside.
8. **Check the colon and indent.** Every `class`, `def`, `if`, `for`, `while`, `try` and `with` line ends with `:`, and the next line is indented 4 spaces.

**Common Python mistakes in these programs**

| Mistake | Wrong | Right |
|---|---|---|
| Forgetting `self` in a method | `def show():` | `def show(self):` |
| Forgetting `self.` when storing | `color = color` | `self.color = color` |
| Calling a method without `()` | `print(red.show)` | `print(red.show())` |
| Using `print` when the task needs `return` | `print(self.color)` inside the method | `return self.color` |
| Forgetting `super().__init__()` in a child | parent's attributes are missing | `super().__init__(brand)` |
| A list default in the parameters | `def __init__(self, tags=[]):` | `tags=None`, then `self.tags = tags if tags is not None else []` |
| A list in the class body when each object needs its own | `items = []` under `class` | `self.items = []` in `__init__` |
| Forgetting the `f` in an f-string | `"Invalid port: {port}"` | `f"Invalid port: {port}"` |
| `=` instead of `==` in a condition | `if status = "paid":` | `if status == "paid":` |
| `is` instead of `==` for values | `if name is "Asha":` | `if name == "Asha":` (use `is` only for `None` or the same object) |
| A key name typo in a dict | `data["Name"]` | `data["name"]` (match the exact key) |
| Catching the wrong error type | `except TypeError:` for `int("abc")` | `except ValueError:` |

**While checking**

9. **Dry run once by hand.** Trace one input through the code line by line before you run it.
10. **Test the edge cases.** Try an empty value, zero, a negative number and the limit (for example port `0`, `1`, `65535`, `65536`).
11. **Read the last line of an error first.** `NameError`, `TypeError`, `AttributeError` and the line number usually tell you exactly what's wrong.
12. **Use `print()` to look inside.** If the result is wrong, print the values in the middle to see where they go wrong.
13. **Compare with the expected Output exactly.** Check spaces, capital letters, brackets and quotes, not just "roughly the same".

**After checking**

14. **Write down your mistake** in one line, such as "forgot `self.` in `__init__`". You'll see the same few mistakes repeat, and then you'll stop making them.
15. **Rewrite a program you got wrong** from a blank file the next day, without looking.

---

## Single class with methods

One class, no inheritance. Each program adds methods that read or change the object.

### Program 1

**Task:** Create a `Car` class that stores a `color`. Add a `show()` method that returns the color. Create a red car and a blue car, and print each car's color using `show()`.

*From E3: What is an instance of a class, and which instance does `self` refer to inside a method?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Car` class.
2. `__init__` stores `color` → `self.color`.
3. `show()` returns `self.color`.
4. Create `red = Car("red")` and `blue = Car("blue")`.
5. Print `red.show()` and `blue.show()`.

**Program flow**

```text
Car("red")   → self.color = "red"  → red object
Car("blue")  → self.color = "blue" → blue object
red.show()   → self is red         → "red"
blue.show()  → self is blue        → "blue"
```

**Pseudocode**

```text
CLASS Car:
    init(color):  self.color = color
    show():       RETURN self.color

red = Car("red");  blue = Car("blue")
PRINT red.show()     // red
PRINT blue.show()    // blue
```

**Code**

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

**Output:**

```text
red
blue
```

**Fact (why this program):** `self` is the object before the dot. In `red.show()`, `self` is `red`; in `blue.show()`, `self` is `blue`. One method, but each object gets its own answer.

</details>

### Program 2

**Task:** Create a `Rectangle` class that stores a `length`. Add `get_length()`, which needs no arguments, and `area(width)`, which needs a width. Create a rectangle of length 10 and print its length and its area for width 5.

*From E9: When calling a method on a Python class or object, how do you decide which arguments to pass and which ones Python supplies automatically?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Rectangle` class whose `__init__` stores `length`.
2. `get_length()` returns `self.length` (no arguments).
3. `area(width)` returns `self.length * width`.
4. Create `Rectangle(10)`.
5. Print `get_length()` and `area(5)`.

**Program flow**

```text
rectangle.get_length() → Python passes self only       → 10
rectangle.area(5)      → Python passes self, you pass 5 → 10 * 5 = 50
```

**Pseudocode**

```text
CLASS Rectangle:
    init(length):     self.length = length
    get_length():     RETURN self.length
    area(width):      RETURN self.length * width

rectangle = Rectangle(10)
PRINT rectangle.get_length()    // 10
PRINT rectangle.area(5)         // 50
```

**Code**

```python
class Rectangle:
    def __init__(self, length):
        self.length = length

    def get_length(self):
        return self.length

    def area(self, width):
        return self.length * width


rectangle = Rectangle(10)

print(rectangle.get_length())  # 10
print(rectangle.area(5))       # 50
```

**Output:**

```text
10
50
```

**Another way:** store the result in a local variable before returning it, and use different values.

```python
class Rectangle:
    def __init__(self, length):
        self.length = length

    def area(self, width):
        area = self.length * width    # local variable: exists only inside this method
        return area


first = Rectangle(30)
print(first.area(50))  # 1500
```

**Output:**

```text
1500
```

`return self.length * width` and the two-line version give the same result. The extra variable makes the code easier to read and to debug, because you can `print(area)` before returning. `area` here is a local variable, not `self.area`, so it isn't stored on the object.

**Fact (why this program):** Look at the method's parameters. Python supplies `self` automatically, so `get_length()` gets nothing and `area()` gets only `width`.

</details>

### Program 3

**Task:** Create a `Student` class that stores a `name`. Add a method `same_as(other)` that returns `True` if `other` is the same object as `self`. Create a student `"Asha"` and check `first.same_as(first)`.

*From E4: What do you mean by `self` and instance?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Student` class.
2. `__init__` stores `name`.
3. `same_as(other)` returns `self is other`.
4. Create `first = Student("Asha")`.
5. Print `first.same_as(first)`.

**Program flow**

```text
Student("Asha")         → self.name = "Asha"            → first
first.same_as(first)    → self is first, other is first → True
```

**Pseudocode**

```text
CLASS Student:
    init(name):        self.name = name
    same_as(other):    RETURN self IS other

first = Student("Asha")
PRINT first.same_as(first)    // True
```

**Code**

```python
class Student:
    def __init__(self, name):
        self.name = name

    def same_as(self, other):
        return self is other

first = Student("Asha")
print(first.same_as(first))  # True: self and first are the same object
```

**Output:**

```text
True
```

**Fact (why this program):** `self` (inside the class) and `first` (outside the class) are two names for the **same object**, so `self is other` is `True`.

</details>

### Program 4

**Task:** Show that a list written in the class body is shared by all objects, but a list created in `__init__` is not. Use a `Team` class with `members` (class level) and `tasks` (in `__init__`).

*From E10: Is a mutable class attribute shared?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Team` class with a class-level list `members = []`.
2. In `__init__`, create `self.tasks = []`.
3. Create teams `a` and `b`.
4. Change both lists through `a`.
5. Print `b`'s lists → `members` shared, `tasks` not shared.

**Program flow**

```text
a.members.append("Asha") → one class list → b.members = ['Asha']
a.tasks.append("report") → a's own list   → b.tasks = []
```

**Pseudocode**

```text
CLASS Team:
    members = []                // shared
    init():  self.tasks = []    // per object

a = Team();  b = Team()
ADD "Asha" TO a.members;  ADD "report" TO a.tasks
PRINT b.members    // ['Asha']
PRINT b.tasks      // []
```

**Code**

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

**Output:**

```text
['Asha']
[]
```

**Fact (why this program):** A mutable class attribute is **one shared copy**. Changing it through `a` also changes what `b` sees. Create lists in `__init__` to give each object its own.

</details>

### Program 5

**Task:** Create a `BankAccount` class with `owner`, `balance`, and a `history` list. Add methods to read the balance, deposit, withdraw, change the owner, read the owner, and read the history. Start with `"Asha"` and 1000, then run each method once.

*From E12: How can you read and modify the state of an object created from a Python class? Show six different examples in a table with Task, Method Call, and Result columns.*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `BankAccount` class.
2. `__init__` stores `owner`, `balance` and `history = []`.
3. `deposit(amount)` → add to balance and history.
4. `withdraw(amount)` → subtract from balance, add `-amount` to history.
5. Add getters for balance, owner and history, and `change_owner(name)`.
6. Start with `"Asha"`, 1000 and call each method once.

**Program flow**

```text
BankAccount("Asha", 1000) → balance = 1000, history = []
get_balance()             →                        → 1000
deposit(500)              → balance = 1500         → history = [500]
withdraw(200)             → balance = 1300         → history = [500, -200]
change_owner("Ben")       → owner = "Ben"          → get_owner() = "Ben"
get_history()             →                        → [500, -200]
```

**Pseudocode**

```text
CLASS BankAccount:
    init(owner, balance):   store owner, balance; history = []
    deposit(amount):        balance += amount;  ADD amount TO history
    withdraw(amount):       balance -= amount;  ADD -amount TO history
    change_owner(name):     owner = name
    get_balance / get_owner / get_history:  RETURN the value

account = BankAccount("Asha", 1000)
PRINT balance (1000) → deposit 500 → PRINT (1500) → withdraw 200 → PRINT (1300)
change_owner("Ben") → PRINT owner (Ben) → PRINT history ([500, -200])
```

**Code**

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

**Output:**

```text
1000
1500
1300
Ben
[500, -200]
```

**Fact (why this program):** An object's **state** is its data. You read it and change it through methods, and every change is stored on the object (`self.balance`, `self.history`).

</details>

## Alternative-Single class with methods

## Single class: default arguments

One class, no extra methods. Practise required and default `__init__` arguments.

### Program 6

**Task:** Create a `Student` class with three attributes: `name`, `age`, and `city`. Require `name` and `age` when creating an object, and use `"Delhi"` as the default city.

*From E5: When creating an object in Python, how do you know which arguments to pass to the class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Student` class.
2. `__init__` takes `name`, `age` (required) and `city` → default `"Delhi"`.
3. Store all three on `self`.
4. Create `a` without a city and `b` with `"Mumbai"`.
5. Print both cities.

**Program flow**

```text
Student("Asha", 21)            → city not passed → default "Delhi"
Student("Ravi", 22, "Mumbai")  → city passed     → "Mumbai"
print(a.city), print(b.city)   →                 → "Delhi", "Mumbai"
```

**Pseudocode**

```text
CLASS Student:
    init(name, age, city = "Delhi"):
        store name, age, city

a = Student("Asha", 21)
b = Student("Ravi", 22, "Mumbai")
PRINT a.city    // Delhi
PRINT b.city    // Mumbai
```

**Code**

```python
class Student:
    def __init__(self, name, age, city="Delhi"):
        self.name = name
        self.age = age
        self.city = city

a = Student("Asha", 21)            # name and age are required
b = Student("Ravi", 22, "Mumbai")  # city is optional

print(a.city)  # Delhi: default used
print(b.city)  # Mumbai: default replaced
```

**Output:**

```text
Delhi
Mumbai
```

**Fact (why this program):** You pass the arguments that `__init__` asks for: required ones always, default ones only if you want to change them. Python passes `self` for you.

</details>

## Alternative-Single class: default arguments

### Program 13

**Task:** Create a `Coffee` class with `name` and `size`, where `size` defaults to `"medium"`. Create a Latte without a size and a Mocha with `"large"`, and print both sizes.

*From E7: How do you set a default value for a parameter in Python's `__init__` method, and what happens when you pass a different value while creating an object?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Coffee` class.
2. `__init__` takes `name` and `size` → default `"medium"`.
3. Create `Coffee("Latte")` and `Coffee("Mocha", "large")`.
4. Print both sizes.

**Program flow**

```text
Coffee("Latte")          → size not passed → "medium"
Coffee("Mocha", "large") → size passed     → "large"
```

**Pseudocode**

```text
CLASS Coffee:
    init(name, size = "medium"):  store name, size

c1 = Coffee("Latte")
c2 = Coffee("Mocha", "large")
PRINT c1.size    // medium
PRINT c2.size    // large
```

**Code**

```python
class Coffee:
    def __init__(self, name, size="medium"):
        self.name = name
        self.size = size

c1 = Coffee("Latte")            # size not passed
c2 = Coffee("Mocha", "large")   # size passed

print(c1.size)  # medium: default used
print(c2.size)  # large: default replaced
```

**Output:**

```text
medium
large
```

**Fact (why this program):** A default is written with `=` in `__init__`. Leave it out and the default is used; pass a value and it replaces the default **for that object only**.

</details>

## Inheritance

A parent and a child class, from simplest to hardest.

### Program 7

**Task:** Create an `Animal` class with an `eat()` method. Create a `Dog` subclass of `Animal` with its own `bark()` method. Create a dog and call both methods.

*From E13: How do you declare a subclass in Python? Show the syntax and where to put the parent class name.*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `Animal` class with `eat()` → `"eating"`.
2. Create `Dog(Animal)` with `bark()` → `"woof"`.
3. Create `dog = Dog()`.
4. Call `dog.eat()` and `dog.bark()`.

**Program flow**

```text
dog.eat()  → not in Dog → found in Animal → "eating"
dog.bark() → found in Dog                 → "woof"
```

**Pseudocode**

```text
CLASS Animal:
    eat():  RETURN "eating"
CLASS Dog EXTENDS Animal:
    bark(): RETURN "woof"

dog = Dog()
PRINT dog.eat()     // eating (from parent)
PRINT dog.bark()    // woof (its own)
```

**Code**

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

**Output:**

```text
eating
woof
```

**Fact (why this program):** Syntax: `class Child(Parent):`. The parent name goes in brackets. The child gets every parent method (`eat`) and can add its own (`bark`).

</details>

### Program 8

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Car` class that inherits from `Vehicle` and has **no** `__init__`. Create a car with brand `"Toyota"` and print its brand.

*From E6, scenario 1: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class whose `__init__` stores `brand`.
2. Create `Car(Vehicle)` with no `__init__` (`pass`).
3. Create `Car("Toyota")` → the parent's `__init__` runs.
4. Print `car.brand`.

**Program flow**

```text
Car("Toyota")  → Car has no __init__ → Vehicle.__init__ runs → brand = "Toyota"
car.brand      →                                             → "Toyota"
```

**Pseudocode**

```text
CLASS Vehicle:
    init(brand):  self.brand = brand
CLASS Car EXTENDS Vehicle:  (nothing)

car = Car("Toyota")     // uses Vehicle's init
PRINT car.brand         // Toyota
```

**Code**

```python
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Car(Vehicle):
    pass

car = Car("Toyota")        # Vehicle needs brand
print(car.brand)  # Toyota
```

**Output:**

```text
Toyota
```

**Another way:** create the object and read its attribute in one line, without storing it in a variable.

```python
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Car(Vehicle):
    pass

print(Car("Toyota").brand)  # Toyota
```

**Output:**

```text
Toyota
```

`Car("Toyota")` creates the object, and `.brand` reads its attribute straight away. Use this for a quick one-time check. Store it in a variable (`car = Car("Toyota")`) when you'll use the object again.

**Fact (why this program):** **Scenario 1:** the child has no `__init__`, so Python runs the parent's `__init__`. That's why you pass the **parent's** arguments (`brand`).

</details>

### Program 9

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Truck` child class whose `__init__` takes `brand` and `load`, with `"10 tons"` as the default load. Create one truck without a load and one with `"20 tons"`.

*From E6, scenario 4: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class whose `__init__` stores `brand`.
2. Create `Truck(Vehicle)` whose `__init__` takes `brand` and `load` → default `"10 tons"`.
3. Send `brand` to the parent with `super()`, and store `load`.
4. Create `t1` without a load and `t2` with `"20 tons"`.
5. Print both loads.

**Program flow**

```text
Truck("Tata")             → load not passed → default "10 tons"
Truck("Volvo", "20 tons") → load passed     → "20 tons"
print loads               →                 → "10 tons", "20 tons"
```

**Pseudocode**

```text
CLASS Truck EXTENDS Vehicle:
    init(brand, load = "10 tons"):
        CALL parent init(brand)
        self.load = load

t1 = Truck("Tata")
t2 = Truck("Volvo", "20 tons")
PRINT t1.load    // 10 tons
PRINT t2.load    // 20 tons
```

**Code**

```python
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Truck(Vehicle):
    def __init__(self, brand, load="10 tons"):
        super().__init__(brand)
        self.load = load

t1 = Truck("Tata")               # load uses the default
t2 = Truck("Volvo", "20 tons")   # load replaced
print(t1.load)  # 10 tons
print(t2.load)  # 20 tons
```

**Output:**

```text
10 tons
20 tons
```

**Fact (why this program):** **Scenario 4:** default values in the child's `__init__` are optional. Pass only the required ones, or pass a new value to replace the default.

</details>

### Program 10

**Task:** Create a `Vehicle` class with `brand` and an optional `color` (default `"white"`). Create an `ElectricCar` child class that takes `battery` and forwards everything else to the parent using `*args, **kwargs`. Create a red Tesla with a 75 kWh battery.

*From E6, scenario 5: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class whose `__init__` stores `brand` and `color` → default `"white"`.
2. Create `ElectricCar(Vehicle)` whose `__init__` takes `battery, *args, **kwargs`.
3. Forward `*args, **kwargs` to the parent with `super()`.
4. Store `battery`.
5. Create `ElectricCar("75 kWh", "Tesla", color="red")` and print all three values.

**Program flow**

```text
ElectricCar("75 kWh", "Tesla", color="red")
  → battery = "75 kWh", args = ("Tesla",), kwargs = {"color": "red"}
  → super().__init__("Tesla", color="red") → brand = "Tesla", color = "red"
print → "75 kWh Tesla red"
```

**Pseudocode**

```text
CLASS Vehicle:
    init(brand, color = "white"):  store brand, color
CLASS ElectricCar EXTENDS Vehicle:
    init(battery, rest of arguments):
        CALL parent init(rest of arguments)
        self.battery = battery

ev = ElectricCar("75 kWh", "Tesla", color = "red")
PRINT ev.battery, ev.brand, ev.color    // 75 kWh Tesla red
```

**Code**

```python
class Vehicle:
    def __init__(self, brand, color="white"):
        self.brand = brand
        self.color = color

class ElectricCar(Vehicle):
    def __init__(self, battery, *args, **kwargs):
        super().__init__(*args, **kwargs)   # rest goes to the parent
        self.battery = battery

ev = ElectricCar("75 kWh", "Tesla", color="red")
print(ev.battery, ev.brand, ev.color)  # 75 kWh Tesla red
```

**Output:**

```text
75 kWh Tesla red
```

**Fact (why this program):** **Scenario 5:** `*args, **kwargs` lets the child take its own argument and forward the rest to the parent, so you pass the parent's arguments plus the child's extra one.

</details>

## Alternative-Inheritance

### Program 11

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Car` child class whose `__init__` takes `brand` and `seats`, sends `brand` to the parent with `super()`, and stores `seats` itself. Create a Honda with 5 seats and print both values.

*From E6, scenario 2: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class whose `__init__` stores `brand`.
2. Create `Car(Vehicle)` whose `__init__` takes `brand` and `seats`.
3. Send `brand` to the parent with `super().__init__(brand)`.
4. Store `seats` in the child.
5. Create `Car("Honda", 5)` and print both values.

**Program flow**

```text
Car("Honda", 5) → Car.__init__ → super().__init__("Honda") → brand = "Honda"
                               → self.seats = 5
print           →                                          → "Honda 5"
```

**Pseudocode**

```text
CLASS Vehicle:
    init(brand):  self.brand = brand
CLASS Car EXTENDS Vehicle:
    init(brand, seats):
        CALL parent init(brand)
        self.seats = seats

car = Car("Honda", 5)
PRINT car.brand, car.seats    // Honda 5
```

**Code**

```python
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Car(Vehicle):
    def __init__(self, brand, seats):
        super().__init__(brand)   # parent sets brand
        self.seats = seats        # child sets seats

car = Car("Honda", 5)
print(car.brand, car.seats)  # Honda 5
```

**Output:**

```text
Honda 5
```

**Fact (why this program):** **Scenario 2:** the child has its own `__init__` and calls `super().__init__()`. You pass the **child's** arguments; the child hands the parent its part.

</details>

## More programs

The remaining programs, in their original order.

### Program 14

**Task:** Create a `Team` class with a class-level list `members` and an instance list `tasks` created in `__init__`. Create two teams, add `"Asha"` to `a.members` and `"report"` to `a.tasks`, then print team `b`'s two lists.

*From E8: How do you add an element to a list stored on an instance of a Python class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Team` class with a class-level list `members = []`.
2. In `__init__`, create `self.tasks = []`.
3. Create teams `a` and `b`.
4. Append `"Asha"` to `a.members` and `"report"` to `a.tasks`.
5. Print `b.members` and `b.tasks`.

**Program flow**

```text
a.members.append("Asha")  → members is on the class → shared by a and b
a.tasks.append("report")  → tasks is on a only      → b.tasks unchanged
print(b.members)          →                         → ['Asha']
print(b.tasks)            →                         → []
```

**Pseudocode**

```text
CLASS Team:
    members = []                // one list for the class
    init():  self.tasks = []    // new list for each object

a = Team();  b = Team()
ADD "Asha" TO a.members
ADD "report" TO a.tasks
PRINT b.members    // ['Asha']
PRINT b.tasks      // []
```

**Code**

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

**Output:**

```text
['Asha']
[]
```

**Fact (why this program):** You add to an instance list with `append()`, like `a.tasks.append("report")`. Because `tasks` is created in `__init__`, only team `a` changes. `members` lives on the class, so `b` sees `"Asha"` too.

</details>

### Program 16

**Task:** Create a `Greeter` class with `hello()` and a method `twice()` that calls `hello()` through `self`. Create a `Loud` child that calls the parent's `hello()` with `super()` and returns it in capitals. Call `hello` in six different ways.

*From E14: What are the different ways to call a Python instance method after an object is created?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Greeter` class with `hello()` → `"hello"`.
2. Add `twice()` → `self.hello() * 2`.
3. Create `Loud(Greeter)` whose `hello()` returns `super().hello().upper()`.
4. Call `hello` six ways: object, class, saved variable, `getattr`, `self`, `super()`.

**Program flow**

```text
g.hello()              → normal call              → "hello"
Greeter.hello(g)       → through the class        → "hello"
say = g.hello; say()   → saved bound method       → "hello"
getattr(g, "hello")()  → found by name            → "hello"
g.twice()              → self.hello() * 2         → "hellohello"
Loud().hello()         → super().hello().upper()  → "HELLO"
```

**Pseudocode**

```text
CLASS Greeter:
    hello():  RETURN "hello"
    twice():  RETURN self.hello() repeated 2 times
CLASS Loud EXTENDS Greeter:
    hello():  RETURN UPPERCASE(parent hello())

g = Greeter()
PRINT g.hello(), Greeter.hello(g), saved g.hello(), getattr(g, "hello")()   // hello x4
PRINT g.twice()          // hellohello
PRINT Loud().hello()     // HELLO
```

**Code**

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

**Output:**

```text
hello
hello
hello
hello
hellohello
HELLO
```

**Fact (why this program):** The same instance method can be called through the object, through the class, from a saved variable, by name with `getattr`, from inside the class with `self`, and from a child with `super()`.

</details>

### Program 17

**Task:** Create a `Pizza` class with a class attribute `size_unit = "inch"`. Add an instance method `describe()`, a class method `large()` that returns a 12-inch pizza, and a static method `is_valid(size)` that checks the size is positive.

*From E15: What is the difference between instance, class, and static methods?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Pizza` class with class attribute `size_unit = "inch"`.
2. `__init__` stores `size`.
3. Instance method `describe()` → `"<size> inch"`.
4. Class method `large()` → `cls(12)`.
5. Static method `is_valid(size)` → `size > 0`.
6. Call all three.

**Program flow**

```text
Pizza(8).describe()  → instance: uses self.size → "8 inch"
Pizza.large().size   → class: cls(12)           → 12
Pizza.is_valid(-1)   → static: -1 > 0?  NO      → False
```

**Pseudocode**

```text
CLASS Pizza:
    size_unit = "inch"
    init(size):              self.size = size
    describe():              RETURN size + " " + size_unit
    CLASS METHOD large():    RETURN new Pizza(12)
    STATIC is_valid(size):   RETURN size > 0

PRINT Pizza(8).describe()    // 8 inch
PRINT Pizza.large().size     // 12
PRINT Pizza.is_valid(-1)     // False
```

**Code**

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

**Output:**

```text
8 inch
12
False
```

**Fact (why this program):** Instance methods get `self` (one object), class methods get `cls` (the class), and static methods get neither (a plain helper).

</details>

### Program 18

**Task:** Create a `Student` class with a class attribute `school = "City School"`. Add a class method `rename_school(name)`. Create two students, rename the school once, and print both students' school.

*From E16: Can a class method read and update attributes stored on the class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Student` class with class attribute `school = "City School"`.
2. Class method `rename_school(name)` → `cls.school = name`.
3. Create `first` and `second`.
4. Call `Student.rename_school("Green School")` once.
5. Print both students' school.

**Program flow**

```text
Student.rename_school("Green School") → cls.school changed → all objects see it
first.school, second.school           →                    → "Green School", "Green School"
```

**Pseudocode**

```text
CLASS Student:
    school = "City School"
    CLASS METHOD rename_school(name):  cls.school = name

first = Student();  second = Student()
Student.rename_school("Green School")
PRINT first.school     // Green School
PRINT second.school    // Green School
```

**Code**

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

**Output:**

```text
Green School
Green School
```

**Fact (why this program):** A class method receives `cls`, so it can change class attributes. One change is seen by **every** object.

</details>

### Program 19

**Task:** Create a `User` class that stores a `name`. Add a class method `from_dict(data)` that creates a user from a dict. Create an `Admin` subclass and call `Admin.from_dict({"name": "Asha"})`. Print the type of the object you get.

*From E17: Why use a class method if we have instance methods?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `User` class whose `__init__` stores `name`.
2. Class method `from_dict(data)` → `cls(data["name"])`.
3. Create `Admin(User)` with no code (`pass`).
4. Call `Admin.from_dict({"name": "Asha"})`.
5. Print the type name.

**Program flow**

```text
Admin.from_dict({"name": "Asha"}) → cls is Admin → Admin("Asha") → type "Admin"
```

**Pseudocode**

```text
CLASS User:
    init(name):                     self.name = name
    CLASS METHOD from_dict(data):   RETURN new cls(data["name"])
CLASS Admin EXTENDS User:  (nothing)

obj = Admin.from_dict({"name": "Asha"})
PRINT type name of obj    // Admin
```

**Code**

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

**Output:**

```text
Admin
```

**Fact (why this program):** A class method works without an object, so it's ideal for creating objects in another way. Because `cls` is whichever class called it, `Admin.from_dict` returns an `Admin`.

</details>

### Program 20

**Task:** Create a `Vehicle` class with a `start()` method. Create `Car` and `Bike` subclasses with no code of their own. Loop over a car and a bike and call `start()` on each.

*From E18: Why use an is-a relationship?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class with `start()` → `"started"`.
2. Create `Car(Vehicle)` and `Bike(Vehicle)` with no code.
3. Loop over `Car()` and `Bike()`.
4. Call `start()` on each.

**Program flow**

```text
for vehicle in (Car(), Bike()):
  Car().start()  → not in Car  → Vehicle.start → "started"
  Bike().start() → not in Bike → Vehicle.start → "started"
```

**Pseudocode**

```text
CLASS Vehicle:
    start():  RETURN "started"
CLASS Car EXTENDS Vehicle;  CLASS Bike EXTENDS Vehicle

FOR EACH vehicle IN [Car(), Bike()]:
    PRINT vehicle.start()    // started
END FOR
```

**Code**

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

**Output:**

```text
started
started
```

**Fact (why this program):** Use inheritance when the child **is a** kind of parent. Code written for `Vehicle` works for every child, without writing it again.

</details>

### Program 21

**Task:** Create a `Parent` class with a class attribute `role`, an `__init__` that stores `name`, a `show()` method, and a class method `create()`. Create a `Child` class that uses every form of `super()`: parent setup, parent method, the old `super(Child, self)` style, parent class attribute, and parent class method.

*From E19: What are the different forms of `super()`?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `Parent` with `role = "parent"`, `__init__(name)`, `show()` and class method `create()` → `cls("new")`.
2. In `Child.__init__`, call `super().__init__(name)`.
3. `Child.show()` → `super().show() + " (child)"`.
4. `old_style()` → `super(Child, self).show()`.
5. `parent_role()` → `super().role`.
6. Class method `Child.create()` → `super().create()`.

**Program flow**

```text
Child("Asha")        → super().__init__("Asha")    → name = "Asha"
child.show()         → parent show + " (child)"    → "name: Asha (child)"
child.old_style()    → super(Child, self).show()   → "name: Asha"
child.parent_role()  → super().role                → "parent"
Child.create().name  → super().create() → cls("new") → "new"
```

**Pseudocode**

```text
CLASS Parent:
    role = "parent"
    init(name):            self.name = name
    show():                RETURN "name: " + name
    CLASS METHOD create(): RETURN new cls("new")

CLASS Child EXTENDS Parent:
    init(name):     CALL parent init(name)
    show():         RETURN parent show() + " (child)"
    old_style():    RETURN parent show()      // old super(Child, self) form
    parent_role():  RETURN parent role
    CLASS METHOD create():  RETURN parent create()

PRINT show, old_style, parent_role, create().name
// name: Asha (child), name: Asha, parent, new
```

**Code**

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

**Output:**

```text
name: Asha (child)
name: Asha
parent
new
```

**Fact (why this program):** `super()` reaches the parent's version of anything: `__init__`, a normal method, a class attribute, or a class method.

</details>

### Program 22

**Task:** Create a `LogMixin` whose `save()` adds `"log, "` before the parent's `save()`. Create two unrelated classes, `Model` and `Report`, each with its own `save()`. Mix the logger into both and print the MRO of one.

*From E20: What is multiple inheritance and MRO? When are mixins used?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `LogMixin` whose `save()` → `"log, " + super().save()`.
2. Create `Model.save()` → `"saved"` and `Report.save()` → `"report saved"`.
3. Create `LoggedModel(LogMixin, Model)` and `LoggedReport(LogMixin, Report)`.
4. Call `save()` on each.
5. Print the MRO of `LoggedModel`.

**Program flow**

```text
LoggedModel().save()  → LogMixin.save → super() = Model.save  → "log, saved"
LoggedReport().save() → LogMixin.save → super() = Report.save → "log, report saved"
LoggedModel.__mro__   →                                       → LoggedModel, LogMixin, Model, object
```

**Pseudocode**

```text
CLASS LogMixin:
    save():  RETURN "log, " + next class's save()
CLASS Model:   save(): RETURN "saved"
CLASS Report:  save(): RETURN "report saved"

CLASS LoggedModel EXTENDS LogMixin, Model
CLASS LoggedReport EXTENDS LogMixin, Report

PRINT LoggedModel().save()     // log, saved
PRINT LoggedReport().save()    // log, report saved
PRINT MRO of LoggedModel       // LoggedModel, LogMixin, Model, object
```

**Code**

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

**Output:**

```text
log, saved
log, report saved
['LoggedModel', 'LogMixin', 'Model', 'object']
```

**Fact (why this program):** A mixin adds one small feature to many unrelated classes. The MRO decides the order: `LogMixin` runs first, then `super()` moves to the next class.

</details>

### Program 23

**Task:** Create the diamond: `A` at the top, `B` and `C` both inheriting from `A`, and `D` inheriting from `B` and `C`. Each `show()` prints its class name and calls `super().show()`. Call `D().show()`.

*From E21: What is the diamond inheritance problem?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `A` whose `show()` prints `"A"`.
2. Create `B(A)` and `C(A)`: each prints its name, then calls `super().show()`.
3. Create `D(B, C)`: it prints `"D"`, then calls `super().show()`.
4. Call `D().show()`.

**Program flow**

```text
MRO of D: D → B → C → A
D.show() → print "D" → super() = B
B.show() → print "B" → super() = C   (next in D's MRO, not A)
C.show() → print "C" → super() = A
A.show() → print "A" → stop          (A runs once)
```

**Pseudocode**

```text
CLASS A:              show(): PRINT "A"
CLASS B EXTENDS A:    show(): PRINT "B";  CALL next show()
CLASS C EXTENDS A:    show(): PRINT "C";  CALL next show()
CLASS D EXTENDS B, C: show(): PRINT "D";  CALL next show()

D().show()    // D, B, C, A
```

**Code**

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

**Output:**

```text
D
B
C
A
```

**Fact (why this program):** Python follows the MRO `D → B → C → A`, and each class runs **once**. `super()` in `B` goes to `C`, not straight to `A`.

</details>

### Program 24

**Task:** Write a Python program that creates a database configuration from either direct inputs or an environment settings dictionary. Create a `DatabaseConfig` class that stores `host` and `port`. Reject an empty host and a port outside `1`–`65535`. Add a class method `from_env(env)` that reads `DB_HOST` (default `"localhost"`) and `DB_PORT` (default `"5432"`) from a dictionary. Build one config from `{"DB_HOST": "db.internal", "DB_PORT": "5432"}` and one from an empty dictionary. Then try to create one directly with an empty host, and one with port `99999`.

*From E1: Can `__init__()` return a value such as an integer, or must it return `None`?*

<details>
<summary>Answer</summary>

**Steps**

1. Read host from `DB_HOST` → default `"localhost"`.
2. Read port from `DB_PORT` → default `"5432"`.
3. Convert port to `int`.
4. Check host is a non-empty string → else `ValueError`.
5. Check port is 1–65535 → else `ValueError`.
6. Store host and port.

**Program flow**

```text
from_env({"DB_HOST": "db.internal", "DB_PORT": "5432"}) → values found → "db.internal 5432"
from_env({})                                            → defaults used → "localhost 5432"
DatabaseConfig("", 5432)                                → host empty    → "Host must be a non-empty string"
DatabaseConfig("db.internal", 99999)                    → port too big  → "Invalid port: 99999"
```

**Pseudocode**

```text
from_env(env):
    host = env["DB_HOST"] IF present ELSE "localhost"
    port = integer(env["DB_PORT"] IF present ELSE "5432")
    RETURN DatabaseConfig(host, port)

init(host, port):
    IF host is empty THEN raise "Host must be a non-empty string"
    IF port NOT between 1 and 65535 THEN raise "Invalid port: <port>"
    ELSE store host and port
```

**Code**

```python
class DatabaseConfig:
    def __init__(self, host, port):
        if not isinstance(host, str) or not host.strip():
            raise ValueError("Host must be a non-empty string")
        if not 1 <= port <= 65535:
            raise ValueError(f"Invalid port: {port}")   # report problems by raising, not returning
        self.host = host
        self.port = port

    @classmethod
    def from_env(cls, env):
        # Need to build and return an object in a special way? Use a class method.
        host = env.get("DB_HOST", "localhost")
        port = int(env.get("DB_PORT", "5432"))
        return cls(host, port)


config = DatabaseConfig.from_env({"DB_HOST": "db.internal", "DB_PORT": "5432"})
print(config.host, config.port)     # db.internal 5432

default = DatabaseConfig.from_env({})
print(default.host, default.port)   # localhost 5432

try:
    DatabaseConfig("", 5432)
except ValueError as error:
    print(error)                    # Host must be a non-empty string

try:
    DatabaseConfig("db.internal", 99999)
except ValueError as error:
    print(error)                    # Invalid port: 99999
```

**Output:**

```text
db.internal 5432
localhost 5432
Host must be a non-empty string
Invalid port: 99999
```

**Fact (why this program):** `__init__` must return `None`, so it reports bad input by **raising** an error, not by returning an error code. When you need to build and return an object in a special way, such as from environment settings, use a class method. It calls `cls(...)`, so `__init__` still validates the host and port.

</details>

### Program 25

**Task:** Create a `User` class that stores `first` and `last`. Add a `full_name()` method that returns both names joined by a space. Create users `"Asha Patel"` and `"Ravi Kumar"`, print each full name, then call `full_name()` through the class by passing `asha` yourself.

*From E2: Is `self` a reserved keyword in Python or a naming convention?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `User` class.
2. `__init__` stores `first` and `last` on `self`.
3. `full_name()` returns `"<first> <last>"`.
4. Create `asha = User("Asha", "Patel")` and `ravi = User("Ravi", "Kumar")`.
5. Print `asha.full_name()` and `ravi.full_name()`.
6. Print `User.full_name(asha)` → pass `asha` as `self` yourself.

**Program flow**

```text
User("Asha", "Patel")   → first = "Asha", last = "Patel" → asha
User("Ravi", "Kumar")   → first = "Ravi", last = "Kumar" → ravi
asha.full_name()        → Python passes asha as self     → "Asha Patel"
ravi.full_name()        → Python passes ravi as self     → "Ravi Kumar"
User.full_name(asha)    → you pass asha as self          → "Asha Patel"
```

**Pseudocode**

```text
CLASS User:
    init(first, last):  store first, last
    full_name():        RETURN first + " " + last

asha = User("Asha", "Patel")
ravi = User("Ravi", "Kumar")
PRINT asha.full_name()        // Asha Patel
PRINT ravi.full_name()        // Ravi Kumar
PRINT User.full_name(asha)    // Asha Patel
```

**Code**

```python
class User:
    def __init__(self, first, last):
        self.first = first
        self.last = last

    def full_name(self):
        return f"{self.first} {self.last}"


asha = User("Asha", "Patel")
ravi = User("Ravi", "Kumar")

print(asha.full_name())         # Asha Patel: here self is asha
print(ravi.full_name())         # Ravi Kumar: here self is ravi
print(User.full_name(asha))     # Asha Patel: same call, you pass asha as self
```

**Output:**

```text
Asha Patel
Ravi Kumar
Asha Patel
```

**Fact (why this program):** `self` is just the first argument, not a keyword. `asha.full_name()` is the same as `User.full_name(asha)`: in the first, Python passes `asha` as `self` for you; in the second, you pass it yourself.

</details>

### Program 26

**Task:** Create an `ApiClient` class that stores a `base_url` and a `token`. Add a `build_request(path)` method that returns a dict with the full `url` and an `Authorization` header. Create a payments client and an emails client, and print the URL each one builds.

*From E3: What is an instance of a class, and which instance does `self` refer to inside a method?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `ApiClient` class.
2. `__init__` stores `base_url` and `token` on `self`.
3. `build_request(path)` → URL = `base_url + path`.
4. Add header → `"Authorization": "Bearer <token>"`.
5. Return the URL and headers as a dict.
6. Create `payments` and `emails` clients with their own URL and token.
7. Print the `"url"` from `payments.build_request("/charge")` and `emails.build_request("/send")`.

**Program flow**

```text
ApiClient("https://pay.example.com", "pay-123")   → payments object
ApiClient("https://mail.example.com", "mail-456") → emails object
payments.build_request("/charge") → self is payments → "https://pay.example.com/charge"
emails.build_request("/send")     → self is emails   → "https://mail.example.com/send"
```

**Pseudocode**

```text
CLASS ApiClient:
    init(base_url, token):  store base_url, token
    build_request(path):
        url = self.base_url + path
        headers = {"Authorization": "Bearer " + self.token}
        RETURN {url, headers}

payments = ApiClient("https://pay.example.com", "pay-123")
emails = ApiClient("https://mail.example.com", "mail-456")
PRINT payments.build_request("/charge").url    // https://pay.example.com/charge
PRINT emails.build_request("/send").url        // https://mail.example.com/send
```

**Code**

```python
class ApiClient:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token

    def build_request(self, path):
        return {
            "url": f"{self.base_url}{path}",
            "headers": {"Authorization": f"Bearer {self.token}"},
        }


payments = ApiClient("https://pay.example.com", "pay-123")
emails = ApiClient("https://mail.example.com", "mail-456")

print(payments.build_request("/charge")["url"])   # https://pay.example.com/charge
print(emails.build_request("/send")["url"])       # https://mail.example.com/send
```

**Output:**

```text
https://pay.example.com/charge
https://mail.example.com/send
```

**Fact (why this program):** One class, two instances, each with its own settings. In `payments.build_request()`, `self` is `payments`, so it uses the payment URL and token. The same method on `emails` uses the email settings.

</details>

### Program 27

**Task:** Create an `AdmissionForm` class that stores `name`, `age`, and `city`. Add an `update(city)` method that changes the city and an `export()` method that returns all three values as text. Create forms for Ram and Sita, update only Ram's city to `"Mumbai"`, and export both forms.

*From E3: What is an instance of a class, and which instance does `self` refer to inside a method?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `AdmissionForm` class → the blank template.
2. `__init__` stores `name`, `age` and `city` → filling in the form.
3. `update(city)` → change `self.city`.
4. `export()` → return `"<name>, <age>, <city>"`.
5. Create `ram` (`"Ram", 21, "Delhi"`) and `sita` (`"Sita", 22, "Pune"`).
6. Call `ram.update("Mumbai")` → only Ram's form changes.
7. Print `ram.export()` and `sita.export()`.

**Program flow**

```text
AdmissionForm("Ram", 21, "Delhi")  → Ram's filled form   → ram
AdmissionForm("Sita", 22, "Pune")  → Sita's filled form  → sita
ram.update("Mumbai")               → self is ram         → ram.city = "Mumbai"
ram.export()                       → self is ram         → "Ram, 21, Mumbai"
sita.export()                      → self is sita        → "Sita, 22, Pune" (unchanged)
```

**Pseudocode**

```text
CLASS AdmissionForm:
    init(name, age, city):  store name, age, city
    update(city):           self.city = city
    export():               RETURN name + ", " + age + ", " + city

ram = AdmissionForm("Ram", 21, "Delhi")
sita = AdmissionForm("Sita", 22, "Pune")
ram.update("Mumbai")
PRINT ram.export()     // Ram, 21, Mumbai
PRINT sita.export()    // Sita, 22, Pune
```

**Code**

```python
class AdmissionForm:                              # the blank template
    def __init__(self, name, age, city):          # filling in the form
        self.name = name
        self.age = age
        self.city = city

    def update(self, city):                       # action button: Update
        self.city = city

    def export(self):                             # action button: Export
        return f"{self.name}, {self.age}, {self.city}"


ram = AdmissionForm("Ram", 21, "Delhi")           # Ram's filled form
sita = AdmissionForm("Sita", 22, "Pune")          # Sita's filled form

ram.update("Mumbai")                              # self is ram: only Ram's form changes
print(ram.export())    # Ram, 21, Mumbai
print(sita.export())   # Sita, 22, Pune
```

**Output:**

```text
Ram, 21, Mumbai
Sita, 22, Pune
```

**Fact (why this program):** The class is the blank form template, `__init__` fills it in, each instance is one filled form, and methods are the action buttons. A button works only on the form it belongs to: `ram.update()` changes Ram's form, not Sita's, because `self` is `ram`.

</details>

### Program 28

**Task:** Create an `HttpClient` class whose `__init__` takes a required `base_url`, optional `timeout` (default `10`) and `retries` (default `3`), and a keyword-only `verify_ssl` (default `True`). Print the class's signature with `inspect.signature()`. Then create a client that changes only the timeout to `30`, and print its timeout and retries.

*From E5: When creating an object in Python, how do you know which arguments to pass to the class?*

<details>
<summary>Answer</summary>

**Steps**

1. Import `inspect`.
2. Create an `HttpClient` class.
3. `__init__` takes `base_url` (required), `timeout` → default `10`, `retries` → default `3`.
4. After `*`, add `verify_ssl` → default `True` (keyword-only).
5. Store all four on `self`.
6. Print `inspect.signature(HttpClient)` → shows which arguments to pass.
7. Create a client with `base_url` and `timeout=30` only.
8. Print `timeout` and `retries`.

**Program flow**

```text
inspect.signature(HttpClient)                        → reads __init__ (self hidden) → "(base_url, timeout=10, retries=3, *, verify_ssl=True)"
HttpClient("https://api.example.com", timeout=30)    → timeout passed               → timeout = 30
                                                     → retries not passed           → default 3
                                                     → verify_ssl not passed        → default True
print(client.timeout, client.retries)                →                              → "30 3"
```

**Pseudocode**

```text
IMPORT inspect

CLASS HttpClient:
    init(base_url, timeout = 10, retries = 3, *, verify_ssl = True):
        store base_url, timeout, retries, verify_ssl

PRINT signature of HttpClient    // (base_url, timeout=10, retries=3, *, verify_ssl=True)

client = HttpClient("https://api.example.com", timeout = 30)
PRINT client.timeout, client.retries    // 30 3
```

**Code**

```python
import inspect


class HttpClient:
    def __init__(self, base_url, timeout=10, retries=3, *, verify_ssl=True):
        self.base_url = base_url
        self.timeout = timeout
        self.retries = retries
        self.verify_ssl = verify_ssl


print(inspect.signature(HttpClient))
# (base_url, timeout=10, retries=3, *, verify_ssl=True)

client = HttpClient("https://api.example.com", timeout=30)   # change only what you need
print(client.timeout, client.retries)   # 30 3
```

**Output:**

```text
(base_url, timeout=10, retries=3, *, verify_ssl=True)
30 3
```

**Fact (why this program):** `inspect.signature()` shows exactly which arguments a class needs. Parameters without a default (`base_url`) are required, parameters with a default are optional, and parameters after `*` (`verify_ssl`) must be passed by keyword. Python hides `self` because it passes it for you.

</details>

### Program 29

**Task:** Create an `APIError` exception whose `__init__` takes a `message` and a `status_code`, passes the message to `Exception` with `super()`, and stores the status code. Create a `NotFoundError` child whose `__init__` takes `resource` and `resource_id`, and builds the message and a `404` status code for the parent. Raise `NotFoundError("User", 7)`, catch it as `APIError`, and print the status code and message.

*From E6, scenario 2: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `APIError(Exception)`.
2. `APIError.__init__` takes `message` and `status_code`.
3. Send `message` to `Exception` with `super().__init__(message)`.
4. Store `status_code` on `self`.
5. Create `NotFoundError(APIError)` whose `__init__` takes `resource` and `resource_id`.
6. Build `"<resource> <resource_id> not found"` and send it with `status_code=404` to `APIError`.
7. Raise `NotFoundError("User", 7)` → catch it as `APIError`.
8. Print `status_code` and the message.

**Program flow**

```text
NotFoundError("User", 7)  → NotFoundError.__init__ → message = "User 7 not found", status_code = 404
                          → APIError.__init__      → self.status_code = 404
                          → Exception.__init__     → stores "User 7 not found"
raise                     → except APIError?       → YES (NotFoundError is an APIError)
print                     →                        → "404 User 7 not found"
```

**Pseudocode**

```text
CLASS APIError EXTENDS Exception:
    init(message, status_code):
        CALL parent init(message)
        self.status_code = status_code

CLASS NotFoundError EXTENDS APIError:
    init(resource, resource_id):
        CALL parent init(resource + " " + resource_id + " not found", status_code = 404)

TRY
    RAISE NotFoundError("User", 7)
CATCH APIError AS error
    PRINT error.status_code, error    // 404 User 7 not found
END TRY
```

**Code**

```python
class APIError(Exception):
    def __init__(self, message, status_code):
        super().__init__(message)        # Exception stores the message
        self.status_code = status_code   # extra field for our app


class NotFoundError(APIError):
    def __init__(self, resource, resource_id):
        super().__init__(f"{resource} {resource_id} not found", status_code=404)


try:
    raise NotFoundError("User", 7)
except APIError as error:
    print(error.status_code, error)   # 404 User 7 not found
```

**Output:**

```text
404 User 7 not found
```

**Fact (why this program):** **Scenario 2:** `NotFoundError` has its own `__init__`, so you pass **its** arguments (`resource`, `resource_id`). Each class hands its parent what the parent needs: `NotFoundError` passes the message and `404` to `APIError`, and `APIError` passes the message to `Exception`.

</details>

### Program 30

**Task:** Create a `ShoppingCart` class that stores a `user` and its own empty `items` list. Add an `add_item(name, price, qty=1)` method that appends an item dict, and a `total()` method that returns the sum of `price * qty`. Create a cart for Asha, add a keyboard (1500) and two mice (500 each), then print the number of items and the total.

*From E8: How do you add an element to a list stored on an instance of a Python class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `ShoppingCart` class.
2. `__init__` stores `user` and creates `self.items = []` → each cart gets its own list.
3. `add_item(name, price, qty=1)` → append `{"name", "price", "qty"}` to `self.items`.
4. `total()` → sum of `price * qty` for every item.
5. Create `cart = ShoppingCart("Asha")`.
6. Add `"Keyboard", 1500` → `qty` default `1`.
7. Add `"Mouse", 500, qty=2`.
8. Print `len(cart.items)` and `cart.total()`.

**Program flow**

```text
ShoppingCart("Asha")               → user = "Asha"        → items = []
add_item("Keyboard", 1500)         → qty not passed → 1   → items has 1 item
add_item("Mouse", 500, qty=2)      → qty passed → 2       → items has 2 items
len(cart.items)                    →                      → 2
cart.total()                       → 1500*1 + 500*2       → 2500
```

**Pseudocode**

```text
CLASS ShoppingCart:
    init(user):
        self.user = user
        self.items = empty list
    add_item(name, price, qty = 1):
        ADD {name, price, qty} TO self.items
    total():
        sum = 0
        FOR EACH item IN self.items:
            sum = sum + item.price * item.qty
        END FOR
        RETURN sum

cart = ShoppingCart("Asha")
cart.add_item("Keyboard", 1500)
cart.add_item("Mouse", 500, qty = 2)
PRINT length of cart.items    // 2
PRINT cart.total()            // 2500
```

**Code**

```python
class ShoppingCart:
    def __init__(self, user):
        self.user = user
        self.items = []                      # each cart gets its own list

    def add_item(self, name, price, qty=1):
        self.items.append({"name": name, "price": price, "qty": qty})

    def total(self):
        return sum(item["price"] * item["qty"] for item in self.items)


cart = ShoppingCart("Asha")
cart.add_item("Keyboard", 1500)
cart.add_item("Mouse", 500, qty=2)

print(len(cart.items))   # 2
print(cart.total())      # 2500
```

**Output:**

```text
2
2500
```

**Fact (why this program):** Create the list in `__init__` (`self.items = []`) so each object gets its own copy, then add to it with `append()` inside a method. Adding through `add_item()` gives you one place to put checks later, such as stock or quantity limits.

</details>

### Program 31

**Task:** Create an `EmailService` class that stores a `sender`. Add a `send_confirmation(order_id)` method that returns a confirmation message. Create a service for `"shop@example.com"`, then collect the confirmations for orders 101 and 102 in a list **outside** the class, and print the list.

*From E9, option 1: When calling a method on a Python class or object, how do you decide which arguments to pass and which ones Python supplies automatically?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `EmailService` class.
2. `__init__` stores `sender` on `self`.
3. `send_confirmation(order_id)` → return `"<sender>: order <order_id> confirmed"`.
4. Create `email = EmailService("shop@example.com")`.
5. Create `confirmations = []` outside the class.
6. Append `email.send_confirmation(101)` and `email.send_confirmation(102)` to the list.
7. Print the list.

**Program flow**

```text
EmailService("shop@example.com")   → sender = "shop@example.com"   → email
confirmations = []                 → normal variable, outside class → []
email.send_confirmation(101)       → self is email, you pass 101    → append "shop@example.com: order 101 confirmed"
email.send_confirmation(102)       → self is email, you pass 102    → append "shop@example.com: order 102 confirmed"
print(confirmations)               →                                → list of 2 messages
```

**Pseudocode**

```text
CLASS EmailService:
    init(sender):                 self.sender = sender
    send_confirmation(order_id):  RETURN sender + ": order " + order_id + " confirmed"

email = EmailService("shop@example.com")
confirmations = empty list
ADD email.send_confirmation(101) TO confirmations
ADD email.send_confirmation(102) TO confirmations
PRINT confirmations    // ['shop@example.com: order 101 confirmed', 'shop@example.com: order 102 confirmed']
```

**Code**

```python
class EmailService:
    def __init__(self, sender):
        self.sender = sender

    def send_confirmation(self, order_id):
        return f"{self.sender}: order {order_id} confirmed"


email = EmailService("shop@example.com")

confirmations = []                                   # outside the class: a normal variable
confirmations.append(email.send_confirmation(101))
confirmations.append(email.send_confirmation(102))

print(confirmations)
```

**Output:**

```text
['shop@example.com: order 101 confirmed', 'shop@example.com: order 102 confirmed']
```

**Fact (why this program):** `send_confirmation(self, order_id)` has two parameters, but you pass only `order_id`. Python passes `email` as `self`. The list lives outside the class, so **your code** collects the results.

</details>

### Program 32

**Task:** Change `EmailService` so each object keeps its **own** `confirmations` list, created in `__init__`. `send_confirmation(order_id)` should build the message, add it to `self.confirmations`, and return it. Send confirmations for orders 101 and 102, then print `email.confirmations`.

*From E9, option 2: When calling a method on a Python class or object, how do you decide which arguments to pass and which ones Python supplies automatically?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `EmailService` class.
2. `__init__` stores `sender` and creates `self.confirmations = []` → each object gets its own list.
3. `send_confirmation(order_id)` → build `"<sender>: order <order_id> confirmed"`.
4. Append the message to `self.confirmations`, then return it.
5. Create `email = EmailService("shop@example.com")`.
6. Call `send_confirmation(101)` and `send_confirmation(102)`.
7. Print `email.confirmations`.

**Program flow**

```text
EmailService("shop@example.com")  → sender set, confirmations = []    → email
email.send_confirmation(101)      → self is email → build message     → self.confirmations has 1 item
email.send_confirmation(102)      → self is email → build message     → self.confirmations has 2 items
print(email.confirmations)        →                                   → list of 2 messages
```

**Pseudocode**

```text
CLASS EmailService:
    init(sender):
        self.sender = sender
        self.confirmations = empty list
    send_confirmation(order_id):
        message = sender + ": order " + order_id + " confirmed"
        ADD message TO self.confirmations
        RETURN message

email = EmailService("shop@example.com")
email.send_confirmation(101)
email.send_confirmation(102)
PRINT email.confirmations    // ['shop@example.com: order 101 confirmed', 'shop@example.com: order 102 confirmed']
```

**Code**

```python
class EmailService:
    def __init__(self, sender):
        self.sender = sender
        self.confirmations = []          # in __init__: each service gets its own list

    def send_confirmation(self, order_id):
        message = f"{self.sender}: order {order_id} confirmed"
        self.confirmations.append(message)
        return message


email = EmailService("shop@example.com")

email.send_confirmation(101)
email.send_confirmation(102)

print(email.confirmations)
```

**Output:**

```text
['shop@example.com: order 101 confirmed', 'shop@example.com: order 102 confirmed']
```

**Fact (why this program):** The list is created in `__init__`, so the **object** remembers its own history and the method adds to it. Don't put `confirmations = []` in the class body: that would be one list shared by every `EmailService` object.

</details>

### Program 33

**Task:** Create a custom exception `OrderNotFound` that inherits from `Exception` and has no `__init__` (use `pass`). Create it with the message `"Order 4521 not found"`, then print the error and its `args`.

*From E11: Can a child class use its parent class's `__init__()` if it doesn't define its own?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `OrderNotFound(Exception)` with no `__init__` (`pass`).
2. Create `OrderNotFound("Order 4521 not found")` → `Exception.__init__` runs.
3. Print the error → shows the message.
4. Print `error.args` → shows the stored message as a tuple.

**Program flow**

```text
OrderNotFound("Order 4521 not found") → no __init__ in OrderNotFound → Exception.__init__ stores message
print(error)                          → uses Exception's __str__     → "Order 4521 not found"
print(error.args)                     → message stored in args       → ('Order 4521 not found',)
```

**Pseudocode**

```text
CLASS OrderNotFound EXTENDS Exception:  (nothing)

error = OrderNotFound("Order 4521 not found")    // uses Exception's init
PRINT error         // Order 4521 not found
PRINT error.args    // ('Order 4521 not found',)
```

**Code**

```python
class OrderNotFound(Exception):
    pass                                  # no __init__: uses Exception's


error = OrderNotFound("Order 4521 not found")
print(error)        # Order 4521 not found
print(error.args)   # ('Order 4521 not found',)
```

**Output:**

```text
Order 4521 not found
('Order 4521 not found',)
```

**Fact (why this program):** `OrderNotFound` has no `__init__`, so Python uses the parent's (`Exception.__init__`). That's why passing a message works with only `pass` in the class: `Exception` stores it in `args` and shows it when printed.

</details>

### Program 34

**Task:** Create an `Order` class that stores an `order_id` and starts with `status = "created"`. Add `pay()`, which works only when the status is `"created"`, and `ship()`, which works only when the status is `"paid"`. Each raises a `ValueError` otherwise. Pay and ship order 4521 and print its status. Then try to ship order 4522 without paying, and print the error.

*From E12: How can you read and modify the state of an object created from a Python class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `Order` class.
2. `__init__` stores `order_id` and sets `status` → `"created"`.
3. `pay()` → check status is `"created"` → else `ValueError`; set status → `"paid"`.
4. `ship()` → check status is `"paid"` → else `ValueError`; set status → `"shipped"`.
5. Create `Order(4521)`, call `pay()` then `ship()`, and print the status.
6. Create `Order(4522)`, call `ship()` without paying → catch the `ValueError` and print it.

**Program flow**

```text
Order(4521)          → status = "created"
order.pay()          → status "created"? YES → status = "paid"
order.ship()         → status "paid"?    YES → status = "shipped"
print(order.status)  →                       → "shipped"

Order(4522)          → status = "created"
new_order.ship()     → status "paid"?    NO  → raise ValueError
except               →                       → "Cannot ship an order that is created"
```

**Pseudocode**

```text
CLASS Order:
    init(order_id):
        self.order_id = order_id
        self.status = "created"
    pay():
        IF status != "created" THEN raise "Cannot pay an order that is <status>"
        ELSE status = "paid"
    ship():
        IF status != "paid" THEN raise "Cannot ship an order that is <status>"
        ELSE status = "shipped"

order = Order(4521)
order.pay();  order.ship()
PRINT order.status    // shipped

new_order = Order(4522)
TRY
    new_order.ship()
CATCH ValueError AS error
    PRINT error       // Cannot ship an order that is created
END TRY
```

**Code**

```python
class Order:
    def __init__(self, order_id):
        self.order_id = order_id
        self.status = "created"

    def pay(self):
        if self.status != "created":
            raise ValueError(f"Cannot pay an order that is {self.status}")
        self.status = "paid"

    def ship(self):
        if self.status != "paid":
            raise ValueError(f"Cannot ship an order that is {self.status}")
        self.status = "shipped"


order = Order(4521)
order.pay()
order.ship()
print(order.status)   # shipped

new_order = Order(4522)
try:
    new_order.ship()
except ValueError as error:
    print(error)      # Cannot ship an order that is created
```

**Output:**

```text
shipped
Cannot ship an order that is created
```

**Fact (why this program):** The object's state (`status`) changes only through its methods, so the methods can block wrong changes, such as shipping before payment. If any code could set `order.status = "shipped"` directly, these rules could be skipped.

</details>

### Program 35

**Task:** Create an `Order` class with a class attribute `TAX_RATE = 0.18` that stores an `order_id` and an `amount`. Add a static method `calculate_tax(amount, rate)`, an instance method `total()` that adds the tax to the amount, and a class method `from_json(text)` that builds an order from a JSON string. Build an order from `'{"id": 7, "amount": 1000}'`, print its id and total, then call `calculate_tax(500, 0.05)` directly.

*From E15: What is the difference between instance, class, and static methods?*

<details>
<summary>Answer</summary>

**Steps**

1. Import `json`.
2. Create an `Order` class with `TAX_RATE = 0.18`.
3. `__init__` stores `order_id` and `amount`.
4. Static `calculate_tax(amount, rate)` → `round(amount * rate, 2)`.
5. Instance `total()` → `amount + calculate_tax(amount, TAX_RATE)`.
6. Class `from_json(text)` → parse JSON → return `cls(data["id"], data["amount"])`.
7. Build `order` with `Order.from_json('{"id": 7, "amount": 1000}')`.
8. Print `order.order_id` and `order.total()`.
9. Print `Order.calculate_tax(500, 0.05)`.

**Program flow**

```text
Order.from_json('{"id": 7, "amount": 1000}') → class method: json.loads → cls(7, 1000)  → order
order.total()                                → instance: 1000 + tax(1000, 0.18) = 180  → 1180.0
print(order.order_id, order.total())         →                                         → "7 1180.0"
Order.calculate_tax(500, 0.05)               → static: round(500 * 0.05, 2)            → 25.0
```

**Pseudocode**

```text
IMPORT json

CLASS Order:
    TAX_RATE = 0.18
    init(order_id, amount):            store order_id, amount
    total():                           RETURN amount + calculate_tax(amount, TAX_RATE)
    CLASS METHOD from_json(text):
        data = PARSE JSON text
        RETURN new cls(data["id"], data["amount"])
    STATIC calculate_tax(amount, rate):
        RETURN ROUND(amount * rate, 2)

order = Order.from_json('{"id": 7, "amount": 1000}')
PRINT order.order_id, order.total()     // 7 1180.0
PRINT Order.calculate_tax(500, 0.05)    // 25.0
```

**Code**

```python
import json


class Order:
    TAX_RATE = 0.18

    def __init__(self, order_id, amount):
        self.order_id = order_id
        self.amount = amount

    def total(self):                         # instance: uses this order's data
        return self.amount + self.calculate_tax(self.amount, self.TAX_RATE)

    @classmethod
    def from_json(cls, text):                # class: builds an Order from API data
        data = json.loads(text)
        return cls(data["id"], data["amount"])

    @staticmethod
    def calculate_tax(amount, rate):         # static: plain helper, no self or cls
        return round(amount * rate, 2)


order = Order.from_json('{"id": 7, "amount": 1000}')
print(order.order_id, order.total())        # 7 1180.0
print(Order.calculate_tax(500, 0.05))       # 25.0
```

**Output:**

```text
7 1180.0
25.0
```

**Fact (why this program):** Needs one object's data → **instance** method (`total`). Creates objects or uses class data → **class** method (`from_json`). Needs neither → **static** method (`calculate_tax`).

</details>

### Program 36

**Task:** Create an `ApiClient` class with a class attribute `base_url = "https://api.example.com"`, an `__init__` that stores a `name`, and a `url(path)` method that returns `base_url + path`. Add a class method `use_environment(env)` that changes `base_url` to `"https://<env>.api.example.com"`. Create a users client and an orders client, switch to `"staging"` with one call, and print both URLs.

*From E16: Can a class method read and update attributes stored on the class?*

<details>
<summary>Answer</summary>

**Steps**

1. Create an `ApiClient` class with `base_url = "https://api.example.com"` → shared by all clients.
2. `__init__` stores `name`.
3. Class method `use_environment(env)` → `cls.base_url = "https://<env>.api.example.com"`.
4. `url(path)` → return `self.base_url + path`.
5. Create `users` and `orders` clients.
6. Call `ApiClient.use_environment("staging")` once.
7. Print `users.url("/list")` and `orders.url("/list")`.

**Program flow**

```text
ApiClient("users"), ApiClient("orders")  → both read the class's base_url
ApiClient.use_environment("staging")     → cls.base_url changed → "https://staging.api.example.com"
users.url("/list")                       → reads class base_url → "https://staging.api.example.com/list"
orders.url("/list")                      → reads class base_url → "https://staging.api.example.com/list"
```

**Pseudocode**

```text
CLASS ApiClient:
    base_url = "https://api.example.com"     // one value for the class
    init(name):                        self.name = name
    CLASS METHOD use_environment(env): cls.base_url = "https://" + env + ".api.example.com"
    url(path):                         RETURN self.base_url + path

users = ApiClient("users")
orders = ApiClient("orders")
ApiClient.use_environment("staging")
PRINT users.url("/list")     // https://staging.api.example.com/list
PRINT orders.url("/list")    // https://staging.api.example.com/list
```

**Code**

```python
class ApiClient:
    base_url = "https://api.example.com"     # shared by all clients

    def __init__(self, name):
        self.name = name

    @classmethod
    def use_environment(cls, env):
        cls.base_url = f"https://{env}.api.example.com"

    def url(self, path):
        return self.base_url + path


users = ApiClient("users")
orders = ApiClient("orders")

ApiClient.use_environment("staging")         # one call, e.g. before tests run
print(users.url("/list"))    # https://staging.api.example.com/list
print(orders.url("/list"))   # https://staging.api.example.com/list
```

**Output:**

```text
https://staging.api.example.com/list
https://staging.api.example.com/list
```

**Fact (why this program):** A class method receives `cls`, so it can change a class attribute. Both clients read `base_url` from the class, so **one** call switches every client to staging. It changes the setting for the whole program, so use it only for app-wide settings.

</details>

### Program 37

**Task:** Create a `Settings` class that stores `debug` and `db_url`. Add two class methods: `from_json(text)`, which builds settings from a JSON string, and `from_env(env)`, which builds them from an environment dictionary (`DEBUG` is `"1"` for on). Build one settings object from each, and print their values. Then call `date.fromisoformat("2026-11-11")` to see the same idea in the standard library.

*From E17: Why use a class method if we have instance methods?*

<details>
<summary>Answer</summary>

**Steps**

1. Import `json` and `date`.
2. Create a `Settings` class whose `__init__` stores `debug` and `db_url`.
3. Class method `from_json(text)` → parse JSON → return `cls(data["debug"], data["db_url"])`.
4. Class method `from_env(env)` → `debug = (DEBUG == "1")` → return `cls(debug, env["DB_URL"])`.
5. Build `a` with `from_json(...)` and `b` with `from_env(...)`.
6. Print both objects' `debug` and `db_url`.
7. Print `date.fromisoformat("2026-11-11")` → a standard library class method.

**Program flow**

```text
Settings.from_json('{"debug": true, "db_url": "sqlite:///dev.db"}') → json.loads → cls(True, "sqlite:///dev.db")  → a
Settings.from_env({"DEBUG": "0", "DB_URL": "postgres://prod"})     → "0" == "1"? NO → cls(False, "postgres://prod") → b
print(a.debug, a.db_url)                                            →                                               → "True sqlite:///dev.db"
print(b.debug, b.db_url)                                            →                                               → "False postgres://prod"
date.fromisoformat("2026-11-11")                                    → class method builds a date                    → 2026-11-11
```

**Pseudocode**

```text
IMPORT json, date

CLASS Settings:
    init(debug, db_url):  store debug, db_url
    CLASS METHOD from_json(text):
        data = PARSE JSON text
        RETURN new cls(data["debug"], data["db_url"])
    CLASS METHOD from_env(env):
        debug = TRUE IF env["DEBUG"] == "1" ELSE FALSE
        RETURN new cls(debug, env["DB_URL"])

a = Settings.from_json('{"debug": true, "db_url": "sqlite:///dev.db"}')
b = Settings.from_env({"DEBUG": "0", "DB_URL": "postgres://prod"})
PRINT a.debug, a.db_url                     // True sqlite:///dev.db
PRINT b.debug, b.db_url                     // False postgres://prod
PRINT date.fromisoformat("2026-11-11")      // 2026-11-11
```

**Code**

```python
import json
from datetime import date


class Settings:
    def __init__(self, debug, db_url):
        self.debug = debug
        self.db_url = db_url

    @classmethod
    def from_json(cls, text):
        data = json.loads(text)
        return cls(data["debug"], data["db_url"])

    @classmethod
    def from_env(cls, env):
        return cls(env.get("DEBUG") == "1", env["DB_URL"])


a = Settings.from_json('{"debug": true, "db_url": "sqlite:///dev.db"}')
b = Settings.from_env({"DEBUG": "0", "DB_URL": "postgres://prod"})
print(a.debug, a.db_url)   # True sqlite:///dev.db
print(b.debug, b.db_url)   # False postgres://prod

print(date.fromisoformat("2026-11-11"))   # 2026-11-11: the same idea in the standard library
```

**Output:**

```text
True sqlite:///dev.db
False postgres://prod
2026-11-11
```

**Fact (why this program):** A class method creates an object **before** you have one, so it's the way to give a class several ways to be built (`from_json`, `from_env`). The standard library does the same: `date.fromisoformat()`, `datetime.now()`, `dict.fromkeys()`, and `Path.home()` are all class methods.

</details>

### Program 38

**Task:** Create a `PaymentMethod` base class whose `pay(amount)` raises `NotImplementedError`. Create `CardPayment` and `UpiPayment` child classes, each with its own `pay(amount)` message. Create one of each and pay 499 with both.

*From E18: Why use an is-a relationship?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `PaymentMethod` class whose `pay(amount)` → `raise NotImplementedError`.
2. Create `CardPayment(PaymentMethod)` whose `pay(amount)` → `"Charged Rs.<amount> to card"`.
3. Create `UpiPayment(PaymentMethod)` whose `pay(amount)` → `"Collected Rs.<amount> via UPI"`.
4. Create `card = CardPayment()` and `upi = UpiPayment()`.
5. Print `card.pay(499)` and `upi.pay(499)`.

**Program flow**

```text
card.pay(499)  → CardPayment has its own pay → "Charged Rs.499 to card"
upi.pay(499)   → UpiPayment has its own pay  → "Collected Rs.499 via UPI"
PaymentMethod().pay(499)  (not called)       → would raise NotImplementedError
```

**Pseudocode**

```text
CLASS PaymentMethod:
    pay(amount):  RAISE NotImplementedError       // each child must write its own

CLASS CardPayment EXTENDS PaymentMethod:
    pay(amount):  RETURN "Charged Rs." + amount + " to card"

CLASS UpiPayment EXTENDS PaymentMethod:
    pay(amount):  RETURN "Collected Rs." + amount + " via UPI"

card = CardPayment()
upi = UpiPayment()
PRINT card.pay(499)    // Charged Rs.499 to card
PRINT upi.pay(499)     // Collected Rs.499 via UPI
```

**Code**

```python
class PaymentMethod:
    def pay(self, amount):
        raise NotImplementedError


class CardPayment(PaymentMethod):
    def pay(self, amount):
        return f"Charged Rs.{amount} to card"


class UpiPayment(PaymentMethod):
    def pay(self, amount):
        return f"Collected Rs.{amount} via UPI"


card = CardPayment()
upi = UpiPayment()

print(card.pay(499))  # Charged Rs.499 to card
print(upi.pay(499))   # Collected Rs.499 via UPI
```

**Output:**

```text
Charged Rs.499 to card
Collected Rs.499 via UPI
```

**Fact (why this program):** Card and UPI **are** payment methods, so they inherit from `PaymentMethod` and share the same `pay()` method name, each with its own behaviour. The parent's `pay()` raises `NotImplementedError` to force every child to write its own. Adding wallet payments later only needs a new `WalletPayment(PaymentMethod)` class.

</details>

### Program 39

**Task:** Create a `BaseModel` class whose `__init__` stores any keyword fields in `self.fields`, and whose `save()` returns `"INSERT <fields>"`. Create an `Article` child whose `__init__` takes a `title` and sends it to the parent with `super()`. Override `save()` so it first adds a `slug` (the title in lowercase, with spaces turned into `-`) and then calls the parent's `save()`. Save an article titled `"Hello World"`.

*From E19: What are the different forms of `super()`?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `BaseModel` class whose `__init__(**fields)` stores `self.fields`.
2. `BaseModel.save()` → return `"INSERT <fields>"`.
3. Create `Article(BaseModel)` whose `__init__(title)` → `super().__init__(title=title)`.
4. `Article.save()` → add `slug` = title lowercase, spaces → `-`.
5. Then return `super().save()` → the parent does the real saving.
6. Print `Article("Hello World").save()`.

**Program flow**

```text
Article("Hello World") → super().__init__(title="Hello World") → fields = {'title': 'Hello World'}
.save()                → Article.save adds slug                → fields['slug'] = 'hello-world'
                       → super().save()                        → "INSERT {'title': 'Hello World', 'slug': 'hello-world'}"
```

**Pseudocode**

```text
CLASS BaseModel:
    init(any named fields):  self.fields = fields
    save():                  RETURN "INSERT " + fields

CLASS Article EXTENDS BaseModel:
    init(title):  CALL parent init(title = title)
    save():
        fields["slug"] = LOWERCASE(title) with spaces REPLACED BY "-"
        RETURN parent save()

PRINT Article("Hello World").save()
// INSERT {'title': 'Hello World', 'slug': 'hello-world'}
```

**Code**

```python
class BaseModel:
    def __init__(self, **fields):
        self.fields = fields

    def save(self):
        return f"INSERT {self.fields}"


class Article(BaseModel):
    def __init__(self, title):
        super().__init__(title=title)                 # parent stores the fields

    def save(self):
        self.fields["slug"] = self.fields["title"].lower().replace(" ", "-")
        return super().save()                         # parent does the real saving


print(Article("Hello World").save())
# INSERT {'title': 'Hello World', 'slug': 'hello-world'}
```

**Output:**

```text
INSERT {'title': 'Hello World', 'slug': 'hello-world'}
```

**Fact (why this program):** This uses two forms of `super()`: `super().__init__()` runs the parent's setup, and `super().save()` runs the parent's method after the child adds its own step. It's how you override `save()` in a Django model: add your step, then call `super()`. If you forget `super().save()`, nothing gets saved.

</details>

### Program 40

**Task:** Create a `BaseHandler` whose `handle(request)` prints `"BaseHandler: send response"`. Create `AuthMixin` and `LoggingMixin`, both inheriting from `BaseHandler`. Each prints its own step and then calls `super().handle(request)`. Create `OrderHandler(AuthMixin, LoggingMixin)` with no code, handle one request, and print its MRO.

*From E21: What is the diamond inheritance problem?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `BaseHandler` whose `handle()` → print `"BaseHandler: send response"`.
2. Create `AuthMixin(BaseHandler)` → print `"AuthMixin: check token"`, then `super().handle()`.
3. Create `LoggingMixin(BaseHandler)` → print `"LoggingMixin: log request"`, then `super().handle()`.
4. Create `OrderHandler(AuthMixin, LoggingMixin)` with no code → this makes a diamond.
5. Call `OrderHandler().handle({"path": "/orders"})`.
6. Print the MRO class names.

**Program flow**

```text
MRO of OrderHandler: OrderHandler → AuthMixin → LoggingMixin → BaseHandler → object
OrderHandler.handle  → not in OrderHandler → AuthMixin.handle
AuthMixin.handle     → print "AuthMixin: check token"    → super() = LoggingMixin  (not BaseHandler)
LoggingMixin.handle  → print "LoggingMixin: log request" → super() = BaseHandler
BaseHandler.handle   → print "BaseHandler: send response" → stop (runs once)
```

**Pseudocode**

```text
CLASS BaseHandler:
    handle(request):  PRINT "BaseHandler: send response"

CLASS AuthMixin EXTENDS BaseHandler:
    handle(request):  PRINT "AuthMixin: check token";    CALL next handle(request)

CLASS LoggingMixin EXTENDS BaseHandler:
    handle(request):  PRINT "LoggingMixin: log request"; CALL next handle(request)

CLASS OrderHandler EXTENDS AuthMixin, LoggingMixin:  (nothing)

OrderHandler().handle({"path": "/orders"})
// AuthMixin: check token
// LoggingMixin: log request
// BaseHandler: send response
PRINT MRO names
// ['OrderHandler', 'AuthMixin', 'LoggingMixin', 'BaseHandler', 'object']
```

**Code**

```python
class BaseHandler:
    def handle(self, request):
        print("BaseHandler: send response")


class AuthMixin(BaseHandler):
    def handle(self, request):
        print("AuthMixin: check token")
        super().handle(request)


class LoggingMixin(BaseHandler):
    def handle(self, request):
        print("LoggingMixin: log request")
        super().handle(request)


class OrderHandler(AuthMixin, LoggingMixin):
    pass


OrderHandler().handle({"path": "/orders"})
# AuthMixin: check token
# LoggingMixin: log request
# BaseHandler: send response

print([c.__name__ for c in OrderHandler.__mro__])
# ['OrderHandler', 'AuthMixin', 'LoggingMixin', 'BaseHandler', 'object']
```

**Output:**

```text
AuthMixin: check token
LoggingMixin: log request
BaseHandler: send response
['OrderHandler', 'AuthMixin', 'LoggingMixin', 'BaseHandler', 'object']
```

**Fact (why this program):** Both mixins inherit from `BaseHandler`, which makes a diamond. Because each one calls `super()`, every step runs in MRO order, and the response is sent only **once**. If `AuthMixin` called `BaseHandler.handle(self, request)` directly, the logging step would be skipped.

</details>

### Program 41

**Task:** Sort the list `["banana", "fig", "apple"]` from shortest word to longest, using a `lambda` as the `key` for `sorted()`.

*From E22: What is a lambda function, and when should you avoid it?*

<details>
<summary>Answer</summary>

**Steps**

1. Create `words = ["banana", "fig", "apple"]`.
2. Write a lambda `lambda word: len(word)` → returns each word's length.
3. Pass it as `key` to `sorted()` → sort by length, shortest first.
4. Print the sorted list.

**Program flow**

```text
key for each word → "banana" = 6, "fig" = 3, "apple" = 5
sorted by key     → 3, 5, 6
print             → ['fig', 'apple', 'banana']
```

**Pseudocode**

```text
words = ["banana", "fig", "apple"]
key = FUNCTION(word): RETURN length of word
PRINT words SORTED BY key    // ['fig', 'apple', 'banana']
```

**Code**

```python
words = ["banana", "fig", "apple"]
print(sorted(words, key=lambda word: len(word)))
```

**Output:**

```text
['fig', 'apple', 'banana']
```

**Fact (why this program):** A lambda is a small one-line function with no name. It's ideal for a short `key=` like this. Here `key=len` would also work. For logic with several steps, error handling, or reuse, write a normal `def` function instead.

</details>

### Program 42

**Task:** Given a list of user dicts (`name`, `age`, `active`), keep only the active users with `filter()` and a lambda, then sort them by age, oldest first, and print their names. Then find the oldest user overall with `max()` and `itemgetter("age")`, and print the name.

*From E22: What is a lambda function, and when should you avoid it?*

<details>
<summary>Answer</summary>

**Steps**

1. Import `itemgetter` from `operator`.
2. Create `users`: Asha (30, active), Ravi (25, not active), Meera (35, active).
3. `filter(lambda u: u["active"], users)` → keep active users only.
4. `sorted(..., key=lambda u: u["age"], reverse=True)` → oldest first.
5. Print the names.
6. `max(users, key=itemgetter("age"))` → oldest user overall.
7. Print the name.

**Program flow**

```text
filter active?   → Asha YES, Ravi NO, Meera YES  → [Asha, Meera]
sort by age desc → Meera 35, Asha 30             → ['Meera', 'Asha']
max by age       → 30, 25, 35 → highest is 35    → "Meera"
```

**Pseudocode**

```text
IMPORT itemgetter

users = [Asha 30 active, Ravi 25 not active, Meera 35 active]

active = empty list
FOR EACH user IN users:
    IF user.active THEN ADD user TO active
END FOR

by_age = active SORTED BY age, highest first
PRINT names of by_age          // ['Meera', 'Asha']

oldest = user IN users WITH highest age
PRINT oldest.name              // Meera
```

**Code**

```python
from operator import itemgetter

users = [
    {"name": "Asha", "age": 30, "active": True},
    {"name": "Ravi", "age": 25, "active": False},
    {"name": "Meera", "age": 35, "active": True},
]

active = list(filter(lambda u: u["active"], users))
by_age = sorted(active, key=lambda u: u["age"], reverse=True)
print([u["name"] for u in by_age])            # ['Meera', 'Asha']

oldest = max(users, key=itemgetter("age"))    # same as key=lambda u: u["age"]
print(oldest["name"])                         # Meera
```

**Output:**

```text
['Meera', 'Asha']
Meera
```

**Fact (why this program):** Lambdas are short throwaway functions for `filter()`, `sorted()` and `max()`. For a simple field lookup, `itemgetter("age")` does the same job as `lambda u: u["age"]`. A list comprehension is often clearer than `filter` with a lambda: `[u for u in users if u["active"]]`.

</details>
======================================


---

## 20 Project Skeletons

These are bigger practice projects. Each one combines the patterns above: a class (usually with a parent), attributes, 8 methods, validation, custom exceptions, and a decorator. Build them from a blank file after you're comfortable with the programs.

### 1. Car (`Car` inherits `Vehicle`)

- **Attributes:** `brand`, `registration_number`, `color`, `speed`, `fuel_level`, `engine_on`, `odometer_km`
- **8 methods:** `show()`, `start()`, `stop()`, `accelerate(amount)`, `brake(amount)`, `refuel(litres)`, `repaint(color)`, `drive(km)`
- **Validation:** Require positive amounts for acceleration, braking, refuelling, and distance. Keep speed and fuel within their limits.
- **Exceptions:** `ValueError` for invalid amounts, `EngineOffError` when trying to drive with the engine off, `InsufficientFuelError` when there is too little fuel.
- **Decorator:** `@property` on `is_moving`, computed from `speed > 0`.

**Program:** Write a Python program to create a `Vehicle` class with the attributes `brand`, `registration_number`, and `color`. Create a `Car` class that inherits from `Vehicle` and adds `speed`, `fuel_level`, `engine_on`, and `odometer_km`. A new car starts with zero speed, zero fuel, zero kilometres on the odometer, and its engine off.

Implement these eight methods in `Car`:

1. `show()` returns the car's details for printing.
2. `start()` turns the engine on.
3. `stop()` sets the speed to zero and turns the engine off.
4. `accelerate(amount)` increases the speed up to 180 km/h while the engine is on.
5. `brake(amount)` reduces the speed, with a minimum of 0 km/h.
6. `refuel(litres)` adds fuel up to the 50-litre tank capacity.
7. `repaint(color)` changes the car's color.
8. `drive(km)` adds the travelled distance to the odometer and deducts fuel at a rate of 15 km per litre.

Raise `ValueError` for non-positive or non-finite amounts, `EngineOffError` when attempting to accelerate or drive with the engine off, and `InsufficientFuelError` when there is too little fuel for the trip. Define `is_moving` as a `@property` that returns `True` when the speed is greater than zero.

Create a white Tata car with registration number `JH01AB1234`. Add 10 litres of fuel, start the engine, accelerate by 40 km/h, and print whether the car is moving. Then drive 30 km, brake by 15 km/h, repaint the car blue, and print its updated details. Finally, stop the car and print whether it is still moving.

<details>
<summary>Answer</summary>

```python
class EngineOffError(Exception):
    pass


class InsufficientFuelError(Exception):
    pass


class Vehicle:
    def __init__(self, brand, registration_number, color):
        self.brand = brand
        self.registration_number = registration_number
        self.color = color


class Car(Vehicle):
    MAX_SPEED = 180           # km/h
    TANK_CAPACITY = 50        # litres
    FUEL_EFFICIENCY = 15      # km per litre

    def __init__(self, brand, registration_number, color):
        super().__init__(brand, registration_number, color)
        self.speed = 0
        self.fuel_level = 0
        self.engine_on = False
        self.odometer_km = 0

    @property
    def is_moving(self):
        return self.speed > 0

    def show(self):
        engine_status = "on" if self.engine_on else "off"
        return (
            f"{self.brand} ({self.registration_number}), {self.color} | "
            f"Speed: {self.speed} km/h | Fuel: {self.fuel_level:.2f} L | "
            f"Engine: {engine_status} | Odometer: {self.odometer_km} km"
        )

    def start(self):
        self.engine_on = True

    def stop(self):
        self.speed = 0
        self.engine_on = False

    def accelerate(self, amount):
        if not 0 < amount < float("inf"):
            raise ValueError("Acceleration must be a positive, finite number.")
        if not self.engine_on:
            raise EngineOffError("Start the engine before accelerating.")

        self.speed = min(self.speed + amount, self.MAX_SPEED)

    def brake(self, amount):
        if not 0 < amount < float("inf"):
            raise ValueError("Braking amount must be a positive, finite number.")

        self.speed = max(self.speed - amount, 0)

    def refuel(self, litres):
        if not 0 < litres < float("inf"):
            raise ValueError("Fuel amount must be a positive, finite number.")

        self.fuel_level = min(self.fuel_level + litres, self.TANK_CAPACITY)

    def repaint(self, color):
        self.color = color

    def drive(self, km):
        if not 0 < km < float("inf"):
            raise ValueError("Distance must be a positive, finite number.")
        if not self.engine_on:
            raise EngineOffError("Start the engine before driving.")

        fuel_needed = km / self.FUEL_EFFICIENCY
        if fuel_needed > self.fuel_level:
            raise InsufficientFuelError("There is too little fuel for this trip.")

        self.fuel_level -= fuel_needed
        self.odometer_km += km


car = Car("Tata", "JH01AB1234", "White")

car.refuel(10)
car.start()
car.accelerate(40)
print(car.is_moving)  # True

car.drive(30)         # Uses 2 litres and adds 30 km to the odometer
car.brake(15)         # Reduces speed from 40 to 25 km/h
car.repaint("Blue")
print(car.show())
# Tata (JH01AB1234), Blue | Speed: 25 km/h | Fuel: 8.00 L | Engine: on | Odometer: 30 km

car.stop()
print(car.is_moving)  # False
```

**Output:**

```text
True
Tata (JH01AB1234), Blue | Speed: 25 km/h | Fuel: 8.00 L | Engine: on | Odometer: 30 km
False
```

</details>

### 2. Student form (`StudentForm` inherits `Form`)

- **Attributes:** `form_id`, `student_name`, `age`, `height_cm`, `marks`, `status`, `submitted_at`
- **8 methods:** `fill_details(name, age, height_cm)`, `fill_marks(subject, score)`, `remove_marks(subject)`, `calculate_average()`, `validate()`, `preview()`, `save()`, `submit()`
- **Validation:** Require a name, positive age and height, and marks from 0 to 100. Require at least one subject before submission.
- **Exceptions:** `ValueError` for invalid input, `IncompleteFormError` when required details are missing, `FormAlreadySubmittedError` on a second submission.
- **Decorator:** Custom `@draft_only` on `fill_details()` and `fill_marks()` to block edits after submission.

**Program:** Write a Python program to create a `Form` class with the attributes `form_id`, `status`, and `submitted_at`. Create a `StudentForm` class that inherits from `Form` and adds `student_name`, `age`, `height_cm`, and `marks` (a dictionary of subject to score). A new form starts as a `"draft"` with a blank name, zero age and height, no marks, and no submission time.

Implement these eight methods in `StudentForm`:

1. `fill_details(name, age, height_cm)` stores the student's name, age, and height.
2. `fill_marks(subject, score)` adds or updates the score for a subject, from 0 to 100.
3. `remove_marks(subject)` deletes the score for a subject.
4. `calculate_average()` returns the average score, or 0 when there are no marks.
5. `validate()` checks that the name, age, height, and at least one subject are filled in.
6. `preview()` returns the form's details for printing.
7. `save()` returns the form data as a dictionary, like a saved draft record.
8. `submit()` validates the form, sets the status to `"submitted"`, and records the submission time (it takes an optional `submitted_at` so the output stays fixed).

Raise `ValueError` for a blank name, a non-positive age or height, a score outside 0 to 100, or removing a subject that has no marks. Raise `IncompleteFormError` from `validate()` when required details are missing, and `FormAlreadySubmittedError` on a second submission. Define a custom `@draft_only` decorator with `functools.wraps` and apply it to `fill_details()` and `fill_marks()` so a submitted form cannot be edited.

Create form `F-101` for Ananya Sharma, aged 16 and 158 cm tall. Add marks for Maths (92), Science (85), and Hindi (60), then remove Hindi and print the average. Print the marks from the saved record. Submit the form on 14 November 2026 at 10:30, then print the preview and the submission time. Finally, try to add English marks to the submitted form, and catch and print the `FormAlreadySubmittedError`.

<details>
<summary>Answer</summary>

```python
from datetime import datetime
from functools import wraps


class IncompleteFormError(Exception):
    pass


class FormAlreadySubmittedError(Exception):
    pass


def draft_only(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.status == "submitted":
            raise FormAlreadySubmittedError("A submitted form cannot be edited.")
        return method(self, *args, **kwargs)
    return wrapper


class Form:
    def __init__(self, form_id):
        self.form_id = form_id
        self.status = "draft"
        self.submitted_at = None


class StudentForm(Form):
    MIN_SCORE = 0
    MAX_SCORE = 100

    def __init__(self, form_id):
        super().__init__(form_id)
        self.student_name = ""
        self.age = 0
        self.height_cm = 0
        self.marks = {}

    @draft_only
    def fill_details(self, name, age, height_cm):
        if not name.strip():
            raise ValueError("Name cannot be blank.")
        if age <= 0 or height_cm <= 0:
            raise ValueError("Age and height must be positive.")

        self.student_name = name.strip()
        self.age = age
        self.height_cm = height_cm

    @draft_only
    def fill_marks(self, subject, score):
        if not self.MIN_SCORE <= score <= self.MAX_SCORE:
            raise ValueError("Score must be between 0 and 100.")

        self.marks[subject] = score

    def remove_marks(self, subject):
        if subject not in self.marks:
            raise ValueError(f"No marks found for {subject}.")

        del self.marks[subject]

    def calculate_average(self):
        if not self.marks:
            return 0
        return sum(self.marks.values()) / len(self.marks)

    def validate(self):
        if not self.student_name or self.age <= 0 or self.height_cm <= 0:
            raise IncompleteFormError("Fill in name, age, and height.")
        if not self.marks:
            raise IncompleteFormError("Add marks for at least one subject.")
        return True

    def preview(self):
        return (
            f"Form {self.form_id} [{self.status}] | {self.student_name}, "
            f"{self.age} yrs, {self.height_cm} cm | Marks: {self.marks} | "
            f"Average: {self.calculate_average():.2f}"
        )

    def save(self):
        return {
            "form_id": self.form_id,
            "student_name": self.student_name,
            "age": self.age,
            "height_cm": self.height_cm,
            "marks": dict(self.marks),
            "status": self.status,
        }

    def submit(self, submitted_at=None):
        if self.status == "submitted":
            raise FormAlreadySubmittedError("This form is already submitted.")
        self.validate()

        self.status = "submitted"
        self.submitted_at = submitted_at or datetime.now()


form = StudentForm("F-101")

form.fill_details("Ananya Sharma", 16, 158)
form.fill_marks("Maths", 92)
form.fill_marks("Science", 85)
form.fill_marks("Hindi", 60)
form.remove_marks("Hindi")
print(form.calculate_average())  # 88.5

print(form.save()["marks"])      # {'Maths': 92, 'Science': 85}

form.submit(datetime(2026, 11, 14, 10, 30))
print(form.preview())
# Form F-101 [submitted] | Ananya Sharma, 16 yrs, 158 cm | Marks: {'Maths': 92, 'Science': 85} | Average: 88.50
print(form.submitted_at)         # 2026-11-14 10:30:00

try:
    form.fill_marks("English", 78)
except FormAlreadySubmittedError as error:
    print(type(error).__name__, "-", error)
```

**Output:**

```text
88.5
{'Maths': 92, 'Science': 85}
Form F-101 [submitted] | Ananya Sharma, 16 yrs, 158 cm | Marks: {'Maths': 92, 'Science': 85} | Average: 88.50
2026-11-14 10:30:00
FormAlreadySubmittedError - A submitted form cannot be edited.
```

</details>

### 3. Dog (`Dog` inherits `Animal`)

- **Attributes:** `name`, `age`, `size`, `breed`, `energy`, `is_sleeping`, `tricks`
- **8 methods:** `bark()`, `eat(food)`, `sleep()`, `wake_up()`, `walk(minutes)`, `play(minutes)`, `learn_trick(name)`, `perform_trick(name)`
- **Validation:** Allow `small`, `medium`, or `large` for size. Keep energy between 0 and 100 and require positive activity duration.
- **Exceptions:** `ValueError` for invalid size or duration, `DogSleepingError` when trying to play while asleep, `UnknownTrickError` for an unlearned trick.
- **Decorator:** `@abstractmethod` on `Animal.eat()` if you make `Animal` an abstract base class. Implement `eat()` in `Dog`.

**Program:** Write a Python program to create an abstract `Animal` class (using `abc.ABC`) with the attributes `name`, `age`, and `size`, where size must be `small`, `medium`, or `large`. Create a `Dog` class that inherits from `Animal` and adds `breed`, `energy`, `is_sleeping`, and `tricks` (a list). A new dog starts with 50 energy, awake, and with no tricks.

Implement these eight methods in `Dog`:

1. `bark()` returns the dog's bark as a string.
2. `eat(food)` adds 20 energy, up to a maximum of 100.
3. `sleep()` puts the dog to sleep.
4. `wake_up()` wakes the dog and restores its energy to 100.
5. `walk(minutes)` uses 1 energy per minute, with a minimum of 0.
6. `play(minutes)` uses 2 energy per minute, with a minimum of 0.
7. `learn_trick(name)` adds a trick if the dog does not know it yet.
8. `perform_trick(name)` returns a message for a trick the dog has learned.

Raise `ValueError` for an unknown size or a non-positive duration, `DogSleepingError` when trying to walk or play while the dog is asleep, and `UnknownTrickError` for a trick the dog has not learned. Mark `Animal.eat()` with `@abstractmethod` so every animal must implement its own `eat()`, and implement it in `Dog`.

Create a medium-sized, 3-year-old Indian Pariah dog named Bruno. Print his bark and feed him chicken rice. Walk him for 30 minutes, play for 10 minutes, and print his energy. Teach him "sit" and "shake hands", then print the result of performing "sit". Put him to sleep, wake him up, and print his energy and tricks. Finally, put him to sleep again, try to play for 15 minutes, and catch and print the `DogSleepingError`.

<details>
<summary>Answer</summary>

```python
from abc import ABC, abstractmethod


class DogSleepingError(Exception):
    pass


class UnknownTrickError(Exception):
    pass


class Animal(ABC):
    SIZES = ("small", "medium", "large")

    def __init__(self, name, age, size):
        if size not in self.SIZES:
            raise ValueError(f"Size must be one of {self.SIZES}.")

        self.name = name
        self.age = age
        self.size = size

    @abstractmethod
    def eat(self, food):
        pass


class Dog(Animal):
    MAX_ENERGY = 100
    MEAL_ENERGY = 20          # energy gained per meal
    WALK_COST = 1             # energy per minute of walking
    PLAY_COST = 2             # energy per minute of playing

    def __init__(self, name, age, size, breed):
        super().__init__(name, age, size)
        self.breed = breed
        self.energy = 50
        self.is_sleeping = False
        self.tricks = []

    def bark(self):
        return f"{self.name} says Woof!"

    def eat(self, food):
        self.energy = min(self.energy + self.MEAL_ENERGY, self.MAX_ENERGY)
        return f"{self.name} ate {food}."

    def sleep(self):
        self.is_sleeping = True

    def wake_up(self):
        self.is_sleeping = False
        self.energy = self.MAX_ENERGY

    def walk(self, minutes):
        self._use_energy(minutes, self.WALK_COST)

    def play(self, minutes):
        self._use_energy(minutes, self.PLAY_COST)

    def learn_trick(self, name):
        if name not in self.tricks:
            self.tricks.append(name)

    def perform_trick(self, name):
        if name not in self.tricks:
            raise UnknownTrickError(f"{self.name} has not learned '{name}'.")
        return f"{self.name} performs {name}!"

    def _use_energy(self, minutes, cost_per_minute):
        if minutes <= 0:
            raise ValueError("Duration must be a positive number of minutes.")
        if self.is_sleeping:
            raise DogSleepingError(f"{self.name} is asleep. Wake him up first.")

        self.energy = max(self.energy - minutes * cost_per_minute, 0)


dog = Dog("Bruno", 3, "medium", "Indian Pariah")

print(dog.bark())                 # Bruno says Woof!
print(dog.eat("chicken rice"))    # Bruno ate chicken rice.
dog.walk(30)                      # Energy 70 -> 40
dog.play(10)                      # Energy 40 -> 20
print(dog.energy)                 # 20

dog.learn_trick("sit")
dog.learn_trick("shake hands")
print(dog.perform_trick("sit"))   # Bruno performs sit!

dog.sleep()
dog.wake_up()
print(dog.energy, dog.tricks)     # 100 ['sit', 'shake hands']

dog.sleep()
try:
    dog.play(15)
except DogSleepingError as error:
    print(type(error).__name__, "-", error)
```

**Output:**

```text
Bruno says Woof!
Bruno ate chicken rice.
20
Bruno performs sit!
100 ['sit', 'shake hands']
DogSleepingError - Bruno is asleep. Wake him up first.
```

</details>

### 4. Savings account (`SavingsAccount` inherits `BankAccount`)

- **Attributes:** `account_number`, `holder_name`, `balance`, `interest_rate`, `is_frozen`, `transactions`
- **8 methods:** `deposit(amount)`, `withdraw(amount)`, `transfer_to(account, amount)`, `calculate_interest()`, `apply_interest()`, `show_statement()`, `freeze()`, `unfreeze()`
- **Validation:** Require positive transaction amounts. Verify that a transfer can succeed before changing either balance.
- **Exceptions:** `ValueError` for invalid amounts, `InsufficientBalanceError` for an overdraft, `AccountFrozenError` when a frozen account tries to move money.
- **Decorator:** Custom `@active_account` on `deposit()`, `withdraw()`, and `transfer_to()`.

**Program:** Write a Python program to create a `BankAccount` class with the attributes `account_number`, `holder_name`, `balance`, and `transactions` (a list). Create a `SavingsAccount` class that inherits from `BankAccount` and adds `interest_rate` (4% a year by default) and `is_frozen`. A new account starts with the given opening balance, no transactions, and not frozen.

Implement these eight methods in `SavingsAccount`:

1. `deposit(amount)` adds money to the balance.
2. `withdraw(amount)` takes money out if the balance is enough.
3. `transfer_to(account, amount)` moves money to another account after checking that the transfer can succeed.
4. `calculate_interest()` returns one year's interest on the current balance, rounded to 2 decimal places.
5. `apply_interest()` adds that interest to the balance.
6. `show_statement()` returns every transaction with the balance after it.
7. `freeze()` blocks money movement on the account.
8. `unfreeze()` allows money movement again.

Raise `ValueError` for non-positive or non-finite amounts, `InsufficientBalanceError` when a withdrawal or transfer is larger than the balance, and `AccountFrozenError` when a frozen account tries to move money or a transfer targets a frozen account. Define a custom `@active_account` decorator with `functools.wraps` and apply it to `deposit()`, `withdraw()`, and `transfer_to()`.

Open account `SB1001` for Ravi Kumar with Rs. 10,000 and account `SB1002` for Meena Iyer with Rs. 2,000. Ravi deposits Rs. 5,000, withdraws Rs. 3,000, and transfers Rs. 2,000 to Meena. Print Ravi's yearly interest, apply it, and print his statement and Meena's balance. Finally, freeze Meena's account, try to withdraw Rs. 500 from it, and catch and print the `AccountFrozenError`.

<details>
<summary>Answer</summary>

```python
from functools import wraps


class InsufficientBalanceError(Exception):
    pass


class AccountFrozenError(Exception):
    pass


def active_account(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.is_frozen:
            raise AccountFrozenError(f"Account {self.account_number} is frozen.")
        return method(self, *args, **kwargs)
    return wrapper


class BankAccount:
    def __init__(self, account_number, holder_name, balance=0):
        self.account_number = account_number
        self.holder_name = holder_name
        self.balance = balance
        self.transactions = []


class SavingsAccount(BankAccount):
    def __init__(self, account_number, holder_name, balance=0, interest_rate=4.0):
        super().__init__(account_number, holder_name, balance)
        self.interest_rate = interest_rate      # percent per year
        self.is_frozen = False

    @active_account
    def deposit(self, amount):
        self._check_amount(amount)
        self.balance += amount
        self.transactions.append(("Deposit", amount, self.balance))

    @active_account
    def withdraw(self, amount):
        self._check_amount(amount)
        if amount > self.balance:
            raise InsufficientBalanceError("Balance is too low for this withdrawal.")

        self.balance -= amount
        self.transactions.append(("Withdraw", amount, self.balance))

    @active_account
    def transfer_to(self, account, amount):
        self._check_amount(amount)
        if account.is_frozen:
            raise AccountFrozenError(f"Account {account.account_number} is frozen.")
        if amount > self.balance:
            raise InsufficientBalanceError("Balance is too low for this transfer.")

        self.balance -= amount
        account.balance += amount
        self.transactions.append((f"Transfer to {account.account_number}", amount, self.balance))
        account.transactions.append((f"Transfer from {self.account_number}", amount, account.balance))

    def calculate_interest(self):
        return round(self.balance * self.interest_rate / 100, 2)

    def apply_interest(self):
        interest = self.calculate_interest()
        self.balance += interest
        self.transactions.append(("Interest", interest, self.balance))

    def show_statement(self):
        lines = [f"Statement for {self.holder_name} ({self.account_number})"]
        for kind, amount, balance in self.transactions:
            lines.append(f"{kind}: Rs. {amount:.2f} | Balance: Rs. {balance:.2f}")
        return "\n".join(lines)

    def freeze(self):
        self.is_frozen = True

    def unfreeze(self):
        self.is_frozen = False

    @staticmethod
    def _check_amount(amount):
        if not 0 < amount < float("inf"):
            raise ValueError("Amount must be a positive, finite number.")


ravi = SavingsAccount("SB1001", "Ravi Kumar", 10000)
meena = SavingsAccount("SB1002", "Meena Iyer", 2000)

ravi.deposit(5000)
ravi.withdraw(3000)
ravi.transfer_to(meena, 2000)
print(ravi.calculate_interest())  # 400.0
ravi.apply_interest()
print(ravi.show_statement())
# Statement for Ravi Kumar (SB1001)
# Deposit: Rs. 5000.00 | Balance: Rs. 15000.00
# Withdraw: Rs. 3000.00 | Balance: Rs. 12000.00
# Transfer to SB1002: Rs. 2000.00 | Balance: Rs. 10000.00
# Interest: Rs. 400.00 | Balance: Rs. 10400.00
print(meena.balance)              # 4000

meena.freeze()
try:
    meena.withdraw(500)
except AccountFrozenError as error:
    print(type(error).__name__, "-", error)
```

**Output:**

```text
400.0
Statement for Ravi Kumar (SB1001)
Deposit: Rs. 5000.00 | Balance: Rs. 15000.00
Withdraw: Rs. 3000.00 | Balance: Rs. 12000.00
Transfer to SB1002: Rs. 2000.00 | Balance: Rs. 10000.00
Interest: Rs. 400.00 | Balance: Rs. 10400.00
4000
AccountFrozenError - Account SB1002 is frozen.
```

</details>

### 5. Library book (`LibraryBook` inherits `LibraryItem`)

- **Attributes:** `item_id`, `title`, `author`, `isbn`, `borrower_id`, `due_date`, `reserved_by`
- **8 methods:** `show_details()`, `borrow(member_id, due_date)`, `return_book()`, `renew(new_due_date)`, `reserve(member_id)`, `cancel_reservation(member_id)`, `calculate_late_fee(as_of_date)`, `update_title(title)`
- **Validation:** Require a title and a future due date for a new loan. Block renewal if another member holds the reservation.
- **Exceptions:** `BookUnavailableError` for borrowing an unavailable book, `BookNotBorrowedError` for returning a book without an active loan.
- **Decorator:** `@property` on `is_borrowed`, computed from `borrower_id`.

**Program:** Write a Python program to create a `LibraryItem` class with the attributes `item_id` and `title`, where the title cannot be blank. Create a `LibraryBook` class that inherits from `LibraryItem` and adds `author`, `isbn`, `borrower_id`, `due_date`, and `reserved_by`. A new book starts with no borrower, no due date, and no reservation.

Implement these eight methods in `LibraryBook`:

1. `show_details()` returns the book's details, loan status, and reservation for printing.
2. `borrow(member_id, due_date)` lends the book to a member until the due date (it takes an optional `today` so the output stays fixed).
3. `return_book()` ends the current loan.
4. `renew(new_due_date)` moves the due date later.
5. `reserve(member_id)` lets another member reserve the book.
6. `cancel_reservation(member_id)` removes that member's reservation.
7. `calculate_late_fee(as_of_date)` returns Rs. 5 for each day past the due date.
8. `update_title(title)` changes the book's title.

Raise `ValueError` for a blank title, a due date that is not in the future, a renewal date that is not after the current due date, or an invalid reservation change. Raise `BookUnavailableError` when borrowing a book that is on loan or reserved by someone else, reserving a book that is already reserved, or renewing a book that another member has reserved. Raise `BookNotBorrowedError` when returning or renewing a book that is not on loan. Define `is_borrowed` as a `@property` that returns `True` when the book has a borrower.

Create book `B-501`, *Wings of Fire* by A. P. J. Abdul Kalam. On 14 November 2026, member `M101` borrows it until 28 November 2026. Print whether it is borrowed, renew it until 5 December 2026, and let member `M205` reserve it. Print the late fee as of 8 December 2026, change the title to *Wings of Fire: An Autobiography*, and print the book's details. Finally, try to renew the book again for `M101`, and catch and print the `BookUnavailableError`.

<details>
<summary>Answer</summary>

```python
from datetime import date


class BookUnavailableError(Exception):
    pass


class BookNotBorrowedError(Exception):
    pass


class LibraryItem:
    def __init__(self, item_id, title):
        if not title.strip():
            raise ValueError("Title cannot be blank.")

        self.item_id = item_id
        self.title = title.strip()


class LibraryBook(LibraryItem):
    LATE_FEE_PER_DAY = 5      # rupees

    def __init__(self, item_id, title, author, isbn):
        super().__init__(item_id, title)
        self.author = author
        self.isbn = isbn
        self.borrower_id = None
        self.due_date = None
        self.reserved_by = None

    @property
    def is_borrowed(self):
        return self.borrower_id is not None

    def show_details(self):
        status = f"borrowed by {self.borrower_id}, due {self.due_date}" if self.is_borrowed else "available"
        reserved = self.reserved_by or "none"
        return (
            f"{self.item_id}: {self.title} by {self.author} (ISBN {self.isbn}) | "
            f"Status: {status} | Reserved by: {reserved}"
        )

    def borrow(self, member_id, due_date, today=None):
        today = today or date.today()
        if self.is_borrowed:
            raise BookUnavailableError("This book is already on loan.")
        if self.reserved_by and self.reserved_by != member_id:
            raise BookUnavailableError(f"This book is reserved by {self.reserved_by}.")
        if due_date <= today:
            raise ValueError("Due date must be in the future.")

        self.borrower_id = member_id
        self.due_date = due_date
        if self.reserved_by == member_id:
            self.reserved_by = None

    def return_book(self):
        if not self.is_borrowed:
            raise BookNotBorrowedError("This book is not on loan.")

        self.borrower_id = None
        self.due_date = None

    def renew(self, new_due_date):
        if not self.is_borrowed:
            raise BookNotBorrowedError("Only a borrowed book can be renewed.")
        if self.reserved_by and self.reserved_by != self.borrower_id:
            raise BookUnavailableError(f"Cannot renew: reserved by {self.reserved_by}.")
        if new_due_date <= self.due_date:
            raise ValueError("New due date must be after the current one.")

        self.due_date = new_due_date

    def reserve(self, member_id):
        if self.reserved_by:
            raise BookUnavailableError(f"Already reserved by {self.reserved_by}.")
        if member_id == self.borrower_id:
            raise ValueError("The current borrower cannot reserve this book.")

        self.reserved_by = member_id

    def cancel_reservation(self, member_id):
        if self.reserved_by != member_id:
            raise ValueError(f"{member_id} has no reservation on this book.")

        self.reserved_by = None

    def calculate_late_fee(self, as_of_date):
        if not self.is_borrowed or as_of_date <= self.due_date:
            return 0
        return (as_of_date - self.due_date).days * self.LATE_FEE_PER_DAY

    def update_title(self, title):
        if not title.strip():
            raise ValueError("Title cannot be blank.")

        self.title = title.strip()


book = LibraryBook("B-501", "Wings of Fire", "A. P. J. Abdul Kalam", "9788173711466")

book.borrow("M101", date(2026, 11, 28), today=date(2026, 11, 14))
print(book.is_borrowed)                             # True
book.renew(date(2026, 12, 5))
book.reserve("M205")
print(book.calculate_late_fee(date(2026, 12, 8)))   # 15
book.update_title("Wings of Fire: An Autobiography")
print(book.show_details())
# B-501: Wings of Fire: An Autobiography by A. P. J. Abdul Kalam (ISBN 9788173711466) | Status: borrowed by M101, due 2026-12-05 | Reserved by: M205

try:
    book.renew(date(2026, 12, 12))
except BookUnavailableError as error:
    print(type(error).__name__, "-", error)
```

**Output:**

```text
True
15
B-501: Wings of Fire: An Autobiography by A. P. J. Abdul Kalam (ISBN 9788173711466) | Status: borrowed by M101, due 2026-12-05 | Reserved by: M205
BookUnavailableError - Cannot renew: reserved by M205.
```

</details>

### 6. Shopping cart (`ShoppingCart`)

- **Attributes:** `cart_id`, `customer_id`, `items`, `coupon_code`, `discount_percent`, `status`
- **8 methods:** `add_item(product, qty)`, `remove_item(product_id)`, `update_quantity(product_id, qty)`, `apply_coupon(code)`, `remove_coupon()`, `calculate_total()`, `clear()`, `checkout()`
- **Validation:** Require positive whole-number quantities and an eligible coupon. Recheck stock at checkout.
- **Exceptions:** `ValueError` for invalid quantities, `InvalidCouponError`, `EmptyCartError`, `OutOfStockError`.
- **Decorator:** `@property` on `item_count`, computed by summing the quantities.

**Program:** Write a Python program to create a `ShoppingCart` class with the attributes `cart_id`, `customer_id`, `items` (a dictionary of product ID to product and quantity), `coupon_code`, `discount_percent`, and `status`. Each product is a dictionary with `id`, `name`, `price`, and `stock`. A new cart starts empty, with no coupon, 0% discount, and the status `"open"`. Two coupons exist: `SAVE10` gives 10% off orders of at least Rs. 1,000, and `FEST20` gives 20% off orders of at least Rs. 5,000.

Implement these eight methods in `ShoppingCart`:

1. `add_item(product, qty)` adds a product, or increases its quantity if it is already in the cart.
2. `remove_item(product_id)` removes a product from the cart.
3. `update_quantity(product_id, qty)` sets a new quantity for a product in the cart.
4. `apply_coupon(code)` applies a known coupon when the order meets its minimum amount.
5. `remove_coupon()` removes the coupon and its discount.
6. `calculate_total()` returns the subtotal minus the coupon discount.
7. `clear()` empties the cart and removes the coupon.
8. `checkout()` rechecks stock, reduces each product's stock, sets the status to `"checked_out"`, and returns the total.

Raise `ValueError` for a quantity that is not a positive whole number, `InvalidCouponError` for an unknown coupon or an order below the coupon's minimum, `EmptyCartError` when checking out an empty cart, and `OutOfStockError` when a quantity is more than the stock, both when adding items and again at checkout. Raise `KeyError` when removing or updating a product that is not in the cart. Define `item_count` as a `@property` that returns the sum of all quantities.

Create cart `C-9001` for customer `CUST-42`. Add one 5 kg bag of basmati rice (Rs. 650), two 1 kg packs of toor dal (Rs. 180 each), and one litre of ghee (Rs. 620, 3 in stock). Apply coupon `SAVE10` and print the total. Change the dal quantity to 1, then print the item count and the new total. Finally, set the ghee stock to 0 as if another customer bought it, try to check out, and catch and print the `OutOfStockError`.

<details>
<summary>Answer</summary>

```python
class InvalidCouponError(Exception):
    pass


class EmptyCartError(Exception):
    pass


class OutOfStockError(Exception):
    pass


class ShoppingCart:
    # code: (discount percent, minimum order in rupees)
    COUPONS = {"SAVE10": (10, 1000), "FEST20": (20, 5000)}

    def __init__(self, cart_id, customer_id):
        self.cart_id = cart_id
        self.customer_id = customer_id
        self.items = {}               # product_id -> {"product": ..., "qty": ...}
        self.coupon_code = None
        self.discount_percent = 0
        self.status = "open"

    @property
    def item_count(self):
        return sum(entry["qty"] for entry in self.items.values())

    def add_item(self, product, qty):
        self._check_qty(qty)
        current = self.items.get(product["id"], {"qty": 0})["qty"]
        if current + qty > product["stock"]:
            raise OutOfStockError(f"Only {product['stock']} of {product['name']} in stock.")

        self.items[product["id"]] = {"product": product, "qty": current + qty}

    def remove_item(self, product_id):
        if product_id not in self.items:
            raise KeyError(f"{product_id} is not in the cart.")

        del self.items[product_id]

    def update_quantity(self, product_id, qty):
        self._check_qty(qty)
        if product_id not in self.items:
            raise KeyError(f"{product_id} is not in the cart.")
        product = self.items[product_id]["product"]
        if qty > product["stock"]:
            raise OutOfStockError(f"Only {product['stock']} of {product['name']} in stock.")

        self.items[product_id]["qty"] = qty

    def apply_coupon(self, code):
        if code not in self.COUPONS:
            raise InvalidCouponError(f"{code} is not a valid coupon.")
        percent, min_order = self.COUPONS[code]
        if self._subtotal() < min_order:
            raise InvalidCouponError(f"{code} needs an order of at least Rs. {min_order}.")

        self.coupon_code = code
        self.discount_percent = percent

    def remove_coupon(self):
        self.coupon_code = None
        self.discount_percent = 0

    def calculate_total(self):
        return self._subtotal() * (100 - self.discount_percent) / 100

    def clear(self):
        self.items.clear()
        self.remove_coupon()

    def checkout(self):
        if not self.items:
            raise EmptyCartError("Add items before checking out.")
        for entry in self.items.values():
            if entry["qty"] > entry["product"]["stock"]:
                raise OutOfStockError(f"{entry['product']['name']} is now out of stock.")

        for entry in self.items.values():
            entry["product"]["stock"] -= entry["qty"]
        self.status = "checked_out"
        return self.calculate_total()

    def _subtotal(self):
        return sum(e["product"]["price"] * e["qty"] for e in self.items.values())

    @staticmethod
    def _check_qty(qty):
        if not isinstance(qty, int) or qty <= 0:
            raise ValueError("Quantity must be a positive whole number.")


rice = {"id": "P1", "name": "Basmati Rice 5 kg", "price": 650, "stock": 10}
dal = {"id": "P2", "name": "Toor Dal 1 kg", "price": 180, "stock": 8}
ghee = {"id": "P3", "name": "Ghee 1 L", "price": 620, "stock": 3}

cart = ShoppingCart("C-9001", "CUST-42")

cart.add_item(rice, 1)
cart.add_item(dal, 2)
cart.add_item(ghee, 1)
cart.apply_coupon("SAVE10")
print(cart.calculate_total())     # 1467.0

cart.update_quantity("P2", 1)     # Subtotal 1450, 10% off
print(cart.item_count)            # 3
print(cart.calculate_total())     # 1305.0

ghee["stock"] = 0                 # Another customer bought the last ghee
try:
    cart.checkout()
except OutOfStockError as error:
    print(type(error).__name__, "-", error)
```

**Output:**

```text
1467.0
3
1305.0
OutOfStockError - Ghee 1 L is now out of stock.
```

</details>

### 7. Salaried employee (`SalariedEmployee` inherits `Employee`)

- **Attributes:** `employee_id`, `name`, `department`, `monthly_salary`, `bonus`, `leave_balance`, `employment_status`
- **8 methods:** `show_profile()`, `calculate_gross_pay()`, `add_bonus(amount)`, `give_raise(percent)`, `request_leave(days)`, `restore_leave(days)`, `change_department(name)`, `deactivate()`
- **Validation:** Require nonnegative salary, positive bonus and raise amounts, and enough leave for each request.
- **Exceptions:** `ValueError` for invalid amounts, `InsufficientLeaveError`, `InactiveEmployeeError`.
- **Decorator:** Custom `@active_employee` on `request_leave()` and `change_department()`.

**Program:** Write a Python program to create an `Employee` class with the attributes `employee_id`, `name`, and `department`. Create a `SalariedEmployee` class that inherits from `Employee` and adds `monthly_salary`, `bonus`, `leave_balance`, and `employment_status`. A new employee starts with zero bonus, 24 days of leave, and the status `active`. The monthly salary must not be negative.

Implement these eight methods in `SalariedEmployee`:

1. `show_profile()` returns the employee's details for printing.
2. `calculate_gross_pay()` returns the monthly salary plus the bonus.
3. `add_bonus(amount)` adds to the bonus.
4. `give_raise(percent)` increases the monthly salary by the given percentage.
5. `request_leave(days)` deducts whole days from the leave balance.
6. `restore_leave(days)` adds days back, up to the 24-day maximum.
7. `change_department(name)` moves the employee to a new department.
8. `deactivate()` sets the status to `inactive`.

Raise `ValueError` for a negative salary, non-positive bonus or raise amounts, non-positive leave days, or an empty department name. Raise `InsufficientLeaveError` when the request is larger than the leave balance. Define a custom `@active_employee` decorator on `request_leave()` and `change_department()` that raises `InactiveEmployeeError` when the employee is no longer active.

Create employee `E101`, Priya Sharma, in the Finance department with a monthly salary of Rs. 60,000. Add a bonus of Rs. 5,000, give a 10% raise, and print the gross pay. Then request 5 days of leave, restore 2 days, move her to Data Science, and print her profile. Finally, deactivate her, try to move her to Marketing, and print the error.

<details>
<summary>Answer</summary>

```python
from functools import wraps


class InsufficientLeaveError(Exception):
    pass


class InactiveEmployeeError(Exception):
    pass


def active_employee(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.employment_status != "active":
            raise InactiveEmployeeError(f"{self.name} is no longer an active employee.")
        return method(self, *args, **kwargs)
    return wrapper


class Employee:
    def __init__(self, employee_id, name, department):
        self.employee_id = employee_id
        self.name = name
        self.department = department


class SalariedEmployee(Employee):
    MAX_LEAVE = 24            # days per year

    def __init__(self, employee_id, name, department, monthly_salary):
        if not 0 <= monthly_salary < float("inf"):
            raise ValueError("Salary must be a nonnegative, finite number.")

        super().__init__(employee_id, name, department)
        self.monthly_salary = monthly_salary
        self.bonus = 0
        self.leave_balance = self.MAX_LEAVE
        self.employment_status = "active"

    def show_profile(self):
        return (
            f"{self.employee_id} {self.name}, {self.department} | "
            f"Salary: Rs. {self.monthly_salary:,.2f} | Bonus: Rs. {self.bonus:,.2f} | "
            f"Leave: {self.leave_balance} days | Status: {self.employment_status}"
        )

    def calculate_gross_pay(self):
        return self.monthly_salary + self.bonus

    def add_bonus(self, amount):
        if not 0 < amount < float("inf"):
            raise ValueError("Bonus must be a positive, finite number.")

        self.bonus += amount

    def give_raise(self, percent):
        if not 0 < percent < float("inf"):
            raise ValueError("Raise must be a positive, finite percentage.")

        self.monthly_salary += self.monthly_salary * percent / 100

    @active_employee
    def request_leave(self, days):
        if not isinstance(days, int) or days <= 0:
            raise ValueError("Leave days must be a positive whole number.")
        if days > self.leave_balance:
            raise InsufficientLeaveError(
                f"Only {self.leave_balance} leave days are left."
            )

        self.leave_balance -= days

    def restore_leave(self, days):
        if not isinstance(days, int) or days <= 0:
            raise ValueError("Leave days must be a positive whole number.")

        self.leave_balance = min(self.leave_balance + days, self.MAX_LEAVE)

    @active_employee
    def change_department(self, name):
        if not name.strip():
            raise ValueError("Department name cannot be empty.")

        self.department = name.strip()

    def deactivate(self):
        self.employment_status = "inactive"


employee = SalariedEmployee("E101", "Priya Sharma", "Finance", 60000)

employee.add_bonus(5000)
employee.give_raise(10)              # Salary goes from 60,000 to 66,000
print(employee.calculate_gross_pay())  # 71000.0

employee.request_leave(5)
employee.restore_leave(2)            # Leave goes from 19 back to 21 days
employee.change_department("Data Science")
print(employee.show_profile())
# E101 Priya Sharma, Data Science | Salary: Rs. 66,000.00 | Bonus: Rs. 5,000.00 | Leave: 21 days | Status: active

employee.deactivate()

try:
    employee.change_department("Marketing")
except InactiveEmployeeError as error:
    print(type(error).__name__, "-", error)
    # InactiveEmployeeError - Priya Sharma is no longer an active employee.
```

**Output:**

```text
71000.0
E101 Priya Sharma, Data Science | Salary: Rs. 66,000.00 | Bonus: Rs. 5,000.00 | Leave: 21 days | Status: active
InactiveEmployeeError - Priya Sharma is no longer an active employee.
```

</details>

### 8. Restaurant order (`RestaurantOrder` inherits `Order`)

- **Attributes:** `order_id`, `table_number`, `items`, `special_instructions`, `status`, `tax_rate`
- **8 methods:** `add_dish(dish, qty)`, `remove_dish(dish_id)`, `add_instruction(text)`, `calculate_total()`, `send_to_kitchen()`, `mark_ready()`, `serve()`, `cancel()`
- **Validation:** Require a positive table number and quantity. Require at least one dish before sending the order. Follow the sequence draft → cooking → ready → served.
- **Exceptions:** `EmptyOrderError`, `InvalidOrderStatusError`.
- **Decorator:** Custom `@draft_only` on `add_dish()` and `remove_dish()` to prevent edits after the kitchen receives the order.

**Program:** Write a Python program to create an `Order` class with the attributes `order_id`, `items`, and `status`. Create a `RestaurantOrder` class that inherits from `Order` and adds `table_number`, `special_instructions`, and `tax_rate`. A new order starts with no items, no instructions, the status `draft`, and a 5% GST rate. Each dish is a dictionary with an `id`, `name`, and `price`.

Implement these eight methods in `RestaurantOrder`:

1. `add_dish(dish, qty)` adds a dish, or increases its quantity if it is already in the order.
2. `remove_dish(dish_id)` removes a dish from the order.
3. `add_instruction(text)` adds a special instruction for the kitchen.
4. `calculate_total()` returns the subtotal plus tax.
5. `send_to_kitchen()` moves the order from `draft` to `cooking`.
6. `mark_ready()` moves the order from `cooking` to `ready`.
7. `serve()` moves the order from `ready` to `served`.
8. `cancel()` cancels a `draft` or `cooking` order.

Raise `ValueError` for a non-positive table number or quantity, or an empty instruction, and `KeyError` for removing a dish that is not in the order. Raise `EmptyOrderError` when sending an order with no dishes, and `InvalidOrderStatusError` when a step is out of sequence. Define a custom `@draft_only` decorator on `add_dish()` and `remove_dish()` that raises `InvalidOrderStatusError` once the kitchen has the order.

Create order `ORD-501` for table 7. Add one Paneer Butter Masala (Rs. 280), four Butter Naan (Rs. 50 each), and two Sweet Lassi (Rs. 90 each), then remove the lassi. Add the instruction "Less spicy" and print the total with tax. Send the order to the kitchen, mark it ready, serve it, and print its status and instructions. Finally, try to add a lassi to the served order and print the error.

<details>
<summary>Answer</summary>

```python
from functools import wraps


class EmptyOrderError(Exception):
    pass


class InvalidOrderStatusError(Exception):
    pass


def draft_only(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.status != "draft":
            raise InvalidOrderStatusError(
                f"Order {self.order_id} is already '{self.status}' and cannot be edited."
            )
        return method(self, *args, **kwargs)
    return wrapper


class Order:
    def __init__(self, order_id):
        self.order_id = order_id
        self.items = {}
        self.status = "draft"


class RestaurantOrder(Order):
    TAX_RATE = 5              # percent GST

    def __init__(self, order_id, table_number):
        if not isinstance(table_number, int) or table_number <= 0:
            raise ValueError("Table number must be a positive whole number.")

        super().__init__(order_id)
        self.table_number = table_number
        self.special_instructions = []
        self.tax_rate = self.TAX_RATE

    @draft_only
    def add_dish(self, dish, qty):
        if not isinstance(qty, int) or qty <= 0:
            raise ValueError("Quantity must be a positive whole number.")

        if dish["id"] in self.items:
            self.items[dish["id"]]["qty"] += qty
        else:
            self.items[dish["id"]] = {"name": dish["name"], "price": dish["price"], "qty": qty}

    @draft_only
    def remove_dish(self, dish_id):
        if dish_id not in self.items:
            raise KeyError(f"Dish {dish_id} is not in this order.")

        del self.items[dish_id]

    def add_instruction(self, text):
        if not text.strip():
            raise ValueError("Instruction cannot be empty.")

        self.special_instructions.append(text.strip())

    def calculate_total(self):
        subtotal = sum(item["price"] * item["qty"] for item in self.items.values())
        return round(subtotal * (1 + self.tax_rate / 100), 2)

    def _move(self, expected, new_status):
        if self.status != expected:
            raise InvalidOrderStatusError(
                f"Order must be '{expected}' to become '{new_status}', not '{self.status}'."
            )
        self.status = new_status

    def send_to_kitchen(self):
        if not self.items:
            raise EmptyOrderError("Add at least one dish before sending the order.")

        self._move("draft", "cooking")

    def mark_ready(self):
        self._move("cooking", "ready")

    def serve(self):
        self._move("ready", "served")

    def cancel(self):
        if self.status not in ("draft", "cooking"):
            raise InvalidOrderStatusError(f"A '{self.status}' order cannot be cancelled.")

        self.status = "cancelled"


paneer = {"id": "D1", "name": "Paneer Butter Masala", "price": 280}
naan = {"id": "D2", "name": "Butter Naan", "price": 50}
lassi = {"id": "D3", "name": "Sweet Lassi", "price": 90}

order = RestaurantOrder("ORD-501", 7)

order.add_dish(paneer, 1)
order.add_dish(naan, 4)
order.add_dish(lassi, 2)
order.remove_dish("D3")              # Removes the lassi
order.add_instruction("Less spicy")
print(order.calculate_total())       # 504.0  (480 + 5% GST)

order.send_to_kitchen()
order.mark_ready()
order.serve()
print(order.status, order.special_instructions)  # served ['Less spicy']

try:
    order.add_dish(lassi, 1)
except InvalidOrderStatusError as error:
    print(type(error).__name__, "-", error)
    # InvalidOrderStatusError - Order ORD-501 is already 'served' and cannot be edited.
```

**Output:**

```text
504.0
served ['Less spicy']
InvalidOrderStatusError - Order ORD-501 is already 'served' and cannot be edited.
```

</details>

### 9. Hotel booking (`HotelBooking` inherits `Booking`)

- **Attributes:** `booking_id`, `guest_name`, `room_number`, `check_in_date`, `check_out_date`, `nightly_rate`, `status`
- **8 methods:** `check_availability()`, `calculate_price()`, `confirm()`, `reschedule(start, end)`, `change_room(room_number)`, `check_in()`, `check_out()`, `cancel()`
- **Validation:** Require checkout after check-in. Check room availability before confirming or changing dates.
- **Exceptions:** `ValueError` for invalid dates, `RoomUnavailableError`, `InvalidBookingStatusError`.
- **Decorator:** `@property` on `nights`, computed from the two dates.

**Program:** Write a Python program to create a `Booking` class with the attributes `booking_id`, `guest_name`, and `status`. Create a `HotelBooking` class that inherits from `Booking` and adds `room_number`, `check_in_date`, `check_out_date`, and `nightly_rate`. A new booking starts with the status `pending`. Keep a class-level list of confirmed bookings so that each booking can check whether its room is free for its dates.

Implement these eight methods in `HotelBooking`:

1. `check_availability()` returns `True` if no other confirmed booking holds the same room on overlapping dates.
2. `calculate_price()` returns the number of nights times the nightly rate.
3. `confirm()` confirms a pending booking if the room is free.
4. `reschedule(start, end)` changes the dates of a pending or confirmed booking if the room is free.
5. `change_room(room_number)` moves a pending or confirmed booking to another free room.
6. `check_in()` moves a confirmed booking to `checked_in`.
7. `check_out()` moves a checked-in booking to `checked_out` and frees the room.
8. `cancel()` cancels a pending or confirmed booking and frees the room.

Raise `ValueError` when the check-out date is not after the check-in date, `RoomUnavailableError` when the room is already taken for those dates, and `InvalidBookingStatusError` when an action does not fit the current status. Define `nights` as a `@property` that returns the number of days between the two dates.

Create booking `B1` for Ananya Iyer in room 101 from 20 to 23 December 2026, and booking `B2` for Rohit Verma in room 101 from 22 to 24 December 2026, both at Rs. 4,500 a night. Confirm `B1`, then print whether room 101 is available for `B2`. Move `B2` to room 102 and confirm it. Extend `B1` to check out on 24 December, and print its nights and price. Check `B1` in and out, then print both statuses. Finally, try to cancel `B1` and print the error.

<details>
<summary>Answer</summary>

```python
from datetime import date


class RoomUnavailableError(Exception):
    pass


class InvalidBookingStatusError(Exception):
    pass


class Booking:
    def __init__(self, booking_id, guest_name):
        self.booking_id = booking_id
        self.guest_name = guest_name
        self.status = "pending"


class HotelBooking(Booking):
    confirmed_bookings = []   # shared by all bookings, to check room availability

    def __init__(self, booking_id, guest_name, room_number, check_in_date,
                 check_out_date, nightly_rate):
        if check_out_date <= check_in_date:
            raise ValueError("Check-out date must be after check-in date.")

        super().__init__(booking_id, guest_name)
        self.room_number = room_number
        self.check_in_date = check_in_date
        self.check_out_date = check_out_date
        self.nightly_rate = nightly_rate

    @property
    def nights(self):
        return (self.check_out_date - self.check_in_date).days

    def _is_free(self, room, start, end):
        for other in HotelBooking.confirmed_bookings:
            if other is not self and other.room_number == room:
                if start < other.check_out_date and other.check_in_date < end:
                    return False
        return True

    def _require_status(self, *allowed):
        if self.status not in allowed:
            raise InvalidBookingStatusError(
                f"Booking {self.booking_id} is '{self.status}'."
            )

    def check_availability(self):
        return self._is_free(self.room_number, self.check_in_date, self.check_out_date)

    def calculate_price(self):
        return self.nights * self.nightly_rate

    def confirm(self):
        self._require_status("pending")
        if not self.check_availability():
            raise RoomUnavailableError(f"Room {self.room_number} is taken for these dates.")

        self.status = "confirmed"
        HotelBooking.confirmed_bookings.append(self)

    def reschedule(self, start, end):
        self._require_status("pending", "confirmed")
        if end <= start:
            raise ValueError("Check-out date must be after check-in date.")
        if not self._is_free(self.room_number, start, end):
            raise RoomUnavailableError(f"Room {self.room_number} is taken for these dates.")

        self.check_in_date = start
        self.check_out_date = end

    def change_room(self, room_number):
        self._require_status("pending", "confirmed")
        if not self._is_free(room_number, self.check_in_date, self.check_out_date):
            raise RoomUnavailableError(f"Room {room_number} is taken for these dates.")

        self.room_number = room_number

    def check_in(self):
        self._require_status("confirmed")
        self.status = "checked_in"

    def check_out(self):
        self._require_status("checked_in")
        self.status = "checked_out"
        HotelBooking.confirmed_bookings.remove(self)

    def cancel(self):
        self._require_status("pending", "confirmed")
        if self in HotelBooking.confirmed_bookings:
            HotelBooking.confirmed_bookings.remove(self)
        self.status = "cancelled"


first = HotelBooking("B1", "Ananya Iyer", 101, date(2026, 12, 20), date(2026, 12, 23), 4500)
second = HotelBooking("B2", "Rohit Verma", 101, date(2026, 12, 22), date(2026, 12, 24), 4500)

first.confirm()
print(second.check_availability())   # False  (overlaps on 22 Dec)
second.change_room(102)
second.confirm()

first.reschedule(date(2026, 12, 20), date(2026, 12, 24))
print(first.nights, first.calculate_price())  # 4 18000

first.check_in()
first.check_out()
print(first.status, second.status)   # checked_out confirmed

try:
    first.cancel()
except InvalidBookingStatusError as error:
    print(type(error).__name__, "-", error)  # InvalidBookingStatusError - Booking B1 is 'checked_out'.
```

**Output:**

```text
False
4 18000
checked_out confirmed
InvalidBookingStatusError - Booking B1 is 'checked_out'.
```

</details>

### 10. Video lesson (`VideoLesson` inherits `Lesson`)

- **Attributes:** `lesson_id`, `title`, `duration_seconds`, `position_seconds`, `is_playing`, `notes`, `completed`
- **8 methods:** `play()`, `pause()`, `resume()`, `seek(second)`, `restart()`, `add_note(text)`, `remove_note(index)`, `mark_complete()`
- **Validation:** Require positive duration, a seek position within the video, and nonempty notes.
- **Exceptions:** `ValueError` for an invalid seek position, `IndexError` for an invalid note index, `LessonNotStartedError` when pausing before playback starts.
- **Decorator:** `@property` on `progress_percent`, computed from position and duration.

**Program:** Write a Python program to create a `Lesson` class with the attributes `lesson_id`, `title`, and `duration_seconds`. Create a `VideoLesson` class that inherits from `Lesson` and adds `position_seconds`, `is_playing`, `notes`, and `completed`. A new video lesson starts at position 0, not playing, with no notes, and not completed. The duration must be a positive whole number of seconds.

Implement these eight methods in `VideoLesson`:

1. `play()` starts playback from the current position.
2. `pause()` stops playback.
3. `resume()` continues playback after a pause.
4. `seek(second)` jumps to a position from 0 to the full duration.
5. `restart()` goes back to 0 and starts playing.
6. `add_note(text)` saves a note with the current timestamp, such as `[02:30] text`.
7. `remove_note(index)` removes and returns the note at that index.
8. `mark_complete()` moves to the end, stops playback, and marks the lesson as completed.

Raise `ValueError` for a non-positive duration, a seek position outside the video, or an empty note. Raise `IndexError` for an invalid note index, and `LessonNotStartedError` when pausing before playback starts or resuming a lesson that was never played. Define `progress_percent` as a `@property` that returns the position as a percentage of the duration, rounded to one decimal place.

Create lesson `L07`, "Python Decorators", which is 600 seconds long. Play it, seek to 150 seconds, add a note, pause, and print the progress. Resume, seek to 450 seconds, add two notes, remove the third note, and print the removed note and the remaining notes. Mark the lesson complete and print whether it is completed and its progress. Restart it and print the position and whether it is playing. Finally, try to seek to 720 seconds and print the error.

<details>
<summary>Answer</summary>

```python
class LessonNotStartedError(Exception):
    pass


class Lesson:
    def __init__(self, lesson_id, title, duration_seconds):
        if not isinstance(duration_seconds, int) or duration_seconds <= 0:
            raise ValueError("Duration must be a positive whole number of seconds.")

        self.lesson_id = lesson_id
        self.title = title
        self.duration_seconds = duration_seconds


class VideoLesson(Lesson):
    def __init__(self, lesson_id, title, duration_seconds):
        super().__init__(lesson_id, title, duration_seconds)
        self.position_seconds = 0
        self.is_playing = False
        self.notes = []
        self.completed = False

    @property
    def progress_percent(self):
        return round(self.position_seconds / self.duration_seconds * 100, 1)

    def play(self):
        self.is_playing = True

    def pause(self):
        if not self.is_playing:
            raise LessonNotStartedError("Play the lesson before pausing it.")

        self.is_playing = False

    def resume(self):
        if self.position_seconds == 0 and not self.is_playing:
            raise LessonNotStartedError("There is nothing to resume yet.")

        self.is_playing = True

    def seek(self, second):
        if not 0 <= second <= self.duration_seconds:
            raise ValueError(f"Seek position must be from 0 to {self.duration_seconds} seconds.")

        self.position_seconds = second

    def restart(self):
        self.position_seconds = 0
        self.is_playing = True

    def add_note(self, text):
        if not text.strip():
            raise ValueError("Note cannot be empty.")

        minutes, seconds = divmod(self.position_seconds, 60)
        self.notes.append(f"[{minutes:02d}:{seconds:02d}] {text.strip()}")

    def remove_note(self, index):
        if not 0 <= index < len(self.notes):
            raise IndexError(f"There is no note at index {index}.")

        return self.notes.pop(index)

    def mark_complete(self):
        self.position_seconds = self.duration_seconds
        self.is_playing = False
        self.completed = True


lesson = VideoLesson("L07", "Python Decorators", 600)   # 10-minute video

lesson.play()
lesson.seek(150)
lesson.add_note("wraps keeps the function name")
lesson.pause()
print(lesson.progress_percent)       # 25.0

lesson.resume()
lesson.seek(450)
lesson.add_note("Decorators with arguments need three levels")
lesson.add_note("Revise later")
print(lesson.remove_note(2))         # [07:30] Revise later
print(lesson.notes)
# ['[02:30] wraps keeps the function name', '[07:30] Decorators with arguments need three levels']

lesson.mark_complete()
print(lesson.completed, lesson.progress_percent)  # True 100.0

lesson.restart()
print(lesson.position_seconds, lesson.is_playing)  # 0 True

try:
    lesson.seek(720)
except ValueError as error:
    print(type(error).__name__, "-", error)  # ValueError - Seek position must be from 0 to 600 seconds.
```

**Output:**

```text
25.0
[07:30] Revise later
['[02:30] wraps keeps the function name', '[07:30] Decorators with arguments need three levels']
True 100.0
0 True
ValueError - Seek position must be from 0 to 600 seconds.
```

</details>

### 11. Split AC (`SplitAC` inherits `Appliance`)

- **Attributes:** `brand`, `model`, `power_on`, `temperature_c`, `mode`, `fan_speed`, `timer_minutes`, `filter_hours`
- **8 methods:** `turn_on()`, `turn_off()`, `set_temperature(celsius)`, `set_mode(mode)`, `set_fan_speed(speed)`, `set_timer(minutes)`, `cancel_timer()`, `reset_filter_counter()`
- **Validation:** For this prototype, allow temperatures from 16 to 30°C, known modes, and positive timer durations.
- **Exceptions:** `ValueError` for invalid settings, `ApplianceOffError` when changing settings that require power.
- **Decorator:** Custom `@requires_power` on `set_temperature()`, `set_mode()`, and `set_timer()`.

**Program:** Write a Python program to create an `Appliance` class with the attributes `brand`, `model`, and `power_on`. Create a `SplitAC` class that inherits from `Appliance` and adds `temperature_c`, `mode`, `fan_speed`, `timer_minutes`, and `filter_hours`. A new AC starts switched off at 24°C, in `cool` mode, with `auto` fan speed and no timer. The filter hours can be passed in for a unit that is already in use, and default to 0.

Implement these eight methods in `SplitAC`:

1. `turn_on()` switches the AC on.
2. `turn_off()` switches the AC off and clears the timer.
3. `set_temperature(celsius)` sets a whole-number temperature from 16 to 30°C.
4. `set_mode(mode)` sets the mode to `cool`, `dry`, `fan`, `heat`, or `auto`.
5. `set_fan_speed(speed)` sets the fan to `low`, `medium`, `high`, or `auto`, even while the AC is off.
6. `set_timer(minutes)` sets a timer from 1 to 720 minutes.
7. `cancel_timer()` clears the timer.
8. `reset_filter_counter()` sets the filter hours back to 0 after cleaning.

Raise `ValueError` for a temperature, mode, fan speed, or timer outside the allowed values. Define a custom `@requires_power` decorator on `set_temperature()`, `set_mode()`, and `set_timer()` that raises `ApplianceOffError` when the AC is off.

Create a Voltas `183V Vectra` AC that has run for 320 hours since its filter was last cleaned. Set the fan speed to high while it is off, then turn it on, set the temperature to 22°C, switch to `dry` mode, set a 90-minute timer, and print the settings. Cancel the timer, reset the filter counter, and print the timer and filter hours. Finally, turn the AC off, try to set the temperature to 18°C, and print the error.

<details>
<summary>Answer</summary>

```python
from functools import wraps


class ApplianceOffError(Exception):
    pass


def requires_power(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.power_on:
            raise ApplianceOffError(f"Turn on the {self.brand} AC first.")
        return method(self, *args, **kwargs)
    return wrapper


class Appliance:
    def __init__(self, brand, model):
        self.brand = brand
        self.model = model
        self.power_on = False


class SplitAC(Appliance):
    MIN_TEMP = 16             # °C
    MAX_TEMP = 30             # °C
    MAX_TIMER = 720           # minutes (12 hours)
    MODES = ("cool", "dry", "fan", "heat", "auto")
    FAN_SPEEDS = ("low", "medium", "high", "auto")

    def __init__(self, brand, model, filter_hours=0):
        super().__init__(brand, model)
        self.temperature_c = 24
        self.mode = "cool"
        self.fan_speed = "auto"
        self.timer_minutes = 0
        self.filter_hours = filter_hours

    def turn_on(self):
        self.power_on = True

    def turn_off(self):
        self.power_on = False
        self.timer_minutes = 0

    @requires_power
    def set_temperature(self, celsius):
        if not isinstance(celsius, int) or not self.MIN_TEMP <= celsius <= self.MAX_TEMP:
            raise ValueError(f"Temperature must be from {self.MIN_TEMP} to {self.MAX_TEMP}°C.")

        self.temperature_c = celsius

    @requires_power
    def set_mode(self, mode):
        if mode not in self.MODES:
            raise ValueError(f"Mode must be one of {', '.join(self.MODES)}.")

        self.mode = mode

    def set_fan_speed(self, speed):
        if speed not in self.FAN_SPEEDS:
            raise ValueError(f"Fan speed must be one of {', '.join(self.FAN_SPEEDS)}.")

        self.fan_speed = speed

    @requires_power
    def set_timer(self, minutes):
        if not isinstance(minutes, int) or not 0 < minutes <= self.MAX_TIMER:
            raise ValueError(f"Timer must be from 1 to {self.MAX_TIMER} minutes.")

        self.timer_minutes = minutes

    def cancel_timer(self):
        self.timer_minutes = 0

    def reset_filter_counter(self):
        self.filter_hours = 0


ac = SplitAC("Voltas", "183V Vectra", filter_hours=320)

ac.set_fan_speed("high")             # Allowed while off
ac.turn_on()
ac.set_temperature(22)
ac.set_mode("dry")
ac.set_timer(90)
print(ac.temperature_c, ac.mode, ac.fan_speed, ac.timer_minutes)  # 22 dry high 90

ac.cancel_timer()
ac.reset_filter_counter()
print(ac.timer_minutes, ac.filter_hours)  # 0 0

ac.turn_off()

try:
    ac.set_temperature(18)
except ApplianceOffError as error:
    print(type(error).__name__, "-", error)  # ApplianceOffError - Turn on the Voltas AC first.
```

**Output:**

```text
22 dry high 90
0 0
ApplianceOffError - Turn on the Voltas AC first.
```

</details>

### 12. Doctor appointment (`DoctorAppointment` inherits `Appointment`)

- **Attributes:** `appointment_id`, `patient_id`, `doctor_id`, `starts_at`, `duration_minutes`, `reason`, `status`
- **8 methods:** `schedule()`, `confirm()`, `reschedule(starts_at)`, `check_in()`, `start_consultation()`, `complete()`, `cancel()`, `summary()`
- **Validation:** Require a future time when scheduling, positive duration, and an available doctor slot. Require patient check-in before starting.
- **Exceptions:** `ValueError` for invalid time or duration, `SlotUnavailableError`, `InvalidAppointmentStatusError`.
- **Decorator:** `@property` on `ends_at`, computed from the start time and duration.

**Program:** Write a Python program to create an `Appointment` class with the attributes `appointment_id`, `patient_id`, `doctor_id`, `starts_at`, `duration_minutes`, and `reason`. Create a `DoctorAppointment` class that inherits from `Appointment` and adds `status`. A new appointment starts with the status `new`, and its duration must be between 1 and 120 minutes. All appointments share one set of booked `(doctor_id, starts_at)` slots, so a doctor can't be booked twice at the same time.

Implement these eight methods in `DoctorAppointment`:

1. `schedule(now)` books the doctor's slot and sets the status to `scheduled`.
2. `confirm()` changes a scheduled appointment to `confirmed`.
3. `reschedule(starts_at, now)` books the new slot, frees the old one, and sets the status back to `scheduled`.
4. `check_in()` marks a confirmed patient as `checked in`.
5. `start_consultation()` starts the consultation after the patient has checked in.
6. `complete()` marks the consultation as `completed`.
7. `cancel()` cancels a scheduled, confirmed, or checked-in appointment and frees its slot.
8. `summary()` returns the appointment's details for printing.

Raise `ValueError` for a duration outside 1–120 minutes or a start time that is not after `now`, `SlotUnavailableError` when the doctor is already booked at that time, and `InvalidAppointmentStatusError` when a method is called in the wrong status. Define `ends_at` as a `@property` that returns the start time plus the duration.

Use 14 Nov 2026, 9:00 AM as the current time. Create appointment `A101` for patient `P1001` with doctor `D201` on 20 Nov 2026 at 10:30 AM for 30 minutes (reason: Fever). Schedule and confirm it, and print its end time. Create appointment `A102` for patient `P1002` with the same doctor at the same time for 20 minutes (reason: Back pain), try to schedule it, and print the slot error. Reschedule `A101` to 21 Nov 2026 at 4:00 PM, then schedule `A102` in the freed slot. Take `A101` through confirm, check-in, consultation, and completion, and print its summary. Cancel `A102` and print its summary. Finally, try to check in the cancelled appointment and print the error.

<details>
<summary>Answer</summary>

```python
from datetime import datetime, timedelta


class SlotUnavailableError(Exception):
    pass


class InvalidAppointmentStatusError(Exception):
    pass


class Appointment:
    def __init__(self, appointment_id, patient_id, doctor_id, starts_at,
                 duration_minutes, reason):
        self.appointment_id = appointment_id
        self.patient_id = patient_id
        self.doctor_id = doctor_id
        self.starts_at = starts_at
        self.duration_minutes = duration_minutes
        self.reason = reason


class DoctorAppointment(Appointment):
    MAX_DURATION = 120        # minutes
    booked_slots = set()      # (doctor_id, starts_at) pairs shared by all bookings

    def __init__(self, appointment_id, patient_id, doctor_id, starts_at,
                 duration_minutes, reason):
        if not 0 < duration_minutes <= self.MAX_DURATION:
            raise ValueError("Duration must be between 1 and 120 minutes.")

        super().__init__(appointment_id, patient_id, doctor_id, starts_at,
                         duration_minutes, reason)
        self.status = "new"

    @property
    def ends_at(self):
        return self.starts_at + timedelta(minutes=self.duration_minutes)

    def _require_status(self, *allowed):
        if self.status not in allowed:
            raise InvalidAppointmentStatusError(
                f"Cannot do this while the appointment is {self.status}."
            )

    def _book(self, starts_at, now):
        if starts_at <= now:
            raise ValueError("Appointment time must be in the future.")
        if (self.doctor_id, starts_at) in self.booked_slots:
            raise SlotUnavailableError("The doctor is already booked at this time.")

        self.booked_slots.add((self.doctor_id, starts_at))

    def schedule(self, now):
        self._require_status("new")
        self._book(self.starts_at, now)
        self.status = "scheduled"

    def confirm(self):
        self._require_status("scheduled")
        self.status = "confirmed"

    def reschedule(self, starts_at, now):
        self._require_status("scheduled", "confirmed")
        self._book(starts_at, now)
        self.booked_slots.discard((self.doctor_id, self.starts_at))
        self.starts_at = starts_at
        self.status = "scheduled"

    def check_in(self):
        self._require_status("confirmed")
        self.status = "checked in"

    def start_consultation(self):
        self._require_status("checked in")
        self.status = "in consultation"

    def complete(self):
        self._require_status("in consultation")
        self.status = "completed"

    def cancel(self):
        self._require_status("scheduled", "confirmed", "checked in")
        self.booked_slots.discard((self.doctor_id, self.starts_at))
        self.status = "cancelled"

    def summary(self):
        return (
            f"{self.appointment_id} | Patient {self.patient_id} | "
            f"Doctor {self.doctor_id} | "
            f"{self.starts_at:%d %b %Y %H:%M}-{self.ends_at:%H:%M} | "
            f"{self.reason} | {self.status}"
        )


now = datetime(2026, 11, 14, 9, 0)
slot = datetime(2026, 11, 20, 10, 30)

first = DoctorAppointment("A101", "P1001", "D201", slot, 30, "Fever")
first.schedule(now)
first.confirm()
print(first.ends_at)  # 2026-11-20 11:00:00

second = DoctorAppointment("A102", "P1002", "D201", slot, 20, "Back pain")
try:
    second.schedule(now)
except SlotUnavailableError as error:
    print(type(error).__name__, "-", error)
    # SlotUnavailableError - The doctor is already booked at this time.

first.reschedule(datetime(2026, 11, 21, 16, 0), now)
second.schedule(now)   # The 20 Nov 10:30 slot is free again
first.confirm()
first.check_in()
first.start_consultation()
first.complete()
print(first.summary())
# A101 | Patient P1001 | Doctor D201 | 21 Nov 2026 16:00-16:30 | Fever | completed

second.cancel()
print(second.summary())
# A102 | Patient P1002 | Doctor D201 | 20 Nov 2026 10:30-10:50 | Back pain | cancelled

try:
    second.check_in()
except InvalidAppointmentStatusError as error:
    print(type(error).__name__, "-", error)
    # InvalidAppointmentStatusError - Cannot do this while the appointment is cancelled.
```

**Output:**

```text
2026-11-20 11:00:00
SlotUnavailableError - The doctor is already booked at this time.
A101 | Patient P1001 | Doctor D201 | 21 Nov 2026 16:00-16:30 | Fever | completed
A102 | Patient P1002 | Doctor D201 | 20 Nov 2026 10:30-10:50 | Back pain | cancelled
InvalidAppointmentStatusError - Cannot do this while the appointment is cancelled.
```

</details>

### 13. Courier parcel (`CourierParcel` inherits `Shipment`)

- **Attributes:** `tracking_id`, `sender`, `recipient`, `weight_kg`, `destination`, `status`, `tracking_events`
- **8 methods:** `calculate_shipping_cost()`, `pack()`, `dispatch()`, `update_location(location)`, `mark_out_for_delivery()`, `mark_delivered()`, `mark_returned()`, `show_tracking()`
- **Validation:** Require positive weight and a destination. Check status before each transition and record successful updates in the tracking history.
- **Exceptions:** `ValueError` for invalid weight or destination, `InvalidShipmentStatusError`.
- **Decorator:** `@classmethod` on `from_dict(cls, data)` to construct a parcel from a saved record.

**Program:** Write a Python program to create a `Shipment` class with the attributes `tracking_id`, `sender`, `recipient`, `weight_kg`, and `destination`. Create a `CourierParcel` class that inherits from `Shipment` and adds `status` and `tracking_events`. A new parcel starts with the status `booked` and a tracking history of `["Booked"]`.

Implement these eight methods in `CourierParcel`:

1. `calculate_shipping_cost()` returns Rs. 50 plus Rs. 40 per kg.
2. `pack()` changes a booked parcel to `packed`.
3. `dispatch()` changes a packed parcel to `dispatched`.
4. `update_location(location)` records the parcel reaching a city and sets the status to `in transit`.
5. `mark_out_for_delivery()` sets the status to `out for delivery` in the destination city.
6. `mark_delivered()` changes a parcel that is out for delivery to `delivered`.
7. `mark_returned()` returns a parcel that is dispatched, in transit, or out for delivery to the sender.
8. `show_tracking()` returns the tracking ID, status, and full tracking history.

Raise `ValueError` for a non-positive or non-finite weight, or a blank destination or location, and `InvalidShipmentStatusError` when a status change isn't allowed from the current status. Each successful change adds an event to `tracking_events`. Define `from_dict(cls, data)` as a `@classmethod` that rebuilds a parcel, including its status and tracking history, from a saved dictionary.

Create parcel `TRK5001` from Rakesh to Priya, weighing 2.5 kg, going to Pune, and print its shipping cost. Pack and dispatch it, update its location to Nagpur, mark it out for delivery, mark it delivered, and print its tracking. Then rebuild parcel `TRK5002` (from Amit to Sneha, 1 kg, Jaipur) from a saved record whose status is `dispatched`, mark it returned, and print its tracking. Finally, try to mark the returned parcel as delivered and print the error.

<details>
<summary>Answer</summary>

```python
class InvalidShipmentStatusError(Exception):
    pass


class Shipment:
    def __init__(self, tracking_id, sender, recipient, weight_kg, destination):
        if not 0 < weight_kg < float("inf"):
            raise ValueError("Weight must be a positive, finite number.")
        if not destination.strip():
            raise ValueError("Destination cannot be empty.")

        self.tracking_id = tracking_id
        self.sender = sender
        self.recipient = recipient
        self.weight_kg = weight_kg
        self.destination = destination


class CourierParcel(Shipment):
    BASE_CHARGE = 50          # Rs.
    RATE_PER_KG = 40          # Rs. per kg

    def __init__(self, tracking_id, sender, recipient, weight_kg, destination):
        super().__init__(tracking_id, sender, recipient, weight_kg, destination)
        self.status = "booked"
        self.tracking_events = ["Booked"]

    @classmethod
    def from_dict(cls, data):
        parcel = cls(data["tracking_id"], data["sender"], data["recipient"],
                     data["weight_kg"], data["destination"])
        parcel.status = data.get("status", "booked")
        parcel.tracking_events = list(data.get("tracking_events", ["Booked"]))
        return parcel

    def _move(self, allowed, new_status, event):
        if self.status not in allowed:
            raise InvalidShipmentStatusError(
                f"Cannot change status from {self.status} to {new_status}."
            )

        self.status = new_status
        self.tracking_events.append(event)

    def calculate_shipping_cost(self):
        return self.BASE_CHARGE + self.weight_kg * self.RATE_PER_KG

    def pack(self):
        self._move(("booked",), "packed", "Packed")

    def dispatch(self):
        self._move(("packed",), "dispatched", "Dispatched")

    def update_location(self, location):
        if not location.strip():
            raise ValueError("Location cannot be empty.")

        self._move(("dispatched", "in transit"), "in transit",
                   f"Reached {location}")

    def mark_out_for_delivery(self):
        self._move(("dispatched", "in transit"), "out for delivery",
                   f"Out for delivery in {self.destination}")

    def mark_delivered(self):
        self._move(("out for delivery",), "delivered", "Delivered")

    def mark_returned(self):
        self._move(("dispatched", "in transit", "out for delivery"), "returned",
                   f"Returned to {self.sender}")

    def show_tracking(self):
        history = " -> ".join(self.tracking_events)
        return f"{self.tracking_id} ({self.status}): {history}"


parcel = CourierParcel("TRK5001", "Rakesh", "Priya", 2.5, "Pune")
print(parcel.calculate_shipping_cost())  # 150.0

parcel.pack()
parcel.dispatch()
parcel.update_location("Nagpur")
parcel.mark_out_for_delivery()
parcel.mark_delivered()
print(parcel.show_tracking())
# TRK5001 (delivered): Booked -> Packed -> Dispatched -> Reached Nagpur -> Out for delivery in Pune -> Delivered

saved = {
    "tracking_id": "TRK5002",
    "sender": "Amit",
    "recipient": "Sneha",
    "weight_kg": 1,
    "destination": "Jaipur",
    "status": "dispatched",
    "tracking_events": ["Booked", "Packed", "Dispatched"],
}
returned = CourierParcel.from_dict(saved)
returned.mark_returned()
print(returned.show_tracking())
# TRK5002 (returned): Booked -> Packed -> Dispatched -> Returned to Amit

try:
    returned.mark_delivered()
except InvalidShipmentStatusError as error:
    print(type(error).__name__, "-", error)
    # InvalidShipmentStatusError - Cannot change status from returned to delivered.
```

**Output:**

```text
150.0
TRK5001 (delivered): Booked -> Packed -> Dispatched -> Reached Nagpur -> Out for delivery in Pune -> Delivered
TRK5002 (returned): Booked -> Packed -> Dispatched -> Returned to Amit
InvalidShipmentStatusError - Cannot change status from returned to delivered.
```

</details>

### 14. Inventory product (`InventoryProduct` inherits `Product`)

- **Attributes:** `sku`, `name`, `unit_price`, `stock`, `reserved_qty`, `reorder_level`, `is_discontinued`
- **8 methods:** `add_stock(qty)`, `reserve_stock(qty)`, `release_stock(qty)`, `fulfill_reservation(qty)`, `change_price(price)`, `needs_reorder()`, `discontinue()`, `stock_report()`
- **Validation:** Require whole-number stock counts. Keep `reserved_qty` between zero and stock. Fulfilling a reservation reduces both counts.
- **Exceptions:** `ValueError` for invalid quantity or price, `InsufficientStockError`, `ProductDiscontinuedError` for a new reservation on a discontinued product.
- **Decorator:** `@property` on `available_stock`, computed as `stock - reserved_qty`.

**Program:** Write a Python program to create a `Product` class with the attributes `sku`, `name`, and `unit_price`. Create an `InventoryProduct` class that inherits from `Product` and adds `stock`, `reserved_qty`, `reorder_level`, and `is_discontinued`. A new product starts with zero stock, zero reserved units, a reorder level of 10 (unless given), and is not discontinued.

Implement these eight methods in `InventoryProduct`:

1. `add_stock(qty)` adds units to the stock.
2. `reserve_stock(qty)` reserves units from the available stock.
3. `release_stock(qty)` returns reserved units to the available stock.
4. `fulfill_reservation(qty)` ships reserved units, reducing both the stock and the reserved quantity.
5. `change_price(price)` sets a new price above Rs. 0 and up to Rs. 1,000,000.
6. `needs_reorder()` returns `True` when the available stock is at or below the reorder level (never for a discontinued product).
7. `discontinue()` marks the product as discontinued.
8. `stock_report()` returns the product's stock details for printing.

Raise `ValueError` for quantities that aren't positive whole numbers or for an invalid price, `InsufficientStockError` when reserving more than is available or fulfilling more than is reserved, and `ProductDiscontinuedError` for a new reservation on a discontinued product. Define `available_stock` as a `@property` that returns `stock - reserved_qty`.

Create product `SKU-1042`, an Electric Kettle priced at Rs. 1,299 with a reorder level of 5. Add 20 units, reserve 8, and print the available stock. Release 2 reserved units, fulfil 5, change the price to Rs. 1,199, and reserve 10 more. Print whether the product needs a reorder, and print its stock report. Finally, discontinue the product, try to reserve 1 more unit, and print the error.

<details>
<summary>Answer</summary>

```python
class InsufficientStockError(Exception):
    pass


class ProductDiscontinuedError(Exception):
    pass


class Product:
    def __init__(self, sku, name, unit_price):
        self.sku = sku
        self.name = name
        self.unit_price = unit_price


class InventoryProduct(Product):
    MAX_PRICE = 1_000_000     # Rs.

    def __init__(self, sku, name, unit_price, reorder_level=10):
        super().__init__(sku, name, unit_price)
        self.change_price(unit_price)
        self.stock = 0
        self.reserved_qty = 0
        self.reorder_level = self._check_qty(reorder_level, allow_zero=True)
        self.is_discontinued = False

    @property
    def available_stock(self):
        return self.stock - self.reserved_qty

    @staticmethod
    def _check_qty(qty, allow_zero=False):
        if not isinstance(qty, int) or isinstance(qty, bool):
            raise ValueError("Quantity must be a whole number.")
        if qty < 0 or (qty == 0 and not allow_zero):
            raise ValueError("Quantity must be positive.")
        return qty

    def add_stock(self, qty):
        self.stock += self._check_qty(qty)

    def reserve_stock(self, qty):
        self._check_qty(qty)
        if self.is_discontinued:
            raise ProductDiscontinuedError(f"{self.name} is discontinued.")
        if qty > self.available_stock:
            raise InsufficientStockError(
                f"Only {self.available_stock} units are available."
            )

        self.reserved_qty += qty

    def release_stock(self, qty):
        self._check_qty(qty)
        if qty > self.reserved_qty:
            raise ValueError("Cannot release more than the reserved quantity.")

        self.reserved_qty -= qty

    def fulfill_reservation(self, qty):
        self._check_qty(qty)
        if qty > self.reserved_qty:
            raise InsufficientStockError(
                f"Only {self.reserved_qty} units are reserved."
            )

        self.reserved_qty -= qty
        self.stock -= qty

    def change_price(self, price):
        if not 0 < price <= self.MAX_PRICE:
            raise ValueError("Price must be between Rs. 0 and Rs. 1,000,000.")

        self.unit_price = price

    def needs_reorder(self):
        if self.is_discontinued:
            return False
        return self.available_stock <= self.reorder_level

    def discontinue(self):
        self.is_discontinued = True

    def stock_report(self):
        return (
            f"{self.sku} {self.name} @ Rs. {self.unit_price} | "
            f"Stock: {self.stock} | Reserved: {self.reserved_qty} | "
            f"Available: {self.available_stock} | "
            f"Discontinued: {self.is_discontinued}"
        )


kettle = InventoryProduct("SKU-1042", "Electric Kettle", 1299, reorder_level=5)

kettle.add_stock(20)
kettle.reserve_stock(8)
print(kettle.available_stock)   # 12

kettle.release_stock(2)         # Reserved drops from 8 to 6
kettle.fulfill_reservation(5)   # Stock 20 -> 15, reserved 6 -> 1
kettle.change_price(1199)
kettle.reserve_stock(10)        # Reserved 1 -> 11, available 4
print(kettle.needs_reorder())   # True
print(kettle.stock_report())
# SKU-1042 Electric Kettle @ Rs. 1199 | Stock: 15 | Reserved: 11 | Available: 4 | Discontinued: False

kettle.discontinue()
try:
    kettle.reserve_stock(1)
except ProductDiscontinuedError as error:
    print(type(error).__name__, "-", error)
    # ProductDiscontinuedError - Electric Kettle is discontinued.
```

**Output:**

```text
12
True
SKU-1042 Electric Kettle @ Rs. 1199 | Stock: 15 | Reserved: 11 | Available: 4 | Discontinued: False
ProductDiscontinuedError - Electric Kettle is discontinued.
```

</details>

### 15. Support ticket (`SupportTicket`)

- **Attributes:** `ticket_id`, `subject`, `description`, `priority`, `status`, `assignee`, `comments`
- **8 methods:** `assign(agent)`, `unassign()`, `change_priority(priority)`, `add_comment(text)`, `start_work()`, `resolve()`, `reopen()`, `close()`
- **Validation:** Allow known priorities, require a nonempty comment, and require an assignee before work starts.
- **Exceptions:** `ValueError` for an invalid priority or blank comment, `TicketUnassignedError`, `InvalidTicketStatusError`.
- **Decorator:** `@staticmethod` on `is_valid_priority(priority)` because the check only uses the supplied value.

**Program:** Write a Python program to create a `SupportTicket` class with the attributes `ticket_id`, `subject`, `description`, `priority`, `status`, `assignee`, and `comments`. The allowed priorities are `low`, `medium`, `high`, and `urgent`. A new ticket starts with `medium` priority (unless given), the status `open`, no assignee, and no comments.

Implement these eight methods in `SupportTicket`:

1. `assign(agent)` assigns an open or in-progress ticket to a support agent.
2. `unassign()` removes the agent from an open ticket.
3. `change_priority(priority)` changes the ticket's priority.
4. `add_comment(text)` adds a comment to the ticket.
5. `start_work()` changes an open, assigned ticket to `in progress`.
6. `resolve()` changes an in-progress ticket to `resolved`.
7. `reopen()` changes a resolved or closed ticket back to `open`.
8. `close()` changes a resolved ticket to `closed`.

Raise `ValueError` for an unknown priority or a blank comment, `TicketUnassignedError` when starting work on a ticket with no assignee, and `InvalidTicketStatusError` when a method is called in the wrong status. Define `is_valid_priority(priority)` as a `@staticmethod`, because the check only uses the supplied value.

Create ticket `TCK-301` with the subject "UPI payment failed" and the description "Rs. 2,499 debited but order not placed." Try to start work before it is assigned and print the error. Assign it to Kavya, raise its priority to `high`, add a comment, start work, add a second comment, resolve it, and print its status, priority, and assignee. Then reopen it, start work again, resolve and close it, and print its status and comment count. Print whether `critical` is a valid priority. Finally, try to add a blank comment and print the error.

<details>
<summary>Answer</summary>

```python
class TicketUnassignedError(Exception):
    pass


class InvalidTicketStatusError(Exception):
    pass


class SupportTicket:
    PRIORITIES = ("low", "medium", "high", "urgent")

    def __init__(self, ticket_id, subject, description, priority="medium"):
        if not self.is_valid_priority(priority):
            raise ValueError(f"Priority must be one of {self.PRIORITIES}.")

        self.ticket_id = ticket_id
        self.subject = subject
        self.description = description
        self.priority = priority
        self.status = "open"
        self.assignee = None
        self.comments = []

    @staticmethod
    def is_valid_priority(priority):
        return priority in SupportTicket.PRIORITIES

    def _require_status(self, *allowed):
        if self.status not in allowed:
            raise InvalidTicketStatusError(
                f"Cannot do this while the ticket is {self.status}."
            )

    def assign(self, agent):
        self._require_status("open", "in progress")
        self.assignee = agent

    def unassign(self):
        self._require_status("open")
        self.assignee = None

    def change_priority(self, priority):
        if not self.is_valid_priority(priority):
            raise ValueError(f"Priority must be one of {self.PRIORITIES}.")

        self.priority = priority

    def add_comment(self, text):
        if not text.strip():
            raise ValueError("Comment cannot be blank.")

        self.comments.append(text.strip())

    def start_work(self):
        self._require_status("open")
        if self.assignee is None:
            raise TicketUnassignedError("Assign the ticket before starting work.")

        self.status = "in progress"

    def resolve(self):
        self._require_status("in progress")
        self.status = "resolved"

    def reopen(self):
        self._require_status("resolved", "closed")
        self.status = "open"

    def close(self):
        self._require_status("resolved")
        self.status = "closed"


ticket = SupportTicket("TCK-301", "UPI payment failed",
                       "Rs. 2,499 debited but order not placed.")

try:
    ticket.start_work()
except TicketUnassignedError as error:
    print(type(error).__name__, "-", error)
    # TicketUnassignedError - Assign the ticket before starting work.

ticket.assign("Kavya")
ticket.change_priority("high")
ticket.add_comment("Checking the payment gateway logs.")
ticket.start_work()
ticket.add_comment("Refund started for the customer.")
ticket.resolve()
print(ticket.status, "|", ticket.priority, "|", ticket.assignee)
# resolved | high | Kavya

ticket.reopen()                 # Customer says the refund has not arrived
ticket.start_work()
ticket.resolve()
ticket.close()
print(ticket.status, "|", len(ticket.comments), "comments")  # closed | 2 comments
print(SupportTicket.is_valid_priority("critical"))           # False

try:
    ticket.add_comment("   ")
except ValueError as error:
    print(type(error).__name__, "-", error)
    # ValueError - Comment cannot be blank.
```

**Output:**

```text
TicketUnassignedError - Assign the ticket before starting work.
resolved | high | Kavya
closed | 2 comments
False
ValueError - Comment cannot be blank.
```

</details>

### 16. Discount coupon (`PercentageCoupon` inherits `Coupon`)

- **Attributes:** `code`, `percent_off`, `min_order_amount`, `expires_at`, `usage_limit`, `used_count`, `is_active`
- **8 methods:** `activate()`, `deactivate()`, `extend_expiry(date)`, `update_limit(limit)`, `check_eligibility(order_total, as_of)`, `calculate_discount(order_total, as_of)`, `redeem(order_total, as_of)`, `show_details()`
- **Validation:** Require a percentage greater than 0 and at most 100. Require a valid expiry date, enough order value, and remaining uses.
- **Exceptions:** `ValueError` for invalid configuration, `CouponExpiredError`, `CouponUsageLimitError`, `CouponMinimumOrderError`.
- **Decorator:** `@property` on `remaining_uses`. Let `calculate_discount()` preview the amount and `redeem()` increase `used_count`.

**Program:** Write a Python program to create a `Coupon` class with the attributes `code`, `expires_at`, `usage_limit`, `used_count`, and `is_active`. Create a `PercentageCoupon` class that inherits from `Coupon` and adds `percent_off` and `min_order_amount`. A new coupon starts active with zero uses. The percentage must be above 0 and at most 100, the minimum order cannot be negative, and the usage limit must be a positive whole number.

Implement these eight methods in `PercentageCoupon`:

1. `activate()` makes the coupon usable.
2. `deactivate()` turns the coupon off.
3. `extend_expiry(date)` moves the expiry to a later date.
4. `update_limit(limit)` changes the usage limit, but never below the uses so far.
5. `check_eligibility(order_total, as_of)` returns `True` if the coupon can be used on that order and date, and raises an error otherwise.
6. `calculate_discount(order_total, as_of)` returns the discount amount without using the coupon.
7. `redeem(order_total, as_of)` uses the coupon once and returns the amount to pay.
8. `show_details()` returns the coupon's details for printing.

Raise `ValueError` for an invalid percentage, limit, expiry, or order total, or for an inactive coupon, `CouponExpiredError` when the date is after the expiry, `CouponUsageLimitError` when no uses are left, and `CouponMinimumOrderError` when the order is below the minimum. Define `remaining_uses` as a `@property` that returns `usage_limit - used_count`.

Create a coupon `DIWALI20` for 20% off orders of Rs. 500 or more, valid until 30 November 2026 for 2 uses. On 14 November 2026, preview the discount on an Rs. 800 order, then redeem it on an Rs. 1,500 order and print the remaining uses. Raise the limit to 3, extend the expiry to 15 December 2026, redeem it on an Rs. 2,000 order on 10 December, and print the coupon's details. Finally, try to redeem it on an Rs. 300 order and print the error.

<details>
<summary>Answer</summary>

```python
from datetime import date


class CouponExpiredError(Exception):
    pass


class CouponUsageLimitError(Exception):
    pass


class CouponMinimumOrderError(Exception):
    pass


class Coupon:
    def __init__(self, code, expires_at, usage_limit):
        self.code = code
        self.expires_at = expires_at
        self.usage_limit = usage_limit
        self.used_count = 0
        self.is_active = True


class PercentageCoupon(Coupon):
    MAX_PERCENT = 100

    def __init__(self, code, percent_off, min_order_amount, expires_at, usage_limit):
        if not 0 < percent_off <= self.MAX_PERCENT:
            raise ValueError("Percent off must be above 0 and at most 100.")
        if min_order_amount < 0:
            raise ValueError("Minimum order amount cannot be negative.")
        if not isinstance(usage_limit, int) or usage_limit <= 0:
            raise ValueError("Usage limit must be a positive whole number.")

        super().__init__(code, expires_at, usage_limit)
        self.percent_off = percent_off
        self.min_order_amount = min_order_amount

    @property
    def remaining_uses(self):
        return self.usage_limit - self.used_count

    def activate(self):
        self.is_active = True

    def deactivate(self):
        self.is_active = False

    def extend_expiry(self, new_date):
        if new_date <= self.expires_at:
            raise ValueError("New expiry must be after the current expiry.")

        self.expires_at = new_date

    def update_limit(self, limit):
        if not isinstance(limit, int) or limit < self.used_count or limit <= 0:
            raise ValueError("Limit must be a positive whole number, not below uses so far.")

        self.usage_limit = limit

    def check_eligibility(self, order_total, as_of):
        if not 0 < order_total < float("inf"):
            raise ValueError("Order total must be a positive, finite number.")
        if not self.is_active:
            raise ValueError(f"Coupon {self.code} is not active.")
        if as_of > self.expires_at:
            raise CouponExpiredError(f"Coupon {self.code} expired on {self.expires_at}.")
        if self.remaining_uses == 0:
            raise CouponUsageLimitError(f"Coupon {self.code} has no uses left.")
        if order_total < self.min_order_amount:
            raise CouponMinimumOrderError(
                f"Order must be at least Rs. {self.min_order_amount} to use {self.code}."
            )
        return True

    def calculate_discount(self, order_total, as_of):
        self.check_eligibility(order_total, as_of)
        return round(order_total * self.percent_off / 100, 2)

    def redeem(self, order_total, as_of):
        discount = self.calculate_discount(order_total, as_of)
        self.used_count += 1
        return order_total - discount

    def show_details(self):
        status = "active" if self.is_active else "inactive"
        return (
            f"{self.code}: {self.percent_off}% off on Rs. {self.min_order_amount}+ | "
            f"Expires: {self.expires_at} | Uses left: {self.remaining_uses} | {status}"
        )


coupon = PercentageCoupon("DIWALI20", 20, 500, date(2026, 11, 30), 2)

print(coupon.calculate_discount(800, date(2026, 11, 14)))  # 160.0
print(coupon.redeem(1500, date(2026, 11, 14)))             # 1200.0
print(coupon.remaining_uses)                               # 1

coupon.update_limit(3)
coupon.extend_expiry(date(2026, 12, 15))
print(coupon.redeem(2000, date(2026, 12, 10)))             # 1600.0
print(coupon.show_details())
# DIWALI20: 20% off on Rs. 500+ | Expires: 2026-12-15 | Uses left: 1 | active

try:
    coupon.redeem(300, date(2026, 12, 12))
except CouponMinimumOrderError as error:
    print(type(error).__name__, "-", error)
    # CouponMinimumOrderError - Order must be at least Rs. 500 to use DIWALI20.
```

**Output:**

```text
160.0
1200.0
1
1600.0
DIWALI20: 20% off on Rs. 500+ | Expires: 2026-12-15 | Uses left: 1 | active
CouponMinimumOrderError - Order must be at least Rs. 500 to use DIWALI20.
```

</details>

### 17. Quiz attempt (`QuizAttempt` inherits `AssessmentAttempt`)

- **Attributes:** `attempt_id`, `student_id`, `questions`, `answers`, `started_at`, `submitted_at`, `status`
- **8 methods:** `start()`, `show_question(question_id)`, `answer(question_id, option)`, `change_answer(question_id, option)`, `clear_answer(question_id)`, `submit()`, `calculate_score()`, `review()`
- **Validation:** Require a known question and a valid option. Allow answers to change only during an active attempt.
- **Exceptions:** `UnknownQuestionError`, `ValueError` for an invalid option, `InvalidAttemptStatusError`.
- **Decorator:** Custom `@attempt_in_progress` on `answer()`, `change_answer()`, and `clear_answer()`.

**Program:** Write a Python program to create an `AssessmentAttempt` class with the attributes `attempt_id`, `student_id`, `started_at`, `submitted_at`, and `status`. Create a `QuizAttempt` class that inherits from `AssessmentAttempt` and adds `questions` and `answers`. Store each question as `question_id: (text, options, correct_option)`, where options are lettered `A`, `B`, `C`. A new attempt starts with status `not_started`, no times, and no answers.

Implement these eight methods in `QuizAttempt`:

1. `start(started_at)` records the start time and sets the status to `in_progress`.
2. `show_question(question_id)` returns the question text with its options.
3. `answer(question_id, option)` saves an answer for a question that has none yet.
4. `change_answer(question_id, option)` replaces an existing answer.
5. `clear_answer(question_id)` removes an answer.
6. `submit(submitted_at)` records the submit time and sets the status to `submitted`.
7. `calculate_score()` returns the number of correct answers after submission.
8. `review()` returns each question with the given answer, the correct answer, and the result.

Raise `UnknownQuestionError` for a question that is not in the quiz, `ValueError` for an option that the question does not have, and `InvalidAttemptStatusError` when an action does not fit the current status. Write a custom `@attempt_in_progress` decorator with `functools.wraps` and apply it to `answer()`, `change_answer()`, and `clear_answer()` so answers can change only while the attempt is in progress. Pass the start and submit times in as arguments so the output stays the same on every run.

Create a 3-question Python quiz for student Priya (`S-1042`). Start the attempt at 10:00 on 14 November 2026 and print the first question. Answer Q1 correctly, answer Q2 wrongly and then change it to the right option, answer Q3 and then clear it. Submit at 10:20, print the score out of 3, and print the review. Finally, try to answer Q3 after submission and print the error.

<details>
<summary>Answer</summary>

```python
from datetime import datetime
from functools import wraps


class UnknownQuestionError(Exception):
    pass


class InvalidAttemptStatusError(Exception):
    pass


def attempt_in_progress(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.status != "in_progress":
            raise InvalidAttemptStatusError(
                f"Answers can change only during an active attempt (status: {self.status})."
            )
        return method(self, *args, **kwargs)
    return wrapper


class AssessmentAttempt:
    def __init__(self, attempt_id, student_id):
        self.attempt_id = attempt_id
        self.student_id = student_id
        self.started_at = None
        self.submitted_at = None
        self.status = "not_started"


class QuizAttempt(AssessmentAttempt):
    OPTIONS = ("A", "B", "C", "D")

    def __init__(self, attempt_id, student_id, questions):
        super().__init__(attempt_id, student_id)
        self.questions = questions    # {question_id: (text, {option: choice}, correct)}
        self.answers = {}

    def _check(self, question_id, option=None):
        if question_id not in self.questions:
            raise UnknownQuestionError(f"Question {question_id} does not exist.")
        if option is not None and option not in self.questions[question_id][1]:
            raise ValueError(f"Option {option} is not valid for {question_id}.")

    def start(self, started_at):
        if self.status != "not_started":
            raise InvalidAttemptStatusError("This attempt has already started.")

        self.started_at = started_at
        self.status = "in_progress"

    def show_question(self, question_id):
        self._check(question_id)
        text, choices, _ = self.questions[question_id]
        options = "  ".join(f"{key}) {value}" for key, value in choices.items())
        return f"{question_id}. {text}  {options}"

    @attempt_in_progress
    def answer(self, question_id, option):
        self._check(question_id, option)
        if question_id in self.answers:
            raise ValueError(f"{question_id} is already answered. Use change_answer().")

        self.answers[question_id] = option

    @attempt_in_progress
    def change_answer(self, question_id, option):
        self._check(question_id, option)
        if question_id not in self.answers:
            raise ValueError(f"{question_id} has no answer to change.")

        self.answers[question_id] = option

    @attempt_in_progress
    def clear_answer(self, question_id):
        self._check(question_id)
        self.answers.pop(question_id, None)

    def submit(self, submitted_at):
        if self.status != "in_progress":
            raise InvalidAttemptStatusError("Only an active attempt can be submitted.")

        self.submitted_at = submitted_at
        self.status = "submitted"

    def calculate_score(self):
        if self.status != "submitted":
            raise InvalidAttemptStatusError("Submit the attempt before scoring it.")

        return sum(
            1 for question_id, (_, _, correct) in self.questions.items()
            if self.answers.get(question_id) == correct
        )

    def review(self):
        lines = []
        for question_id, (_, _, correct) in self.questions.items():
            given = self.answers.get(question_id, "-")
            result = "correct" if given == correct else "wrong"
            lines.append(f"{question_id}: you {given}, answer {correct} ({result})")
        return "\n".join(lines)


questions = {
    "Q1": ("len('hello')?", {"A": "4", "B": "5", "C": "6"}, "B"),
    "Q2": ("Type of 3 / 2?", {"A": "int", "B": "float", "C": "str"}, "B"),
    "Q3": ("Immutable type?", {"A": "list", "B": "dict", "C": "tuple"}, "C"),
}
attempt = QuizAttempt("ATT-501", "S-1042", questions)

attempt.start(datetime(2026, 11, 14, 10, 0))
print(attempt.show_question("Q1"))
# Q1. len('hello')?  A) 4  B) 5  C) 6

attempt.answer("Q1", "B")
attempt.answer("Q2", "A")
attempt.change_answer("Q2", "B")   # Fixes Q2
attempt.answer("Q3", "A")
attempt.clear_answer("Q3")         # Leaves Q3 blank
attempt.submit(datetime(2026, 11, 14, 10, 20))

print(attempt.calculate_score(), "/", len(questions))  # 2 / 3
print(attempt.review())
# Q1: you B, answer B (correct)
# Q2: you B, answer B (correct)
# Q3: you -, answer C (wrong)

try:
    attempt.answer("Q3", "C")
except InvalidAttemptStatusError as error:
    print(type(error).__name__, "-", error)
    # InvalidAttemptStatusError - Answers can change only during an active attempt (status: submitted).
```

**Output:**

```text
Q1. len('hello')?  A) 4  B) 5  C) 6
2 / 3
Q1: you B, answer B (correct)
Q2: you B, answer B (correct)
Q3: you -, answer C (wrong)
InvalidAttemptStatusError - Answers can change only during an active attempt (status: submitted).
```

</details>

### 18. Draft invoice (`Invoice` inherits `BillingDocument`)

- **Attributes:** `invoice_number`, `customer_name`, `line_items`, `tax_rate`, `discount_amount`, `status`, `paid_amount`
- **8 methods:** `add_item(description, qty, unit_price)`, `remove_item(item_id)`, `apply_discount(amount)`, `calculate_subtotal()`, `calculate_total()`, `issue()`, `record_payment(amount)`, `void()`
- **Validation:** Require positive quantities, nonnegative prices, and a discount within the subtotal. Require a positive payment that does not exceed the outstanding balance.
- **Exceptions:** `ValueError` for invalid amounts, `EmptyInvoiceError`, `InvalidInvoiceStatusError`, `OverpaymentError`.
- **Decorator:** `@property` on `balance_due`, computed as total minus payments.

**Program:** Write a Python program to create a `BillingDocument` class with the attributes `invoice_number`, `customer_name`, and `status`. Create an `Invoice` class that inherits from `BillingDocument` and adds `line_items`, `tax_rate`, `discount_amount`, and `paid_amount`. A new invoice starts as a `draft` with no items, no discount, no payments, and an 18% GST tax rate. The total is the subtotal minus the discount, plus tax.

Implement these eight methods in `Invoice`:

1. `add_item(description, qty, unit_price)` adds a line item to a draft invoice and returns its item ID.
2. `remove_item(item_id)` removes a line item from a draft invoice.
3. `apply_discount(amount)` sets a discount between 0 and the subtotal.
4. `calculate_subtotal()` returns the sum of quantity times unit price for all items.
5. `calculate_total()` returns the subtotal after discount, with tax added.
6. `issue()` changes the status from `draft` to `issued`.
7. `record_payment(amount)` adds a payment to an issued invoice and marks it `paid` when nothing is left to pay.
8. `void()` cancels an invoice that has no payments.

Raise `ValueError` for a non-positive quantity, a negative price, a discount outside the subtotal, or a non-positive payment, `EmptyInvoiceError` when issuing an invoice with no items, `InvalidInvoiceStatusError` when an action does not fit the current status, and `OverpaymentError` when a payment exceeds the balance due. Define `balance_due` as a `@property` that returns the total minus the payments.

Create invoice `INV-1001` for Sharma Traders. Add 2 laptop stands at Rs. 1,500 each, 1 USB-C hub at Rs. 2,000, and 1 wireless mouse at Rs. 500, then remove the mouse and print the subtotal. Apply a discount of Rs. 500 and print the total. Issue the invoice, record a payment of Rs. 3,000, and print the balance due and status. Finally, try to record a payment of Rs. 5,000 and print the error.

<details>
<summary>Answer</summary>

```python
class EmptyInvoiceError(Exception):
    pass


class InvalidInvoiceStatusError(Exception):
    pass


class OverpaymentError(Exception):
    pass


class BillingDocument:
    def __init__(self, invoice_number, customer_name):
        self.invoice_number = invoice_number
        self.customer_name = customer_name
        self.status = "draft"


class Invoice(BillingDocument):
    GST_RATE = 0.18

    def __init__(self, invoice_number, customer_name, tax_rate=GST_RATE):
        super().__init__(invoice_number, customer_name)
        self.line_items = {}    # {item_id: (description, qty, unit_price)}
        self.tax_rate = tax_rate
        self.discount_amount = 0
        self.paid_amount = 0
        self.next_item_id = 1

    @property
    def balance_due(self):
        return round(self.calculate_total() - self.paid_amount, 2)

    def _require_status(self, status, action):
        if self.status != status:
            raise InvalidInvoiceStatusError(f"Cannot {action} a {self.status} invoice.")

    def add_item(self, description, qty, unit_price):
        self._require_status("draft", "add items to")
        if not isinstance(qty, int) or qty <= 0:
            raise ValueError("Quantity must be a positive whole number.")
        if not 0 <= unit_price < float("inf"):
            raise ValueError("Unit price must be a nonnegative, finite number.")

        item_id = self.next_item_id
        self.line_items[item_id] = (description, qty, unit_price)
        self.next_item_id += 1
        return item_id

    def remove_item(self, item_id):
        self._require_status("draft", "remove items from")
        if item_id not in self.line_items:
            raise ValueError(f"Item {item_id} is not on this invoice.")

        del self.line_items[item_id]

    def apply_discount(self, amount):
        self._require_status("draft", "discount")
        if not 0 <= amount <= self.calculate_subtotal():
            raise ValueError("Discount must be between 0 and the subtotal.")

        self.discount_amount = amount

    def calculate_subtotal(self):
        return sum(qty * price for _, qty, price in self.line_items.values())

    def calculate_total(self):
        taxable = self.calculate_subtotal() - self.discount_amount
        return round(taxable * (1 + self.tax_rate), 2)

    def issue(self):
        self._require_status("draft", "issue")
        if not self.line_items:
            raise EmptyInvoiceError("Add at least one item before issuing.")

        self.status = "issued"

    def record_payment(self, amount):
        self._require_status("issued", "record a payment on")
        if not 0 < amount < float("inf"):
            raise ValueError("Payment must be a positive, finite number.")
        if amount > self.balance_due:
            raise OverpaymentError(
                f"Payment of Rs. {amount} exceeds the balance of Rs. {self.balance_due}."
            )

        self.paid_amount += amount
        if self.balance_due == 0:
            self.status = "paid"

    def void(self):
        if self.status == "void" or self.paid_amount > 0:
            raise InvalidInvoiceStatusError("Only an unpaid, active invoice can be voided.")

        self.status = "void"


invoice = Invoice("INV-1001", "Sharma Traders")

invoice.add_item("Laptop stand", 2, 1500)
invoice.add_item("USB-C hub", 1, 2000)
mouse_id = invoice.add_item("Wireless mouse", 1, 500)
invoice.remove_item(mouse_id)
print(invoice.calculate_subtotal())  # 5000

invoice.apply_discount(500)
print(invoice.calculate_total())     # 5310.0  (4500 + 18% GST)

invoice.issue()
invoice.record_payment(3000)
print(invoice.balance_due, invoice.status)  # 2310.0 issued

try:
    invoice.record_payment(5000)
except OverpaymentError as error:
    print(type(error).__name__, "-", error)
    # OverpaymentError - Payment of Rs. 5000 exceeds the balance of Rs. 2310.0.
```

**Output:**

```text
5000
5310.0
2310.0 issued
OverpaymentError - Payment of Rs. 5000 exceeds the balance of Rs. 2310.0.
```

</details>

### 19. Email notification (`EmailNotification` inherits `Notification`)

- **Attributes:** `notification_id`, `recipient`, `subject`, `body`, `status`, `attempt_count`, `last_error`
- **8 methods:** `set_recipient(address)`, `set_subject(subject)`, `set_body(body)`, `validate()`, `queue()`, `send()`, `retry()`, `cancel()`
- **Validation:** Require a valid-looking address, a subject, and a body before queueing. Retry only after a failed send and within the attempt limit.
- **Exceptions:** `InvalidRecipientError`, `IncompleteNotificationError`, `DeliveryError`, `RetryLimitError`.
- **Decorator:** `@abstractmethod` on `Notification.send()` if email, SMS, and push subclasses each implement their own delivery method.

**Program:** Write a Python program to create an abstract `Notification` class with the attributes `notification_id`, `recipient`, `body`, `status`, `attempt_count`, and `last_error`. Create an `EmailNotification` class that inherits from `Notification` and adds `subject`. A new notification starts as a `draft` with an empty recipient, subject, and body, zero attempts, and no error. An email can be sent at most 3 times. To keep the program offline and predictable, pass `fail_times` to simulate a mail server that fails the first few sends.

Implement these eight methods in `EmailNotification`:

1. `set_recipient(address)` sets the email address after a basic format check.
2. `set_subject(subject)` sets the subject.
3. `set_body(body)` sets the message body.
4. `validate()` returns `True` if the recipient, subject, and body are all present.
5. `queue()` validates the email and sets the status to `queued`.
6. `send()` sends a queued email, counts the attempt, and sets the status to `sent` or `failed`.
7. `retry()` sends a failed email again if the attempt limit allows it.
8. `cancel()` cancels an email that has not been sent.

Raise `InvalidRecipientError` for a missing or badly formed address, `IncompleteNotificationError` when the subject or body is missing, `DeliveryError` when a send fails, and `RetryLimitError` when all 3 attempts are used. Raise `ValueError` when an action does not fit the current status. Use `abc.ABC` and mark `Notification.send()` with `@abstractmethod`, so email, SMS, and push subclasses must each implement their own delivery.

Create email `N-701` to `anjali.verma@example.in` with the subject "Your order has shipped" and a short body about a parcel going to Pune, using a mail server that fails once. Queue it and send it, catching and printing the delivery error. Then retry it and print its status and attempt count. Finally, create a second email and try to set the recipient to `rahul.example.com`, printing the error.

<details>
<summary>Answer</summary>

```python
from abc import ABC, abstractmethod


class InvalidRecipientError(Exception):
    pass


class IncompleteNotificationError(Exception):
    pass


class DeliveryError(Exception):
    pass


class RetryLimitError(Exception):
    pass


class Notification(ABC):
    def __init__(self, notification_id):
        self.notification_id = notification_id
        self.recipient = ""
        self.body = ""
        self.status = "draft"
        self.attempt_count = 0
        self.last_error = None

    @abstractmethod
    def send(self):
        pass


class EmailNotification(Notification):
    MAX_ATTEMPTS = 3

    def __init__(self, notification_id, fail_times=0):
        super().__init__(notification_id)
        self.subject = ""
        self.fail_times = fail_times    # Simulates a mail server that fails N times

    def _require_editable(self):
        if self.status not in ("draft", "failed"):
            raise ValueError(f"Cannot edit a {self.status} email.")

    def set_recipient(self, address):
        self._require_editable()
        name, _, domain = address.partition("@")
        if not name or "." not in domain or " " in address:
            raise InvalidRecipientError(f"'{address}' is not a valid email address.")

        self.recipient = address

    def set_subject(self, subject):
        self._require_editable()
        self.subject = subject.strip()

    def set_body(self, body):
        self._require_editable()
        self.body = body.strip()

    def validate(self):
        if not self.recipient:
            raise InvalidRecipientError("Recipient is missing.")
        if not self.subject or not self.body:
            raise IncompleteNotificationError("Subject and body are required.")
        return True

    def queue(self):
        self._require_editable()
        self.validate()
        self.status = "queued"

    def send(self):
        if self.status != "queued":
            raise ValueError("Queue the email before sending it.")

        self.attempt_count += 1
        if self.attempt_count <= self.fail_times:
            self.status = "failed"
            self.last_error = f"Mail server timeout on attempt {self.attempt_count}."
            raise DeliveryError(self.last_error)

        self.status = "sent"
        self.last_error = None

    def retry(self):
        if self.status != "failed":
            raise ValueError("Only a failed email can be retried.")
        if self.attempt_count >= self.MAX_ATTEMPTS:
            raise RetryLimitError(f"Gave up after {self.attempt_count} attempts.")

        self.status = "queued"
        self.send()

    def cancel(self):
        if self.status in ("sent", "cancelled"):
            raise ValueError(f"Cannot cancel a {self.status} email.")

        self.status = "cancelled"


email = EmailNotification("N-701", fail_times=1)
email.set_recipient("anjali.verma@example.in")
email.set_subject("Your order has shipped")
email.set_body("Your parcel will reach Pune by Monday.")
email.queue()

try:
    email.send()
except DeliveryError as error:
    print("First try failed:", error)
    # First try failed: Mail server timeout on attempt 1.

email.retry()
print(email.status, email.attempt_count)  # sent 2

draft = EmailNotification("N-702")
try:
    draft.set_recipient("rahul.example.com")
except InvalidRecipientError as error:
    print(type(error).__name__, "-", error)
    # InvalidRecipientError - 'rahul.example.com' is not a valid email address.
```

**Output:**

```text
First try failed: Mail server timeout on attempt 1.
sent 2
InvalidRecipientError - 'rahul.example.com' is not a valid email address.
```

</details>

### 20. Digital wallet (`DigitalWallet` inherits `PaymentAccount`)

- **Attributes:** `wallet_id`, `owner_id`, `balance`, `currency`, `daily_limit`, `transactions`, `is_locked`
- **8 methods:** `add_money(amount)`, `pay(merchant, amount)`, `send_money(wallet, amount)`, `refund(transaction_id)`, `lock()`, `unlock()`, `show_transactions()`, `calculate_daily_spend()`
- **Validation:** Require positive amounts and matching currencies for transfers. Check the balance and daily spending limit before paying. Allow each eligible transaction to be refunded once.
- **Exceptions:** `ValueError` for invalid amounts, `WalletLockedError`, `InsufficientBalanceError`, `DailyLimitExceededError`, `InvalidRefundError`.
- **Decorator:** Custom `@unlocked_wallet` on `pay()` and `send_money()`.

**Program:** Write a Python program to create a `PaymentAccount` class with the attributes `wallet_id`, `owner_id`, `currency`, and `balance`. Create a `DigitalWallet` class that inherits from `PaymentAccount` and adds `daily_limit`, `transactions`, and `is_locked`. A new wallet starts unlocked in `INR` with a zero balance, no transactions, and a daily spending limit of Rs. 10,000. Each transaction stores an ID (`T1`, `T2`, ...), type, other party, amount, date, and whether it was refunded. Pass the date into each method that needs it so the output stays the same on every run.

Implement these eight methods in `DigitalWallet`:

1. `add_money(amount, on_date)` adds money from the bank.
2. `pay(merchant, amount, on_date)` pays a merchant and returns the transaction ID.
3. `send_money(wallet, amount, on_date)` moves money to another wallet with the same currency.
4. `refund(transaction_id)` returns the money for a merchant payment, once.
5. `lock()` locks the wallet.
6. `unlock()` unlocks the wallet.
7. `show_transactions()` returns all transactions for printing.
8. `calculate_daily_spend(on_date)` returns the total paid and sent on a date, not counting refunded payments.

Raise `ValueError` for non-positive or non-finite amounts and for a currency mismatch, `WalletLockedError` when a locked wallet tries to pay or send, `InsufficientBalanceError` when the balance is too low, `DailyLimitExceededError` when a payment would cross the daily limit, and `InvalidRefundError` for an unknown, non-payment, or already refunded transaction. Write a custom `@unlocked_wallet` decorator with `functools.wraps` and apply it to `pay()` and `send_money()`.

Create wallets for Arjun (`W-101`) and Neha (`W-102`). On 14 November 2026, Arjun adds Rs. 8,000, pays Swiggy Rs. 450, pays BigBasket Rs. 2,500, and sends Rs. 1,000 to Neha. The BigBasket order is cancelled, so refund that payment. Print both balances, Arjun's spending for the day, and his transactions. Finally, lock Arjun's wallet, try to pay Zomato Rs. 300, and print the error.

<details>
<summary>Answer</summary>

```python
from datetime import date
from functools import wraps


class WalletLockedError(Exception):
    pass


class InsufficientBalanceError(Exception):
    pass


class DailyLimitExceededError(Exception):
    pass


class InvalidRefundError(Exception):
    pass


def unlocked_wallet(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if self.is_locked:
            raise WalletLockedError(f"Wallet {self.wallet_id} is locked.")
        return method(self, *args, **kwargs)
    return wrapper


class PaymentAccount:
    def __init__(self, wallet_id, owner_id, currency):
        self.wallet_id = wallet_id
        self.owner_id = owner_id
        self.currency = currency
        self.balance = 0


class DigitalWallet(PaymentAccount):
    DEFAULT_DAILY_LIMIT = 10000

    def __init__(self, wallet_id, owner_id, currency="INR", daily_limit=DEFAULT_DAILY_LIMIT):
        super().__init__(wallet_id, owner_id, currency)
        self.daily_limit = daily_limit
        self.transactions = []
        self.is_locked = False

    def _record(self, kind, party, amount, on_date):
        transaction = {
            "id": f"T{len(self.transactions) + 1}", "type": kind, "party": party,
            "amount": amount, "date": on_date, "refunded": False,
        }
        self.transactions.append(transaction)
        return transaction["id"]

    def _debit(self, kind, party, amount, on_date):
        if not 0 < amount < float("inf"):
            raise ValueError("Amount must be a positive, finite number.")
        if amount > self.balance:
            raise InsufficientBalanceError(f"Balance is only Rs. {self.balance}.")
        if self.calculate_daily_spend(on_date) + amount > self.daily_limit:
            raise DailyLimitExceededError(f"Daily limit of Rs. {self.daily_limit} reached.")

        self.balance -= amount
        return self._record(kind, party, amount, on_date)

    def add_money(self, amount, on_date):
        if not 0 < amount < float("inf"):
            raise ValueError("Amount must be a positive, finite number.")

        self.balance += amount
        return self._record("add", "bank", amount, on_date)

    @unlocked_wallet
    def pay(self, merchant, amount, on_date):
        return self._debit("pay", merchant, amount, on_date)

    @unlocked_wallet
    def send_money(self, wallet, amount, on_date):
        if wallet.currency != self.currency:
            raise ValueError("Both wallets must use the same currency.")

        transaction_id = self._debit("send", wallet.owner_id, amount, on_date)
        wallet.balance += amount
        wallet._record("receive", self.owner_id, amount, on_date)
        return transaction_id

    def refund(self, transaction_id):
        for transaction in self.transactions:
            if transaction["id"] == transaction_id:
                break
        else:
            raise InvalidRefundError(f"Transaction {transaction_id} does not exist.")
        if transaction["type"] != "pay" or transaction["refunded"]:
            raise InvalidRefundError(f"Transaction {transaction_id} cannot be refunded.")

        transaction["refunded"] = True
        self.balance += transaction["amount"]

    def lock(self):
        self.is_locked = True

    def unlock(self):
        self.is_locked = False

    def show_transactions(self):
        return "\n".join(
            f"{t['id']} {t['date']} {t['type']:<7} {t['party']:<10} Rs. {t['amount']}"
            + (" (refunded)" if t["refunded"] else "")
            for t in self.transactions
        )

    def calculate_daily_spend(self, on_date):
        return sum(
            t["amount"] for t in self.transactions
            if t["date"] == on_date and t["type"] in ("pay", "send") and not t["refunded"]
        )


arjun = DigitalWallet("W-101", "Arjun")
neha = DigitalWallet("W-102", "Neha")
today = date(2026, 11, 14)

arjun.add_money(8000, today)
arjun.pay("Swiggy", 450, today)
grocery_id = arjun.pay("BigBasket", 2500, today)
arjun.send_money(neha, 1000, today)
arjun.refund(grocery_id)              # BigBasket order cancelled

print(arjun.balance, neha.balance)    # 6550 1000
print(arjun.calculate_daily_spend(today))  # 1450
print(arjun.show_transactions())
# T1 2026-11-14 add     bank       Rs. 8000
# T2 2026-11-14 pay     Swiggy     Rs. 450
# T3 2026-11-14 pay     BigBasket  Rs. 2500 (refunded)
# T4 2026-11-14 send    Neha       Rs. 1000

arjun.lock()
try:
    arjun.pay("Zomato", 300, today)
except WalletLockedError as error:
    print(type(error).__name__, "-", error)
    # WalletLockedError - Wallet W-101 is locked.
```

**Output:**

```text
6550 1000
1450
T1 2026-11-14 add     bank       Rs. 8000
T2 2026-11-14 pay     Swiggy     Rs. 450
T3 2026-11-14 pay     BigBasket  Rs. 2500 (refunded)
T4 2026-11-14 send    Neha       Rs. 1000
WalletLockedError - Wallet W-101 is locked.
```

</details>

### How to turn any skeleton into a program

1. Write the base class if one is listed. Put shared attributes in its `__init__()`.
2. Write the child class and call `super().__init__()` for the shared attributes. Give each instance its own list or dictionary for data such as marks, items, or transactions.
3. Implement one method that reads state, such as `show()`, and one that changes state, such as `repaint()`.
4. Add validation before changing state. Start with `ValueError`, then define a custom exception for a business rule you want callers to handle separately.
5. Create two objects and change only one. Print both to verify that each object keeps its own state. Then try one invalid action and catch its exception.
