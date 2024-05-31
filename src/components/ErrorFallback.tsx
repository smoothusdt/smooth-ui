import { FallbackProps } from "react-error-boundary";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

export const ErrorFallback = (props: FallbackProps) => {
  const posthog = usePostHog();
  const { error, resetErrorBoundary } = props;

  useEffect(() => {
    posthog.capture("error", {
      error: JSON.stringify(error, Object.getOwnPropertyNames(error)),
    });
  }, [error, posthog]);

  return (
    <div
      role="alert"
      className="ErrorFallback container flex flex-col justify-between size-full bg-background py-8"
    >
      <div /> {/* To center div below */}
      <div className="container flex flex-col justify-center items-center text-center bg-background text-m gap-4">
        <CircleAlert size={64} className="text-muted-foreground" />

        <h1 className="text-lg font-semibold">Whoops</h1>
        <p className="text-muted-foreground text-sm">
          Something unexpected happened. The SmoothUSDT team is looking into it.
        </p>
        <pre className="break-words whitespace-pre-wrap max-w-[50ch]">
          {error.message}
        </pre>
      </div>
      <Button onClick={resetErrorBoundary}>Refresh</Button>
    </div>
  );
};
