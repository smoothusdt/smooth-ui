import { Balance } from "@/components/Balance";
import { Button } from "@/components/ui/button";

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
    <>
      <Balance />
      <Button disabled={isOffline} onClick={() => navigate("send")}>
        Send
      </Button>
      <Button onClick={() => navigate("receive")}>Receive</Button>
    </>
  );
};
