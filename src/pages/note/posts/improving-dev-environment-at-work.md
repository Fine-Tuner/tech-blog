---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-05-05
title: "회사 개발환경 개선하기"
description: "레거시 프로젝트의 개발 환경을 개선한 경험 공유"
tags: ["개발환경 개선하기", "Gulp", "Browser-sync", "DX"]
---

최근에 리뉴얼 프로젝트를 여러 번 진행하면서 많은 부분이 개선되었다.

하지만, 아직도 레거시 코드베이스가 상당 부분을 차지하고 있다. 레거시 시스템은 JSP를 이용한 서버사이드 렌더링과 JQuery를 통한 클라이언트 사이드 상호작용으로 구성되어 있다.

기존에는 Javascript 소스 수정 시 Gulp를 통해 변경사항을 감지하고 자동으로 빌드하는 파이프라인이 구축되어 있었다.

하지만, Gulp의 빌드 완료 시점을 개발자가 정확히 파악하기 어려워서, 대부분의 경우 "됐겠거니.." 하면서 브라우저를 새로고침하고 결과를 확인하는 방식으로 작업했다. 빌드가 완료되지 않은 상태에서 새로고침을 하면 변경사항이 반영되지 않아, 다시 기다렸다가 새로고침을 반복해야 하는 문제가 있었다. 이는 개발 생산성을 크게 저하시키는 요인이었다.

이러한 문제로 인해, Gulp watch 기능이 있음에도 불구하고 대부분의 개발자들이 이를 활용하지 못하고 있었다.

이를 개선하기 위해 빌드 과정에서 상세한 로그를 출력하도록 프로세스를 개선했다.

```js
const compileJavascript = (callback) => {
  console.log(new Date().toLocaleTimeString(), "🚀 JS 빌드를 시작합니다.");
  let fileCount = 0;
  let processedCount = 0;

  return src(jsSrc, { sourcemaps: true })
    .pipe(cache("compileJavascript"))
    .pipe(
      through2.obj((file, enc, cb) => {
        fileCount++;
        cb(null, file);
      }),
    )
    .pipe(babel())
    .pipe(
      through2.obj((file, enc, cb) => {
        processedCount++;
        const percent = ((processedCount / fileCount) * 100).toFixed(2);
        console.log(`빌드 진행 중: ${percent}%`);
        cb(null, file);
      }),
    )
    .pipe(
      dest(`${mrs2}/release/js`, {
        sourcemaps: ".",
      }),
    )
    .on("end", () => {
      console.log(
        new Date().toLocaleTimeString(),
        "✅ JS 빌드가 완료되었습니다, Tomcat > Source Update해주세요",
      );
      callback();
    });
};
```

## DX를 더 개선해보자

시간이 지나면서 추가적인 개선 포인트를 발견했다. 빌드 완료를 로그로 확인할 수 있게 된 것은 좋았지만, 여전히 수동으로 브라우저를 새로고침해야 하는 번거로움이 있었다.

Browser-sync를 도입하여 이 문제를 해결했다. Browser-sync는 로컬 개발 서버(8080 포트)와 개발자 사이에 프록시 서버를 두어, 소스 변경 시 WebSocket을 통해 브라우저에 자동으로 변경사항을 반영해주는 도구다.

```js
const watchJs = (done) => {
  browserSync.init({
    proxy: "http://{demo주소}:8080",
    port: 3000,
    open: true,
    notify: false,
    ui: false,
    injectChanges: true,
    watchEvents: ["change", "add", "unlink"],
    watchOptions: {
      ignored: "node_modules",
    },
  });

  console.log("gulp watchJs + browserSync ON");

  // JS 변경 감지 시 빌드 + 브라우저 새로고침
  watch(jsSrc, series(compileJavascript, reloadBrowser));

  done();
};
```

## 결과

개선 전 개발 플로우:

1. Javascript 소스 수정
2. 터미널에서 build 명령어 실행
3. 수동으로 브라우저 새로고침
4. 결과물 확인

개선 후 개발 플로우:

1. Javascript 소스 수정
2. 결과물 확인

이러한 개선을 통해 개발 생산성이 크게 향상되었다. 기존에는 소스 수정마다 약 2분의 대기 시간과 수동 새로고침이 필요했지만, 이제는 소스 수정만으로 변경사항을 즉시 확인할 수 있게 되었다.

2분이라는 시간과 새로고침이라는 행동이 개별적으로는 큰 부담으로 느껴지지 않을 수 있다. 하지만 하루에 수십, 수백 번의 소스 수정이 발생하고, 이 과정이 매일, 매달, 수년간 누적된다면, 시간으로 환산했을 때 상당한 생산성 손실이 발생한다. 이런 비효율성을 개선하는 것은 익숙함에 속아, 별것 아닌 일처럼 느껴지지만 실제로는 굉장히 중요하다.

또한, 좋은 도구가 있음에도 제대로 활용하지 못하는 상황을 경험하면서, 개발 환경 개선의 중요성과 함께 도구의 효과적인 활용 방법을 팀 내에 공유하는 것의 가치를 다시한번 깨달았다.
