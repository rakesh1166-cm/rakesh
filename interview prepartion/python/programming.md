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

**7. Closure (function that remembers)**

```python
def multiplier(number):               # outer: takes the value to remember
    def multiply(value):              # inner: uses number from the outer function
        return value * number
    return multiply                   # return the function, not multiply()


double = multiplier(2)                # remembers number = 2
triple = multiplier(3)                # remembers number = 3

print(double(5))                      # 10
print(triple(5))                      # 15
```

Used in: Programs 66, 86. Patterns 8 and 9 (decorators) are closures too: `wrapper` remembers `function`.

**8. Decorator**

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

**9. Decorator that takes an argument**

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

**10. Context manager (`with`)**

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

**11. Generator**

```python
def generate(items):
    for item in items:
        if item:                      # fill in: the condition
            yield item                # hand out one value, then pause


for value in generate(["a", "", "b"]):
    print(value)
```

**12. Dataclass with validation**

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

**13. Mixin**

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

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** Every student is asked the same question, 'What is your roll number?', but each one gives their own answer.
- 💻 **In software:** In a Django model, `order.get_total()` runs the same code but returns a different total for each order row.

</details>

### Program 2

**Task:** Create a `Rectangle` class that stores a `length`. Add `get_length()`, which needs no arguments, and `area(width)`, which needs a width. Create a rectangle of length 10 and print its length and its area for width 5.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** A tailor already has your cloth length noted, so they only ask for the width to work out the area.
- 💻 **In software:** In an API client, `client.get(path)` takes only the path because the base URL is already stored on `self`.

</details>

### Program 3

**Task:** Create a `Student` class that stores a `name`. Add a method `same_as(other)` that returns `True` if `other` is the same object as `self`. Create a student `"Asha"` and check `first.same_as(first)`.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** 'Rahul' at home and 'Roll No. 12' at school are two names for the same boy.
- 💻 **In software:** Caching and ORM code use `obj is other` to check whether two variables point to the very same loaded record.

</details>

### Program 4

**Task:** Show that a list written in the class body is shared by all objects, but a list created in `__init__` is not. Use a `Team` class with `members` (class level) and `tasks` (in `__init__`).

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** A class notice board is shared by everyone, but each student's notebook belongs only to them.
- 💻 **In software:** A list in the class body of a Flask service leaks one user's data into another user's request; create it in `__init__` instead.

</details>

### Program 5

**Task:** Create a `BankAccount` class with `owner`, `balance`, a `history` **list**, and a `history_dictionary` **dict**. `deposit(person, amount)` and `withdraw(person, amount)` change the balance, add the amount to the list, and save it in the dict under the person's name (negative for a withdrawal). Add methods to read the balance, change the owner, read the owner, read the history list, and read the history dictionary. Start with `"Asha"` and 1000, Asha deposits 500, Raja withdraws 200, then change the owner to `"Ben"` and print everything.

**Level:** 🔴 Difficult

*From E12: How can you read and modify the state of an object created from a Python class? Show six different examples in a table with Task, Method Call, and Result columns.*

<details>
<summary>Answer</summary>

**Steps**

1. Create a `BankAccount` class.
2. `__init__` stores `owner`, `balance`, `history = []` and `history_dictionary = {}`.
3. `deposit(person, amount)` → add to balance → `append(amount)` to the list → `history_dictionary[person] = amount`.
4. `withdraw(person, amount)` → subtract from balance → `append(-amount)` → `history_dictionary[person] = -amount`.
5. Add getters for balance, owner, history list and history dictionary, and `change_owner(name)`.
6. Start with `"Asha"`, 1000 and call each method once.

**Program flow**

```text
BankAccount("Asha", 1000) → balance = 1000 → history = [], history_dictionary = {}
get_balance()             →                → 1000
deposit("Asha", 500)      → balance = 1500 → history = [500],       dict = {'Asha': 500}
withdraw("Raja", 200)     → balance = 1300 → history = [500, -200], dict = {'Asha': 500, 'Raja': -200}
change_owner("Ben")       → owner = "Ben"  → get_owner() = "Ben"
get_history()             →                → [500, -200]
get_history_dictionary()  →                → {'Asha': 500, 'Raja': -200}
```

**Pseudocode**

```text
CLASS BankAccount:
    init(owner, balance):
        store owner, balance
        history = empty list
        history_dictionary = empty dict
    deposit(person, amount):
        balance += amount
        ADD amount TO END OF history
        history_dictionary[person] = amount
    withdraw(person, amount):
        balance -= amount
        ADD -amount TO END OF history
        history_dictionary[person] = -amount
    change_owner(name):     owner = name
    get_balance / get_owner / get_history / get_history_dictionary:  RETURN the value

account = BankAccount("Asha", 1000)
PRINT balance (1000) → Asha deposits 500 → PRINT (1500) → Raja withdraws 200 → PRINT (1300)
change_owner("Ben") → PRINT owner (Ben)
PRINT history ([500, -200]) → PRINT history_dictionary ({'Asha': 500, 'Raja': -200})
```

**Code**

```python
class BankAccount:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance
        self.history = []               # list: keeps every amount, in order
        self.history_dictionary = {}    # dict: one amount per person

    def get_balance(self):
        return self.balance

    def deposit(self, person, amount):
        self.balance += amount
        self.history.append(amount)                 # add to a list: append()
        self.history_dictionary[person] = amount    # add to a dict: dict[key] = value

    def withdraw(self, person, amount):
        self.balance -= amount
        self.history.append(-amount)
        self.history_dictionary[person] = -amount

    def change_owner(self, name):
        self.owner = name

    def get_owner(self):
        return self.owner

    def get_history(self):
        return self.history

    def get_history_dictionary(self):
        return self.history_dictionary


account = BankAccount("Asha", 1000)
print(account.get_balance())             # 1000
account.deposit("Asha", 500)
print(account.balance)                   # 1500
account.withdraw("Raja", 200)
print(account.balance)                   # 1300
account.change_owner("Ben")
print(account.get_owner())               # Ben
print(account.get_history())             # [500, -200]
print(account.get_history_dictionary())  # {'Asha': 500, 'Raja': -200}
```

**Output:**

```text
1000
1500
1300
Ben
[500, -200]
{'Asha': 500, 'Raja': -200}
```

**List vs dictionary:**

| | `history` (list) | `history_dictionary` (dict) |
|---|---|---|
| Create it in `__init__` | `self.history = []` | `self.history_dictionary = {}` |
| Add an item | `self.history.append(amount)` | `self.history_dictionary[person] = amount` |
| Stores | Every amount, in order | One amount per person (the key) |
| Same person twice | Both amounts are kept | The new amount **replaces** the old one |
| Read one item | By position: `history[0]` → `500` | By key: `history_dictionary["Raja"]` → `-200` |

For example, if Asha deposits again, the list keeps both deposits, but the dict keeps only her latest one. Use a list when you need every entry, and a dict when you look things up by name.

**Fact (why this program):** An object's **state** is its data. You read it and change it through methods, and every change is stored on the object (`self.balance`, `self.history`, `self.history_dictionary`). Create the list and dict in `__init__` so each account gets its own.

**Real-life example:**

- 🏠 **Everyday:** A bank passbook records every deposit and withdrawal and always shows the latest balance.
- 💻 **In software:** A wallet or payment service keeps the balance and a transaction log on the account object and changes them only through methods.

</details>

## Alternative-Single class with methods

## Single class: default arguments

One class, no extra methods. Practise required and default `__init__` arguments.

### Program 6

**Task:** Create a `Student` class with three attributes: `name`, `age`, and `city`. Require `name` and `age` when creating an object, and use `"Delhi"` as the default city.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** A school admission form needs your name and age, but the city field is already filled in as 'Delhi'.
- 💻 **In software:** A Pydantic model in FastAPI makes some request fields required and gives others a default value.

</details>

### Program 56

**Task:** Create a `Task` class with a `title` and an optional `tags` list. First write a `BadTask` that uses `tags=[]` as the default and show that two tasks share one list. Then fix it in `Task` with `tags=None`, so each task gets its own list.

**Level:** 🟡 Medium

*Developer use: any class or function that takes an optional list or dict (tags, headers, filters, settings) must use `None` as the default.*

<details>
<summary>Answer</summary>

**Steps**

1. `BadTask.__init__(self, title, tags=[])` → store `tags`.
2. Create two bad tasks, add `"urgent"` to the first, print the second's tags → it also has `"urgent"`.
3. `Task.__init__(self, title, tags=None)` → if `tags` is `None`, make a new `[]`.
4. Create two good tasks, add `"urgent"` to the first → the second stays empty.
5. Pass your own list once to show it is still used.

**Program flow**

```text
BadTask("Write tests")   → tags = the ONE default list  ┐ same list
BadTask("Fix login")     → tags = the ONE default list  ┘
a.tags.append("urgent")  → b.tags is ['urgent'] too

Task("Write tests")      → tags None → new []  (x)
Task("Fix login")        → tags None → new []  (y)
x.tags.append("urgent")  → x: ['urgent'], y: []
Task("Deploy", ["release"]) → your list is kept
```

**Pseudocode**

```text
CLASS BadTask:
    INIT(title, tags = [])          // list made ONCE, when def runs
        self.tags = tags

CLASS Task:
    INIT(title, tags = None)
        IF tags IS None: self.tags = new empty list
        ELSE:            self.tags = tags

a, b = BadTask(...), BadTask(...)
ADD "urgent" TO a.tags
PRINT b.tags                // ['urgent']  (bug)

x, y = Task(...), Task(...)
ADD "urgent" TO x.tags
PRINT x.tags, y.tags        // ['urgent'], []
```

**Code**

```python
class BadTask:
    def __init__(self, title, tags=[]):      # one list, made once
        self.title = title
        self.tags = tags


class Task:
    def __init__(self, title, tags=None):    # None means "no list given"
        self.title = title
        self.tags = tags if tags is not None else []   # new list each time


a = BadTask("Write tests")
b = BadTask("Fix login")
a.tags.append("urgent")
print("Bad:", b.tags)            # b got a's tag!

x = Task("Write tests")
y = Task("Fix login")
x.tags.append("urgent")
print("Good x:", x.tags)
print("Good y:", y.tags)

z = Task("Deploy", ["release"])
print("Given:", z.tags)
```

**Output:**

```text
Bad: ['urgent']
Good x: ['urgent']
Good y: []
Given: ['release']
```

**Fact (why this program):** Python creates a default value **once**, when the `def` line runs, not on every call. A default `[]` or `{}` is therefore shared by every object. Use `None` and create the list inside `__init__`. This is one of the most common Python interview traps.

**Real-life example:**

- 🏠 **Everyday:** If every new student gets the same shared answer sheet, one student's answers show up on everyone's sheet.
- 💻 **In software:** A `tags=[]` default in a ticket model makes all tickets share one tag list, which is a classic production bug.

</details>

### Program 57

**Task:** Create a `Notification` class with required `user` and `message`, and two defaults: `channel="email"` and `retries=3`. Create four notifications: one with both defaults, one that changes only `channel`, one that skips `channel` but changes `retries`, and one written fully with keyword arguments. Print each one and print the stored defaults.

**Level:** 🟡 Medium

*Developer use: service classes (email, SMS, push, HTTP calls) have many settings with sensible defaults; callers change only what they need using keyword arguments.*

<details>
<summary>Answer</summary>

**Steps**

1. `__init__(self, user, message, channel="email", retries=3)` → store all four.
2. `show()` → return one line with all values.
3. Create `n1` with only the required values.
4. Create `n2` with `channel="sms"` and `n3` with `retries=5` (keywords let you skip `channel`).
5. Create `n4` with every value written as a keyword.
6. Print each, then `Notification.__init__.__defaults__`.

**Program flow**

```text
Notification("asha", "Order shipped")              → channel email, retries 3
Notification("ravi", "OTP 4821", channel="sms")    → channel sms,   retries 3
Notification("neha", "Payment failed", retries=5)  → channel email, retries 5
Notification(user=..., message=..., channel="push", retries=0) → all given
__init__.__defaults__                              → ('email', 3)
```

**Pseudocode**

```text
CLASS Notification:
    INIT(user, message, channel = "email", retries = 3)
        save all four
    show(): RETURN "user | channel | retries=N | message"

n1 = Notification("asha", "Order shipped")
n2 = Notification("ravi", "OTP 4821", channel = "sms")
n3 = Notification("neha", "Payment failed", retries = 5)
n4 = Notification(user = "amit", message = "Welcome", channel = "push", retries = 0)

FOR n IN n1, n2, n3, n4: PRINT n.show()
PRINT defaults of __init__     // ('email', 3)
```

**Code**

```python
class Notification:
    def __init__(self, user, message, channel="email", retries=3):
        self.user = user
        self.message = message
        self.channel = channel
        self.retries = retries

    def show(self):
        return f"{self.user} | {self.channel} | retries={self.retries} | {self.message}"


n1 = Notification("asha", "Order shipped")                   # both defaults
n2 = Notification("ravi", "OTP 4821", channel="sms")          # change one default
n3 = Notification("neha", "Payment failed", retries=5)        # skip channel, change retries
n4 = Notification(user="amit", message="Welcome", channel="push", retries=0)

for n in (n1, n2, n3, n4):
    print(n.show())

print(Notification.__init__.__defaults__)   # the stored default values
```

**Output:**

```text
asha | email | retries=3 | Order shipped
ravi | sms | retries=3 | OTP 4821
neha | email | retries=5 | Payment failed
amit | push | retries=0 | Welcome
('email', 3)
```

**Fact (why this program):** Required arguments come first, defaults come after. Keyword arguments let the caller skip a default in the middle (`retries=5` without giving `channel`) and make the call easy to read. `retries=0` is a real value, so it is used, not replaced by the default.

**Real-life example:**

- 🏠 **Everyday:** On Swiggy you change only the spice level and leave every other option at its default.
- 💻 **In software:** `send_notification(user, msg, retries=5)` changes the retries and leaves the default channel as it is.

</details>

### Program 58

**Task:** Create a `DbConnection` class with class attributes `DEFAULT_PORT = 5432` and `DEFAULT_POOL_SIZE = 5`. Its `__init__` takes `host`, `port=None` and `pool_size=None`, and uses the class default when a value is `None`. Create a `MySqlConnection` child that only changes `DEFAULT_PORT` to `3306`. Show that a `pool_size` of `0` is kept, and why `or` would get it wrong.

**Level:** 🔴 Difficult

*Developer use: database clients, HTTP clients and SDKs keep defaults as class attributes so child classes or tests can change a default without rewriting `__init__`.*

<details>
<summary>Answer</summary>

**Steps**

1. Put `DEFAULT_PORT` and `DEFAULT_POOL_SIZE` on the class.
2. In `__init__`, use `port if port is not None else self.DEFAULT_PORT` (same for pool size).
3. `show()` → return the class name, host, port and pool size.
4. `MySqlConnection(DbConnection)` → set only `DEFAULT_PORT = 3306`.
5. Create connections with no port, a custom port, and `pool_size=0`.
6. Compare `pool_size or 5` with `pool_size if pool_size is not None else 5`.

**Program flow**

```text
DbConnection("db.local")         → port None → self.DEFAULT_PORT → 5432
MySqlConnection("mysql.local")   → port None → self.DEFAULT_PORT → 3306 (child's value)
DbConnection(..., port=6000)     → port given → 6000
DbConnection(..., pool_size=0)   → 0 is not None → keep 0
0 or 5                           → 0 is falsy → 5 (wrong)
0 if 0 is not None else 5        → 0 (right)
```

**Pseudocode**

```text
CLASS DbConnection:
    DEFAULT_PORT = 5432
    DEFAULT_POOL_SIZE = 5
    INIT(host, port = None, pool_size = None)
        self.port      = port      IF port IS NOT None      ELSE self.DEFAULT_PORT
        self.pool_size = pool_size IF pool_size IS NOT None ELSE self.DEFAULT_POOL_SIZE

CLASS MySqlConnection EXTENDS DbConnection:
    DEFAULT_PORT = 3306          // only the default changes

PRINT DbConnection("db.local").show()          // :5432
PRINT MySqlConnection("mysql.local").show()    // :3306
PRINT DbConnection("test.local", pool_size = 0).show()   // pool=0
```

**Code**

```python
class DbConnection:
    DEFAULT_PORT = 5432        # class-level defaults
    DEFAULT_POOL_SIZE = 5

    def __init__(self, host, port=None, pool_size=None):
        # None means "use the class default"
        self.host = host
        self.port = port if port is not None else self.DEFAULT_PORT
        self.pool_size = pool_size if pool_size is not None else self.DEFAULT_POOL_SIZE

    def show(self):
        return f"{type(self).__name__} {self.host}:{self.port} pool={self.pool_size}"


class MySqlConnection(DbConnection):
    DEFAULT_PORT = 3306        # child changes only the default


print(DbConnection("db.local").show())
print(MySqlConnection("mysql.local").show())
print(DbConnection("db.local", port=6000).show())
print(DbConnection("test.local", pool_size=0).show())   # 0 is kept

# Why "is not None" and not "or":
pool_size = 0
print("with or:", pool_size or 5)     # 0 is falsy, so 5 wins (wrong)
print("with is not None:", pool_size if pool_size is not None else 5)
```

**Output:**

```text
DbConnection db.local:5432 pool=5
MySqlConnection mysql.local:3306 pool=5
DbConnection db.local:6000 pool=5
DbConnection test.local:5432 pool=0
with or: 5
with is not None: 0
```

**Fact (why this program):** `self.DEFAULT_PORT` looks up the attribute on the object's own class first, so a child class can change a default with one line. Use `is not None` to pick the default: `or` also replaces real values such as `0`, `""` and `False`.

**Real-life example:**

- 🏠 **Everyday:** A restaurant chain has standard menu prices, and one branch changes only the price of tea.
- 💻 **In software:** A database connector stores `DEFAULT_PORT` on the class, and its MySQL subclass overrides only the port.

</details>

## Alternative-Single class: default arguments

### Program 13

**Task:** Create a `Coffee` class with `name` and `size`, where `size` defaults to `"medium"`. Create a Latte without a size and a Mocha with `"large"`, and print both sizes.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** A coffee shop gives you a medium cup unless you ask for a large one.
- 💻 **In software:** `requests.get(url, timeout=10)` uses the default timeout unless a call passes its own value.

</details>

## Instance method, static method and class method

Methods that get `self`, `cls`, or neither.

### Program 17

**Task:** Create a `Pizza` class with a class attribute `size_unit = "inch"`. Its `__init__` takes a `size` and stores it on the object. Add:

- an instance method `describe()` that returns the size with the unit, such as `"8 inch"`
- a class method `large()` that creates and returns a 12-inch pizza
- a static method `is_valid(size)` that returns `True` if the size is positive, otherwise `False`

Then print `Pizza(8).describe()`, the size of `Pizza.large()`, and `Pizza.is_valid(-1)`. Expected output: `8 inch`, `12`, `False`.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** In a pizza shop, 'make my pizza' needs your order, 'change the menu units' affects the whole shop, and 'convert inches to cm' needs neither.
- 💻 **In software:** Django models use instance methods for one row, class methods for the whole table, and static methods for helper checks.

</details>

### Program 18

**Task:** Create a `Student` class with a class attribute `school = "City School"`. Add a class method `rename_school(name)`. Create two students, rename the school once, and print both students' school.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** When the school changes its name, every student's ID card shows the new name.
- 💻 **In software:** A class method updates a shared setting such as `Config.environment`, and every object sees the change.

</details>

### Program 59

**Task:** Create a `User` class that stores a `name` and an `email`. Add a static method `is_valid_email(email)` that returns `True` when the email has an `@` and a `.` after it. Call it directly on the class, use it inside `__init__` to reject a bad email with `ValueError`, and catch that error.

**Level:** 🟡 Medium

*Developer use: static methods hold small helper checks (validate email, phone, PAN, slug) that belong to the class but don't need any object data.*

<details>
<summary>Answer</summary>

**Steps**

1. `@staticmethod def is_valid_email(email)` → no `self`, no `cls`, just return the check.
2. In `__init__`, call `User.is_valid_email(email)`; if it's `False`, raise `ValueError`.
3. Call `User.is_valid_email(...)` with a good and a bad email, without creating a user.
4. Create a valid user and print it.
5. Try a bad email inside `try` and print the error.

**Program flow**

```text
User.is_valid_email("asha@example.com") → has @ and "." after it → True
User.is_valid_email("asha.example.com") → no @                    → False
User("Asha", "asha@example.com")        → check passes → object created
User("Ravi", "ravi@site")               → no "." after @ → raise ValueError
except ValueError                       → "Error: Invalid email: ravi@site"
```

**Pseudocode**

```text
CLASS User:
    INIT(name, email)
        IF NOT User.is_valid_email(email): RAISE ValueError
        save name and email

    STATIC is_valid_email(email):          // no self, no cls
        RETURN "@" IN email AND "." IN part after "@"

PRINT User.is_valid_email("asha@example.com")   // True
PRINT User.is_valid_email("asha.example.com")   // False
user = User("Asha", "asha@example.com")
TRY User("Ravi", "ravi@site")
CATCH ValueError: PRINT error
```

**Code**

```python
class User:
    def __init__(self, name, email):
        if not User.is_valid_email(email):       # use the helper inside the class
            raise ValueError(f"Invalid email: {email}")
        self.name = name
        self.email = email

    @staticmethod
    def is_valid_email(email):
        # no self, no cls: just a check on the value
        return "@" in email and "." in email.split("@")[-1]

    def show(self):
        return f"{self.name} <{self.email}>"


print(User.is_valid_email("asha@example.com"))   # call without an object
print(User.is_valid_email("asha.example.com"))

user = User("Asha", "asha@example.com")
print(user.show())

try:
    User("Ravi", "ravi@site")
except ValueError as error:
    print("Error:", error)
```

**Output:**

```text
True
False
Asha <asha@example.com>
Error: Invalid email: ravi@site
```

**Fact (why this program):** A static method is a plain function kept inside the class because it belongs there. It gets no `self` or `cls`, so you can call it without an object, for example in a form check before you create the user.

**Real-life example:**

- 🏠 **Everyday:** The railway booking form checks your mobile number before any ticket is booked.
- 💻 **In software:** `User.is_valid_email()` checks a signup form before the user object or database row is created.

</details>

### Program 19

**Task:** Create a `User` class that stores a `name`. Add a class method `from_dict(data)` that creates a user from a dict. Create an `Admin` subclass and call `Admin.from_dict({"name": "Asha"})`. Print the type of the object you get.

**Level:** 🔴 Difficult

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

**Real-life example:**

- 🏠 **Everyday:** You can open a bank account by filling in a form or by uploading your Aadhaar, and either way you get an account.
- 💻 **In software:** `User.from_dict(json_data)` builds an object from an API response, and `Admin.from_dict` returns an `Admin`.

</details>

### Program 60

**Task:** Create a `Product` class with `sku`, `name` and `price`, and a class counter `created`. Add a static method `parse_price(text)` that turns `"Rs. 1199"` into `1199.0`, and a class method `from_csv(line)` that builds a product from `"SKU1, Kettle, Rs. 1199"`. Create a `DigitalProduct` child, build one with `DigitalProduct.from_csv(...)`, and show that you get a `DigitalProduct` back and that the counter counts every product.

**Level:** 🔴 Difficult

*Developer use: importers that read CSV rows, JSON or API responses use a class method as an alternative constructor and a static method to clean each field.*

<details>
<summary>Answer</summary>

**Steps**

1. Class attribute `created = 0`; in `__init__`, do `Product.created += 1`.
2. `@staticmethod parse_price(text)` → remove `"Rs."`, strip spaces, return a `float`.
3. `@classmethod from_csv(cls, line)` → split on `,`, clean each part, return `cls(...)`.
4. `DigitalProduct(Product)` → no code of its own.
5. Create two products (one from CSV, one directly) and one digital product from CSV.
6. Print each, both counters, and the type of the digital product.

**Program flow**

```text
Product.from_csv("SKU1, Kettle, Rs. 1199")       → cls = Product        → Product(...)        → created 1
Product("SKU2", "Mixer", 2499)                   → normal constructor   →                     → created 2
DigitalProduct.from_csv("SKU3, Python eBook, …") → cls = DigitalProduct → DigitalProduct(...) → created 3
DigitalProduct.created                           → not on child → reads Product.created → 3
```

**Pseudocode**

```text
CLASS Product:
    created = 0
    INIT(sku, name, price)
        save the three values
        Product.created = Product.created + 1

    STATIC parse_price(text):  RETURN number from "Rs. 1199"
    CLASS_METHOD from_csv(cls, line):
        sku, name, price = SPLIT line BY ","
        RETURN cls(clean sku, clean name, cls.parse_price(price))

CLASS DigitalProduct EXTENDS Product: (nothing)

p1 = Product.from_csv("SKU1, Kettle, Rs. 1199")
p2 = Product("SKU2", "Mixer", 2499)
d1 = DigitalProduct.from_csv("SKU3, Python eBook, Rs. 299")
PRINT Product.created            // 3
PRINT type of d1                 // DigitalProduct
```

**Code**

```python
class Product:
    created = 0                      # one counter for all products

    def __init__(self, sku, name, price):
        self.sku = sku
        self.name = name
        self.price = price
        Product.created += 1         # always update the Product counter

    @staticmethod
    def parse_price(text):
        return float(text.replace("Rs.", "").strip())

    @classmethod
    def from_csv(cls, line):
        sku, name, price = line.split(",")
        return cls(sku.strip(), name.strip(), cls.parse_price(price))

    def show(self):
        return f"{type(self).__name__} {self.sku} {self.name} Rs. {self.price:.2f}"


class DigitalProduct(Product):
    pass


p1 = Product.from_csv("SKU1, Kettle, Rs. 1199")
p2 = Product("SKU2", "Mixer", 2499)
d1 = DigitalProduct.from_csv("SKU3, Python eBook, Rs. 299")

for item in (p1, p2, d1):
    print(item.show())

print("Product.created:", Product.created)
print("DigitalProduct.created:", DigitalProduct.created)
print("Type of d1:", type(d1).__name__)
```

**Output:**

```text
Product SKU1 Kettle Rs. 1199.00
Product SKU2 Mixer Rs. 2499.00
DigitalProduct SKU3 Python eBook Rs. 299.00
Product.created: 3
DigitalProduct.created: 3
Type of d1: DigitalProduct
```

**Fact (why this program):** A class method gets `cls`, the class it was called on, so `return cls(...)` builds the right type: a child class gets a child object without new code. Use a static method for helpers that need neither `self` nor `cls`. Write `Product.created += 1`, not `self.created += 1`: the second creates a new attribute on the object and the class counter never changes.

**Real-life example:**

- 🏠 **Everyday:** A shop reads labels like 'Rs. 1199' from a supplier list and counts how many items it added.
- 💻 **In software:** Import scripts use `Product.from_csv(line)` to load catalogue rows, with a static helper that reads the price.

</details>

## Inheritance

A parent and a child class, from simplest to hardest.

### Program 7

**Task:** Create an `Animal` class with an `eat()` method. Create a `Dog` subclass of `Animal` with its own `bark()` method. Create a dog and call both methods.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** A child inherits the family surname and also has a hobby of their own.
- 💻 **In software:** `CustomUser(AbstractUser)` in Django reuses the parent's login methods and adds new fields.

</details>

### Program 8

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Car` class that inherits from `Vehicle` and has **no** `__init__`. Create a car with brand `"Toyota"` and print its brand.

**Level:** 🟢 Simple

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

**Real-life example:**

- 🏠 **Everyday:** A new bank branch uses the head office account-opening form as it is.
- 💻 **In software:** A Django class-based view subclass with no `__init__` uses the parent's setup.

</details>

### Program 9

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Truck` child class whose `__init__` takes `brand` and `load`, with `"10 tons"` as the default load. Create one truck without a load and one with `"20 tons"`.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** A truck rental gives you a 10-ton truck unless you ask for a bigger one.
- 💻 **In software:** A `PremiumPlan(Plan)` subclass adds a `storage='100GB'` default and still stores the parent's fields.

</details>

### Program 16

**Task:** Create a `Greeter` class with `hello()` and a method `twice()` that calls `hello()` through `self`. Create a `Loud` child that calls the parent's `hello()` with `super()` and returns it in capitals. Call `hello` in six different ways.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** You can call a friend by dialling their number, from your contacts, from recent calls, or by asking someone else to call them.
- 💻 **In software:** Frameworks call your methods by name with `getattr`, plugin systems store them in variables, and subclasses reach them with `super()`.

</details>

### Program 10

**Task:** Create a `Vehicle` class with `brand` and an optional `color` (default `"white"`). Create an `ElectricCar` child class that takes `battery` and forwards everything else to the parent using `*args, **kwargs`. Create a red Tesla with a 75 kWh battery.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** A courier hub adds its own tracking sticker and passes the rest of the parcel on unchanged.
- 💻 **In software:** A custom Django form or DRF serializer takes its own argument and forwards `*args, **kwargs` to the parent.

</details>

### Program 21

**Task:** Create a `Parent` class with a class attribute `role`, an `__init__` that stores `name`, a `show()` method, and a class method `create()`. Create a `Child` class that uses every form of `super()`: parent setup, parent method, the old `super(Child, self)` style, parent class attribute, and parent class method.

**Level:** 🔴 Difficult

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

**Real-life example:**

- 🏠 **Everyday:** A junior manager follows the senior manager's rules, reuses their templates, and adds a few steps of their own.
- 💻 **In software:** Overriding `save()` in a Django model and calling `super().save()` keeps the parent's behaviour and adds new behaviour.

</details>

## Alternative-Inheritance

### Program 11

**Task:** Create a `Vehicle` class that stores a `brand`. Create a `Car` child class whose `__init__` takes `brand` and `seats`, sends `brand` to the parent with `super()`, and stores `seats` itself. Create a Honda with 5 seats and print both values.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** At a hotel, reception records your name and room service adds the number of guests.
- 💻 **In software:** A custom exception calls `super().__init__(message)` and stores its own extra fields, such as `status_code`.

</details>

## Multiple inheritance and MRO

A class with more than one parent, and the order Python searches them (MRO).

### Program 61

**Task:** Create a `Flyer` class with `fly()` and a `Swimmer` class with `swim()`. Create a `Duck` class that inherits from **both** and has no code of its own. Create a duck, call both methods, and print the names of the classes in `Duck.__mro__`.

**Level:** 🟢 Simple

*Developer use: small "mixin" classes add one skill each (logging, JSON export, permissions), and a class inherits several of them at once.*

<details>
<summary>Answer</summary>

**Steps**

1. `class Flyer` → `fly()` returns `"I can fly"`.
2. `class Swimmer` → `swim()` returns `"I can swim"`.
3. `class Duck(Flyer, Swimmer): pass` → two parents.
4. Create a duck and print `duck.fly()` and `duck.swim()`.
5. Print the class names in `Duck.__mro__`.

**Program flow**

```text
duck.fly()    → not in Duck → look in Flyer   → "I can fly"
duck.swim()   → not in Duck → not in Flyer → look in Swimmer → "I can swim"
Duck.__mro__  → Duck → Flyer → Swimmer → object   (search order)
```

**Pseudocode**

```text
CLASS Flyer:    fly():  RETURN "I can fly"
CLASS Swimmer:  swim(): RETURN "I can swim"
CLASS Duck EXTENDS Flyer, Swimmer: (nothing)

duck = Duck()
PRINT duck.fly()      // I can fly
PRINT duck.swim()     // I can swim
PRINT names in Duck's MRO   // ['Duck', 'Flyer', 'Swimmer', 'object']
```

**Code**

```python
class Flyer:
    def fly(self):
        return "I can fly"


class Swimmer:
    def swim(self):
        return "I can swim"


class Duck(Flyer, Swimmer):      # two parents
    pass


duck = Duck()
print(duck.fly())     # from Flyer
print(duck.swim())    # from Swimmer
print([cls.__name__ for cls in Duck.__mro__])
```

**Output:**

```text
I can fly
I can swim
['Duck', 'Flyer', 'Swimmer', 'object']
```

**Fact (why this program):** With multiple inheritance, a class gets the methods of all its parents. Python looks for a method in the order shown by `__mro__` (Method Resolution Order): the class itself first, then the parents from left to right, then `object`.

**Real-life example:**

- 🏠 **Everyday:** A duck can fly like a bird and swim like a fish, so it has both skills.
- 💻 **In software:** `AdminUser(Auditable, Permissioned)` gets features from two parent classes at once.

</details>

### Program 22

**Task:** Create a `LogMixin` whose `save()` adds `"log, "` before the parent's `save()`. Create two unrelated classes, `Model` and `Report`, each with its own `save()`. Mix the logger into both and print the MRO of one.

**Level:** 🟡 Medium

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

**Real-life example:**

- 🏠 **Everyday:** A 'gift wrap' option can be added to any product in an online shop.
- 💻 **In software:** Django's `LoginRequiredMixin` adds a login check to many unrelated views.

</details>

### Program 62

**Task:** Create a `Base` class whose `__init__(**kwargs)` raises `TypeError` if any unknown fields are left. Create `OwnerMixin` (takes `owner`, default `"system"`) and `TimestampMixin` (takes `created`, default `"2026-11-18"`). Each one takes its own field and passes the rest on with `super().__init__(**kwargs)`. Create `Document(OwnerMixin, TimestampMixin)` that takes a `title`. Build two documents, print the MRO, and show the error for an unknown field.

**Level:** 🟡 Medium

*Developer use: Django and DRF mixins, and model base classes, use this "cooperative `super()`" pattern so every parent's `__init__` runs exactly once.*

<details>
<summary>Answer</summary>

**Steps**

1. `Base.__init__(self, **kwargs)` → if `kwargs` still has anything, raise `TypeError`.
2. `OwnerMixin.__init__(self, owner="system", **kwargs)` → save `owner`, call `super().__init__(**kwargs)`.
3. `TimestampMixin.__init__(self, created="2026-11-18", **kwargs)` → save `created`, pass the rest on.
4. `Document.__init__(self, title, **kwargs)` → save `title`, pass the rest on.
5. Create one document with all fields and one with only a title.
6. Print the MRO, then try an unknown field `colour` and catch the error.

**Program flow**

```text
Document("Invoice", owner="asha", created="2026-11-01")
  Document.__init__        → takes title   → super() → OwnerMixin
  OwnerMixin.__init__      → takes owner   → super() → TimestampMixin
  TimestampMixin.__init__  → takes created → super() → Base
  Base.__init__            → kwargs empty  → OK

Document("Report", colour="red")
  … every class passes colour on → Base: kwargs = {colour} → TypeError
```

**Pseudocode**

```text
CLASS Base:
    INIT(**kwargs):  IF kwargs NOT empty: RAISE TypeError

CLASS OwnerMixin EXTENDS Base:
    INIT(owner = "system", **kwargs):  save owner;  CALL next INIT(**kwargs)

CLASS TimestampMixin EXTENDS Base:
    INIT(created = "2026-11-18", **kwargs):  save created;  CALL next INIT(**kwargs)

CLASS Document EXTENDS OwnerMixin, TimestampMixin:
    INIT(title, **kwargs):  save title;  CALL next INIT(**kwargs)

PRINT Document("Invoice", owner = "asha", created = "2026-11-01").show()
PRINT Document("Notes").show()
TRY Document("Report", colour = "red")  CATCH TypeError: PRINT error
```

**Code**

```python
class Base:
    def __init__(self, **kwargs):
        if kwargs:
            raise TypeError(f"Unknown fields: {list(kwargs)}")


class OwnerMixin(Base):
    def __init__(self, owner="system", **kwargs):
        self.owner = owner               # take my field
        super().__init__(**kwargs)       # pass the rest on


class TimestampMixin(Base):
    def __init__(self, created="2026-11-18", **kwargs):
        self.created = created
        super().__init__(**kwargs)


class Document(OwnerMixin, TimestampMixin):
    def __init__(self, title, **kwargs):
        self.title = title
        super().__init__(**kwargs)

    def show(self):
        return f"{self.title} | owner={self.owner} | created={self.created}"


print(Document("Invoice", owner="asha", created="2026-11-01").show())
print(Document("Notes").show())
print([cls.__name__ for cls in Document.__mro__])

try:
    Document("Report", colour="red")
except TypeError as error:
    print("Error:", error)
```

**Output:**

```text
Invoice | owner=asha | created=2026-11-01
Notes | owner=system | created=2026-11-18
['Document', 'OwnerMixin', 'TimestampMixin', 'Base', 'object']
Error: Unknown fields: ['colour']
```

**Fact (why this program):** `super()` doesn't mean "my parent". It means "the **next class in the MRO**". So `OwnerMixin`'s `super()` calls `TimestampMixin`, even though `OwnerMixin` doesn't know it exists. Each class takes only its own keyword arguments and passes the rest on, so every `__init__` runs once, and `Base` catches typos.

**Real-life example:**

- 🏠 **Everyday:** In a relay race, each runner runs their own leg and passes the baton to the next runner in order.
- 💻 **In software:** Django and DRF mixins each take their own keyword arguments and call `super().__init__(**kwargs)`, so the whole chain runs.

</details>

### Program 23

**Task:** Create the diamond: `A` at the top, `B` and `C` both inheriting from `A`, and `D` inheriting from `B` and `C`. Each `show()` prints its class name and calls `super().show()`. Call `D().show()`.

**Level:** 🔴 Difficult

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

**Real-life example:**

- 🏠 **Everyday:** Two departments report to the same CEO, but the CEO receives the meeting invite only once.
- 💻 **In software:** With multiple inheritance, the MRO makes sure a shared base class setup, such as opening a DB connection, runs only once.

</details>

### Program 63

**Task:** Create `JsonExportMixin` and `CsvExportMixin`, both with an `export()` method. Create `SalesReport(JsonExportMixin, CsvExportMixin)`. You expected CSV, but `export()` returns JSON. Debug it by printing the MRO and `SalesReport.export.__qualname__`, then fix it two ways: change the parent order, or call one mixin's method directly. Finally, show the `TypeError` Python raises for `class Broken(Base, Mixin)` when `Mixin` already inherits from `Base`.

**Level:** 🔴 Difficult

*Developer use: when a class with several mixins "calls the wrong method", developers check `__mro__` to see which parent wins, then fix the parent order.*

<details>
<summary>Answer</summary>

**Steps**

1. Two mixins, each with its own `export()`.
2. `SalesReport(JsonExportMixin, CsvExportMixin)` → call `export()` → JSON (the bug).
3. Print the MRO names and `SalesReport.export.__qualname__` → `JsonExportMixin.export`.
4. Fix 1 → `CsvSalesReport(CsvExportMixin, JsonExportMixin)`, so CSV comes first.
5. Fix 2 → call `JsonExportMixin.export(report)` directly when you want one specific version.
6. Build `Broken(Base, Mixin)` with `type()` inside `try` and print the error on one line.

**Program flow**

```text
report.export()          → MRO: SalesReport → JsonExportMixin → … → JSON wins (left parent first)
__qualname__             → "JsonExportMixin.export"  (proof of who answered)
CsvSalesReport.export()  → CsvExportMixin is first now → CSV
JsonExportMixin.export(report) → call one class's method directly → JSON
Broken(Base, Mixin)      → Base must come before Mixin, but Mixin must come before Base → TypeError
```

**Pseudocode**

```text
CLASS JsonExportMixin: export(): RETURN "JSON: " + data
CLASS CsvExportMixin:  export(): RETURN "CSV: " + values joined by ","
CLASS SalesReport EXTENDS JsonExportMixin, CsvExportMixin:  INIT(data)

report = SalesReport({...})
PRINT report.export()                    // JSON (not what we wanted)
PRINT names in SalesReport's MRO         // Json comes before Csv
PRINT which class owns export            // JsonExportMixin.export

CLASS CsvSalesReport EXTENDS CsvExportMixin, JsonExportMixin:  INIT(data)
PRINT CsvSalesReport(data).export()      // CSV
PRINT JsonExportMixin.export(report)     // explicit choice

CLASS Base; CLASS Mixin EXTENDS Base
TRY make class Broken EXTENDS Base, Mixin
CATCH TypeError: PRINT error             // no consistent MRO
```

**Code**

```python
class JsonExportMixin:
    def export(self):
        return f"JSON: {self.data}"


class CsvExportMixin:
    def export(self):
        return f"CSV: {','.join(self.data.values())}"


class SalesReport(JsonExportMixin, CsvExportMixin):
    def __init__(self, data):
        self.data = data


report = SalesReport({"month": "Nov", "total": "52000"})

# 1. Bug: we expected CSV, but got JSON
print(report.export())

# 2. Debug: who wins? Check the MRO
print([cls.__name__ for cls in SalesReport.__mro__])
print(SalesReport.export.__qualname__)


# 3. Fix: put the mixin you want first, or be explicit
class CsvSalesReport(CsvExportMixin, JsonExportMixin):
    def __init__(self, data):
        self.data = data


print(CsvSalesReport(report.data).export())
print(JsonExportMixin.export(report))      # explicit call


# 4. An order Python refuses
class Base:
    pass


class Mixin(Base):
    pass


try:
    Broken = type("Broken", (Base, Mixin), {})   # same as class Broken(Base, Mixin)
except TypeError as error:
    print("Error:", " ".join(str(error).split()))   # message on one line
```

**Output:**

```text
JSON: {'month': 'Nov', 'total': '52000'}
['SalesReport', 'JsonExportMixin', 'CsvExportMixin', 'object']
JsonExportMixin.export
CSV: Nov,52000
JSON: {'month': 'Nov', 'total': '52000'}
Error: Cannot create a consistent method resolution order (MRO) for bases Base, Mixin
```

**Fact (why this program):** When two parents have the same method, the one listed **first** (left) in the class line wins, because it comes earlier in the MRO. Put mixins on the left and the base class last. Python refuses an order that breaks its rules (a parent placed before its own child), and raises `TypeError` when the class is created.

**Real-life example:**

- 🏠 **Everyday:** Two signboards point in different directions, and you follow the one you see first.
- 💻 **In software:** A report class mixes in JSON and CSV export, and checking `__mro__` shows why the wrong `export()` ran.

</details>

## Functions

Built-in, user-defined and anonymous functions, and using a `lambda` as a sorting key.

### Program 43

**Task:** Show the three types of functions in Python: a **built-in** function (use `len()` and `max()` on `[4, 9, 1]`), a **user-defined** function `add(a, b)` written with `def`, and an **anonymous** function (a `lambda`) that squares a number.

**Using a class (class inside a class):** An outer class `FunctionTypes` groups three inner (nested) classes, one for each type of function. You reach an inner class through the outer one: `FunctionTypes.BuiltIn`.

**Level:** 🟢 Simple

*From E22: What is a lambda function, and when should you avoid it?*

<details>
<summary>Answer</summary>

**Steps**

1. Built-in → call `len()` and `max()` on `[4, 9, 1]`.
2. User-defined → write `def add(a, b)` and call `add(2, 3)`.
3. Anonymous → write `square = lambda x: x * x` and call `square(4)`.

**Program flow**

```text
len([4, 9, 1])  → built-in        → 3
max([4, 9, 1])  → built-in        → 9
add(2, 3)       → your def        → 5
square(4)       → lambda, no name → 16
```

**Pseudocode**

```text
numbers = [4, 9, 1]
PRINT length of numbers     // 3
PRINT largest of numbers    // 9

FUNCTION add(a, b):  RETURN a + b
PRINT add(2, 3)             // 5

square = FUNCTION(x): RETURN x * x     // no name of its own
PRINT square(4)             // 16
```

**Code**

```python
# 1. Built-in function: comes with Python
numbers = [4, 9, 1]
print(len(numbers))      # 3
print(max(numbers))      # 9


# 2. User-defined function: you write it with def
def add(a, b):
    return a + b


print(add(2, 3))         # 5

# 3. Anonymous function: a lambda has no name
square = lambda x: x * x
print(square(4))         # 16
```

**Output:**

```text
3
9
5
16
```

**Fact (why this program):** Built-in functions are ready to use. User-defined functions are written with `def` and have a name. A lambda is a one-line function with no name, best for short jobs like a sorting key.

**Real-life example:**

- 🏠 **Everyday:** A kitchen has ready appliances (built-in), your own family recipe (def), and a quick one-time pinch of salt you never name (lambda).
- 💻 **In software:** You call built-ins like len() everywhere, write def functions for business logic, and pass a lambda as a quick key to sort API results.

**Same program using a class inside a class**

```text
FunctionTypes                 → outer class (a container)
├── BuiltIn     → show()      → uses len() and max()
├── UserDefined → add(a, b)   → your own def
└── Anonymous   → square      → a lambda stored on the class
```

```python
class FunctionTypes:
    """Outer class: groups the three types of functions."""

    class BuiltIn:
        """Inner class 1: built-in functions."""

        def show(self, numbers):
            print("Length:", len(numbers))   # built-in len()
            print("Largest:", max(numbers))  # built-in max()

    class UserDefined:
        """Inner class 2: a function you write with def."""

        def add(self, a, b):
            return a + b

    class Anonymous:
        """Inner class 3: a lambda (no name of its own)."""

        square = staticmethod(lambda x: x * x)

    def run_all(self):
        # The outer class creates objects of its inner classes
        self.BuiltIn().show([4, 9, 1])
        print("Add:", self.UserDefined().add(2, 3))
        print("Square:", self.Anonymous.square(4))


# Use everything through the outer class
demo = FunctionTypes()
demo.run_all()

# Or use one inner class directly
adder = FunctionTypes.UserDefined()
print("Direct add:", adder.add(10, 20))
```

**Output:**

```text
Length: 3
Largest: 9
Add: 5
Square: 16
Direct add: 30
```

**Points to remember**

- An inner class is written inside the outer class body. You reach it as `Outer.Inner` or `self.Inner`.
- An inner class object doesn't get the outer object automatically. Pass it in yourself if you need it.
- `staticmethod(lambda ...)` stops Python from passing `self` to the lambda, so `square(4)` gets only `4`.
- Use nested classes to **group** small helper classes that only make sense inside the outer class. If the inner class is big or used elsewhere, write it as a normal top-level class.

**Alternative: lambda inside an instance method**

One simple class, `Calculator`, stores a number in `self.no`. All three types of function are used inside **instance methods**. The `square()` method creates a lambda and calls it with `self.no`.

```text
Calculator(4)                    → self.no = 4
├── show_builtins([4, 9, 1])     → built-in len() and max() → 3, 9
├── add(2, 3)                    → user-defined def         → 5
└── square()                     → x = lambda number: ...   → x(self.no) → 16
```

```python
class Calculator:
    def __init__(self, no):
        self.no = no                      # the number this object works on

    # 1. Built-in functions used inside an instance method
    def show_builtins(self, numbers):
        print("Length:", len(numbers))
        print("Largest:", max(numbers))

    # 2. User-defined: the method itself is written with def
    def add(self, a, b):
        return a + b

    # 3. Anonymous: a lambda created inside an instance method
    def square(self):
        x = lambda number: number * number   # lambda lives only inside this method
        return x(self.no)                    # call it with the object's number


calc = Calculator(4)
calc.show_builtins([4, 9, 1])
print("Add:", calc.add(2, 3))
print("Square:", calc.square())

calc.no = 7                  # change the object's data
print("Square:", calc.square())
```

**Output:**

```text
Length: 3
Largest: 9
Add: 5
Square: 16
Square: 49
```

**Points to remember**

- `square()` is a normal **instance method**, so it receives `self` and can read `self.no`.
- The lambda `x` is a **local variable**. It is created on each call and can't be used outside `square()`.
- The lambda doesn't need `self` or `staticmethod`, because it isn't stored on the class. It's just called inside the method.
- `calc.square()` takes no argument, because the number comes from the object. Change `calc.no` and the result changes.
- A shorter way to write the same method is `return (lambda number: number * number)(self.no)`. The two-line version is easier to read.

</details>

### Program 86

**Task:** Write a closure `multiplier(number)` that returns an inner function `multiply(value)`. Create `double = multiplier(2)` and `triple = multiplier(3)`, call both with `5`, and show the value the closure remembers.

**Using a class:** A `Multiplier` class stores `number` in `__init__`, and `__call__` lets the object be called like a function, so `double(5)` works the same way.

**Level:** 🟢 Simple

*Developer use: Closures create small, pre-configured functions such as a tax calculator for one rate, a logger for one module, or the inner function of a decorator.*

<details>
<summary>Answer</summary>

**Steps**

1. Outer function `multiplier(number)` takes the number to remember.
2. Inner function `multiply(value)` uses `number` from the outer function.
3. Return `multiply` itself, **without calling it** (no brackets).
4. `double = multiplier(2)` → `double(5)` gives 10.
5. `triple = multiplier(3)` → `triple(5)` gives 15.

**Program flow**

```text
multiplier(2)   → creates multiply, remembers number = 2 → double
multiplier(3)   → creates multiply, remembers number = 3 → triple
double(5)       → 5 * 2 → 10
triple(5)       → 5 * 3 → 15
double.__closure__[0].cell_contents → 2 (the remembered value)
```

**Pseudocode**

```text
FUNCTION multiplier(number):
    FUNCTION multiply(value):
        RETURN value * number      // number comes from the outer function
    RETURN multiply                // return the function, don't call it

double = multiplier(2)
triple = multiplier(3)
PRINT double(5)     // 10
PRINT triple(5)     // 15
```

**Code**

```python
def multiplier(number):
    def multiply(value):
        return value * number   # uses number from the outer function
    return multiply


double = multiplier(2)
triple = multiplier(3)

print(double(5))   # 10 -> remembers number = 2
print(triple(5))   # 15 -> remembers number = 3
print(double.__closure__[0].cell_contents)   # 2: the remembered value
```

**Output:**

```text
10
15
2
```

**Fact (why this program):** A closure is an inner function that **remembers variables from its outer function**, even after the outer function has finished. `multiplier(2)` has already returned, but `double` still knows `number = 2`. Each call to `multiplier` makes a new closure with its own remembered value.

**Real-life example:**

- 🏠 **Everyday:** A shop gives each cashier a stamp set to one discount, 10% or 20%. Every bill the cashier stamps uses that cashier's own discount.
- 💻 **In software:** Every decorator is a closure: `wrapper` remembers the `func` it wraps. Closures also build pre-set helpers such as `make_tax(0.18)`.

**Same program using a class**

```python
class Multiplier:
    def __init__(self, number):
        self.number = number          # remembered on the object

    def __call__(self, value):        # lets the object be called like a function
        return value * self.number


double = Multiplier(2)
triple = Multiplier(3)

print(double(5))      # 10
print(triple(5))      # 15
print(double.number)  # 2
```

**Output:**

```text
10
15
2
```

**Points to remember**

- Closure: the value is kept in the function's `__closure__`. Class: the value is kept in `self.number`.
- Use a closure for one small job. Use a class when you need several values, several methods, or want to change the value later.
- Return `multiply`, not `multiply()`. With brackets you return a result, not a function.
- To **change** a remembered variable inside the inner function, declare it `nonlocal` first.

</details>

### Program 44

**Task:** You have three ML models with their accuracy. Sort them from highest to lowest accuracy using `sorted()` with a `lambda`, print each one, then find the best model with `max()`.

**Using a class:** A `Model` class stores each model's `name` and `accuracy`. A `ModelBoard` class holds the list and has `sorted_by_accuracy()` and `best()` methods, which still use a `lambda` as the key.

**Level:** 🟡 Medium

*From E23: How do you find the best model and sort by several fields using a lambda function?*

<details>
<summary>Answer</summary>

**Steps**

1. Store the models as a list of dicts with `name` and `accuracy`.
2. `sorted(..., key=lambda model: model["accuracy"], reverse=True)` → highest first.
3. Print each model.
4. `max(..., key=...)` → the best model.

**Program flow**

```text
key for each model → 0.91, 0.85, 0.88
sorted, reverse    → 0.91, 0.88, 0.85 → Random Forest, SVM, Logistic Regression
max by accuracy    → 0.91             → "Best: Random Forest"
```

**Pseudocode**

```text
models = [Random Forest 0.91, Logistic Regression 0.85, SVM 0.88]

by_accuracy = models SORTED BY accuracy, highest first
FOR EACH model IN by_accuracy:
    PRINT model.name, model.accuracy
END FOR

best = model WITH highest accuracy
PRINT "Best:", best.name    // Best: Random Forest
```

**Code**

```python
models = [
    {"name": "Random Forest", "accuracy": 0.91},
    {"name": "Logistic Regression", "accuracy": 0.85},
    {"name": "SVM", "accuracy": 0.88},
]

by_accuracy = sorted(models, key=lambda model: model["accuracy"], reverse=True)

for model in by_accuracy:
    print(model["name"], model["accuracy"])
# Random Forest 0.91
# SVM 0.88
# Logistic Regression 0.85

best = max(models, key=lambda model: model["accuracy"])
print("Best:", best["name"])   # Best: Random Forest
```

**Output:**

```text
Random Forest 0.91
SVM 0.88
Logistic Regression 0.85
Best: Random Forest
```

**Fact (why this program):** `key=` tells `sorted()` and `max()` what to compare. `reverse=True` sorts from highest to lowest. `sorted()` returns a new list and leaves `models` unchanged.

**Real-life example:**

- 🏠 **Everyday:** A teacher ranks students by marks to find the topper, without rewriting the register.
- 💻 **In software:** In ML projects you sort experiment results by accuracy and pick the best model with max() before saving it.


**Same program using a class**

```python
class Model:
    def __init__(self, name, accuracy):
        self.name = name
        self.accuracy = accuracy


class ModelBoard:
    def __init__(self, models):
        self.models = models

    def sorted_by_accuracy(self):
        # The lambda reads the attribute: model.accuracy
        return sorted(self.models, key=lambda model: model.accuracy, reverse=True)

    def best(self):
        return max(self.models, key=lambda model: model.accuracy)


board = ModelBoard([
    Model("Random Forest", 0.91),
    Model("Logistic Regression", 0.85),
    Model("SVM", 0.88),
])

for model in board.sorted_by_accuracy():
    print(model.name, model.accuracy)

print("Best:", board.best().name)
```

**Output:**

```text
Random Forest 0.91
SVM 0.88
Logistic Regression 0.85
Best: Random Forest
```

**Points to remember**

- The lambda now reads an attribute (`model.accuracy`) instead of a dict key (`model["accuracy"]`).
- `sorted()` and `max()` work the same on objects as on dicts. The `key` function decides what is compared.
- Keeping the sorting inside `ModelBoard` means the rest of the code just calls `board.best()`.

**Alternative: print without a `for` loop, using `__repr__`**

Add `__repr__` to `Model`. Python calls it when it prints a model object, and also when it prints a **list** of models. So `print(board.sorted_by_accuracy())` shows every model with no loop.

```python
class Model:
    def __init__(self, name, accuracy):
        self.name = name
        self.accuracy = accuracy

    def __repr__(self):
        return f"{self.name}: {self.accuracy}"


class ModelBoard:
    def __init__(self, models):
        self.models = models

    def sorted_by_accuracy(self):
        return sorted(self.models, key=lambda model: model.accuracy, reverse=True)

    def best(self):
        return max(self.models, key=lambda model: model.accuracy)


board = ModelBoard([
    Model("Random Forest", 0.91),
    Model("Logistic Regression", 0.85),
    Model("SVM", 0.88),
])

print(board.sorted_by_accuracy())   # the list uses __repr__ for each model
print("Best:", board.best())        # one model also uses __repr__
```

**Output:**

```text
[Random Forest: 0.91, SVM: 0.88, Logistic Regression: 0.85]
Best: Random Forest: 0.91
```

**Points to remember**

- Without `__repr__`, printing the list shows `[<__main__.Model object at 0x...>, ...]`.
- A list always uses `__repr__` for its items, even if the class also has `__str__`. That's why `__repr__` is the one to add here.
- One per line without a loop: `print(*board.sorted_by_accuracy(), sep="\n")`.

</details>

### Program 64

**Task:** Write a function `log_event(event, *tags, **details)` that builds one log line. `event` is required, `*tags` collects any number of extra words, and `**details` collects any number of `key=value` pairs. Call it three ways: with only an event, with tags, and with tags plus details.

**Using a class:** A `Logger` class stores the app name in `__init__`. `log_event` becomes a method, and `*tags` and `**details` come after `self`.

**Level:** 🟡 Medium

*Developer use: logging helpers, API wrappers and utility functions that must accept a flexible number of arguments.*

<details>
<summary>Answer</summary>

**Steps**

1. Define `log_event(event, *tags, **details)`.
2. `tags` arrives as a **tuple**, `details` arrives as a **dict**.
3. Start the line with `[EVENT]` in capitals.
4. If there are tags, add them joined by commas.
5. If there are details, add each one as `key=value`.
6. Return the line and print it.

**Program flow**

```text
log_event("login")                          → tags=()              details={}                 → [LOGIN]
log_event("login", "web", "mobile")         → tags=('web','mobile') details={}                 → [LOGIN] tags: web, mobile
log_event("payment", "upi", user="asha",    → tags=('upi',)        details={'user':..,'amount':..}
          amount=500)                                                                          → [PAYMENT] tags: upi | user=asha amount=500
```

**Pseudocode**

```text
FUNCTION log_event(event, *tags, **details):
    line = "[" + UPPER(event) + "]"
    IF tags is not empty:
        line = line + " tags: " + JOIN tags WITH ", "
    IF details is not empty:
        pairs = "key=value" FOR EACH key, value IN details
        line = line + " | " + JOIN pairs WITH " "
    RETURN line

PRINT log_event("login")
PRINT log_event("login", "web", "mobile")
PRINT log_event("payment", "upi", user="asha", amount=500)
```

**Code**

```python
def log_event(event, *tags, **details):
    line = f"[{event.upper()}]"

    if tags:                                   # tags is a tuple
        line += " tags: " + ", ".join(tags)

    if details:                                # details is a dict
        pairs = [f"{key}={value}" for key, value in details.items()]
        line += " | " + " ".join(pairs)

    return line


print(log_event("login"))
print(log_event("login", "web", "mobile"))
print(log_event("payment", "upi", user="asha", amount=500))
```

**Output:**

```text
[LOGIN]
[LOGIN] tags: web, mobile
[PAYMENT] tags: upi | user=asha amount=500
```

**Fact (why this program):** `*args` packs extra **positional** arguments into a tuple, and `**kwargs` packs extra **keyword** arguments into a dict. The order in the definition is always: normal arguments, then `*args`, then `**kwargs`.

**Real-life example:**

- 🏠 **Everyday:** A Swiggy order has one restaurant, any number of dishes, and any number of notes like 'less spicy' or 'no onion'.
- 💻 **In software:** Logging helpers and wrapper functions accept *args/**kwargs so callers can pass any extra tags or fields, like logger.info(msg, extra={...}).


**Same program using a class**

```python
class Logger:
    def __init__(self, app):
        self.app = app

    def log_event(self, event, *tags, **details):
        line = f"{self.app} [{event.upper()}]"

        if tags:                                   # tags is a tuple
            line += " tags: " + ", ".join(tags)

        if details:                                # details is a dict
            pairs = [f"{key}={value}" for key, value in details.items()]
            line += " | " + " ".join(pairs)

        return line


logger = Logger("shop")
print(logger.log_event("login"))
print(logger.log_event("login", "web", "mobile"))
print(logger.log_event("payment", "upi", user="asha", amount=500))
```

**Output:**

```text
shop [LOGIN]
shop [LOGIN] tags: web, mobile
shop [PAYMENT] tags: upi | user=asha amount=500
```

**Points to remember**

- `self` is always the first parameter, then the normal ones, then `*tags`, then `**details`.
- The object remembers `app`, so every log line gets the prefix without passing it each time.

</details>

### Program 65

**Task:** Write `summarize_scores(scores, pass_mark=40, round_to=1)` that returns **three values**: the average (rounded), the number who passed, and the number who failed. Call it with the default pass mark, then with keyword arguments `pass_mark=60, round_to=2`. Unpack the three results into three variables.

**Using a class:** A `ScoreReport` class stores the `scores` list once. `summarize()` becomes a method that keeps the same default arguments and still returns three values.

**Level:** 🟡 Medium

*Developer use: report and statistics helpers that need sensible defaults but let the caller override them by name.*

<details>
<summary>Answer</summary>

**Steps**

1. Give `pass_mark` and `round_to` default values in the definition.
2. Find the average with `sum(scores) / len(scores)` and round it.
3. Count passed scores (score >= pass_mark). Failed = total − passed.
4. Return all three with `return average, passed, failed` (this returns a tuple).
5. Unpack: `avg, passed, failed = summarize_scores(...)`.

**Program flow**

```text
scores = [35, 72, 58, 90, 41]

summarize_scores(scores)                          → pass_mark=40, round_to=1
    average = 296 / 5 = 59.2                      → passed = 4 (72, 58, 90, 41) → failed = 1
    return (59.2, 4, 1)

summarize_scores(scores, pass_mark=60, round_to=2)
    average = 59.2                                → passed = 2 (72, 90)         → failed = 3
    return (59.2, 2, 3)
```

**Pseudocode**

```text
FUNCTION summarize_scores(scores, pass_mark = 40, round_to = 1):
    average = ROUND(SUM(scores) / COUNT(scores), round_to)
    passed  = COUNT of score IN scores WHERE score >= pass_mark
    failed  = COUNT(scores) - passed
    RETURN average, passed, failed

scores = [35, 72, 58, 90, 41]
avg, passed, failed = summarize_scores(scores)
PRINT avg, passed, failed                         // 59.2 4 1

avg, passed, failed = summarize_scores(scores, pass_mark = 60, round_to = 2)
PRINT avg, passed, failed                         // 59.2 2 3
```

**Code**

```python
def summarize_scores(scores, pass_mark=40, round_to=1):
    average = round(sum(scores) / len(scores), round_to)
    passed = sum(1 for score in scores if score >= pass_mark)
    failed = len(scores) - passed
    return average, passed, failed       # returns a tuple of 3 values


scores = [35, 72, 58, 90, 41]

# Default pass mark (40)
avg, passed, failed = summarize_scores(scores)
print("Average:", avg, "| Passed:", passed, "| Failed:", failed)

# Keyword arguments: order doesn't matter, names make it clear
avg, passed, failed = summarize_scores(scores, round_to=2, pass_mark=60)
print("Average:", avg, "| Passed:", passed, "| Failed:", failed)

# Without unpacking you get one tuple
print(summarize_scores(scores))
```

**Output:**

```text
Average: 59.2 | Passed: 4 | Failed: 1
Average: 59.2 | Passed: 2 | Failed: 3
(59.2, 4, 1)
```

**Fact (why this program):** Default arguments make a function easy to call in the common case. Keyword arguments (`pass_mark=60`) make the call readable and let you skip or reorder optional values. `return a, b, c` really returns **one tuple**, which you can unpack into separate variables.

**Real-life example:**

- 🏠 **Everyday:** A tea stall gives normal sugar by default, unless you clearly say 'sugar=less'.
- 💻 **In software:** Library calls like requests.get(url, timeout=5) or train_test_split(test_size=0.2) use defaults and keyword arguments for optional settings.


**Same program using a class**

```python
class ScoreReport:
    def __init__(self, scores):
        self.scores = scores

    def summarize(self, pass_mark=40, round_to=1):
        average = round(sum(self.scores) / len(self.scores), round_to)
        passed = sum(1 for score in self.scores if score >= pass_mark)
        failed = len(self.scores) - passed
        return average, passed, failed       # a tuple of 3 values


report = ScoreReport([35, 72, 58, 90, 41])

# Default pass mark (40)
avg, passed, failed = report.summarize()
print("Average:", avg, "| Passed:", passed, "| Failed:", failed)

# Keyword arguments
avg, passed, failed = report.summarize(round_to=2, pass_mark=60)
print("Average:", avg, "| Passed:", passed, "| Failed:", failed)

# Without unpacking you get one tuple
print(report.summarize())
```

**Output:**

```text
Average: 59.2 | Passed: 4 | Failed: 1
Average: 59.2 | Passed: 2 | Failed: 3
(59.2, 4, 1)
```

**Points to remember**

- The scores are saved on `self`, so you don't pass them on every call.
- Default and keyword arguments work in methods exactly as in functions. They just come after `self`.
- Returning `average, passed, failed` still gives a tuple you can unpack.

</details>

### Program 66

**Task:** Clean a list of raw user names with a **pipeline of functions**. Write a closure `make_replacer(old, new)` that returns a function which replaces `old` with `new`. Put `str.strip`, `str.lower` and `make_replacer(" ", "_")` in a list called `steps`. Write `run_pipeline(value, steps)` that passes the value through each function in order, then use it on `["  Asha Rao ", "RAVI KUMAR", " neha  "]`.

**Using a class:** A `Replacer` class takes the place of the closure: it saves `old` and `new` on `self` and uses `__call__`, so the object can be called like a function. A `Pipeline` class holds the steps and runs them.

**Level:** 🔴 Difficult

*Developer use: data-cleaning and text-preprocessing pipelines (ETL, NLP), where each step is a small function you can add, remove or reorder.*

<details>
<summary>Answer</summary>

**Steps**

1. `make_replacer(old, new)` defines an inner function `replace(text)` and **returns it**. The inner function remembers `old` and `new` (a closure).
2. Build `steps = [str.strip, str.lower, make_replacer(" ", "_")]`. Functions are objects, so they can sit in a list.
3. `run_pipeline(value, steps)` loops over `steps` and does `value = step(value)`.
4. Use a list comprehension to clean every name.

**Program flow**

```text
make_replacer(" ", "_")  → returns replace()   → it remembers old=" ", new="_"

"  Asha Rao "  → strip   → "Asha Rao"  → lower → "asha rao"   → replace → "asha_rao"
"RAVI KUMAR"   → strip   → "RAVI KUMAR"→ lower → "ravi kumar" → replace → "ravi_kumar"
" neha  "      → strip   → "neha"      → lower → "neha"       → replace → "neha"
```

**Pseudocode**

```text
FUNCTION make_replacer(old, new):
    FUNCTION replace(text):
        RETURN text with old replaced by new    // uses old, new from outside
    RETURN replace                              // return the function itself

FUNCTION run_pipeline(value, steps):
    FOR EACH step IN steps:
        value = step(value)
    RETURN value

steps = [strip, lower, make_replacer(" ", "_")]
raw = ["  Asha Rao ", "RAVI KUMAR", " neha  "]
clean = [run_pipeline(name, steps) FOR name IN raw]
PRINT clean                     // ['asha_rao', 'ravi_kumar', 'neha']
```

**Code**

```python
def make_replacer(old, new):
    def replace(text):
        return text.replace(old, new)    # old and new come from the outer function
    return replace                       # return the function, don't call it


def run_pipeline(value, steps):
    for step in steps:
        value = step(value)              # output of one step is input to the next
    return value


space_to_underscore = make_replacer(" ", "_")
steps = [str.strip, str.lower, space_to_underscore]

raw_names = ["  Asha Rao ", "RAVI KUMAR", " neha  "]
clean_names = [run_pipeline(name, steps) for name in raw_names]
print(clean_names)

# Add one more step without changing run_pipeline
steps.append(make_replacer("_", "-"))
print([run_pipeline(name, steps) for name in raw_names])

# The closure still remembers old=" " and new="_"
print(space_to_underscore("data science team"))
```

**Output:**

```text
['asha_rao', 'ravi_kumar', 'neha']
['asha-rao', 'ravi-kumar', 'neha']
data_science_team
```

**Fact (why this program):** In Python, functions are **first-class objects**: you can store them in a list, pass them to another function, and return them from a function. A **closure** is an inner function that remembers variables from the outer function even after it has finished. Together they let you build flexible pipelines: adding a step means adding one function to the list.

**Real-life example:**

- 🏠 **Everyday:** A factory line where each worker does one step (wash, cut, pack) on every item that passes.
- 💻 **In software:** Data-cleaning pipelines in pandas or scikit-learn chain small functions to clean text before training a model.


**Same program using a class**

```python
class Replacer:
    """A callable object: works like the closure make_replacer."""

    def __init__(self, old, new):
        self.old = old                   # saved on the object, not in a closure
        self.new = new

    def __call__(self, text):            # lets you call the object like a function
        return text.replace(self.old, self.new)


class Pipeline:
    def __init__(self, steps):
        self.steps = steps

    def add_step(self, step):
        self.steps.append(step)

    def run(self, value):
        for step in self.steps:
            value = step(value)          # output of one step is input to the next
        return value


space_to_underscore = Replacer(" ", "_")
pipeline = Pipeline([str.strip, str.lower, space_to_underscore])

raw_names = ["  Asha Rao ", "RAVI KUMAR", " neha  "]
print([pipeline.run(name) for name in raw_names])

pipeline.add_step(Replacer("_", "-"))
print([pipeline.run(name) for name in raw_names])

print(space_to_underscore("data science team"))
```

**Output:**

```text
['asha_rao', 'ravi_kumar', 'neha']
['asha-rao', 'ravi-kumar', 'neha']
data_science_team
```

**Points to remember**

- A closure remembers values in its enclosing scope, while a class remembers them as attributes. Both give you a callable.
- `__call__` lets `Replacer` objects sit in the steps list next to plain functions like `str.strip`.
- `add_step()` adds a step without changing `run()`.

</details>

## Dunder (magic) methods

Special methods that Python calls for you when you use `print()`, `len()` or `+`.

### Program 67

**Task:** Create a `PlainBook` class with `title` and `author` but **no** `__str__`, and print one object. Then create a `Book` class with the same attributes **plus** `__str__`, which returns `"<title> by <author>"`, and print one object. Compare the two outputs.

**Level:** 🟢 Simple

*Developer use: every model class (User, Order, Product) gets a readable `__str__` so logs and print statements show useful text.*

<details>
<summary>Answer</summary>

**Steps**

1. `PlainBook` → only `__init__` storing `title` and `author`.
2. `Book` → same `__init__`, plus `__str__` returning a friendly string.
3. Print a `PlainBook` → Python shows a default, unhelpful text.
4. Print a `Book` → Python calls `__str__` and shows your text.

**Program flow**

```text
print(plain_book)  → no __str__   → Python's default → <__main__.PlainBook object at 0x...>
print(book)        → has __str__  → book.__str__()   → Wings of Fire by A. P. J. Abdul Kalam
str(book)          → same method  → book.__str__()   → used in f-strings too
```

**Pseudocode**

```text
CLASS PlainBook:
    __init__(title, author):  store title, author

CLASS Book:
    __init__(title, author):  store title, author
    __str__():                RETURN title + " by " + author

PRINT PlainBook("Wings of Fire", "A. P. J. Abdul Kalam")   // <__main__.PlainBook object at 0x...>
PRINT Book("Wings of Fire", "A. P. J. Abdul Kalam")        // Wings of Fire by A. P. J. Abdul Kalam
```

**Code**

```python
class PlainBook:
    def __init__(self, title, author):
        self.title = title
        self.author = author


class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author

    def __str__(self):                       # print() and str() call this
        return f"{self.title} by {self.author}"


plain_book = PlainBook("Wings of Fire", "A. P. J. Abdul Kalam")
book = Book("Wings of Fire", "A. P. J. Abdul Kalam")

print(plain_book)                 # default text, not useful
print(book)                       # uses __str__
print(f"Reading: {book}")         # f-strings use __str__ too
```

**Output:**

```text
<__main__.PlainBook object at 0x000001F4A2B3C4D0>
Wings of Fire by A. P. J. Abdul Kalam
Reading: Wings of Fire by A. P. J. Abdul Kalam
```

(The `0x...` memory address is different on every run.)

**Fact (why this program):** A dunder method is a method with **d**ouble **under**scores on both sides, like `__str__`. You don't call it yourself: `print(book)` calls `book.__str__()` for you. Without `__str__`, Python only shows the class name and a memory address.

**Real-life example:**

- 🏠 **Everyday:** A book without a cover label is just 'a book'; a label tells you its title and author at a glance.
- 💻 **In software:** Django models define __str__ so the admin panel shows 'Order #101' instead of a memory address.

</details>

### Program 45

**Task:** Create a `Cart` class that stores a list of items. Add `__str__` so `print(cart)` shows `"Cart with N items"`, `__len__` so `len(cart)` works, and `__add__` so `cart1 + cart2` makes a new cart with all the items.

**Level:** 🟡 Medium

*From E26: What are dunder/magic methods? Give examples.*

<details>
<summary>Answer</summary>

**Steps**

1. `__init__` stores `items`.
2. `__str__` → return `"Cart with <count> items"`.
3. `__len__` → return the number of items.
4. `__add__` → return a new `Cart` with both lists joined.
5. Create two carts, print one, its length, and the two added together.

**Program flow**

```text
print(cart1)    → Python calls cart1.__str__()       → "Cart with 2 items"
len(cart1)      → Python calls cart1.__len__()       → 2
cart1 + cart2   → Python calls cart1.__add__(cart2)  → new Cart with 3 items
print(both)     → both.__str__()                     → "Cart with 3 items"
```

**Pseudocode**

```text
CLASS Cart:
    init(items):      self.items = items
    __str__():        RETURN "Cart with " + count of items + " items"
    __len__():        RETURN count of items
    __add__(other):   RETURN new Cart(self.items + other.items)

cart1 = Cart(["pen", "book"]);  cart2 = Cart(["bag"])
PRINT cart1           // Cart with 2 items
PRINT len(cart1)      // 2
PRINT cart1 + cart2   // Cart with 3 items
```

**Code**

```python
class Cart:
    def __init__(self, items):
        self.items = items

    def __str__(self):              # used by print(cart)
        return f"Cart with {len(self.items)} items"

    def __len__(self):              # used by len(cart)
        return len(self.items)

    def __add__(self, other):       # used by cart1 + cart2
        return Cart(self.items + other.items)


cart1 = Cart(["pen", "book"])
cart2 = Cart(["bag"])

print(cart1)               # Cart with 2 items
print(len(cart1))          # 2

both = cart1 + cart2
print(both)                # Cart with 3 items
```

**Output:**

```text
Cart with 2 items
2
Cart with 3 items
```

**Fact (why this program):** You never call dunder methods yourself. Python calls them for you: `print()` calls `__str__`, `len()` calls `__len__`, and `+` calls `__add__`.

**Real-life example:**

- 🏠 **Everyday:** Two shopping baskets can be emptied into one bigger basket, and you can count items in each.
- 💻 **In software:** E-commerce code merges guest and logged-in carts with + and checks len(cart) before checkout.

</details>

### Program 68

**Task:** Create a `Product` class with `name` and `price`. Add `__repr__` so a list of products prints nicely, `__eq__` so two products with the same name and price are equal, and `__lt__` so `sorted()` orders products by price. Sort three products, find the cheapest with `min()`, and compare two equal products with `==`.

**Level:** 🟡 Medium

*Developer use: comparing and sorting domain objects (products, tasks by priority, versions) without passing a `key=` every time.*

<details>
<summary>Answer</summary>

**Steps**

1. `__repr__` → return `Product('Mouse', 499)` style text (used when printing lists).
2. `__eq__(other)` → `True` when both `name` and `price` match.
3. `__lt__(other)` → `self.price < other.price` (used by `sorted()`, `min()`, `<`).
4. Create three products, sort them, and find the cheapest.
5. Compare two separate objects that have the same data.

**Program flow**

```text
sorted(products)        → Python calls a.__lt__(b) many times → ordered by price
min(products)           → uses __lt__                           → Product('Mouse', 499)
p1 == p2                → p1.__eq__(p2)  → same name and price  → True
p1 is p2                → different objects in memory           → False
print(list)             → each item's __repr__
```

**Pseudocode**

```text
CLASS Product:
    __init__(name, price): store name, price
    __repr__():   RETURN "Product('name', price)"
    __eq__(other): RETURN name == other.name AND price == other.price
    __lt__(other): RETURN price < other.price

products = [Product("Keyboard", 1299), Product("Mouse", 499), Product("Monitor", 8999)]
PRINT sorted(products)                 // by price, low to high
PRINT min(products)                    // Mouse
PRINT Product("Mouse", 499) == Product("Mouse", 499)   // True
```

**Code**

```python
class Product:
    def __init__(self, name, price):
        self.name = name
        self.price = price

    def __repr__(self):                       # used when printing lists
        return f"Product({self.name!r}, {self.price})"

    def __eq__(self, other):                  # used by ==
        if not isinstance(other, Product):
            return NotImplemented
        return self.name == other.name and self.price == other.price

    def __lt__(self, other):                  # used by <, sorted(), min()
        return self.price < other.price


products = [
    Product("Keyboard", 1299),
    Product("Mouse", 499),
    Product("Monitor", 8999),
]

print(sorted(products))
print("Cheapest:", min(products))
print("Most expensive:", max(products))

p1 = Product("Mouse", 499)
p2 = Product("Mouse", 499)
print("p1 == p2:", p1 == p2)     # same data
print("p1 is p2:", p1 is p2)     # different objects
```

**Output:**

```text
[Product('Mouse', 499), Product('Keyboard', 1299), Product('Monitor', 8999)]
Cheapest: Product('Mouse', 499)
Most expensive: Product('Monitor', 8999)
p1 == p2: True
p1 is p2: False
```

**Fact (why this program):** `sorted()`, `min()` and `max()` only need `__lt__` to compare objects. Without `__eq__`, `==` checks whether both names point to the **same object**. `__repr__` is the developer view of an object, and it is what you see inside lists. `__str__` is the user view.

**Real-life example:**

- 🏠 **Everyday:** On Amazon you sort phones by price, and two listings of the same phone at the same price are the same deal.
- 💻 **In software:** Product catalogues and priority queues define __lt__ so objects can be sorted, and __eq__ to find duplicates.

</details>

### Program 69

**Task:** Create a `Money` class with `amount` and `currency`. Add `__add__` so `Money(100, "INR") + Money(50, "INR")` gives `Money(150, "INR")`, and raise `ValueError` when the currencies are different. Add `__radd__` so `sum()` works on a list of `Money` objects, and `__str__` to print `"INR 150.00"`.

**Level:** 🟡 Medium

*Developer use: value objects in billing and e-commerce code (money, distance, time) where `+` must follow business rules.*

<details>
<summary>Answer</summary>

**Steps**

1. `__add__(other)` → check both currencies match, else raise `ValueError`.
2. Return a **new** `Money` with the two amounts added (don't change either object).
3. `sum()` starts with `0`, so it first does `0 + Money(...)`. Python then calls `Money.__radd__(0)`.
4. `__radd__(other)` → if `other` is `0`, return `self`. Otherwise use `__add__`.
5. `__str__` → format as `"INR 150.00"`.

**Program flow**

```text
a + b                 → a.__add__(b)      → same currency → Money(150, "INR")
sum([a, b, c])        → 0 + a             → int can't add Money → a.__radd__(0) → a
                      → a + b → + c       → __add__ each time   → INR 350.00
a + Money(10, "USD")  → a.__add__(...)    → different currency  → ValueError
```

**Pseudocode**

```text
CLASS Money:
    __init__(amount, currency): store both
    __add__(other):
        IF currency != other.currency: RAISE ValueError
        RETURN new Money(amount + other.amount, currency)
    __radd__(other):
        IF other == 0: RETURN self        // the start value of sum()
        RETURN self + other
    __str__(): RETURN currency + " " + amount with 2 decimals

PRINT Money(100, "INR") + Money(50, "INR")       // INR 150.00
PRINT sum([Money(100,"INR"), Money(50,"INR"), Money(200,"INR")])   // INR 350.00
TRY  Money(100,"INR") + Money(10,"USD")  CATCH ValueError → PRINT message
```

**Code**

```python
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __add__(self, other):                 # used by a + b
        if self.currency != other.currency:
            raise ValueError(f"Cannot add {self.currency} and {other.currency}")
        return Money(self.amount + other.amount, self.currency)

    def __radd__(self, other):                # used by 0 + a (inside sum())
        if other == 0:
            return self
        return self.__add__(other)

    def __str__(self):
        return f"{self.currency} {self.amount:.2f}"


a = Money(100, "INR")
b = Money(50, "INR")
c = Money(200, "INR")

print(a + b)
print("Total:", sum([a, b, c]))
print("a is unchanged:", a)

try:
    print(a + Money(10, "USD"))
except ValueError as error:
    print("Error:", error)
```

**Output:**

```text
INR 150.00
Total: INR 350.00
a is unchanged: INR 100.00
Error: Cannot add INR and USD
```

**Fact (why this program):** `a + b` calls `a.__add__(b)`. If the left side doesn't know how to add (like `0 + Money`), Python tries the **right** side's `__radd__`. That is why `sum()` needs `__radd__`. Returning a new object keeps `Money` safe to share, because nothing changes it later.

**Real-life example:**

- 🏠 **Everyday:** You can add ₹100 and ₹50, but you can't directly add ₹100 and $50 without converting.
- 💻 **In software:** Payment and billing systems use a Money class so totals with sum() never mix currencies by mistake.

</details>

### Program 70

**Task:** Create a `Playlist` class that stores a `name` and a list of `songs`. Make it behave like a built-in list: `len(playlist)` with `__len__`, `playlist[0]` and slicing `playlist[1:3]` with `__getitem__`, `for song in playlist` with `__iter__`, `"Kesariya" in playlist` with `__contains__`, and a clear `__repr__`.

**Level:** 🔴 Difficult

*Developer use: custom collection classes (query results, paginated API responses, datasets in PyTorch) that should work with `len()`, indexing, loops and `in`.*

<details>
<summary>Answer</summary>

**Steps**

1. `__init__(name, songs)` → store the name and a **copy** of the songs list.
2. `__len__` → return the number of songs.
3. `__getitem__(index)` → return `self.songs[index]`. If `index` is a slice, return a **new Playlist**.
4. `__iter__` → return `iter(self.songs)` so `for` loops work.
5. `__contains__(song)` → case-insensitive check, so `"kesariya" in playlist` is `True`.
6. `__repr__` → `Playlist('Road Trip', 4 songs)`.

**Program flow**

```text
len(trip)              → trip.__len__()              → 4
trip[0]                → trip.__getitem__(0)         → 'Kesariya'
trip[-1]               → trip.__getitem__(-1)        → 'Ilahi'
trip[1:3]              → __getitem__(slice(1, 3))    → new Playlist with 2 songs
for song in trip       → trip.__iter__()             → each song in order
"kesariya" in trip     → trip.__contains__("kesariya") → lower-case match → True
```

**Pseudocode**

```text
CLASS Playlist:
    __init__(name, songs):  store name, COPY of songs
    __len__():              RETURN COUNT(songs)
    __getitem__(index):
        IF index is a slice: RETURN new Playlist(name + " (part)", songs[index])
        RETURN songs[index]
    __iter__():             RETURN iterator over songs
    __contains__(song):     RETURN LOWER(song) IN [LOWER(s) FOR s IN songs]
    __repr__():             RETURN "Playlist('name', N songs)"

trip = Playlist("Road Trip", ["Kesariya", "Safarnama", "Phir Se Ud Chala", "Ilahi"])
PRINT len(trip), trip[0], trip[-1], trip[1:3]
FOR song IN trip: PRINT song
PRINT "kesariya" IN trip
```

**Code**

```python
class Playlist:
    def __init__(self, name, songs):
        self.name = name
        self.songs = list(songs)              # copy, so outside changes don't affect us

    def __len__(self):                        # len(playlist)
        return len(self.songs)

    def __getitem__(self, index):             # playlist[0], playlist[1:3]
        if isinstance(index, slice):
            return Playlist(f"{self.name} (part)", self.songs[index])
        return self.songs[index]

    def __iter__(self):                       # for song in playlist
        return iter(self.songs)

    def __contains__(self, song):             # "x" in playlist
        return song.lower() in (s.lower() for s in self.songs)

    def __repr__(self):
        return f"Playlist({self.name!r}, {len(self)} songs)"


trip = Playlist("Road Trip", ["Kesariya", "Safarnama", "Phir Se Ud Chala", "Ilahi"])

print(trip)
print("Songs:", len(trip))
print("First:", trip[0], "| Last:", trip[-1])

part = trip[1:3]
print(part, "->", part.songs)

for number, song in enumerate(trip, start=1):
    print(number, song)

print("kesariya" in trip)
print("Tum Hi Ho" in trip)
```

**Output:**

```text
Playlist('Road Trip', 4 songs)
Songs: 4
First: Kesariya | Last: Ilahi
Playlist('Road Trip (part)', 2 songs) -> ['Safarnama', 'Phir Se Ud Chala']
1 Kesariya
2 Safarnama
3 Phir Se Ud Chala
4 Ilahi
True
False
```

**Fact (why this program):** Python uses **protocols**: any object with `__len__` works with `len()`, any object with `__iter__` works in a `for` loop, and any object with `__contains__` works with `in`. You don't need to inherit from `list`. Implement the dunder methods and your class behaves like a built-in collection.

**Real-life example:**

- 🏠 **Everyday:** A Spotify playlist lets you count songs, pick song 1, play them in order, and check if a song is in it.
- 💻 **In software:** Custom collections like PyTorch Dataset implement __len__ and __getitem__ so DataLoader can index and loop over them.

</details>

## Decorators

A decorator adds extra work around a function or class without changing its code.

### Program 46

**Task:** Write a decorator `greet_decorator` that prints `"Before the function"` before and `"After the function"` after the function it wraps. Use it on `say_hello()`, which prints `"Hello!"`.

**Using a class:** The decorator stays a plain function, and it is now used on a method, `say_hello(self)`, inside a `Greeter` class.

**Level:** 🟢 Simple

*From E24: What is a decorator, and how do you write one?*

<details>
<summary>Answer</summary>

**Steps**

1. `greet_decorator(function)` defines an inner `wrapper()`.
2. `wrapper()` prints "Before…", calls `function()`, then prints "After…".
3. Return `wrapper`.
4. Put `@greet_decorator` above `say_hello()` and call it.

**Program flow**

```text
@greet_decorator      → say_hello = greet_decorator(say_hello) → say_hello is now wrapper
say_hello()           → wrapper runs  → "Before the function"
                      → original runs → "Hello!"
                      → wrapper ends  → "After the function"
```

**Pseudocode**

```text
FUNCTION greet_decorator(function):
    FUNCTION wrapper():
        PRINT "Before the function"
        CALL function()
        PRINT "After the function"
    RETURN wrapper

@greet_decorator
FUNCTION say_hello():  PRINT "Hello!"

say_hello()    // Before the function, Hello!, After the function
```

**Code**

```python
def greet_decorator(function):
    def wrapper():
        print("Before the function")
        function()
        print("After the function")
    return wrapper


@greet_decorator
def say_hello():
    print("Hello!")


say_hello()
# Before the function
# Hello!
# After the function
```

**Output:**

```text
Before the function
Hello!
After the function
```

**Fact (why this program):** A decorator adds extra work around a function without changing the function's code. `@greet_decorator` is the same as writing `say_hello = greet_decorator(say_hello)`.

**Real-life example:**

- 🏠 **Everyday:** A gift wrapper adds paper around the gift without changing the gift inside.
- 💻 **In software:** Flask/FastAPI route decorators like @app.get('/') wrap your function to add web routing around it.


**Same program using a class**

```python
def greet_decorator(function):
    def wrapper(*args, **kwargs):        # *args also receives self
        print("Before the function")
        function(*args, **kwargs)
        print("After the function")
    return wrapper


class Greeter:
    def __init__(self, name):
        self.name = name

    @greet_decorator
    def say_hello(self):
        print(f"Hello, {self.name}!")


greeter = Greeter("Asha")
greeter.say_hello()
```

**Output:**

```text
Before the function
Hello, Asha!
After the function
```

**Points to remember**

- The wrapper must accept `*args, **kwargs` (or `self`), because Python passes the object as the first argument.
- A `wrapper()` with no parameters would fail on a method with a `TypeError` ("takes 0 positional arguments but 1 was given").

</details>

### Program 47

**Task:** Write a **function decorator** `shout` that makes a greeting function return its text in capitals. Then write a **class decorator** `add_school` that adds `school = "City School"` to a `Student` class.

**Level:** 🟡 Medium

*From E25: What is the difference between a function decorator and a class decorator?*

<details>
<summary>Answer</summary>

**Steps**

1. `shout(function)` returns a `wrapper(name)` that calls the function and returns `.upper()`.
2. Use `@shout` on `greet(name)`.
3. `add_school(cls)` sets `cls.school` and returns the same class.
4. Use `@add_school` on `Student`, then create a student and print `school`.

**Program flow**

```text
greet("asha")       → wrapper runs on every call → "hello, asha".upper() → "HELLO, ASHA"
@add_school         → runs once, when the class is defined → Student.school = "City School"
Student("Ravi")     → student.school               → "City School"
```

**Pseudocode**

```text
FUNCTION shout(function):
    FUNCTION wrapper(name):  RETURN UPPERCASE(function(name))
    RETURN wrapper

@shout
FUNCTION greet(name):  RETURN "hello, " + name
PRINT greet("asha")        // HELLO, ASHA

FUNCTION add_school(cls):
    cls.school = "City School"
    RETURN cls

@add_school
CLASS Student:  init(name): self.name = name
PRINT Student("Ravi").school    // City School
```

**Code**

```python
# Function decorator: wraps a function, runs on every call
def shout(function):
    def wrapper(name):
        return function(name).upper()
    return wrapper


@shout
def greet(name):
    return f"hello, {name}"


print(greet("asha"))     # HELLO, ASHA


# Class decorator: changes a class once, when it is defined
def add_school(cls):
    cls.school = "City School"
    return cls


@add_school
class Student:
    def __init__(self, name):
        self.name = name


student = Student("Ravi")
print(student.school)    # City School
```

**Output:**

```text
HELLO, ASHA
City School
```

**Fact (why this program):**

**Real-life example:**

- 🏠 **Everyday:** A loudspeaker changes your voice every time you speak; a school badge is pinned to your uniform once.
- 💻 **In software:** @lru_cache wraps a function on every call, while @dataclass changes a class once when it is defined.

| | Function decorator | Class decorator |
|---|---|---|
| Receives | A function | A class |
| Returns | A wrapper function | Usually the same class |
| Runs | Its wrapper runs **on every call** | Usually **once**, when the class is defined |
| Example | `@lru_cache` | `@dataclass` |

</details>

### Program 71

**Task:** Write a decorator `log_call` that prints the function name and its arguments before the call, and the returned value after it. Use `functools.wraps` so the decorated function keeps its real name and docstring. Apply it to `add(a, b)` and `apply_discount(price, percent=10)`, then print `add.__name__` and `add.__doc__`.

**Using a class:** `add` and `apply_discount` become methods of a `Calculator` class. The `log_call` wrapper takes `self` first, so `args` shows only the real arguments.

**Level:** 🟡 Medium

*Developer use: logging and debugging API handlers, service methods and ML training steps without editing each function.*

<details>
<summary>Answer</summary>

**Steps**

1. `log_call(function)` defines `wrapper(*args, **kwargs)` so it works for **any** function.
2. Inside `wrapper`: print the name and arguments, call the function, print the result, return it.
3. Put `@wraps(function)` on `wrapper` to copy the name and docstring.
4. Decorate `add` and `apply_discount` with `@log_call`.
5. Print `add.__name__` and `add.__doc__` to check `wraps` worked.

**Program flow**

```text
@log_call on add            → add = log_call(add) → add is now wrapper
add(2, 3)                   → wrapper(2, 3)       → "Calling add args=(2, 3) kwargs={}"
                            → real add(2, 3)      → 5 → "add returned 5" → returns 5
apply_discount(500, percent=20)
                            → wrapper(...)        → "Calling apply_discount args=(500,) kwargs={'percent': 20}"
                            → real function       → 400.0 → "apply_discount returned 400.0"
add.__name__                → copied by @wraps    → 'add' (not 'wrapper')
```

**Pseudocode**

```text
FUNCTION log_call(function):
    FUNCTION wrapper(*args, **kwargs):          // keeps function's name via wraps
        PRINT "Calling", function name, args, kwargs
        result = function(*args, **kwargs)
        PRINT function name, "returned", result
        RETURN result
    RETURN wrapper

@log_call  FUNCTION add(a, b): RETURN a + b
@log_call  FUNCTION apply_discount(price, percent = 10): RETURN price - price * percent / 100

PRINT add(2, 3)
PRINT apply_discount(500, percent = 20)
PRINT add.__name__, add.__doc__
```

**Code**

```python
from functools import wraps


def log_call(function):
    @wraps(function)                          # keep the real name and docstring
    def wrapper(*args, **kwargs):
        print(f"Calling {function.__name__} args={args} kwargs={kwargs}")
        result = function(*args, **kwargs)
        print(f"{function.__name__} returned {result}")
        return result
    return wrapper


@log_call
def add(a, b):
    """Add two numbers."""
    return a + b


@log_call
def apply_discount(price, percent=10):
    """Return the price after a percentage discount."""
    return price - price * percent / 100


print("Result:", add(2, 3))
print("Result:", apply_discount(500, percent=20))
print("Name:", add.__name__)
print("Doc:", add.__doc__)
```

**Output:**

```text
Calling add args=(2, 3) kwargs={}
add returned 5
Result: 5
Calling apply_discount args=(500,) kwargs={'percent': 20}
apply_discount returned 400.0
Result: 400.0
Name: add
Doc: Add two numbers.
```

**Fact (why this program):** Using `*args, **kwargs` in the wrapper lets one decorator work on functions with any arguments. Without `@wraps`, `add.__name__` would be `"wrapper"` and the docstring would be lost, which breaks debugging, logs and tools like FastAPI that read function details.

**Real-life example:**

- 🏠 **Everyday:** A CCTV camera records who entered and what they carried, without stopping them.
- 💻 **In software:** Teams add a @log_call decorator to service functions for audit logs, and @wraps keeps names correct in tracebacks.


**Same program using a class**

```python
from functools import wraps


def log_call(function):
    @wraps(function)                          # keep the real name and docstring
    def wrapper(self, *args, **kwargs):       # first argument is the object
        print(f"Calling {function.__name__} args={args} kwargs={kwargs}")
        result = function(self, *args, **kwargs)
        print(f"{function.__name__} returned {result}")
        return result
    return wrapper


class Calculator:
    @log_call
    def add(self, a, b):
        """Add two numbers."""
        return a + b

    @log_call
    def apply_discount(self, price, percent=10):
        """Return the price after a percentage discount."""
        return price - price * percent / 100


calc = Calculator()
print("Result:", calc.add(2, 3))
print("Result:", calc.apply_discount(500, percent=20))
print("Name:", Calculator.add.__name__)
print("Doc:", Calculator.add.__doc__)
```

**Output:**

```text
Calling add args=(2, 3) kwargs={}
add returned 5
Result: 5
Calling apply_discount args=(500,) kwargs={'percent': 20}
apply_discount returned 400.0
Result: 400.0
Name: add
Doc: Add two numbers.
```

**Points to remember**

- Taking `self` separately keeps the object out of the printed `args`.
- `@wraps` still keeps the name and docstring. Check them with `Calculator.add.__name__`.
- The same decorator now works on any method in any class.

</details>

### Program 72

**Task:** Write a decorator `login_required` for functions that take a `user` dict as their first argument. If `user["logged_in"]` is `False`, return `"Error: please log in"` and **don't** run the function. Otherwise run it. Apply it to `view_profile(user)` and `place_order(user, item)`, and call both with a logged-in and a logged-out user.

**Using a class:** A `ShopSession` class stores the `user` on `self`. The `login_required` decorator checks `self.user`, so the methods no longer need a `user` argument.

**Level:** 🟡 Medium

*Developer use: authentication checks in web apps (Flask `@login_required`, FastAPI dependencies) that guard many routes with one line.*

<details>
<summary>Answer</summary>

**Steps**

1. `login_required(function)` defines `wrapper(user, *args, **kwargs)`.
2. If `not user["logged_in"]` → return the error message **without** calling the function.
3. Otherwise → `return function(user, *args, **kwargs)`.
4. Decorate `view_profile` and `place_order`.
5. Call both with `asha` (logged in) and `guest` (logged out).

**Program flow**

```text
view_profile(asha)            → wrapper → asha logged in  → real function → "Profile of Asha"
place_order(asha, "Laptop")   → wrapper → asha logged in  → real function → "Asha ordered Laptop"
view_profile(guest)           → wrapper → guest NOT logged in → stop here → "Error: please log in"
place_order(guest, "Phone")   → wrapper → guest NOT logged in → stop here → "Error: please log in"
```

**Pseudocode**

```text
FUNCTION login_required(function):
    FUNCTION wrapper(user, *args, **kwargs):
        IF user is not logged in:
            RETURN "Error: please log in"       // function never runs
        RETURN function(user, *args, **kwargs)
    RETURN wrapper

@login_required FUNCTION view_profile(user): RETURN "Profile of " + user.name
@login_required FUNCTION place_order(user, item): RETURN user.name + " ordered " + item

asha  = {name: "Asha",  logged_in: True}
guest = {name: "Guest", logged_in: False}
PRINT view_profile(asha), place_order(asha, "Laptop")
PRINT view_profile(guest), place_order(guest, "Phone")
```

**Code**

```python
from functools import wraps


def login_required(function):
    @wraps(function)
    def wrapper(user, *args, **kwargs):
        if not user.get("logged_in"):
            return "Error: please log in"      # stop: the real function never runs
        return function(user, *args, **kwargs)
    return wrapper


@login_required
def view_profile(user):
    return f"Profile of {user['name']}"


@login_required
def place_order(user, item):
    return f"{user['name']} ordered {item}"


asha = {"name": "Asha", "logged_in": True}
guest = {"name": "Guest", "logged_in": False}

print(view_profile(asha))
print(place_order(asha, "Laptop"))
print(view_profile(guest))
print(place_order(guest, "Phone"))
```

**Output:**

```text
Profile of Asha
Asha ordered Laptop
Error: please log in
Error: please log in
```

**Fact (why this program):** A decorator can decide **whether** the function runs at all, not only add work before and after it. That is why authentication, permission checks and rate limiting are usually decorators: the rule lives in one place instead of being copied into every function.

**Real-life example:**

- 🏠 **Everyday:** A security guard checks your ID card before letting you into the office.
- 💻 **In software:** Django's @login_required and FastAPI auth dependencies block pages until the user is logged in.


**Same program using a class**

```python
from functools import wraps


def login_required(method):
    @wraps(method)
    def wrapper(self, *args, **kwargs):
        if not self.user.get("logged_in"):
            return "Error: please log in"      # stop: the real method never runs
        return method(self, *args, **kwargs)
    return wrapper


class ShopSession:
    def __init__(self, user):
        self.user = user                       # the logged-in state lives on self

    @login_required
    def view_profile(self):
        return f"Profile of {self.user['name']}"

    @login_required
    def place_order(self, item):
        return f"{self.user['name']} ordered {item}"


asha = ShopSession({"name": "Asha", "logged_in": True})
guest = ShopSession({"name": "Guest", "logged_in": False})

print(asha.view_profile())
print(asha.place_order("Laptop"))
print(guest.view_profile())
print(guest.place_order("Phone"))
```

**Output:**

```text
Profile of Asha
Asha ordered Laptop
Error: please log in
Error: please log in
```

**Points to remember**

- The wrapper reads the login state from `self.user`. It doesn't need a `user` argument.
- This is how frameworks guard view methods: the check sits in one place, outside the method body.
- Return early from the wrapper and the real method never runs.

</details>

### Program 73

**Task:** Write a decorator **with an argument**, `retry(times=3)`, that calls a function again when it raises `ConnectionError`, up to `times` attempts. Print each failed attempt. If every attempt fails, raise the last error. Test it with `fetch_data()`, which fails twice and succeeds on the 3rd call, and with `always_down()`, which always fails.

**Using a class:** `fetch_data` and `always_down` become methods of an `ApiClient` class. The call counter moves from a global dict to `self.calls`.

**Level:** 🔴 Difficult

*Developer use: retrying flaky network calls, database connections and third-party API requests (libraries like `tenacity` work this way).*

<details>
<summary>Answer</summary>

**Steps**

1. `retry(times)` is the **outer** function: it takes the argument and returns a decorator.
2. `decorator(function)` is the **middle** function: it takes the function and returns `wrapper`.
3. `wrapper(*args, **kwargs)` loops `for attempt in range(1, times + 1)`:
   - try the function and **return** on success.
   - on `ConnectionError`, print the attempt and remember the error.
4. After the loop, `raise last_error`.
5. `fetch_data()` uses a counter dict so it fails on calls 1 and 2 and succeeds on call 3.

**Program flow**

```text
@retry(times=3)          → retry(3) returns decorator → decorator(fetch_data) returns wrapper

fetch_data()             → attempt 1 → ConnectionError → "fetch_data: attempt 1 failed: Server busy"
                         → attempt 2 → ConnectionError → "fetch_data: attempt 2 failed: Server busy"
                         → attempt 3 → success         → "Data loaded on call 3"

always_down()            → attempts 1, 2 → ConnectionError each time (times=2)
                         → loop ends     → raise last error → caught outside → "Gave up: Service down"
```

**Pseudocode**

```text
FUNCTION retry(times):
    FUNCTION decorator(function):
        FUNCTION wrapper(*args, **kwargs):
            FOR attempt FROM 1 TO times:
                TRY
                    RETURN function(*args, **kwargs)     // success: stop retrying
                CATCH ConnectionError AS error
                    PRINT "Attempt", attempt, "failed:", error
                    last_error = error
            RAISE last_error                             // all attempts failed
        RETURN wrapper
    RETURN decorator

calls = {count: 0}
@retry(times = 3) FUNCTION fetch_data():
    calls.count = calls.count + 1
    IF calls.count < 3: RAISE ConnectionError "Server busy"
    RETURN "Data loaded on call " + calls.count

@retry(times = 2) FUNCTION always_down(): RAISE ConnectionError "Service down"
```

**Code**

```python
from functools import wraps


def retry(times=3):                           # outer: takes the argument
    def decorator(function):                  # middle: takes the function
        @wraps(function)
        def wrapper(*args, **kwargs):         # inner: runs on every call
            last_error = None
            for attempt in range(1, times + 1):
                try:
                    return function(*args, **kwargs)
                except ConnectionError as error:
                    print(f"{function.__name__}: attempt {attempt} failed: {error}")
                    last_error = error
            raise last_error
        return wrapper
    return decorator


calls = {"count": 0}


@retry(times=3)
def fetch_data():
    calls["count"] += 1
    if calls["count"] < 3:
        raise ConnectionError("Server busy")
    return f"Data loaded on call {calls['count']}"


@retry(times=2)
def always_down():
    raise ConnectionError("Service down")


print(fetch_data())

try:
    always_down()
except ConnectionError as error:
    print("Gave up:", error)
```

**Output:**

```text
fetch_data: attempt 1 failed: Server busy
fetch_data: attempt 2 failed: Server busy
Data loaded on call 3
always_down: attempt 1 failed: Service down
always_down: attempt 2 failed: Service down
Gave up: Service down
```

**Fact (why this program):** A decorator that takes an argument needs **three levels**: `retry(times)` returns `decorator`, which returns `wrapper`. `@retry(times=3)` first **calls** `retry(3)`, and the result is the real decorator. Only catch the errors you expect (here `ConnectionError`). Retrying on every error would hide real bugs.

**Real-life example:**

- 🏠 **Everyday:** If a UPI payment fails, you try again a few times before giving up.
- 💻 **In software:** API clients use @retry(times=3), like the tenacity library, to handle flaky network calls.


**Same program using a class**

```python
from functools import wraps


def retry(times=3):                           # outer: takes the argument
    def decorator(method):                    # middle: takes the method
        @wraps(method)
        def wrapper(self, *args, **kwargs):   # inner: runs on every call
            last_error = None
            for attempt in range(1, times + 1):
                try:
                    return method(self, *args, **kwargs)
                except ConnectionError as error:
                    print(f"{method.__name__}: attempt {attempt} failed: {error}")
                    last_error = error
            raise last_error
        return wrapper
    return decorator


class ApiClient:
    def __init__(self):
        self.calls = 0                        # counter lives on the object

    @retry(times=3)
    def fetch_data(self):
        self.calls += 1
        if self.calls < 3:
            raise ConnectionError("Server busy")
        return f"Data loaded on call {self.calls}"

    @retry(times=2)
    def always_down(self):
        raise ConnectionError("Service down")


client = ApiClient()
print(client.fetch_data())

try:
    client.always_down()
except ConnectionError as error:
    print("Gave up:", error)
```

**Output:**

```text
fetch_data: attempt 1 failed: Server busy
fetch_data: attempt 2 failed: Server busy
Data loaded on call 3
always_down: attempt 1 failed: Service down
always_down: attempt 2 failed: Service down
Gave up: Service down
```

**Points to remember**

- It is still three levels: `retry(times)` returns `decorator`, which returns `wrapper`.
- The wrapper takes `self` and passes it to the method on every retry.
- State that used to be a global dict (`calls`) now belongs to the object (`self.calls`).

</details>

## Generators

Functions that give values one at a time with `yield`.

### Program 48

**Task:** Write a generator `count_up_to(limit)` that gives the numbers from 1 to `limit`, one at a time, using `yield`. Get the first three values with `next()`, then turn a new generator into a list.

**Using a class:** A `Counter` class stores the `limit` as an attribute. The generator becomes the method `count_up()`, and `__iter__` returns it so you can loop over the object or pass it to `list()` directly.

**Level:** 🟢 Simple

*From E29: What is a generator, and how does `yield` work?*

<details>
<summary>Answer</summary>

**Steps**

1. Start `number` at 1.
2. While `number <= limit` → `yield number`, then add 1.
3. Call `next()` three times on one generator.
4. Print `list(count_up_to(5))`.

**Program flow**

```text
counter = count_up_to(3) → nothing runs yet
next(counter)            → runs to the first yield   → 1, pauses
next(counter)            → continues, number = 2      → 2, pauses
next(counter)            → continues, number = 3      → 3, pauses
list(count_up_to(5))     → collects every value       → [1, 2, 3, 4, 5]
```

**Pseudocode**

```text
GENERATOR count_up_to(limit):
    number = 1
    WHILE number <= limit:
        YIELD number          // give one value, then pause
        number = number + 1
    END WHILE

counter = count_up_to(3)
PRINT next(counter)    // 1
PRINT next(counter)    // 2
PRINT next(counter)    // 3
PRINT list of count_up_to(5)    // [1, 2, 3, 4, 5]
```

**Code**

```python
def count_up_to(limit):
    number = 1
    while number <= limit:
        yield number          # give one value, then pause here
        number += 1           # continue from here on the next request


counter = count_up_to(3)
print(next(counter))   # 1
print(next(counter))   # 2
print(next(counter))   # 3

print(list(count_up_to(5)))   # [1, 2, 3, 4, 5]
```

**Output:**

```text
1
2
3
[1, 2, 3, 4, 5]
```

**Fact (why this program):** `yield` gives back one value and **pauses** the function. It remembers where it stopped, and the next `next()` continues from there.

**Real-life example:**

- 🏠 **Everyday:** A token machine at a bank gives the next token number only when someone presses the button.
- 💻 **In software:** Generators produce IDs, pages of results, or rows one at a time instead of building the full list.


**Same program using a class**

```python
class Counter:
    """Counts from 1 up to a limit, one number at a time."""

    def __init__(self, limit):
        self.limit = limit

    def count_up(self):
        number = 1
        while number <= self.limit:
            yield number          # give one value, then pause here
            number += 1           # continue from here on the next request

    def __iter__(self):
        return self.count_up()    # lets you loop over the object directly


counter = Counter(3).count_up()
print(next(counter))   # 1
print(next(counter))   # 2
print(next(counter))   # 3

print(list(Counter(5)))   # [1, 2, 3, 4, 5]
```

**Output:**

```text
1
2
3
[1, 2, 3, 4, 5]
```

**Points to remember**

- A method can use `yield` just like a function. Calling `count_up()` gives a fresh generator each time.
- `__iter__` returning a generator is the easiest way to make your own class loopable.
- `next(Counter(3))` fails, because the object itself is not an iterator. Call `count_up()` first, or use `iter(Counter(3))`.

</details>

### Program 49

**Task:** Build the squares of 0 to 999,999 two ways: as a list and as a generator. Compare their memory size, add up the generator's values, and show that a generator can only be used once.

**Using a class:** A `Squares` class stores the `limit`. `as_list()` builds every value at once, and `as_generator()` uses `yield` to make values one by one.

**Level:** 🟡 Medium

*From E30: When would you use a generator instead of a list?*

<details>
<summary>Answer</summary>

**Steps**

1. List → `[n * n for n in range(1_000_000)]` builds every value now.
2. Generator → `(n * n for n in range(1_000_000))` builds values one at a time.
3. Compare sizes with `sys.getsizeof()`.
4. `sum()` the generator twice → the second time it's already used up.
5. Read one item from the list by index.

**Program flow**

```text
getsizeof(list) > 1,000,000?  → YES → list stores every value
getsizeof(gen) < 1,000?       → YES → generator stores almost nothing
sum(gen) first time           → 333332833333500000
sum(gen) second time          → 0   → already used up
squares_list[10]              → 100 → list allows indexing
```

**Pseudocode**

```text
IMPORT sys
squares_list = [n * n FOR n FROM 0 TO 999,999]    // stored now
squares_gen  = (n * n FOR n FROM 0 TO 999,999)    // made one by one

PRINT size of squares_list > 1,000,000    // True
PRINT size of squares_gen < 1,000         // True
PRINT sum of squares_gen                  // 333332833333500000
PRINT sum of squares_gen                  // 0
PRINT squares_list[10]                    // 100
```

**Code**

```python
import sys

squares_list = [n * n for n in range(1_000_000)]   # all values stored now
squares_gen = (n * n for n in range(1_000_000))    # values made one by one

print(sys.getsizeof(squares_list) > 1_000_000)     # True: millions of bytes
print(sys.getsizeof(squares_gen) < 1_000)          # True: tiny

print(sum(squares_gen))    # 333332833333500000
print(sum(squares_gen))    # 0: a generator can only be used once

print(squares_list[10])    # 100: a list allows indexing and reuse
```

**Output:**

```text
True
True
333332833333500000
0
100
```

**Fact (why this program):** Use a **generator** for big data that you read once (large files, streams, batches), because it uses very little memory. Use a **list** when you need `len()`, indexing, sorting, or to loop more than once.

**Real-life example:**

- 🏠 **Everyday:** Filling a water tank holds all the water at once; a tap gives water only as you use it.
- 💻 **In software:** Reading a 10 GB CSV row by row with a generator avoids loading it all into RAM.


**Same program using a class**

```python
import sys


class Squares:
    """Builds the squares of 0 to limit - 1, as a list or as a generator."""

    def __init__(self, limit):
        self.limit = limit

    def as_list(self):
        return [n * n for n in range(self.limit)]   # all values stored now

    def as_generator(self):
        for n in range(self.limit):
            yield n * n                             # values made one by one


squares = Squares(1_000_000)
squares_list = squares.as_list()
squares_gen = squares.as_generator()

print(sys.getsizeof(squares_list) > 1_000_000)     # True: millions of bytes
print(sys.getsizeof(squares_gen) < 1_000)          # True: tiny

print(sum(squares_gen))    # 333332833333500000
print(sum(squares_gen))    # 0: this generator is used up

print(sum(squares.as_generator()))   # call the method again for a fresh one
print(squares_list[10])    # 100: a list allows indexing and reuse
```

**Output:**

```text
True
True
333332833333500000
0
333332833333500000
100
```

**Points to remember**

- The memory result is the same: the list is huge, the generator object is tiny.
- A generator is still used up after one pass. The class helps here: call `as_generator()` again to get a fresh one.
- Store the list if you need indexing or many passes. Use the generator for one pass over big data.

</details>

### Program 50

**Task:** Write `get_with_return()`, which returns `[1, 2, 3]`, and `get_with_yield()`, which yields 1, 2 and 3. Print what each one gives back, and turn the generator into a list.

**Using a class:** A `NumberSource` class has two methods: `get_with_return()` uses `return`, and `get_with_yield()` uses `yield`.

**Level:** 🟡 Medium

*From E31: What is the difference between `return` and `yield`?*

<details>
<summary>Answer</summary>

**Steps**

1. `get_with_return()` → `return [1, 2, 3]`.
2. `get_with_yield()` → `yield 1`, `yield 2`, `yield 3`.
3. Print the return version, the type of the yield version, and `list()` of the yield version.

**Program flow**

```text
get_with_return()        → runs fully, ends       → [1, 2, 3]
get_with_yield()         → nothing runs yet        → a generator object
list(get_with_yield())   → runs yield by yield     → [1, 2, 3]
```

**Pseudocode**

```text
FUNCTION get_with_return():  RETURN [1, 2, 3]

GENERATOR get_with_yield():
    YIELD 1
    YIELD 2
    YIELD 3

PRINT get_with_return()                  // [1, 2, 3]
PRINT type name of get_with_yield()      // generator
PRINT list of get_with_yield()           // [1, 2, 3]
```

**Code**

```python
def get_with_return():
    return [1, 2, 3]        # gives everything at once, and the function ends


def get_with_yield():
    yield 1                 # gives one value, then pauses
    yield 2
    yield 3


print(get_with_return())                  # [1, 2, 3]
print(type(get_with_yield()).__name__)    # generator: nothing has run yet
print(list(get_with_yield()))             # [1, 2, 3]
```

**Output:**

```text
[1, 2, 3]
generator
[1, 2, 3]
```

**Fact (why this program):**

**Real-life example:**

- 🏠 **Everyday:** A courier delivers the whole parcel at once (return), while a newspaper arrives one day at a time (yield).
- 💻 **In software:** An API returns a full JSON list for small data, but streams large responses chunk by chunk with yield.

| `return` | `yield` |
|---|---|
| Ends the function | Pauses the function |
| Gives one result | Gives many values, one at a time |
| Local variables are lost | Local variables are kept between values |


**Same program using a class**

```python
class NumberSource:
    """Gives back the numbers 1, 2, 3 in two different ways."""

    def get_with_return(self):
        return [1, 2, 3]        # gives everything at once, and the method ends

    def get_with_yield(self):
        yield 1                 # gives one value, then pauses
        yield 2
        yield 3


source = NumberSource()
print(source.get_with_return())                  # [1, 2, 3]
print(type(source.get_with_yield()).__name__)    # generator: nothing has run yet
print(list(source.get_with_yield()))             # [1, 2, 3]
```

**Output:**

```text
[1, 2, 3]
generator
[1, 2, 3]
```

**Points to remember**

- `return` in a method still gives everything at once and ends the method.
- Any method that contains `yield` becomes a generator method. Calling it runs no code until you ask for a value.
- `self` is the only extra thing compared with the function version.

</details>

### Program 74

**Task:** You have a list of log lines (pretend it's a big log file). Write a generator `error_lines(lines)` that checks one line at a time and yields only the lines that start with `"ERROR"`. Print a "checking" message for each line so you can see the generator works lazily. Get the first two errors with `next()`, then turn the rest into a list.

**Using a class:** A `LogReader` class stores the log lines as an attribute. The generator becomes the method `error_lines()`, which yields only the ERROR lines.

**Level:** 🟡 Medium

*Developer use: Scanning huge log files or CSV exports line by line without loading the whole file into memory.*

<details>
<summary>Answer</summary>

**Steps**

1. Store the log lines in a list (in real code this would be an open file).
2. `error_lines(lines)` → loop over the lines and print `"checking: ..."` for each one.
3. If a line starts with `"ERROR"`, `yield` it.
4. Call `next()` twice, then `list()` on what's left.

**Program flow**

```text
errors = error_lines(log_lines) → generator created, nothing checked yet
next(errors)  → checks INFO, ERROR        → yields "ERROR Database not reachable" → pauses
next(errors)  → checks INFO, ERROR        → yields "ERROR Payment timeout"        → pauses
list(errors)  → checks WARN, end of lines → no more errors                        → []
```

**Pseudocode**

```text
log_lines = [5 log lines]

GENERATOR error_lines(lines):
    FOR EACH line IN lines:
        PRINT "checking:", line
        IF line starts with "ERROR":
            YIELD line          // give it back, then pause

errors = error_lines(log_lines)  // nothing runs yet
PRINT next(errors)
PRINT next(errors)
PRINT list(errors)               // []
```

**Code**

```python
log_lines = [
    "INFO  Server started",
    "ERROR Database not reachable",
    "INFO  User logged in",
    "ERROR Payment timeout",
    "WARN  Disk 80% full",
]


def error_lines(lines):
    for line in lines:
        print("  checking:", line)
        if line.startswith("ERROR"):
            yield line          # hand back one error, then pause here


errors = error_lines(log_lines)   # nothing runs yet

print("First error:", next(errors))
print("Second error:", next(errors))
print("Any more?", list(errors))
```

**Output:**

```text
  checking: INFO  Server started
  checking: ERROR Database not reachable
First error: ERROR Database not reachable
  checking: INFO  User logged in
  checking: ERROR Payment timeout
Second error: ERROR Payment timeout
  checking: WARN  Disk 80% full
Any more? []
```

**Fact (why this program):** The "checking" lines show that a generator works **lazily**: it reads only as many lines as it needs to find the next error, then pauses. With a real file (`for line in open("app.log")`), memory use stays small even for a file of many gigabytes.

**Real-life example:**

- 🏠 **Everyday:** A teacher flips through answer sheets and only pulls out the ones that failed.
- 💻 **In software:** Ops scripts scan huge server logs lazily and yield only ERROR lines for alerts.


**Same program using a class**

```python
class LogReader:
    """Reads log lines lazily and hands back only the errors."""

    def __init__(self, lines):
        self.lines = lines

    def error_lines(self):
        for line in self.lines:
            print("  checking:", line)
            if line.startswith("ERROR"):
                yield line          # hand back one error, then pause here


log_lines = [
    "INFO  Server started",
    "ERROR Database not reachable",
    "INFO  User logged in",
    "ERROR Payment timeout",
    "WARN  Disk 80% full",
]

reader = LogReader(log_lines)
errors = reader.error_lines()     # nothing runs yet

print("First error:", next(errors))
print("Second error:", next(errors))
print("Any more?", list(errors))
```

**Output:**

```text
  checking: INFO  Server started
  checking: ERROR Database not reachable
First error: ERROR Database not reachable
  checking: INFO  User logged in
  checking: ERROR Payment timeout
Second error: ERROR Payment timeout
  checking: WARN  Disk 80% full
Any more? []
```

**Points to remember**

- The lines live on the object (`self.lines`), so the method needs no argument.
- The method is still lazy: each `next()` checks lines only until it finds the next error.
- In real code, `self.lines` could be an open file. Looping over a file is lazy too.

</details>

### Program 75

**Task:** Build a 3-stage generator pipeline. `read_records(count)` yields records `{"id": 1}`, `{"id": 2}`, … one at a time. `in_batches(records, size)` groups them into lists of `size` records. `send_to_api(batch)` pretends to send one batch. Send 7 records in batches of 3.

**Using a class:** A `BatchSender` class stores `count` and `size`. Each pipeline stage becomes a method, and `run()` connects them.

**Level:** 🔴 Difficult

*Developer use: Sending database rows to an API, or inserting them into another database, in fixed-size batches to stay within rate and memory limits.*

<details>
<summary>Answer</summary>

**Steps**

1. `read_records(count)` → `yield {"id": number}` for 1 to `count`.
2. `in_batches(records, size)` → add each record to `batch`. When `batch` has `size` records, `yield` it and start a new empty list.
3. After the loop, `yield` the last batch if it isn't empty.
4. `send_to_api(batch)` → return a message with the batch size and ids.
5. Connect the stages and loop over the batches.

**Program flow**

```text
read_records(7) → 1, 2, 3, 4, 5, 6, 7 (one at a time)
in_batches(…, 3)
  1, 2, 3 → batch full     → yield [1, 2, 3]
  4, 5, 6 → batch full     → yield [4, 5, 6]
  7       → records end    → yield [7] (the smaller last batch)
for batch → send_to_api(batch) → print each message
```

**Pseudocode**

```text
GENERATOR read_records(count):
    FOR number FROM 1 TO count:  YIELD {"id": number}

GENERATOR in_batches(records, size):
    batch = []
    FOR EACH record IN records:
        ADD record TO batch
        IF length of batch == size:
            YIELD batch
            batch = []
    IF batch is not empty:  YIELD batch

FUNCTION send_to_api(batch):
    RETURN "Batch of <size> -> ids <ids>"

FOR EACH batch IN in_batches(read_records(7), 3):
    PRINT send_to_api(batch)
```

**Code**

```python
def read_records(count):
    for number in range(1, count + 1):
        yield {"id": number}           # one record at a time


def in_batches(records, size):
    batch = []
    for record in records:
        batch.append(record)
        if len(batch) == size:
            yield batch                # a full batch is ready
            batch = []
    if batch:
        yield batch                    # the last, smaller batch


def send_to_api(batch):
    ids = [record["id"] for record in batch]
    return f"Batch of {len(batch)} -> ids {ids}"


records = read_records(7)                  # stage 1: produce records
batches = in_batches(records, size=3)      # stage 2: group them

for batch in batches:                      # stage 3: use them
    print(send_to_api(batch))
```

**Output:**

```text
Batch of 3 -> ids [1, 2, 3]
Batch of 3 -> ids [4, 5, 6]
Batch of 1 -> ids [7]
```

**Fact (why this program):** Each stage takes a generator and gives out another one, so records flow through **one at a time**, and at most one batch is in memory. The `if batch:` after the loop matters: without it, the last record (7) would be silently lost. Forgetting that leftover batch is a common bug.

**Real-life example:**

- 🏠 **Everyday:** A school bus takes students in groups of 40, not all 500 at once.
- 💻 **In software:** Data jobs send records to an API or database in batches of N, and ML training loads data in mini-batches.


**Same program using a class**

```python
class BatchSender:
    """A 3-stage pipeline: read records, group them, send each batch."""

    def __init__(self, count, size):
        self.count = count
        self.size = size

    def read_records(self):
        for number in range(1, self.count + 1):
            yield {"id": number}           # one record at a time

    def in_batches(self, records):
        batch = []
        for record in records:
            batch.append(record)
            if len(batch) == self.size:
                yield batch                # a full batch is ready
                batch = []
        if batch:
            yield batch                    # the last, smaller batch

    def send_to_api(self, batch):
        ids = [record["id"] for record in batch]
        return f"Batch of {len(batch)} -> ids {ids}"

    def run(self):
        records = self.read_records()          # stage 1: produce records
        batches = self.in_batches(records)     # stage 2: group them
        for batch in batches:                  # stage 3: use them
            print(self.send_to_api(batch))


BatchSender(count=7, size=3).run()
```

**Output:**

```text
Batch of 3 -> ids [1, 2, 3]
Batch of 3 -> ids [4, 5, 6]
Batch of 1 -> ids [7]
```

**Points to remember**

- Settings like `size` live on the object, so the stage methods take fewer arguments.
- The stages are still generators: only one batch is in memory at a time.
- `run()` keeps the pipeline wiring in one place, which makes it easy to test or change one stage.

</details>

## Exceptions

Handling errors, creating your own, and keeping the original cause.

### Program 51

**Task:** Write `divide(a, b)` that divides two numbers. Use `try` for the division, `except ZeroDivisionError` to print an error, `else` to print the result, and `finally` to print `"Done"`. Call it with `(10, 2)` and `(10, 0)`.

**Using a class:** A `Calculator` class has a `divide()` method. The `try` / `except` / `else` / `finally` blocks work inside a method exactly as they do in a function.

**Level:** 🟢 Simple

*From E32: How do `try`, `except`, `else`, and `finally` work?*

<details>
<summary>Answer</summary>

**Steps**

1. `try:` → `result = a / b`.
2. `except ZeroDivisionError:` → print the error.
3. `else:` → print the result (only if there was no error).
4. `finally:` → print "Done" (always).

**Program flow**

```text
divide(10, 2) → try: 10 / 2 OK  → else: "Result: 5.0"            → finally: "Done"
divide(10, 0) → try: 10 / 0 fails → except: "Error: cannot divide by zero" → finally: "Done"
```

**Pseudocode**

```text
FUNCTION divide(a, b):
    TRY
        result = a / b
    CATCH ZeroDivisionError
        PRINT "Error: cannot divide by zero"
    ELSE
        PRINT "Result:", result
    FINALLY
        PRINT "Done"
    END TRY

divide(10, 2)    // Result: 5.0, Done
divide(10, 0)    // Error: cannot divide by zero, Done
```

**Code**

```python
def divide(a, b):
    try:
        result = a / b
    except ZeroDivisionError:
        print("Error: cannot divide by zero")
    else:
        print("Result:", result)
    finally:
        print("Done")


divide(10, 2)
divide(10, 0)
```

**Output:**

```text
Result: 5.0
Done
Error: cannot divide by zero
Done
```

**Fact (why this program):**

**Real-life example:**

- 🏠 **Everyday:** At an ATM you try to withdraw; if it fails you see an error, if it works you get cash, and the card always comes back out.
- 💻 **In software:** Database code uses try/except/finally so the connection is always closed, even when a query fails.

| Part | When it runs |
|---|---|
| `try` | Always: the risky code |
| `except` | Only if an error happens |
| `else` | Only if **no** error happens |
| `finally` | Always, at the end: cleanup |


**Same program using a class**

```python
class Calculator:
    """Divides two numbers and handles division by zero."""

    def divide(self, a, b):
        try:
            result = a / b
        except ZeroDivisionError:
            print("Error: cannot divide by zero")
        else:
            print("Result:", result)
        finally:
            print("Done")


calc = Calculator()
calc.divide(10, 2)
calc.divide(10, 0)
```

**Output:**

```text
Result: 5.0
Done
Error: cannot divide by zero
Done
```

**Points to remember**

- Exception handling is the same inside a method. Only `self` is added.
- `else` runs only when there is no error. `finally` always runs.
- In real classes, `finally` is where you close connections or release resources.

</details>

### Program 52

**Task:** Create a custom exception `InsufficientBalanceError`. Write `withdraw(balance, amount)` that raises it when the amount is more than the balance, and otherwise returns the new balance. Withdraw 300 from 1000, then try to withdraw 5000 and catch the error.

**Level:** 🟡 Medium

*From E33: How do you create and raise custom exceptions?*

<details>
<summary>Answer</summary>

**Steps**

1. `class InsufficientBalanceError(Exception): pass`.
2. In `withdraw()`, check `amount > balance` → else `raise InsufficientBalanceError(...)`.
3. Otherwise → `return balance - amount`.
4. Catch the error with `except InsufficientBalanceError as error`.

**Program flow**

```text
withdraw(1000, 300)   → 300 > 1000?  NO  → return 700
withdraw(1000, 5000)  → 5000 > 1000? YES → raise InsufficientBalanceError
except                →                  → "Error: Balance 1000 is less than 5000"
```

**Pseudocode**

```text
CLASS InsufficientBalanceError EXTENDS Exception:  (nothing)

FUNCTION withdraw(balance, amount):
    IF amount > balance THEN
        RAISE InsufficientBalanceError "Balance <balance> is less than <amount>"
    ELSE
        RETURN balance - amount
    END IF

PRINT withdraw(1000, 300)    // 700
TRY
    withdraw(1000, 5000)
CATCH InsufficientBalanceError AS error
    PRINT "Error:", error    // Error: Balance 1000 is less than 5000
END TRY
```

**Code**

```python
class InsufficientBalanceError(Exception):
    pass


def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientBalanceError(f"Balance {balance} is less than {amount}")
    return balance - amount


print(withdraw(1000, 300))       # 700

try:
    withdraw(1000, 5000)
except InsufficientBalanceError as error:
    print("Error:", error)       # Error: Balance 1000 is less than 5000
```

**Output:**

```text
700
Error: Balance 1000 is less than 5000
```

**Fact (why this program):** A custom exception is a class that inherits from `Exception`. Its name explains exactly what went wrong, and callers can catch that one error by name.

**Real-life example:**

- 🏠 **Everyday:** A UPI app shows 'Insufficient balance' instead of a vague 'Something went wrong'.
- 💻 **In software:** Banking and wallet services raise InsufficientBalanceError so the API can return a clear message and status code.

</details>

### Program 76

**Task:** Write `get_discount(order, price_text)`. It converts `price_text` to a number and applies the order's `"discount"` percentage. Use **two `except` blocks**: one for `ValueError` (the price isn't a number, so return `0.0`) and one for `KeyError` (the order has no `"discount"` key, so return the full price). Test it with a good order, a bad price, and an order without a discount.

**Using a class:** An `Order` class stores the order details. `get_discount(price_text)` becomes a method that reads the discount from `self.details`.

**Level:** 🟡 Medium

*Developer use: Reading form fields, query parameters, or JSON payloads, where values may be missing or in the wrong format.*

<details>
<summary>Answer</summary>

**Steps**

1. Inside `try`: `price = float(price_text)`, then `percent = order["discount"]`.
2. Return the discounted price.
3. `except ValueError` → print a message and return `0.0`.
4. `except KeyError as error` → print the missing key and return the full price.

**Program flow**

```text
({"discount": 10}, "500")          → float OK, key OK     → 500 - 50 → 450.0
({"discount": 10}, "five hundred") → float fails          → except ValueError → 0.0
({}, "500")                        → float OK, key missing → except KeyError  → 500.0
```

**Pseudocode**

```text
FUNCTION get_discount(order, price_text):
    TRY
        price = convert price_text to number     // may fail: ValueError
        percent = order["discount"]              // may fail: KeyError
        RETURN price - price * percent / 100
    CATCH ValueError
        PRINT "Bad price ..., using 0"
        RETURN 0.0
    CATCH KeyError AS error
        PRINT "Missing key ..., no discount"
        RETURN price_text as number
    END TRY

PRINT get_discount({"discount": 10}, "500")           // 450.0
PRINT get_discount({"discount": 10}, "five hundred")  // 0.0
PRINT get_discount({}, "500")                         // 500.0
```

**Code**

```python
def get_discount(order, price_text):
    try:
        price = float(price_text)              # may raise ValueError
        percent = order["discount"]            # may raise KeyError
        return price - price * percent / 100
    except ValueError:
        print(f"Bad price {price_text!r}, using 0")
        return 0.0
    except KeyError as error:
        print(f"Missing key {error}, no discount")
        return float(price_text)


print(get_discount({"discount": 10}, "500"))
print(get_discount({"discount": 10}, "five hundred"))
print(get_discount({}, "500"))
```

**Output:**

```text
450.0
Bad price 'five hundred', using 0
0.0
Missing key 'discount', no discount
500.0
```

**Fact (why this program):** One `try` can have several `except` blocks. Python checks them **from top to bottom** and runs only the first one that matches. Catch specific errors like `ValueError` and `KeyError` rather than a bare `except:`, so real bugs (such as a typo in a variable name) aren't hidden. For a missing dict key, `order.get("discount", 0)` is often simpler than catching `KeyError`.

**Real-life example:**

- 🏠 **Everyday:** A shop clerk handles a torn note one way and a missing coupon another way.
- 💻 **In software:** Form and API handlers catch ValueError for bad input and KeyError for missing fields, each with its own reply.


**Same program using a class**

```python
class Order:
    """An order that may or may not have a discount percentage."""

    def __init__(self, details):
        self.details = details            # e.g. {"discount": 10}

    def get_discount(self, price_text):
        try:
            price = float(price_text)              # may raise ValueError
            percent = self.details["discount"]     # may raise KeyError
            return price - price * percent / 100
        except ValueError:
            print(f"Bad price {price_text!r}, using 0")
            return 0.0
        except KeyError as error:
            print(f"Missing key {error}, no discount")
            return float(price_text)


print(Order({"discount": 10}).get_discount("500"))
print(Order({"discount": 10}).get_discount("five hundred"))
print(Order({}).get_discount("500"))
```

**Output:**

```text
450.0
Bad price 'five hundred', using 0
0.0
Missing key 'discount', no discount
500.0
```

**Points to remember**

- The two `except` blocks are unchanged. Python picks the one that matches the error.
- `self.details["discount"]` raises `KeyError` when the key is missing, just like a plain dict.
- Keep the `try` block small. Only the lines that can fail should be inside it.

</details>

### Program 53

**Task:** Create `InvalidAgeError`. Write `read_age(text)` that converts text to an integer. If `int()` fails with `ValueError`, raise `InvalidAgeError("Age must be a whole number")` **from** the original error. Read `"25"`, then try `"abc"` and print the error and its cause.

**Level:** 🔴 Difficult

*From E34: What is exception chaining using `raise ... from ...`?*

<details>
<summary>Answer</summary>

**Steps**

1. `class InvalidAgeError(Exception): pass`.
2. `try:` → `return int(text)`.
3. `except ValueError as error:` → `raise InvalidAgeError(...) from error`.
4. Catch it and print the error and `error.__cause__`.

**Program flow**

```text
read_age("25")   → int("25") OK     → 25
read_age("abc")  → int("abc") fails → ValueError
                 → raise InvalidAgeError from it → __cause__ = the ValueError
except           → "Error: Age must be a whole number"
                 → "Cause: invalid literal for int() with base 10: 'abc'"
```

**Pseudocode**

```text
CLASS InvalidAgeError EXTENDS Exception:  (nothing)

FUNCTION read_age(text):
    TRY
        RETURN integer(text)
    CATCH ValueError AS error
        RAISE InvalidAgeError "Age must be a whole number" FROM error
    END TRY

PRINT read_age("25")    // 25
TRY
    read_age("abc")
CATCH InvalidAgeError AS error
    PRINT "Error:", error            // Age must be a whole number
    PRINT "Cause:", error.__cause__  // invalid literal for int() ...
END TRY
```

**Code**

```python
class InvalidAgeError(Exception):
    pass


def read_age(text):
    try:
        return int(text)
    except ValueError as error:
        raise InvalidAgeError("Age must be a whole number") from error


print(read_age("25"))    # 25

try:
    read_age("abc")
except InvalidAgeError as error:
    print("Error:", error)
    print("Cause:", error.__cause__)
# Error: Age must be a whole number
# Cause: invalid literal for int() with base 10: 'abc'
```

**Output:**

```text
25
Error: Age must be a whole number
Cause: invalid literal for int() with base 10: 'abc'
```

**Fact (why this program):** `raise New from original` gives the user a clear, simple error and keeps the real cause in `__cause__` for developers. The traceback shows both errors.

**Real-life example:**

- 🏠 **Everyday:** A doctor says 'fever' and also notes the real cause, 'infection', on the report.
- 💻 **In software:** Services wrap low-level errors like ValueError in a domain error with raise ... from err, so logs keep the root cause.

</details>

### Program 77

**Task:** Build an exception **hierarchy** for a payment service: a base class `PaymentError`, and two children, `CardDeclined` and `InsufficientFunds`. `InsufficientFunds` stores `needed` and `available`. Write `pay(card, amount, balance)`, which raises the right error. Write `checkout()`, which catches `InsufficientFunds` with a warning, catches **any other** `PaymentError` with an error message, and always logs the attempt in `finally`.

**Level:** 🔴 Difficult

*Developer use: Payment gateways, API clients and service layers, which define one base error so callers can catch all of the library's errors in one place.*

<details>
<summary>Answer</summary>

**Steps**

1. `class PaymentError(Exception)` → the base class.
2. `class CardDeclined(PaymentError)` → `pass`.
3. `class InsufficientFunds(PaymentError)` → `__init__(needed, available)`: build the message with `super().__init__()`, then store both values.
4. `pay()` → raise `CardDeclined` for a `"blocked"` card, or `InsufficientFunds` if `amount > balance`. Otherwise return `"Paid Rs. <amount>"`.
5. `checkout()` → `except InsufficientFunds` first, then `except PaymentError`, then `finally`.

**Program flow**

```text
checkout("valid", 500, 1000)    → pay OK                → "OK: Paid Rs. 500"         → finally
checkout("blocked", 500, 1000)  → raise CardDeclined    → caught by PaymentError     → finally
checkout("valid", 1500, 1000)   → raise InsufficientFunds → caught by its own except → finally
```

**Pseudocode**

```text
CLASS PaymentError(Exception)
CLASS CardDeclined(PaymentError)
CLASS InsufficientFunds(PaymentError):
    __init__(needed, available): message "Need Rs. X, have Rs. Y"; store both

FUNCTION pay(card, amount, balance):
    IF card == "blocked":  RAISE CardDeclined
    IF amount > balance:   RAISE InsufficientFunds(amount, balance)
    RETURN "Paid Rs. amount"

FUNCTION checkout(card, amount, balance):
    TRY        PRINT "OK:", pay(...)
    CATCH InsufficientFunds AS e  → PRINT "[WARN] ... short by needed - available"
    CATCH PaymentError AS e       → PRINT "[ERROR] ..."     // any other payment error
    FINALLY    PRINT "Payment attempt logged"
```

**Code**

```python
class PaymentError(Exception):
    """Base class for all payment problems."""


class CardDeclined(PaymentError):
    pass


class InsufficientFunds(PaymentError):
    def __init__(self, needed, available):
        super().__init__(f"Need Rs. {needed}, have Rs. {available}")
        self.needed = needed
        self.available = available


def pay(card, amount, balance):
    if card == "blocked":
        raise CardDeclined("Card is blocked by the bank")
    if amount > balance:
        raise InsufficientFunds(amount, balance)
    return f"Paid Rs. {amount}"


def checkout(card, amount, balance):
    try:
        print("OK:", pay(card, amount, balance))
    except InsufficientFunds as error:
        short = error.needed - error.available
        print(f"[WARN] {type(error).__name__}: {error} (short by Rs. {short})")
    except PaymentError as error:              # catches every other payment error
        print(f"[ERROR] {type(error).__name__}: {error}")
    finally:
        print("Payment attempt logged")


checkout("valid", 500, 1000)
checkout("blocked", 500, 1000)
checkout("valid", 1500, 1000)
```

**Output:**

```text
OK: Paid Rs. 500
Payment attempt logged
[ERROR] CardDeclined: Card is blocked by the bank
Payment attempt logged
[WARN] InsufficientFunds: Need Rs. 1500, have Rs. 1000 (short by Rs. 500)
Payment attempt logged
```

**Fact (why this program):** `except PaymentError` also catches **every child class**, so new payment errors added later are handled automatically. Put the **more specific** `except` first: if `except PaymentError` came first, the `InsufficientFunds` block would never run. Storing extra data on the exception (`needed`, `available`) lets the caller react to it, not just print it.

**Real-life example:**

- 🏠 **Everyday:** 'Payment failed' can be card declined or low balance, but the shop handles all of them at one counter.
- 💻 **In software:** Payment gateways define PaymentError with child errors, so one except PaymentError block handles every payment problem.

</details>

## Context managers

Setup and cleanup with `with`, `__enter__` and `__exit__`.

### Program 54

**Task:** Create a `Lights` class that prints `"Lights on"` when a `with` block starts and `"Lights off"` when it ends. Use it once normally, and once with an error inside the block, to show that `"Lights off"` still prints.

**Level:** 🟢 Simple

*From E36: What is a context manager, and how does `with` work?*

<details>
<summary>Answer</summary>

**Steps**

1. `__enter__` → print "Lights on" and return `self`.
2. `__exit__` → print "Lights off" and return `False` (don't hide errors).
3. Use `with Lights():` normally.
4. Use it again, raise a `ValueError` inside, and catch it outside.

**Program flow**

```text
with Lights():        → __enter__ → "Lights on"
  block               →           → "Reading a book"
end of block          → __exit__  → "Lights off"

with Lights():        → __enter__ → "Lights on"
  block               →           → "Working" → raise ValueError
error leaves block    → __exit__  → "Lights off" (still runs) → return False
except outside        →           → "Error: Power cut"
```

**Pseudocode**

```text
CLASS Lights:
    __enter__():  PRINT "Lights on";  RETURN self
    __exit__(error details):
        PRINT "Lights off"     // always runs
        RETURN False           // let the error continue

WITH Lights():
    PRINT "Reading a book"

TRY
    WITH Lights():
        PRINT "Working"
        RAISE ValueError "Power cut"
CATCH ValueError AS error
    PRINT "Error:", error    // Error: Power cut
END TRY
```

**Code**

```python
class Lights:
    def __enter__(self):
        print("Lights on")
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        print("Lights off")      # always runs, even after an error
        return False             # False: let the error continue


with Lights():
    print("Reading a book")

try:
    with Lights():
        print("Working")
        raise ValueError("Power cut")
except ValueError as error:
    print("Error:", error)
```

**Output:**

```text
Lights on
Reading a book
Lights off
Lights on
Working
Lights off
Error: Power cut
```

**Fact (why this program):** `with` calls `__enter__` at the start and `__exit__` at the end, **even if an error happens**. That's why files, locks, and database connections use `with`: cleanup is never skipped.

**Real-life example:**

- 🏠 **Everyday:** A motion-sensor light in a corridor switches on when you walk in and switches off when you leave, even if you leave in a hurry.
- 💻 **In software:** Database connections, locks and network sockets use `with` so they are always released, even when a request crashes.

</details>

### Program 78

**Task:** Use `with open()` to write two tasks to a file `notes.txt` in a temporary folder, then read the file back line by line. After each `with` block, print `file.closed` to show that Python closed the file for you.

**Using a class:** A `NotesFile` class stores the file `path`. `save()` writes with `with open()`, `show()` reads it back, and `delete()` removes the file.

**Level:** 🟡 Medium

*Developer use: Reading config files, writing reports, CSV exports and log files. `with open()` is the most-used context manager in Python.*

<details>
<summary>Answer</summary>

**Steps**

1. Make a temporary folder with `tempfile.mkdtemp()` and build the file path with `os.path.join()`.
2. `with open(path, "w") as file:` → write two lines.
3. Print `file.closed` → `True`.
4. `with open(path) as file:` → loop over the lines and print each one.
5. Print `file.closed` again, then delete the file and folder.

**Program flow**

```text
with open(path, "w") → file opened  → write "Buy milk", "Call Ravi" → block ends → file closed
file.closed          → True
with open(path)      → file opened  → read line by line            → block ends → file closed
file.closed          → True
```

**Pseudocode**

```text
folder = new temporary folder
path = folder + "notes.txt"

WITH open path FOR writing AS file:
    WRITE "Buy milk"
    WRITE "Call Ravi"
PRINT file is closed?        // True

WITH open path FOR reading AS file:
    FOR EACH line IN file:  PRINT "Task:", line
PRINT file is closed?        // True

DELETE file and folder
```

**Code**

```python
import os
import tempfile

folder = tempfile.mkdtemp()                    # a fresh, empty folder
path = os.path.join(folder, "notes.txt")

with open(path, "w") as file:                  # "w" = write (creates the file)
    file.write("Buy milk\n")
    file.write("Call Ravi\n")

print("Closed after writing?", file.closed)

with open(path) as file:                       # default mode "r" = read
    for line in file:
        print("Task:", line.strip())

print("Closed after reading?", file.closed)

os.remove(path)                                # clean up
os.rmdir(folder)
```

**Output:**

```text
Closed after writing? True
Task: Buy milk
Task: Call Ravi
Closed after reading? True
```

**Fact (why this program):** Without `with`, you must call `file.close()` yourself, and if an error happens first, the file stays open (and written data may not be saved). `with open()` closes the file as soon as the block ends, **even after an error**. Always prefer it.

**Real-life example:**

- 🏠 **Everyday:** A library book drop box takes the book back automatically, so you never forget to return it.
- 💻 **In software:** Reading CSV uploads or writing log and report files in Django or FastAPI apps with `with open()` so file handles never leak.


**Same program using a class**

```python
import os
import tempfile


class NotesFile:
    """Writes tasks to a text file and reads them back."""

    def __init__(self, path):
        self.path = path

    def save(self, tasks):
        with open(self.path, "w") as file:     # "w" = write (creates the file)
            for task in tasks:
                file.write(task + "\n")
        print("Closed after writing?", file.closed)

    def show(self):
        with open(self.path) as file:          # default mode "r" = read
            for line in file:
                print("Task:", line.strip())
        print("Closed after reading?", file.closed)

    def delete(self):
        os.remove(self.path)                   # clean up


folder = tempfile.mkdtemp()                    # a fresh, empty folder
notes = NotesFile(os.path.join(folder, "notes.txt"))

notes.save(["Buy milk", "Call Ravi"])
notes.show()

notes.delete()
os.rmdir(folder)
```

**Output:**

```text
Closed after writing? True
Task: Buy milk
Task: Call Ravi
Closed after reading? True
```

**Points to remember**

- `with open()` inside a method still closes the file automatically at the end of the block.
- Storing the path on the object means every method uses the same file.
- Don't keep a file open as an attribute between method calls. Open it with `with` inside each method.

</details>

### Program 79

**Task:** Write a context manager **without a class**, using `@contextmanager` from `contextlib`. `step(name)` prints `"[start] <name>"` before the block and `"[end] <name>"` after it, and gives the name in capitals to `as`. Use it once normally, and once with an error inside, to show that `"[end]"` still prints.

**Using a class:** A `Pipeline` class holds a job name. Its `step()` method is decorated with `@contextmanager`, so each object can open `with pipeline.step(...)` blocks.

**Level:** 🟡 Medium

*Developer use: Quick setup/cleanup helpers, such as timing a code block, opening and closing a DB session, or changing directory and coming back, without writing a full class.*

<details>
<summary>Answer</summary>

**Steps**

1. Import `contextmanager` from `contextlib`.
2. Decorate a generator function `step(name)` with `@contextmanager`.
3. Before `yield` → print `[start]` (this acts like `__enter__`).
4. `yield name.upper()` → this value goes to `as`.
5. Put `[end]` in a `finally` block after `yield` (this acts like `__exit__`), so it runs even after an error.

**Program flow**

```text
with step("load data") as label → code before yield → "[start] load data"
                                → yield "LOAD DATA" → label = "LOAD DATA"
  block                         → "Working on LOAD DATA"
end of block                    → finally           → "[end] load data"

with step("train model")        → "[start] train model"
  raise RuntimeError            → finally still runs → "[end] train model"
except outside                  → "Error: Out of memory"
```

**Pseudocode**

```text
@contextmanager
GENERATOR step(name):
    PRINT "[start]", name       // like __enter__
    TRY
        YIELD name in capitals  // value for "as"; the with-block runs here
    FINALLY
        PRINT "[end]", name     // like __exit__, always runs

WITH step("load data") AS label:
    PRINT "Working on", label

TRY
    WITH step("train model"):  RAISE RuntimeError "Out of memory"
CATCH RuntimeError AS error
    PRINT "Error:", error
```

**Code**

```python
from contextlib import contextmanager


@contextmanager
def step(name):
    print(f"[start] {name}")         # runs like __enter__
    try:
        yield name.upper()           # value given to "as"
    finally:
        print(f"[end] {name}")       # runs like __exit__, even after an error


with step("load data") as label:
    print("Working on", label)

try:
    with step("train model"):
        raise RuntimeError("Out of memory")
except RuntimeError as error:
    print("Error:", error)
```

**Output:**

```text
[start] load data
Working on LOAD DATA
[end] load data
[start] train model
[end] train model
Error: Out of memory
```

**Fact (why this program):** `@contextmanager` turns a generator into a context manager. The code **before** `yield` is the setup, and the code **after** it is the cleanup. The `try/finally` around `yield` is important: without it, an error inside the `with` block would skip the cleanup.

**Real-life example:**

- 🏠 **Everyday:** A shop shutter: open it before work (setup), do business, and pull it down at closing (cleanup), whatever happened during the day.
- 💻 **In software:** Writing quick helpers like `with timer():` or `with temp_directory():` in test suites and scripts without a full class.


**Same program using a class**

```python
from contextlib import contextmanager


class Pipeline:
    def __init__(self, name):
        self.name = name

    @contextmanager
    def step(self, step_name):
        print(f"[start] {self.name}: {step_name}")    # runs like __enter__
        try:
            yield step_name.upper()                    # value given to "as"
        finally:
            print(f"[end] {self.name}: {step_name}")  # runs like __exit__, even after an error


pipeline = Pipeline("ml-job")

with pipeline.step("load data") as label:
    print("Working on", label)

try:
    with pipeline.step("train model"):
        raise RuntimeError("Out of memory")
except RuntimeError as error:
    print("Error:", error)
```

**Output:**

```text
[start] ml-job: load data
Working on LOAD DATA
[end] ml-job: load data
[start] ml-job: train model
[end] ml-job: train model
Error: Out of memory
```

**Points to remember**

- `@contextmanager` works on a method too: `self` comes first, then your own arguments.
- The `try`/`finally` around `yield` is still what makes `[end]` print after an error.
- Use `pipeline.step(...)` (on the object), not `Pipeline.step(...)`.

</details>

### Program 80

**Task:** Create a `Database` class that works like a transaction. Inside a `with db:` block, `insert(row)` adds rows to a `pending` list. In `__exit__`, if there was **no error**, commit the pending rows to `saved`. If there **was** an error, roll back (throw away the pending rows). Run one successful block and one that fails, then print the saved rows.

**Level:** 🟡 Medium

*Developer use: Database transactions in SQLAlchemy, Django and sqlite3 (`with connection:`), which commit on success and roll back on error automatically.*

<details>
<summary>Answer</summary>

**Steps**

1. `__init__` → `saved = []` and `pending = []`.
2. `__enter__` → print "Transaction started", clear `pending`, return `self`.
3. `insert(row)` → append to `pending`.
4. `__exit__` → if `exc_type is None`, add `pending` to `saved` and print "Commit". Otherwise print "Rollback" with the error.
5. Clear `pending` and return `False`, so the error still reaches the caller.

**Program flow**

```text
with db:  insert order-1, order-2 → no error → __exit__(None…) → Commit → saved = [order-1, order-2]
with db:  insert order-3 → raise ValueError → __exit__(ValueError…) → Rollback → saved unchanged
except ValueError outside → pass
print saved → ['order-1', 'order-2']
```

**Pseudocode**

```text
CLASS Database:
    __init__():   saved = [], pending = []
    __enter__():  PRINT "Transaction started"; pending = []; RETURN self
    insert(row):  ADD row TO pending
    __exit__(exc_type, exc_value, traceback):
        IF exc_type is None:  ADD pending TO saved; PRINT "Commit:", pending
        ELSE:                 PRINT "Rollback:", pending, exc_value
        pending = []
        RETURN False          // don't hide the error

WITH db:  insert "order-1"; insert "order-2"
TRY
    WITH db:  insert "order-3"; RAISE ValueError "Payment failed"
CATCH ValueError:  do nothing
PRINT db.saved
```

**Code**

```python
class Database:
    def __init__(self):
        self.saved = []              # rows that are really stored
        self.pending = []            # rows waiting for commit

    def __enter__(self):
        print("Transaction started")
        self.pending = []
        return self

    def insert(self, row):
        self.pending.append(row)

    def __exit__(self, exc_type, exc_value, traceback):
        if exc_type is None:
            self.saved.extend(self.pending)
            print("Commit:", self.pending)
        else:
            print(f"Rollback: {self.pending} ({exc_value})")
        self.pending = []
        return False                 # don't hide the error


db = Database()

with db:
    db.insert("order-1")
    db.insert("order-2")

try:
    with db:
        db.insert("order-3")
        raise ValueError("Payment failed")
except ValueError:
    pass

print("Saved rows:", db.saved)
```

**Output:**

```text
Transaction started
Commit: ['order-1', 'order-2']
Transaction started
Rollback: ['order-3'] (Payment failed)
Saved rows: ['order-1', 'order-2']
```

**Fact (why this program):** `__exit__` receives the error details. `exc_type` is `None` when the block finished normally, which is how the manager knows whether to **commit** or **roll back**. Because of this, the half-finished order (`order-3`) is never saved, which keeps the data consistent.

**Real-life example:**

- 🏠 **Everyday:** A UPI payment either completes fully or the money comes back to your account; it never stays half-sent.
- 💻 **In software:** SQLAlchemy sessions and Django's `transaction.atomic()` save all rows on success and roll everything back on an error.

</details>

### Program 81

**Task:** Create a `TempSetting` context manager that changes one value in a global `settings` dict inside the block and **always puts the old value back** afterwards. It also takes an optional `ignore` exception type: if that error happens inside the block, `__exit__` prints it and **suppresses** it by returning `True`. Any other error must still be raised.

**Level:** 🔴 Difficult

*Developer use: Tests that temporarily turn on debug mode or change an environment variable (like `unittest.mock.patch`), and `contextlib.suppress()` for ignoring one expected error.*

<details>
<summary>Answer</summary>

**Steps**

1. `__init__(key, value, ignore=None)` → store all three.
2. `__enter__` → save the old value in `self.old`, set the new value, return `settings`.
3. `__exit__` → always restore `settings[key] = self.old` first.
4. If an error happened and it is a subclass of `ignore`, print it and `return True` (suppress it).
5. Otherwise `return False`, so the error continues.

**Program flow**

```text
with TempSetting("debug", True)          → debug = True inside → restored to False after
with TempSetting(..., ignore=KeyError)   → settings["missing"] raises KeyError
                                         → __exit__: restore, KeyError matches → return True → error hidden
                                         → program continues
with TempSetting(..., ignore=KeyError)   → raise ValueError → restore, no match → return False
except ValueError outside                → "Not ignored: Wrong value"
```

**Pseudocode**

```text
settings = {"debug": False}

CLASS TempSetting:
    __init__(key, value, ignore = None)
    __enter__():
        old = settings[key]
        settings[key] = value
        RETURN settings
    __exit__(exc_type, exc_value, traceback):
        settings[key] = old                     // always restore
        IF an error happened AND it is the ignore type:
            PRINT "Ignored:", exc_value
            RETURN True                         // hide the error
        RETURN False                            // let other errors continue
```

**Code**

```python
settings = {"debug": False}


class TempSetting:
    """Change one setting inside the block, then put it back."""

    def __init__(self, key, value, ignore=None):
        self.key = key
        self.value = value
        self.ignore = ignore         # an exception type to swallow

    def __enter__(self):
        self.old = settings[self.key]
        settings[self.key] = self.value
        return settings

    def __exit__(self, exc_type, exc_value, traceback):
        settings[self.key] = self.old            # always restore
        if exc_type and self.ignore and issubclass(exc_type, self.ignore):
            print("Ignored:", exc_value)
            return True                          # True = hide this error
        return False


with TempSetting("debug", True) as current:
    print("Inside:", current)
print("After:", settings)

with TempSetting("debug", True, ignore=KeyError):
    print("Looking up a missing key...")
    settings["missing"]
print("Program continues:", settings)

try:
    with TempSetting("debug", True, ignore=KeyError):
        raise ValueError("Wrong value")
except ValueError as error:
    print("Not ignored:", error, settings)
```

**Output:**

```text
Inside: {'debug': True}
After: {'debug': False}
Looking up a missing key...
Ignored: 'missing'
Program continues: {'debug': False}
Not ignored: Wrong value {'debug': False}
```

**Fact (why this program):** The return value of `__exit__` decides what happens to an error: `True` **swallows** it, and `False` (or `None`) lets it continue. Only suppress errors you expect, as `contextlib.suppress(KeyError)` does. Restoring the old value **before** that check means the setting is put back in every case.

**Real-life example:**

- 🏠 **Everyday:** Putting your phone on silent for a meeting and switching the ringer back on afterwards, even if the meeting ends early.
- 💻 **In software:** Overriding settings in tests (`override_settings`, `mock.patch`) and ignoring an expected error with `contextlib.suppress`.

</details>

## Asyncio

Running waiting tasks at the same time with `async` and `await`.

### Program 82

**Task:** Write the simplest async program: an `async def greet()` that prints `"Hello..."`, waits 1 second with `await asyncio.sleep(1)`, then prints `"...World!"`. First call `greet()` without running it and print the type of what you get back. Then run it properly with `asyncio.run()`.

**Using a class:** A `Greeter` class stores a `name`, and `greet()` becomes an `async` method.

**Level:** 🟢 Simple

*Developer use: The starting point of every async app. FastAPI endpoints, async database drivers and HTTP clients like `httpx` are all `async def` functions.*

<details>
<summary>Answer</summary>

**Steps**

1. `import asyncio`.
2. `async def greet()` → print, `await asyncio.sleep(1)`, print.
3. `result = greet()` → this only creates a **coroutine object**. Print its type, then `close()` it.
4. `asyncio.run(greet())` → this actually runs it.

**Program flow**

```text
greet()               → creates a coroutine object, runs nothing → "coroutine"
asyncio.run(greet())  → starts the event loop → "Hello..."
                      → await sleep(1)        → pauses 1 second
                      → resumes               → "...World!"
```

**Pseudocode**

```text
IMPORT asyncio

ASYNC FUNCTION greet():
    PRINT "Hello..."
    AWAIT sleep 1 second      // pause here
    PRINT "...World!"

result = greet()              // does NOT run; just a coroutine object
PRINT type of result          // coroutine

RUN greet()                   // really runs it
```

**Code**

```python
import asyncio


async def greet():
    print("Hello...")
    await asyncio.sleep(1)       # pause for 1 second without blocking
    print("...World!")


result = greet()                 # calling it does NOT run it
print(type(result).__name__)     # coroutine
result.close()                   # we won't use this one

asyncio.run(greet())             # this really runs it
```

**Output:**

```text
coroutine
Hello...
...World!
```

**Fact (why this program):** Calling an `async def` function doesn't run its body. It returns a **coroutine** object, a paused task waiting to be started. It runs only when you `await` it or pass it to `asyncio.run()`. Forgetting `await` is the most common async bug, and Python warns `coroutine ... was never awaited`.

**Real-life example:**

- 🏠 **Everyday:** Booking a cab only creates the request; nothing moves until a driver actually starts the trip.
- 💻 **In software:** Forgetting `await` in a FastAPI endpoint returns a coroutine object instead of data and gives the 'coroutine was never awaited' warning.


**Same program using a class**

```python
import asyncio


class Greeter:
    def __init__(self, name):
        self.name = name

    async def greet(self):
        print(f"Hello {self.name}...")
        await asyncio.sleep(1)       # pause for 1 second without blocking
        print("...World!")


greeter = Greeter("Asha")

result = greeter.greet()             # calling it does NOT run it
print(type(result).__name__)         # coroutine
result.close()                       # we won't use this one

asyncio.run(greeter.greet())         # this really runs it
```

**Output:**

```text
coroutine
Hello Asha...
...World!
```

**Points to remember**

- `greeter.greet()` without `await` still gives only a coroutine object. Nothing runs yet.
- Pass the method call to `asyncio.run(greeter.greet())` to really run it.
- Async methods get `self` like normal methods, so they can read `self.name`.

</details>

### Program 55

**Task:** Write two `async` functions, `make_tea()` and `make_toast()`. Each prints a starting message, waits 1 second with `await asyncio.sleep(1)`, and returns a "ready" message. Run both together with `asyncio.gather()` and print the results.

**Using a class:** A `Kitchen` class has `make_tea()` and `make_toast()` as `async` methods, plus `breakfast()`, which runs both together.

**Level:** 🟡 Medium

*From E40: How do `async` and `await` work in Python?*

<details>
<summary>Answer</summary>

**Steps**

1. `async def make_tea()` → print, `await asyncio.sleep(1)`, return "Tea is ready".
2. `async def make_toast()` → the same for toast.
3. `async def main()` → `await asyncio.gather(make_tea(), make_toast())`.
4. Start it with `asyncio.run(main())`.

**Program flow**

```text
asyncio.run(main())   → starts the event loop
gather(tea, toast)    → make_tea starts   → "Boiling water..."  → await sleep(1): pauses
                      → make_toast starts → "Toasting bread..." → await sleep(1): pauses
after ~1 second       → both finish       → ['Tea is ready', 'Toast is ready']
```

**Pseudocode**

```text
IMPORT asyncio

ASYNC FUNCTION make_tea():
    PRINT "Boiling water..."
    AWAIT sleep 1 second       // pause, let other tasks run
    RETURN "Tea is ready"

ASYNC FUNCTION make_toast():
    PRINT "Toasting bread..."
    AWAIT sleep 1 second
    RETURN "Toast is ready"

ASYNC FUNCTION main():
    results = AWAIT run make_tea() AND make_toast() together
    PRINT results              // ['Tea is ready', 'Toast is ready']

RUN main()
```

**Code**

```python
import asyncio


async def make_tea():
    print("Boiling water...")
    await asyncio.sleep(1)       # wait here, and let other tasks run
    return "Tea is ready"


async def make_toast():
    print("Toasting bread...")
    await asyncio.sleep(1)
    return "Toast is ready"


async def main():
    results = await asyncio.gather(make_tea(), make_toast())   # run both together
    print(results)


asyncio.run(main())
# Boiling water...
# Toasting bread...
# ['Tea is ready', 'Toast is ready']
```

**Output:**

```text
Boiling water...
Toasting bread...
['Tea is ready', 'Toast is ready']
```

**Fact (why this program):** `async def` makes a function that can pause. `await` pauses it until the result is ready, and lets other tasks run meanwhile. Both waits happen at the same time, so the whole program takes about **1 second, not 2**. Use asyncio for waiting work like network calls, not heavy calculations.

**Real-life example:**

- 🏠 **Everyday:** Putting the kettle on and the bread in the toaster at the same time, so breakfast is ready in one wait instead of two.
- 💻 **In software:** An async endpoint that loads a user's profile and notifications together instead of one after the other.


**Same program using a class**

```python
import asyncio


class Kitchen:
    async def make_tea(self):
        print("Boiling water...")
        await asyncio.sleep(1)       # wait here, and let other tasks run
        return "Tea is ready"

    async def make_toast(self):
        print("Toasting bread...")
        await asyncio.sleep(1)
        return "Toast is ready"

    async def breakfast(self):
        # run both methods together
        return await asyncio.gather(self.make_tea(), self.make_toast())


kitchen = Kitchen()
results = asyncio.run(kitchen.breakfast())
print(results)
```

**Output:**

```text
Boiling water...
Toasting bread...
['Tea is ready', 'Toast is ready']
```

**Points to remember**

- Inside the class, call the other methods as `self.make_tea()`, and pass them to `gather()`.
- `asyncio.run(kitchen.breakfast())` returns what `breakfast()` returns, so you can print it outside.
- It still takes about 1 second, not 2: the two waits overlap.

</details>

### Program 83

**Task:** Write `async def fetch(api, seconds)` that pretends to call an API by sleeping for `seconds`, then returns `"<api> done in <seconds>s"`. Call three APIs (`users` 1s, `orders` 2s, `payments` 1.5s) together with `asyncio.gather()`. Print each result and the total time, rounded to whole seconds.

**Using a class:** An `ApiClient` class stores a `base_url`. `fetch()` is one async call, and `fetch_all()` runs many calls together with `gather()`.

**Level:** 🟡 Medium

*Developer use: A dashboard or backend endpoint that calls several microservices or APIs at once, instead of one after another.*

<details>
<summary>Answer</summary>

**Steps**

1. `fetch(api, seconds)` → `await asyncio.sleep(seconds)`, then return the message.
2. In `main()`, note the start time with `time.perf_counter()`.
3. `await asyncio.gather(...)` with the three `fetch()` calls.
4. Print each result, then the rounded total time.

**Program flow**

```text
gather starts all 3 at once:
  users    → sleeps 1s
  orders   → sleeps 2s     ← the longest
  payments → sleeps 1.5s
all done after ~2s  → results in the same order as passed in
total time          → 2 seconds (not 1 + 2 + 1.5 = 4.5)
```

**Pseudocode**

```text
ASYNC FUNCTION fetch(api, seconds):
    AWAIT sleep seconds
    RETURN "<api> done in <seconds>s"

ASYNC FUNCTION main():
    start = now
    results = AWAIT run together fetch("users",1), fetch("orders",2), fetch("payments",1.5)
    FOR EACH result:  PRINT result
    PRINT "Total time:", round(now - start)    // 2

RUN main()
```

**Code**

```python
import asyncio
import time


async def fetch(api, seconds):
    await asyncio.sleep(seconds)          # pretend network delay
    return f"{api} done in {seconds}s"


async def main():
    start = time.perf_counter()
    results = await asyncio.gather(
        fetch("users", 1),
        fetch("orders", 2),
        fetch("payments", 1.5),
    )
    total = time.perf_counter() - start
    for result in results:
        print(result)
    print("Total time:", round(total), "seconds")   # ~2, not 4.5


asyncio.run(main())
```

**Output:**

```text
users done in 1s
orders done in 2s
payments done in 1.5s
Total time: 2 seconds
```

**Fact (why this program):** With `gather()`, the total time is the time of the **slowest** call (2s), not the sum of all of them (4.5s). The results come back **in the order you passed the calls**, not the order they finished, so you can unpack them safely.

**Real-life example:**

- 🏠 **Everyday:** Three friends order from Swiggy, Zomato and a dhaba at once; dinner starts when the slowest order arrives, not after adding all delivery times.
- 💻 **In software:** A dashboard API calling users, orders and payments services in parallel with `aiohttp`, so the response is as fast as the slowest service.


**Same program using a class**

```python
import asyncio
import time


class ApiClient:
    def __init__(self, base_url):
        self.base_url = base_url

    async def fetch(self, api, seconds):
        await asyncio.sleep(seconds)          # pretend network delay
        return f"{self.base_url}/{api} done in {seconds}s"

    async def fetch_all(self, calls):
        return await asyncio.gather(*(self.fetch(api, s) for api, s in calls))


async def main():
    client = ApiClient("https://api.shop.com")
    start = time.perf_counter()
    results = await client.fetch_all([("users", 1), ("orders", 2), ("payments", 1.5)])
    total = time.perf_counter() - start
    for result in results:
        print(result)
    print("Total time:", round(total), "seconds")   # ~2, not 4.5


asyncio.run(main())
```

**Output:**

```text
https://api.shop.com/users done in 1s
https://api.shop.com/orders done in 2s
https://api.shop.com/payments done in 1.5s
Total time: 2 seconds
```

**Points to remember**

- Shared settings like `base_url` live on `self`, so you don't pass them to every call.
- `fetch_all()` must `await` the `gather()`, and its caller must `await client.fetch_all(...)`.
- Total time is still the slowest call (~2s), not the sum (4.5s).

</details>

### Program 84

**Task:** Use `asyncio.create_task()` to start `send_email()` (which takes 1 second) **in the background**. While the email is sending, keep handling a request in three short steps of 0.3 seconds. At the end, `await` the task and print its status.

**Using a class:** A `RequestHandler` class has an async `send_email()` method, and a `handle()` method that starts the email in the background with `create_task()`.

**Level:** 🟡 Medium

*Developer use: Starting slow work (sending emails, writing audit logs, warming a cache) in the background while the main code keeps going.*

<details>
<summary>Answer</summary>

**Steps**

1. `send_email(to)` → print "Sending...", `await asyncio.sleep(1)`, print "Email sent", return `"sent"`.
2. In `main()`, `task = asyncio.create_task(send_email(...))` → schedules it to start.
3. Loop 3 times: print a step, then `await asyncio.sleep(0.3)` (this gives the task a chance to run).
4. `status = await task` → wait for it to finish, then print the status.

**Program flow**

```text
create_task(...)  → task scheduled, not started yet
step 1            → print → await sleep(0.3) → the event loop starts the task → "Sending email..."
step 2 (0.3s)     → print
step 3 (0.6s)     → print
await task (0.9s) → the email is still sleeping → wait
1.0s              → "Email sent to ..." → status = "sent"
```

**Pseudocode**

```text
ASYNC FUNCTION send_email(to):
    PRINT "Sending email to", to
    AWAIT sleep 1
    PRINT "Email sent to", to
    RETURN "sent"

ASYNC FUNCTION main():
    task = START IN BACKGROUND send_email("asha@example.com")
    FOR step FROM 1 TO 3:
        PRINT "Handling request, step", step
        AWAIT sleep 0.3
    status = AWAIT task
    PRINT "Email status:", status
```

**Code**

```python
import asyncio


async def send_email(to):
    print(f"Sending email to {to}...")
    await asyncio.sleep(1)
    print(f"Email sent to {to}")
    return "sent"


async def main():
    task = asyncio.create_task(send_email("asha@example.com"))   # starts in background

    for step in range(1, 4):
        print("Handling request, step", step)
        await asyncio.sleep(0.3)      # other work, lets the task run too

    status = await task               # wait for the email to finish
    print("Email status:", status)


asyncio.run(main())
```

**Output:**

```text
Handling request, step 1
Sending email to asha@example.com...
Handling request, step 2
Handling request, step 3
Email sent to asha@example.com
Email status: sent
```

**Fact (why this program):** `await some_coroutine()` waits right there, but `create_task()` **starts the work alongside** your code and gives you a handle to await later. The task only gets to run when your code reaches an `await` (asyncio switches tasks only at `await`). That's why "Sending email" prints after step 1. Keep a reference to the task, or it may be garbage-collected.

**Real-life example:**

- 🏠 **Everyday:** You start the washing machine and cook dinner while it runs, checking on it only at the end.
- 💻 **In software:** Sending a welcome email or push notification in the background while the signup request carries on.


**Same program using a class**

```python
import asyncio


class RequestHandler:
    async def send_email(self, to):
        print(f"Sending email to {to}...")
        await asyncio.sleep(1)
        print(f"Email sent to {to}")
        return "sent"

    async def handle(self, user_email):
        task = asyncio.create_task(self.send_email(user_email))   # starts in background

        for step in range(1, 4):
            print("Handling request, step", step)
            await asyncio.sleep(0.3)      # other work, lets the task run too

        status = await task               # wait for the email to finish
        print("Email status:", status)


handler = RequestHandler()
asyncio.run(handler.handle("asha@example.com"))
```

**Output:**

```text
Handling request, step 1
Sending email to asha@example.com...
Handling request, step 2
Handling request, step 3
Email sent to asha@example.com
Email status: sent
```

**Points to remember**

- Pass the method call to `create_task(self.send_email(...))`, not the method itself.
- Keep the task in a variable and `await` it later, or you won't get its result.
- The order of the output is the same as in the function version: the task starts at the first `await`.

</details>

### Program 85

**Task:** Download 3 files with a **limit of 2 at a time**, using `asyncio.Semaphore(2)`. Each `download(name, seconds, limit)` waits for a free slot with `async with limit:`, then prints when it starts and finishes. Then try to download `huge.zip` (5 seconds) with `asyncio.wait_for(..., timeout=0.5)`, and handle the timeout.

**Using a class:** A `Downloader` class keeps the limit as an attribute (`self.limit`), so every `download()` call shares the same semaphore.

**Level:** 🔴 Difficult

*Developer use: Web scrapers and API clients that limit how many requests run at once (to respect rate limits) and cancel requests that take too long.*

<details>
<summary>Answer</summary>

**Steps**

1. `download()` → `async with limit:` (wait for a slot), print "Start", sleep, print "Done", return the name.
2. In `main()`, `limit = asyncio.Semaphore(2)`.
3. `gather()` the three downloads: a.pdf 0.2s, b.pdf 0.4s, c.pdf 0.3s.
4. `await asyncio.wait_for(download("huge.zip", 5, limit), timeout=0.5)` inside `try`.
5. `except asyncio.TimeoutError` → print a cancelled message.

**Program flow**

```text
Semaphore(2) → 2 free slots
0.0s  Start a.pdf (slot 1), Start b.pdf (slot 2), c.pdf waits
0.2s  Done a.pdf → slot free → Start c.pdf
0.4s  Done b.pdf
0.5s  Done c.pdf → Downloaded: ['a.pdf', 'b.pdf', 'c.pdf']
huge.zip: Start → still sleeping at 0.5s → wait_for cancels it → TimeoutError
```

**Pseudocode**

```text
ASYNC FUNCTION download(name, seconds, limit):
    ASYNC WITH limit:           // wait for a free slot
        PRINT "Start", name
        AWAIT sleep seconds
        PRINT "Done ", name
        RETURN name

ASYNC FUNCTION main():
    limit = Semaphore(2)
    results = AWAIT run together download(a.pdf), download(b.pdf), download(c.pdf)
    PRINT "Downloaded:", results
    TRY
        AWAIT download("huge.zip", 5) WITH TIMEOUT 0.5 seconds
    CATCH TimeoutError
        PRINT "huge.zip took too long, cancelled"
```

**Code**

```python
import asyncio


async def download(name, seconds, limit):
    async with limit:                         # wait for a free slot
        print(f"Start {name}")
        await asyncio.sleep(seconds)
        print(f"Done  {name}")
        return name


async def main():
    limit = asyncio.Semaphore(2)              # at most 2 downloads at once
    files = [("a.pdf", 0.2), ("b.pdf", 0.4), ("c.pdf", 0.3)]
    results = await asyncio.gather(*(download(n, s, limit) for n, s in files))
    print("Downloaded:", results)

    try:
        await asyncio.wait_for(download("huge.zip", 5, limit), timeout=0.5)
    except asyncio.TimeoutError:
        print("huge.zip took too long, cancelled")


asyncio.run(main())
```

**Output:**

```text
Start a.pdf
Start b.pdf
Done  a.pdf
Start c.pdf
Done  b.pdf
Done  c.pdf
Downloaded: ['a.pdf', 'b.pdf', 'c.pdf']
Start huge.zip
huge.zip took too long, cancelled
```

**Fact (why this program):** A `Semaphore(2)` is a counter of free slots. `async with` takes a slot and gives it back when the block ends, so no more than 2 downloads ever run at once. `wait_for()` **cancels** a task that runs past its timeout and raises `TimeoutError`. Without timeouts, one slow server can hang your whole program.

**Real-life example:**

- 🏠 **Everyday:** A bank has only two counters open, so customers wait for a free counter, and anyone taking too long is asked to come back later.
- 💻 **In software:** Limiting concurrent scraping or API calls to avoid rate limits, and timing out a slow third-party payment API.


**Same program using a class**

```python
import asyncio


class Downloader:
    def __init__(self, max_at_once):
        self.max_at_once = max_at_once

    async def download(self, name, seconds):
        async with self.limit:                    # wait for a free slot
            print(f"Start {name}")
            await asyncio.sleep(seconds)
            print(f"Done  {name}")
            return name

    async def download_all(self, files):
        return await asyncio.gather(*(self.download(n, s) for n, s in files))

    async def run(self):
        self.limit = asyncio.Semaphore(self.max_at_once)   # create inside the running loop
        files = [("a.pdf", 0.2), ("b.pdf", 0.4), ("c.pdf", 0.3)]
        print("Downloaded:", await self.download_all(files))

        try:
            await asyncio.wait_for(self.download("huge.zip", 5), timeout=0.5)
        except asyncio.TimeoutError:
            print("huge.zip took too long, cancelled")


asyncio.run(Downloader(max_at_once=2).run())
```

**Output:**

```text
Start a.pdf
Start b.pdf
Done  a.pdf
Start c.pdf
Done  b.pdf
Done  c.pdf
Downloaded: ['a.pdf', 'b.pdf', 'c.pdf']
Start huge.zip
huge.zip took too long, cancelled
```

**Points to remember**

- Every download must share **one** semaphore, so it's stored on `self` and not created per call.
- Create the semaphore inside the running event loop (in `run()`). That's the safe place for asyncio objects.
- `wait_for(self.download(...), timeout=0.5)` cancels the slow download and raises `TimeoutError`.

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

**Real-life example:**

- 🏠 **Everyday:** A school notice board is shared by every class, but each student's notebook belongs only to that student.
- 💻 **In software:** Accidentally storing per-user data in a class attribute so one user's cart or session data leaks into another's.

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

**Real-life example:**

- 🏠 **Everyday:** Every vehicle at a toll plaza starts the same way with a key, whether it is a car or a bike.
- 💻 **In software:** Django class-based views inherit `get()` and `dispatch()` from a parent view without rewriting them.

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

**Real-life example:**

- 🏠 **Everyday:** You can tell the auto driver the address yourself or just show the saved location on your phone; both get you to the same place.
- 💻 **In software:** Building database settings from code in tests and from environment variables in Docker or production deployments.

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

**Real-life example:**

- 🏠 **Everyday:** When a teacher says 'show your notebook', each student shows their own notebook without being told whose it is.
- 💻 **In software:** Model methods like `user.get_full_name()` in Django, where Python passes the user object as `self` automatically.

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

**Real-life example:**

- 🏠 **Everyday:** Two Paytm wallets use the same app but each has its own number and balance.
- 💻 **In software:** Separate API client objects for a payment gateway and an email service, each with its own base URL and token.

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

**Real-life example:**

- 🏠 **Everyday:** A blank school admission form is printed once, and each parent fills in their own copy.
- 💻 **In software:** Django and Pydantic models act as the template, and each record or request body is one filled-in instance.

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

**Real-life example:**

- 🏠 **Everyday:** A train booking needs the destination, offers a default berth and class, and gives senior-citizen concession only if you tick it by name.
- 💻 **In software:** Library constructors like `httpx.Client(timeout=..., verify=...)` use defaults and keyword-only flags.

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

**Real-life example:**

- 🏠 **Everyday:** A hospital slip says both what went wrong and which department to visit.
- 💻 **In software:** FastAPI or DRF APIs raise `NotFoundError` with a 404 status code so the handler can return the right HTTP response.

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

**Real-life example:**

- 🏠 **Everyday:** Each customer at a supermarket gets their own trolley, and the bill adds price times quantity at the counter.
- 💻 **In software:** E-commerce carts that add items through an `add_item()` method so stock and price checks live in one place.

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

**Real-life example:**

- 🏠 **Everyday:** A courier gives you a receipt for each parcel, and you keep the receipts in your own file.
- 💻 **In software:** A service object returns confirmation messages and the calling view collects them in a list for the response.

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

**Real-life example:**

- 🏠 **Everyday:** Your bank passbook records every transaction made on your own account.
- 💻 **In software:** A notification or audit service that keeps a per-instance log of everything it sent.

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

**Real-life example:**

- 🏠 **Everyday:** A shop puts up a new 'Out of stock' sign using the same standard board as all its other notices.
- 💻 **In software:** Defining `class OrderNotFound(Exception): pass` in a service layer so callers can catch that one error by name.

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

**Real-life example:**

- 🏠 **Everyday:** A Flipkart order cannot be shipped before it is paid; the app only allows steps that make sense for the current status.
- 💻 **In software:** Order and payment state machines in backend services, where methods block invalid status changes.

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

**Real-life example:**

- 🏠 **Everyday:** GST is a fixed rule for everyone, each bill applies it to its own amount, and a bill can also be created from a scanned slip.
- 💻 **In software:** An `Order` model with a tax helper, a `total()` method and a `from_json()` constructor for API payloads.

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

**Real-life example:**

- 🏠 **Everyday:** When the head office changes the company address, every branch letterhead shows the new address.
- 💻 **In software:** Switching a client class from a staging URL to the production URL for all instances at once.

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

**Real-life example:**

- 🏠 **Everyday:** You can open a bank account at the branch or by uploading documents online; both give you the same account.
- 💻 **In software:** App settings loaded with `Settings.from_json()` locally and `Settings.from_env()` in Docker, like Pydantic `BaseSettings`.

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

**Real-life example:**

- 🏠 **Everyday:** Every payment counter must accept payment, but cash, card and UPI each do it their own way.
- 💻 **In software:** A payment gateway layer where `CardPayment` and `UpiPayment` must each implement `pay()`, or `NotImplementedError` reminds you.

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

**Real-life example:**

- 🏠 **Everyday:** A new employee fills a short form and HR copies the details into the company's standard record.
- 💻 **In software:** ORM models where a child calls `super().__init__(**fields)` so the base `save()` builds the INSERT query.

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

**Real-life example:**

- 🏠 **Everyday:** At an airport you pass security check, then baggage scan, then reach the gate, always in the same order.
- 💻 **In software:** Django views combining `LoginRequiredMixin` and logging mixins, where the MRO decides the order each step runs.

</details>

### Program 41

**Task:** Sort the list `["banana", "fig", "apple"]` from shortest word to longest, using a `lambda` as the `key` for `sorted()`.

**Using a class:** A `WordList` class holds the words, and its `shortest_first()` method sorts them with a `lambda` key.

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

**Real-life example:**

- 🏠 **Everyday:** Lining students up by height instead of by name, using the same list of students.
- 💻 **In software:** Sorting search results, file names or tags by length, date or score with `sorted(items, key=lambda x: ...)`.


**Same program using a class**

```python
class WordList:
    def __init__(self, words):
        self.words = words

    def shortest_first(self):
        return sorted(self.words, key=lambda word: len(word))


fruits = WordList(["banana", "fig", "apple"])
print(fruits.shortest_first())
print(fruits.words)          # the original list is unchanged
```

**Output:**

```text
['fig', 'apple', 'banana']
['banana', 'fig', 'apple']
```

**Points to remember**

- `sorted()` returns a **new** list, so `self.words` stays unchanged.
- The lambda gets one word at a time, and `len(word)` is the value used for sorting.

</details>

### Program 42

**Task:** Given a list of user dicts (`name`, `age`, `active`), keep only the active users with `filter()` and a lambda, then sort them by age, oldest first, and print their names. Then find the oldest user overall with `max()` and `itemgetter("age")`, and print the name.

**Using a class:** A `UserStore` class holds the list of users. The filtering and sorting move into `active_by_age()`, and the `max()` logic moves into `oldest()`.

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

**Real-life example:**

- 🏠 **Everyday:** From the class register, pick only students present today, line them up oldest first, and find the eldest.
- 💻 **In software:** Filtering active users from an API response and sorting them before sending the data to the frontend.


**Same program using a class**

```python
from operator import itemgetter


class UserStore:
    def __init__(self, users):
        self.users = users

    def active_by_age(self):
        active = filter(lambda u: u["active"], self.users)
        by_age = sorted(active, key=lambda u: u["age"], reverse=True)
        return [u["name"] for u in by_age]

    def oldest(self):
        return max(self.users, key=itemgetter("age"))["name"]   # same as key=lambda u: u["age"]


store = UserStore([
    {"name": "Asha", "age": 30, "active": True},
    {"name": "Ravi", "age": 25, "active": False},
    {"name": "Meera", "age": 35, "active": True},
])

print(store.active_by_age())     # ['Meera', 'Asha']
print(store.oldest())            # Meera
```

**Output:**

```text
['Meera', 'Asha']
Meera
```

**Points to remember**

- The data lives on `self.users`, so every method works on the same list.
- `filter()` gives back an iterator, and `sorted()` can take it directly. There's no need for `list()` first.
- `itemgetter("age")` does the same as `lambda u: u["age"]`, and it's slightly faster.

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
