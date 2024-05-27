import { AppInstalledKey, AppInstalledValue } from "@/constants";
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
  onInstall: () => void;
  installedAsApk: boolean;
  installedAsShortcut: boolean;
  isStandalone: boolean;
  isOffline: boolean;
  canInstall: boolean;
  isMobile: boolean;
  mobileOS: "iOS" | "Android" | "Windows Phone" | "unknown"; // use only if isMobile is true
  isBadBrowser: boolean;
}

/**
 * Determine the mobile operating system.
 * This function returns one of 'iOS', 'Android', 'Windows Phone', or 'unknown'.
 *
 * Taken from https://stackoverflow.com/a/21742107/14865673
 * @returns {String}
 */
function getMobileOperatingSystem() {
  const userAgent =
    navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }

  if (/android/i.test(userAgent)) {
    return "Android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "iOS";
  }

  return "unknown";
}

export function reinstallApp() {
  localStorage.removeItem(AppInstalledKey);
  window.location.reload();
}

function isInstalledChecker() {
  return localStorage.getItem(AppInstalledKey) === AppInstalledValue;
}

/**
 * Hook to provide an interface the PWA related information given by the browser.
 *
 * Based on: [react-use-pwa](https://github.com/dotmind/react-use-pwa/tree/main) but with some fixes.
 */
export const usePwa = (): IusePwa => {
  const [canInstall, setCanInstall] = useState<boolean>(false);
  const [installedAsApk, setInstalledAsApk] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState(isInstalledChecker());
  const [isOffline, setOffline] = useState<boolean>(false);
  const deferredPrompt =
    useRef() as React.MutableRefObject<BeforeInstallPromptEvent | null>;

  const onInstall = useCallback(() => {
    console.log("App installed event");
    localStorage.setItem(AppInstalledKey, AppInstalledValue);
    setIsInstalled(true);
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

    window.addEventListener("appinstalled", onInstall);
    console.log("Added a listener for appinstalled");
    return () => window.removeEventListener("appinstalled", onInstall);
  }, [onInstall]);

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
        setInstalledAsApk(installedApps.length > 0);
      } catch (error: any) {
        // Sad if happens, but is not the end of the world.
        // Happens on everything non-android essentially.
        console.log("Couldnt get standalone apps list", error);
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

  const isMobile = useMemo(
    () => window.screen.height / window.screen.width > 1,
    [],
  );

  const mobileOS = useMemo(getMobileOperatingSystem, []);

  // Yandex Browser opens the shortcut as a tab in browser,
  // not as a standalone app, which is bad.
  const isBadBrowser = useMemo(() => Object.hasOwn(window, "yandex"), []);

  // No useMemo bcs we recompute this after app installation
  const installedAsShortcut = isInstalled && !installedAsApk;

  return {
    installPrompt,
    onInstall,
    installedAsApk,
    installedAsShortcut,
    isStandalone,
    isOffline,
    canInstall,
    isMobile,
    mobileOS,
    isBadBrowser,
  };
};
