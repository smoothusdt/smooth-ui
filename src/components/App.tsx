import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { Root } from "@/components/Root";
import { SetupWallet } from "@/components/SetupWallet";
import { ImportWallet } from "@/components/ImportWallet";
import { Home } from "@/components/Home";
import { Settings } from "@/components/Settings";
import {
  Backup,
  BackupPrompt,
  BackupSuccess,
  ConfirmBackup,
  StartBackup,
} from "@/components/MnemonicBackup";

import { useRoute } from "wouter";
import { useScreen } from "@/hooks/useScreen";

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  useScreen();

  const [root] = useRoute("/");
  const [setup] = useRoute("/setup");
  const [importWallet] = useRoute("/import");
  const [home] = useRoute("/home");
  const [send] = useRoute("/send");
  const [receive] = useRoute("/receive");
  const [settings] = useRoute("/settings");
  const [backupPrompt] = useRoute("/backup/prompt");
  const [startBackup] = useRoute("/backup/start");
  const [backup] = useRoute("/backup/backup");
  const [confirmBackup] = useRoute("/backup/confirm");
  const [backupSuccess] = useRoute("/backup/success");

  return (
    <main className="container h-full w-full max-w-screen-sm">
      {root && <Root />}
      {setup && <SetupWallet />}
      {importWallet && <ImportWallet />}
      {home && <Home />}
      {send && <Send />}
      {receive && <Receive />}
      {settings && <Settings />}
      {backupPrompt && <BackupPrompt />}
      {startBackup && <StartBackup />}
      {backup && <Backup />}
      {confirmBackup && <ConfirmBackup />}
      {backupSuccess && <BackupSuccess />}
    </main>
  );
};
