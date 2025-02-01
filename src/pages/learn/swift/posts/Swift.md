---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-01-17
title: "Swift"
description: "Swift를 학습해보자."
tags: ["Swift"]
---

Swift 공식문서 및 유튜브로 얻은 지식 요약 정리

## basic

- 상수는 `let` 변수는 `var`를 사용한다.
- 타입을 초반에 할당해주지 않아도 된다. 자동으로 타입추론 한다. 만약에 초기값을 할당할 수 없는 경우에는 타입을 명시해준다.
- 암묵적으로 타입이 변환되지 않고, 명시적으로 변환해줘야 한다.

```swift
let label = = "The Width is "
let width = 94
let widthLabel = label String(width)
```

- 타입 `Int`는 숫자고 `Double`과 `CGFloat`은 소수점까지 포함이다. 숫자 계산을 할 때(소수점이 나올 수 있음)는 `Double`을 쓰고 UI에 사용하기 위해 글꼴 크기라던지 그런데에 사용할 때는 `CGFloat`을 사용한다.
- 문자열 안에 표현식을 넣으려면 다음과 같이 한다.

```swift
let orange = 3
let banana = 5

let fruitSummary = "I have \(orange + banana)"
```

- 쌍따음표를 3개 사용하면 여러 줄을 작성할 수 있다.

```swift
let quotation = """
    Even though there's whitespace to the left,
    the actual lines aren't indented.
"""
```

## guard

guard를 사용하면 if문과 비슷하지만 다르게 사용할 수 있다. true일 때 블록문 밖으로 이동시킨다.

```swift
// guard
guard isShow else {
    return
}

print("This is Show")

// if ~ else
if isShow {
    print("This is Show")
} else {
    return
}
```

## Type

함수의 반환

```swift
func checkIfTrue() -> Bool {
    ...

    return true
}

func calcNumbers(v1: Int, v2: Int) -> Int {
    return v1 + v2
}

// 파라미터로 전달할 값이 없다면 아래처럼 만들수도 있다.
// 함수를 호출할 때와 마찬가지로 calcNumber가 평가될 때 값이 계산된다.
let number1 = 5
let number2 = 5
var calcNumber: Int {
    return number1 + number2
}

// 아래 함수와 동일하다.
func calcNumber() -> Int {
    return number1 + number2
}
```

## Optional

- Typescript를 쓸 때처럼 Optional이 존재한다.
- swift에서는 nil값을 명시적으로 처리할 수 있도록 도와준다.
- Optional은 값을 가질 수도 있고 nil일 수도 있음을 의미한다.
- `!`키워드를 붙여서 값이 있음을 명시적으로 나타낼 수 있으나, 만약 값이 nil일 경우 런타임 에러가 발생하니 주의한다.
- if let이나 guard let을 사용해서 Optional값을 안전하게 언래핑한다.

```swift
let name: String? = "Even"

// name이 truty하다면 unwrappedName 상수에 name값을 넣는다.
if let unwrappedName = name {
    print(unwrappedName) // "Even"
} else {
    print("name is nil")
}
```

guard let

```swift
func greet(_ name: String?) {
    // 쉼표를 이용해서 여러 변수를 넣을 수도 있다. 모두 truty할 때 guard 아래 print문들이 실행된다.
    guard let unwrappedName = name, let secondName = name else {
        print("name is nil")
        return
    }
    print("Hello, \(unwrappedName)!")
    print("Hello, \(secondName)!")
}
greet("Even") // "Hello, Even!"
greet(nil)    // "name is nil"
```

- 기본값을 제공해주기 위해서 Typescript에서 null 병합연산자처럼 nil일 때 기본값을 할당할 수 있다.

```swift
let name: String? = nil
let displayName = name ?? "Guest"
print(displayName) // "Guest"
```

Optional Chaning을 이용해서 Optional 타입의 프로퍼티나 메서드에 안전하게 접근도 가능하다.

```swift
class Person {
    var name: String?
    var address: Address?
}

class Address {
    var city: String?
}

let person = Person()
person.address = Address()
person.address?.city = "Seoul"

if let city = person.address?.city {
    print("City is \(city)") // "City is Seoul"
}
```

## Memory

기본적인 데이터 구조를 떠나서 Swift에서 메모리 관리와 성능적인 측면에서 어떤 개념들이 있는지 알아보자.

### Stack

- 값 타입
- 매우 빠르다
- 우리가 익히 알고 있는 LIFO 구조를 가진 메모리 영역이다.
- 간단하고 빠르게 데이터가 저장되고, 삭제된다.
- 주로 함수 호출, 지역 변수, 구조체 인스턴스 같은 짧은 생명 주기를 가지는 데이터에 사용된다.
- 메모리 할당, 해제가 자동으로 이뤄진다.

### Heap

- 참조 타입
- 상대적으로 느리다.
- 클래스 인스턴스같은 더 복잡하거나 긴 생명 주기를 가진 데이터에 사용된다.
- 메모리 할당 및 해제는 Swfit가 제공하는 ARC(Automatic Reference Counting)에 의해 관리된다.
- 상대적으로 Stack보다 느리고, 더 많은 메모리를 사용할 수 있다.

#### Struct(구조체)

- Stack에 저장되는 값 타입이다.
- 변수를 복사할 때 값이 복사된다.

```swift
struct Point {
    var x: Int
    var y: Int

    // 생략되어있지만 실제로는 아래와 같이 init함수가 존재한다.
    init(x: Int, y: Int) {
        self.x = x
        self.y = y
    }
}

var point1 = Point(x: 1, y: 2)
var point2 = point1 // 값을 복사
point2.x = 5

print(point1.x) // 1 (독립된 복사본)
print(point2.x) // 5
```

#### Class (클래스)

> let으로 인스턴스를 만들고 내부 프로퍼티를 변경할 수 있다. 참조타입이기 때문이다. 일반적으로 참조를 변경하지 않는 경우에는 let을 우선 사용하는 것이 더 안전하고 가독성을 높인다. 필요 시에만 var를 사용하는 방식이 추천된다. JS를 할 때도 const를 우선 사용하고, 변수가 필요 시에 let으로 전환하는 식으로 하는 습관이 좋다.

```swift
class Point {
    var x: Int
    var y: Int

    init(x: Int, y: Int) {
        self.x = x
        self.y = y
    }
}

var point1 = Point(x: 1, y: 2)
var point2 = point1 // 참조를 복사
point2.x = 5

print(point1.x) // 5 (같은 인스턴스를 참조)
```

### 언제 Struct를, 언제 Class를 사용해야 할까?

#### Struct를 사용해야 하는 경우:

- 데이터가 값 타입으로 동작해야 할 때.
- 인스턴스 간 독립성이 중요한 경우.
- 데이터의 생명 주기가 짧고, 가볍게 처리할 수 있을 때.

예를 들어서 알아보자.

- 데이터 중심의 객체 : 주로 데이터를 저장하고, 전달하는 데 사용되는 객체

```swift
struct User {
    var name: String
    var age: Int
}

let user1 = User(name: "Alice", age: 25)
var user2 = user1
user2.name = "Bob"

print(user1.name) // "Alice" (원본 객체는 변경되지 않음)
print(user2.name) // "Bob"
```

- 경량 객체 : 데이터의 간단한 표현

```swift
struct Rectangle {
    var width: Double
    var height: Double

    func area() -> Double {
        return width * height
    }
}

let rect = Rectangle(width: 10, height: 20)
print(rect.area()) // 200.0
```

#### Class를 사용해야 하는 경우:

참조를 통해 여러 곳에서 동일한 데이터를 공유해야 할 때.
데이터가 복잡하거나 생명 주기가 길 경우.
상속이 필요한 경우.

마찬가지로 예시로 알아보자.

상태를 공유해야 하는 객체일 경우 : 위에서 설명했듯이 인스턴스들이 동일한 메모리 주소를 참조한다.

```swift
class Device {
    var name: String
    var isOn: Bool

    init(name: String, isOn: Bool) {
        self.name = name
        self.isOn = isOn
    }
}

let device1 = Device(name: "iPhone", isOn: true)
let device2 = device1
device2.isOn = false

print(device1.isOn) // false (참조로 인해 같은 객체를 수정)
```

상속과 다형성

```swift
class Vehicle {
    var speed: Double = 0.0

    func describe() -> String {
        return "Speed: \(speed) km/h"
    }
}

class Car: Vehicle {
    var brand: String

    init(brand: String, speed: Double) {
        self.brand = brand
        super.init()
        self.speed = speed
    }

    override func describe() -> String {
        return "\(brand) is moving at \(speed) km/h"
    }
}

let car = Car(brand: "Tesla", speed: 120)
print(car.describe()) // "Tesla is moving at 120 km/h"
```

정리하면 다음과 같다.

구체적인 기준

- 데이터의 불변성 유지: 데이터를 복사하여 다룬다면 struct를 사용.
- 상속이 필요한 경우: class를 사용.
- 데이터 공유: 여러 객체에서 데이터를 공유해야 한다면 class.
- 멀티스레드 안전성: 값 타입(struct)은 스레드 간 상태 공유를 피할 수 있어 안전.
- 성능 고려:
  struct는 작은 데이터와 함수 중심 작업에 적합.
  class는 큰 데이터와 복잡한 상태 관리가 필요한 경우에 적합.

일반적으로 struct를 기본으로 사용하고, class는 꼭 필요한 경우에만 사용하는 것이 권장된다고 한다.

핵심 결론은 다음과 같다.

- class는 상태 관리와 공유, 생명주기 관리가 필요한 경우에 적합하다.
- struct는 불변 데이터 모델링이나 값 복사가 자연스러운 상황에 적합하다.

추가로 만약 Struct에서 프로퍼티를 변경하려는 경우 각 메서드에 mutating키워드를 붙여줘야 한다.

```swift
struct NetworkManager {
    var isConnected: Bool = false

    mutating func connect() {
        isConnected = true
        print("Connected to the network")
    }

    mutating func disconnect() {
        isConnected = false
        print("Disconnected from the network")
    }
}
```

mutating에 부연 설명 : 값 타입인 struct에서만 mutating이 필요하다. 만약 get만 하려는 경우 mutating을 붙일 필요가 없다.

```swift
// 구조체 (값 타입) - mutating 필요
struct Point {
    var x: Int
    var y: Int

    mutating func moveRight() {
        x += 1
    }
}

// 클래스 (참조 타입) - mutating 불필요
class PointClass {
    var x: Int
    var y: Int

    func moveRight() {  // mutating 키워드 불필요
        x += 1
    }
}
```

## Enum

Swift에서 Enum을 다루는 방법에는 정말 다양한 방법이 있다. 그 중에서 대표적으로 몇 가지 방법을 알아보자.

```swift
enum Direction {
    case north
    case south
    case east
    case west
}

func travel(direction: Direction) {
    switch direction {
    case .north:
        print("Heading North!")
    case .south:
        print("Heading South!")
    case .east:
        print("Heading East!")
    case .west:
        print("Heading West!")
    }
}

let currentDirection = Direction.east
travel(direction: currentDirection) // Heading East!
```

아래처럼 원시값을 할당할 수 있는 방법도 있다.

```swift
enum Status: String {
    case success = "Success"
    case failure = "Failure"
    case pending = "Pending"
}

func printStatus(_ status: Status) {
    print("Current status is: \(status.rawValue)")
}

let status = Status.success
printStatus(status)
```

Enum에 메서드를 추가할수도 있다.

```swift
enum CompassPoint {
    case north, south, east, west

    func description() -> String {
        switch self {
        case .north:
            return "North is up!"
        case .south:
            return "South is down!"
        case .east:
            return "East is right!"
        case .west:
            return "West is left!"
        }
    }
}

let direction = CompassPoint.north
print(direction.description())
```

## deinit

class에서는 `deinit`을 통해 메모리 참조를 해제할 수 있다.

아래는 파일 핸들러를 정리하는 예제코드다.

```swift
class FileHandler {
    let fileName: String

    init(fileName: String) {
        self.fileName = fileName
        print("\(fileName) opened")
    }

    deinit {
        print("\(fileName) closed")
    }
}

var file: FileHandler? = FileHandler(fileName: "example.txt")
// "example.txt opened" 출력

file = nil
// "example.txt closed" 출력
```

## public, private

특이한건 private(set)이다. 읽을 수는 있지만 set할 수는 없다.

```swift
struct MovieModel {
    let title: String

    // 방법1
    private(set) var isFavorite: Bool

    mutating func updateFavoriteStatus(newValue: Bool) {
        isFavorite = newValue
    }

    // 방법2
    // let isFavorite으로 만들었을 경우 아래 방법도 가능하다.
//    func updateFavoriteStatus(newValue: Bool) -> MovieModel {
//        MovieModel(title: title, isFavorite: newValue)
//    }
}

class MovieManager {
    public var movie1 = MovieModel(title: "Avengers", isFavorite: false)
    private var movie2 = MovieModel(title: "Avengers2", isFavorite: false)

    // read: public, set: private
    // private(set) var movie2 = MovieModel(title: "Avengers2", isFavorite: false)
}


let manager = MovieManager()

manager.movie1.updateFavoriteStatus(newValue: true)
print(manager.movie1) // true로 변경된 Avengers가 나온다.

```

## Functions and closer

> [Swift docs](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/guidedtour/)

- `\`를 파라미터 앞에 붙이면 인수를 전달할 때 값만 전달할 수 있다.
- 혹은 인자 앞에 원하는 단어를 넣으면 인수를 전달할 때 그 원하는 단어로 전달할 수 있다.

```swift
func greet(_ name: String, on prefix: String) -> String {
    return "Hello \(prefix) \(name)"
}
print(greet("taejoon", on: "hoho"))
```

### Tuple

함수에서 Tuple 형태로 반환도 가능하다. 참조할 때는 특정 String혹은 index로 참조할 수 있다.

```swift
func calculateStatics(scores: [Int]) -> (min: Int, max: Int, sum: Int) {

    var min = scores[0]
    var max = scores[1]
    var sum = 0

    for score in scores {
        sum += score

        if score < min {
            min = score
        } else if max < score {
            max = score
        }
    }

    return (min, max, sum)
}

let result = calculateStatics(scores: [1, 2, 3])
print(result.0) // min
print(result.1) // max
print(result.sum)
```

## Dictionary

Swift에서는 배열안에 객체처럼 넣는 구조인 Dictonary 자료구조가 있다.

> 일반적으로 요소들을 쭉 나열하면 배열이고, 객체처럼 쓰면 Dictonary 구조다.

반복문을 통해서 순회가 가능한데, 아래 예제를 보면 특별한게 for 소괄호에 첫번째 인자는 키를 뜻하고 두번째 인자는 그 키의 값을 뜻하는데 자동으로 맨 마지막 키까지 순회하면서 값을 비교하는 것을 볼 수 있다.

```swift
let interestingNumbers = [
    "Prime": [2, 3, 5, 7, 11, 13],
    "Fibonacci": [1, 1, 2, 3, 5, 8],
    "Square": [1, 4, 9, 16, 25],
]
var largest = 0

for(interesting, numbers) in interestingNumbers {
    for num in numbers {
        if num > largest {
            largest = num
            print("interesting is \(interesting)", "num is \(num)", "largest is \(largest)")
        }
    }
}

print(largest) // 25

```

## Control Flow

### For in

```swift
var fruits = ["apple", "banana"]
var count = 0

for fruit in fruits {
    if fruit == "apple" { // 값 비교는 동등 비교 연산자를 써야 한다.
        count += 1
    } else {
        count += 2
    }
}

print(count) // 3
```

### if

Swift에서는 암묵적인 타입 변환이 되지 않는다.
if 조건문에는 반드시 Bool 타입이 들어가야 한다. (Int타입으로 0이 들어갔을 때 암묵적변환으로 false가 될 것이라고 기대하면 안된다)

> 할당문이나 return 문 뒤에 if문이나 swift문을 사용할 수 있다.

```swift
let count = if true {
    1
} else {
    2
}


print("count is \(count)")
```

```swift
let count = 1

let name = switch count {
    case 1:
        "taejoon"
    case 2:
        "samook"
    default:
        "unknown"
}


print("name is \(name)") // name is taejoon
```

### if let

Optional 타입을 사용한 변수가 true일 때 `if let 변수`부분에 값을 할당할 수 있다.

```swift
var optionalName: String? = "joon"

if let name = optionalName {
    print("name is \(name)")
} else {
    print("unknown")
}
```

혹은 `??` Operator를 사용해서 nil일 경우 기본값을 줄 수 있다.

```swift
var optionalName: String? = "joon"

print("name is \(optionalName ?? "unknown name")")
```

혹은 새로운 변수명으로 할당하지 않고 해당 변수가 true일 때 block 내부문안에서 truty한 변수를 사용할 수 있다.

```swift
var optionalName: String? = "joon"

if let optionalName {
    print("name is \(optionalName)")
}
```

### switch

switch의 case문에 다양한 형태로 사용가능하다.

```swift
let fruit = "apple fruit"


switch fruit {
    case "apple":
        print("fruit is apple")
    case "banana", "carrot":
        print("twin")
    case let suffix where fruit.hasSuffix("fruit"):
        print("suffix is fruit")
    default:
        print("default")
}
```

### func

다양한 함수 형태를 연습한다.

내부 함수는 외부함수 내부의 변수를 참조할 수 있다.

```swift
func returnFifteen() -> Int {
    var y = 10
    func add() {
        y += 5
    }
    add()
    return y
}
returnFifteen()
```

함수를 반환할 수 있다.

```swift
func makeIncrementer() -> ((Int) -> Int) {
    func addOne(number: Int) -> Int {
        return 1 + number
    }
    return addOne
}
var increment = makeIncrementer()
increment(7)
```

함수의 인자로 콜백함수를 전달할 수 있다.

```swift
func hasAnyMatches(list: [Int], condition: (Int)->Bool)->Bool {
    for item in list {
        if condition(item) {
            return true
        }
    }
    return false
}

func lessThanTen(number: Int)->Bool {
    return number < 10
}


let numbers = [10, 20]
hasAnyMatches(list: numbers , condition: lessThanTen)
```

## map

- `in`은 이제 본문이 나올 것임을 나타낸다.
- 아래 로직은 다 동일한 결과를 반환한다.

```swift
let numbers = [1, 2, 10, 20]

// 1: 원본 코드
let result = numbers.map({
    (number: Int) -> Int in
    let result = 3 * number
    return result
})

// 버전 2: 타입 추론으로 타입 선언 생략
let result = numbers.map({ number in
    return 3 * number
})

// 버전 3: return 생략
let result = numbers.map({ number in 3 * number })

// 버전 4: 파라미터 이름 대신 $0 사용
let result = numbers.map({ $0 * 3 })

// 버전 5: 후행 클로저 문법 사용
let result = numbers.map { $0 * 3 }
```

## class

init을 생략

```swift
class Shape {
    var name: String = ""

    func description() -> String {
        return "Shape \(name)"
    }
}

let shape = Shape()

shape.name = "circle"
print(shape.description()) // Shape circle
```

init을 사용한 형태

```swift
class Shape {
    var name: String = ""

    init(name: String) {
        self.name = name
    }

    func description() -> String {
        return "Shape \(name)"
    }
}

let shape = Shape(name: "circle")

print(shape.description()) // Shape circle
```

- SuperClass와 SubClass는 콜론으로 구별한다.
- SubClass에서 `super.`형태로 SuperClass에 접근 가능하다.
- `override func` 같은 형태로 함수를 덮어쓸 수 있다.
- `super.init`으로 SuperClass의 초기화값을 바꿀 수 있다.

```swift
// Super Class
class NamedShape {
    var numberOfSides: Int = 0
    var name: String

    init(name: String) {
       self.name = name
    }

    func simpleDescription() -> String {
       return "A shape with \(numberOfSides) sides."
    }

    func getName() -> String {
        return "my name is \(name)"
    }
}

// Sub Class
class Square: NamedShape {
    var sideLength: Double

    init(sideLength: Double, name: String) {
        self.sideLength = sideLength
        super.init(name: name)
    }

    func numberOfSidesToFour()->Void {
        super.numberOfSides = 4
    }

    func getNumberOfSidesOfSuperClass() -> Int {
        return super.numberOfSides
    }

    func area() -> Double {
        return sideLength * sideLength
    }

    override func simpleDescription() -> String {
        return "A square with sides of length \(sideLength)."
    }
}
let test = Square(sideLength: 5.2, name: "taejoon")
test.area()
test.simpleDescription() // A square ..
test.getName() // my name is taejoon
test.numberOfSidesToFour()
test.getNumberOfSidesOfSuperClass()
```

getter와 setter를 아래와 같이 간편하게 설정할 수 있다.

```swift
class Calculator {
    var result: Int = 0

    var calculatorDescription: String {
        get {
            return "Calculator result: \(result)"
        }
        set {
            result = Int(newValue) ?? 0
        }
    }
}


let calc = Calculator()
calc.calculatorDescription = "100"

calc.calculatorDescription // Calculator result: 100

```

옵저버 패턴도 구현이 가능하다.

willSet은 프로퍼티가 변경되기 직전, didSet은 프로퍼티가 변경된 직후다.

각각 새로 변경 될 `newValue`와 이전 값인 `oldValue`가 사용된다.

```swift
class BankAccount {
    var accountHolder: String
    var balance: Int {
        willSet {  // 잔액이 변경되기 직전에 실행
            print("[\(accountHolder)님의 잔액 변경 예정]")
            print("현재 잔액: \(balance)원")
            print("변경될 잔액: \(newValue)원")
        }

        didSet {   // 잔액이 변경된 직후에 실행
            print("[\(accountHolder)님의 잔액 변경 완료]")
            print("이전 잔액: \(oldValue)원")
            print("현재 잔액: \(balance)원")
            print("====================")
        }
    }

    init(accountHolder: String, balance: Int) {
        self.accountHolder = accountHolder
        self.balance = balance
    }
}

// 사용 예시
let account = BankAccount(accountHolder: "김철수", balance: 10000)

// 입금
account.balance += 5000

// 출금
account.balance -= 3000
```

## enum

- 전체 이름 사용 (Suit.hearts)
  타입이 명시되지 않은 경우 사용
  컴파일러가 타입을 추론할 수 없을 때 사용

- 축약형 사용 (.hearts)
  이미 타입이 알려진 경우 사용 가능
  switch 문 안에서처럼 컨텍스트가 명확할 때 사용

```swift
enum numberEnum: Int {
    case one = 1
    case two = 2
}

print(numberEnum.one) // "one"
print(numberEnum.one.rawValue) // 1

```

```swift
enum Suit {
    case spades, hearts, diamonds, clubs


    func simpleDescription() -> String {
        switch self {
        case .spades:
            return "spades"
        case .hearts:
            return "hearts"
        case .diamonds:
            return "diamonds"
        case .clubs:
            return "clubs"
        }
    }
}
let hearts = Suit.hearts
let heartsDescription = hearts.simpleDescription()
print(heartsDescription) // "hearts"

```

실용적인 예제

```swift
enum HTTPStatus: Int {
    case ok = 200
    case notFound = 404
    case serverError = 500

    var description: String {
        switch self {
        case .ok: return "성공 (\(self.rawValue))"
        case .notFound: return "찾을 수 없음 (\(self.rawValue))"
        case .serverError: return "서버 에러 (\(self.rawValue))"
        }
    }
}

let status = HTTPStatus.ok
print(status)           // "ok" 출력
print(status.rawValue)  // 200 출력
print(status.description) // "성공 (200)" 출력
```

## enum - Raw Value vs Associated value

```swift
// Raw Value 예시 (항상 같은 값)
enum Direction: String {
    case north = "북"  // 항상 "북"
    case south = "남"  // 항상 "남"
}

// Associated Value 예시 (상황에 따라 다른 값)
enum DeliveryStatus {
    case preparing(estimatedTime: Int)
    case shipping(trackingNumber: String)
    case delivered(deliveryTime: String)
}

let order1 = DeliveryStatus.preparing(estimatedTime: 30)
let order2 = DeliveryStatus.preparing(estimatedTime: 45)
// 같은 preparing 케이스지만 다른 estimatedTime 값
```

## enum - Associated value swith

```swift
switch success {
case let .result(sunrise, sunset):    // 여기서 값 추출이 일어납니다
    print("Sunrise is at \(sunrise) and sunset is at \(sunset).")
case let .failure(message):
    print("Failure...  \(message)")
}
```

## aysnc / await

- async를 함수의 이름 뒤에 붙인다.
- await를 비동기 함수 앞에 붙인다.

```swift
func fetchUsername(from server: String) async -> String {
    let userID = await fetchUserID(from: server)
    if userID == 501 {
        return "John Appleseed"
    }
    return "Guest"
}
```

만약 동시에 비동기 요청을 하고 싶다면 각 async를 앞에 붙이면 된다.

```swift
func connectUser(to server: String) async {
    async let userID = fetchUserID(from: server)
    async let username = fetchUsername(from: server)
    let greeting = await "Hello \(username), user ID \(userID)"
    print(greeting)
}
```

## Task

- Task를 사용해서 비동기 작업을 관리할 수 있다.
- 취소도 가능하다.
- 우선순위 설정도 가능하다.

```swift
let task = Task(priority: .high) {
    await longRunningOperation()
}
// 나중에 필요하면 취소 가능
task.cancel()
```

```swift
class NetworkManager {
    func fetchData() {
        Task {
            do {
                let data = try await networkRequest()
                print("데이터 수신: \(data)")
            } catch {
                print("에러 발생: \(error)")
            }
        }
    }
}
```

여러 작업을 동시에 수행할 수 있다.

```swift
Task {
    async let result1 = fetchData()
    async let result2 = fetchMoreData()

    let finalResult = await (result1, result2)
    print("모든 데이터 수신: \(finalResult)")
}
```

## Task Group

Task Group을 생성하는 방법에는 두 가지가 있다.

- `of: Int.self` : 각 작업이 반환할 값의 타입이 Int라고 지정.
- `group` : TaskGroup의 인스턴스를 참조하는 파라미터

```swift
// 1. withTaskGroup
let userIDs = await withTaskGroup(of: Int.self) { group in
    for server in ["primary", "secondary", "development"] {
        group.addTask {
            return await fetchUserID(from: server)
        }
        // addTask가 여러개 있다고 가정했을 때 비동기로 동작하고, 끝나는 순서대로 group인스턴스에 추가된다.
    }


    var results: [Int] = []
    for await result in group { // 위에 group.addTask가 끝날 때까지 가디리지 않고, 하나씩 끝날 때마다 append된다. 즉, 순서를 보장하지 않는다.
        results.append(result)
    }
    return results
}

// 2. withThrowingTaskGroup (에러를 던질 수 있는 버전)
try await withThrowingTaskGroup(of: Int.self) { group in
    // ...
}
```

## actor

actor의 실생활 예시

```swift
actor ServerConnection {
    // 1. 속성 선언
    var server: String = "primary"        // 일반 속성
    private var activeUsers: [Int] = []   // 비공개 속성

    // 2. 비동기 메서드
    func connect() async -> Int {
        // await: 비동기 함수 호출
        let userID = await fetchUserID(from: server)

        // activeUsers 배열 수정 (자동으로 안전하게 처리됨)
        activeUsers.append(userID)

        return userID
    }
}
```

```swift
// 1. 기본 사용
let connection = ServerConnection()

// Actor의 메서드 호출은 반드시 await 사용
let userID = await connection.connect()

// 2. 여러 작업 동시 실행
let connection = ServerConnection()

// 동시에 여러 요청을 안전하게 처리
async let user1 = connection.connect()
async let user2 = connection.connect()
async let user3 = connection.connect()

let users = await [user1, user2, user3]
```

### 왜 active를 사용해야 할까?

만약 actor로 만들었을 경우에는 한번씩만 접근이 가능하기 때문에 coffeeBeans가 0개 미만이 될 수 없다.

- 예상치 못한 결과를 막는다.
- 동시성 문제로 인한 버그를 막는다.

```swift
actor CoffeeShop {
    var coffeeBeans = 1000

    func makeCoffee() {
        if coffeeBeans >= 20 {
            coffeeBeans -= 20
            print("커피 완성!")
        }
    }
}

let shop = CoffeeShop()

Task {
    await shop.makeCoffee()
}
```

## protocol

프로토콜은 설계도 같은 역할을 한다.

> 규모가 커질수록 서로간의 약속이 중요해진다.

```swift
// 프로토콜 정의
protocol Animal {
    // 필수 구현 항목
    var name: String { get }
    var species: String { get }

    // 선언만 되어있는 필수 메서드
    func makeSound()
}

// 프로토콜 익스텐션으로 기본 구현 제공
extension Animal {
    // 선택적 구현 항목 (기본 구현 제공)
    func sleep() {
        print("\(name)이(가) 잠을 잡니다.")
    }

    func eat() {
        print("\(name)이(가) 먹이를 먹습니다.")
    }
}

// 구현 예시
class Dog: Animal {
    var name: String        // 필수
    var species: String     // 필수

    init(name: String) {
        self.name = name
        self.species = "개"
    }

    func makeSound() {      // 필수
        print("멍멍!")
    }

    // sleep()과 eat()은 구현하지 않아도 됨 (기본 구현 사용)
}
```

## Error Handling

```swift
enum PrinterError: Error {
    case outOfPaper
    case noToner
    case onFire
}

func send(job: Int, toPrinter printerName: String) throws -> String {
    if printerName == "Never Has Toner" {
        throw PrinterError.noToner
    }
    return "Job sent"
}

do {
    let printerResponse = try send(job: 1040, toPrinter: "Never Has Toner")
    print(printerResponse)
} catch {
    print("error is \(error)")
}
// Prints "error is noToner"

```

에러 케이스별로 다르게 처리할 수도 있다.

```swift
do {
    let printerResponse = try send(job: 1440, toPrinter: "Gutenberg")
    print(printerResponse)
} catch PrinterError.onFire {
    print("I'll just put this over here, with the rest of the fire.")
} catch let printerError as PrinterError {
    print("Printer error: \(printerError).")
} catch {
    print(error)
}
// Prints "Job sent"
```

에러처리는 다양하게 할 수 있다.

- try? 사용
  - 장점: 간단한 처리 가능, nil 체크로 충분한 경우
  - 단점: 구체적인 에러 정보 손실
- do-catch 사용
  - 장점: 상세한 에러 처리 가능
  - 단점: 코드가 길어질 수 있음
- throws로 전파
  - 장점: 에러 처리를 상위 레벨로 위임 가능
  - 단점: 어디선가는 반드시 처리해야 함

아래는 네트워킹 예시다.

```swift
class NetworkManager {
    // 에러를 던질 수 있는 함수
    func fetchUser(id: Int) async throws -> User {
        guard let url = URL(string: "https://api.example.com/users/\(id)") else {
            throw NetworkError.invalidURL
        }

        let (data, _) = try await URLSession.shared.data(from: url)

        guard let user = try? JSONDecoder().decode(User.self, from: data) else {
            throw NetworkError.decodingError
        }

        return user
    }
}

// 1. try? 사용 (간단하지만 에러 세부정보 없음)
func fetchUserProfile1(id: Int) async {
    let user = try? await NetworkManager().fetchUser(id: id)
    if let user = user {
        print("사용자: \(user)")
    } else {
        print("사용자 정보 가져오기 실패")
    }
}

// 2. do-catch 사용 (자세한 에러 처리 가능)
func fetchUserProfile2(id: Int) async {
    do {
        let user = try await NetworkManager().fetchUser(id: id)
        print("사용자: \(user)")
    } catch NetworkError.invalidURL {
        print("잘못된 URL")
    } catch NetworkError.noData {
        print("데이터 없음")
    } catch NetworkError.decodingError {
        print("디코딩 실패")
    } catch {
        print("기타 에러: \(error)")
    }
}

// 3. 에러 전파 (호출한 곳에서 처리)
func fetchUserProfile3(id: Int) async throws -> User {
    return try await NetworkManager().fetchUser(id: id)
}
```

아래는 로그인 예시다.

```swift
// 중요한 작업: 상세한 에러 처리 필요
func login(username: String, password: String) async {
    do {
        let user = try await authenticateUser(username: password)
        try await saveUserSession(user)
        navigateToHome()
    } catch AuthError.invalidCredentials {
        showAlert("아이디 또는 비밀번호가 잘못되었습니다.")
    } catch AuthError.serverError {
        showAlert("서버 오류가 발생했습니다.")
    } catch {
        showAlert("알 수 없는 오류가 발생했습니다.")
    }
}

// 덜 중요한 작업: 간단한 처리로 충분
func loadUserPreferences() async {
    let preferences = try? await fetchUserPreferences()
    if let prefs = preferences {
        applyPreferences(prefs)
    } else {
        // 기본값 사용
        applyDefaultPreferences()
    }
}
```

## try?

에러가 발생하더라도 에러 처리가 필요없이 괜찮은 상황일 때 사용한다.

```swift
// 1. 캐시된 데이터와 함께 사용
func getCachedOrFetchData() async -> Data? {
    if let cached = cache.getData() {
        return cached
    }

    // 네트워크 요청 실패해도 괜찮은 상황
    return try? await fetchDataFromNetwork()
}

// 2. 여러 소스에서 데이터 가져오기
func getDataFromMultipleSources() -> Data? {
    // 첫 번째 소스가 실패하면 두 번째 시도
    return (try? getDataFromSource1()) ?? (try? getDataFromSource2())
}

// 3. 초기화에서의 활용
struct Configuration {
    let  Data?

    init() {
        // 설정 파일 읽기 실패해도 앱은 계속 실행
        self.data = try? loadConfigFile()
    }
}
```

## defer

defer를 사용해서 함수가 종료되기 직전에 동작할 로직을 명시할 수 있다.

```swift
class UserInterface {
    var isLoading = false

    func fetchData() async {
        isLoading = true

        defer {
            isLoading = false
            updateUI()
        }

        // 데이터 가져오기...
        try? await Task.sleep(nanoseconds: 2_000_000_000)
    }
}
```

## Generic

```swift
class Storage<T> {
    private var items: [String: T] = [:]

    func save(_ item: T, forKey key: String) {
        items[key] = item
    }

    func get(forKey key: String) -> T? {
        return items[key]
    }
}

// 사용 예시
let userStorage = Storage<User>()
let settingsStorage = Storage<Settings>()
```
