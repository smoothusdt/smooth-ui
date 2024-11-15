import { Page, PageContent, PageHeader } from "./Page";

export function Welcome() {
    return (
        <Page>
            <PageHeader>
                <span>
                    smooth <span className="text-xs text-muted-foreground"> USDT</span>
                </span>
            </PageHeader>
            <PageContent>
                welcommen
            </PageContent>
        </Page>
    );
}