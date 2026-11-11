# OOP Programs

Write each program from memory first, then click **Answer** to check it. Every answer uses the exact code from Part E of `python-topicquiz.md`, and the **Fact** explains which question the program proves.

> Open the preview (Ctrl+Shift+V) so the arrows work.

## Program 1

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

## Program 2

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

## Program 3

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

## Program 4

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

## Program 5

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

## Program 6

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

## Program 7

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

## Program 8

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

## Program 9

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

## Program 10

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

## Program 11

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

**Fact (why this program):** Look at the method's parameters. Python supplies `self` automatically, so `get_length()` gets nothing and `area()` gets only `width`.

</details>

## Program 12

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

## Program 13

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

## Program 14

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

## Program 15

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

## Program 16

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

## Program 17

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

## Program 18

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

## Program 19

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

## Program 20

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

## Program 21

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

## Program 22

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

## Program 23

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

## Program 24

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
