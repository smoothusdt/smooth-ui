import { Balance } from "@/components/Balance";
import { Send } from "@/components/Send";
import { Button } from "@/components/ui/button";
import { Receive } from "@/components/Receive";

import { useLocation, useRoute } from "wouter";

export const Home = () => {
  // minimal navigation setup
  const [home] = useRoute("/");
  const [send] = useRoute("/send");
  const [receive] = useRoute("/receive");
  const [, navigate] = useLocation();

  return (
    <div className="w-full h-ful flex flex-col justify-center gap-4">
      {home && (
        <>
          <Balance />
          <Button onClick={() => navigate("send")}>Send</Button>
          <Button onClick={() => navigate("receive")}>Receive</Button>
        </>
      )}
      {send && <Send />}
      {receive && <Receive />}
    </div>
  );
};
