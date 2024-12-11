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

## 2차 시도

그렇다면, 비슷하지만 다른 방법을 생각했다. window객체에 들어있는지 검사를 하지 않고 HTML 자체에 해당 script가 들어있는지 검사하면 어떨까? 라는 생각이었다.

이 생각을 착안하게 된 이유는 window.kakao에 데이터가 들어있는 시점보다 더 빠를 것이라고 판단했기 때문이다.
실제로 아래 코드를 봤을 때 HTML에 script태그가 추가되는 시점은 document.head.appendChild(script)부분이다.

1차 시도 때는 script.onload에 의해 로드 및 파싱이 다 되어서야 window.kakao가 완성되었기 때문에 좀 더 빠르게 조건문에서 걸를 수 있는 방법을 생각했다.

결론은 원하는데로 동일한 컴포넌트가 여러개여도 1번만 추가되었다!

```tsx
import { useEffect } from 'react';

export const useLoadKakaoScript = (callbackFn?: () => void) => {
    const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
  useEffect(() => {
    if (window.kakao || existingScript) {
      callbackFn && callbackFn();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        callbackFn && callbackFn();
      });
    };
  }, []);
};

```

## 결론

동적으로 써드파티를 넣으려고 하는 경우가 아니라면, Next.js에서 제공하는 Script태그를 사용하는 것이 가장 베스트다. 하지만 나는 사용하지 않을 상황이라면 불필요한 태그를 추가하고 싶지 않았기 때문에 위와 같은 과정을 거쳤다. 위 코드가 완벽하다고는 생각하지 않는다. 더 좋은 코드가 있다고 믿는다. 왜냐하면 위 코드는 완벽한 동작을 보장하지는 않는다고 생각하기 떄문이다. 더 좋은 생각이 떠오른다면 해당 포스트는 업데이트 할 예정이다.