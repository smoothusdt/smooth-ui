import { usePrivy } from "@privy-io/react-auth";
import { Page, PageContent, PageHeader } from "./Page";
import { Button } from "./ui/button";

export function SignUp() {
    const { login } = usePrivy();

    return (
        <Page>
            <PageHeader canGoBack>
                <span>
                    smooth <span className="text-xs text-muted-foreground"> USDT</span>
                </span>
            </PageHeader>
            <PageContent>
                <div className="h-full flex flex-col items-center justify-center gap-4">
                    <p className="text-2xl text-center">What is Smooth USDT?</p>
                    <p className="w-full">Smooth USDT is a <strong>non-custodial</strong> crypto wallet. This means that:<br />
                        - We will never ask you for identity verification<br />
                        - You can safely use it to deposit / withdraw USDT from any crypto exchange
                    </p>
                    <Button onClick={login} className="w-full">Create Wallet</Button>
                    <span className="text-xs text-muted-foreground font-light text-center">
                        By continuing you agree to the Smooth USDT{" "}
                        <Button onClick={() => window.location.pathname = "/terms-of-use"} variant="link" className="text-xs font-light p-0">
                            Terms of Use
                        </Button>
                    </span>
                </div>
            </PageContent>
        </Page >
    );
}