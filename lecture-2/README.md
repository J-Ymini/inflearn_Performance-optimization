# 통계 사이트 최적화

## 애니메이션의 원리

- 일반적으로 애니메이션이란, 여러장의 이미지가 연속적으로 변경이 되면서 움직이는 것처럼 확인
- 특정 프레임(이미지)이 누실될 경우, 애니메이션 자체가 부자연스러워짐
- 일반적으로 디스플레이의 주사율은 초당 60Frame(60FPS)
- 브라우저의 기본 주사율도 60Frame(60FPS)에 맞춰 렌더링을 하려고 하나, 프레임이 맞지 않는 경우 애니메이션이 끊기는 **쟁크 현상**이 발생함

- 브라우저 렌더링 과정(Critical Rendering Path, Pixel Pipeline)에서 Layout과 Paint 과정은 각각 쪼개져서 진행된 후 Composite를 통해 각각의 레이어가 서로 합성됨

- 애니메이션의 최적화를 위해서 GPU의 도움을 받을 수 있는 속성인 transform, opacity를 사용함으로써 Reflow와 Repaint를 피하여 성능 개선이 가능

<div align="center"><img width="600" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/8078635c-49e2-4b43-a78e-c1210c5606a3"></div>

<br/>

## 개선 및 결과

``` javascript
// 수정 전

const BarGraph = styled.div`
  ...
  width: ${({width}) => width}%;
  transition: width 1.5s ease;
  ...
`

// 수정 후
const BarGraph = styled.div`
  ...
  width: 100%;
  transform: scaleX(${({ width }) => width / 100});
  transform-origin: left;
  transition: transform 1.5s ease;
  ...
`;
```

### 개선 이전

<div align="center"><img width="400" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/89eb4a7e-da50-43a1-aba6-cc41bb4919be"></div>

### 개선 이후

<div align="center"><img width="400" alt="image" src="https://github.com/J-Ymini/J-Ymini/assets/75535651/4e3050fc-7bbe-4b8e-8875-3ba05eccbea0"></div>

- 개선 이후, CPU 사용률 저하 및 프레임 차트에서 프레임 드롭의 정도가 낮아진 것으로 확인되었다.
