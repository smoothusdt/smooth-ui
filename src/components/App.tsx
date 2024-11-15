import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { Root } from "@/components/Root";
import { Home } from "@/components/Home";
import { Settings } from "@/components/Settings";
import { Transactions } from "@/components/Transactions";

import { useLocation } from "wouter";
import { usePrivy } from "@privy-io/react-auth";
import { Welcome } from "./Welcome";
import { TermsOfUse } from "./TermsOfUse";

interface RouteConfig {
  component: () => JSX.Element;
  needsConnection: boolean;
}

const RoutesConfig: Record<string, RouteConfig> = {
  "/": {
    component: Root,
    needsConnection: false,
  },
  "/welcome": {
    component: Welcome,
    needsConnection: false,
  },
  "/home": {
    component: Home,
    needsConnection: true,
  },
  "/send": {
    component: Send,
    needsConnection: true,
  },
  "/receive": {
    component: Receive,
    needsConnection: true,
  },
  "/transactions": {
    component: Transactions,
    needsConnection: true,
  },
  "/settings": {
    component: Settings,
    needsConnection: true,
  },
  "/terms-of-use": {
    component: TermsOfUse,
    needsConnection: false
  }
};

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  const [location, navigate] = useLocation();
  const { ready, authenticated } = usePrivy();

  const screen = RoutesConfig[location];
  if (!screen) {
    throw new Error(`Page ${location} not recognised`);
  }

  if (!ready) {
    return <p>loading...</p>
  }

  if (screen.needsConnection && !authenticated) {
    navigate("/");
    return <div />;
  }

  return (
    <main className="container h-full w-full max-w-screen-sm">
      <screen.component />
    </main>
  );
};
