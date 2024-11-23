import { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { usePrivy } from '@privy-io/react-auth'
import { WalletContext } from '@/hooks/useWallet'
import { Loader } from 'lucide-react'

interface SettingsModalProps {
    isOpen: boolean
    onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [language, setLanguage] = useState('english')
    const [loggingOut, setLoggingOut] = useState(false)
    const { logout: privyLogout } = usePrivy()
    const { dispatch } = useContext(WalletContext);

    const handleLanguageChange = (value: string) => {
        setLanguage(value)
        // Here you would typically update the app's language setting
        console.log(`Language changed to ${value}`)
    }

    const onLogout = async () => {
        setLoggingOut(true)
        await privyLogout()
        dispatch({
            type: "LogOut"
        })
    }

    let logOutButtonContent;
    if (loggingOut) {
        logOutButtonContent = (
            <><Loader className="animate-spin mr-2" /> Logging out...</>
        );
    } else {
        logOutButtonContent = (
            <>Log Out</>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-sm rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#339192]">Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="language" className="text-lg font-semibold mb-2 block">Language</label>
                        <Select onValueChange={handleLanguageChange} defaultValue={language}>
                            <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-700 border-gray-600 text-white">
                                <SelectItem value="english" className="hover:bg-gray-500">English</SelectItem>
                                <SelectItem value="russian" className="hover:bg-gray-500">Русский</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        disabled={loggingOut}
                        className="flex items-center justify-center w-full bg-red-400 text-white py-3 rounded-lg hover:bg-[#c44d4d] transition-colors disabled:text-gray-300"
                    >
                        {logOutButtonContent}
                    </motion.button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

