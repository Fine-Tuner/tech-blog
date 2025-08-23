---
layout: ../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-01-30
title: "Teams도 Bitbucket PR 알람을 받을 수 있지 않을까?"
description: "Teams에 Bitbucket 연동해보자"
tags: ["teams"]
---

현재 다니는 회사에서 사내 연락망으로 Teams를 사용하고 있다.

기존에 개발자들은 Pull Request를 메일로 확인하거나 직접 Bitbucket에 들어가서 확인했다.
메일은 PR뿐만 아니라 다양한 메일이 오기 때문에 리뷰를 놓치는 경우가 있어서 Teams에서 PR을 받아볼 수 있도록 Bitbucket 연동을 시도했다.

그러던 중 사내 Atlassian 관리자와 소통 했는데 과거 Teams에서 IP를 제공해주지 않아서 화이트리스트에 등록을 못했었다고 한다. 그래서 Teams IP 자료를 찾아서 공유했다.

https://learn.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide#skype-for-business-online-and-microsoft-teams

IP를 하나씩 적용해보면서 테스트 했을 때는 실패하고, IP를 모두 열어줬을 때는 성공했다. 좀 더 다양한 테스트를 해보고 싶었으나 더 적극적으로 건의하기에는 어려웠다.

## 차선책

차선책으로 Teams에 리뷰방을 만들고 PR을 올렸을 때 리뷰어를 태그해서 채팅을 올리는 방향으로 다 같이 하는 중이다. 리뷰어가 리뷰를 마쳤을 때는 이모지를 다는 방향으로 말이다.