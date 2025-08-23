---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-07-22
title: 'React Debugging'
description: 'React를 Debugging해보자'
tags: ["React", "Debugging"]
---

## React에서 디버깅 할 수 있는 방법은 여러가지가 있다.

1. 번들러에서 제공하는 SourceMap을 이용해서 브라우저에서 직접 .jsx나 .tsx파일을 열어서 중단점을 찍고 디버깅 하는 방법.
2. 코드 내 "debugger"를 입력하여 해당 지점에 중단시키는 방법.
3. VSCode나 Cursor같은 IDE에서 디버깅 할 수 있는 방법.

이 3가지 중에서 3번째 방법의 경우를 최근에 자주 사용하고 있는데, 브라우저에서 매번 디버깅하고자 하는 파일을 열 필요도 없고 debugger 소스를 반복적으로 입력할 필요가 없어서 편리하다고 느끼고 있다.

방법은 굉장히 간단하다.

1. Run and Debug를 누른다.
2. Web App (Chrome)을 선택한다.
3. .vscode 폴더 내부에 launch.json파일이 생성될텐데 url만 내가 실행한 로컬 개발환경주소로 바꿔주면 된다.

이제 로컬 개발환경을 실행시키고 IDE에서 제공하는 run and debug를 실행시키기만 하면 소스코드에서 직접 찍은 중단점에 걸리고 variant를 바로 확인해 볼 수 있다.
