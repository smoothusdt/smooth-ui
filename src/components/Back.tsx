import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";

/**
 * Use this component to navigate back to root
 */
export const Back = () => {
  const [, navigate] = useLocation();
  return (
    <Button
      variant="ghost"
      className="w-fit self-start"
      onClick={() => navigate("/")}
    >
      <ChevronLeft /> Back
    </Button>
  );
};
