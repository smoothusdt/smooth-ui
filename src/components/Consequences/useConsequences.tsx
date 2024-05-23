import { ReactNode, useCallback, useState } from "react";

/**
 * Hook for use with the `<Consequences />` components.
 *
 * @param content Pass this hook an array of the content you intend to map inside `<Consequences />`
 * @returns an array of statuses, a convenience toggle, and a flag to know if all conditions are accepted
 */
export const useConsequences = (content: ReactNode[]) => {
  // Map each element to a bool to represent if that element is accepted
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
  const reset = useCallback(
    () => setAccepted(accepted.map((_) => false)),
    [accepted],
  );

  return { accepted, toggle, legitimate, reset };
};
