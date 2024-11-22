import { Receive } from "@/components/Receive";

import { Home } from "@/components/Home";

import { useLocation } from "wouter";
import { usePrivy } from "@privy-io/react-auth";
import { Welcome } from "./Welcome";
import { TermsOfUse } from "./TermsOfUse";
import { useEffect } from "react";
import { SendInput } from "./Send/SendInput";
import { SendConfirm } from "./Send/SendConfirm";
import { Receipt } from "./Send/Receipt";
import { isLoggedIn, logOut } from "@/hooks/useWallet";

interface RouteConfig {
  component: () => JSX.Element;
  needsConnection: boolean;
}

const RoutesConfig: Record<string, RouteConfig> = {
  "/": {
    component: Welcome,
    needsConnection: false,
  },
  "/terms-of-use": {
    component: TermsOfUse,
    needsConnection: false
  },
  "/home": {
    component: Home,
    needsConnection: true,
  },
  "/send": {
    component: SendInput,
    needsConnection: true,
  },
  "/send/confirm": {
    component: SendConfirm,
    needsConnection: true,
  },
  "/tx-receipt": {
    component: Receipt,
    needsConnection: true,
  },
  "/receive": {
    component: Receive,
    needsConnection: true,
  },
};

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  const [location, navigate] = useLocation();
  const { ready, authenticated } = usePrivy();
  const screen = RoutesConfig[location];

  console.log({ location })

  useEffect(() => {
    console.log("Checking privy authentication status")
    if (!ready) return;
    if (!authenticated && screen.needsConnection) {
      // This is needed if privy auth tokens expire over time.
      // But if the user actually logs out, this will result in double call to logOut();
      // Not critical atm, but not good.
      logOut();
      return navigate("/");
    }
  }, [ready, authenticated, location, screen]);

  if (!screen) {
    throw new Error(`Page ${location} not recognised`);
  }

  if (screen.needsConnection && !isLoggedIn()) {
    navigate("/");
    return <div />;
  }

  if (location === "/" && isLoggedIn()) {
    navigate("/home")
    return <div />;
  }

  return <screen.component />;
};
