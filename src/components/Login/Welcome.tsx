import { motion } from 'framer-motion'
import { useState } from 'react'
import { Wallet, Send, ShieldCheck } from 'lucide-react'
import { SmoothLogo } from '@/svgs'
import { useTranslation } from 'react-i18next'
import { CreateWallet } from './CreateWalletModal'
import { ImportWallet } from './ImportWalletModal'

const Feature = ({ icon, text }: { icon: JSX.Element; text: string }) => (
    <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
    >
        {icon}
        <span className="text-left">{text}</span>
    </motion.div>
)

export function Welcome() {
    const { t } = useTranslation()
    const [isCreatingWallet, setIsCreatingWallet] = useState(false)
    const [isImportingWallet, setIsImportingWallet] = useState(false)

    return (
        <div
            className="relative flex min-h-screen items-center justify-center text-white p-4 overflow-hidden"
            style={{
                backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0), rgba(42,116,117,0.1))`
            }}
        >
            <CreateWallet isOpen={isCreatingWallet} onClose={() => setIsCreatingWallet(false)} />
            <ImportWallet isOpen={isImportingWallet} onClose={() => setIsImportingWallet(false)} />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center z-10"
            >
                <motion.div
                    initial={{ scale: 0.5, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
                    className="mb-6 flex justify-center"
                >
                    <SmoothLogo />
                </motion.div>
                <motion.h1
                    className="text-4xl font-bold mb-4"
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                >
                    Smooth USDT
                </motion.h1>
                <motion.p
                    className="text-lg mb-8 text-gray-300"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    {t("smoothDescription")}
                </motion.p>
                <motion.div
                    className="mb-8 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Feature icon={<Send className="text-[#339192]" />} text={t("usdtFeesFeature")} />
                    <Feature icon={<Wallet className="text-[#339192]" />} text={t("nonCustodialFeature")} />
                    <Feature icon={<ShieldCheck className="text-[#339192]" />} text={t("securityFeature")} />
                </motion.div>
                <div className="space-y-4">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreatingWallet(true)}
                        className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors"
                    >
                        {t("createWallet")}
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsImportingWallet(true)}
                        className="flex items-center justify-center w-full border-2 border-[#339192] text-[#339192] py-3 rounded-lg  hover:text-white transition-all duration-300 bg-transparent"
                    >
                        {t("importWallet")}
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

