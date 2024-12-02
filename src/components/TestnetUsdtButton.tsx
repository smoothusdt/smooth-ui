import { useWallet } from '@/hooks/useWallet';
import { getFreeUsdt } from '@/smoothApi';
import { motion } from 'framer-motion'
import { Loader } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function TestnetUsdtButton() {
    const { t } = useTranslation()
    const { wallet, refreshBalance, refreshHistory } = useWallet();
    const [isProcessing, setIsProcessing] = useState(false)
    const [progress, setProgress] = useState(0)

    const getTestnetUsdt = async () => {
        setIsProcessing(true)
        let timerProgress = 0
        const countdownInterval = setInterval(() => {
            timerProgress += 1
            setProgress(timerProgress)
            if (timerProgress === 700) {
                clearInterval(countdownInterval)
            }
        }, 10)

        await getFreeUsdt(wallet.tronAddress)
        await new Promise(resolve => setTimeout(resolve, 5000)) // make sure tronscan indexes the transaction
        refreshBalance()
        refreshHistory()
    }

    let buttonContent;
    if (!isProcessing) {
        buttonContent = (
            <>{t("getTestnetUsdt")}</>
        );
    } else {
        buttonContent = (
            <><Loader className="animate-spin" />{t("processing")}</>
        );
    }

    return (
        <motion.button
            whileHover={isProcessing ? {} : { scale: 1.05 }}
            whileTap={isProcessing ? {} : { scale: 0.95 }}
            className="flex items-center justify-center w-full  bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4 disabled:bg-[#2a747500]  disabled:text-gray-300"
            style={{
                backgroundImage: `linear-gradient(to right, rgba(42,116,117,1) ${progress / 700 * 100}%, rgba(0,0,0,0) ${progress / 700 * 100}%)`
            }}
            onClick={getTestnetUsdt}
            disabled={isProcessing}
        >
            {buttonContent}
        </motion.button>
    );
}