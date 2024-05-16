import { PropsWithChildren, useCallback } from "react";
import { usePwa } from "@dotmind/react-use-pwa";
import { Button } from "./ui/button";
import toast from "react-hot-toast";

export const PWA: React.FC<PropsWithChildren> = (props) => {
  const { installPrompt, isInstalled, canInstall } = usePwa();

  const handleInstallPrompt = useCallback(() => {
    if (canInstall) {
      installPrompt();
    } else {
      toast.error("Could not install");
    }
  }, [canInstall, installPrompt]);

  // TODO: isInstalled is not implemented. Copy this hook into repo and develop myself
  if (!isInstalled) {
    return (
      <div className="w-full h-full flex flex-col justify-between gap-4 py-8">
        <Button onClick={handleInstallPrompt}>✨ Install Smooth USDT</Button>
      </div>
    );
  }

  return <>{props.children}</>;
};
