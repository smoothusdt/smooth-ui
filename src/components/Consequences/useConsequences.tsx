import { ReactNode, useState } from "react";

/**
 * Hook for use with the `<Consequences />` components.
 *
 * @param content Pass this hook an array of the content you intend to map inside `<Consequences />`
 * @returns an array of statuses, a convenience toggle, and a flag to know if all conditions are accepted
 */
export const useConsequences = (content: ReactNode[]) => {
  // Maintain the state of acceptance for the consequences
  // and provide a convenience setter

  // Attach a boolean to each element
  const withAcceptance = content.map((_) => {
    return false;
  });

  const [accepted, setAccepted] = useState(withAcceptance);
  const toggle = (idx: number) => {
    setAccepted((last) => {
      const copy = [...last];
      copy.splice(idx, 1, !last[idx]);
      return copy;
    });
  };
  const legitimate = accepted.every((e) => e);

  return { accepted, toggle, legitimate };
};
