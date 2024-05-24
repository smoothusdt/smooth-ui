/* eslint-disable react-refresh/only-export-components */
import { LastLocationStorageKey } from "@/constants";
import { useEffect } from "react";
import { useLocation } from "wouter";

// Format: "/page": ["array", "of", "allowed", "destinations", "from", "this", "page"].
// If a page is not present here - users can go anywhere.
const AllowList: { [key: string]: string[] } = {
  "/home": ["/", "/send", "/receive", "/settings"],
};

/**
 * A hook to be called from every app screen to handle some common things.
 *
 * Very hacky and dangerous.
 * Tries to override the behavior of native device navigation when going back.
 */
export function useScreen() {
  const [newLocation, navigate] = useLocation();

  const lastLocation = sessionStorage.getItem(LastLocationStorageKey);

  // intercept some routing. I know it's hacky, but best we can do for now :/
  useEffect(() => {
    const allowList = AllowList[lastLocation || ""];
    if (
      lastLocation &&
      newLocation !== lastLocation &&
      allowList &&
      !allowList.includes(newLocation)
    ) {
      console.log("New location is not on the allow list. Redirecting back.", {
        lastLocation,
        newLocation,
        allowList,
      });
      navigate(lastLocation, { replace: true });
    } else {
      console.log("New screen loaded successfully", {
        lastLocation,
        newLocation,
        allowList,
      });
      // Update the location
      sessionStorage.setItem(LastLocationStorageKey, newLocation);
    }
  }, [newLocation, lastLocation, navigate]);
}
