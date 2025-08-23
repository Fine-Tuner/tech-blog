---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-02-19
title: "React Rendering Quiz"
description: "리액트 렌더링 관련 퀴즈를 풀어보자."
tags: ["React Render"]
---

> [리액트 렌더링 퀴즈](https://bigfrontend.dev/react-quiz)

## 1. React re-render 1

```jsx
function A() {
  console.log("A");
  return <B />;
}

function B() {
  console.log("B");
  return <C />;
}

function C() {
  console.log("C");
  return null;
}

function D() {
  console.log("D");
  return null;
}

function App() {
  const [state, setState] = useState(0);
  useEffect(() => {
    setState((state) => state + 1);
  }, []);
  console.log("App");
  return (
    <div>
      <A state={state} />
      <D />
    </div>
  );
}
```

```bash
"App"
"A"
"B"
"C"
"D"
"App"
"A"
"B"
"C"
"D"
```

설명

1. 초기 렌더링: App ~ D컴포넌트 렌더링
2. useEffect 실행: App 컴포넌트부터 다시 렌더링 시작
3. 두 번째 렌더링: App 컴포넌트가 리렌더링 (부모 컴포넌트가 리렌더링되면 모든 자식 컴포넌트들 리렌더링)

## 3. React re-render 3

```jsx
function A({ children }) {
  console.log("A");
  return children;
}

function B() {
  console.log("B");
  return <C />;
}

function C() {
  console.log("C");
  return null;
}

function D() {
  console.log("D");
  return null;
}

function App() {
  const [state, setState] = useState(0);
  useEffect(() => {
    setState((state) => state + 1);
  }, []);
  console.log("App");
  return (
    <div>
      <A>
        <B />
      </A>
      <D />
    </div>
  );
}
```

```bash
"App"
"A"
"B"
"C"
"D"
"App"
"A"
"B"
"C"
"D"
```

설명
