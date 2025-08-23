---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-07-30
title: "Toss FrontEnd Fundamentals - 4. 결합도"
description: "Toss에서 만든 FrontEnd Fundamentals에는 어떤 내용이 있을까?"
tags: ["Toss", "FrontEnd"]
---

### Props Drilling 지우기

개선 전 : `ItemEditModal` 컴포넌트로 전달하는 props들이 그대로 `ItemEditBody`로 전달되는 것이 많다.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  // 다른 ItemEditModal 로직 ...

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody
        items={items}
        keyword={keyword}
        onKeywordChange={setKeyword}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
        onClose={onClose}
      />
      {/* ... 다른 ItemEditModal 컴포넌트 ... */}
    </Modal>
  );
}

function ItemEditBody({
  keyword,
  onKeywordChange,
  items,
  recommendedItems,
  onConfirm,
  onClose,
}) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      <ItemEditList
        keyword={keyword}
        items={items}
        recommendedItems={recommendedItems}
        onConfirm={onConfirm}
      />
    </>
  );
}

// ...
```

개선 후 : 조합 패턴을 사용해서 Props를 자식에게 전부 전달하는 문제를 해결할 수 있다. 불필요한 중간 추상화를 제거하여 개발자가 각 컴포넌트의 역할과 의도를 보다 명확하게 이해할 수 있다.

```tsx
function ItemEditModal({ open, items, recommendedItems, onConfirm, onClose }) {
  const [keyword, setKeyword] = useState("");

  return (
    <Modal open={open} onClose={onClose}>
      <ItemEditBody onClose={onClose}>
        <ItemEditList
          keyword={keyword}
          items={items}
          recommendedItems={recommendedItems}
          onConfirm={onConfirm}
        />
      </ItemEditBody>
    </Modal>
  );
}

function ItemEditBody({ children, onClose }) {
  return (
    <>
      <div style="display: flex; justify-content: space-between;">
        <Input
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
        />
        <Button onClick={onClose}>닫기</Button>
      </div>
      {children}
    </>
  );
}
```

**개인적인 생각**

Props Drilling은 React 공부를 시작할 때부터 현재까지 문제의 중심에 있는 내용 같다. 정답이 없기에 더욱 그런 것 같다. 그대로 Props Drilling 하기, 불필요한 depth 줄여보기, Context API, 전역상태 라이브러리 다양한 방법을 시도해봤지만 명확히 이거다! 하는 정답은 없었다.

- Props Drilling을 그대로 사용했을 경우
  - 장점 : 데이터 흐름을 명확히 알 수 있었다. 뒤이어 유지보수 해야 하는 개발자 입장에서 혼란이 없다.
  - 단점 : Props명이 1개라도 변경된다면 다 같이 변경되어야 하고, 해당 컴포넌트가 사용하지 않는 Props를 단순히 자식에게 전달하기 위해서 열어줘야 하는 경우가 많다.
- 불필요한 Depth 줄이기
  - 확실히 할 수 있다면 가장 좋은 방법이다. 현재 Props Drilling을 반드시 해야만 하는 구조인가?를 고민할 때 조합 설계 방법으로 컴포넌트를 나눌 수 있었다.
- Context API
  - 장점 : Props Drilling 없이 사용해야 하는 자식 컴포넌트에서 사용할 수 있다.
  - 단점 : 추후 Context가 제공되고 있는 Provider의 범위, Provider 관리 위치 등을 추적해야 한다는 문제가 있다.
- 전역상태 라이브러리
  - 장점 : 성능적인 이점도 챙기고, 어디서든 사용할 수 있다는 생각에 마음이 편할 수 있다.
  - 단점 : 범위의 제약이 없다는 것은 곧 어디서든 변경될 수 있다는 것을 의미한다. Javascript에서 전역 변수 사용은 자제해야되듯이, 같은 이유로 자제해야 좋다. 하지만, 경험상 도메인 주도 개발을 할 때 해당 도메인의 사이즈가 굉장히 크고 명확하게 다른 도메인들과 구별이 되는 상황이라면 사용하는 것이 DX에서 확실한 강점이 있었다.
