---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-07-30
title: "Toss FrontEnd Fundamentals - 3. 응집도"
description: "Toss에서 만든 FrontEnd Fundamentals에는 어떤 내용이 있을까?"
tags: ["Toss", "FrontEnd"]
---

### A. 함께 수정되는 파일을 같은 디렉토리에 두기

전통적인 방식의 디렉토리 구조가 아닌, feature혹은 도메인 단위로 분리하는 것을 얘기한다.

**전통적인 방식**

```
└─ src
   ├─ components
   ├─ constants
   ├─ containers
   ├─ contexts
   ├─ remotes
   ├─ hooks
   ├─ utils
   └─ ...
```

**개선 방식**

```
└─ src
   │  // 전체 프로젝트에서 사용되는 코드
   ├─ components
   ├─ containers
   ├─ hooks
   ├─ utils
   ├─ ...
   │
   └─ domains
      │  // Domain1에서만 사용되는 코드
      ├─ Domain1
      │     ├─ components
      │     ├─ containers
      │     ├─ hooks
      │     ├─ utils
      │     └─ ...
      │
      │  // Domain2에서만 사용되는 코드
      └─ Domain2
            ├─ components
            ├─ containers
            ├─ hooks
            ├─ utils
            └─ ...
```

> FSD 아키텍처를 적용해서 개발해 본 경험으로, 기존 개발방식에 비해 훨씬 빠른 탐색 속도를 경험할 수 있었다.
