---
title: "Emotion VS Styled-Component"
description:
date: 2022-12-22
update: 2022-12-22
tags:
  - emotion
  - styled-component
---

리엑트에서 많이 사용하는 CSS-in-JS의 종류중 하나인 Emotion과 Styled-Component에 대해 알아보겠습니다.

## 트렌드

![트렌드](emotion-trends.png)
https://npmtrends.com/@emotion/core-vs-@emotion/react-vs-styled-components

> emorion이 v10에서 v11이 되면서 `@emotion/code`에서 `@emotion/react`로 패키지명이 변경되었습니다.

트렌드를 통해서 알수 있듯이 두 패키지 모두 많은 개발자들에게 사랑받고 있는것을 확인할 수 있습니다.

## 코드

실제 코드에서는 어떤 차이가 있을까요? 대략 적으로 어떤 차이가 있는지 살펴보고 본인한테 맞는 스타일을 선택하면 좋을 것 같습니다.

```
yarn add styled-components @emotion/react
yarn add -D @types/styled-components
```

❗️ emotion을 사용할 때 추가 사항

> tsconfig에 compilerOptions를 추가해주고
> 아래의 pragma line을 파일 최상단에 추가해 주어야 합니다.
>
> ```
> /** @jsxImportSource @emotion/react */
> ```
>
> tsconfig.json
>
> ```
> {
>   "compilerOptions": {
>     ...
>     "jsx": "react-jsx",
>     "jsxImportSource": "@emotion/react",
>   }
> }
> ```

### Emotion

component

```typescript
/** @jsxImportSource @emotion/react */
import { useState } from "react"
import { randomColorGenerator } from "../randomColor"
import { bgButton, container, fgButton, title } from "./Emotion.styled"

const App = () => {
  const [bgColor, setBgColor] = useState(randomColorGenerator())
  const [fgColor, setFgColor] = useState("#000000")

  const handleBgButtonTabbed = () => setBgColor(randomColorGenerator())
  const handleFgButtonTabbed = () => setFgColor(randomColorGenerator())

  return (
    <div css={container({ bgColor, fgColor })}>
      <h1 css={title}>Emotion Component</h1>
      <button css={bgButton} onClick={handleBgButtonTabbed}>
        Change BG
      </button>
      <button css={fgButton} onClick={handleFgButtonTabbed}>
        Change FG
      </button>
    </div>
  )
}

export default App
```

styled

```typescript
import { css } from "@emotion/react"

type Props = {
  bgColor: string
  fgColor: string
}
const container = (props: Props) => css`
  background: ${props.bgColor};
  padding: 20px;
  & * {
    color: ${props.fgColor};
  }
`

const title = css`
  font-style: italic;
`

const button = css`
  border: 0px solid black;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.6);
  cursor: pointer;
`

const bgButton = css`
  ${button}
  background-color: white;
  color: black;
  &:hover {
    background-color: black;
    color: white;
  }
`

const fgButton = css`
  ${button}
  background-color: black;
  color: white;
  &:hover {
    background-color: white;
    color: black;
  }
`

export { container, title, bgButton, fgButton }
```

### Styled component

component

```typescript
import React, { useState } from "react"
import { randomColorGenerator } from "../randomColor"
import { BgButton, Container, FgButton, Title } from "./Styled.styled"

const App = () => {
  const [bgColor, setBgColor] = useState(randomColorGenerator())
  const [fgColor, setFgColor] = useState("#000000")

  const handleBgButtonTabbed = () => setBgColor(randomColorGenerator())
  const handleFgButtonTabbed = () => setFgColor(randomColorGenerator())

  return (
    <Container bgColor={bgColor} fgColor={fgColor}>
      <Title>Styled Component</Title>
      <BgButton onClick={handleBgButtonTabbed}>Change BG</BgButton>
      <FgButton onClick={handleFgButtonTabbed}>Change FG</FgButton>
    </Container>
  )
}

export default App
```

styled

```typescript
import styled from "styled-components"

const Container = styled.div<{ bgColor: string; fgColor: string }>`
  background: ${props => props.bgColor};
  padding: 20px;
  & * {
    color: ${props => props.fgColor};
  }
`

const Title = styled.h1`
  font-style: italic;
`

const Button = styled.button`
  border: 0px solid black;
  font-size: 20px;
  border-radius: 8px;
  box-shadow: -2px 2px 4px rgba(0, 0, 0, 0.6);
  cursor: pointer;
`

const BgButton = styled(Button)`
  background-color: white;
  color: black;
  &:hover {
    background-color: black;
    color: white;
  }
`

const FgButton = styled(Button)`
  background-color: black;
  color: white;
  &:hover {
    background-color: white;
    color: black;
  }
`

export { Container, Title, BgButton, FgButton }
```

https://stackblitz.com/edit/stackblitz-starters-eosa5k?embed=1

### 마치며

개인적으로 Emotion의 css() 함수가 좀 더 사용하기가 편한 것 같습니다. MUI(Material UI)가 스타일링 엔진을 Styled Components 대신에 Emotion을 채택하면서 Emotion 쪽으로 살짝 힘이 실리는것 같기도 하지만, 프로젝트의 성격 및 구성원의 성향에 따라 선택적으로 사용하면 될 것 같습니다.

개발용이성이 워낙 커서 React의 인기와 함께 유행하긴했지만, CSR 환경을 바탕으로 두고 구상한 방법이었기 때문에 SSR 환경에서 문제가 나타났습니다.

Next.js 공식 문서를 보면 tailwind를 적극 추천하고 있습니다. 아무래도 SSR 환경에서 불안정한 CSS-in-JS 방식을 제외하고 남는 CSS 솔루션 중에서 Tailwind CSS가 가장 CSS의 단점을 잘 커버할 수 있었기 때문에 추천되고 있는 것 같다.

그냥 tailwind css를 사용하는걸로...

**참고**

- Emotion 공식문서 (https://emotion.sh/docs/introduction)
- Styled Component 공식 문서 (https://styled-components.com/docs)
