import { useEffect, useState } from "react";

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
import {
  Consequence,
  Consequences,
  useConsequences,
} from "@/components/Consequences";

import { useWallet } from "@/hooks/useWallet";
import { useTranslation } from "react-i18next";
import { usePostHog } from "posthog-js/react";

/** Component to host a "delete wallet" button which contains a confirmation experience inside a drawer */
export const DeleteWalletButton = () => {
  const posthog = usePostHog();
  const { deleteWallet } = useWallet();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t } = useTranslation();

  const handleDeleteWalletClicked = () => {
    setDrawerOpen(false);
    posthog.capture("Accepted delete wallet consequences");

    // Quick and dirty way to delete the wallet after closing the drawer
    // TODO: Should we useEffect to deleteWallet when drawer closes?
    // https://github.com/shadcn-ui/ui/issues/2503
    setTimeout(() => {
      deleteWallet();
    }, 350);
  };

  const consequences = [
    <span>
      The <b>only</b> way to restore your wallet is to enter your
      <b> secret phrase</b>. Make sure it is backed up.
    </span>,
    <span>
      <b>Nobody</b> can help you if you lose your secret phrase.
    </span>,
  ];

  const { accepted, toggle, legitimate, reset } = useConsequences(consequences);

  // Cannot delete until all consequences are accepted
  const deleteDisabled = !legitimate;

  // Reset acceptance when drawer is closed
  useEffect(() => {
    !drawerOpen && reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen /* omit reset */]);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>
        <Button variant="destructive">{t("deleteWallet")}</Button>
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
            <Consequences>
              {consequences.map((consequence, i) => (
                <Consequence
                  key={i}
                  accepted={accepted[i]}
                  onClick={() => toggle(i)}
                >
                  {consequence}
                </Consequence>
              ))}
            </Consequences>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="flex flex-col gap-2">
          <Button
            disabled={deleteDisabled}
            variant="destructive"
            onClick={handleDeleteWalletClicked}
          >
            Delete
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
