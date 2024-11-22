import { Receive } from "@/components/Receive";

import { Root } from "@/components/Root";
import { Home } from "@/components/Home";

import { useLocation } from "wouter";
import { usePrivy } from "@privy-io/react-auth";
import { Welcome } from "./Welcome";
import { TermsOfUse } from "./TermsOfUse";
import { useEffect } from "react";
import { Loading } from "./Loading";
import { SignUp } from "./SignUp";
import { SendInput } from "./Send/SendInput";
import { SendConfirm } from "./Send/SendConfirm";
import { Receipt } from "./Send/Receipt";

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
  "/sign-up": {
    component: SignUp,
    needsConnection: false,
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
  "/terms-of-use": {
    component: TermsOfUse,
    needsConnection: false
  }
};

/** Entry point of UI. Should be wrapped in all providers. */
export const App = () => {
  const [location, navigate] = useLocation();
  console.log({ location })
  const { ready, authenticated } = usePrivy();

  useEffect(() => {
    // If privy auth has succeeded, but the user is still on the login screen
    if (authenticated && !screen.needsConnection) return navigate("/home");
  }, [authenticated]);

  const screen = RoutesConfig[location];
  if (!screen) {
    throw new Error(`Page ${location} not recognised`);
  }

  if (!ready) {
    return <Loading />
  }

  if (screen.needsConnection && !authenticated) {
    navigate("/");
    return <div />;
  }

  return <screen.component />;
};
