import { PageContent } from "../Page";

export function SendSuccess(props: { txID: string }) {
    return (
        <PageContent>
            success! {props.txID}
        </PageContent>
    );
}