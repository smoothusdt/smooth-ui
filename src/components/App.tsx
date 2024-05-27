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
  StartBackup,
} from "@/components/MnemonicBackup";

import { useLocation } from "wouter";
import { Install } from "./Install";
import { useWallet } from "@/hooks/useWallet";
import { usePwa } from "@/hooks/usePwa";

interface RouteConfig {
  component: () => JSX.Element;
  needsStandalone: boolean;
  needsConnection: boolean;
}

const RoutesConfig: Record<string, RouteConfig> = {
  "/": {
    component: Root,
    needsStandalone: false,
    needsConnection: false,
  },
  "/install": {
    component: Install,
    needsStandalone: false,
    needsConnection: false,
  },
  "/setup": {
    component: SetupWallet,
    needsStandalone: true,
    needsConnection: false,
  },
  "/import": {
    component: ImportWallet,
    needsStandalone: true,
    needsConnection: false,
  },
  "/home": {
    component: Home,
    needsStandalone: true,
    needsConnection: true,
  },
  "/send": {
    component: Send,
    needsStandalone: true,
    needsConnection: true,
  },
  "/receive": {
    component: Receive,
    needsStandalone: true,
    needsConnection: true,
  },
  "/settings": {
    component: Settings,
    needsStandalone: true,
    needsConnection: true,
  },
  "/backup/prompt": {
    component: BackupPrompt,
    needsStandalone: true,
    needsConnection: true,
  },
  "/backup/start": {
    component: StartBackup,
    needsStandalone: true,
    needsConnection: true,
  },
  "/backup/backup": {
    component: Backup,
    needsStandalone: true,
    needsConnection: true,
  },
  "/backup/success": {
    component: BackupSuccess,
    needsStandalone: true,
    needsConnection: true,
  },
};

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  const [location, navigate] = useLocation();
  const { isStandalone } = usePwa();
  const { connected } = useWallet();

  const screen = RoutesConfig[location];
  if (!screen) {
    throw new Error(`Page ${location} not recognised`);
  }

  // Make sure the user doesn't get stuck on a stale page
  // (e.g. if useWallet resets we are fucked in most cases).
  if (screen.needsStandalone && !isStandalone) {
    navigate("/");
    return <div />;
  } else if (screen.needsConnection && !connected) {
    navigate("/");
    return <div />;
  }

  return (
    <main className="container h-full w-full max-w-screen-sm">
      <screen.component />
    </main>
  );
};
