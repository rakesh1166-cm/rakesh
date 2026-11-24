# Python Real-Life Examples

One real-life example for every program in [programming.md](programming.md), grouped by topic. Each entry has an everyday comparison (🏠) and a place where developers meet the idea in real code (💻). Use this file as the source for a cheat sheet.

## Topics

- [Single class with methods](#single-class-with-methods)
- [Single class: default arguments](#single-class-default-arguments)
- [Instance method, static method and class method](#instance-method-static-method-and-class-method)
- [Inheritance](#inheritance)
- [Multiple inheritance and MRO](#multiple-inheritance-and-mro)
- [Functions](#functions)
- [Dunder (magic) methods](#dunder-magic-methods)
- [Decorators](#decorators)
- [Generators](#generators)
- [Exceptions](#exceptions)
- [Context managers](#context-managers)
- [Asyncio](#asyncio)
- [More programs](#more-programs)

## Single class with methods

### Program 1: self and object methods

- 🏠 **Everyday:** Every student is asked the same question, 'What is your roll number?', but each one gives their own answer.
- 💻 **In software:** In a Django model, `order.get_total()` runs the same code but returns a different total for each order row.

| Concept | Real life |
|---|---|
| `class Car` | The common question every student is asked |
| `object (red car, blue car)` | Each individual student |
| `self` | The student who is answering right now |
| `show()` | Asking 'What is your roll number?' |
| `return self.color` | Each student gives their own answer |

### Program 2: Method parameters and self

- 🏠 **Everyday:** A tailor already has your cloth length noted, so they only ask for the width to work out the area.
- 💻 **In software:** In an API client, `client.get(path)` takes only the path because the base URL is already stored on `self`.

| Concept | Real life |
|---|---|
| `self.length` | Cloth length the tailor already noted |
| `get_length() with no arguments` | Tailor reads the length from notes, asks nothing |
| `area(width) parameter` | Tailor asks you only for the width |
| `return length * width` | Tailor works out the area |

### Program 3: Object identity with is

- 🏠 **Everyday:** 'Rahul' at home and 'Roll No. 12' at school are two names for the same boy.
- 💻 **In software:** Caching and ORM code use `obj is other` to check whether two variables point to the very same loaded record.

| Concept | Real life |
|---|---|
| `first and second variables` | The names 'Rahul' and 'Roll No. 12' |
| `one Student object` | The one real boy |
| `is / same_as()` | Checking both names mean the same boy |
| `True result` | Yes, it is the same boy |

### Program 4: Shared class-level list

- 🏠 **Everyday:** A class notice board is shared by everyone, but each student's notebook belongs only to them.
- 💻 **In software:** A list in the class body of a Flask service leaks one user's data into another user's request; create it in `__init__` instead.

| Concept | Real life |
|---|---|
| `class-level list members` | The class notice board everyone shares |
| `self.tasks in __init__` | Each student's own notebook |
| `a.members.append()` | Pinning a notice everyone sees |
| `a.tasks.append()` | Writing in your notebook only |

### Program 5: Object state and history

- 🏠 **Everyday:** A bank passbook records every deposit and withdrawal and always shows the latest balance.
- 💻 **In software:** A wallet or payment service keeps the balance and a transaction log on the account object and changes them only through methods.

| Concept | Real life |
|---|---|
| `class BankAccount` | The bank passbook |
| `deposit() / withdraw()` | Each deposit and withdrawal entry |
| `self.history list` | Every transaction recorded in the passbook |
| `self.balance` | The latest balance shown |

## Single class: default arguments

### Program 6: Required and default arguments

- 🏠 **Everyday:** A school admission form needs your name and age, but the city field is already filled in as 'Delhi'.
- 💻 **In software:** A Pydantic model in FastAPI makes some request fields required and gives others a default value.

| Concept | Real life |
|---|---|
| `class Student` | The school admission form |
| `required name, age` | Fields you must fill in |
| `default city='Delhi'` | City field already filled as 'Delhi' |
| `Student('Asha', 15, 'Mumbai')` | Overwriting the pre-filled city |

### Program 56: Mutable default argument

- 🏠 **Everyday:** If every new student gets the same shared answer sheet, one student's answers show up on everyone's sheet.
- 💻 **In software:** A `tags=[]` default in a ticket model makes all tickets share one tag list, which is a classic production bug.

| Concept | Real life |
|---|---|
| `tags=[] default` | One shared answer sheet for all students |
| `list made once at def time` | Sheet printed once and handed to everyone |
| `append to tags` | One student writes an answer |
| `bug: tags appear in every object` | Answers show up on everyone's sheet |
| `tags=None, then new list` | Give each student a fresh sheet |

### Program 57: Keyword arguments skip defaults

- 🏠 **Everyday:** On Swiggy you change only the spice level and leave every other option at its default.
- 💻 **In software:** `send_notification(user, msg, retries=5)` changes the retries and leaves the default channel as it is.

| Concept | Real life |
|---|---|
| `function with defaults` | Swiggy order with default options |
| `keyword argument retries=5` | Changing only the spice level |
| `skipped channel default` | Leaving the other options as they are |
| `__defaults__` | The list of standard options |

### Program 58: Class-level defaults, child override

- 🏠 **Everyday:** A restaurant chain has standard menu prices, and one branch changes only the price of tea.
- 💻 **In software:** A database connector stores `DEFAULT_PORT` on the class, and its MySQL subclass overrides only the port.

| Concept | Real life |
|---|---|
| `class DbConnection` | The restaurant chain |
| `class attribute DEFAULT_PORT` | Standard menu price |
| `child MySqlConnection` | One branch of the chain |
| `child overrides DEFAULT_PORT` | Branch changes only the tea price |
| `value is not None check` | Keep the branch price even if it is 0 |

### Program 13: Default value per object

- 🏠 **Everyday:** A coffee shop gives you a medium cup unless you ask for a large one.
- 💻 **In software:** `requests.get(url, timeout=10)` uses the default timeout unless a call passes its own value.

| Concept | Real life |
|---|---|
| `class Coffee` | The coffee shop order |
| `default size='medium'` | Medium cup unless you ask |
| `Coffee('Mocha', 'large')` | Asking for a large cup |
| `each object's own size` | Each customer's own cup |

## Instance method, static method and class method

### Program 17: Instance, class, static methods

- 🏠 **Everyday:** In a pizza shop, 'make my pizza' needs your order, 'change the menu units' affects the whole shop, and 'convert inches to cm' needs neither.
- 💻 **In software:** Django models use instance methods for one row, class methods for the whole table, and static methods for helper checks.

| Concept | Real life |
|---|---|
| `instance method` | 'Make my pizza' needs your order |
| `self` | Your own order |
| `class method` | 'Change the menu units' for the whole shop |
| `cls.size_unit` | The shop-wide menu unit |
| `static method` | 'Convert inches to cm' needs neither |

### Program 18: Classmethod changes shared data

- 🏠 **Everyday:** When the school changes its name, every student's ID card shows the new name.
- 💻 **In software:** A class method updates a shared setting such as `Config.environment`, and every object sees the change.

| Concept | Real life |
|---|---|
| `class attribute school` | The school name printed on ID cards |
| `@classmethod rename_school()` | The school changing its name |
| `cls.school = name` | Updating the name once for everyone |
| `every student object` | Every student's ID card shows the new name |

### Program 59: Static method as validator

- 🏠 **Everyday:** The railway booking form checks your mobile number before any ticket is booked.
- 💻 **In software:** `User.is_valid_email()` checks a signup form before the user object or database row is created.

| Concept | Real life |
|---|---|
| `@staticmethod is_valid_email()` | The mobile number check on the form |
| `called in __init__` | Checked before any ticket is booked |
| `no self or cls` | The check needs no ticket or train data |
| `raise ValueError` | Booking rejected for a bad number |

### Program 19: Classmethod alternative constructor

- 🏠 **Everyday:** You can open a bank account by filling in a form or by uploading your Aadhaar, and either way you get an account.
- 💻 **In software:** `User.from_dict(json_data)` builds an object from an API response, and `Admin.from_dict` returns an `Admin`.

| Concept | Real life |
|---|---|
| `__init__(name)` | Filling in the account form |
| `@classmethod from_dict()` | Uploading your Aadhaar instead |
| `cls(...)` | The bank creating the account |
| `subclass Admin.from_dict()` | Same option works at any branch |
| `object returned` | Either way you get an account |

### Program 60: Factory classmethod with counter

- 🏠 **Everyday:** A shop reads labels like 'Rs. 1199' from a supplier list and counts how many items it added.
- 💻 **In software:** Import scripts use `Product.from_csv(line)` to load catalogue rows, with a static helper that reads the price.

| Concept | Real life |
|---|---|
| `CSV line` | Supplier list label like 'Rs. 1199' |
| `@staticmethod parse_price()` | Reading the price from the label |
| `@classmethod from_csv()` | Adding the item to the shop |
| `cls.count += 1` | Counting how many items were added |

## Inheritance

### Program 7: Basic inheritance

- 🏠 **Everyday:** A child inherits the family surname and also has a hobby of their own.
- 💻 **In software:** `CustomUser(AbstractUser)` in Django reuses the parent's login methods and adds new fields.

| Concept | Real life |
|---|---|
| `class Animal` | The family |
| `eat() in parent` | The family surname |
| `class Dog(Animal)` | The child |
| `dog.eat()` | Child uses the inherited surname |
| `bark() in child` | The child's own hobby |

### Program 8: Child without __init__

- 🏠 **Everyday:** A new bank branch uses the head office account-opening form as it is.
- 💻 **In software:** A Django class-based view subclass with no `__init__` uses the parent's setup.

| Concept | Real life |
|---|---|
| `class Vehicle with __init__` | Head office account-opening form |
| `class Car(Vehicle) without __init__` | New branch with no form of its own |
| `Car('Tata')` | Branch uses the head office form as it is |
| `inherited self.brand` | Account details filled by head office form |

### Program 9: Child __init__ with default

- 🏠 **Everyday:** A truck rental gives you a 10-ton truck unless you ask for a bigger one.
- 💻 **In software:** A `PremiumPlan(Plan)` subclass adds a `storage='100GB'` default and still stores the parent's fields.

| Concept | Real life |
|---|---|
| `class Vehicle` | The basic rental vehicle |
| `class Truck(Vehicle)` | The truck rental |
| `load='10 tons' default` | 10-ton truck unless you ask |
| `super().__init__(brand)` | Truck still gets the basic vehicle details |
| `Truck('Tata', '20 tons')` | Asking for a bigger truck |

### Program 16: Many ways to call methods

- 🏠 **Everyday:** You can call a friend by dialling their number, from your contacts, from recent calls, or by asking someone else to call them.
- 💻 **In software:** Frameworks call your methods by name with `getattr`, plugin systems store them in variables, and subclasses reach them with `super()`.

| Concept | Real life |
|---|---|
| `hello() method` | Your friend |
| `self.hello()` | Dialling the number yourself |
| `Greeter.hello(self)` | Calling from your contacts |
| `super().hello()` | Asking someone else to call them |
| `twice() calls through self` | Calling from recent calls |

### Program 10: Forwarding with *args, **kwargs

- 🏠 **Everyday:** A courier hub adds its own tracking sticker and passes the rest of the parcel on unchanged.
- 💻 **In software:** A custom Django form or DRF serializer takes its own argument and forwards `*args, **kwargs` to the parent.

| Concept | Real life |
|---|---|
| `child __init__(*args, **kwargs)` | Courier hub receiving the parcel |
| `self.battery added` | Hub adds its own tracking sticker |
| `super().__init__(*args, **kwargs)` | Passing the rest of the parcel on |
| `parent gets brand, color unchanged` | Parcel contents reach the next hub as-is |

### Program 21: All uses of super()

- 🏠 **Everyday:** A junior manager follows the senior manager's rules, reuses their templates, and adds a few steps of their own.
- 💻 **In software:** Overriding `save()` in a Django model and calling `super().save()` keeps the parent's behaviour and adds new behaviour.

| Concept | Real life |
|---|---|
| `class Parent` | The senior manager |
| `class Child(Parent)` | The junior manager |
| `super().__init__()` | Following the senior manager's rules |
| `super().show() / create()` | Reusing the senior's templates |
| `extra code in child method` | Adding a few steps of their own |

### Program 11: super().__init__ in child

- 🏠 **Everyday:** At a hotel, reception records your name and room service adds the number of guests.
- 💻 **In software:** A custom exception calls `super().__init__(message)` and stores its own extra fields, such as `status_code`.

| Concept | Real life |
|---|---|
| `class Vehicle __init__` | Reception records your name |
| `class Car(Vehicle)` | Room service |
| `super().__init__(brand)` | Room service asks reception for your name |
| `self.seats` | Room service adds the number of guests |

## Multiple inheritance and MRO

### Program 61: Simple multiple inheritance

- 🏠 **Everyday:** A duck can fly like a bird and swim like a fish, so it has both skills.
- 💻 **In software:** `AdminUser(Auditable, Permissioned)` gets features from two parent classes at once.

| Concept | Real life |
|---|---|
| `class Flyer` | Flying like a bird |
| `class Swimmer` | Swimming like a fish |
| `class Duck(Flyer, Swimmer)` | The duck |
| `duck.fly() and duck.swim()` | The duck uses both skills |
| `Duck.__mro__` | Order the duck checks its skills |

### Program 22: Mixin adds one feature

- 🏠 **Everyday:** A 'gift wrap' option can be added to any product in an online shop.
- 💻 **In software:** Django's `LoginRequiredMixin` adds a login check to many unrelated views.

| Concept | Real life |
|---|---|
| `class LogMixin` | The 'gift wrap' option |
| `Model and Report` | Any product in the shop |
| `class LoggedModel(LogMixin, Model)` | Product with gift wrap added |
| `super().save() after 'log, '` | Wrapping first, then the normal delivery |

### Program 62: Cooperative super() with kwargs

- 🏠 **Everyday:** In a relay race, each runner runs their own leg and passes the baton to the next runner in order.
- 💻 **In software:** Django and DRF mixins each take their own keyword arguments and call `super().__init__(**kwargs)`, so the whole chain runs.

| Concept | Real life |
|---|---|
| `each class's __init__` | Each runner's leg of the race |
| `**kwargs` | The baton with all remaining fields |
| `super().__init__(**kwargs)` | Passing the baton to the next runner |
| `MRO` | The fixed running order |
| `Base rejects unknown fields` | Last runner checks nothing extra is left |

### Program 23: Diamond problem and MRO

- 🏠 **Everyday:** Two departments report to the same CEO, but the CEO receives the meeting invite only once.
- 💻 **In software:** With multiple inheritance, the MRO makes sure a shared base class setup, such as opening a DB connection, runs only once.

| Concept | Real life |
|---|---|
| `class A` | The CEO |
| `B(A) and C(A)` | The two departments |
| `class D(B, C)` | A meeting both departments join |
| `MRO D, B, C, A` | CEO receives the invite only once |
| `super().show() chain` | The invite passed along in order |

### Program 63: Debugging mixin method clash

- 🏠 **Everyday:** Two signboards point in different directions, and you follow the one you see first.
- 💻 **In software:** A report class mixes in JSON and CSV export, and checking `__mro__` shows why the wrong `export()` ran.

| Concept | Real life |
|---|---|
| `two mixins with the same method` | Two signboards pointing different ways |
| `MRO order` | The order you see the signboards |
| `first class in the MRO wins` | You follow the one you see first |
| `__mro__ / __qualname__` | Checking which signboard you followed |
| `reorder bases or override` | Moving or replacing a signboard |

## Functions

### Program 43: Built-in, def and lambda functions

- 🏠 **Everyday:** A kitchen has ready appliances (built-in), your own family recipe (def), and a quick one-time pinch of salt you never name (lambda).
- 💻 **In software:** You call built-ins like len() everywhere, write def functions for business logic, and pass a lambda as a quick key to sort API results.

| Concept | Real life |
|---|---|
| `built-in (len, max)` | Ready appliances already in the kitchen |
| `def` | Your own named family recipe |
| `lambda` | A quick pinch of salt you never name |

### Program 86: Closure (function that remembers)

- 🏠 **Everyday:** A shop gives each cashier a stamp set to one discount, 10% or 20%. Every bill the cashier stamps uses that cashier's own discount.
- 💻 **In software:** Every decorator is a closure: `wrapper` remembers the `func` it wraps. Closures also build pre-set helpers such as `make_tax(0.18)`.

| Concept | Real life |
|---|---|
| `multiplier(number)` (outer function) | Shop sets up a stamp with a discount |
| `multiply(value)` (inner function) | The cashier stamping a bill |
| remembered `number` | The discount fixed on that stamp |
| `double = multiplier(2)` | Giving one cashier the 10% stamp |
| `double(5)` | Stamping a bill with that discount |

### Program 44: Sorting with a lambda key

- 🏠 **Everyday:** A teacher ranks students by marks to find the topper, without rewriting the register.
- 💻 **In software:** In ML projects you sort experiment results by accuracy and pick the best model with max() before saving it.

| Concept | Real life |
|---|---|
| `list of models` | The class register of students |
| `lambda key` | Look only at each student's marks |
| `sorted(reverse=True)` | Rank students from highest marks down |
| `max()` | Find the topper |
| `original list unchanged` | The register itself is not rewritten |

### Program 64: *args and **kwargs

- 🏠 **Everyday:** A Swiggy order has one restaurant, any number of dishes, and any number of notes like 'less spicy' or 'no onion'.
- 💻 **In software:** Logging helpers and wrapper functions accept *args/**kwargs so callers can pass any extra tags or fields, like logger.info(msg, extra={...}).

| Concept | Real life |
|---|---|
| `event` | The one restaurant you order from |
| `*tags` | Any number of dishes |
| `**details` | Any number of notes like 'less spicy' |

### Program 65: Default and keyword arguments

- 🏠 **Everyday:** A tea stall gives normal sugar by default, unless you clearly say 'sugar=less', and hands you tea, change and a bill together.
- 💻 **In software:** Library calls like requests.get(url, timeout=5) or train_test_split(test_size=0.2) use defaults and keyword arguments for optional settings.

| Concept | Real life |
|---|---|
| `pass_mark=40 (default)` | Normal sugar if you say nothing |
| `keyword argument` | Clearly saying 'sugar=less' |
| `return 3 values` | You get tea, change and a bill together |

### Program 66: Closures and function pipelines

- 🏠 **Everyday:** A factory line where each worker does one step (wash, cut, pack) on every item that passes.
- 💻 **In software:** Data-cleaning pipelines in pandas or scikit-learn chain small functions to clean text before training a model.

| Concept | Real life |
|---|---|
| `closure (make_replacer)` | A worker trained for one fixed step |
| `each step function` | Wash, cut or pack |
| `pipeline (run_pipeline)` | The factory line passing items along |
| `every item` | Each item goes through all workers |

## Dunder (magic) methods

### Program 67: __str__ for readable printing

- 🏠 **Everyday:** A book without a cover label is just 'a book'; a label tells you its title and author at a glance.
- 💻 **In software:** Django models define __str__ so the admin panel shows 'Order #101' instead of a memory address.

| Concept | Real life |
|---|---|
| `object without __str__` | A book with no cover label |
| `__str__` | The cover label with title and author |
| `print(book)` | Reading the label at a glance |

### Program 45: __str__, __len__ and __add__

- 🏠 **Everyday:** Two shopping baskets can be emptied into one bigger basket, and you can count items in each.
- 💻 **In software:** E-commerce code merges guest and logged-in carts with + and checks len(cart) before checkout.

| Concept | Real life |
|---|---|
| `Cart object` | A shopping basket |
| `__len__` | Counting items in a basket |
| `__add__` | Emptying two baskets into one bigger basket |
| `__str__` | A tag saying how many items are inside |

### Program 68: __eq__, __lt__ and __repr__

- 🏠 **Everyday:** On Amazon you sort phones by price, and two listings of the same phone at the same price are the same deal.
- 💻 **In software:** Product catalogues and priority queues define __lt__ so objects can be sorted, and __eq__ to find duplicates.

| Concept | Real life |
|---|---|
| `__lt__` | Sorting phones by price |
| `sorted() / min() / max()` | Cheapest and costliest phone in the list |
| `__eq__` | Two listings of the same phone, same price, same deal |
| `is` | Checking if it is the very same listing |
| `__repr__` | The short listing title you see |

### Program 69: __add__ and __radd__ for Money

- 🏠 **Everyday:** You can add ₹100 and ₹50, but you can't directly add ₹100 and $50 without converting.
- 💻 **In software:** Payment and billing systems use a Money class so totals with sum() never mix currencies by mistake.

| Concept | Real life |
|---|---|
| `Money object` | A ₹100 note |
| `__add__` | Adding ₹100 and ₹50 |
| `ValueError on mismatch` | Can't add ₹100 and $50 directly |
| `__radd__ / sum()` | Adding up a whole wallet of notes |

### Program 70: Container protocol (__getitem__, __iter__)

- 🏠 **Everyday:** A Spotify playlist lets you count songs, pick song 1, play them in order, and check if a song is in it.
- 💻 **In software:** Custom collections like PyTorch Dataset implement __len__ and __getitem__ so DataLoader can index and loop over them.

| Concept | Real life |
|---|---|
| `__len__` | Counting songs in the playlist |
| `__getitem__` | Picking song 1 |
| `__iter__` | Playing songs in order |
| `__contains__ (in)` | Checking if a song is in the playlist |

## Decorators

### Program 46: Basic decorator

- 🏠 **Everyday:** A gift wrapper adds paper around the gift without changing the gift inside.
- 💻 **In software:** Flask/FastAPI route decorators like @app.get('/') wrap your function to add web routing around it.

| Concept | Real life |
|---|---|
| `original function` | The gift inside |
| `decorator` | The gift wrapper |
| `wrapper() before/after` | Paper around the gift |
| `@greet_decorator` | Wrapping without changing the gift |

### Program 47: Function vs class decorator

- 🏠 **Everyday:** A loudspeaker changes your voice every time you speak; a school badge is pinned to your uniform once.
- 💻 **In software:** @lru_cache wraps a function on every call, while @dataclass changes a class once when it is defined.

| Concept | Real life |
|---|---|
| `function decorator` | A loudspeaker |
| `runs on every call` | Changes your voice every time you speak |
| `class decorator` | A school badge |
| `runs once at definition` | Pinned to the uniform once |

### Program 71: Logging decorator with wraps

- 🏠 **Everyday:** A CCTV camera records who entered and what they carried, without stopping them.
- 💻 **In software:** Teams add a @log_call decorator to service functions for audit logs, and @wraps keeps names correct in tracebacks.

| Concept | Real life |
|---|---|
| `@log_call` | The CCTV camera at the door |
| `print name and args` | Records who entered and what they carried |
| `call original function` | The person is not stopped |
| `@wraps` | Camera keeps the person's real name on record |

### Program 72: login_required decorator

- 🏠 **Everyday:** A security guard checks your ID card before letting you into the office.
- 💻 **In software:** Django's @login_required and FastAPI auth dependencies block pages until the user is logged in.

| Concept | Real life |
|---|---|
| `@login_required` | The security guard at the door |
| `check user logged in` | Checking your ID card |
| `call the function` | Letting you into the office |
| `return 'Error: please log in'` | No ID card, so you are not let in |

### Program 73: Decorator with arguments (retry)

- 🏠 **Everyday:** If a UPI payment fails, you try again a few times before giving up.
- 💻 **In software:** API clients use @retry(times=3), like the tenacity library, to handle flaky network calls.

| Concept | Real life |
|---|---|
| `retry(times=3)` | Decide to try the UPI payment 3 times |
| `ConnectionError` | Payment fails |
| `loop and call again` | Try again |
| `give up after times` | Stop after the last attempt |

## Generators

### Program 48: Generator with yield

- 🏠 **Everyday:** A token machine at a bank gives the next token number only when someone presses the button.
- 💻 **In software:** Generators produce IDs, pages of results, or rows one at a time instead of building the full list.

| Concept | Real life |
|---|---|
| `generator function` | The bank token machine |
| `yield` | Gives the next token number |
| `next()` | Pressing the button |
| `list(new generator)` | Printing every token number left in one go |

### Program 49: Generator vs list memory

- 🏠 **Everyday:** Filling a water tank holds all the water at once; a tap gives water only as you use it.
- 💻 **In software:** Reading a 10 GB CSV row by row with a generator avoids loading it all into RAM.

| Concept | Real life |
|---|---|
| `list` | A water tank holding all the water at once |
| `generator` | A tap giving water as you use it |
| `memory size` | How much space the water takes |
| `generator used up` | Tap water once used can't be used again |

### Program 50: return vs yield

- 🏠 **Everyday:** A courier delivers the whole parcel at once (return), while a newspaper arrives one day at a time (yield).
- 💻 **In software:** An API returns a full JSON list for small data, but streams large responses chunk by chunk with yield.

| Concept | Real life |
|---|---|
| `return` | Courier delivers the whole parcel at once |
| `yield` | Newspaper arrives one day at a time |
| `list(generator)` | Collecting all the newspapers in a pile |

### Program 74: Lazy log filtering

- 🏠 **Everyday:** A teacher flips through answer sheets and only pulls out the ones that failed.
- 💻 **In software:** Ops scripts scan huge server logs lazily and yield only ERROR lines for alerts.

| Concept | Real life |
|---|---|
| `log lines` | The pile of answer sheets |
| `for line in lines` | Flipping through each sheet |
| `if 'ERROR' in line` | Checking if the student failed |
| `yield line` | Pulling out only the failed sheets |

### Program 75: Batching generator pipeline

- 🏠 **Everyday:** A school bus takes students in groups of 40, not all 500 at once.
- 💻 **In software:** Data jobs send records to an API or database in batches of N, and ML training loads data in mini-batches.

| Concept | Real life |
|---|---|
| `read_records()` | All 500 students waiting |
| `in_batches(size)` | Groups of 40 per trip |
| `send_to_api()` | The bus taking each group |
| `generator pipeline` | Next group boards only when the bus returns |

## Exceptions

### Program 51: try, except, else, finally

- 🏠 **Everyday:** At an ATM you try to withdraw; if it fails you see an error, if it works you get cash, and the card always comes back out.
- 💻 **In software:** Database code uses try/except/finally so the connection is always closed, even when a query fails.

| Concept | Real life |
|---|---|
| `try` | You try to withdraw money |
| `except` | Machine shows an error |
| `else` | Cash comes out |
| `finally` | Card always comes back |

### Program 52: Custom exception class

- 🏠 **Everyday:** A UPI app shows 'Insufficient balance' instead of a vague 'Something went wrong'.
- 💻 **In software:** Banking and wallet services raise InsufficientBalanceError so the API can return a clear message and status code.

| Concept | Real life |
|---|---|
| `Exception (built-in)` | Vague 'Something went wrong' |
| `InsufficientBalanceError` | Clear 'Insufficient balance' message |
| `raise` | The app stops the payment |
| `except InsufficientBalanceError` | The app shows that exact message |

### Program 76: Multiple except blocks

- 🏠 **Everyday:** A shop clerk handles a torn note one way and a missing coupon another way.
- 💻 **In software:** Form and API handlers catch ValueError for bad input and KeyError for missing fields, each with its own reply.

| Concept | Real life |
|---|---|
| `try` | The clerk takes your payment |
| `except ValueError → 0.0` | Torn note, so the clerk can't charge it |
| `except KeyError → full price` | No coupon, so you pay the full price |
| `two except blocks` | Each problem handled its own way |

### Program 87: All common built-in error types

- 🏠 **Everyday:** A shop billing counter checks each order. A wrong price, a missing coupon, an item that isn't in the bag, a missing receipt: each problem gets its own label, but the cashier keeps billing the next customer.
- 💻 **In software:** In a FastAPI or Django view, you validate a request body and turn each kind of error into a clear message (for example a 400 Bad Request with "price must be a number") instead of letting the server crash.

| Concept | Real life |
|---|---|
| `ValueError` | Price written as "five hundred" instead of 500 |
| `KeyError` / `IndexError` | Coupon not on the bill / 6th item in a 2-item bag |
| `ZeroDivisionError` | Splitting the bill among zero customers |
| `FileNotFoundError` | The receipt file isn't there |
| `except (...)` + `else` | Note the problem and keep billing; print the bill if all is fine |

### Program 53: Exception chaining with from

- 🏠 **Everyday:** A doctor says 'fever' and also notes the real cause, 'infection', on the report.
- 💻 **In software:** Services wrap low-level errors like ValueError in a domain error with raise ... from err, so logs keep the root cause.

| Concept | Real life |
|---|---|
| `ValueError (original)` | The real cause: infection |
| `InvalidAgeError` | The doctor says 'fever' |
| `raise ... from error` | Writing both on the report |
| `__cause__` | Reading the cause on the report |

### Program 77: Exception hierarchy

- 🏠 **Everyday:** 'Payment failed' can be card declined or low balance, but the shop handles all of them at one counter.
- 💻 **In software:** Payment gateways define PaymentError with child errors, so one except PaymentError block handles every payment problem.

| Concept | Real life |
|---|---|
| `PaymentError (base)` | 'Payment failed' |
| `CardDeclined` | Card declined |
| `InsufficientFunds` | Low balance |
| `except PaymentError` | One counter handles all of them |
| `finally` | Receipt log written every time |

## Context managers

### Program 54: __enter__ and __exit__ cleanup

- 🏠 **Everyday:** A motion-sensor light in a corridor switches on when you walk in and switches off when you leave, even if you leave in a hurry.
- 💻 **In software:** Database connections, locks and network sockets use `with` so they are always released, even when a request crashes.

| Concept | Real life |
|---|---|
| `with` | Walking into the corridor |
| `__enter__` | Light switches on when you enter |
| `__exit__` | Light switches off when you leave |
| `error inside with` | You leave in a hurry, light still goes off |

### Program 78: with open() auto-closes files

- 🏠 **Everyday:** A library book drop box takes the book back automatically, so you never forget to return it.
- 💻 **In software:** Reading CSV uploads or writing log and report files in Django or FastAPI apps with `with open()` so file handles never leak.

| Concept | Real life |
|---|---|
| `with open()` | Using the book drop box |
| `file.write() / read()` | Reading the book while you have it |
| `automatic close` | Box takes the book back, no need to remember |

### Program 79: @contextmanager generator manager

- 🏠 **Everyday:** A shop shutter: open it before work (setup), do business, and pull it down at closing (cleanup), whatever happened during the day.
- 💻 **In software:** Writing quick helpers like `with timer():` or `with temp_directory():` in test suites and scripts without a full class.

| Concept | Real life |
|---|---|
| `@contextmanager` | The shop shutter routine |
| `code before yield` | Opening the shutter before work |
| `yield` | Doing business during the day |
| `finally after yield` | Pulling the shutter down at closing, whatever happened |

### Program 80: Commit or rollback transaction

- 🏠 **Everyday:** A UPI payment either completes fully or the money comes back to your account; it never stays half-sent.
- 💻 **In software:** SQLAlchemy sessions and Django's `transaction.atomic()` save all rows on success and roll everything back on an error.

| Concept | Real life |
|---|---|
| `__enter__` | Starting the UPI payment |
| `commit` | Payment completes fully |
| `rollback` | Money comes back to your account |
| `__exit__ checks the error` | Never left half-sent |

### Program 81: Temporary setting, suppress chosen error

- 🏠 **Everyday:** Putting your phone on silent for a meeting and switching the ringer back on afterwards, even if the meeting ends early.
- 💻 **In software:** Overriding settings in tests (`override_settings`, `mock.patch`) and ignoring an expected error with `contextlib.suppress`.

| Concept | Real life |
|---|---|
| `__enter__ saves old value` | Noting the ringer was on |
| `change the setting` | Putting the phone on silent |
| `__exit__ restores` | Switching the ringer back on afterwards |
| `return True` | Meeting ends early, still handled quietly |

## Asyncio

### Program 82: Coroutine needs await to run

- 🏠 **Everyday:** Booking a cab only creates the request; nothing moves until a driver actually starts the trip.
- 💻 **In software:** Forgetting `await` in a FastAPI endpoint returns a coroutine object instead of data and gives the 'coroutine was never awaited' warning.

| Concept | Real life |
|---|---|
| `async def` | Booking a cab |
| `calling without await` | Only creates the request, nothing moves |
| `await / asyncio.run()` | Driver actually starts the trip |

### Program 55: Run tasks together with gather

- 🏠 **Everyday:** Putting the kettle on and the bread in the toaster at the same time, so breakfast is ready in one wait instead of two.
- 💻 **In software:** An async endpoint that loads a user's profile and notifications together instead of one after the other.

| Concept | Real life |
|---|---|
| `async def` | Kettle job and toaster job |
| `await asyncio.sleep()` | Waiting for water to boil |
| `asyncio.gather()` | Kettle and toaster running at the same time |
| `total time` | One wait instead of two |

### Program 83: gather time equals slowest call

- 🏠 **Everyday:** Three friends order from Swiggy, Zomato and a dhaba at once; dinner starts when the slowest order arrives, not after adding all delivery times.
- 💻 **In software:** A dashboard API calling users, orders and payments services in parallel with `aiohttp`, so the response is as fast as the slowest service.

| Concept | Real life |
|---|---|
| `fetch() coroutine` | One food order |
| `asyncio.gather()` | Three friends ordering at once |
| `sleep times` | Each app's delivery time |
| `total time = slowest` | Dinner starts when the slowest order arrives |

### Program 84: Background task with create_task

- 🏠 **Everyday:** You start the washing machine and cook dinner while it runs, checking on it only at the end.
- 💻 **In software:** Sending a welcome email or push notification in the background while the signup request carries on.

| Concept | Real life |
|---|---|
| `asyncio.create_task()` | Starting the washing machine |
| `other code keeps running` | Cooking dinner while it runs |
| `await task` | Checking on the machine at the end |

### Program 85: Semaphore limit and wait_for timeout

- 🏠 **Everyday:** A bank has only two counters open, so customers wait for a free counter, and anyone taking too long is asked to come back later.
- 💻 **In software:** Limiting concurrent scraping or API calls to avoid rate limits, and timing out a slow third-party payment API.

| Concept | Real life |
|---|---|
| `asyncio.Semaphore(2)` | Only two bank counters open |
| `async with semaphore` | Customer goes to a free counter |
| `waiting tasks` | Other customers waiting in line |
| `asyncio.wait_for() timeout` | Taking too long, asked to come back later |

## More programs

### Program 14: Class list vs instance list

- 🏠 **Everyday:** A school notice board is shared by every class, but each student's notebook belongs only to that student.
- 💻 **In software:** Accidentally storing per-user data in a class attribute so one user's cart or session data leaks into another's.

| Concept | Real life |
|---|---|
| `class attribute list` | School notice board shared by every class |
| `instance list in __init__` | Each student's own notebook |
| `a.members.append()` | Pinning a notice everyone sees |

### Program 20: Inherited method on subclasses

- 🏠 **Everyday:** Every vehicle at a toll plaza starts the same way with a key, whether it is a car or a bike.
- 💻 **In software:** Django class-based views inherit `get()` and `dispatch()` from a parent view without rewriting them.

| Concept | Real life |
|---|---|
| `Vehicle.start()` | Starting with a key at the toll plaza |
| `Car / Bike subclasses` | Car or bike at the toll |
| `inherited method` | Both start the same way |

### Program 24: Config from inputs or env

- 🏠 **Everyday:** You can tell the auto driver the address yourself or just show the saved location on your phone; both get you to the same place.
- 💻 **In software:** Building database settings from code in tests and from environment variables in Docker or production deployments.

| Concept | Real life |
|---|---|
| `direct inputs` | Telling the auto driver the address yourself |
| `environment dict` | Showing the saved location on your phone |
| `same config object` | Both get you to the same place |

### Program 25: Method call passes self

- 🏠 **Everyday:** When a teacher says 'show your notebook', each student shows their own notebook without being told whose it is.
- 💻 **In software:** Model methods like `user.get_full_name()` in Django, where Python passes the user object as `self` automatically.

| Concept | Real life |
|---|---|
| `method call user.full_name()` | Teacher says 'show your notebook' |
| `self` | Each student shows their own notebook |
| `Python passes self` | Nobody is told whose notebook it is |

### Program 26: Same class, different settings

- 🏠 **Everyday:** Two Paytm wallets use the same app but each has its own number and balance.
- 💻 **In software:** Separate API client objects for a payment gateway and an email service, each with its own base URL and token.

| Concept | Real life |
|---|---|
| `one ApiClient class` | Same Paytm app |
| `separate objects` | Two different wallets |
| `instance attributes` | Each wallet's own number and balance |

### Program 27: Class as form template

- 🏠 **Everyday:** A blank school admission form is printed once, and each parent fills in their own copy.
- 💻 **In software:** Django and Pydantic models act as the template, and each record or request body is one filled-in instance.

| Concept | Real life |
|---|---|
| `class` | Blank admission form printed once |
| `object` | Each parent's filled copy |
| `update() / export()` | Changing and submitting your own copy |

### Program 28: Required, default, keyword-only args

- 🏠 **Everyday:** A train booking needs the destination, offers a default berth and class, and gives senior-citizen concession only if you tick it by name.
- 💻 **In software:** Library constructors like `httpx.Client(timeout=..., verify=...)` use defaults and keyword-only flags.

| Concept | Real life |
|---|---|
| `required argument` | Destination you must give |
| `default argument` | Default berth and class offered |
| `keyword-only argument (*)` | Senior-citizen concession, ticked by name |

### Program 29: Exception hierarchy with status codes

- 🏠 **Everyday:** A hospital slip says both what went wrong and which department to visit.
- 💻 **In software:** FastAPI or DRF APIs raise `NotFoundError` with a 404 status code so the handler can return the right HTTP response.

| Concept | Real life |
|---|---|
| `custom exception class` | The hospital slip |
| `message` | What went wrong |
| `status_code` | Which department to visit |
| `super().__init__()` | Slip printed on the standard hospital format |

### Program 30: Instance list via methods

- 🏠 **Everyday:** Each customer at a supermarket gets their own trolley, and the bill adds price times quantity at the counter.
- 💻 **In software:** E-commerce carts that add items through an `add_item()` method so stock and price checks live in one place.

| Concept | Real life |
|---|---|
| `ShoppingCart object` | Each customer's trolley |
| `items list in __init__` | Trolley belongs to one customer only |
| `add_item()` | Putting things in the trolley |
| `total = price * qty` | Bill adds price times quantity |

### Program 31: Collect results outside the object

- 🏠 **Everyday:** A courier gives you a receipt for each parcel, and you keep the receipts in your own file.
- 💻 **In software:** A service object returns confirmation messages and the calling view collects them in a list for the response.

| Concept | Real life |
|---|---|
| `send_confirmation()` | Courier giving a receipt |
| `return value` | The receipt for each parcel |
| `outside list` | Your own file of receipts |

### Program 32: Object keeps its own history

- 🏠 **Everyday:** Your bank passbook records every transaction made on your own account.
- 💻 **In software:** A notification or audit service that keeps a per-instance log of everything it sent.

| Concept | Real life |
|---|---|
| `confirmations list in __init__` | Your own bank passbook |
| `append in method` | Recording every transaction |
| `separate object` | Only your account's entries |

### Program 33: Custom exception with pass

- 🏠 **Everyday:** A shop puts up a new 'Out of stock' sign using the same standard board as all its other notices.
- 💻 **In software:** Defining `class OrderNotFound(Exception): pass` in a service layer so callers can catch that one error by name.

| Concept | Real life |
|---|---|
| `class OrderNotFound(Exception)` | A new 'Out of stock' sign |
| `pass` | Nothing extra written on the board |
| `inherits Exception` | Same standard board as other notices |

### Program 34: State changes only through methods

- 🏠 **Everyday:** A Flipkart order cannot be shipped before it is paid; the app only allows steps that make sense for the current status.
- 💻 **In software:** Order and payment state machines in backend services, where methods block invalid status changes.

| Concept | Real life |
|---|---|
| `status attribute` | Current order status on Flipkart |
| `pay()` | Paying for the order |
| `ship() check` | Cannot ship before it is paid |
| `raise on wrong step` | App blocks steps that make no sense |

### Program 35: Static, instance and class methods together

- 🏠 **Everyday:** GST is a fixed rule for everyone, each bill applies it to its own amount, and a bill can also be created from a scanned slip.
- 💻 **In software:** An `Order` model with a tax helper, a `total()` method and a `from_json()` constructor for API payloads.

| Concept | Real life |
|---|---|
| `staticmethod` | GST is a fixed rule for everyone |
| `instance method` | Each bill applies GST to its own amount |
| `classmethod` | Creating a bill from a scanned slip |

### Program 36: Class method changes shared setting

- 🏠 **Everyday:** When the head office changes the company address, every branch letterhead shows the new address.
- 💻 **In software:** Switching a client class from a staging URL to the production URL for all instances at once.

| Concept | Real life |
|---|---|
| `class attribute` | Company address on head office records |
| `classmethod changes it` | Head office changes the address |
| `all objects see it` | Every branch letterhead shows the new address |

### Program 37: Alternative constructors from JSON/env

- 🏠 **Everyday:** You can open a bank account at the branch or by uploading documents online; both give you the same account.
- 💻 **In software:** App settings loaded with `Settings.from_json()` locally and `Settings.from_env()` in Docker, like Pydantic `BaseSettings`.

| Concept | Real life |
|---|---|
| `__init__` | Opening the account at the branch |
| `from_json() / from_env()` | Uploading documents online |
| `returns cls(...)` | Both give you the same account |

### Program 38: Base class forces child implementation

- 🏠 **Everyday:** Every payment counter must accept payment, but cash, card and UPI each do it their own way.
- 💻 **In software:** A payment gateway layer where `CardPayment` and `UpiPayment` must each implement `pay()`, or `NotImplementedError` reminds you.

| Concept | Real life |
|---|---|
| `base pay() raises NotImplementedError` | Every counter must accept payment |
| `CardPayment / UpiPayment` | Card and UPI counters |
| `overriding pay()` | Each does it their own way |

### Program 39: Child passes fields to parent

- 🏠 **Everyday:** A new employee fills a short form and HR copies the details into the company's standard record.
- 💻 **In software:** ORM models where a child calls `super().__init__(**fields)` so the base `save()` builds the INSERT query.

| Concept | Real life |
|---|---|
| `child __init__` | New employee fills a short form |
| `super().__init__(**fields)` | HR copies details into the standard record |
| `parent save()` | Company's standard record format |

### Program 40: Mixins chained with super()

- 🏠 **Everyday:** At an airport you pass security check, then baggage scan, then reach the gate, always in the same order.
- 💻 **In software:** Django views combining `LoginRequiredMixin` and logging mixins, where the MRO decides the order each step runs.

| Concept | Real life |
|---|---|
| `AuthMixin` | Security check |
| `LoggingMixin` | Baggage scan |
| `BaseHandler` | Reaching the gate |
| `super() and MRO` | Always passing in the same order |

### Program 41: Sort with lambda key

- 🏠 **Everyday:** Lining students up by height instead of by name, using the same list of students.
- 💻 **In software:** Sorting search results, file names or tags by length, date or score with `sorted(items, key=lambda x: ...)`.

| Concept | Real life |
|---|---|
| `sorted()` | Lining the students up |
| `key=lambda` | Using height instead of name |
| `original list unchanged` | Same list of students |

### Program 42: filter, sort and max with lambdas

- 🏠 **Everyday:** From the class register, pick only students present today, line them up oldest first, and find the eldest.
- 💻 **In software:** Filtering active users from an API response and sorting them before sending the data to the frontend.

| Concept | Real life |
|---|---|
| `filter() with lambda` | Picking only students present today |
| `sorted(reverse=True)` | Lining them up oldest first |
| `max()` | Finding the eldest |
