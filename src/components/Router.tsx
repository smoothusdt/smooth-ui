import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { useRoute } from "wouter";
import { Root } from "./Root";
import { ImportWallet, SetupWallet } from "./Setup";
import { Home } from "./Home";
import { Settings } from "./Settings";
import {
  Backup,
  BackupPrompt,
  BackupSuccess,
  ConfirmBackup,
  StartBackup,
} from "./MnemonicBackup";

export const Router = () => {
  // minimal navigation setup
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
    <>
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
    </>
  );
};
