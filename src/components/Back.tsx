import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface BackProps {
  /** Provide this fn to override the default behavior of navigating to `"/"` */
  onClick?: () => void;
}
/**
 * Use this component to navigate back to root
 */
export const Back: React.FC<BackProps> = (props) => {
  const { onClick } = props;

  return (
    <Button
      variant="ghost"
      className="w-fit self-start"
      onClick={
        onClick ??
        function () {
          window.history.back();
        }
      }
    >
      <ChevronLeft /> Back
    </Button>
  );
};
