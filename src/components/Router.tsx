import { Send } from "@/components/Send";
import { Receive } from "@/components/Receive";

import { useRoute } from "wouter";
import { Root } from "./Root";
import { SetupWallet } from "./Setup";
import { Home } from "./Home";
import { Profile } from "./Profile";

export const Router = () => {
  // minimal navigation setup
  const [root] = useRoute("/");
  const [setup] = useRoute("/setup");
  const [home] = useRoute("/home");
  const [send] = useRoute("/send");
  const [receive] = useRoute("/receive");
  const [profile] = useRoute("/profile");

  return (
    <>
      {root && <Root />}
      {setup && <SetupWallet />}
      {home && <Home />}
      {send && <Send />}
      {receive && <Receive />}
      {profile && <Profile />}
    </>
  );
};
