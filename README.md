# 프로그래머스 고양이 사진첩 

프로그래머스 고양이 사진첩 과제를 mvvm 방식으로 풀어낸 프로젝트 입니다. 

주소 : https://juo1221.github.io/catPhotos-mvvm/

코드 : https://github1s.com/juo1221/catPhotos-mvvm

# 개요

최근에 mv* 패턴에 대해 공부할 기회가 생겼습니다. 먼저 mvc 방식에 대해 공부하다 mvvm까지 학습하게 됐는데 

투두리스트 이외에 mvvm을 적용해볼 마땅한 프로젝트가 없던 차에 프로그래머스에서 제공하는 과제를 알게 됐습니다.

너무 어렵지도 쉽지도 않은 적당한 수준이라 느껴졌고, 프로젝트를 적용해볼 좋은 기회라는 생각이 들어 해당 과제에 적용해보았습니다. 

*과제를 푸는 목적이 아니기 때문에 과제에서 제시하는 모든 조건을 충족시키진 않았습니다. 과제의 조건은 저작권상 올리지 못하고 아래에 링크로 첨부했습니다.

# 스택

- html
- css
- js

# Chart

<img width="662" alt="스크린샷 2022-04-05 오후 4 09 40" src="https://user-images.githubusercontent.com/79268108/161698357-702127c5-5e24-4012-8db6-476599ba1496.png">

대략적인 흐름을 구성한 순서도 입니다. 

<img width="1442" alt="스크린샷 2022-04-05 오후 4 12 14" src="https://user-images.githubusercontent.com/79268108/161698701-4d05cd55-d87c-4c1e-842b-c2f480be45c9.png">

클래스간 관계를 간략하게 표시했습니다. 

# 개선할점

1. template 태그를 감싸는 div 태그를 대체할 수 있는 방법 찾아보기

   view를 감싸기 위해 div를 억지로 끼워넣어야 한다는 부분입니다. 해당 문제를 해결하기 위해 div 대신Document.createDocumentFragment() 를 사용했지만, 재렌더링 되지 않아 뷰가 갱신되지 않는 추가적인 문제가 발생했습니다. 

2.  로딩 스피너 코드 분리

    <img width="678" alt="스크린샷 2022-04-05 오후 4 37 21" src="https://user-images.githubusercontent.com/79268108/161703038-af8517ef-938f-4ca7-8118-c0f6bd27661e.png">

     action이 발생하는 부분에 spinner의 로직이 들어가있는 모습을 확인 할 수 있습니다. css에 접근하는 코드는 view에서 작업해야 하기 때문에 잘 분리시키지 못한것을 알 수 있는데 뚜렷한 해결방법을 찾지 못했습니다. 

# 파일구조

<img width="746" alt="스크린샷 2022-04-05 오후 4 06 09" src="https://user-images.githubusercontent.com/79268108/161697838-4628f4d6-83d5-48bc-a689-cb67430ff465.png">

# 출처

프로그래머스 : https://programmers.co.kr/skill_check_assignments/100

