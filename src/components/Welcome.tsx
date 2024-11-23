import { motion } from 'framer-motion'
import { useContext, useEffect } from 'react'
import { Wallet, Send, ShieldCheck } from 'lucide-react'
import { usePrivy } from '@privy-io/react-auth'
import { WalletContext } from '@/hooks/useWallet'
import { BigNumber } from 'tronweb'
import { Hex } from 'viem'
import { tronweb } from '@/constants'
import { calculateWalletAddress } from '@/util'
import { SmoothLogo } from '@/svgs'

const Feature = ({ icon, text }: { icon: JSX.Element; text: string }) => (
    <motion.div
        className="flex items-center space-x-2"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
    >
        {icon}
        <span>{text}</span>
    </motion.div>
)

export function Welcome() {
    const { dispatch } = useContext(WalletContext);
    const { ready, authenticated, user, login: privyLogin, createWallet } = usePrivy();

    useEffect(() => {
        if (!ready) return;
        if (authenticated) {
            if (!user?.wallet) {
                createWallet()
            } else {
                const signerAddress = user.wallet.address as Hex
                const tronUserAddress = tronweb.address.fromHex(calculateWalletAddress(signerAddress))
                console.log("Logging in with", { signerAddress, tronUserAddress })
                dispatch({ // user will be navigated to "/home" in App.tsx
                    type: "SetupWallet",
                    wallet: {
                        balance: new BigNumber(0),
                        history: [],
                        tronAddress: tronUserAddress
                    }
                })
            }
        }
    }, [ready, authenticated, user?.wallet])

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-900 text-white p-4 overflow-hidden">
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
                    A simple crypto wallet to send and receive USDT TRC-20
                </motion.p>
                <motion.div
                    className="mb-8 space-y-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <Feature icon={<Send className="text-[#339192]" />} text="Pay network fees in USDT instead of TRX." />
                    <Feature icon={<Wallet className="text-[#339192]" />} text="Non-custodial, but no secret phrases." />
                    <Feature icon={<ShieldCheck className="text-[#339192]" />} text="Modern smart contract based security." />
                </motion.div>
                <div className="space-y-4">
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={privyLogin}
                        className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors"
                    >
                        Create Wallet
                    </motion.button>
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={privyLogin}
                        className="flex items-center justify-center w-full border-2 border-[#339192] text-[#339192] py-3 rounded-lg  hover:text-white transition-all duration-300 bg-transparent"
                    >
                        Log In
                    </motion.button>
                </div>
            </motion.div>
        </div>
    )
}

