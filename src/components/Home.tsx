import { Balance } from "@/components/Balance";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp } from "lucide-react";

import { useLocation } from "wouter";
import { usePwa } from "@dotmind/react-use-pwa";
import { useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";

export const Home = () => {
  const { connected } = useWallet();
  const [, navigate] = useLocation();
  const { isOffline } = usePwa();

  // The user wallet is not set up - cant do anything on this screen
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  return (
    <div className="size-full flex flex-col justify-between">
      <Balance />
      <div className="w-full flex gap-4 justify-between">
        <Button
          className="w-96 h-14 gap-2"
          disabled={isOffline}
          onClick={() => navigate("send")}
        >
          <ArrowUp />
          Send
        </Button>
        <Button className="w-96 h-14 gap-2" onClick={() => navigate("receive")}>
          <ArrowDown />
          Receive
        </Button>
      </div>
    </div>
  );
};
