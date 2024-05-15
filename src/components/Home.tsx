import { useState } from "react";
import { Balance } from "./Balance";
import { Send } from "./Send";
import { Button } from "./ui/button";
import { Receive } from "./Receive";

// Super minimal navigation setup
type Mode = "send" | "receive";
export interface GoesBack {
  onBack: () => void;
}

export const Home = () => {
  const [mode, setMode] = useState<Mode>();

  return (
    <div className="w-full h-ful flex flex-col justify-center gap-4">
      {!mode && (
        <>
          <Balance />
          <Button onClick={() => setMode("send")}>Send</Button>
          <Button onClick={() => setMode("receive")}>Receive</Button>
        </>
      )}
      {mode === "send" && <Send onBack={() => setMode(undefined)} />}
      {mode === "receive" && <Receive onBack={() => setMode(undefined)} />}
    </div>
  );
};
