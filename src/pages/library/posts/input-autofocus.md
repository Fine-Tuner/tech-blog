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
아래 예제에서 show가 true가 되면 화면에 모달이 뜰 것이고 이 때 inputRef는 화면에 있을 것이라고 생각하여 짠 로직이다.
하지만, 실제로는 show가 true가 되더라도 아직 화면에 렌더링이 끝나지 않아서 ref가 null인 상태였다.
(작은 react 프로젝트를 만들고, 실험했을 때는 내가 생각한데로 잘 동작하는 것을 확인했지만 현재 서비스에서는 의도대로 동작하지 않았다.)
```tsx
  useEffect(() => {
    if (show && searchInputRef.current) {
        searchInputRef.current.focus();
    }
  }, [show]);
```

타이밍의 문제라고 생각이 되어, 마이크로 태스크 큐에 넣어서 우선순위를 한단계 늦추는 방법을 생각했다.
결과적으로 의도대로 해결은 가능했다.
하지만, 이 방법은 모던하지 않은 방법이라고 생각했다. 더 좋은 생각이 없을지 생각해봤다.
```tsx
  useEffect(() => {
    setTimeout(() => {
      if (show && searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 0);
  }, [show, searchInputRef]);
```

requestAnimationFrame으로 DOM이 렌더링 된 직후에 안정적으로 수행하게도 가능했다.
```tsx
if (show) {
      // requestAnimationFrame으로 렌더링 후 작업 예약
      const rafId = requestAnimationFrame(() => {
        if (inputRef.current) {
          inputRef.current.value = '초기 텍스트2222';
        }
      });

      // cleanup 함수로 requestAnimationFrame 취소
      return () => cancelAnimationFrame(rafId);
    }
  }, []);
```

## 결론
위와 같은 시도로 해결은 가능했지만, 좀 더 찾아보니 autoFocus라는 속성이 input태그에 네이티브하게 존재했었다. 하하..
혹시 리액트에서 자체적으로 제공하는 프로퍼티일까 싶어서 검색을 해보니 이미 html5부터 있었다. 브라우저 호환성도 완벽했다.

결과적으로, show가 true일 때 autoFocus속성이 true가 되는 조건을 넣어줬더니 원하는데로 동작했다.
나름, html5의 태그들에 대부분 속성을 알고 있다고 생각했는데 아직 부족한 것 같다.
날 잡고 MDN을 가볍게라도 쭉 훑어보는 시간을 가져야겠다.

```tsx
return (
  <TextField autoFocus={show}>
)
```