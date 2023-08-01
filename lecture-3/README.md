# 일반 홈페이지 최적화

<div align="center">
<img width="400" alt="스크린샷 2023-04-22 오후 3 50 31" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/e3b513a2-47de-427c-bdec-8b5948300ede"></div>

- 현재 메인페이지에서, 동영상이 가장 처음 보게 되는 컨텐츠임에도 불구하고, 컨텐츠의 다운로드는 다른 정적 파일들이 다운로드가 진행된 후 마지막에 다운로드를 진행하게 되므로 UX에 좋지 않음([리소스 다운로드 우선순위](https://web.dev/priority-hints/) 참고)

- 해결 방법으로는 lazy loading을 적용하는 방법이 존재(동영상의 다운로드 시점을 앞당기기 위함, 첫번째로 이미지의 다운로드 속도를 개선하는 결과론적으로 동영상이 나중에 다운로드가 되므로 원천적인 방법은 아닌것으로 판단)

<br/>

## IntersectionObserver를 통해 lazy loading 적용

```javascript
useEffect(() => {
  const observerOptions = {};

  const observerCallback = ([{ isIntersecting, target }], observer) => {
    if (isIntersecting && !target.src) {
      target.src = target.dataset.src;
      observer.unobserve(imgRef.current);
    }
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);

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

```typescript
<picture>
  // webp가 지원이 되는 브라우저에서 정상적으로 렌더링이 될 경우, 해당 이미지를
  렌더링
  <source data-srcset={webp} type="image/webp" />
  // source tag의 이미지가 정상적으로 렌더링이 되지 않을 경우, img 태그를 렌더링
  <img data-src={image} ref={imgRef} />
</picture>
```

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/839e61dc-a7c0-4a86-baff-b8600d4229be"></div>

<br/>

## 폰트 최적화

<**div** align="center">
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

  ```javascript
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
        **** ...
      </div>
    );
  }

  export default BannerVideo;
  ```

<div align="center">
<img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/f112de9e-b12f-4480-84d7-baa9b284cddb"></div>

### 폰트 사이즈 줄이기

- 폰트 파일 확장자별 특징

  - TTF(True Type Font)/OTF(Open Type Font): 압축이 되지 않는 형태, PC에서 사용
  - WOFF(Web Open Type Font): 웹에서도 사용하기 용이하게끔 압축한 형태의 폰트

- 폰트 압축은 <https://transfonter.org/> 를 통해 진행

  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/e568b2e6-c8c7-4192-b004-d5f98c96eb39"></div>

- 기존 폰트의 사이즈와 비교하였을때, 파일 사이즈 감소 확인

  ```css
  @font-face {
    font-family: BMYEONSUNG;
    src: url('./assets/fonts/BMYEONSUNG.woff2') format('woff2'), url('./assets/fonts/BMYEONSUNG.woff')
        format('woff'), url('./assets/fonts/BMYEONSUNG.ttf') format('truetype');
    font-display: block;
  }
  ```

- web font 적용(css의 font 추가 설정)

  ```css
  @font-face {
    font-family: BMYEONSUNG;
    src: local('BMYEONSUNG'),
      url('./assets/fonts/BMYEONSUNG.woff2') format('woff2'), url('./assets/fonts/BMYEONSUNG.woff')
        format('woff'), url('./assets/fonts/BMYEONSUNG.ttf') format('truetype');
    font-display: block;
  }

  /* - 로컬에서 사용하고 있는 폰트가 있다면 위와 같이 local 키워드를 사용하여 설치된 폰트를 가져와서 사용하며 다운로드 하지 않음 (로컬에  존재하지 않을 시에만 다운로드) */
  ```

- subset을 통한, 특정 문자열 폰트 적용

  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/2087b008-0af1-4b34-9db2-fab0da4c7ea6"></div>
  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/e59c6499-f856-4d43-97a1-0e39ac28d1de"></div>

  - 특정 텍스트에만 폰트 적용 및 파일 용량 대폭 감소

- unicode-range

  - 만일 폰트 subset에 할당되지 않은 텍스트에도 폰트를 적용한다고 하였을때, 폰트는 적용되지 않지만 폰트 파일을 불러오는 이슈 발생

  - 아래와 같이, unicode-range를 통해, 특정 unicode 에만 폰트를 적용하도록 `unicode-range` 속성을 사용하여 불필요 폰트 로드 방지

  ```css
  @font-face {
    font-family: BMYEONSUNG;
    src: local('BMYEONSUNG'),
      url('./assets/fonts/subset-BMYEONSUNG.woff2') format('woff2'), url('./assets/ fonts/subset-BMYEONSUNG.woff')
        format('woff'), url('./assets/fonts/BMYEONSUNG.ttf') format('truetype');
    font-display: block;
    unicode-ragne: 'u+0041, u+0042, u+0043, u+0044, u+0045, u+0047, u+0049, u+004b,   u+004c, u+004d, u+004e, u+004f, u+0050, u+0052';
  }
  ```

- data-uri

  - base64로 인코딩된 data-uri를 넣음으로써, CSS 파일을 받은 다음에 font를 가져오는 요청 대신 CSS를 받을 때 한꺼번에 받으면서 HTTP 요청 수 감소 (네트워크 요청X)

  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/381e6ee8-b881-446e-967a-a632532146be"></div>
  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/66c73de6-0235-435c-b06a-7366ffe8d08a"></div>
  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/2662bada-1847-48df-bfeb-859ea41c5d69"></div>

## 캐시 최적화

퍼포먼스 탭에서, 정적 파일들의 효율적인 캐시 정책이 필요함을 확인

  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/3227738c-fff0-4d22-9ec7-f6bfb23c8267"></div>

### 캐시란?

- 데이터나 값을 미리 복사해놓은 장소, 혹은 임시 동작
- 캐시 종류는 메모리 캐시, 디스크 캐시 존재
  - 디스크 캐시: 하드디스크의 정보를 RAM에 임시 저장하여 접근 속도 향상
  - 메모리 캐시: RAM에 접근하는 속도조차 CPU 입장에서는 느리므로 CPU에 근접한 캐시 메모리에 저장하여 CPU 처리속도 병목현상 개선

### 캐시 적용

- 캐시를 적용하고자 할때, header에 `Cache-control` setting 필요

  - `no-cache`: 캐시를 사용하기 전, 서버에게 검사를 받은 후 사용 결정(max-age=0과 동일)
  - `no-store`: 캐시 사용 X
  - `public`: 모든 환경에서 캐시 사용
  - `private`: 브라우저 환경에서만 캐시 사용, 외부 서버에서는 캐시 사용 불가(ex> 서버)
  - `max-age`: 캐시의 유효시간(유효 시간이 지났어도, 캐시를 바로 버리는 것이 아닌 서버에게 캐시 사용 여부 확인 후에 캐시 사용 or 새로운 응답 수신)

### 캐시 확인

  <div align="center">
  <img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/7f63086e-c516-42dc-92fe-006bb4895e46"></div>

- 캐시 유효 시간이 지난 후에, byte 단위로 파일들을 받아오는 것을 확인
- 캐시는 만료되었기 때문에 새로 데이터를 받아야 하나, 해당 리소스가 수정되지 않았다면 캐시에 존재하는 리소스를 그대로 사용 => 응답하는 과정만 거쳤기 때문에 트래픽 사이즈가 매우 낮은 것을 확인

### ETag를 통한 cache의 최신 상태 확인

- 리소스마다 갖고 있는, 특정 고유 해시
- 즉 cache 변경 여부 판단은 리소스가 아닌 ETag로 판단하여 변경 여부 확인
