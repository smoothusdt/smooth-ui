import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { useRoute } from "wouter";
import { Root } from "./Root";
import { SetupWallet } from "./Setup";
import { Home } from "./Home";

export const Router = () => {
  // minimal navigation setup
  const [root] = useRoute("/");
  const [setup] = useRoute("/setup");
  const [home] = useRoute("/home");
  const [send] = useRoute("/send");
  const [receive] = useRoute("/receive");

  return (
    <div className="w-full h-ful flex flex-col justify-center gap-4">
      {root && <Root />}
      {setup && <SetupWallet />}
      {home && <Home />}
      {send && <Send />}
      {receive && <Receive />}
    </div>
  );
};
