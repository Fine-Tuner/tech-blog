---
layout: ../../../../layouts/MarkdownPostLayout.astro
pubDate: 2024-12-30
title: "SwiftUI"
description: "SwiftUI를 학습해보자."
tags: ["SwiftUI"]
---

> **Swift를 공부하는 이유**  
> 한 분야에서 잘하는 것도 중요하지만 분야에 제한없이 만들고 싶은 것을 만들 수 있어야 된다고 생각하던 중 지인의 연락을 받고 함께 LLM을 활용하여 Obsidian + GoodNote의 장점을 섞은 서비스를 만들어보기로 했다.

> - [참고한 공식문서 튜토리얼](https://developer.apple.com/tutorials/swiftui-concepts/exploring-the-structure-of-a-swiftui-app)
> - [참고한 강의](https://www.youtube.com/watch?v=N-ntKJdVNBs&list=PLwvDm4VfkdphqETTBf-DdjCoAvhai1QpO&index=2)

## SwiftUI vs UI Kit

UIKit는 AppStore가 등장한 2008년에 등장하여 기존 앱들은 UI Kit으로 만들어졌다.

하지만, 2019년에 SwiftUI가 등장한 이후로는 Apple에서 SwiftUI의 미래를 그리고 있으며 기존 앱들은 SwiftUI를 사용하여 마이그레이션을 하기도 한다.

## XCode Project Setting

새 프로젝트를 만들 때 다음을 입력해야 한다.

- Product Name: 제품 이름 (특수기호나 공백을 넣지말자. 이유는 바로 뒤에 나오지만 번들 식별자에 포함될 것이기 때문이다, 이는 나중에 문제를 일으킬 수 있다)
- Team: App Store에 올릴려면 전문가 계정이어야 한다.
- Organization Identifier: 조직 식별자다. 공부용이니까 com.myorganization 으로 만든다. 입력하면 Bundle Identifier이 Product Name과 합쳐서 만들어진다.

## 프로젝트 관리

좌측 파일 탐색기에서 제일 상단의 폴더를 클릭하면 금방 세팅한 프로젝트 설정 외에도 다양한 설정 기능들이 나온다.

![](/learn/swift/images/2024-12-30-23-23-10.png)

Version의 경우 외부에 공개할 버전이다. Build의 경우 만약에 1.0.1이라는 Version에서 버그가 발생해서 기능 추가나 개선 없이 bug만 잡고 퍼블리싱하는 경우 Build숫자를 올려서 고쳤음을 팀원들에게 알릴 수 있다.

Minimum Deployments의 경우 사용자가 사용할 수 있는 최소 버전을 의미한다. 높은 버전일수록 버그도 개선되고 기능도 추가되었기 때문에 더 많은 것을 할 수 있다.
하지만, 바로 최신버전을 보통 선택하지 않는 이유는 모든 사용자가 업데이트를 바로하지 않기 때문이다.

렌더링 될 방향을 정해놓을 수도 있다. Deployment Info > iPhone Orientation 에서 가로방향으로만 출력되게 하려면 Portrait와 Upside Down 체크박스를 해제한다. 반대로 세로방향으로만 출력되게 하려면 Portrait, Upside Down만 체크하거나 만약에 FaceID등을 반드시 사용해야 하는 앱의 경우 Portrait만 체크해서 기본적인 세로방향만 지원하도록 한다.

앱 아이콘을 지정할 수 있다. App Icons and Launch Screen > App Icon의 이름을 지정할 수 있다. 여기서 지정할 아이콘의 asset폴더는 좌측 파일 탐색기에서 Assets폴더에서 확인할 수 있다.
![](/learn/swift/images/2024-12-30-23-36-51.png)

## 컴포넌트

### Text

우측 상단에 있는 + 버튼을 눌러서 원하는 요소를 검색할 수 있다.

![](/learn/swift/images/2024-12-30-23-09-01.png)

또한 이 텍스트에 대한 세부 설정을 하려면 우측 패널에서 제일 우측에 있는 설정 아이콘을 클릭하면 폰트를 변경하는 등의 세부 작업을 할 수 있다.

![](/learn/swift/images/2024-12-30-23-12-20.png)

코드로 작성할 경우 1번 방법처럼 폰트를 적용할 수도 있고, 2번 방법처럼 폰트를 적용할 수도 있다.

> 2번 방법의 size 부분을 보면 정적인 사이즈를 주고 있는 것을 볼 수 있는데, 이렇게 주게 되면 font(.title) 이런 식으로 줬을 때처럼 동적으로 사이즈를 대응할 수 없다. (아이폰, 아이패드 등등..)

```swift
import SwiftUI

struct textTest: View {
    var body: some View {
        Text("Hello, World!")
        // 1번 방법
//            .font(.body)
//            .fontWeight(.bold)
//            .foregroundColor(Color.red)
//            .underline(color: Color.red)
//            .strikethrough(color: Color.green)

        // 2번 방법
            .font(.system(size: 24, weight: .semibold, design: .serif))
    }
}
```

여러 줄을 입력하는 경우

```swift
import SwiftUI

struct textTest: View {
    var body: some View {
        Text("Hello my name is ParkTaejoon! This is Swiftful Thinking Bootcamp. I am really enjoying this course and learning alot")
            .multilineTextAlignment(.center)
    }
}
```

텍스트가 들어갈 Frame크기를 지정하고, 각 문자의 첫번째가 대문자가 될 수 있게 하고 텍스트의 색상을 바꾸고, 자간(kerning) 및 Frame에 모든 글자가 딱맞게 들어갈 수 있도록 조정할 수도 있다.

> multiline 좌우정렬은 우측인데, Frame의 정렬을 좌측으로 설정하게 되면 만약 한 줄로 텍스트가 나올 경우에는 좌측에 정렬하게 해주고 여러 줄일 경우 우측에 정렬되게 해준다.

```swift
import SwiftUI

struct textTest: View {
    var body: some View {
        Text("Hello world".capitalized)
            .font(.system(size: 24, weight: .semibold, design: .serif))
            .baselineOffset(30.0) // 줄 높이
            .multilineTextAlignment(.trailing) // 좌우 정렬
            .foregroundStyle(Color.red) // 텍스트 색상
            .kerning(5) // 자간
            .frame(width: 200, height: 200, alignment: .leading) // 프레임 크기 및 정렬 설정
            .minimumScaleFactor(0.1) // 0.1로 하면 Frame에 딱맞게 들어간다.
    }
}
```

### Circle

```swift
struct CircleTest: View {
    var body: some View {
        // Ellipse, Capsule도 동일한 메서드를 이용할 수 있다.
        Circle()
            .trim(from: 0.2, to: 1.0)
            .stroke(Color.purple, lineWidth: 10)
            .frame(width: 100, height: 100)
    }
}
```

![](/learn/swift/images/2025-01-02-14-52-31.png)

> 추후 애니메이션을 Spinner를 만들 수 있다.

### Rectangle

버튼 같은 요소처럼 배경으로 적절하다.

> Circle 및 Rectangle 이런 Shape들은 fill, foregroundColor(배경), stroke, trim 다 사용할 수 있다.

```swift
struct CircleTest: View {
    var body: some View {
        // Rectangle().frame(width: 200, height: 100)
        RoundedRectangle(cornerRadius: 10)
            .frame(width: 100, height: 50)
    }
}
```

## Color

### 특정 Hex코드 사용핳기

특정 Hex코드의 색상을 사용하고 싶을 수 있다.

> Edit > Format > Show Color에서 색상 선택하거나 #colorLiteral()을 입력하면 색상을 선택할 수 있다.

```swift
RoundedRectangle(cornerRadius: 25)
    .fill(Color(#colorLiteral(red: 0, green: 1, blue: 0.6039558649, alpha: 1)))
    .frame(width: 200, height: 100)
```

![](/learn/swift/images/2025-01-02-15-13-53.png)

### 시스템 컬러 사용하기

특히 배경색상을 지정할 때 흰색말고 시스템 배경색(옅은 회색)을 사용하고 싶을 때 유용하다. (화이트/다크모드 지원)

```swift
RoundedRectangle(cornerRadius: 25)
    .fill(Color(UIColor.secondarySystemBackground))
    .frame(width: 200, height: 100)
```

### 직접만든 커스텀 컬러 사용하기

LNB > Assets에서 컬러를 직접 하나 만들어둘 수 있다.

![](/learn/swift/images/2025-01-02-16-23-38.png)

사용할 때는 다음과 같이 문자열을 넣어주면 된다.

```swift
RoundedRectangle(cornerRadius: 25)
    .fill(Color("CustomColor"))
```

### Shadow 넣기

(default)radius값만 넣을 수도 있고, 색상 및 XY좌표로 얼마나 이동시킬지도 결정할 수 있다.

> Color에 opacity로 투명도 조절할수도있다.

```swift
RoundedRectangle(cornerRadius: 25)
    .fill(Color("CustomColor"))
    .frame(width: 200, height: 100)
    // .shadow(radius: 20)
    .shadow(color: Color.red.opacity(0.3), radius: 10, x: 20, y: 10)
```

### Gradient 넣기

리니어

```swift
RoundedRectangle(cornerRadius: 25.0)
    .fill(
        LinearGradient(
            gradient: Gradient(colors: [Color(#colorLiteral(red: 0.8039215803, green: 0.8039215803, blue: 0.8039215803, alpha: 1)), Color.blue]),
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    )
    .frame(width: 300, height: 250)
```

방사형

```swift
RoundedRectangle(cornerRadius: 25.0)
    .fill(
        RadialGradient(
            gradient: Gradient(colors: [Color.red, Color.blue]),
            center: .topLeading,
            startRadius: 5,
            endRadius: 400
        )
    )
    .frame(width: 300, height: 250)
```

## Icon

필요한 대부분 아이콘이 이미 존재한다.

```swift
Image(systemName: "heart.fill")
    .resizable()
    .aspectRatio(contentMode: .fit) // 프레임에 꽉 맞춘다.
    // .scaledToFit() // 위와 같다.
    // .font(.largeTitle)
    .font(.system(size: 200))
    // .foregroundStyle(.green)
    .frame(width: 200, height: 200)
    .clipped() // 프레임 영역 밖을 잘라낸다.
```

더 많은 아이콘을 확인하고 싶을 때는 https://developer.apple.com/sf-symbols/ 에 방문해서 SF Symbols를 다운받는다.
그러면 종류를 볼 수 있고, 각 아이콘의 이름을 알 수 있다.

multiColor아이콘의 경우, 색상이 입혀진다. 파란색 부분은 색상을 변경할 수 있다.
이 아이콘들의 경우 renderingMode(.original)을 통해 apple이 지정해놓은 부분의 컬러의 original색상을 넣을 수 있다.

```swift
Image(systemName: "person.fill.badge.plus")
    .renderingMode(.original)
```

## Image

이미지 파일을 Assets폴더에 넣고 파일이름을 Image에 전달한다.
원하는 크기로 자를 수도 있다.

```swift
Image("stair")
    .resizable()
    // .cornerRadius(30) borderRadius
    .clipShape(Circle())
```

## Frames and Alignments

Frame을 잘 다뤄야 배치를 잘할 수 있다.

개발하는 동안에는 Frame에 배경을 추가해서 디버깅에 용이하게 할 수 있다.

```swift
Text("Hello World") // Layout: 제일 상단
    .background(Color.red)
    .frame(height: 100, alignment: .top) // Layout: 중단
    .background(Color.green)
    .frame(maxWidth: .infinity, alignment: .leading) // Layout: 하단
    .background(Color.orange)
```

![](../images/2025-01-08-22-22-09.png)

## Background & Overlay

Background는 컨텐츠 뒤에있고 Overlay는 컨텐츠 위에 있다.

overlay나 background에 (컨텐츠, alignment: 위치) 이런 식으로도 배치가 가능하다.

```swift
Rectangle()
    .frame(width: 100, height: 100)
    .overlay(
        Rectangle()
            .fill(.blue)
            .frame(width: 50, height: 50)
        , alignment: .topLeading // 주의: Rectangle의 위치가 아니라 Overlay의 두번째 인자로 주입한 위치다.
    )
    .background(
        Rectangle()
            .fill(.red)
            .frame(width: 150, height: 150)
    )
```

![](../images/2025-01-08-22-37-32.png)

```swift
Image(systemName: "heart.fill")
    .font(.system(size: 40))
    .foregroundStyle(Color.white)
    .background(
        Circle()
            .fill(
                LinearGradient(colors: [Color(.purple), Color(.blue)], startPoint: .topLeading, endPoint: .bottomTrailing)
            )
            .frame(width: 100, height: 100)
            .shadow(color: Color(#colorLiteral(red: 0.245982796, green: 0.4570168853, blue: 0.9919729829, alpha: 0.5)), radius: 10, x: 0.0, y: 10)
            // circle의 위에 알람을 표시할 수 있다.
            .overlay(
                Circle()
                    .fill(Color.blue)
                    .frame(width: 35, height: 35)
                    .overlay(
                        Text("5")
                            .font(.headline)
                            .foregroundColor(.white)
                    )
                    .shadow(color: Color(#colorLiteral(red: 0.245982796, green: 0.4570168853, blue: 0.9919729829, alpha: 0.5)), radius: 10, x: 5, y: 5)
                , alignment: .bottomTrailing
            )
    )
```

![](../images/2025-01-08-23-13-55.png)
