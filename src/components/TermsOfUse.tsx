import TermsOfUseContent from "@/TermsOfUse.md";
import Markdown from "react-markdown";
import { Page, PageContent, PageHeader } from "./Page";


export function TermsOfUse() {
  return (
    <Page>
      <PageHeader canGoBack>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <Markdown className={"prose prose-sm dark:prose-invert"}>
          {TermsOfUseContent}
        </Markdown>
      </PageContent>
    </Page>
  );
}