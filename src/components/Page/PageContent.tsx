import { FC, PropsWithChildren } from "react";

/**
 *  Use as the second descendent of `<Page/>` with all your content inside.
 */
export const PageContent: FC<PropsWithChildren> = (props) => {
  return <div className="flex-1 pb-8">{props.children}</div>;
};
