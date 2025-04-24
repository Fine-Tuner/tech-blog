---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2023-07-23
title: "리액트에서 TDD ‘잘’하는 방법"
description: "TDD 말로만 들었는데, 어떻게 해야 잘 할수 있을까요?"
tags: ["notion"]
---

## **1. 리액트 컴포넌트 테스트를 위해 Jest와 JestDOM, React Test Library를 사용하는 이유**

우선 리액트에서 컴포넌트 테스트를 하기 위해서 Jest와 RTL(React Test Library)이 같이 필요한 이유를 설명드리겠습니다.

- Jest는 테스트를 할 수 있는 환경을 제공합니다. 기본적인 테스트 문법을 제공합니다. 예를 들면 테스트 케이스들을 묶는 `describe`나 테스트 케이스를 생성하는 `it` , 예측하려고 하는 동작을 인자로 넣는 `expect`가 있습니다.
- React를 사용하기 때문에 컴포넌트를 렌더링 시키고 렌더링 된 DOM Element를 읽어오고 사용자가 실제로 상호작용한다고 가정하고 테스트를 하기 위해 RTL이 필요합니다.
- Jest-DOM도 필요한데 DOM이 어떤 클래스를 가지고 있는지, 몇 번 호출되는지, 어떤 스타일을 가지고 있는지를 테스트 하기위해 `matcher`를 제공합니다. matcher 리스트는 [이곳](https://github.com/testing-library/jest-dom#table-of-contents)에서 확인 가능합니다.

> **왜 많은 테스트 프레임워크 중에 Jest를 사용 했나요?**
>
> 많은 JS 테스트 프레임워크 중에 현재 Jest와 Enzyme가 많이 사용됩니다. 그런데, Enzyme의 경우 컴포넌트의 내부 상태를 더 많이 들여다보는 테스트를 진행합니다. 어떤 상태인지 어떤 props를 가지고 있는지 등을 보죠. 반대로 Jest는 렌더링 된 결과물에 집중합니다. ‘무엇이 좋다’라기 보다는 두 개다 장점을 가지고 있고 현 상황에 맞춰서 목적에 맞게 사용하는 것이 좋을 것 같습니다. 디자인 시스템의 경우 렌더링 된 결과물에 집중하는 것이 좋겠다고 판단했습니다.

## **2. 바로 들어가자! 사용 방법은?**

버튼 컴포넌트로 예시 들겠습니다. 우리는 Jest를 사용하면서 컴포넌트가 정상적으로 결과물을 잘 렌더하고 있는지를 알아보는데 포커스를 맞출 것입니다.

### a. 첫번째 테스트 케이스 : 버튼이 정상적으로 렌더링 되는지 알아보자.

```jsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from './Button';

describe('Button Component', () => {
  const initialProps: ComponentProps<typeof Button> = {
    type: 'button',
    height: 'high',
    bgColor: 'green',
    textColor: 'white',
    borderColor: 'none',
    onClick() {},
    children: '버튼',
  };

  it('버튼이 정상적으로 렌더링 된다.', () => {
    render(<Button {...initialProps}>버튼</Button>);

    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toBeInTheDocument();
  });
```

첫번째 테스트케이스인 **‘버튼이 정상적으로 렌더링 된다’** 입니다.

순서를 해석하면 다음과 같습니다.

1. render 함수로 Button 컴포넌트를 렌더링시킨다.
2. screen에서 `button` role인 DOM 요소를 찾아서 buttonElement에 할당한다.
3. buttonElement는 DOM에 존재한다.

이렇게 해석됩니다. 이 테스트 케이스로 Button 컴포넌트가 initialProps를 전달받을 때 정상적으로 렌더링된다는 사실을 알 수 있습니다.

> render의 결과로 container와 쿼리함수(getBy... 등등)들을 반환받아서 사용할 수 있지만 RTL을 만든 개발자 역시 render후에 screen 객체를 사용하여 쿼리함수들을 다룰 것을 권하고 있습니다. 이유는 render 결과를 디스트럭처링하여 필요한 것들을 매번 적어주고 사용하지 않으면 지워주고 하는 것보다 screen객체를 사용해 필요한 것을 순간순간 적어줄 수 있기 때문입니다. 따라서 이와 같은 패턴이 권장됩니다.

> getByRole을 사용한 이유는 About Queries | Testing Library 공식문서에서 권장하고 있는 쿼리함수의 우선순위에 따라 사용하였습니다.

### b. 두번째 테스트 케이스 : 버튼안에 텍스트가 정상적으로 들어가는지 알아보자.

```
  it('텍스트가 버튼에 정상적으로 나온다.', () => {
    render(<Button {...initialProps}>버튼</Button>);

    const buttonElement = screen.getByText('버튼');
    expect(buttonElement).toBeInTheDocument();
  });

```

위 첫번째 테스트 케이스만 봐도 이제 순서는 설명하지 않아도 될 것 같습니다.

여기서도 마찬가지로 우리가 JS에서 document.body.querySelector.. 를 하는 것처럼 screen.getBy.. 로 DOM 요소를 셀렉하고 있습니다. 여기서 getByText는 DOM에서 ‘버튼’이라는 텍스트를 찾아서 요소를 반환합니다.

### c. 세번째 테스트 케이스 : 버튼 클릭 시 이벤트 핸들러가 수행되는지 알아보자.

```jsx
it("버튼 클릭 시, 이벤트 핸들러가 호출된다.", async () => {
  const handleClick = jest.fn();
  render(
    <Button {...initialProps} onClick={handleClick}>
      버튼
    </Button>,
  );

  const buttonElement = screen.getByRole("button");
  await userEvent.click(buttonElement);
  expect(handleClick).toBeCalledTimes(1);
});
```

여기도 해석해보겠습니다.

1. click 이벤트가 정상적으로 수행되는지 테스트 하기 위해서 onClick에 이벤트 핸들러를 전달해야 합니다.이 때 jest에서 제공하는 jest.fn()를 사용하여 반환받은 mock함수를 전달했습니다.
2. 여기서도 권장하고 있는 쿼리함수 중 가장 우선순위가 높은 getByRole을 이용하여 button Element를 반환받았고 해당 요소를 유저가 실제로 클릭하는 것처럼 테스트를 할 수 있는 userEvent를 사용하였습니다.
3. 그 결과 1번 실행되는지 여부를 테스트 하였습니다.

> **fireEvent vs userEvent**
>
> interaction을 테스트 하기 위해서는 fireEvent와 userEvent가 있습니다. 여기서 우리는 RTL에서 제공하고 있는 userEvent를 사용했는데 이유는 실제로 사용자가 사용하는 것처럼 테스트를 할 수 있기 때문입니다. 예를 들어서 버튼을 클릭하는 경우, 유저는 마우스를 이동하여 버튼 위에 올릴 것이고 클릭을 하게 됩니다. fireEvent로 테스트를 할 경우에는 click에 대한 것만 테스트 하지만 userEvent는 hover후 실제로 클릭하는 상황을 간주하여 테스트가 가능합니다. 이를 통해 좀 더 실제 상황에 어울리는 테스트를 할 수 있습니다.

### d. 네번째 테스트 케이스 : 버튼이 비활성화될 수 있는지 알아보자.

```jsx
it("버튼이 비활성화 될 수 있다.", () => {
  render(
    <Button {...initialProps} disabled>
      버튼
    </Button>,
  );

  const buttonElement = screen.getByRole("button");
  expect(buttonElement).toBeDisabled();
});
```

이제 어떻게 구성되는지 한눈에 들어올 것입니다.

## **결론**

우리는 Jest + Jest-DOM + RTL을 사용하면서 **버튼이 렌더링된 결과물**을 보고 “**기본적으로 렌더링이 되는지, 버튼 안에 텍스트는 들어가있는지, 클릭은 잘 되는지, disabled를 주면 비활성화가 잘 되는지**”를 알아봤습니다.

어떤 기준으로 테스트 코드를 만들면 될지 이해가 조금 되셨나요?

이해를 돕기 위해 좀 더 부연설명을 하면 “내부로 들어가서 몇 번째 태그에 어떤 속성을 가지고 있어야 한다.” 방식의 테스트 코드는 컴포넌트 내부 구조를 강제화하게 됩니다. 강제화되게 된다면 매번 테스트 코드를 수정해야 하는 상황이 필요합니다. 그런데 앞으로 상황에 따라 컴포넌트 내부 구조는 언제든지 바뀔 수 있습니다.

우리는 내부 구조를 정형화해서 항상 정해진 구조를 가지고 있는지 테스트를 해야 하는 것이 아니라 **‘잘' 렌더링 되는지, 이벤트가 '잘' 동작하는지만 보면 됩니다.**

이 부분을 생각하면서 앞으로 테스트 코드를 짜게 되면 좀 더 이해가 쉬우리라 생각됩니다.
