# 블로그 사이트 최적화

## Light house(Audit)을 통한 성능 최적화

<div align="center">
<img width="400" alt="스크린샷 2023-04-22 오후 3 50 31" src="https://user-images.githubusercontent.com/75535651/233768087-b3974a93-83de-45cc-a50b-2694ddfbc959.png"></div>

<br/>

### Opportunity(리소스 관점에서의 가이드, 즉 로딩 최적화 관련 내용)

**Properly size images**

<div align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233769659-933cc7e1-0b60-40bc-a3b5-dea3e75b7063.png"></div>

- 실제 렌더링 되는 사이즈와, 이미지의 실제 사이즈의 차이가 매우 많이 나고 있음
- 따라서 실제 렌더링 크기의 이미지를 불러올 필요가 있음(요즘 많이 사용되는 레티나 디스플레이의 경우 같은 공간에 더 많은 픽셀을 그릴 수 있으므로 기존 대비 두배 정도의 사이즈가 적절하다고 한다.)
- 이미지가 static file로 심어져있다면 자체적으로 리사이징이 가능하지만, 외부 서버에서 받아오는 경우 imgix와 같은 CDN 활용 (Image Processing CDN의 경우, 이미지를 사용자에게 보내기 전에 리사이징 및 포맷 변경 후 전달)

<div align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233769766-21e10706-1a9b-4ad0-b137-cb723bdd2776.png"></div>

- 예제 기준, `getParametersForUnsplash`의 arguments 변경을 통한 Unsplash의 query params의 수정으로, 이미지 사이즈 감소 확인

<br/>

### Diagnostics(페이지의 실행 관점에서의 가이드, 즉 렌더링 최적화 관련 내용)

**Reduce Javascript executation time**

<div align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233770215-1e66179b-3e88-4de2-a3b5-24aac55c5651.png"></div>
<div align="center">
<img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233770464-e4547cf2-6c36-4a9b-ba28-22115dcd1a94.png"></div>

- bundlejs, 1.chunk.js, main.chunk.js

- chunk.js 용량 확인

**병목 원인 파악 및 최적화**

<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233832391-f6d75e46-4081-46a6-b6f9-db11d3b1c4aa.png">
</div>
<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233835722-9277371a-3007-4b2c-962b-7015b9cf0faf.png"></div>

- `removeSpecialCharacter`라는 작업이 Article 컴포넌트의 모든 시간을 잡아먹고 있으며 여러번 실행이 되는 것처럼 보이나, 원래는 하나의 연결된 작업이며 너무 많은 리소스를 잡아먹고 있기 때문에 `MinorGC` 에 의해 메모리가 정리되어 끊기는 것처럼 보이고 있음

<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/233836089-a74c6e14-d233-4622-b590-15d2cb56ed88.png"></div>

- `removeSpecialCharacter` 함수 로직을 변경한 결과, 함수 호출 시간 감소 확인 및 퍼포먼스 점수 증가 확인
