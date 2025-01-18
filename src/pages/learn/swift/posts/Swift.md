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
