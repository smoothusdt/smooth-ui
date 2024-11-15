import { Loader, Loader2 } from "lucide-react";
import { Page, PageContent, PageHeader } from "./Page";

export function Loading() {

    return (
        <Page>
            <PageHeader>
                <span>
                    smooth <span className="text-xs text-muted-foreground"> USDT</span>
                </span>
            </PageHeader>
            <PageContent>
                <div className="w-full h-full flex justify-center items-center">
                    <Loader2
                        className="text-primary animate-spin"
                    />
                </div>
            </PageContent>
        </Page>
    );
}