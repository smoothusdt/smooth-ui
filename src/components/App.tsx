import { Router } from "@/components/Router";
import { OfflineBadge } from "@/components/OfflineBadge";
import { Button } from "@/components/ui/button";

import { Settings } from "lucide-react";

import { useLocation, useRoute } from "wouter";
import { usePwa } from "@dotmind/react-use-pwa";
import { useWallet } from "@/hooks/useWallet";

function ProfileButton() {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();

  return (
    <Button variant="outline" onClick={() => navigate("/profile")}>
      {wallet?.address.slice(0, 4)}...
      <Settings className="pl-2" />
    </Button>
  );
}

function App() {
  const { isOffline } = usePwa();
  const { connected } = useWallet();
  const [profile] = useRoute("/profile");
  const [backup] = useRoute("/backup/*");

  return (
    <main className="container h-full w-full max-w-screen-sm flex flex-col">
      <div className="flex justify-between align-top py-8">
        <div>
          <h1 className="text-3xl font-semibold">
            smooth <span className="text-xs text-muted-foreground"> USDT</span>
          </h1>
          {isOffline && <OfflineBadge />}
        </div>
        {connected && !profile && !backup && <ProfileButton />}
      </div>
      <div className="flex-1 pb-8">
        <Router />
      </div>
    </main>
  );
}

export default App;
