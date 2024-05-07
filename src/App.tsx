import { useTronWeb } from "./hooks/useTronWeb"
import { useState } from "react";
import { SelectWalletPrototype } from "./components/SelectWalletPrototype";
import styled from "styled-components";

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
      <p>Making USDT TRC-20 payments cheap and easy.</p>
      { phrase.length === 0 ? <Card>
        <Button onClick={handleNewWalletClicked}>
          New wallet
        </Button>
        <SelectWalletPrototype />
      </Card> : <WordList list={phrase}/> }
      <p>
        Smooth is a work in progress. <Link href='https://info.smoothusdt.com/'>Learn more.</Link>
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

/**
 * Just the Vite button styles as a sc.
 */
const Button = styled.button`
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
  transition: filter 300ms;
  will-change: filter;


  &:hover {
    border-color: #646cff;
    filter: drop-shadow(0 0 1em #646cffaa);
  }

  &:focus,
  &:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
  }

  @media (prefers-color-scheme: light) {
    background-color: #f9f9f9;
  }
`;

const Link = styled.a`
  font-weight: 500;
  color: #646cff;
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
  flex-direction: column;
  gap: 16px;
  padding: 2rem;
`;