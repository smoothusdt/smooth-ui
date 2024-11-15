import { FC, PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Settings } from "lucide-react";
import { useRoute, useLocation } from "wouter";


interface PageHeaderProps {
  /** Should the header display a back button and where it shall lead? */
  backPath?: string;
}

/**
 * Use the as the first descendent of`<Page/>` to give your page the global header.
 */
export const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = (props) => {
  const { children } = props;
  const backPath = props.backPath;
  const hasBack = backPath !== undefined;

  const [home] = useRoute("/home");
  const [, navigate] = useLocation();

  return (
    <div className="flex justify-between items-center py-8">
      <div>
        <div className="flex items-center align-middle">
          {hasBack && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => window.history.back()}
              className="pl-0 pr-1"
              data-ph-capture-attribute-button-action="navigate-back"
            >
              <ChevronLeft size={28} />
            </Button>
          )}
          <h1 className="text-3xl font-semibold leading-4">{children}</h1>
        </div>
        <div />
      </div>
      {home && (
        <Button
          variant="outline"
          onClick={() => navigate("/settings")}
        >
          <Settings className="px-1" />
        </Button>
      )}
    </div>
  );
};
