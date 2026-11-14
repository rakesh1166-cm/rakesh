========Mistakes===========

in method must give return statement  or expression but in that expression varible already use in init
any single method must take self as parameter
in each fun and after class name give colon
see indention class, fun ,object creation and print
in same class any method always give self
myname.same_as(myname)==return self is other
subclass= class child(parent):
return can be followed by an expression, or used by itself to return None. A regular assignment (=) or augmented assignment (+=) is a statement, so it cannot follow return.
return self.balance+=withdraw_amount  ==wrong
return self.balance+withdraw_amount==correct
self.balance+=withdraw_amount  === correct
        return self.balance
to read any data must use prefix get_methodname(self)        

print(b) gives a NameError(name resolution)  in python == it comes under readable and concise syntax  features correct gives double quotes===>print("b),student.append("b)

in  method we can declare varible like area but it is local to varible another method cannot use if u declare variable in init then it can shared by all methods


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






