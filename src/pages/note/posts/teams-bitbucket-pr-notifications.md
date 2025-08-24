---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-01-30
title: "Teams도 Bitbucket PR 알람을 받을 수 있지 않을까?"
description: "Teams에 Bitbucket 연동해보자"
tags: ["teams"]
---

현재 다니는 회사에서 사내 연락망으로 Teams를 사용하고 있다.

기존에 개발자들은 Pull Request를 메일로 확인하거나 직접 Bitbucket에 들어가서 확인했다.
메일은 PR뿐만 아니라 다양한 메일이 오기 때문에 리뷰를 놓치는 경우가 있어서 Teams에서 PR을 받아볼 수 있도록 Teams와 Bitbucket 연동을 시도했다.

사내 보안 관리자와 소통 했는데 과거 Teams에서 IP를 제공해주지 않아서 Bitbucket 화이트리스트에 등록을 못했었다고 한다. 그래서 Teams IP 자료를 찾아서 공유했다.

[Teams IP List](https://learn.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#skype-for-business-online-and-microsoft-teams)

보안 관리자가 Bitbucket에서 IP를 전부 열었을 때는 Teams와 연결에 성공했지만, Teams에서 제공하는 IP를 Bitbucket에 등록했을 때는 연결에 실패했다.

전체 IP를 열어줬을 때 연결에 성공했다는 것은 분명히 뚫려있는 IP가 있다는 것을 의미한다. 성공을 눈 앞에 두고 있었다.

하지만, 아무리 적극적으로 개선을 해보려고 해도 보안 관리자가 도와주지 않는다면 결과를 볼 수 없었다. 눈에 보이는 매출적인 성과만 중요시 여기는 현 분위기에서 보안 담당자의 입장도 이해가 되는 상황이었다.

결과적으로, 개발자들에게 분명히 생산성을 향상시키는 일이지만 끝내 성공하지 못했다. 개발 회사이지만 개발자가 힘이 약한 회사인데다가 불편을 개선하고자 하는 사람이 나 혼자이다보니 더욱 힘이 약했던 것 같다.

다음 회사에서 이런 불편함이 동일하게 있다면 이번 시행착오를 통해서 개선했을 때의 효과를 좀 더 알리고 이해해줄 수 있는 상급자를 만나 프로세스를 꼭 개선해봐야겠다.

## 차선책

차선책으로 Teams에 리뷰방을 만들고 PR을 올렸을 때 리뷰어를 태그해서 채팅을 올리는 방향으로 다 같이 하는 중이다. 리뷰어가 리뷰를 마쳤을 때는 이모지를 다는 방향으로 말이다.

PR을 올린 뒤에 채팅을 다시 한번 올려야하는 불편함이 있지만 메일만으로 알림을 받는 것 보다는 나았다.
