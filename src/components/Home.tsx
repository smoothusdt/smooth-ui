import { Balance } from "@/components/Balance";
import { Button } from "@/components/ui/button";

import { useLocation } from "wouter";
import { usePwa } from "@dotmind/react-use-pwa";
import { useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";
import { useSmooth } from "@/hooks/useSmooth/useSmooth";

export const Home = () => {
  const { connected } = useWallet();
  const [, navigate] = useLocation();
  const { isOffline } = usePwa();
  const [checkApproval, _] = useSmooth();
  checkApproval(); // fire and forget

  // The user wallet is not set up - cant do anything on this screen
  useEffect(() => {
    if (!connected) navigate("/");
  }, []);

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
