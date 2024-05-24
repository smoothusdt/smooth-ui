import { FC, PropsWithChildren } from "react";

export const Page: FC<PropsWithChildren> = (props) => {
  return <div className="h-full w-full flex flex-col">{props.children}</div>;
};
