---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-07-30
title: "Toss FrontEnd Fundamentals - 1. 가독성"
description: "Toss에서 만든 FrontEnd Fundamentals에는 어떤 내용이 있을까?"
tags: ["Toss", "FrontEnd"]
---

> 최근에 비즈니스적인 관점에서 서비스의 성공을 위해 달리다보니, 코드 퀄리티적인 부분에서 혹시 내가 신경을 못쓰고 있는 것은 아닐까? 하는 생각이 들었다. 그래서 FrontEnd 계열에서 각광을 받고 있는 Toss에서는 어떤 기조로 어떤 코드스타일을 가져가고 있는지 파악해보고자 한다. 학습을 위해서 필요한 부분만 정리했기 때문에 나와 비슷한 이유를 가지고 있다면 직접 페이지에 들어가서 확인하는 것을 추천한다. [Toss FrontEnd Fundamentals](https://frontend-fundamentals.com/code-quality/)

## 가독성

### 맥락 줄이기

**A. 같이 실행되지 않는 코드 분리하기**

개선 전 : isViewer가 true일 때 useEffect의 early return에 의해 애니메이션을 재생하지 않는다.
isViewer에 따라서 실행되거나 실행되지 않는 로직을 함께 교차하고 있어서 코드를 이해할 때 부담을 준다.

```jsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  useEffect(() => {
    if (isViewer) {
      return;
    }
    showButtonAnimation();
  }, [isViewer]);

  return isViewer ? (
    <TextButton disabled>Submit</TextButton>
  ) : (
    <Button type="submit">Submit</Button>
  );
}
```

개선 후

```jsx
function SubmitButton() {
  const isViewer = useRole() === "viewer";

  return isViewer ? <ViewerSubmitButton /> : <AdminSubmitButton />;
}

function ViewerSubmitButton() {
  return <TextButton disabled>Submit</TextButton>;
}

function AdminSubmitButton() {
  useEffect(() => {
    showAnimation();
  }, []);

  return <Button type="submit">Submit</Button>;
}
```

**B. 구현 상세 추상화하기**

한 사람이 코드를 읽을 때 동시에 고려할 수 있는 총 맥락의 숫자는 제한되어 있다.

불필요한 맥락을 추상화하여 코드를 읽기 쉽게 한다.

**코드 예시1**

아래 코드는 사용자가 로그인되었는지 확인하고, 로그인이 되었다면 홈으로 이동시키는 로직이다.

개선 전 : `useCheckLogin`, `onChecked`, `status`, `“LOGGED_IN”`같은 변수나 값을 모두 읽어야 무슨 역할을 하는 코드인지 파악하다. 이 코드에 이어서 로그인 관련 로직들도 밑에 나오는데 `LoginStartPage` 컴포넌트가 무슨 역할을 하는지 알기 위해서 한 번에 이해해야 하는 맥락이 많다.

```jsx
function LoginStartPage() {
  useCheckLogin({
    onChecked: (status) => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    },
  });

  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

개선 후 : 사용자가 로그인 되었는지 확인하고 이동시키는 로직과 로그인 관련 로직을 분리한다.

`HOC`, `Wrapper` 로 분리해서 불필요한 의존 관계가 생기는 복잡한 관계를 막는다.

**Wrapper**

```jsx
function App() {
  return (
    <AuthGuard>
      <LoginStartPage />
    </AuthGuard>
  );
}

function AuthGuard({ children }) {
  const status = useCheckLoginStatus();

  useEffect(() => {
    if (status === "LOGGED_IN") {
      location.href = "/home";
    }
  }, [status]);

  return status !== "LOGGED_IN" ? children : null;
}

function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}
```

**HOC**

```jsx
function LoginStartPage() {
  /* ... 로그인 관련 로직 ... */

  return <>{/* ... 로그인 관련 컴포넌트 ... */}</>;
}

export default withAuthGuard(LoginStartPage);

// HOC 정의
function withAuthGuard(WrappedComponent) {
  return function AuthGuard(props) {
    const status = useCheckLoginStatus();

    useEffect(() => {
      if (status === "LOGGED_IN") {
        location.href = "/home";
      }
    }, [status]);

    return status !== "LOGGED_IN" ? <WrappedComponent {...props} /> : null;
  };
}
```

> 개인적으로 HoC 방식보다는 wrapper 방식을 선호한다. 그 이유는 최근에 일반적으로 많이 사용하는 코드 스타일인 것도 한 몫 하겠지만 코드의 흐름이 일관적이지 않다. 위에서 아래로 쭉 읽으면 되는 것이 아니라 HoC를 사용하는 export 구문을 확인해야 하고 로그인 인증이 되었을 때 children을 return을 할 것이라고 예상할 수 있는 wrapper방식에 비해 HoC방식은 예상하기 쉽지 않아서 내부 구현체를 확인해야 한다.

**코드 예시2**

개선 전 : 맥락이 많아 복잡하고 이벤트 핸들러인 handleClick과 실제 컴포넌트 사이 거리가 멀어서, 응집도가 좋지 않다. 스크롤을 많이 이동해야 한다.

```jsx
function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  const handleClick = async () => {
    const canInvite = await overlay.openAsync(({ isOpen, close }) => (
      <ConfirmDialog
        title={`${data.name}님에게 공유해요`}
        cancelButton={
          <ConfirmDialog.CancelButton onClick={() => close(false)}>
            닫기
          </ConfirmDialog.CancelButton>
        }
        confirmButton={
          <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
            확인
          </ConfirmDialog.ConfirmButton>
        }
        /* 중략 */
      />
    ));

    if (canInvite) {
      await sendPush();
    }
  };

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <Button onClick={handleClick}>초대하기</Button>
      {/* UI를 위한 JSX 마크업... */}
    </>
  );
}
```

개선 후 : 버튼과 실행되는 로직이 가까워지고, 한번에 인지해야 하는 내용이 적어졌다. 응집도와 가독성이 좋아졌다.

```jsx
export function FriendInvitation() {
  const { data } = useQuery(/* 생략.. */);

  // 이외 이 컴포넌트에 필요한 상태 관리, 이벤트 핸들러 및 비동기 작업 로직...

  return (
    <>
      <InviteButton name={data.name} />
      {/* UI를 위한 JSX 마크업 */}
    </>
  );
}

function InviteButton({ name }) {
  return (
    <Button
      onClick={async () => {
        const canInvite = await overlay.openAsync(({ isOpen, close }) => (
          <ConfirmDialog
            title={`${name}님에게 공유해요`}
            cancelButton={
              <ConfirmDialog.CancelButton onClick={() => close(false)}>
                닫기
              </ConfirmDialog.CancelButton>
            }
            confirmButton={
              <ConfirmDialog.ConfirmButton onClick={() => close(true)}>
                확인
              </ConfirmDialog.ConfirmButton>
            }
            /* 중략 */
          />
        ));

        if (canInvite) {
          await sendPush();
        }
      }}
    >
      초대하기
    </Button>
  );
}
```

> 변화가 자주 발생할 수 밖에 없는 환경이나 과도한 추상화는 오히려 DX를 해치는 경험도 했었다. 적당한 중간지점을 찾는것이 중요한 것 같다.

**C. 로직 종류에 따라 합쳐진 함수 쪼개기**

개선 전

`usePageState` 훅은 페이지 전체의 URL 쿼리 파라미터를 한 번에 관리한다.

성능 : 이 hook을 사용하는 컴포넌트는, 이 hook이 관리하고 있는 어떤 쿼리파라미터가 수정되더라도 리렌더링이 발생한다.

```jsx
import moment, { Moment } from "moment";
import { useMemo } from "react";
import {
  ArrayParam,
  DateParam,
  NumberParam,
  useQueryParams
} from "use-query-params";

const defaultDateFrom = moment().subtract(3, "month");
const defaultDateTo = moment();

export function usePageState() {
  const [query, setQuery] = useQueryParams({
    cardId: NumberParam,
    statementId: NumberParam,
    dateFrom: DateParam,
    dateTo: DateParam,
    statusList: ArrayParam
  });

  return useMemo(
    () => ({
      values: {
        cardId: query.cardId ?? undefined,
        statementId: query.statementId ?? undefined,
        dateFrom:
          query.dateFrom == null ? defaultDateFrom : moment(query.dateFrom),
        dateTo: query.dateTo == null ? defaultDateTo : moment(query.dateTo),
        statusList: query.statusList as StatementStatusType[] | undefined
      },
      controls: {
        setCardId: (cardId: number) => setQuery({ cardId }, "replaceIn"),
        setStatementId: (statementId: number) =>
          setQuery({ statementId }, "replaceIn"),
        setDateFrom: (date?: Moment) =>
          setQuery({ dateFrom: date?.toDate() }, "replaceIn"),
        setDateTo: (date?: Moment) =>
          setQuery({ dateTo: date?.toDate() }, "replaceIn"),
        setStatusList: (statusList?: StatementStatusType[]) =>
          setQuery({ statusList }, "replaceIn")
      }
    }),
    [query, setQuery]
  );
}
```

개선 후

단일 책임 원칙처럼 담당하는 책임을 분리하여 hook 이름이 더욱 명확한 이름을 갖는다. 또한 Hook을 수정했을 때 영향이 가는 범위를 좁혀서, 예상하지 못한 변경이 발생하는 것을 막는다.

```jsx
import { NumberParam, useQueryParam } from "use-query-params";

export function useCardIdQueryParam() {
  const [cardId, _setCardId] = useQueryParam("cardId", NumberParam);

  const setCardId = useCallback((cardId: number) => {
    _setCardId({ cardId }, "replaceIn");
  }, []);

  return [cardId ?? undefined, setCardId] as const;
}
```

### 이름 붙이기

**A. 복잡한 조건에 이름 붙이기**

개선 전

- 변수명만으로 어떤 결과값인지 파악할 수가 없다
- 내부 조건들을 직접 해석해야 한다.

```jsx
const result = products.filter((product) =>
  product.categories.some(
    (category) =>
      category.id === targetCategory.id &&
      product.prices.some((price) => price >= minPrice && price <= maxPrice),
  ),
);
```

**개선 후**

- 명시적인 변수명
- 내부 조건들을 변수화하여, 직접 로직을 해석하지 않아도 코드의 의도를 명확히 할 수 있다.

```jsx
const matchedProducts = products.filter((product) => {
  return product.categories.some((category) => {
    const isSameCategory = category.id === targetCategory.id;
    const isPriceInRange = product.prices.some(
      (price) => price >= minPrice && price <= maxPrice,
    );

    return isSameCategory && isPriceInRange;
  });
});
```

> 단, 모든 상황에 조건식에 이름을 붙여야 되는 것은 아니다. 로직이 매우 간단할 때는 굳이 이름을 붙이지 않아도 되고, 특정 로직 내에서 한 번만 사용될 때 복잡하지 않으면 직접 로직을 적는 것이 더 직관적일 수 있다. 상황에 따라 비교하면서 판단하면 된다.

그리고 위 개선 후 코드보다 더 가독성 좋은 코드는 아래와 같이 단일 책임 원칙에 더 가깝게 조건을 나누는 방식이다.

```jsx
const isSameCategory = (category: Category) => category.id === targetCategory.id;

const isPriceInRange = (price: number) => price >= minPrice && price <= maxPrice;

const hasMatchingCategory = (product: Product) =>
  product.categories.some((category) => isSameCategory(category));

const hasPriceInRange = (product: Product) =>
  product.prices.some((price) => isPriceInRange(price));

const matchedProducts = products.filter(
  (product) => hasMatchingCategory(product) && hasPriceInRange(product)
);
```

**B. 매직 넘버에 이름 붙이기**

개선 전 : 300이란 숫자의 의도를 알 수 없다. 테스트 코드인지, 애니메이션 때문에 기다리는건지 등

```jsx
async function onLikeClick() {
  await postLike(url);
  await delay(300);
  await refetchPostLike();
}
```

개선 후 : 어떤 의미에서 300이란 숫자를 사용한 것인지 알 수 있다.

```jsx
const ANIMATION_DELAY_MS = 300;

async function onLikeClick() {
  await postLike(url);
  await delay(ANIMATION_DELAY_MS);
  await refetchPostLike();
}
```

### 위에서 아래로 읽히게 하기

**A. 시점 이동 줄이기**

개선 전 : `getPolicyByRole` > `POLICY_SET` 순으로 읽으면서 들어가야 한다.

```jsx
function Page() {
  const user = useUser();
  const policy = getPolicyByRole(user.role);

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}

function getPolicyByRole(role) {
  const policy = POLICY_SET[role];

  return {
    canInvite: policy.includes("invite"),
    canView: policy.includes("view"),
  };
}

const POLICY_SET = {
  admin: ["invite", "view"],
  viewer: ["view"],
};
```

개선 후 : 코드를 위에서 아래로 자연스럽게 읽을 수 있다.

```jsx
function Page() {
  const user = useUser();

  switch (user.role) {
    case "admin":
      return (
        <div>
          <Button disabled={false}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    case "viewer":
      return (
        <div>
          <Button disabled={true}>Invite</Button>
          <Button disabled={false}>View</Button>
        </div>
      );
    default:
      return null;
  }
}
```

혹은, 권한을 다루는 로직을 컴포넌트 안에서 객체로 관리해서 시점 이동없이 한눈에 조건을 파악할 수 있게 한다.

```jsx
function Page() {
  const user = useUser();
  const policy = {
    admin: { canInvite: true, canView: true },
    viewer: { canInvite: false, canView: true },
  }[user.role];

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

> 코멘트에서 policy 객체를 생성하는 방법에 대해 리렌더링 될 때마다 객체가 생성되고, 제거되어 메모리 사용이 반복되기 때문에 컴포넌트 외부 상수로 분리하는 방법과 컴포넌트 내부에 두는 방법의 트레이드 오프를 고민 중인 댓글이 있었다. 대댓글로, 볼륨이 그렇게 크지도 않고 가비지 컬렉션에 의해 회수 될 거라서 큰 부담이 없기 때문에 메모리 측면보다 코드 재사용이 되지 않는다면 컴포넌트 내부에 위치시킬 것 같다는 의견이 있었다. 나도 개인적으로 내부에 두었을 때 생산성이 더 좋다면, 내부에 두는 것을 선호하는데 역시 많은 프론트 개발자가 같은 고민을 한다는 것을 엿볼 수 있었다.

```jsx
function Page() {
  const user = useUser();
  const policy = getPolicyByRole(
    {
      admin: { canInvite: true, canView: true },
      viewer: { canInvite: false, canView: true },
    },
    user.role,
  );

  return (
    <div>
      <Button disabled={!policy.canInvite}>Invite</Button>
      <Button disabled={!policy.canView}>View</Button>
    </div>
  );
}
```

```tsx
type Role = "admin" | "user" | "guest";
const getPolicyByRole = (policy: Record<Role, string[]>, role: Role) => {
  return policy[role];
};
```

> 위 내용은 또 다른 흥미로운 코멘트에서 제안한 방법이다. 1안처럼 switch문으로 했을 때 상태가 변경되었을 때 컴포넌트가 unmount, mount되는 과정이 인터랙션과 엮여있는 케이스에서는 좋지 않을 것을 염려하여 2안에다가 좀 더 type-safe한 형태를 제안했다.

**B. 삼항 연산자 단순하게 하기**

> 삼항연산자, Switch문에 대해 많은 토론이 오가는 페이지를 봤다. 평소에 한번쯤 생각했을법한 다양한 패턴들이 다 나오고 있다. 결론은 JSX는 JS의 문법적 설탕일 뿐이기 때문에. 가독성에 정답은 없다는 것이다. [조건부 렌더링 처리, 다들 어떻게 처리하시나요?](https://github.com/toss/frontend-fundamentals/discussions/4)
