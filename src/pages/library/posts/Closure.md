---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2023-02-14
title: '클로저 패턴을 사용해서 유지보수하기 좋도록 모듈화하기'
description: '5000줄이 넘는 코드 속에서 특정 관심사를 모을 수는 없을까?'
tags: ["dev"]
---


## 문제 상황

기존에 몇천명, 몇만명 단위로 채용을 진행하던 내가 소속된 서비스 외에도  
사람인, 원티드 같이 소규모로 수상시 채용할 수 있는 서비스를 사내 다른 팀에서 출시했다.

기존에 있었던 채용 서비스의 회원들을 수상시 쪽으로 유도하기 위해 지원서 작성 버튼을 누르면 수상시 서비스의 로그인 페이지를 거치게 구현하는 것이 요구됐다.

요구사항을 구현하기 위해서는 기존 레거시 프로젝트 여러 js파일들 중간중간에 소스를 삽입해야 됐다.

문제는 각 js파일마다 몇 천줄의 기존 코드가 있다보니 중간중간에 코드를 조금씩 넣게 되면 앞으로 유지보수가 어려워지거나 사이드가 발생했을 때 문제의 원인을 추적하기 어려울 것이라 판단되었다.

고객사의 반대에 의해 롤백을 하거나 변경의 여지가 많을 요구사항이었기 때문에 독립적으로 관리할 수 있는 환경이 필요하다고 판단했다.



## 문제 정의

문제를 다시한번 정리해보자.

- 고객사 반응에 따라 배포 후 롤백을 고려하거나 부분적인 수정이 단기간에 잦은 수정할 가능성이 높다.
- 방대한 코드량 및 복잡도가 높은 코드 사이에 넣어야 하고, 지원서 작성으로 이어지는 모든 페이지 중간에 넣어야 하기 때문에 사이드 가능성이 높다.
- 이 길고 긴 파일에서 모든 변수는 최상단. 즉, 전역에 선언되어있다. 이미 오염된 전역 Scope속에서 어떻게 관리할 것인지를 고민해야 한다.
 

## 해결 방향

새로운 서비스와 연동하는데 필요한 변수들과 함수들을 기존 코드와 격리시키고 메소드명만 보고 어떤 역할을 하는지 알면 좋겠다라고 생각했다. 그래서 클로저 패턴을 사용했다. 

기존에 있던 로직들 사이에서는 클로저가 반환하는 함수만 사용하는 것이다. 이렇게 되면 기존 오래된 서비스 로직을 파악할 때는 새로운 서비스에서 사용되고 있는 로직들을 파악할 필요가 없다. 즉, 클로저 내부에서 어떤 변수가 사용되고, 어떻게 동작하는지 알 필요가 없다. 만약, 새로운 서비스와 연동하는데에서 발생한 문제라면 모듈화한 클로저 속에서 어떤 로직의 문제일 것이니 찾기도 쉬울 것이다.

- DX : 종합적으로 판단했을 때 해당 소스를 모아볼 수 있고, 오염된 전역 Scope가 아닌 별도의 Scope를 만들기 위해 클로저 패턴을 사용하면 좋겠다고 생각했다.
- UX : 다른 도메인과 데이터를 주고받기 위해서 window 객체의 postMessage 메서드를 사용하면 되겠다고 판단했다. 이 때 새 창이 크롬 정책에 의해 차단이 뜨지 않도록 노력했다.



## 코드

간단하게 축약한 코드로 살펴보면 다음과 같다. jodaFn에서는 `init`함수와 `openJobdaLoginPopupAndLoadProfile`함수만 내보내서 필요한 곳에서 사용하고 있다. 이로서 jobda(새로운 서비스)와 관련된 로직을 파악할 때는 이곳만 보면 해당 js파일에서 어떤 로직들이 사용되는지 한눈에 파악할 수 있다.

```js
let RegistResume = (function() {
  let fn, keyData, recruitNoticeList = [], targetRecruitNotice = {}, paramData = {}, interval, modalAgreement = { canMoveNextStep: false }, blockEmailData, jfYn, jdYn;

  keyData = {
    // 수 많은 키와 값들..
  };

  paramData = {
    // 수 많은 키와 값들..
  };

  blockEmailData = ...

  /**
   * JF3 계약 공고 시 지원서 작성 창에서 동작해야 할 로직들을 응집도있게 모아놨다.
   * @type {{init(number): void, openJobdaLoginPopupAndLoadProfile(): void}}
   */
  const jobdaFn = (() => {
    // 클로저 내부에서 관리될 private변수들
    let isJobda = false;
    const urlParmas = new URLSearchParams(window.location.href);
    const accessToken = urlParmas.get('accessToken');

    const checkJobda = () => {
      // 신규 수상시 서비스를 사용할 계약인지
    }

    const checkDirectEnter = () => {
      // 로그인 페이지를 건너뛰고 바로 진입했다면 돌려보낸다.
    }

    const loadJobdaUserProfile = (accessToken, jobnoticeSn) => {
      // 사용자 데이터 요청
    }

    return {
      init() {
        checkJobda();

        if (isJobda) {
          // JF3 계약 시 생성된 공고인데 잡다 로그인 없이 url만으로 바로 들어왔을 때 채용사이트 공고로 다시 보낸다.
          if (!window.opener) {
            checkDirectEnter();
          }
          // 채용사이트를 통해 정상적으로 접근했다면, 잡다 정보를 넣는다.
          loadJobdaUserProfile(accessToken, keyData.jobnoticeSn);
        }
      },
      // 잡다 로그인 페이지를 열었다가 종료하며, 사용자 정보를 받아오고 input Element에 넣는다.
      openJobdaLoginPopupAndLoadProfile() {
        const messageUrl = window.location.href;
        const jobdaDomain = $('#jobdaDomain').val().trim();
        const PAGETYPE = 'mypage';

        const jobdaLogin = window.open(...);

        const jobdaLoginMessageFn = (event) => {
          if (event.origin === jobdaDomain) {
            if (event.data.isJobdaClose) {
              jobdaLogin.close();
            }
            if (event.data.accessToken) {
              jobdaLogin.close();
              loadJobdaUserProfile(event.data.accessToken);
            }
          }
        }
        window.addEventListener('message', jobdaLoginMessageFn, { once: true });
      }
    }
  })();

  fn = {
    // 아래 3천 줄 이상 코드와 수십개의 메서드가 있었다.
    init() {
      fn.load();
      fn.event();
      fn.privatePassword();

      jobdaFn.init();
    },
    load() {
    ...
      jobdaFn.openJobdaLoginPopupAndLoadProfile();
    },
    event() {
    ...
    }
  }
})();
```



## 후기

예상대로였다. 위 개발을 진행하고, 정책이 수십번 바뀌었다. 클로저 패턴으로 모듈화를 잘 해둔 덕분에 수정이 필요할 때마다 다른 이슈를 치다가도 금방 돌아와서 파악하고 수정할 수 있었다. 이 서비스는 간단한 이슈도 해결하려면 반나절~하루 이상 걸리는 서비스인데, 이렇게 이론으로만 알고 있던 패턴을 실제로 사용해서 DX를 향상시키니 좋은 경험이었다.

