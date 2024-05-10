// import { useTronWeb } from "./hooks/useTronWeb";
// import { useState } from "react";
import styled from "styled-components";
import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
// import { Button } from "./components/Button";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import { Send } from "./components/Send";

function App() {
  // const tronWeb = useTronWeb();
  const { connected } = useWallet();

  // Quick and dirty test of the tronWeb context
  // const [phrase, setPhrase] = useState<string[]>([]);
  // const handleNewWalletClicked = () => {
  //   // TODO: Is this doing anything on the blockchain?
  //   const p = tronWeb.createRandom();
  //   setPhrase(p.mnemonic?.wordlist.split(p.mnemonic.phrase) ?? []);
  // };

  return (
    <>
      <h1>Smooth USDT</h1>
      <p>Making USDT TRC-20 payments cheap and easy.</p>
      <Card>
        {/* <Button onClick={handleNewWalletClicked}>New wallet</Button> */}
        <WalletActionButton style={{ textAlign: "center" }} />
      </Card>
      {connected && <Send />}
      <p>
        Smooth is a work in progress.{" "}
        <Link href="https://info.smoothusdt.com/">Learn more.</Link>
      </p>
    </>
  );
}

export default App;

/**
 * Quick and dirty component to display the mnemonic
 */
const WordList = (props: { list: string[] }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridTemplateRows: "repeat(4, 1fr)",
        gap: 8,
      }}
    >
      {props.list.map((word) => (
        <div
          style={{ background: "rgba(184, 184, 184, 0.1)", borderRadius: 4 }}
        >
          {word}
        </div>
      ))}
    </div>
  );
};

const Link = styled.a`
  font-weight: 500;
  color: var(--theme-color);
  text-decoration: inherit;

  &:hover {
    color: #535bf2;
  }

  @media (prefers-color-scheme: light) {
    &:hover {
      color: #747bff;
    }
  }
`;

const Card = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  padding: 2rem;
  justify-content: center;
`;
