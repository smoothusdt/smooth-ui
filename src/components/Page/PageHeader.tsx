import { FC, PropsWithChildren } from "react";

import { OfflineBadge } from "@/components/OfflineBadge";
import { Button } from "@/components/ui/button";

import { ChevronLeft, Settings } from "lucide-react";

import { usePwa } from "@/hooks/usePwa";
import { useWallet } from "@/hooks/useWallet";
import { useRoute, useLocation } from "wouter";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  /** Should the header display a back button and where it shall lead? */
  backPath?: string;
}

/**
 * Use the as the first descendent of`<Page/>` to give your page the global header.
 */
export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = (props) => {
  const { children } = props;
  const backPath = props.backPath;
  const hasBack = backPath !== undefined;

  const { isOffline } = usePwa();
  const { connected } = useWallet();
  const [, navigate] = useLocation();
  const [profile] = useRoute("/settings");
  const [backup] = useRoute("/backup/*");

  return (
    <div className="flex justify-between items-center py-8">
      <div>
        <div className="flex items-center align-middle animate-in slide-in-from-left-3">
          {hasBack && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => navigate(backPath, { replace: true })}
              className="pl-0 pr-1"
            >
              <ChevronLeft size={28} />
            </Button>
          )}
          <h1 className="text-3xl font-semibold leading-4">{children}</h1>
        </div>
        <div className={cn(hasBack && "pl-[40px]", "flex gap-2")}>
          {isOffline && <OfflineBadge />}
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
    <Button
      variant="outline"
      onClick={() => navigate("/settings", { replace: true })}
    >
      {wallet?.address.slice(0, 4)}...
      <Settings className="pl-2" />
    </Button>
  );
};
