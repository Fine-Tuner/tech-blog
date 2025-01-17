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
