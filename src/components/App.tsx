import { Router } from "@/components/Router";
import { Badge } from "@/components/ui/badge";
import { usePwa } from "@dotmind/react-use-pwa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/useWallet";

function ProfileButton() {
  const [, navigate] = useLocation();
  return (
    <Button variant="outline" onClick={() => navigate("/profile")}>
      <User />
    </Button>
  );
}

function App() {
  const { isOffline } = usePwa();
  const { connected } = useWallet();

  return (
    <main className="container mx-auto w-96">
      <div className="flex justify-between align-top pt-8 pb-8">
        <div>
          <h1 className="text-3xl font-semibold">Smooth USDT</h1>
          {isOffline && (
            <Popover>
              <PopoverTrigger>
                <Badge variant="destructive">offline</Badge>
              </PopoverTrigger>
              <PopoverContent>
                Balance may be inaccurate and sending is not available.
              </PopoverContent>
            </Popover>
          )}
        </div>
        {connected && <ProfileButton />}
      </div>
      <Router />
    </main>
  );
}

export default App;
