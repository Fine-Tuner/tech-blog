---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-01-23
title: "리액트의 useState 간혹 헷갈릴 수 있다"
description: "classNames를 사용하면서 커스텀 훅에서 스타일이 반영되지 않는 이유"
tags: ["커스텀 훅", "classNames"]
---

isForceVisible은 boolean이다.

외부에서 isForceVisible을 true로 줄 수도 있고, false로 줄 수도 있다.

만약에 초기 렌더링에 true를 줬다면

showTooltip는 true를 가지고 Tooltip이 렌더링 될 것이다.

하지만, 그 이후에 false를 주더라도 이미 초기에 실행된 useState는 변경되지 않는다.

즉, showTooltip은 여전히 true를 가지고 있다.

```tsx
export const usePortalTooltip = (
  isForceVisible: boolean = false
) => {
  // isForceVisible은
	const [showTooltip, setShowTooltip] = useState(isForceVisible);

```

→ 이에 대한 해결책으로 props로 받고 있는 isForceVisible는 변경이 되고 있기 때문에 변수를 새로 만들고, 이 변수를 외부로 빼서 렌더링 하는 부분이 showTooltip을 사용하는 것이 아니라 isVisible을 사용하게 한다.

```tsx
const isVisible = showTooltip && isForceVisible;
```

→ 혹은 useEffect를 이용해서 isForceVisible이 바뀌었을 때 showTooltip을 바꾼다.

```tsx
useEffect(() => {
  setShowTooltip(true);
}, [isForceVisible]);
```
