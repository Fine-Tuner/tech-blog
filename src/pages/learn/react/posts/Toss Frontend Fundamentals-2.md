---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-07-30
title: "Toss FrontEnd Fundamentals - 2. 예측 가능성"
description: "Toss에서 만든 FrontEnd Fundamentals에는 어떤 내용이 있을까?"
tags: ["Toss", "FrontEnd"]
---

### A. 이름 겹치지 않게 관리하기

개선 전 : httpLibrary라는 서비스를 사용하고 있다고 가정했을 때 http라는 이름을 지으면 사용처에서 라이브러리를 사용한 것인지, 내부에 추가 작업이 되어있는지 한눈에 구별하기가 어려워 혼란스러움을 유발할 수 있다.

```tsx
// 이 서비스는 `http`라는 라이브러리를 쓰고 있어요
import { http as httpLibrary } from "@some-library/http";

export const http = {
  async get(url: string) {
    const token = await fetchToken();

    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

개선 후 : 명확한 이름을 부여하여 동작을 예측 가능하게 할 수 있다. 완벽하게 혼란을 방지할 수는 없겠지만 오해할 수 있는 가능성을 줄인다.

```tsx
// 이 서비스는 `http`라는 라이브러리를 쓰고 있어요
import { http as httpLibrary } from "@some-library/http";

// 라이브러리 함수명과 구분되도록 명칭을 변경했어요.
export const httpService = {
  async getWithAuth(url: string) {
    const token = await fetchToken();

    // 토큰을 헤더에 추가하는 등 인증 로직을 추가해요.
    return httpLibrary.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
```

### B. 같은 종류의 함수는 반환 타입 통일하기

개선 전 : 같은 유효성을 검사하는 함수인데, 반환 값이 다르기 때문에 혼란을 유발한다.

```tsx
/** 사용자 이름은 20자 미만이어야 해요. */
function checkIsNameValid(name: string) {
  const isValid = name.length > 0 && name.length < 20;

  return isValid;
}

/** 사용자 나이는 18세 이상 99세 이하의 자연수여야 해요. */
function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return {
      ok: false,
      reason: "나이는 정수여야 해요.",
    };
  }

  if (age < 18) {
    return {
      ok: false,
      reason: "나이는 18세 이상이어야 해요.",
    };
  }

  if (age > 99) {
    return {
      ok: false,
      reason: "나이는 99세 이하이어야 해요.",
    };
  }

  return { ok: true };
}
```

개선 후 : 유효성 함수의 반환 값을 통일해서 예측 가능성을 올린다.

```tsx
/** 사용자 이름은 20자 미만이어야 해요. */
function checkIsNameValid(name: string) {
  if (name.length === 0) {
    return {
      ok: false,
      reason: "이름은 빈 값일 수 없어요.",
    };
  }

  if (name.length >= 20) {
    return {
      ok: false,
      reason: "이름은 20자 이상 입력할 수 없어요.",
    };
  }

  return { ok: true };
}

/** 사용자 나이는 18세 이상 99세 이하의 자연수여야 해요. */
function checkIsAgeValid(age: number) {
  if (!Number.isInteger(age)) {
    return {
      ok: false,
      reason: "나이는 정수여야 해요.",
    };
  }

  if (age < 18) {
    return {
      ok: false,
      reason: "나이는 18세 이상이어야 해요.",
    };
  }

  if (age > 99) {
    return {
      ok: false,
      reason: "나이는 99세 이하이어야 해요.",
    };
  }

  return { ok: true };
}
```

**TIP**

유효성 검사 함수의 반환 타입을 `Discriminated Union`(식별 유니언)으로 정의하면 `ok`값에 따라서 `reason`의 존재 유무를 확인할 수 있다.

```tsx
type ValidationCheckReturnType = { ok: true } | { ok: false; reason: string };

function checkIsAgeValid(age: number): ValidationCheckReturnType {
  if (!Number.isInteger(age)) {
    return {
      ok: false,
      reason: "나이는 정수여야 해요.",
    };
  }
  // ...
}

const isAgeValid = checkIsAgeValid(1.1);

if (isAgeValid.ok) {
  isAgeValid.reason; // 타입 에러: { ok: true } 타입에는 reason 속성이 없어요
} else {
  isAgeValid.reason; // ok가 false일 때만 reason 속성에 접근할 수 있어요
}
```

### C. 숨은 로직 드러내기

개선 전 : fetchBalance 함수가 로깅까지 수행할 것이라는 것을 예측하기 어렵다. 로깅 로직에 오류가 발생했을 때 계좌 잔액을 가져오는 로직 자체가 망가질 수도 있다.

```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");

  logging.log("balance_fetched");

  return balance;
}
```

개선 후 : 예측할 수 있는 것만 남기고, 로깅 로직은 별도로 분리한다. 만약에 모든 fetching에 로깅하는 로직이 필요했던 것이라면 미들웨어에 추가하는 방향도 있을 것이다. Props로 로깅을 추가해야 할지 말지를 컨트롤 하는 것이라면 커스텀이 필요할 때는 사용처에서 매번 props로 넘겨줘야 하고, 그러면 fetchBalance와 직접적으로 관련없는 props로 오염의 가능성이 커지게 된다.

```tsx
async function fetchBalance(): Promise<number> {
  const balance = await http.get<number>("...");

  return balance;
}
```

```tsx
<Button
  onClick={async () => {
    const balance = await fetchBalance();
    logging.log("balance_fetched");

    await syncBalance(balance);
  }}
>
  계좌 잔액 갱신하기
</Button>
```

> 코멘트 중에 함수의 반환 타입을 명시해주는 것에 대한 의문을 제기한 의견이 있었다. Typescript가 타입추론 기능으로 인해 자동으로 리턴값을 추론해줄텐데, 왜 명시를 해주는지 의문이라는 내용이었다. 나도 그동안 자동으로 추론이 될만한 부분들에는 명시를 해주고 있지 않았는데 대댓글을 보고 앞으로는 명시적으로 추가 해주는 것이 더 낫겠다라는 생각이 들었다. 그 이유는 코드리뷰 상에서 해당 함수가 반환할 타입에 대해 명확히 알 수 있다는 점, 추후 해당 코드가 수정 될 때 안정성을 확보할 수 있다는 부분 때문이다.
