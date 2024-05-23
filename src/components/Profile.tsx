import { useWallet } from "@/hooks/useWallet";
import { useEffect } from "react";

import { useLocation } from "wouter";
import { Back } from "./Back";
import { Button } from "./ui/button";
import { ThemeSwitch } from "./ThemeSwitch";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteWalletButton() {
  const { deleteWallet } = useWallet();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Wallet</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            YOU are the ONLY person in control of your wallet. The Smooth USDT
            team has no access.
            <br />
            <br />
            The ONLY way to restore your wallet is to enter your SECRET PHRASE.
            Make sure you back it up!
            <br />
            <br />
            NOBODY can help you if you LOSE your secret phrase.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={deleteWallet}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Profile = () => {
  const [, navigate] = useLocation();
  const { connected } = useWallet();

  // The user wallet is not set up or the user has deleted their wallet.
  // Cant do anything on this screen.
  useEffect(() => {
    if (!connected) navigate("/");
  }, [connected, navigate]);

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <Back />
      <ThemeSwitch />
      <Button onClick={() => navigate("/backup/start")}>
        Backup Secret Phrase
      </Button>
      <DeleteWalletButton />
    </div>
  );
};
