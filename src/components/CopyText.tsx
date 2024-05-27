import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { useCopyToClipboard } from "react-use";
import { Button } from "./ui/button";

export function CopyText(props: { buttonLabel: string; valueToCopy: string }) {
  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    copyToClipboard(props.valueToCopy);

    if (!state.error) {
      // UI confirms the copy, then resets. This is a common pattern.
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    // TODO: Set some kind of error if the copy fails
  };
  return (
    <Button
      variant="link"
      className="w-fit self-center no-underline active:no-underline focus:no-underline text-muted-foreground font-normal"
      onClick={handleCopyClicked}
    >
      {copied ? (
        <>
          <Check size={16} className="mr-2" /> Copied!
        </>
      ) : (
        <>
          <Copy size={16} className="mr-2" /> {props.buttonLabel}
        </>
      )}
    </Button>
  );
}
