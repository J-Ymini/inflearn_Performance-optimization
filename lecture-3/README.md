# 일반 홈페이지 최적화

<div align="center">
<img width="400" alt="스크린샷 2023-04-22 오후 3 50 31" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/e3b513a2-47de-427c-bdec-8b5948300ede"></div>

- 현재 메인페이지에서, 동영상이 가장 처음 보게 되는 컨텐츠임에도 불구하고, 컨텐츠의 다운로드는 다른 정적 파일들이 다운로드가 진행된 후 마지막에 다운로드를 진행하게 되므로 UX에 좋지 않음([리소스 다운로드 우선순위](https://web.dev/priority-hints/) 참고)

- 해결 방법으로는 lazy loading을 적용하는 방법이 존재(동영상의 다운로드 시점을 앞당기기 위함, 첫번째로 이미지의 다운로드 속도를 개선하는 결과론적으로 동영상이 나중에 다운로드가 되므로 원천적인 방법은 아닌것으로 판단)

<br/>

### IntersectionObserver를 통해 lazy loading 적용

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

###
