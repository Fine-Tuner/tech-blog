---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2025-08-08
title: "코드 가독성 개선하기"
description: "React에서 코드 가독성을 개선하기"
tags: ["lighthouse"]
---

> 평가자들이 지원자들을 평가하는 평가자 사이트에서
> 기존에 면접보는 구직자들을 관리하는 면접전형의 경우 Card View형태로 보여주고 있었는데
> 서류전형을 관리하는 페이지와 마찬가지로 Table View로 볼 수 있게 해달라는 요청이 왔다.

오늘의 포스팅은 기존에 서류전형에 강한 결합도를 가지고 있던 Table을 분리하여 두 전형에서 재사용할 수 있도록 의존성을 분리하는 작업을 진행하면서 코드 리팩토링도 함께 진행했는데 ‘단일책임원칙’기준에서 개선하면 좋을 것 같은 코드가 많이 보여서, 코드 리팩토링을 어떤 식으로 진행했는지 정리해보고자 한다.

### 기존 코드

useGrid라는 훅 1개로 모든 비즈니스 로직을 관리하고 있다.

동료 개발자가 Grid 컴포넌트를 수정하기 위해 들어왔다고 가정해보자.

현재 코드에서는 어떤 문제가 있을까?

1. **길다.** 우선 수정해야 할 지점을 파악하기 위해서 위에서부터 아래로 한참은 읽어 내려가야 한다.
2. **모르겠다.** useEffect들이 있는데 무슨 역할을 하는지 모르겠다. 내부 코드를 한 줄씩 읽으면서 파악해야 한다.
3. **불안하다.** 관심사가 서로 다른 로직들이 한 파일에 있다보니 수정 했을 때 사이드 발생이 염려된다.

한 줄 요약하면, 개발자는 들어오는 순간 많은 정보량에 답답한 감정이 든다.
적당한 추상화와 단일 책임 원칙이 필요한 순간이다.

```tsx
// Grid.tsx
export const Grid = () => {
  const { gridData, scrollHeight } = useGrid();
  const { headers, response } = gridData;
  const {
    content: applicants,
    totalPages: lastPage,
    totalElements: recordCount,
    pageable: { pageNumber: currentPageIndex, pageSize },
  } = response;

  return (
    // Grid UI
  );
};
```

```tsx
// useGrid.ts
export const useGrid = () => {
  const gridRq = useRecoilValue(gridStateSelector(PAGE_KEY.DOCUMENT));
  const setPageKey = useSetRecoilState(pageKeyAtom);
  setPageKey(PAGE_KEY.DOCUMENT);

  const { data: gridData, refetch } = useScreeningDocumentGridQuery(gridRq);

  useEffect(() => {
    const receiveMessage = (e: MessageEvent) => {
      if (e.origin === window.location.origin) {
        const { pathname } = e.data;

        if (pathname === "/mrs2/eval/resume/popResume") {
          refetch();
        }
      }
    };
    window.addEventListener("message", receiveMessage);

    return () => window.removeEventListener("message", receiveMessage);
  }, []);

  useEffect(() => {
    const $body = document.querySelector("body")!;
    $body.style.overflow = "hidden";

    return () => {
      $body.removeAttribute("style");
    };
  }, []);

  const setCurrentPageSnListAll = useSetRecoilState(currentPageSnListAllAtom);
  const setResultCodeMappings = useSetRecoilState(resultCodeMappingsAtom);
  const setEvaluationItemInfos = useSetRecoilState(evaluationItemInfosAtom);
  const setTotalApplicantCount = useSetRecoilState(totalApplicantCountAtom);
  const setSerialNumberInfoByPage = useSetRecoilState(
    serialNumberInfoByPageAtom,
  );
  const setTotalElements = useSetRecoilState(totalElementsAtom);

  const noticeSn = useRecoilValue(screeningNoticeSnAtom);
  const sectorSn = useRecoilValue(screeningSectorSnAtom);
  const { openAlert } = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    setTotalElements(gridData.response.totalElements);
    setCurrentPageSnListAll(
      gridData.response.content.map((applicant) => applicant.serialNumberInfo),
    );
    setSerialNumberInfoByPage((prev) => {
      return {
        ...prev,
        [gridData.response.pageable.pageNumber]: gridData.response.content.map(
          (applicant) => applicant.serialNumberInfo,
        ),
      };
    });

    setResultCodeMappings(gridData.screeningResultCodeMappings);
    if (!gridData.evaluationItemInfos) {
      openAlert({
        content: [
          "평가척도가 설정되지 않아 평가를 진행할 수 없어요.",
          "해당 전형 설정 메뉴 step3의 평가척도를 확인해 주세요.",
        ],
        callback: () => {
          navigate(-1);
        },
      });
    }
    setEvaluationItemInfos(gridData.evaluationItemInfos);
    setTotalApplicantCount(gridData.response.totalElements);
  }, [gridData, noticeSn, sectorSn]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const scrollHeight =
    windowWidth <= 1100
      ? { height: `calc(100vh - 198px)` }
      : { height: `calc(100vh - 162px)` };

  return {
    gridData,
    scrollHeight,
  };
};
```

### 개선 코드

**첫 번째, 단일 책임 원칙**

hook을 여러개 두어 책임을 분리했다. 예를 들어 `useListenToPopResumeChanges`에서는 이력서 팝업창에서 어떤 변경이 발생했을 때 `message`를 읽는 이벤트 리스너가 있겠구나 하는 짐작을 할 수 있다. `useRemoveScrollBar`도 그리드에 들어왔을 때는 스크롤바를 제거하기 위한 로직이 안에 숨어있구나.를 느낄 수 있다.

이런 식으로, 동료 개발자가 핵심인 `gridData`관련 로직을 수정하려고 하면 `useGridData`훅으로 들어가면 된다는 것을 직감할 수 있다.

```tsx
export default function Grid({ screeningType }: GridProps) {
  // 기존 useGrid에서 처리하고 있는 로직들을 책임에 따라 분리했다.
  const { gridData, refetch } = useGridData({ screeningType });
  const { headers, response } = gridData;
  const {
    content: applicants,
    totalPages: lastPage,
    totalElements: recordCount,
    pageable: { pageNumber: currentPageIndex, pageSize },
  } = response;

  const isShowScrollbar = useRecoilValue(isShowScrollbarAtom);

  useListenToPopResumeChanges({ refetch });
  useRemoveScrollBar();
  const { scrollHeight } = useResizeGridHeight();
  // ----------------------------------------------------

  return (
    // Grid UI
  );
}
```

**두 번째, 적절한 네이밍과 높은 응집도**

이번에는 각 hook내부에 있는 `useEffect`를 보자.

- 익명함수로 작성되어있는 함수를 기명 함수로 바꿨다. 동료 개발자는 useEffect 내부의 로직을 한 줄씩 읽을 필요 없이 함수의 이름만 보고, 수정해야 하는 위치를 짐작할 수 있다.
- 흩어져 있던 로직을 목적과 흐름에 맞게 배치했다. “상태는 위에 useEffect는 전부 아래에”배치하는 것이 아니라 관련있는 상태와 이펙트 함수를 가까운 곳에 두어 **눈의 흐름이 위 아래로 왔다갔다 할 필요 없이 편안하게 읽을 수 있도록 했다.**

```tsx
export const useGridData = ({ screeningType }: Props) => {
  // 공통으로 사용하는 hook
  const { openAlert } = useAlert();
  const navigate = useNavigate();

  // pageKey를 세팅하는 전역상태
  const setGlobalPageKey = useSetRecoilState(pageKeyAtom);
  const pageKey = getPageKeyFromScreeningType({ screeningType });
  useEffect(() => {
    setGlobalPageKey(pageKey);
  }, [pageKey]);

  // grid 관련 데이터를 세팅하고 호출하는 로직들이 흐름에 맞게 위치해있다.
  const setCurrentPageSnListAll = useSetRecoilState(currentPageSnListAllAtom);
  const setResultCodeMappings = useSetRecoilState(resultCodeMappingsAtom);
  const setEvaluationItemInfos = useSetRecoilState(evaluationItemInfosAtom);
  const setTotalApplicantCount = useSetRecoilState(totalApplicantCountAtom);
  const setSerialNumberInfoByPage = useSetRecoilState(
    serialNumberInfoByPageAtom,
  );
  const setTotalElements = useSetRecoilState(totalElementsAtom);

  const noticeSn = useRecoilValue(screeningNoticeSnAtom);
  const sectorSn = useRecoilValue(screeningSectorSnAtom);
  const gridRq = useRecoilValue(gridStateSelector(pageKey));
  const { data: gridData, refetch } = useScreeningDocumentGridQuery(gridRq);

  useEffect(
    function initGridData() {
      setTotalElements(gridData.response.totalElements);
      setCurrentPageSnListAll(
        gridData.response.content.map(
          (applicant) => applicant.serialNumberInfo,
        ),
      );
      setSerialNumberInfoByPage((prev) => {
        return {
          ...prev,
          [gridData.response.pageable.pageNumber]:
            gridData.response.content.map(
              (applicant) => applicant.serialNumberInfo,
            ),
        };
      });
      setResultCodeMappings(gridData.screeningResultCodeMappings);
      setEvaluationItemInfos(gridData.evaluationItemInfos);
      setTotalApplicantCount(gridData.response.totalElements);
    },
    [gridData, noticeSn, sectorSn],
  );

  useEffect(
    function checkEvaluationItemInfos() {
      if (!gridData.evaluationItemInfos) {
        openAlert({
          content: [
            "평가척도가 설정되지 않아 평가를 진행할 수 없어요.",
            "해당 전형 설정 메뉴 step3의 평가척도를 확인해 주세요.",
          ],
          callback: () => {
            navigate(-1);
          },
        });
      }
    },
    [gridData.evaluationItemInfos],
  );

  return {
    gridData,
    refetch,
  };
};
```

## 후기

우리는 각 사정에 따라 빠르게 개발해야될 때가 있다. 시간이 없어서 코드의 가독성을 크게 신경쓰지 못했다면, 언젠가는 부채를 갚아야 한다. 성능이나 유저 인터렉션 관련한 테크니컬 부채뿐만 아니라 가독성 관련 부채도 중요하다. 가독성 부채가 하나 두개 쌓이다보면 시간이 지났을 때 더 이상 손대기 어려운 프로젝트가 되고야 만다.
