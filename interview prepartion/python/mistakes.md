========Mistakes===========

1in parnt or child method must give return statement  or expression but in that otherwise print none expression varible already use in init
2 any single method must take self as parameter
2.1 if method u assign parameter any no must assign it like def __init__(self,brand,color="white"): must assign  self.brand=brand, self.color=color
3.in each fun and after class name give colon
4.see indention class, fun ,object creation and print
5.in same class any method always give self
6.myname.same_as(myname)==return self is other
subclass= class child(parent):
7.return can be followed by an expression, or used by itself to return None. A regular assignment (=) or augmented assignment (+=) is a statement, so it cannot follow return.
return self.balance+=withdraw_amount  ==wrong
return self.balance+withdraw_amount==correct
self.balance+=withdraw_amount  === correct
        return self.balance
9.to read any data must use prefix get_methodname(self)  
10.super().__init__(self.brand) ==wrong  super().__init__(brand)==correct  
super().__init__(*args,**kargs)==correct 
see syntax different way to call parent constructor see blog
https://www.debug.school/rakeshdevcotocus_468/different-ways-to-call-a-parent-constructor-in-python-53ao 
mostly used positional argument and forward argument
11 How can a child class call its parent’s hello() method and return the result in uppercase?
return super().hello().upper()
12.how child or subclass use   parent class attribute
return super().role
how child /subclass class method  use parent class class method
  def create(cls):
        return super().create()

t1 = Truck("Tata","10 tons")   ==wrong

def __init__(self,*args,load):
t1 = Truck("Tata", load="10 tons")==correct

With def __init__(self, *args, load="10 tons"), load is keyword-only. Truck("Tata", "20 tons") puts both values into args. If you forward them with super().__init__(*args), Vehicle.__init__ raises TypeError because it expects only brand. Use Truck("Tata", load="20 tons").

print(b) gives a NameError(name resolution)  in python == it comes under readable and concise syntax  features correct gives double quotes===>print("b),student.append("b)
in  method we can declare varible like area but it is local to varible another method cannot use if u declare variable in init then it can shared by all methods


=================================CHEATSHEET==========================
1 why any program output is None
answer in fun not mention return keyword
2.why do not give result 
answer forget to give print statement
3.def get_length(self):==>return self.length
4.def same_as(self,other):==>return self is other.    wrong ==>return self.name is other
5.ClassName.class_variable.append(value)==>Team.member.append("ram")==>print(Team.member) 
5.balance history show transaction record how much with draw and deposit. [400,-200]
6.If a container should always start empty for each object, define it directly in __init__ using self, without adding it as a parameter. For example, self.history = [].
for bankaccount=owner and balance first time when he open account
deposit ==balance= balnce+amount
withdraw= balance= balnce-amount
syntax for appending in list==def deposit(self,amount):=>self.history.append(amount)
syntax for appending in dictionary=def deposit(self, person, amount):  => self.history_dictionary[person] = amount

7.how to read variable using method calling   def get_balance(self):==> return self.balance 
 print(account.get_balance()) or directly variable name  print(account.balance)
8.syntax for setting default value= def __init__(self, name, age, city="Delhi"):
9.size_unit is global not change ,but pizza size is always changing so size_unit is class varible but size is instance varible
10.syntax to print class varible and instance varible together=return f"{self.size} {self.size_unit}"
11 syntax to create new object usin classmethod that use classvarible==def large(cls):   return cls(12)
12.syntax how to class method that updates a class variable 
def rename_school(cls, name):===> cls.school = name
13 how to use ststic method def is_valid(size):
13 syntac to create object from dictionary using classmethod=
def from_dict(cls,data): ==> return cls(data["name"],data["age"])==>print(Admin.from_dict({"name":"asha","age":40}).age) 
14.syntax to create subclass=class childclassname(parentclassname)==>class Dog(Animal):
15.A child class inherits its parent’s constructor instance varible,methods when it has no constructor(no init method just have pass) of its own
16 how child class reuse parent class instance varible initialization using positional argument.==super().__init__(brand)
how child class reuse parent class instance varible initialization using by forwarding positional and keyword arguments=  super().__init__(*args,**kwargs)
how child class reuse parent class instance method initialization==return super().hello().upper()
17.Call another instance method in the same class==return self.hello() *2
18 different form of super
how to reuses the parent’s instance variable initialization==super().__init__(name)
how to calls the parent’s instance method==return super().show()
how to calls the parent’s class method, which uses cls to create a Child object.==return super().create()
how to read or access parent’s class attribute role.==return super().role
19.how to call MRO resolution==class LoggedModel(LogMixin,Model): return f"log" +super().save() 
20.calling a common method on objects of different classes through a loop.=for vehicle in (Car(), Bike()): print(vehicle.start()) replace Car().start(),Bike().start()
[print(vehicle.start()) for vehicle in (mycar, mybike)]
21.How can you create a list object that holds three objects of a user-defined class?
board = ModelBoard([
    Model("Random Forest", 0.91),
    Model("Logistic Regression", 0.85),
    Model("SVM", 0.88),
]) ==>board = ModelBoard([model1, model2, model3]) 




22.how to display or read the attributes of each object in a list using for loop
for model in models:
    print(model.name, model.accuracy)
23.how to display or read the attributes of each object in a list using for loop
def __repr__(self):
    return f"{self.name}: {self.accuracy}"
print(board.sorted_by_accuracy())   

24.How can you join strings from a list or tuple into a single string using spaces or a comma followed by a space as the separator?
items = ["web", "mobile"] ==>print(" ".join(items))   # web mobile || print(", ".join(items))  # web, mobile
tags = ("web", "mobile") ==?print(" ".join(tags))    # web mobile

25.How can an instance method collect extra positional arguments passed during its call and join them into a single string, separated by a comma and a space?==joined_tags = ", ".join(tags)   # "web, mobile"
26.How can you append a “tags” label and comma-separated tag values to an existing string?
line += " tags: " + ", ".join(tags).

27.How can you convert a dictionary into a list of strings in the format key=value?
 [f"{key}={value}" for key, value in details.items()]
27.How can an instance method collect keyword arguments passed during its call and convert them into a list of key=value strings?
 pairs = [f"{key}={value}" for key, value in details.items()] # ['user=asha', 'amount=500']

28.How can you calculate the average of a list of scores and round it to a specified number of decimal places?
 average = round(sum(scores) / len(scores), round_to)
29.How can you count how many scores meet or exceed the passing mark?
passed = sum(1 for score in scores if score >= pass_mark)
30.How can you calculate the number of failed scores using the total number of scores and the number that passed?
failed = len(scores) - passed

31.. How can you remove spaces from both ends of each name? from list
names = ["  Asha Rao ", " Ravi Kumar  "]
print([name.strip() for name in names])
print([str.strip(name) for name in names])
32 How can you convert every name to lowercase?
print([name.lower() for name in names])
print([str.lower(name) for name in names])
33.How can you replace spaces with underscores in each name?
print([str.replace(name, " ", "_") for name in names])
34.How can you remove surrounding spaces, convert to lowercase, and replace spaces with underscores?
print([name.strip().lower().replace(" ", "_") for name in names])
print([str.replace(str.lower(str.strip(name)), " ", "_") for name in names])
35.How can you replace underscores with hyphens in each name?
print([name.replace("_", "-") for name in names])
print([str.replace(name, "_", "-") for name in names])

closure=


37.How can you use a list comprehension to pass each name and a list of processing steps to a function, then collect the results in a new list?
clean_names = [run_pipeline(name, steps) for name in raw_names]


38.How can an outer class’s instance method create an object of a nested class, call its method, and print the result?
 print(self.UserDefined([4,8,9,2,1]).add())
39.How can an instance method define a lambda function and call it with an instance attribute to return its square?
x = lambda number: number * number
return x(self.no)
40.correct==>a=multiplier(5),print(a(7))  wrong=a=multiplier(5),print(a.(7))
correct=def multiplier(no):
    def multiply(multiply):
        return no*multiply
    return multiply
wrong==def multiplier(no):
    def multiply(multiply):
        return no*multiply
41.Given a list of dictionaries containing model names and accuracy scores, how can you sort the models by accuracy from highest to lowest using a lambda function?   
print(sorted(models, key=lambda x: x["accuracy"], reverse=True))
41.Given a list of dictionaries containing model names and accuracy scores, how can you find the model with the highest accuracy?

42.Given a list of dictionaries containing model names and accuracy scores, how can you display each model’s name and accuracy on a separate line?
for model in by_accuracy:
    print(model["name"], model["accuracy"])
[{'name': 'Random Forest', 'accuracy': 0.91}, {'name': 'SVM', 'accuracy': 0.88}, {'name': 'Logistic Regression', 'accuracy': 0.85}]
42.Given a list of numbers, how can you sort them from highest to lowest using a lambda function?
print(sorted(mymodels, key=lambda model: model, reverse=True))
print(max(models, key=lambda x: x["accuracy"]))

{'name': 'Random Forest', 'accuracy': 0.91}
43.How can you represent model names and accuracy scores as a list of dictionaries and as a list of Model objects passed to ModelBoard?
board = ModelBoard([
    Model("Random Forest", 0.91),
    Model("Logistic Regression", 0.85),
    Model("SVM", 0.88),
])

print(board.sorted_by_accuracy())   # the list uses __repr__ for each model
print("Best:", board.best())   
 44.def log_event(app, *tags, **details): ==> = log_event("random", *["web", "mobile"]) 
 wrong==> log_event("random", ["web", "mobile"]) 
========================questions====================
1.why in c and c++ and php not use self use this and pthon why introduce self
2.in subclass method why icant pass self.varaiable ex.super().__init__(self.brand) ==wrong  super().__init__(brand)==correct
3.in child/subclass method   pass *args,**kargs to call parent method it can use varible name also whats adavantage=super().__init__(*args,**kargs) like super().__init__(self.brand)
4.def __init__(self,battrey,*args,**kargs): ==corrct ,def __init__(self,*args,**kargs,battrey):==wrong  arguments cannot follow var-keyword argument


===================================================================================
1. Use return when the caller needs a result
Q Question: Why does print(car.show()) display None when show() contains only self.brand
A method in a parent or child class can just perform an action. If it finishes without returning a value, Python returns None. Use return when you want to pass a value back to the caller.
def get_brand(self):    return self.brand
print(car.get_brand())  # Toyota


If you remove return and leave only self.brand, the outer print() displays None.
2. Use self as the first parameter of an instance method
Question: Why do I write def show(self) but call it as car.show()?
Python passes the object automatically when you call an instance method. A class method normally uses cls, and a static method can have zero parameters.
def show(self):    return self.brand
car.show()  # Python passes car as self


3. Save a parameter on self if the object needs it later
Question: Why do I write self.brand = brand inside __init__ if another method needs to use brand?
brand and color are constructor parameters. Assign them to self so other methods can access them.
def __init__(self, brand, color="white"):   
 self.brand = brand  
 self.color = color


4. Add a colon and check indentation
Where do I put :, and how do I indent the class, its methods, object creation, and print()?
Put : at the end of a class or def header. Indent methods inside the class and their statements inside the method. Put object creation and print() at the left margin when they belong outside the class.
class Vehicle: 
   def __init__(self, brand):    
       self.brand = brand
car = Vehicle("Toyota")
print(car.brand)


5. Use self. to call another instance method on the same object
Question: How do I call get_brand() from show() using self.get_brand()?
def get_brand(self): 
   return self.brand
   def show(self): 
      return self.get_brand()


6. Use is to check whether two references point to the same object
Question: Why does car.same_as(car) return True when same_as() uses return self is other?
def same_as(self, other): 
   return self is other
   car.same_as(car)  # True


7. Put the parent class in parentheses to create a subclass
Question: How do I declare Truck as a subclass of Vehicle?
class Truck(Vehicle): 
   pass


Here, Truck inherits from Vehicle.
8. Update a value first, then return it
Question: Why is return self.balance += amount invalid, and how do I update and return the balance correctly?
return can return an expression. A bare return returns None. Regular assignment (=) and augmented assignment (+=) are statements, so write them on their own line.
return self.balance += amount  # SyntaxError


return self.balance + amount   # Returns the sum without updating the balance


For a withdrawal, subtract the amount and then return the updated balance.
self.balance -= withdraw_amountreturn self.balance


9. Read an attribute directly or use a getter if one is defined
Question: Can I read car.brand directly, or do I need to define car.get_brand()?
The get_ prefix is a naming convention. Both forms below work when brand and get_brand() exist.
print(car.brand)
print(car.get_brand())


10. Pass the constructor parameter to super().__init__()
Question: Why do I pass brand to super().__init__() before self.brand exists, and how can I forward arguments with *args and **kwargs?
If the parent constructor creates self.brand, pass the local parameter brand. Reading self.brand before it exists raises AttributeError.
def __init__(self, brand): 
   super().__init__(brand)


To forward arguments received by the child, unpack args and kwargs. The parent must accept the arguments you forward.
def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)


Different ways to call a parent constructor in Python
11. Pass parameters after *args by name
Question: With 
def __init__(self, *args, load),
why does Truck("Tata", "10 tons") fail while 
Truck("Tata", load="10 tons") works?
def __init__(self, *args, load):  
  super().__init__(*args)   
   self.load = load


Call	                      What happens
Truck("Tata", "10 tons")	Both values go into args. The required keyword-only load is missing, so Python raises TypeError.
Truck("Tata", load="10 tons")	args holds ("Tata",) and load gets "10 tons".


If you write load="10 tons" in the definition, load gets a default and stays keyword-only. Truck("Tata", "20 tons") still puts both values into args. Forwarding both to a parent constructor that accepts only brand raises TypeError.
12. Use quotes for text and bare names for variables
Question: Why can print(b) raise NameError while print("b") prints the letter b?
print(b) asks Python to look up a variable named b. If Python cannot find it, you get NameError. This is name resolution.
print("b")           # Prints the text b
students = []s
tudents.append("b") # Adds the text b to the list


13. Use self. for data other instance methods need
Question: What is the difference between length = 10 and self.length = 10 inside __init__, and which one can area() access?
A variable assigned without self. inside a method is local to that method, even inside __init__. An attribute assigned with self. belongs to that object and can be read from its other instance methods.
def __init__(self, length): 
   self.length = length
def area(self, width):  
     result = self.length * width  # Local to this call    return result

11. How can a child class call its parent’s hello() method and return the result in uppercase?
return super().hello().upper()     

===========================tips===========================================
1.first write class name  
2 write all fun name with parameter and pass not write fun body  part u can mention in body pass
3.object creation with parmeter that defined in init
4.then decide expected output format list,dictionary,string,
5.then write fun body part
6.then using object call method and gives print
7.for subclass or child class u can pass or child method also u can denote pass if u have not defind body 
class Car(Vehicle):
      pass
8.nevers starts with class writting, first concept defination then connected with real example , then stars with action or fun , then formulla syntax/logic ,then call fun through object creation and finally starts with class, init action/fun object creation ,basically any program cover with some fun without class then put inside class





=========================================
class Car:
    def __init__(self,color,brand):
        self.color=color
        self.brand=brand
        
    def show(self):
       return f"{self.brand} is {self.color}  car" 
 
mycar=Car("red","toyata")
mycar2=Car("blue","feraari")
print(mycar2.show()) 
 ================================
 class Rectangle:
    def __init__(self,length):
        self.length=length
    def get_length(self):
        return f"length is {self.length}"
    def area(self,width):
        return f"area={self.length*width}"
myrecangle=Rectangle(40)
print(myrecangle.area(50))
print(myrecangle.get_length())
======================================
class BankAccount:
    def __init__(self,owner,balance,history):
        self.owner=owner
        self.balance=balance
        self.history=[]
    def get_balance(self):
        return self.balance
    def deposit(self,deposit_amount):
        self.balance += deposit_amount
        self.history.append(deposit_amount)
        return self.balance
    def withdraw(self,withdraw_amount):
        self.balance+=withdraw_amount
        self.history.append(withdraw_amount)
        return self.balance
    def change_owner(self):
        pass
    def read_owner(self):
        pass
    def read_history(self):
        pass
    
myaccount=BankAccount("ram",1000,[])
print(myaccount.balance)
print(myaccount.get_balance())
print(myaccount.deposit(100))
print(myaccount.withdraw(50))
print(myaccount.get_balance())
=========================================================================
class Student:
     def __init__(self,name,age,city="delhi"):
         self.name=name
         self.age=age
         self.city=city
 

myname = Student("ram","50","mumbai")
myname3 = Student("ram","50")
print(myname.city)  # 1500
print(myname3.city)  # 1500
====================

NOTE:---here only action eat and bark there i sno input filed like initialization so no need init method

class Animal:
     def eat(self):
         return "animal is eating"
class Dog(Animal):
     def bark(self):
         return "dog is barking"         

dog1 = Dog()
print(dog1.eat())  # 1500
print(dog1.bark())  # 1500



child--parent
car--vehicle
rectangle---
student---
bankaccount
coffee
dog---animal
team---
pizza---
user---
greeter-
loginmixin--

================================
Single class with methods
Single class: default arguments
Inheritance==16
instance method,staticmethod and classmethod==17,18,19
simplify-21


===================Car Domain====================
1.Create a Car class that stores a color. Add a show() method that returns the color. Create a red car and a blue car, and print each car's color using show().

2.Create a Vehicle class that stores a brand. Create a Car class that inherits from Vehicle and has no __init__. Create a car with brand "Toyota" and print its brand.

 3.Create a Vehicle class that stores a brand. Create a Truck child class whose __init__ takes brand and load, with "10 tons" as the default load. Create one truck without a load and one with "20 tons".

4.Create a Vehicle class with brand and an optional color (default "white"). Create an ElectricCar child class that takes battery and forwards everything else to the parent using *args, **kwargs. Create a red Tesla with a 75 kWh battery.

5.Create a Vehicle class that stores a brand. Create a Car child class whose __init__ takes brand and seats, sends brand to the parent with super(), and stores seats itself. Create a Honda with 5 seats and print both values.


6.Write a Python program to create a Vehicle class with the attributes brand, registration_number, and color. Create a Car class that inherits from Vehicle and adds speed, fuel_level, engine_on, and odometer_km. A new car starts with zero speed, zero fuel, zero kilometres on the odometer, and its engine off.

Implement these eight methods in Car:
1. show() returns the car’s details for printing.
2. start() turns the engine on.
3. stop() sets the speed to zero and turns the engine off.
4. accelerate(amount) increases the speed up to 180 km/h while the engine is on.
5. brake(amount) reduces the speed, with a minimum of 0 km/h.
6. refuel(litres) adds fuel up to the 50-litre tank capacity.
7. repaint(color) changes the car’s color.
8. drive(km) adds the travelled distance to the odometer and deducts fuel at a rate of 15 km per litre.
Raise ValueError for non-positive or non-finite amounts, EngineOffError when attempting to accelerate or drive with the engine off, and InsufficientFuelError when there is too little fuel for the trip. Define is_moving as a @property that returns True when the speed is greater than zero.

Create a white Tata car with registration number JH01AB1234. Add 10 litres of fuel, start the engine, accelerate by 40 km/h, and print whether the car is moving. Then drive 30 km, brake by 15 km/h, repaint the car blue, and print its updated details. Finally, stop the car and print whether it is still moving.






