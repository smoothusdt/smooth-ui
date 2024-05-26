import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const isServer = (): boolean => typeof window === "undefined";

export enum UserChoice {
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
  installPrompt: (callback: (choice: UserChoice) => void) => Promise<void>;
  wasInstalledNow: boolean;
  isStandalone: boolean;
  isOffline: boolean;
  canInstall: boolean;
  wasInstalledEarlier: boolean;
}

/**
 * Hook to provide an interface the PWA related information given by the browser.
 *
 * Based on: [react-use-pwa](https://github.com/dotmind/react-use-pwa/tree/main) but with some fixes.
 */
export const usePwa = (): IusePwa => {
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [wasInstalledNow, setWasInstalledNow] = useState<boolean>(false);
  const [wasInstalledEarlier, setWasInstalledEarlier] =
    useState<boolean>(false);
  const [isOffline, setOffline] = useState<boolean>(false);
  const deferredPrompt =
    useRef() as React.MutableRefObject<BeforeInstallPromptEvent | null>;

  const handleInstallEvent = useCallback(() => {
    console.log("App installed event");
    setWasInstalledNow(true);
  }, []);

  const handleBeforePromptEvent = useCallback((event: Event) => {
    console.log("beforeinstallprompt event");
    event.preventDefault();
    console.log;
    deferredPrompt.current = event as BeforeInstallPromptEvent;
    setCanInstall(true);
  }, []);

  const handleOfflineEvent = useCallback(
    (offline: boolean) => () => {
      console.log("offline event", offline);
      setOffline(offline);
    },
    [],
  );

  useEffect(() => {
    if (isServer()) {
      return;
    }

    window.addEventListener("beforeinstallprompt", handleBeforePromptEvent);
    console.log("Added a listener for beforeinstallprompt");
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
    console.log("Added a listener for appinstalled");
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
    console.log("Added a listener for offline / online");
    return () => {
      window.removeEventListener("online", handleOfflineEvent(false));
      window.removeEventListener("offline", handleOfflineEvent(true));
    };
  }, [handleOfflineEvent]);

  useEffect(() => {
    (async () => {
      try {
        const installedApps = await (
          navigator as any
        ).getInstalledRelatedApps();
        setWasInstalledEarlier(installedApps.length > 0);
      } catch (error: any) {
        // Sad if happens, but is not the end of the world
        console.error("Couldnt get standalone apps list", error);
      }
    })();
  }, []);

  const installPrompt = useCallback(
    async (callback: (choice: UserChoice) => void) => {
      if (!deferredPrompt.current || isServer()) {
        return;
      }

      deferredPrompt.current.prompt();
      const choiceResult = await deferredPrompt.current.userChoice;
      deferredPrompt.current = null;
      callback(choiceResult.outcome);
    },
    [],
  );

  const isStandalone = useMemo(
    () =>
      !isServer() && window.matchMedia("(display-mode: standalone)").matches,
    [],
  );

  return {
    installPrompt,
    wasInstalledNow,
    isStandalone,
    isOffline,
    canInstall,
    wasInstalledEarlier,
  };
};
