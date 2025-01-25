---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-01-17
title: "Swift"
description: "Swift를 학습해보자."
tags: ["Swift"]
---

단축 정리

## basic

- 상수는 `let` 변수는 `var`를 사용한다.
- 타입 `Int`는 숫자고 `Double`과 `CGFloat`은 소수점까지 포함이다. 숫자 계산을 할 때(소수점이 나올 수 있음)는 `Double`을 쓰고 UI에 사용하기 위해 글꼴 크기라던지 그런데에 사용할 때는 `CGFloat`을 사용한다.

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
func greet(_ person: String, on day: String) -> String {
    return "Hello \(person), today is \(day)."
}
greet("John", on: "Wednesday")
```

## Dictionary

Swift에서는 배열안에 객체처럼 넣는 구조인 Dictonary 자료구조가 있다.

반복문을 통해서 순회가 가능한데, 아래 예제를 보면 특별한게 for 소괄호에 첫번째 인자는 키를 뜻하고 두번째 인자는 그 키의 값을 뜻하는데 자동으로 맨 마지막 키까지 순회하면서 값을 비교하는 것을 볼 수 있다.

```swift
let interestingNumbers = [
    "Prime": [2, 3, 5, 7, 11, 13],
    "Fibonacci": [1, 1, 2, 3, 5, 8],
    "Square": [1, 4, 9, 16, 25],
]
var largest = 0
for (_, numbers) in interestingNumbers {
    for number in numbers {
        if number > largest {
            largest = number
        }
    }
}
print(largest)
// Prints "25"
```
