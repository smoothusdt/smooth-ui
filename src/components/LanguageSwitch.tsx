import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { Check, Earth } from "lucide-react";

import clsx from "clsx";
import { useTranslation } from "react-i18next";

type SupportedLanguage = "en" | "ru";
const supportedLanguages: Record<SupportedLanguage, { nativeName: string }> = {
  en: { nativeName: "English" },
  ru: { nativeName: "русский язык" },
};

/** Switch to select the language of the app */
export const LanguageSwitch = () => {
  const {
    i18n: { changeLanguage, language: activeLanguage },
  } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-auto p-2 flex justify-around font-normal"
        >
          {supportedLanguages[activeLanguage as SupportedLanguage].nativeName}
          <Earth className="ml-2 size-5" />
          <span className="sr-only">Select language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.keys(supportedLanguages).map((language) => {
          const active = language === activeLanguage;
          return (
            <DropdownMenuItem
              key={language}
              onClick={() => changeLanguage(language)}
              className={clsx(
                active && "font-semibold bg-secondary",
                "capitalize",
              )}
            >
              <span>
                {supportedLanguages[language as SupportedLanguage].nativeName}
              </span>
              {active && <Check size={16} className="ml-2" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
