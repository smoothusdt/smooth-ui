import { FC, PropsWithChildren } from "react";

/**
 * Represent a full page of the app. Use this as the root of your component JSX if you intend it to be a full page.
 * - Use the `<PageHeader />` as the first descendent to give your page the global header.
 * - Use `<PageContent />` as the second descendent with all your content inside.
 *
 * @example
 * ```
 * <Page>
 *    <PageHeader>My Page</PageHeader>
 *    <PageContent><div>My Page Content</div></PageContent>
 * </Page>
 * ```
 */
export const Page: FC<PropsWithChildren> = (props) => {
  return (
    <main className="container h-full w-full max-w-screen-sm">
      <div className="h-full w-full flex flex-col">
        {props.children}
      </div>
    </main>
  );
};
