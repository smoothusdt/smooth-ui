// import { useTronWeb } from "./hooks/useTronWeb";
// import { useState } from "react";
// import { WalletActionButton } from "@tronweb3/tronwallet-adapter-react-ui";
// import { Button } from "./components/Button";
// import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
// import styled from "styled-components";

import { Send } from "./components/Send";
import { Link } from "./components/Link";
import { privateKey } from "./hooks/useSmooth/constants";

function App() {
  // const tronWeb = useTronWeb();
  // const { connected } = useWallet();
  const connected = privateKey && privateKey !== undefined && privateKey !== "";

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
      {/* <Card>
        <Button onClick={handleNewWalletClicked}>New wallet</Button>
        <WalletActionButton style={{ textAlign: "center" }} />
      </Card> */}
      {connected ? <Send /> : <ConnectMessage />}
      <p>
        Smooth is a work in progress.{" "}
        <Link href="https://info.smoothusdt.com/">Learn more.</Link>
        <br /> ❗ Only works for approved accounts currently. ❗
      </p>
    </>
  );
}

export default App;

const ConnectMessage = () => {
  return (
    <span>
      Set a private key in{" "}
      <strong>
        <code>.env</code>
      </strong>{" "}
      to connect.
    </span>
  );
};

/**
 * Quick and dirty component to display the mnemonic
 */
// const WordList = (props: { list: string[] }) => {
//   return (
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "repeat(3, 1fr)",
//         gridTemplateRows: "repeat(4, 1fr)",
//         gap: 8,
//       }}
//     >
//       {props.list.map((word) => (
//         <div
//           style={{ background: "rgba(184, 184, 184, 0.1)", borderRadius: 4 }}
//         >
//           {word}
//         </div>
//       ))}
//     </div>
//   );
// };

// const Card = styled.div`
//   display: flex;
//   flex-direction: row;
//   gap: 16px;
//   padding: 2rem;
//   justify-content: center;
// `;
