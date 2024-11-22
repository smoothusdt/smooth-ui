import { PageContainer } from "./PageContainer";
import Markdown from "react-markdown";
import TermsOfUseContent from "@/TermsOfUse.md";

export function TermsOfUse() {
  return <PageContainer title="Terms Of Use">
    <Markdown className="prose prose-sm dark:prose-invert pb-16">
      {TermsOfUseContent}
    </Markdown>
  </PageContainer>
}