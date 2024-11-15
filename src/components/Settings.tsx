import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

/** Full page component for displaying all the settings of Smooth USDT PWA */
export const Settings = () => {
  const [, navigate] = useLocation();
  const { connected } = useWallet();
  const { t } = useTranslation();

  if (!connected) {
    navigate("/"); // wallet was deleted
    return <div />;
  }

  return (
    <Page>
      <PageHeader backPath="/home">Settings</PageHeader>
      <PageContent>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span>{t("language")}</span>
            <LanguageSwitch />
          </div>
          <Button variant="destructive">Log out</Button>
        </div>
      </PageContent>
    </Page>
  );
};
