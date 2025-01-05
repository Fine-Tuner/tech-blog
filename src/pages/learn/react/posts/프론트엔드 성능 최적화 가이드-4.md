---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-29
title: '프론트엔드 성능 최적화 가이드 4장'
description: '프론트엔드 성능최적화 방법에 대해 알아보자.'
tags: ["성능최적화"]
---

## 4장

### Layout Shift
Layout Shift가 발생하는 원인으로 가장 흔한 4가지 경우는 다음 네 가지가 있다.
- 사이즈가 미리 정의되지 않은 이미지 요소
- 사이즈가 미리 정의되지 않은 광고 요소
- 동적으로 삽입된 콘텐츠
- 웹 폰트(FOIT, FOUT)

이번에 살펴볼 경우는 첫번째 경우인, 사이즈가 미리 정의되지 않은 이미지 요소다.

손쉽게 해결할 수 있는 방법은 다음과 같다.
```tsx
function Component () {
    return (
        <div className="wrapper">
            <img className="image" src="...">
        </div>
    )
}
```

```css
.wrapper {
    width: 100%;
    aspect-ratio: 16/9;
}

.image {
    width: 100%;
    height: 100%;
}
```

### 이미지 지연로딩
3장에서 이미지 지연로딩을 위해 Intersection Observer API를 사용했었다. 이번에는 외부라이브러리인 react-lazyload 라이브러리를 사용해본다.

```tsx
function Component() {
    return (
        <div>
        <LazyLoad>
            <img src="..." />
        </LazyLoad>
        </div>
    )
}
```
이제 화면에 표시되기 전까지 이미지는 로드되지 않는다. 이미지뿐만 아니라 컴포넌트도 지연로딩할 수 있다.

스크롤을 내릴 때 더 좋은 UX를 위해서 조금은 미리 사전로드되기를 원할 수 있다. 그럴 때는 offset props를 이용할 수 있다. 아래 예제처럼 1000px을 입력하면 화면에 들어오기 1000px직전 순간에 이미지를 로드한다.
```tsx
function Component() {
    return (
        <div>
        <LazyLoad offset={1000}>
            <img src="..." />
        </LazyLoad>
        </div>
    )
}
```

### 리덕스 - 리렌더링
이미지 갤러리 서비스에서 이미지를 클릭해서 미리보기 화면이 떴을 때 상단의 NavBar뿐만 아니라 배경에 있던 이미지 리스트도 리렌더링하는 것을 확인할 수 있었다.

문제의 원인은 useSelector를 사용해서 인자로 넘기는 함수의 반환값이 매번 다른 객체의 참조값을 반환하기 때문이다.
```tsx
const {} = useSelector(state => ({
    photos:
        state.category.category === 'all'
            ? state.photos.data
            : state.photos.data.filter(
                photo => photo.category === state.category.category
            ),
    loading: state.photos.loading,
}))
```

따라서, 매번 새로운 값이 전달되는 것으로 인지해서 리렌더링이 발생한다.

이를 해결하기 위해 두 가지 방법이 있다.

1. 객체를 새로 만들지 않도록 상태를 개별적으로 나눈다.
2. Equality Function을 사용한다.

먼저 첫 번째 방법은 심플하다. 아래와 같이 개별적으로 나눈다. 다른 상태에 영향을 주지 않게 된다.
```tsx
const modalVisible = useSelector(state => state.imageModal);
const bgColor = useSelector(state => state.imageModal.bgColor);
```

두 번째 방법은 다음과 같다.
참조값으로 비교하는 것이 아니라 이전 값과 변한 값이 동일한지 '값'을 기준으로 비교하는 것이다.

리덕스에서는 자체적으로 제공하고 있는 기능이 있다.
```tsx
const {} = useSelector(state => ({
    photos:
        state.category.category === 'all'
            ? state.photos.data
            : state.photos.data.filter(
                photo => photo.category === state.category.category
            ),
    loading: state.photos.loading,
    }), 
    shallowEqual
)
```
이렇게 하면 참조 값을 비교하지 않고, 객체 내부를 얕은 비교를 해서 각 key의 value들이 이전과 같은지를 비교한다.

그런데 위 로직에 문제점이 하나 있다. filter를 통해서 새로운 배열이 만들어지는 부분이다. filter는 새로운 배열을 만들어낸다. 이전에 만들어진 배열과 매번 참조값이 달라지게 된다. 즉 photos키의 값은 매번 달라지는 것이다.

따라서 이 로직을 분리함으로서 해결할 수 있다.

```tsx
const { category, allPhotos, loading } = useSelector(state => ({
        category: state.category.category,
        allPhotos: state.photos.data,
        loading: state.photos.loading,
    }), 
    shallowEqual
)

const photos = 
    category === 'all' 
        ? allPhotos 
        : allPhotos.filter(photo => photo.category === category);
```

### 메모이제이션
특정 함수의 값을 계산할 때 굉장히 연산이 오래걸리는 로직의 경우 로직 자체를 더 이상 개선할 수 없다면 메모이제이션을 사용해서 반복되는 계산을 줄일 수 있다.

간단하게 코드로 보면 다음과 같다.
```tsx
const cache = {};

function square(n) {
    // 이미 저장된 값이라면 그대로 반환
    if (cache[n]) { 
        return cache[n];
    }

    const result = n*n;
    cache[n] = result;
    return result;
}
```

> 메모이제이션을 사용할 때 주의할 점   
항상 새로운 인자가 들어오는 함수는 메모이제이션을 적용할 경우 오히려 메모리만 잡아먹는 골칫거리가 될 뿐이다. 따라서, 메모이제이션을 사용할 때는 충분히 반복 실행되는지부터 먼저 체크해야 한다.