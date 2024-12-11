---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-11
title: "Next.js에서 동적으로 script불러오기"
description: "내가 원하는 시점에 외부 모듈을 불러오려면 어떻게 해야될까?"
tags: ["next.js", "외부 모듈"]
---

## 배경
카카오 지도 API를 이용해서 서비스에 붙이고 있다. 사용자 마음대로 편집할 수 있는 채용 사이트를 개발하고 있는데, 사용자가 지도를 여러개 첨부 하더라도 1번만 head태그 내부에 카카오 API script가 존재하는 상황을 만들고 싶었다.

이유는 2번 이상 호출 시에 지도가 정상적으로 그려지지 않을 때가 있기도 하고, 2번 이상 있다는 것 자체가 비정상적인 상황이기 때문이다.

## 1차 시도

처음에는 아래와 같이 설계했다. 마치 좋은 설계처럼 보인다. 하지만 자세히 순차적으로 뜯어보자.
1. 처음에 동일한 컴포넌트들을 전체적으로 렌더링한다.
2. useEffect들이 순차적으로 실행된다. (1번 컴포넌트의 useEffect가 끝났을 때 window.kakao에 들어있을 것이고, 2번 컴포넌트부터는 window.kakao가 있는 상태에서 아래 로직이 실행될 것으로 기대한다.)

하지만, 실질적으로 2번처럼 동작하지 않았다. useEffect가 배치처럼 동시에 실행되면서 1번 컴포넌트의 useEffect가 끝나기 전에 2번, 3번, 4번 컴포넌트의 useEffect가 실행된다. 즉, 절대적인 순서를 보장하지 않고 단지 개별 컴포넌트의 렌더링 완료 이후에 실행된다는 점이다.

이런 이유로 window.kakao를 조건문으로 사용하는 것은 실패했다.

```tsx
import { useEffect } from 'react';

export const useLoadKakaoScript = (callbackFn?: () => void) => {
  useEffect(() => {
    if (window.kakao) {
      callbackFn && callbackFn();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load();
    };
  }, []);
};

```

