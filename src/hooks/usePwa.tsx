import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const isServer = (): boolean => typeof window === "undefined";

enum UserChoice {
  ACCEPTED = "accepted",
  DISMISSED = "dismissed",
}

interface BeforeInstallPromptEvent extends Event {
  readonly userChoice: Promise<{
    outcome: UserChoice;
    platform: string;
  }>;

  prompt(): Promise<void>;
}

interface IusePwa {
  installPrompt: () => Promise<void>;
  isInstalled: boolean;
  isStandalone: boolean;
  isOffline: boolean;
  canInstall: boolean;
  userChoice: UserChoice | "unknow";
}

/**
 * Hook to provide an interface the PWA related information given by the browser.
 *
 * Based on: [react-use-pwa](https://github.com/dotmind/react-use-pwa/tree/main) but with some fixes.
 */
export const usePwa = (): IusePwa => {
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [isInstalled, setInstalled] = useState<boolean>(false);
  const [isOffline, setOffline] = useState<boolean>(false);
  const [userChoice, setUserChoice] = useState<IusePwa["userChoice"]>("unknow");
  const deferredPrompt =
    useRef() as React.MutableRefObject<BeforeInstallPromptEvent | null>;

  const handleInstallEvent = useCallback(() => setInstalled(true), []);

  const handleBeforePromptEvent = useCallback((event: Event) => {
    event.preventDefault();
    deferredPrompt.current = event as BeforeInstallPromptEvent;
    setCanInstall(true);
  }, []);

  const handleOfflineEvent = useCallback(
    (offline: boolean) => () => {
      setOffline(offline);
    },
    [],
  );

  useEffect(() => {
    if (isServer()) {
      return;
    }

    window.addEventListener("beforeinstallprompt", handleBeforePromptEvent);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforePromptEvent,
      );
  }, [handleBeforePromptEvent]);

  useEffect(() => {
    if (isServer()) {
      return;
    }

    window.addEventListener("appinstalled", handleInstallEvent);
    return () => window.removeEventListener("appinstalled", handleInstallEvent);
  }, [handleInstallEvent]);

  useEffect(() => {
    if (isServer()) {
      return;
    }

    if (navigator) {
      setOffline(!navigator.onLine);
    }

    window.addEventListener("online", handleOfflineEvent(false));
    window.addEventListener("offline", handleOfflineEvent(true));
    return () => {
      window.removeEventListener("online", handleOfflineEvent(false));
      window.removeEventListener("offline", handleOfflineEvent(true));
    };
  }, [handleOfflineEvent]);

  const installPrompt = useCallback(async () => {
    if (!deferredPrompt.current || isServer()) {
      return;
    }

    deferredPrompt.current.prompt();
    const choiceResult = await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setUserChoice(choiceResult.outcome);
  }, []);

  const isStandalone = useMemo(
    () =>
      !isServer() &&
      (navigator.standalone ||
        window.matchMedia("(display-mode: standalone)").matches),
    [],
  );

  return {
    installPrompt,
    isInstalled,
    isStandalone,
    isOffline,
    canInstall,
    userChoice,
  };
};
