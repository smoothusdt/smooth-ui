import { Receive } from "@/components/Receive";

import { Home } from "@/components/Home";

import { useLocation } from "wouter";
import { Welcome } from "./Login/Welcome";
import { TermsOfUse } from "./Login/TermsOfUse";
import { SendInput } from "./Send/SendInput";
import { SendConfirm } from "./Send/SendConfirm";
import { Receipt } from "./Send/Receipt";
import { PinLogin } from "./Login/PinLogin";
import { useSigner } from "@/hooks/useSigner";

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
  const screen = RoutesConfig[location];
  const { isEncryptedPhraseSet, isDecryptedPhraseSet } = useSigner();

  console.log("On screen:", location);

  if (!screen) {
    throw new Error(`Screen ${location} not recognised`);
  }

  if (screen.needsConnection) {
    // needs to go through the entire login flow.
    if (!isEncryptedPhraseSet) {
      navigate("/")
      return;
    }

    // Ask for pin code without altering the URL.
    if (!isDecryptedPhraseSet) {
      return <PinLogin navigateAfterLogin={false} />
    }
  }

  if (location === "/" && isEncryptedPhraseSet && !isDecryptedPhraseSet) {
    return <PinLogin navigateAfterLogin={true} />
  }

  return <screen.component />;
};
