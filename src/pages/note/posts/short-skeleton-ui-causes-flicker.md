---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-05-06
title: "짧게 끝나는 Skeleton UI는 깜빡거리는 느낌을 준다."
description: "Skeleton UI의 최적화된 사용을 위한 지연 처리 기법"
tags: ["Frontend", "UX", "React", "Performance"]
---

Skeleton UI는 데이터 로딩 중 사용자에게 시각적 피드백을 제공하여 UX를 개선하는 중요한 UI 패턴이다. 대표적인 예로 YouTube의 컨텐츠 로딩 화면을 들 수 있다.

하지만 짧은 로딩 시간을 가진 페이지에서 Skeleton UI를 무분별하게 적용하면, 오히려 사용자 경험을 저하시킬 수 있다. 특히 데이터 fetching이 빠르게 완료되는 경우, Skeleton UI가 너무 짧게 표시되어 화면이 깜빡이는 현상이 발생할 수 있다.

이러한 문제를 해결하기 위해 데이터 fetching과 최소 표시 시간을 동시에 제어하는 방법이 있다. Promise.all을 활용하여 실제 데이터 fetching과 최소 표시 시간을 보장하는 지연 처리를 구현할 수 있다.

```tsx
const delayPromise = (promise: Promise<any>, delay: number) => {
  return Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, delay)),
  ]).then(([data]) => data);
};
```

이 유틸리티 함수를 활용하는 코드는 다음과 같다.

```tsx
const fetchData = async () => {
  return { message: "데이터 로딩 완료" };
};

const App = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchingData = async () => {
      const data = await delayPromise(fetchData(), 500);
      setData(data);
      setIsLoading(false);
    };

    fetchingData();
  }, []);

  if (isLoading) {
    return <Skeleton />;
  }

  return <div>{data && <div>{data}</div>}</div>;
};
```

좋다는 기술을 무조건 사용하기보다는 사용자 입장에서 어떤 경험을 갖게 될지를 고민하고 최적화를 해야 한다.
