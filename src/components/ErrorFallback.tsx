import styled from "styled-components";

import { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";

export const ErrorFallback = (props: FallbackProps) => {
  const { error, resetErrorBoundary } = props;
  return (
    <Root className="container flex flex-col justify-center size-full bg-background">
      <div className="container flex flex-col justify-center max-w-[50ch] bg-background text-m gap-4">
        <b>Something went wrong:</b>
        <PreWrap>{error.message}</PreWrap>
        <Button onClick={resetErrorBoundary}>Refresh</Button>
      </div>
    </Root>
  );
};

const PreWrap = styled.pre`
  overflow-wrap: break-word;
  white-space: pre-wrap;
`;

const Root = styled.div.attrs({ role: "alert" })`
  --dot-grid-color: hsl(var(--primary));
  --dot-grid-bg-color: white;
  --dot-grid-size: 32px;
  --dot-grid-diameter: 1px;

  background-size: var(--dot-grid-size) var(--dot-grid-size);
  background-image: radial-gradient(
    circle at calc(var(--dot-grid-size) / 2) calc(var(--dot-grid-size) / 2),
    var(--dot-grid-color) var(--dot-grid-diameter),
    var(--dot-grid-bg-color) 0
  );
`;
