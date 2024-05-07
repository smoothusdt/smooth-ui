import styled from "styled-components";

import { FallbackProps } from "react-error-boundary";

export const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;
  return (
    <Root>
      <b>An error occurred:</b>
      <PreWrap>{error.message}</PreWrap>
      <button onClick={resetErrorBoundary} >Refresh</button>
    </Root>
  );
};

const PreWrap = styled.pre`
  overflow-wrap: break-word;
  white-space:pre-wrap;
  max-width: 50ch;
`;

const Root = styled.div.attrs({ role: "alert" })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: pink;
  font-size: 16px;
`;
