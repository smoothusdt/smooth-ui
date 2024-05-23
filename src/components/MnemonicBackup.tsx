import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { shuffle } from "@/util";
import { Alert } from "./ui/alert";
import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";

/**
 * Quick and dirty component to display the mnemonic
 */
const WordList = (props: { list: string[] }) => {
  return (
    <div className="pb-8">
      <p className="text-2xl pb-8">Your secret phrase</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gridTemplateRows: "repeat(4, 1fr)",
          gap: 8,
        }}
      >
        {props.list.map((word, index) => (
          <div key={index}>
            {index + 1}. {word}
          </div>
        ))}
      </div>
    </div>
  );
};

export function StartBackup() {
  const [, navigate] = useLocation();

  return (
    <div className="h-full flex flex-col justify-between">
      <p>
        <span className="text-2xl">Backing up</span>
        <br />
        <br />
        You are about to see your secret phrase.
        <br />
        <br />
        Remember: whoever knows the secret phrase has full control over the
        wallet.
        <br />
        <br />
        Don't lose your secret phrase and don't let anybody else see it.
      </p>
      <Button onClick={() => navigate("backup")}>Reveal</Button>
    </div>
  );
}

export function Backup() {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();

  return (
    <div className="h-full flex flex-col justify-between">
      <WordList list={wallet!.mnemonic.phrase.split(" ")} />
      <Button className="w-full" onClick={() => navigate("confirm")}>
        I have backed up
      </Button>
    </div>
  );
}

function WordConfirmation(props: {
  word: string;
  setWord: (arg0: string) => void;
  wordIndex: number;
}) {
  return (
    <div className="flex pt-2 pb-2">
      <Label
        htmlFor="text-input-amount"
        className="flex flex-col justify-center w-32"
      >
        Word #{props.wordIndex}
      </Label>
      <Input
        className="w-32"
        id="text-input-amount"
        type="text"
        value={props.word}
        onChange={(e) => props.setWord(e.target.value)}
      />
    </div>
  );
}

export function ConfirmBackup() {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();
  const mnemonicWords = wallet!.mnemonic.phrase.split(" ");

  const [wordA, setWordA] = useState("");
  const [wordB, setWordB] = useState("");
  const [wordC, setWordC] = useState("");
  const [wordsAreInvalid, setWordsAreInvalid] = useState(false);

  const wordIndices = useRef<number[]>([]);

  if (wordIndices.current.length === 0) {
    // Generate 3 words indices that we prompt the user for
    const allIndices = Array.from(Array(12).keys()); // [0, 1, 2 ... 9, 10, 11]
    shuffle(allIndices);
    wordIndices.current = [allIndices[0], allIndices[1], allIndices[2]];
    wordIndices.current.sort((a, b) => a - b);
  }

  const wordAIndex: number | undefined = wordIndices.current[0];
  const wordBIndex: number | undefined = wordIndices.current[1];
  const wordCIndex: number | undefined = wordIndices.current[2];

  const confirmWords = () => {
    const wordAValid = wordA.trim() === mnemonicWords[wordAIndex];
    const wordBValid = wordB.trim() === mnemonicWords[wordBIndex];
    const wordCValid = wordC.trim() === mnemonicWords[wordCIndex];

    const allWordsValid = wordAValid && wordBValid && wordCValid;
    if (!allWordsValid) {
      setWordsAreInvalid(true);
      return;
    }

    navigate("success");
  };

  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <p className="pb-2">
          <span className="text-2xl">Confirm the backup</span>
        </p>
        <WordConfirmation
          word={wordA}
          setWord={setWordA}
          wordIndex={wordAIndex + 1} // +1 for human readability
        />
        <WordConfirmation
          word={wordB}
          setWord={setWordB}
          wordIndex={wordBIndex + 1}
        />
        <WordConfirmation
          word={wordC}
          setWord={setWordC}
          wordIndex={wordCIndex + 1}
        />
      </div>
      <div className="flex flex-col gap-4">
        {wordsAreInvalid && (
          <Alert variant="destructive">Some of the words are incorrect.</Alert>
        )}
        <Button
          className="w-full"
          disabled={!wordA || !wordB || !wordC}
          onClick={confirmWords}
        >
          Confirm
        </Button>
      </div>
    </div>
  );
}

export function BackupSuccess() {
  const [, navigate] = useLocation();

  return (
    <div className="h-full flex flex-col justify-between">
      <p>
        <span className="text-2xl">Great!</span>
        <br />
        <br />
        You have backed up your secret phrase.
      </p>
      <Button onClick={() => navigate("/")}>Finish</Button>
    </div>
  );
}

/**
 * Used at sign up to ask the user whether they want to
 * backup the mnemonic now.
 */
export function BackupPrompt() {
  const [, navigate] = useLocation();

  return (
    <div className="h-full flex flex-col justify-between">
      <p>
        <span className="text-2xl">Wallet created!</span>
        <br />
        <br />
        Your wallet is controlled by a secret phrase.
        <br />
        <br />
        You will need it to restore the wallet if you lose your phone or delete
        this app.
        <br />
        <br />
        Back up the secret phrase and store it in a secure place.
      </p>
      <div className="flex flex-col gap-4">
        <Button onClick={() => navigate("start")}>Back up now</Button>
        <Button variant="secondary" onClick={() => navigate("/home")}>
          Back up later
        </Button>
      </div>
    </div>
  );
}
