import { FC, PropsWithChildren, useState } from "react";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown";

import TermsOfUseContent from "@/TermsOfUse.md";

// TODO: Localize the terms of use
/** Component to host a child which, when clicked, renders the SmoothUSDT terms of use inside a drawer. */
export const TermsOfUse: FC<PropsWithChildren> = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
      <DrawerTrigger asChild>{props.children}</DrawerTrigger>
      <DrawerContent className="sm:max-w-[425px] h-[90%]">
        <ScrollArea className="px-4 mx-4 mt-8 pb-1">
          <Markdown className={"prose prose-sm dark:prose-invert"}>
            {TermsOfUseContent}
          </Markdown>
        </ScrollArea>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
