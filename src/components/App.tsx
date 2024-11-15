import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { Root } from "@/components/Root";
import { Home } from "@/components/Home";
import { Settings } from "@/components/Settings";
import { Transactions } from "@/components/Transactions";

import { useLocation } from "wouter";
import { useWallet } from "@/hooks/useWallet";

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
  "/transactions": {
    component: Transactions,
    needsStandalone: true,
    needsConnection: true,
  },
  "/settings": {
    component: Settings,
    needsStandalone: true,
    needsConnection: true,
  },
};

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  const [location, navigate] = useLocation();
  const { connected } = useWallet();

  const screen = RoutesConfig[location];
  if (!screen) {
    throw new Error(`Page ${location} not recognised`);
  }

  // Make sure the user doesn't get stuck on a stale page
  // (e.g. if useWallet resets we are fucked in most cases).
  if (screen.needsConnection && !connected) {
    navigate("/");
    return <div />;
  }

  return (
    <main className="container h-full w-full max-w-screen-sm">
      <screen.component />
    </main>
  );
};
