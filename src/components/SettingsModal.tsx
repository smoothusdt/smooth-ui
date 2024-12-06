import { useContext } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WalletContext } from '@/hooks/useWallet'
import { useTranslation } from "react-i18next";
import { Language, usePreferences } from '@/hooks/usePreferences'
import { useSigner } from '@/hooks/useSigner'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { t } = useTranslation("", { keyPrefix: "settingsWindow" })
    const { language, changeLanguage } = usePreferences();
    const { eraseSigner } = useSigner();
    const { dispatch } = useContext(WalletContext);

    const onLogout = () => {
        eraseSigner()
        dispatch({
            type: "LogOut"
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-sm rounded-lg w-80 md:w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#339192]">{t("settings")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="language" className="text-lg font-semibold mb-2 block">{t("language")}</label>
                        <Select onValueChange={(value: string) => changeLanguage(value as Language)} defaultValue={language}>
                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                <SelectItem value="en" className="hover:bg-gray-500">English</SelectItem>
                                <SelectItem value="ru" className="hover:bg-gray-500">Русский</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="flex items-center justify-center w-full bg-red-400 text-white py-3 rounded-lg hover:bg-[#c44d4d] transition-colors"
                    >
                        {t("logOut")}
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

