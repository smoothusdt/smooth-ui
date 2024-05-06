import { useTronWeb } from "./hooks/useTronWeb"
import { useState } from "react";

function App() {

  const tronWeb = useTronWeb();

  // Quick and dirty test of the tronWeb context
  const [phrase, setPhrase] = useState<string[]>([]);
  const handleNewWalletClicked = () => {
    // TODO: Is this doing anything on the blockchain?
    const p = tronWeb.createRandom();
    setPhrase(p.mnemonic?.wordlist.split(p.mnemonic.phrase) ?? []);
  }
  
  return (
    <>
      <h1>Smooth USDT</h1>
      { phrase.length === 0 ? <div className="card">
        <button onClick={handleNewWalletClicked}>
          New wallet
        </button>
        <button>
          Import your wallet
        </button>
      </div> : <WordList list={phrase}/> }
      <p className="read-the-docs">
        Smooth is a work in progress. <a href='https://info.smoothusdt.com/'>Learn more.</a>
      </p>
    </>
  )
}

export default App

/**
 * Quick and dirty component to display the mnemonic
 */
const WordList = (props: {list: string[]}) => {
  return (
    <div style={{display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 8}}>
      {props.list.map(word => <div style={{background: "rgba(184, 184, 184, 0.1)", borderRadius: 4}}>{word}</div>)}
    </div>
  )
}