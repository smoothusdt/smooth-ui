import { ImportAccount } from "./components/ImportAccount";
import { useWallet } from "./hooks/useWallet";
import { Link } from "@/components/Link";
import { Home } from "@/components/Home";

function App() {
  const { connected } = useWallet();

  return (
    <main className="container mx-auto w-96 flex flex-col justify-center gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Smooth USDT</h1>
        <span className="text-sm text-muted-foreground">
          Cheap, easy USDT TRC-20 payments
        </span>
      </div>

      {connected ? <Home /> : <ImportAccount />}

      <span className="text-sm text-muted-foreground">
        Smooth is a work in progress.{" "}
        <Link href="https://info.smoothusdt.com/">Learn more.</Link>
        <br />
        Accounts must be activated and approved.
      </span>
    </main>
  );
}

export default App;
