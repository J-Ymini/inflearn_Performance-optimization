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

**bundle 파일 분석**

- [webpack-bundle-analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)를 통해 번들 크기 확인 가능 (CRA의 경우, [cra-bundle-analyzer](https://www.npmjs.com/package/cra-bundle-analyzer) 사용)

<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/234035812-a62d5c45-9b53-4fe7-9c47-e3527243e1f2.png"></div>

- 번들 사이즈가 가장 큰 모듈인 `refractor`은 마크다운 문법에서 코드 블록 내부의 색상 강조를 위한 모듈로서, 리스트 페이지가 아닌 뷰페이지에서만 필요함. 따라서 [라우트 기반 코드 스플리팅](https://legacy.reactjs.org/docs/code-splitting.html#route-based-code-splitting)을 통해서 불필요 리소스를 줄일 필요가 있음

- `Suspense`, `lazy`를 통해 개선 (`lazy loading`)
- 기존에는 코드 스플리팅의 실제 주체는 리액트가 아닌 웹팩이므로 웹팩 설정 필요하나, CRA의 경우 Lazy loading 관련 코드만 수정하면 됨

``` typescript
// before
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import ListPage from './pages/ListPage/index';
import ViewPage from './pages/ViewPage/index';

function App() {
  return (
    <div className="App">
      <Switch>
        <Route path="/" component={ListPage} exact />
        <Route path="/view/:id" component={ViewPage} exact />
      </Switch>
    </div>
  );
}

export default App;


// after
import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';

const ListPage = lazy(() => import('./pages/ListPage/index'));
const ViewPage = lazy(() => import('./pages/ViewPage/index'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route path="/" component={ListPage} exact />
          <Route path="/view/:id" component={ViewPage} exact />
        </Switch>
      </Suspense>
    </div>
  );
}

export default App;
```

<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/236390077-6fee3b47-8a43-4b53-a927-bfd9a5110441.png"></div>

<div align="center"><img width="400" alt="image" src="https://user-images.githubusercontent.com/75535651/236389843-d0b3f902-8be4-44fc-a2d9-88c30c9305d0.gif"></div>

- `chunk.js` 파일 분리 및 뷰페이지 진입시 필요한 `chunk.js` 파일 추가 로드 확인

## 추가 성능 개선

**텍스트 압축 (리소스 로딩 속도 개선)**

<div align="center"><img width="580" alt="image" src="https://user-images.githubusercontent.com/75535651/236391247-8e0bc99d-444c-44e2-840f-d50155d769fc.png"></div>

- 빌드 파일에서는, 텍스트 압축 관련 성능 개선 사항 문구 추가 확인 가능

<div align="center"><img width="633" alt="image" src="https://user-images.githubusercontent.com/75535651/236392301-7b625c42-28f3-433c-af44-e11044f8e566.png"></div>

- `/articles` api를 통해 받아오는 텍스트들을 gzip 형태로 압축하여 전달받고 있음을 확인

- 현재 프로젝트 기준의 번들 파일들의 경우, 텍스트 압축이 이루어지지 않고 있기 때문에 스크립트의 serve command의 options을 수정함으로써 텍스트 압축 가능

<div align="center"><img width="434" alt="image" src="https://user-images.githubusercontent.com/75535651/236393870-34adf461-4597-4d5e-829a-cdf2636a06c1.png"></div>

``` json
// before
"serve": "npm run build && node ./node_modules/serve/bin/serve.js -u -s build",

// after
"serve": "npm run build && node ./node_modules/serve/bin/serve.js -s build",

```

- 무분별하게 모든 파일들을 압축해서 전달할 경우, 성능 저하의 원인이 될 수 있기 때문에 파일의 크기가 2KB 이상의 경우에만 압축을 진행하는 것을 권장

<div align="center"><img width="1588" alt="image" src="https://user-images.githubusercontent.com/75535651/236398784-2b58eea7-3da3-46ab-a378-ee4fc98778d8.png"></div>

- 위와 같이 텍스트 압축을 진행할 경우, 번들 파일의 사이즈가 감소하는 것을 확인할 수 있음
