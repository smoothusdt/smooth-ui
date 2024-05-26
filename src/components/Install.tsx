import { UserChoice, usePwa } from "@/hooks/usePwa";
import { Page, PageContent, PageHeader } from "./Page";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { ArrowBigRightDash, CircleCheck, Globe, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

function InstallPrompt(props: { onInstallClicked: () => void }) {
  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div /> {/* for flex alignment */}
          <p className="text-2xl text-center">
            Welcome to smooth
            <br />
            <span className="text-sm text-center text-muted-foreground">
              Install the app to start sending USDT easily.
            </span>
          </p>
          <div className="flex flex-col gap-4">
            {/* <Button onClick={handleCreateWalletClicked}>Create Wallet</Button> */}
            <Button size="lg" onClick={props.onInstallClicked}>
              Install App
            </Button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

function Installing() {
  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-center items-center">
          <Loader2 className="h-4 w-4 animate-spin" />
          <p className="text-sm">Installing...</p>
        </div>
      </PageContent>
    </Page>
  );
}

function InstalledNow() {
  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col gap-4 text-center items-center">
            <CircleCheck size={64} className="text-primary" />
            <span className="text-lg font-semibold">Nice Work</span>
            <p className="text-muted-foreground text-sm">
              Open Smooth USDT app and start making smooth transfers.
            </p>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

function InstalledEarlier() {
  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col gap-4 text-center items-center">
            <ArrowBigRightDash size={64} className="text-primary" />
            <span className="text-lg font-semibold">App installed</span>
            <p className="text-muted-foreground text-sm">
              The Smooth USDT app has already been installed. Find it and open
              on your phone.
            </p>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

export function CantInstall() {
  return (
    <Page>
      <PageHeader>
        <span>
          smooth <span className="text-xs text-muted-foreground"> USDT</span>
        </span>
      </PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col gap-4 text-center items-center">
            <Globe size={64} className="text-primary" />
            <span className="text-lg font-semibold">Welcome to smooth</span>
            <p className="text-muted-foreground text-sm">
              Open this url in your native browser (Chrome on Android, Safari on
              iOS) to install the app.
            </p>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

/**
 * A screen to be displayed when smooth is opened in browser.
 *
 * @returns
 */
export function Install() {
  const [, navigate] = useLocation();
  const {
    canInstall,
    installPrompt,
    wasInstalledNow,
    wasInstalledEarlier,
    isStandalone,
  } = usePwa();
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone) {
      // Is already opened as an installed app.
      navigate("/");
    }
  }, [isStandalone, navigate]);

  const onUserChoiceMade = (choice: UserChoice) => {
    console.log(choice);
    if (choice === UserChoice.DISMISSED) {
      setInstalling(false);
      return;
    }

    // else - doing nothing. Waiting until the app installs.
  };

  const onInstallClicked = () => {
    setInstalling(true);
    installPrompt(onUserChoiceMade);
  };

  if (wasInstalledNow) return <InstalledNow />;
  if (wasInstalledEarlier) return <InstalledEarlier />;
  if (installing) return <Installing />;
  if (canInstall) return <InstallPrompt onInstallClicked={onInstallClicked} />;

  return <CantInstall />;
}
