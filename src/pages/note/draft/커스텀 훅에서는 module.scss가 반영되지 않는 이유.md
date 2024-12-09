---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-09
title: "커스텀 훅에서는 module.scss가 반영되지 않는 이유"
description: "classNames를 사용하면서 커스텀 훅에서 스타일이 반영되지 않는 이유"
tags: ["커스텀 훅", "classNames"]
---

## 배경
classNames의 bind와 module scss를 사용하고 있었다.
카카오 지도를 붙이기 위해 카카오 모듈을 사용하여 렌더링 하는 로직들을 커스텀 훅에 모아둬서 유지보수성을 향상시켰다.

## 문제
컴포넌트에서도 classNames.bind(styles)를 하고 커스텀 훅에서도 동일한 파일을 import하고 바인딩 시켰다. 그리고 스타일을 할당했다. 하지만, 커스텀 훅에서 렌더링하는 로직에는 class가 먹지 않았다.

## 해결
잘 생각해보면 classNames.bind를 통해서 얻는 모듈화된 유니크한 class들을 동일 컨텍스트 내에서 사용하는게 맞았다. 그래서 styles 파일을 바인딩한 cx변수를 커스텀 훅으로 넘겼고, 그 cx를 사용하니까 정상 동작했다.