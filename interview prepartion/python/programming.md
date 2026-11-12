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

### Program 3

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

### Program 4

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

## Single class: default arguments

One class, no extra methods. Practise required and default `__init__` arguments.

### Program 5

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

## Inheritance

A parent and a child class, from simplest to hardest.

### Program 6

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

### Program 7

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

**Fact (why this program):** **Scenario 1:** the child has no `__init__`, so Python runs the parent's `__init__`. That's why you pass the **parent's** arguments (`brand`).

</details>

### Program 8

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

### Program 9

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

## More programs

The remaining programs, in their original order.

### Program 10

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

### Program 11

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Bike` child class whose `__init__` takes only `gears` and does **not** call `super()`. Create a bike with 21 gears and check whether it has a `brand`.

*From E6, scenario 3: When creating an object of a child class in Python, how do you decide which arguments to pass?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Vehicle` class whose `__init__` stores `brand`.
2. Create `Bike(Vehicle)` whose `__init__` takes only `gears`.
3. Store `gears`, and don't call `super()`.
4. Create `Bike(21)`.
5. Print `gears` and `hasattr(bike, "brand")`.

**Program flow**

```text
Bike(21)                → Bike.__init__ only → gears = 21, parent init skipped
bike.gears              →                    → 21
hasattr(bike, "brand")  → brand never set    → False
```

**Pseudocode**

```text
CLASS Vehicle:
    init(brand):  self.brand = brand
CLASS Bike EXTENDS Vehicle:
    init(gears):  self.gears = gears      // no parent init call

bike = Bike(21)
PRINT bike.gears                 // 21
PRINT bike HAS "brand"?          // False
```

**Code**

```python
class Vehicle:
    def __init__(self, brand):
        self.brand = brand

class Bike(Vehicle):
    def __init__(self, gears):
        self.gears = gears        # parent's __init__ never runs

bike = Bike(21)
print(bike.gears)                # 21
print(hasattr(bike, "brand"))    # False: brand was never set
```

**Output:**

```text
21
False
```

**Fact (why this program):** **Scenario 3:** the child's `__init__` replaces the parent's. Without `super().__init__()`, the parent's setup never runs, so `brand` is missing.

</details>

### Program 12

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

### Program 13

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

### Program 14

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

### Program 15

**Task:** Create a `Parent` class that stores a `name`. Create a `Child` class that inherits from `Parent` and has no `__init__` (use `pass`). Create a child named `"Asha"` and print its name.

*From E11: Can a child class use its parent class's `__init__()` if it doesn't define its own?*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `Parent` class whose `__init__` stores `name`.
2. Create `Child(Parent)` with no `__init__` (`pass`).
3. Create `Child("Asha")` → the parent's `__init__` runs.
4. Print `name`.

**Program flow**

```text
Child("Asha") → Child has no __init__ → Parent.__init__ runs → name = "Asha"
.name         →                                              → "Asha"
```

**Pseudocode**

```text
CLASS Parent:
    init(name):  self.name = name
CLASS Child EXTENDS Parent:  (nothing)

PRINT Child("Asha").name    // Asha
```

**Code**

```python
class Parent:
    def __init__(self, name):
        self.name = name

class Child(Parent):
    pass

print(Child("Asha").name)  # Asha
```

**Output:**

```text
Asha
```

**Fact (why this program):** If a child doesn't define `__init__`, Python uses the parent's automatically. If the child writes its own, call `super().__init__()` to keep the parent's setup.

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

### 2. Student form (`StudentForm` inherits `Form`)

- **Attributes:** `form_id`, `student_name`, `age`, `height_cm`, `marks`, `status`, `submitted_at`
- **8 methods:** `fill_details(name, age, height_cm)`, `fill_marks(subject, score)`, `remove_marks(subject)`, `calculate_average()`, `validate()`, `preview()`, `save()`, `submit()`
- **Validation:** Require a name, positive age and height, and marks from 0 to 100. Require at least one subject before submission.
- **Exceptions:** `ValueError` for invalid input, `IncompleteFormError` when required details are missing, `FormAlreadySubmittedError` on a second submission.
- **Decorator:** Custom `@draft_only` on `fill_details()` and `fill_marks()` to block edits after submission.

### 3. Dog (`Dog` inherits `Animal`)

- **Attributes:** `name`, `age`, `size`, `breed`, `energy`, `is_sleeping`, `tricks`
- **8 methods:** `bark()`, `eat(food)`, `sleep()`, `wake_up()`, `walk(minutes)`, `play(minutes)`, `learn_trick(name)`, `perform_trick(name)`
- **Validation:** Allow `small`, `medium`, or `large` for size. Keep energy between 0 and 100 and require positive activity duration.
- **Exceptions:** `ValueError` for invalid size or duration, `DogSleepingError` when trying to play while asleep, `UnknownTrickError` for an unlearned trick.
- **Decorator:** `@abstractmethod` on `Animal.eat()` if you make `Animal` an abstract base class. Implement `eat()` in `Dog`.

### 4. Savings account (`SavingsAccount` inherits `BankAccount`)

- **Attributes:** `account_number`, `holder_name`, `balance`, `interest_rate`, `is_frozen`, `transactions`
- **8 methods:** `deposit(amount)`, `withdraw(amount)`, `transfer_to(account, amount)`, `calculate_interest()`, `apply_interest()`, `show_statement()`, `freeze()`, `unfreeze()`
- **Validation:** Require positive transaction amounts. Verify that a transfer can succeed before changing either balance.
- **Exceptions:** `ValueError` for invalid amounts, `InsufficientBalanceError` for an overdraft, `AccountFrozenError` when a frozen account tries to move money.
- **Decorator:** Custom `@active_account` on `deposit()`, `withdraw()`, and `transfer_to()`.

### 5. Library book (`LibraryBook` inherits `LibraryItem`)

- **Attributes:** `item_id`, `title`, `author`, `isbn`, `borrower_id`, `due_date`, `reserved_by`
- **8 methods:** `show_details()`, `borrow(member_id, due_date)`, `return_book()`, `renew(new_due_date)`, `reserve(member_id)`, `cancel_reservation(member_id)`, `calculate_late_fee(as_of_date)`, `update_title(title)`
- **Validation:** Require a title and a future due date for a new loan. Block renewal if another member holds the reservation.
- **Exceptions:** `BookUnavailableError` for borrowing an unavailable book, `BookNotBorrowedError` for returning a book without an active loan.
- **Decorator:** `@property` on `is_borrowed`, computed from `borrower_id`.

### 6. Shopping cart (`ShoppingCart`)

- **Attributes:** `cart_id`, `customer_id`, `items`, `coupon_code`, `discount_percent`, `status`
- **8 methods:** `add_item(product, qty)`, `remove_item(product_id)`, `update_quantity(product_id, qty)`, `apply_coupon(code)`, `remove_coupon()`, `calculate_total()`, `clear()`, `checkout()`
- **Validation:** Require positive whole-number quantities and an eligible coupon. Recheck stock at checkout.
- **Exceptions:** `ValueError` for invalid quantities, `InvalidCouponError`, `EmptyCartError`, `OutOfStockError`.
- **Decorator:** `@property` on `item_count`, computed by summing the quantities.

### 7. Salaried employee (`SalariedEmployee` inherits `Employee`)

- **Attributes:** `employee_id`, `name`, `department`, `monthly_salary`, `bonus`, `leave_balance`, `employment_status`
- **8 methods:** `show_profile()`, `calculate_gross_pay()`, `add_bonus(amount)`, `give_raise(percent)`, `request_leave(days)`, `restore_leave(days)`, `change_department(name)`, `deactivate()`
- **Validation:** Require nonnegative salary, positive bonus and raise amounts, and enough leave for each request.
- **Exceptions:** `ValueError` for invalid amounts, `InsufficientLeaveError`, `InactiveEmployeeError`.
- **Decorator:** Custom `@active_employee` on `request_leave()` and `change_department()`.

### 8. Restaurant order (`RestaurantOrder` inherits `Order`)

- **Attributes:** `order_id`, `table_number`, `items`, `special_instructions`, `status`, `tax_rate`
- **8 methods:** `add_dish(dish, qty)`, `remove_dish(dish_id)`, `add_instruction(text)`, `calculate_total()`, `send_to_kitchen()`, `mark_ready()`, `serve()`, `cancel()`
- **Validation:** Require a positive table number and quantity. Require at least one dish before sending the order. Follow the sequence draft → cooking → ready → served.
- **Exceptions:** `EmptyOrderError`, `InvalidOrderStatusError`.
- **Decorator:** Custom `@draft_only` on `add_dish()` and `remove_dish()` to prevent edits after the kitchen receives the order.

### 9. Hotel booking (`HotelBooking` inherits `Booking`)

- **Attributes:** `booking_id`, `guest_name`, `room_number`, `check_in_date`, `check_out_date`, `nightly_rate`, `status`
- **8 methods:** `check_availability()`, `calculate_price()`, `confirm()`, `reschedule(start, end)`, `change_room(room_number)`, `check_in()`, `check_out()`, `cancel()`
- **Validation:** Require checkout after check-in. Check room availability before confirming or changing dates.
- **Exceptions:** `ValueError` for invalid dates, `RoomUnavailableError`, `InvalidBookingStatusError`.
- **Decorator:** `@property` on `nights`, computed from the two dates.

### 10. Video lesson (`VideoLesson` inherits `Lesson`)

- **Attributes:** `lesson_id`, `title`, `duration_seconds`, `position_seconds`, `is_playing`, `notes`, `completed`
- **8 methods:** `play()`, `pause()`, `resume()`, `seek(second)`, `restart()`, `add_note(text)`, `remove_note(index)`, `mark_complete()`
- **Validation:** Require positive duration, a seek position within the video, and nonempty notes.
- **Exceptions:** `ValueError` for an invalid seek position, `IndexError` for an invalid note index, `LessonNotStartedError` when pausing before playback starts.
- **Decorator:** `@property` on `progress_percent`, computed from position and duration.

### 11. Split AC (`SplitAC` inherits `Appliance`)

- **Attributes:** `brand`, `model`, `power_on`, `temperature_c`, `mode`, `fan_speed`, `timer_minutes`, `filter_hours`
- **8 methods:** `turn_on()`, `turn_off()`, `set_temperature(celsius)`, `set_mode(mode)`, `set_fan_speed(speed)`, `set_timer(minutes)`, `cancel_timer()`, `reset_filter_counter()`
- **Validation:** For this prototype, allow temperatures from 16 to 30°C, known modes, and positive timer durations.
- **Exceptions:** `ValueError` for invalid settings, `ApplianceOffError` when changing settings that require power.
- **Decorator:** Custom `@requires_power` on `set_temperature()`, `set_mode()`, and `set_timer()`.

### 12. Doctor appointment (`DoctorAppointment` inherits `Appointment`)

- **Attributes:** `appointment_id`, `patient_id`, `doctor_id`, `starts_at`, `duration_minutes`, `reason`, `status`
- **8 methods:** `schedule()`, `confirm()`, `reschedule(starts_at)`, `check_in()`, `start_consultation()`, `complete()`, `cancel()`, `summary()`
- **Validation:** Require a future time when scheduling, positive duration, and an available doctor slot. Require patient check-in before starting.
- **Exceptions:** `ValueError` for invalid time or duration, `SlotUnavailableError`, `InvalidAppointmentStatusError`.
- **Decorator:** `@property` on `ends_at`, computed from the start time and duration.

### 13. Courier parcel (`CourierParcel` inherits `Shipment`)

- **Attributes:** `tracking_id`, `sender`, `recipient`, `weight_kg`, `destination`, `status`, `tracking_events`
- **8 methods:** `calculate_shipping_cost()`, `pack()`, `dispatch()`, `update_location(location)`, `mark_out_for_delivery()`, `mark_delivered()`, `mark_returned()`, `show_tracking()`
- **Validation:** Require positive weight and a destination. Check status before each transition and record successful updates in the tracking history.
- **Exceptions:** `ValueError` for invalid weight or destination, `InvalidShipmentStatusError`.
- **Decorator:** `@classmethod` on `from_dict(cls, data)` to construct a parcel from a saved record.

### 14. Inventory product (`InventoryProduct` inherits `Product`)

- **Attributes:** `sku`, `name`, `unit_price`, `stock`, `reserved_qty`, `reorder_level`, `is_discontinued`
- **8 methods:** `add_stock(qty)`, `reserve_stock(qty)`, `release_stock(qty)`, `fulfill_reservation(qty)`, `change_price(price)`, `needs_reorder()`, `discontinue()`, `stock_report()`
- **Validation:** Require whole-number stock counts. Keep `reserved_qty` between zero and stock. Fulfilling a reservation reduces both counts.
- **Exceptions:** `ValueError` for invalid quantity or price, `InsufficientStockError`, `ProductDiscontinuedError` for a new reservation on a discontinued product.
- **Decorator:** `@property` on `available_stock`, computed as `stock - reserved_qty`.

### 15. Support ticket (`SupportTicket`)

- **Attributes:** `ticket_id`, `subject`, `description`, `priority`, `status`, `assignee`, `comments`
- **8 methods:** `assign(agent)`, `unassign()`, `change_priority(priority)`, `add_comment(text)`, `start_work()`, `resolve()`, `reopen()`, `close()`
- **Validation:** Allow known priorities, require a nonempty comment, and require an assignee before work starts.
- **Exceptions:** `ValueError` for an invalid priority or blank comment, `TicketUnassignedError`, `InvalidTicketStatusError`.
- **Decorator:** `@staticmethod` on `is_valid_priority(priority)` because the check only uses the supplied value.

### 16. Discount coupon (`PercentageCoupon` inherits `Coupon`)

- **Attributes:** `code`, `percent_off`, `min_order_amount`, `expires_at`, `usage_limit`, `used_count`, `is_active`
- **8 methods:** `activate()`, `deactivate()`, `extend_expiry(date)`, `update_limit(limit)`, `check_eligibility(order_total, as_of)`, `calculate_discount(order_total, as_of)`, `redeem(order_total, as_of)`, `show_details()`
- **Validation:** Require a percentage greater than 0 and at most 100. Require a valid expiry date, enough order value, and remaining uses.
- **Exceptions:** `ValueError` for invalid configuration, `CouponExpiredError`, `CouponUsageLimitError`, `CouponMinimumOrderError`.
- **Decorator:** `@property` on `remaining_uses`. Let `calculate_discount()` preview the amount and `redeem()` increase `used_count`.

### 17. Quiz attempt (`QuizAttempt` inherits `AssessmentAttempt`)

- **Attributes:** `attempt_id`, `student_id`, `questions`, `answers`, `started_at`, `submitted_at`, `status`
- **8 methods:** `start()`, `show_question(question_id)`, `answer(question_id, option)`, `change_answer(question_id, option)`, `clear_answer(question_id)`, `submit()`, `calculate_score()`, `review()`
- **Validation:** Require a known question and a valid option. Allow answers to change only during an active attempt.
- **Exceptions:** `UnknownQuestionError`, `ValueError` for an invalid option, `InvalidAttemptStatusError`.
- **Decorator:** Custom `@attempt_in_progress` on `answer()`, `change_answer()`, and `clear_answer()`.

### 18. Draft invoice (`Invoice` inherits `BillingDocument`)

- **Attributes:** `invoice_number`, `customer_name`, `line_items`, `tax_rate`, `discount_amount`, `status`, `paid_amount`
- **8 methods:** `add_item(description, qty, unit_price)`, `remove_item(item_id)`, `apply_discount(amount)`, `calculate_subtotal()`, `calculate_total()`, `issue()`, `record_payment(amount)`, `void()`
- **Validation:** Require positive quantities, nonnegative prices, and a discount within the subtotal. Require a positive payment that does not exceed the outstanding balance.
- **Exceptions:** `ValueError` for invalid amounts, `EmptyInvoiceError`, `InvalidInvoiceStatusError`, `OverpaymentError`.
- **Decorator:** `@property` on `balance_due`, computed as total minus payments.

### 19. Email notification (`EmailNotification` inherits `Notification`)

- **Attributes:** `notification_id`, `recipient`, `subject`, `body`, `status`, `attempt_count`, `last_error`
- **8 methods:** `set_recipient(address)`, `set_subject(subject)`, `set_body(body)`, `validate()`, `queue()`, `send()`, `retry()`, `cancel()`
- **Validation:** Require a valid-looking address, a subject, and a body before queueing. Retry only after a failed send and within the attempt limit.
- **Exceptions:** `InvalidRecipientError`, `IncompleteNotificationError`, `DeliveryError`, `RetryLimitError`.
- **Decorator:** `@abstractmethod` on `Notification.send()` if email, SMS, and push subclasses each implement their own delivery method.

### 20. Digital wallet (`DigitalWallet` inherits `PaymentAccount`)

- **Attributes:** `wallet_id`, `owner_id`, `balance`, `currency`, `daily_limit`, `transactions`, `is_locked`
- **8 methods:** `add_money(amount)`, `pay(merchant, amount)`, `send_money(wallet, amount)`, `refund(transaction_id)`, `lock()`, `unlock()`, `show_transactions()`, `calculate_daily_spend()`
- **Validation:** Require positive amounts and matching currencies for transfers. Check the balance and daily spending limit before paying. Allow each eligible transaction to be refunded once.
- **Exceptions:** `ValueError` for invalid amounts, `WalletLockedError`, `InsufficientBalanceError`, `DailyLimitExceededError`, `InvalidRefundError`.
- **Decorator:** Custom `@unlocked_wallet` on `pay()` and `send_money()`.

### How to turn any skeleton into a program

1. Write the base class if one is listed. Put shared attributes in its `__init__()`.
2. Write the child class and call `super().__init__()` for the shared attributes. Give each instance its own list or dictionary for data such as marks, items, or transactions.
3. Implement one method that reads state, such as `show()`, and one that changes state, such as `repaint()`.
4. Add validation before changing state. Start with `ValueError`, then define a custom exception for a business rule you want callers to handle separately.
5. Create two objects and change only one. Print both to verify that each object keeps its own state. Then try one invalid action and catch its exception.
