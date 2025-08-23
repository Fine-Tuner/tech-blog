---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-05-04
title: "NHN 스마트 에디터 React에 붙이기"
description: "레거시 프로젝트에서 React로 전환 시 스마트 에디터 통합하기"
tags: ["React", "스마트 에디터", "레거시 시스템", "프론트엔드"]
---

## 현재 상황

레거시 프로젝트의 일부를 개발 생산성 향상을 위해 React로 점진적으로 마이그레이션하고 있다.

기존 레거시 프로젝트에서는 NHN 스마트 에디터를 사용하고 있었는데, 신규 개발 페이지에서도 일관된 사용자 경험을 위해 동일한 에디터를 사용해야 했다.

물론 최신 에디터를 도입하면 개발 생산성은 크게 향상될 수 있었지만, 사용자 관점에서는 동일한 서비스 내에서 특정 페이지만 에디터가 다르다면 이질감을 느낄 수밖에 없다.

이런 상황에서 개발 생산성보다 사용자 경험을 우선시해야 하는 순간이 찾아온 것이다.
이 포스팅은 6년 전에 유지보수가 종료된 스마트 에디터를 React 환경에서 통합하는 방법을 정리한 것이다.

현재 ChatGPT나 Cursor와 같은 AI 도구들도 스마트 에디터 관련 질문에 대해 정확한 답변을 제공하지 못하는 상황이다. 따라서, 스마트 에디터를 React 프로젝트에 통합하려는 개발자들에게 유용한 참고 자료가 될 것이다.

## 내부 동작 설명

스마트 에디터는 iframe 기반으로 동작하며, 다음과 같은 순서로 초기화되고 동작한다:

1. **컴포넌트 초기화**

   - `iframeRef`: 에디터가 렌더링될 iframe 요소를 참조
   - `editorInstanceRef`: 스마트 에디터 인스턴스를 저장
   - `onChangeEditorContentRef`: 에디터 내용 변경 시 호출될 콜백 함수를 저장

   ```tsx
   const onChangeEditorContentRef = useRef(onChangeEditorContent);

   useEffect(() => {
     onChangeEditorContentRef.current = onChangeEditorContent;
   }, [onChangeEditorContent]);
   ```

   여기서 `onChangeEditorContent`를 ref로 관리하는 이유는 다음과 같다:

   a. **클로저 문제 해결**:

   - iframe 내부의 이벤트 리스너는 컴포넌트가 리렌더링되어도 유지됨
   - 이벤트 리스너가 처음 등록될 때의 `onChangeEditorContent` 함수를 계속 참조하게 됨
   - ref를 사용하면 항상 최신의 콜백 함수를 참조할 수 있음

   b. **이벤트 리스너 최적화**:

   - 스마트 에디터는 iframe 내부에 중첩된 구조로 되어있어 DOM 접근이 복잡함
   - 일반적인 React 컴포넌트라면 아래와 같이 구현할 수 있음:

   ```tsx
   useEffect(() => {
     // 이벤트 리스너 등록
     element.addEventListener("input", onChangeEditorContent);

     // cleanup
     return () => {
       element.removeEventListener("input", onChangeEditorContent);
     };
   }, [onChangeEditorContent]);
   ```

   - 하지만 스마트 에디터의 경우 iframe 내부의 DOM에 접근해야 함:

   ```tsx
   useEffect(() => {
     const innerFrame = window.document.querySelector("iframe");
     const innerInnerFrame =
       innerFrame?.contentWindow?.document.querySelector("iframe");
     const editor =
       innerInnerFrame?.contentWindow?.document.querySelector(".se2_inputarea");

     // 이벤트 리스너 등록
     editor?.addEventListener("input", onChangeEditorContent);

     // cleanup
     return () => {
       editor?.removeEventListener("input", onChangeEditorContent);
     };
   }, [onChangeEditorContent]);
   ```

   - 이 방식의 문제점:

     1. `onChangeEditorContent`가 변경될 때마다 iframe 내부 DOM에 접근
     2. 이벤트 리스너를 제거하고 다시 등록하는 작업 발생
     3. iframe 내부 DOM 접근은 비용이 큰 작업
     4. 불필요한 메모리 사용과 성능 저하 발생

   - ref를 사용한 최적화된 방식:

   ```tsx
   const onChangeEditorContentRef = useRef(onChangeEditorContent);

   useEffect(() => {
     onChangeEditorContentRef.current = onChangeEditorContent;
   }, [onChangeEditorContent]);

   useEffect(() => {
     const innerFrame = window.document.querySelector("iframe");
     const innerInnerFrame =
       innerFrame?.contentWindow?.document.querySelector("iframe");
     const editor =
       innerInnerFrame?.contentWindow?.document.querySelector(".se2_inputarea");

     // 이벤트 리스너는 한 번만 등록
     editor?.addEventListener("input", (e) => {
       const content = (e.target as HTMLDivElement).innerHTML;
       onChangeEditorContentRef.current(content);
     });
   }, []); // 의존성 배열이 비어있어 한 번만 실행
   ```

   - 이 방식의 장점:
     1. iframe 내부 DOM 접근은 컴포넌트 마운트 시 한 번만 발생
     2. 이벤트 리스너도 한 번만 등록
     3. `onChangeEditorContent`가 변경될 때는 ref 값만 업데이트
     4. 메모리 사용과 성능이 최적화됨

   c. **useEffect의 의존성 배열**:

   - `onChangeEditorContent`가 변경될 때마다 ref를 업데이트하기 위해 의존성 배열에 포함
   - 이를 통해 부모 컴포넌트에서 전달받은 새로운 콜백 함수를 항상 최신 상태로 유지

2. **에디터 초기화 과정**

   ```tsx
   useEffect(() => {
     const window = iframeRef.current
       ?.contentWindow as SmartEditorWindow | null;

     if (window) {
       window.onload = () => {
         // 1. 에디터 인스턴스 객체 생성
         const oEditors: SmartEditorInstance = {
           getById: {},
         };

         // 2. EZCreator를 통한 에디터 생성
         window.nhn.husky.EZCreator.createInIFrame({
           oAppRef: oEditors,
           elPlaceHolder: "editorTxt",
           sSkinURI: `${window.location.origin}/v1/resume/smarteditor/SmartEditor2Skin.html`,
           htParams: {
             bUseVerticalResizer: false,
             nMinWidth: "100%",
             height: "600px",
           },
           fOnAppLoad: () => {
             // 3. 에디터 로드 완료 후 실행될 콜백
             editorInstanceRef.current = oEditors;
             oEditors.getById["editorTxt"].exec("PASTE_HTML", [editorContent]);
             oEditors.getById["editorTxt"].exec("UPDATE_CONTENTS_FIELD", []);

             // 4. 에디터 내용 변경 이벤트 리스너 등록
             const innerFrame = window.document.querySelector("iframe");
             const innerInnerFrame =
               innerFrame?.contentWindow?.document.querySelector("iframe");
             innerInnerFrame?.contentWindow?.document
               .querySelector(".se2_inputarea")
               ?.addEventListener("input", (e) => {
                 const content = (e.target as HTMLDivElement).innerHTML;
                 onChangeEditorContentRef.current(content);
               });
           },
         });
       };
     }
   }, []);
   ```

3. **동작 순서**

   - iframe 로드: `write.html` 페이지가 iframe에 로드됨
   - 에디터 초기화: iframe 로드 완료 후 `onload` 이벤트에서 에디터 초기화 시작
   - 인스턴스 생성: `EZCreator.createInIFrame`을 통해 에디터 인스턴스 생성
   - 스킨 적용: `SmartEditor2Skin.html`을 통해 에디터 UI 스킨 적용
   - 초기 내용 설정: `PASTE_HTML` 명령으로 초기 내용 설정
   - 이벤트 바인딩: 에디터 내용 변경 시 React 컴포넌트에 알림

4. **Tab 전환 시 내용 업데이트**

   ```tsx
   useEffect(() => {
     if (editorInstanceRef.current) {
       editorInstanceRef.current.getById["editorTxt"].exec("SET_IR", [
         editorContent,
       ]);
     }
   }, [activeTab]);
   ```

이러한 구조를 통해 레거시 스마트 에디터를 React 환경에서 안정적으로 사용할 수 있게 되었다.

```tsx
const SmartEditor = ({onChangeEditorContent}: Props) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const editorInstanceRef = useRef<SmartEditorInstance | null>(null);
    const onChangeEditorContentRef = useRef(onChangeEditorContent);

    useEffect(() => {
      onChangeEditorContentRef.current = onChangeEditorContent;
    }, [onChangeEditorContent]);

    useEffect(() => {
      const window = iframeRef.current
        ?.contentWindow as SmartEditorWindow | null;

      if (window) {
        window.onload = () => {
          const oEditors: SmartEditorInstance = {
            getById: {},
          };

          window.nhn.husky.EZCreator.createInIFrame({
            oAppRef: oEditors,
            elPlaceHolder: "editorTxt",
            sSkinURI: `${window.location.origin}/v1/resume/smarteditor/SmartEditor2Skin.html`,
            htParams: {
              bUseVerticalResizer: false,
              nMinWidth: "100%",
              height: "600px",
            },
            fOnAppLoad: () => {
              editorInstanceRef.current = oEditors;
              oEditors.getById["editorTxt"].exec("PASTE_HTML", [editorContent]);

              oEditors.getById["editorTxt"].exec("UPDATE_CONTENTS_FIELD", []);

              const innerFrame = window.document.querySelector("iframe");
              const innerInnerFrame =
                innerFrame?.contentWindow?.document.querySelector("iframe");

              innerInnerFrame?.contentWindow?.document
                .querySelector(".se2_inputarea")
                ?.addEventListener("input", (e) => {
                  const content = (e.target as HTMLDivElement).innerHTML;
                  onChangeEditorContentRef.current(content);
                });
            },
          });
        };
      }
    }, []);

    // Tab 이동 시 초기 템플릿 내용 세팅
    useEffect(() => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.getById["editorTxt"].exec("SET_IR", [
          editorContent,
        ]);
      }
    }, [activeTab]);

    return (
      <EditorContainer>
        <IframeWrapper>
          <Iframe
            ref={iframeRef}
            id={'iframeContainer_iframe'}
            allowFullScreen={true}
            width={"100%"}
            height={"654"}
            scrolling={"no"}
            name="editor"
            frameBorder={"0"}
            src={`${window.location.origin}/v1/resume/smarteditor/write.html`}
          />
        </IframeWrapper>
      </EditorContainer>
    );
  },
);
```
