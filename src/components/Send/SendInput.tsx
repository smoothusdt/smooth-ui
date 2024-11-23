import { motion, useAnimation } from 'framer-motion'
import { PageContainer } from "../PageContainer";
import { useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { BigNumber } from 'tronweb';
import { SmoothFee, tronweb } from '@/constants';
import { useWallet } from '@/hooks/useWallet';

const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
}

const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
}

export function SendInput() {
    const { wallet } = useWallet();
    const search = new URLSearchParams(window.location.search)
    const [recipient, setRecipient] = useState(search.get("recipient") || "")
    const [rawAmount, setRawAmount] = useState(search.get("amount") || "")
    const [errorMessage, setErrorMessage] = useState("")
    const [, navigate] = useLocation()
    const recipientControls = useAnimation()
    const amountControls = useAnimation()
    
    const availableAmount = BigNumber.max(wallet.balance.minus(SmoothFee), 0)

    const onContinue = () => {
        // Validate inputs
        if (!tronweb.isAddress(recipient)) {
            recipientControls.start(shakeAnimation)
            const msg = recipient.length > 0 ? `${recipient} is not a valid address` : "Enter recipient address"
            setErrorMessage(msg)
            return;
        }
        const amount = new BigNumber(rawAmount.replaceAll(",", ".")) // for Russian keyboard
        
        let amountError: string = ""
        if (amount.isNaN()) {
            amountError = "Enter amount"
        } else if (amount.lt(0)) {
            amountError = "Amount cannot be negative"
        } else if (amount.gt(availableAmount)) {
            amountError = `Maximum ${availableAmount.toFixed(2)} USDT can be sent.`
        }

        if (amountError) {
            amountControls.start(shakeAnimation)
            setErrorMessage(amountError)
            return;
        }

        // Cache values in case the user wants to come back and edit
        navigate(`/send?recipient=${recipient}&amount=${amount.toString()}`, { replace: true })
        // Navigate to the confirmation screeens
        navigate(`/send/confirm?recipient=${recipient}&amount=${amount.toString()}`)
    }

    return (
        <PageContainer title="Send USDT">
            <motion.div
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full bg-gray-800 rounded-lg p-6"
            >
                <h3 className="text-lg font-semibold mb-4">Enter Information</h3>
                <div className="space-y-4">
                    <motion.div variants={itemVariants} animate={recipientControls}>
                        <p className="text-sm text-gray-400 mb-1">Recipient Address:</p>
                        <input
                            type="text"
                            id="recipient"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
                        />
                    </motion.div>
                    <motion.div variants={itemVariants} animate={amountControls}>
                        <p className="text-sm text-gray-400 mb-1">Amount:</p>
                        <input
                            type="text"
                            id="recipient"
                            value={rawAmount}
                            onChange={(e) => setRawAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
                        />
                        <p className="text-sm text-gray-400 my-1">Available: {availableAmount.toFixed(2)} USDT</p>
                    </motion.div>
                    {errorMessage && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1"/> {errorMessage}</p>}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4"
                        onClick={onContinue}
                    >
                        Continue <ArrowRight size={20} className="ml-2" />
                    </motion.button>
                </div>
            </motion.div>
        </PageContainer>
    );
}