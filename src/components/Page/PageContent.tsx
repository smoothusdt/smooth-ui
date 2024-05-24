import { FC, PropsWithChildren } from "react";

export const PageContent: FC<PropsWithChildren> = (props) => {
  return <div className="flex-1 pb-8">{props.children}</div>;
};
