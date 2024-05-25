import { FC, PropsWithChildren, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CopyWallet } from "@/components/CopyWallet";
import {
  Consequence,
  Consequences,
  useConsequences,
} from "@/components/Consequences";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Page, PageContent, PageHeader } from "@/components/Page";

import { Check, CircleCheck, Copy, WalletIcon } from "lucide-react";

import { useWallet } from "@/hooks/useWallet";
import { useLocation } from "wouter";

import { shuffle } from "@/util";
import { usePostHog } from "posthog-js/react";
import { useCopyToClipboard } from "react-use";

/** Entry point to the backup flow. Requires the user to accept consequences before proceeding */
export function StartBackup() {
  const posthog = usePostHog();
  const [, navigate] = useLocation();

  const consequences = [
    <span>You are about to see your secret phrase.</span>,
    <span>
      Whoever knows the secret phrase has full control over the wallet and all
      it's funds.
    </span>,
    <span>
      Don't lose your secret phrase and don't let anybody else see it.
    </span>,
  ];
  const { accepted, toggle, legitimate } = useConsequences(consequences);

  // Cannot reveal until all consequences are accepted
  const revealDisabled = !legitimate;

  const revealClicked = () => {
    posthog.capture("Accepted backup wallet consequences");
    navigate("backup");
  };

  return (
    <Page>
      <PageHeader hasBack>Backup</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">
              Backing up your secret phrase
            </span>
            <p className="text-muted-foreground text-sm">
              Tap on all the checkboxes to confirm you understand the
              consequences.
            </p>
            <Consequences>
              {consequences.map((consequence, i) => (
                <Consequence accepted={accepted[i]} onClick={() => toggle(i)}>
                  {consequence}
                </Consequence>
              ))}
            </Consequences>
          </div>
          <Button disabled={revealDisabled} onClick={revealClicked}>
            Reveal
          </Button>
        </div>
      </PageContent>
    </Page>
  );
}

/** Shows the non-copyable secret phrase */
export function Backup() {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();

  const [copied, setCopied] = useState(false);
  const [state, copyToClipboard] = useCopyToClipboard();

  if (!wallet) return;

  // Needs more investigation and testing https://web.dev/patterns/clipboard/copy-text
  const handleCopyClicked = () => {
    copyToClipboard(wallet.mnemonic.phrase);

    if (!state.error) {
      // UI confirms the copy, then resets. This is a common pattern.
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 1000);
    }
    // TODO: Set some kind of error if the copy fails
  };

  return (
    <Page>
      <PageHeader hasBack>Backup</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">Your Secret Phrase</span>
            <p className="text-muted-foreground text-sm">
              Write it down or paste it somewhere secure like a password
              manager. Remember to clear your clipboard after.
            </p>
            <WordList list={wallet.mnemonic.phrase.split(" ")} />
            <Button
              variant="link"
              className="text-foreground w-fit self-center no-underline active:no-underline focus:no-underline"
              onClick={handleCopyClicked}
            >
              {copied ? (
                <>
                  <Check size={16} className="mr-2" /> Copied!
                </>
              ) : (
                <>
                  <Copy size={16} className="mr-2" /> Copy seed phrase
                </>
              )}
            </Button>
          </div>
          <Button className="w-full" onClick={() => navigate("confirm")}>
            Got it
          </Button>
        </div>
      </PageContent>
    </Page>
  );
}

/** Component validating three random words from a secret phrase */
export function ConfirmBackup() {
  const [, navigate] = useLocation();
  const { wallet } = useWallet();

  const [wordA, setWordA] = useState("");
  const [wordB, setWordB] = useState("");
  const [wordC, setWordC] = useState("");

  const [wordsAreInvalid, setWordsAreInvalid] = useState(false);
  const wordIndices = useRef<number[]>([]);

  if (!wallet) return;
  const mnemonicWords = wallet.mnemonic.phrase.split(" ");

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
    const wordAValid = wordA.trim().toLowerCase() === mnemonicWords[wordAIndex];
    const wordBValid = wordB.trim().toLowerCase() === mnemonicWords[wordBIndex];
    const wordCValid = wordC.trim().toLowerCase() === mnemonicWords[wordCIndex];

    const allWordsValid = wordAValid && wordBValid && wordCValid;
    if (!allWordsValid) {
      setWordsAreInvalid(true);
      return;
    }

    navigate("success");
  };

  // TODO: Use form validation to validate as we go
  return (
    <Page>
      <PageHeader hasBack>Backup</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-semibold">Confirm the backup</span>
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
              <Alert variant="destructive">
                Some of the words are incorrect.
              </Alert>
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
      </PageContent>
    </Page>
  );
}

/** Component showing a successful backup */
export function BackupSuccess() {
  const [, navigate] = useLocation();

  // TODO: hasBackedup -> localStorage
  return (
    <Page>
      <PageHeader hasBack>Backup</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div /> {/* To center div below */}
          <div className="flex flex-col gap-4 text-center items-center">
            <CircleCheck size={64} />
            <span className="text-lg font-semibold">Nice Work</span>
            <p className="text-muted-foreground text-sm">
              You've backed up your secret phrase.
            </p>
          </div>
          <Button onClick={() => navigate("/home")}>
            Start making transfers
          </Button>
        </div>
      </PageContent>
    </Page>
  );
}

/**
 * Used at sign up to ask the user whether they want to
 * backup the mnemonic now or later.
 */
export function BackupPrompt() {
  const [, navigate] = useLocation();

  return (
    <Page>
      <PageHeader hasBack>Backup</PageHeader>
      <PageContent>
        <div className="h-full flex flex-col justify-between">
          <div className="flex flex-col gap-8">
            <span className="text-lg font-semibold">
              We created a wallet for you
            </span>
            <Alert className="text-small text-left text-muted-foreground">
              <WalletIcon className="h-4 w-4" />
              <AlertDescription className="flex flex-col gap-2">
                <span>
                  Your brand new wallet.
                  <br />
                  Ready to send and receive USDT.
                </span>

                <CopyWallet />
              </AlertDescription>
            </Alert>
            <div className="flex flex-col gap-2">
              <span className="text-lg text-foreground font-semibold">
                About your new wallet
              </span>
              <AboutLine>
                Your wallet is controlled by a secret phrase
              </AboutLine>
              <AboutLine>
                You will need the secret phrase if you delete this app or lose
                your phone
              </AboutLine>
              <AboutLine>
                Back up the secret phrase and store it in a secure place
              </AboutLine>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button onClick={() => navigate("start")}>Back up now</Button>
            <Button variant="secondary" onClick={() => navigate("/home")}>
              Back up later
            </Button>
          </div>
        </div>
      </PageContent>
    </Page>
  );
}

/** Local component displaying a text input for a word to be confirm in `<ConfirmBackup />` */
function WordConfirmation(props: {
  word: string;
  setWord: (arg0: string) => void;
  wordIndex: number;
}) {
  const { word, setWord, wordIndex } = props;

  return (
    <div className="flex pt-2 pb-2 justify-between">
      <Label
        htmlFor={`text-input-amount-${wordIndex}`}
        className="flex flex-col justify-center w-32"
      >
        Word #{wordIndex}
      </Label>
      <Input
        className="w-32"
        id={`text-input-amount-${wordIndex}`}
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
    </div>
  );
}

/**
 * Local component to display info about the new wallet as a nice bulleted list
 */
const AboutLine: FC<PropsWithChildren> = (props) => {
  // TODO: How to align icon with text more robustly
  return (
    <div className="flex gap-2 items-start text-muted-foreground">
      <div className="size-4">
        <CircleCheck size={14} className="mt-[.2rem]" />
      </div>
      <span className="text-sm">{props.children}</span>
    </div>
  );
};

/**
 * Local component to display the mnemonic
 */
const WordList = (props: { list: string[] }) => {
  return (
    <div className="select-none">
      <div className="grid grid-cols-2 grid-rows-6 gap-3">
        {props.list.map((word, index) => (
          <div
            key={index}
            className="relative border border-solid border-muted-foreground rounded-full p-2 text-center text-sm flex items-center justify-center"
          >
            <div className="absolute left-2 text-xs text-muted-foreground bg-muted rounded-full size-5 leading-5">
              {index + 1}
            </div>
            {word}
          </div>
        ))}
      </div>
    </div>
  );
};
