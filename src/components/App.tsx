import { ImportWallet } from "@/components/ImportAccount";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "@/components/Link";
import { Router } from "@/components/Router";
import { ThemeSwitch } from "@/components/ThemeSwitch";
import { Badge } from "@/components/ui/badge";
// import { PWA } from "./pwa";
import { usePwa } from "@dotmind/react-use-pwa";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function App() {
  const { isOffline } = usePwa();

  return (
    <main className="container mx-auto w-96 flex flex-col justify-center">
      <div className="w-full h-full max-h-[900px] flex flex-col justify-between gap-4 py-8">
        <div className="flex justify-between align-top">
          <div>
            <h1 className="text-3xl font-semibold">Smooth USDT</h1>
            <span className="text-sm text-muted-foreground">
              Cheap, easy USDT TRC-20 payments
            </span>
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
          <ThemeSwitch />
        </div>
        <Router />

        <span className="text-sm text-muted-foreground self-center">
          Smooth is a work in progress.{" "}
          <Link href="https://info.smoothusdt.com/">Learn more.</Link>
          <br />
          Accounts must be activated and approved.
        </span>
        {/* </PWA> */}
      </div>
    </main>
  );
}

export default App;
