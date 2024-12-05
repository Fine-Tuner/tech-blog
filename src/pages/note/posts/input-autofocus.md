---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-05
title: "Input-autofocus"
description: "input 태그에 autofocus라는 속성이 있다."
tags: ["input"]
---

## 상황
주소 검색 모달 렌더링이 완료되었을 때 주소 검색 input란이 focus되기를 바란 상황이었다.

## trouble shooting
처음에는 useEffect를 사용해서 모달이 렌더링되는 조건을 만족했을 때 input에 focus되도록 구현했다.
하지만, 모달이 렌더링되는 상태가 true가 되고 