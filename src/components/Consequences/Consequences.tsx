import { FunctionComponent, PropsWithChildren } from "react";

/** Hosts the `<Consequence />` component map with proper spacing. */
export const Consequences: FunctionComponent<PropsWithChildren> = (props) => {
  return <div className="flex flex-col gap-4">{props.children}</div>;
};
