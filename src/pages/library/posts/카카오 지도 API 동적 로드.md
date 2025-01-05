---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-11
title: "카카오 지도 API 동적 로드"
description: "내가 원하는 시점에 외부 모듈을 불러오려면 어떻게 해야될까?"
tags: ["next.js", "외부 모듈"]
---

## 배경

현재 신규 기능을 개발하고 있는 서비스는 인사담당자가 커스텀할 수 있는 채용 사이트 빌더다.

회사의 지도를 추가할 수 있는 기능이 요구됐다.  
따라서 카카오 지도 API를 서비스에 붙이려고 한다.

이 때 지도를 안 쓰는 상황이라면 아예 리소스를 로드하지 않고 싶었다.
그리고 지도 컴포넌트를 여러 번 추가해도, 실제 카카오 스크립트는 한 번만 불러오길 원했다.

## 1차 시도

지도 컨텐츠가 여러 개여도 1번만 로드하기를 원했다.

```tsx
import { useEffect } from 'react';

export const useLoadKakaoScript = () => {
  useEffect(() => {
    // 이미 kakao API load를 했었다면(= window.kakao가 존재하면), 중복 로드를 막고 early return
    if (window.kakao) {
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

### 결과 및 문제점

- 코드 자체는 “한 번 로드하면 끝”이라는 의도대로 작성됐다.
- 문제는 useEffect가 동작하는 시점이 컴포넌트 렌더링 완료 후라는 점.
- 여러 컴포넌트가 동시에 마운트되면, “첫 번째 지도가 로드 후에 kakao 객체가 준비됐을 것이다”라는 보장이 안 된다. React가 batching으로 여러 컴포넌트의 effect를 거의 비슷한 타이밍에 실행시키거나 순서를 뒤집을 수도 있기 때문이다.

그래서 두 번째 지도가 렌더링될 때는 이미 window.kakao가 설정돼 있을 거라고 생각했는데, 실제로는 그렇지 않을 가능성이 있다는 것이다.

## 2차 시도

- 1차 시도의 핵심 아이디어는 window.kakao라는 전역 변수가 완성됐는지(=스크립트가 완전히 로드됐는지)를 체크하는 거였는데, 이걸 좀 더 빠른 시점으로 바꿔보자고 생각했다.  
그래서 HTML에 해당 스크립트 태그가 존재하는지를 먼저 검사했다.  
이러면 스크립트가 실제로 로드됐는지는 상관없이, “이미 dapi.kakao.com 스크립트를 추가하려고 했네?”라는 걸 빠르게 파악할 수 있다고 봤다.

- 카카오 API 로드가 완료된 이후에 지도 컨텐츠 혹은 카카오 API를 이용한 주소 검색 모달을 사용하고자 했다.

```tsx
import { useEffect } from 'react';

export const useLoadKakaoScript = () => {
    const [loadedKakaoMap, setLoadedKakaoMap] = useState(false);
    // 이미 HTML에 dapi.kakao.com 스크립트가 있으면 가져온다
    const existingScript = document.querySelector('script[src*="dapi.kakao.com/v2/maps/sdk.js"]');
  useEffect(() => {
    // 만약 window.kakao가 있거나, existingScript가 있으면 이미 시도 중이거나 로드됐다고 봄
    if (window.kakao || existingScript) {
      setLoadedKakaoMap(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_KEY}&autoload=false&libraries=services,clusterer,drawing`;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        setLoadedKakaoMap(true);
      });
    };
  }, []);

  return [loadedKakaoMap];
};

```

### 결과

결론은 원하는데로 동작했다.

- 원하는 대로 여러 지도 컴포넌트를 넣어도 실제 스크립트는 한 번만 로드됐다.
- 실제로 window.kakao가 준비되기 전에라도, “이미 로드하려고 스크립트 태그가 추가됐는지”로 먼저 체크할 수 있게 됐다.
- loadedKakaoMap 상태를 이용해서 카카오API가 로드됨을 확인한 후 렌더링을 하여 순서를 보장했다.

## 결론
- 사실 Next.js 같은 프레임워크에서는 <Script> 컴포넌트(혹은 <Head>에 직접 추가)로 관리하면 더 안정적일 수도 있다.
- 하지만 지도를 안쓸 때는 window 전역 변수를 오염시키고 싶지 않았기 때문에 그때는 저렇게 동적으로 스크립트를 넣는 방식이 필요할 수밖에 없었다.
- 현재 코드가 완벽하다고 생각하진 않는다. 여러 컴포넌트가 거의 동시에 마운트될 때의 Race Condition 등을 더 확실하게 잡아주려면, 전역에서 Promise 패턴으로 관리하는 방식도 생각해볼 수 있다. 예를 들면 아래와 같은 코드일 것이다.

```ts title="kakaoScriptLoader.ts"
// kakaoScriptLoader.ts
let kakaoScriptLoadingPromise: Promise<void> | null = null;

export function loadKakaoScript(): Promise<void> {
  // 이미 로드가 진행 중이거나 끝났다면, 기존 Promise를 반환하고 재사용
  if (kakaoScriptLoadingPromise) {
    return kakaoScriptLoadingPromise;
  }

  kakaoScriptLoadingPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com/v2/maps/sdk.js"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        resolve();
      } else {
        // 혹시 스크립트는 있지만 아직 로드가 안 끝난 상황 일 때
        existingScript.onload = () => {
          if (window.kakao && window.kakao.maps) {
            resolve();
          } else {
            reject(
              new Error('Kakao script tag found but window.kakao is not ready.')
            );
          }
        };
      }
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      process.env.NEXT_PUBLIC_KAKAO_APP_KEY
    }&autoload=false&libraries=services,clusterer,drawing`;

    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };

    script.onerror = () => {
      reject(new Error('Failed to load Kakao script.'));
    };

    document.head.appendChild(script);
  });

  return kakaoScriptLoadingPromise;
}
```

그리고 ContextAPI도 함께 사용한다면 Provider로 감싸서 선언적으로 제공할 수 있을 것이다.
```tsx title="KaKaoScriptProvider"
export function KakaoScriptProvider({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadKakaoScript()
      .then(() => setIsLoaded(true))
      .catch((err) => {
        setIsLoaded(false);
        setError(err);
      });
  }, []);

  return (
    <KakaoScriptContext.Provider value={{ isLoaded, error }}>
      {children}
    </KakaoScriptContext.Provider>
  );
}
```

나의 경우에는 이번 요구사항에서 2차 시도 코드로 충분히 원하는 동작을 얻었고, 리소스 낭비 없이 지도를 써야 할 때만 로드하도록 만들었다.
좀 더 깔끔하고 안정적인 방법이 있다면 언제든 시도할 의향이 있다.