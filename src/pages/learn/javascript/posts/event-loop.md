---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-03-12
title: "EventLoop"
description: "Javascript Event Loop 간단하게 정리하기"
tags: ["javascript"]
---

> 불과 3년 정도 전만하더라도 Event Loop에 관련하여 잘 정리되어 있는 그림이나 포스팅을 찾아 보기 힘들었는데 요즘에는 유튜브에서 인터렉티브하게 Event Loop에 의해 어떻게 비동기로 동작이 되는지를 설명해주는 것도 많고, 양질의 블로그도 많아졌다. 오랜만에 상기해보고 간단하게 내용을 정리해보자.

## 기본 개념

Javascript의 Event Loop는 한마디로 말하면 "싱글스레드 언어에서 비동기 작업을 효율적으로 처리하게 해주는 메커니즘"이다.

API통신을 위해 fetch를 한다던지, 시간을 두고 실행한다던지 하는 니즈들이 추가되면서 좀 더 원활한 브라우저 환경을 위해 비동기로 동작 해야만 했다. 이때, 싱글스레드의 한계를 보완하기 위해 Event Loop가 콜백을 적절한 타이밍에 실행하도록 조율하는 역할이 더욱 중요해졌다.

브라우저의 Web API(setTimeout, fetch, localStorage, URL, document 등)는 백그라운드에서 비동기 작업을 수행하고, Event Loop는 이를 적절한 시점에 실행하도록 관리한다.

일반적으로 Javascript 소스는 자체 엔진에 있는 Call Stack에 의해 실행컨텍스트들이 적재되고 실행된다. 하지만, 비동기로 동작해야 하는 Web API는 브라우저에서 처리되고 Promise들 같은 경우에는 Microtask Queue에 있다가 Event Loop에 의해 Call Stack이 비어있을 때 Javascript 엔진의 Call Stack으로 넘어오게 된다.

예를 들어, Web API의 setTimeout 함수는 Web API인 Timer API에 의해 정해진 최소 시간만큼 백그라운드에서 시간이 지나게 된다. 그렇게, 시간이 모두 지나면 브라우저의 Task Queue에 쌓이게 되고, Event Loop가 Call Stack이 비어있다고 판단하게 되면 Task Queue에 있던 setTimeout의 콜백함수를 전달하게 된다. 그리고 Javascript 엔진에 의해 실행된다.

Microtask Queue를 사용하는 Promise, MutationObserver같은 친구들도 비슷한데 약간 다르다. Microtask Queue와 Task Queue가 둘 다 적재되어 있는 경우라면 Microtask Queue가 우선권을 갖는다.

> Javascript는 왜 싱글스레드로 설계 되었나?
1996년 넷스케이프에 의해 Javascript가 등장하고 그 당시 멀티 스레드가 보편적으로 깔려있지 않은 세대였기도 하고, 간단한 스크립트 수준을 동작하게 하기 위해서 등장했기 때문에 싱글 스레드로 설계 되었다.

## 예제

### 기본 예제
```js
console.log(1);

setTimeout(() => { 
    console.log(2) 
}, 0);

console.log(3);
```

1. console.log(1) 실행컨텍스트의 경우 바로 콜스택에 적재되고, 실행되어 출력된다.
2. setTimeout의 경우에는 우선 콜스택에 적재된 후 setTimeout의 인자로 전달된 console.log(2)를 WebAPI인 TimerAPI가 최소 0초 후에 실행될 수 있도록 백그라운드에서 시간이 지난 후 Task Queue로 보내서 콜스택이 비어질 때까지 대기하고 있다.
3. 이 때 console.log(3) 실행컨텍스트가 먼저 콜스택에 적재되고, 실행된 후 출력되고 그 다음에 Task Queue에 있는 console.log(2)가 EventLoop에 의해 다시 Call Stack으로 옮겨지게 되고 실행된다.


### Async/Await코드와 섞여 있을 때
```js
const one = () => Promise.resolve('One!');

async function myFunc(){
	console.log('In function!');
	const res = await One();
	console.log(res);
}

console.log('Before Function!');
myFunc();
console.log('After Function!');
```

1. Before Function!
2. In function!
3. After Function!
4. One! : await 키워드를 만나면서 myFunc 함수는 Microtask Queue에 적재되어 있다가 모든 CallStack이 제거되고, CallStack으로 이벤트 루프에 의해 이동된다.

### 응용
```js
const one = () => Promise.resolve('One!');

async function myFunc(){
	console.log('In function!');
	const res = await one();
	console.log(res);
}

console.log('Before Function!');
await myFunc();
console.log('After Function!');
```

최신 자바스크립트에서는 최상위 await를 지원한다.

1. Before Function!
2. In function!
3. One!
4. After Function!

놀라운 결과다. await 키워드를 만났기 때문에 myFunc함수가 통채로 Microtask Queue에 적재되고, After Function!이 실행되어야 할 것 같지만 실제로는 그렇지 않았다.

그 이유는 async/await가 Promise의 문법적 설탕 때문인데, 실제 코드 모습을 보면 myFunc().then(..)이 있고 then 내부에 After Function!을 찍어주는 콘솔이 들어가있기 때문이다. 즉, `await myFunc()` 다음 행 부터는 전부 then 내부에 들어가있기 때문에 then 핸들러의 콜백으로서 Microtask Queue에 적재되어 있다가 이벤트 루프에 의해 Call Stack으로 옮겨지는 것이다.

## 만약, Task Queue 혹은 Microtask Queue가 계속 실행되면 어떻게 될까?

우리가 흔히 사용하는 addEventListener같은 이벤트 핸들러에 무한으로 발생하는 콜백함수를 넣으면 어떻게 될까?

-> 이벤트 핸들러의 콜백함수는 Task Queue에 적재되기 때문에 무한으로 발생하더라도, 다른 이벤트 핸들러 버튼을 클릭했을 때 그 버튼은 동작한다. 이유는 Task Queue 중간에 다른 이벤트 핸들러의 콜백함수가 등록이 되고, 순차적으로 실행되기 때문이다.

Microtask Queue에 적재되는 Promise 객체의 경우에는 Task Queue보다 우선순위가 높아 무한으로 실행되고, 브라우저가 멈추게 된다. 즉, Microtask Queue에 적재되는 Promise 코드나 Mutation Observer 콜백의 경우에는 지나치게 적재하는 것을 피해야 한다.


## 출처
- https://inpa.tistory.com/entry/🔄-자바스크립트-이벤트-루프-구조-동작-원리 [Inpa Dev 👨‍💻:티스토리]
- https://www.youtube.com/watch?v=eiC58R16hb8 [Youtube - EventLoop]