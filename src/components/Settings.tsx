import { Button } from "@/components/ui/button";
import { LanguageSwitch } from "@/components/LanguageSwitch";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { useTranslation } from "react-i18next";
import { usePrivy } from "@privy-io/react-auth";

/** Full page component for displaying all the settings of Smooth USDT PWA */
export const Settings = () => {
  const { t } = useTranslation();
  const { logout } = usePrivy();

  const onLogout = async () => {
    await logout();
    window.location.reload();
  }

  return (
    <Page>
      <PageHeader canGoBack>Settings</PageHeader>
      <PageContent>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span>{t("language")}</span>
            <LanguageSwitch />
          </div>
          <Button onClick={onLogout} variant="destructive">Log out</Button>
        </div>
      </PageContent>
    </Page>
  );
};
