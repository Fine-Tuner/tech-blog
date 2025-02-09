---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-02-09
title: "VSCode 배경 투명하게 하기"
description: "작업 능률올리기"
tags: ["프로토타입"]
---

1. VSCode Extension으로 Custom UI Style를 설치한다.
2. 아래 옵션을 추가한다.
   ```json
   "custom-ui-style.electron": {
       "frame": false,
       "transparent": true,
       "opacity": 0.98
   }
   ```

> 2025년 2월 10일 기준으로 잘 동작하고 있고, VSCode버전이 올라갔을 때 동작하지 않으면 업데이트 할 예정이다.
