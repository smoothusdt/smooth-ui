import { FC, PropsWithChildren } from "react";

import { OfflineBadge } from "@/components/OfflineBadge";
import { Button } from "@/components/ui/button";
import { ShastaBadge } from "../ShastaBadge";

import { ChevronLeft, Settings } from "lucide-react";

import { usePwa } from "@/hooks/usePwa";
import { useWallet } from "@/hooks/useWallet";
import { useRoute, useLocation } from "wouter";

import { cn } from "@/lib/utils";

export const PageHeader: FC<PropsWithChildren<{ hasBack?: boolean }>> = (
  props,
) => {
  const { children } = props;
  const hasBack = props.hasBack ?? false;

  const { isOffline } = usePwa();
  const { connected } = useWallet();
  const [profile] = useRoute("/settings");
  const [backup] = useRoute("/backup/*");

  const isShasta = import.meta.env.VITE_CHAIN === "shasta";

  return (
    <div className="flex justify-between items-center py-8">
      <div>
        <div className="flex items-center align-middle animate-in slide-in-from-left-3">
          {hasBack && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.history.back()}
              className="pl-0 pr-1"
            >
              <ChevronLeft size={28} />
            </Button>
          )}
          <h1 className="text-3xl font-semibold leading-4">{children}</h1>
        </div>
        <div className={cn(hasBack && "pl-[40px]", "flex gap-2")}>
          {isOffline && <OfflineBadge />}
          {/* {isShasta && <ShastaBadge />} */}
        </div>
      </div>
      {connected && !profile && !backup && <ProfileButton />}
    </div>
  );
};

/** Local component to display a wallet / settings button indicating the wallet is added and there are settings for it */
const ProfileButton = () => {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();

  return (
    <Button variant="outline" onClick={() => navigate("/settings")}>
      {wallet?.address.slice(0, 4)}...
      <Settings className="pl-2" />
    </Button>
  );
};
