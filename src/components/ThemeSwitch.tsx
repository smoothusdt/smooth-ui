import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Theme, Themes, useTheme } from "@/context/ThemeProvider";
import { Moon, Sun, SunMoon } from "lucide-react";
import clsx from "clsx";

/**
 * Button to select the theme. Light, dark, or system.
 * TODO: Listen for change preference event and react
 * Note: Don't forget to add `@apply transition-[background-color] duration-200;` or something like
 * it to your root elements which have bg. Probably `body`,=.
 */
export const ThemeSwitch = () => {
  const { theme: activeTheme, setTheme, systemTheme } = useTheme();

  const hideDark = activeTheme === "system" && systemTheme === "dark";
  const hideLight = activeTheme === "system" && systemTheme === "light";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className={clsx(
              "h-[1.2rem] w-[1.2rem] rotate-0 transition-all dark:-rotate-90 dark:scale-0 duration-220",
              !hideLight && "scale-100",
            )}
          />
          <Moon
            className={clsx(
              "absolute h-[1.2rem] w-[1.2rem] -rotate-90 scale-0 transition-all dark:rotate-0 duration-100",
              !hideDark && "dark:scale-100",
            )}
          />
          <SunMoon
            className={clsx(
              "absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-100",
              activeTheme === "system" &&
                hideDark &&
                "dark:rotate-0 dark:scale-100",
              activeTheme === "system" && hideLight && "rotate-0 scale-100",
            )}
          />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Themes.map((theme) => {
          const active = theme === activeTheme;
          return (
            <DropdownMenuItem
              onClick={() => setTheme(theme)}
              className={clsx(
                active && "font-semibold bg-secondary",
                "capitalize",
              )}
            >
              <span>{theme}</span>
              {active && <Symbol theme={theme} size={16} className="ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/** Convenience component for map */
const Symbol = (props: {
  theme: Theme;
  size?: string | number | undefined;
  className?: string;
}): JSX.Element => {
  const { theme, ...rest } = props;
  if (theme === "light") {
    return <Sun {...rest} />;
  }
  if (theme === "dark") {
    return <Moon {...rest} />;
  }
  // (theme === "system")
  return <SunMoon {...rest} />;
};
