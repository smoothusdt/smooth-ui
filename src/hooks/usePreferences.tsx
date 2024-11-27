import { PreferencesStorageKey } from "@/constants";
import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export type Language = "en" | "ru"

interface IPreferences {
    deviceId: string
    language: Language
}

function loadPreferences(): IPreferences | undefined {
    const raw = window.localStorage.getItem(PreferencesStorageKey)
    if (!raw) return;

    const decoded = JSON.parse(raw)

    return {
        language: decoded.language,
        deviceId: decoded.deviceId
    }
}

function savePreferencesInStorage(preferences: IPreferences) {
    window.localStorage.setItem(PreferencesStorageKey, JSON.stringify(preferences))
}

interface IPreferencesContext {
    language: Language;
    changeLanguage: (newLanguage: Language) => void
}

const PreferencesContext = createContext<IPreferencesContext>(undefined as any)

function generateDeviceId(): string {
    const randomChars = window.crypto.getRandomValues()
}

export function PreferencesProvider(props: { children: any }) {
    const { i18n } = useTranslation();
    const [preferences, _setPreferencesState] = useState<IPreferences>(() => {
        const savedPreferences = loadPreferences()
        if (savedPreferences) return savedPreferences;


        // const deviceId = `device-${}`
        let language: Language = "en"
        if (navigator.language.toLowerCase().startsWith("ru")) {
            language = "ru"
        }

        return { language };
    })

    useEffect(() => {
        i18n.changeLanguage(preferences.language)
    }, [])

    const setPreferences = (newPreferences: IPreferences) => {
        _setPreferencesState(newPreferences)
        savePreferencesInStorage(newPreferences)
    }

    const changeLanguage = (newLanguage: Language) => {
        i18n.changeLanguage(newLanguage)
        setPreferences({ language: newLanguage })
    }

    return (
        <PreferencesContext.Provider value={{
            language: preferences.language,
            changeLanguage
        }}>
            {props.children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    return useContext(PreferencesContext)
}