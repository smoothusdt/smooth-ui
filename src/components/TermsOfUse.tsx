import TermsOfUseContent from "@/TermsOfUse.md";
import Markdown from "react-markdown";


export function TermsOfUse() {
  return <Markdown className={"prose prose-sm dark:prose-invert"}>
    {TermsOfUseContent}
  </Markdown>
}