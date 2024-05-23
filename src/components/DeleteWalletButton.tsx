import { useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { CircleCheck } from "lucide-react";

import { useWallet } from "@/hooks/useWallet";

import { cn } from "@/lib/utils";

/** Component to host a "delete wallet" button which contains a confirmation experience inside a drawer */
export const DeleteWalletButton = () => {
  const { deleteWallet } = useWallet();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDeleteWalletClicked = () => {
    // Quick and dirty way to delete the wallet after closing the drawer
    // TODO: Should we useEffect to deleteWallet when drawer closes?
    // https://github.com/shadcn-ui/ui/issues/2503
    setDrawerOpen(false);
    setTimeout(() => {
      deleteWallet();
    }, 350);
  };

  // Maintain the state of acceptance for the consequences
  // and provide a convenience setter
  const [accepted, setAccepted] = useState([false, false, false]);
  const toggle = (idx: number) => {
    setAccepted((last) => {
      const copy = [...last];
      copy.splice(idx, 1, !last[idx]);
      return copy;
    });
  };

  // Cannot delete until all consequences are accepted
  const deleteDisabled = !accepted.every((e) => e);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">Delete Wallet</Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px]">
        <DrawerHeader>
          <DrawerTitle className="pb-4">
            <span>Are you sure?</span>
          </DrawerTitle>
          <DrawerDescription className="flex flex-col gap-4">
            <p className="text-muted-foreground text-sm">
              Tap on all the checkboxes to confirm you understand the
              consequences.
            </p>
            <Consequence accepted={accepted[0]} onClick={() => toggle(0)}>
              <span>
                <b>You</b> are the <b>only</b> person in control of your wallet.
                The Smooth USDT team has no access.
              </span>
            </Consequence>
            <Consequence accepted={accepted[1]} onClick={() => toggle(1)}>
              <span>
                The <b>only</b> way to restore your wallet is to enter your
                <b> secret phrase</b>. Make sure it is backed up.
              </span>
            </Consequence>
            <Consequence accepted={accepted[2]} onClick={() => toggle(2)}>
              <span>
                <b>Nobody</b> can help you if you lose your secret phrase.
              </span>
            </Consequence>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-2">
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
          <Button
            disabled={deleteDisabled}
            variant="destructive"
            onClick={handleDeleteWalletClicked}
          >
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

/** Local component for a clickable callout the user must accept to delete their wallet */
const Consequence: React.FC<
  React.PropsWithChildren<{ accepted?: boolean; onClick?: () => void }>
> = (props) => {
  const { accepted, children, onClick } = props;
  return (
    <Alert
      className={cn(
        accepted && "bg-muted",
        " text-small text-left text-muted-foreground",
      )}
      onClick={onClick}
    >
      <CircleCheck
        className="h-4 w-4"
        fill={accepted ? "hsl(var(--primary))" : undefined}
      />
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
};
