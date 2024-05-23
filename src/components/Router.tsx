import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { useRoute } from "wouter";
import { Root } from "./Root";
import { SetupWallet } from "./Setup";
import { Home } from "./Home";
import { Profile } from "./Profile";
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
  const [home] = useRoute("/home");
  const [send] = useRoute("/send");
  const [receive] = useRoute("/receive");
  const [profile] = useRoute("/profile");
  const [backupPrompt] = useRoute("/backup/prompt");
  const [startBackup] = useRoute("/backup/start");
  const [backup] = useRoute("/backup/backup");
  const [confirmBackup] = useRoute("/backup/confirm");
  const [backupSuccess] = useRoute("/backup/success");

  return (
    <>
      {root && <Root />}
      {setup && <SetupWallet />}
      {home && <Home />}
      {send && <Send />}
      {receive && <Receive />}
      {profile && <Profile />}
      {backupPrompt && <BackupPrompt />}
      {startBackup && <StartBackup />}
      {backup && <Backup />}
      {confirmBackup && <ConfirmBackup />}
      {backupSuccess && <BackupSuccess />}
    </>
  );
};
