# 일반 홈페이지 최적화

<div align="center">
<img width="400" alt="스크린샷 2023-04-22 오후 3 50 31" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/e3b513a2-47de-427c-bdec-8b5948300ede"></div>

- 현재 메인페이지에서, 동영상이 가장 처음 보게 되는 컨텐츠임에도 불구하고, 컨텐츠의 다운로드는 다른 정적 파일들이 다운로드가 진행된 후 마지막에 다운로드를 진행하게 되므로 UX에 좋지 않음([리소스 다운로드 우선순위](https://web.dev/priority-hints/) 참고)

- 해결 방법으로는 lazy loading을 적용하는 방법이 존재(동영상의 다운로드 시점을 앞당기기 위함, 첫번째로 이미지의 다운로드 속도를 개선하는 결과론적으로 동영상이 나중에 다운로드가 되므로 원천적인 방법은 아닌것으로 판단)

<br/>

## IntersectionObserver를 통해 lazy loading 적용

``` javascript
useEffect(() => {
  const observerOptions = {};

    const observerCallback = ([{ isIntersecting, target }], observer) => {
      if (isIntersecting && !target.src) {
        target.src = target.dataset.src;
        observer.unobserve(imgRef.current);
      }
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    observer.observe(imgRef.current);
  }, []);
```

<div align="center">
<img width="400" alt="스크린샷 2023-04-22 오후 3 50 31" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/a2478332-36cc-4a43-a638-206399ce54e2"></div>

- 이미지 레이지로딩 확인

<br/>

## 이미지 사이징 최적화

- PNG: 무손실 압축으로, 용량이 비교적으로 큰편
- JPG: 압축이 많이 되는 대신, 화질의 저하가 존재(권장하는 방법)
- WEBP: 단순하게 말하자면, JPG보다 좋음
  - JPG보다 화질 및 용량 측면에서 더 나은 성능을 가지고 있음

- squoosh.app
  - Google에서 개발하였으며, image 파일을 WEBP 파일로 변환시켜주는 서비스

<div align="center">
<img width="400" alt="스크린샷 2023-06-24 오후 1 49 49" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/cedccd14-50fd-455e-b1b6-9a65149772c6"></div>
<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/1598e5da-d446-46b8-a5d5-642d437d5b61"></div>

- WEBP 이미지는, 지원이 되지 않는 브라우저도 존재하기 때문에 브라우저별 불러올 이미지 타입의 분기가 필요

``` typescript
  <picture>
  // webp가 지원이 되는 브라우저에서 정상적으로 렌더링이 될 경우, 해당 이미지를 렌더링
    <source data-srcset={webp} type="image/webp" />
  // source tag의 이미지가 정상적으로 렌더링이 되지 않을 경우, img 태그를 렌더링
    <img data-src={image} ref={imgRef} />
  </picture>
```

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/839e61dc-a7c0-4a86-baff-b8600d4229be"></div>

<br/>

## 폰트 최적화

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/0f9458d6-7960-48b7-8ad8-64ca9b71836e"></div>

- 웹 폰트를 적용함으로써 생기는 문제점으로는, 두가지가 존재
  - FOUT(Font of Unstyled Text): 폰트 다운로드 전, 기본 폰트가 먼저 보여짐
    - IE, EDGE 브라우저에서 해당 방식 적용
  - FOIT(Flash of Invisible Text): 폰트가 다운로드 되기 전, 해당 텍스트를 보여주지 않음
    - Chrome같은 브라우저에서 해당 방식 적용
- 결론적으로는 **폰트 적용 시점 컨트롤** + **폰트 사이즈 줄이기** 를 통해 최적화 진행

### 폰트 적용 시점 컨트롤하기

- font 속성
  - auto: 브라우저 기본 동작
  - block: FOIT(timeout: 3s), 3초까지는 텍스트를 보여주지 않다가 3초 이후부터 기본폰트 visible, 그 이후 적용 폰트의 다운로드가 완료시 해당 폰트 visible
  - swap: 처음부터 기본 폰트를 보여줌, 그 이후 적용 폰트 다운로드 완료시 해당 폰트가 적용된 텍스트 visible
  - fallback: FOIT(timeout: 0.1s), 3초 후에 적용 폰트 다운로드가 늦어질 시 기본 폰트 유지, 적용 하고자 하는 폰트는 캐싱을 해둠
  - optional: FOIT(timeout: 0.1s), 네트워크 상태에 따라 기본폰트 사용 or 웹폰트 사용 여부 결정 및 캐싱

- font-face observer
  - 폰트 다운로드 완료 시점을 캐칭하는 라이브러리

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/19be7047-a9f2-4327-a0b5-61de3864b515"></div>

- 폰트 fetch 완료 시점에 맞춰, opacity 및 transition을 사용하여 UX 개선

``` javascript
import React, { useState } from 'react';
import video from '../assets/banner-video.mp4';
import FontFaceObserver from 'fontfaceobserver';

function BannerVideo() {
  const font = new FontFaceObserver('BMYEONSUNG');
  const [isFontLoaded, setIsFontLoaded] = useState(false);

// web font download catching
  font.load(null, 5000).then(() => {
    setIsFontLoaded(true);
  });

  return (
      <div
        className={`w-full h-full flex justify-center items-center transition-all`}
        // catching 시점에 맞춰 
        style={{
          opacity: isFontLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        ...
      </div>
  );
}

export default BannerVideo;

```

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/f112de9e-b12f-4480-84d7-baa9b284cddb"></div>
