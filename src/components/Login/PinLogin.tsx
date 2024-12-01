import { SmoothApiURL } from '@/constants';
import { getEncryptedPhrasehash, useSigner } from '@/hooks/useSigner';
import { WalletContext } from '@/hooks/useWallet';
import { SmoothLogo } from '@/svgs';
import { AnimationControls, motion, useAnimation } from 'framer-motion'
import { AlertCircle, DotIcon, Loader } from 'lucide-react';
import { useContext, useState } from 'react';
import { TronWeb } from 'tronweb';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TextBlock } from './CreateWalletModal';

export const shakeAnimation = {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 }
}

function DigitWindow(props: { filled: boolean; processing?: boolean }) {
    return (
        <motion.div className="relative w-10 h-12 flex justify-center items-center">
            <div className={`absolute w-full h-full border-current border-2 rounded-lg transition-all duration-300 ${props.processing ? "opacity-5" : "opacity-15"}`}></div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: props.filled ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <DotIcon className={`text-[#339192] ${props.processing && "opacity-30"}`} size={32} />
            </motion.div>
        </motion.div>
    );
}

export function EnterPin(props: {
    pinLength: number;
    onPinEntered: (pin: string) => void;
    animationControls?: AnimationControls;
    processing?: boolean
}) {
    const [pin, setPin] = useState("");

    const onPinChange = (newPin: string) => {
        if (!/^[0-9]*$/.test(newPin)) return;
        if (newPin.length > props.pinLength) return;
        if (newPin.length === props.pinLength) {
            setPin("") // reset state
            props.onPinEntered(newPin)
        } else {
            setPin(newPin)
        }
    }

    return (
        <div>
            <motion.form
                className="w-full h-12 flex justify-center gap-4"
                animate={props.animationControls}
            >
                <input /* Ugly, but needed to open the native keyboard on mobile devices. */
                    id="pinVirtualInput"
                    autoFocus
                    type="number"
                    value={pin}
                    onChange={((e) => onPinChange(e.target.value))}
                    className="absolute w-0"
                />
                {[...Array(props.pinLength).keys()].map(
                    (value) => <DigitWindow processing={props.processing} key={value} filled={pin.length >= value + 1} />
                )}
                {props.processing && <div className="fixed w-full h-12 flex justify-center items-center">
                    <Loader className=" animate-spin w-8 h-8 opacity-70" />
                </div>}
            </motion.form>
        </div>
    );
}

function ForgotPinButton() {
    const [showDialog, setShowDialog] = useState(false)
    const { eraseSigner } = useSigner();
    const { dispatch } = useContext(WalletContext);

    const onLogout = () => {
        eraseSigner()
        dispatch({
            type: "LogOut"
        })
        window.location.reload()
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <p className="text-2xl">Forgot pin code</p>
                        </DialogTitle>
                    </DialogHeader>
                    <TextBlock title="How to reset pin code">
                        1. Log out.<br />
                        2. Click "Import Wallet" and enter your secret phrase.
                    </TextBlock>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="flex items-center justify-center w-full bg-red-400 text-white py-3 rounded-lg hover:bg-[#c44d4d] transition-colors"
                    >
                        Log out
                    </motion.button>
                </DialogContent>
            </Dialog>
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDialog(true)}
            ><span className="border-b-2 text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500">Forgot your pin code?</span>
            </motion.button>
        </>
    );
}


export function PinLogin(props: { navigateAfterLogin: boolean }) {
    const pinAnimationControls = useAnimation()
    const [fetching, setFetching] = useState(false)
    const [remainingAttempts, setRemainingAttempts] = useState(-1)
    const { decrypt } = useSigner()
    const { logIn } = useContext(WalletContext)
    const [, navigate] = useLocation()

    const onPinVerify = async (pinCode: string) => {
        setFetching(true)
        const phraseHash = getEncryptedPhrasehash()!
        const response = await fetch(`${SmoothApiURL}/getEncryptionKey`, {
            method: "POST",
            body: JSON.stringify({
                phraseHash,
                pinCode,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        const data = await response.json()
        if (!data.success) {
            const remainingAttempts = data.remainingAttempts
            if (remainingAttempts !== undefined) {
                setFetching(false)
                setRemainingAttempts(remainingAttempts)
                pinAnimationControls.start(shakeAnimation)
                return;
            } else {
                let message = "Couldnt fetch encryption key"
                if (data.error) message = `${message} due to ${data.error}`
                throw new Error(message)
            }
        }
        const encryptionKeyHex = data.encryptionKeyHex
        console.log("Successfully fetched encryption key:", encryptionKeyHex)
        const secretPhrase = await decrypt(encryptionKeyHex)
        const { address: tronUserAddress } = TronWeb.fromMnemonic(secretPhrase)
        logIn(tronUserAddress)

        if (props.navigateAfterLogin) {
            navigate("/home")
        }
    }

    return (
        <div
            className="flex h-full w-full flex-col items-center pt-32 md:pt-48 px-16"
            onClick={() => {
                // Ugly, but we need to keep the input always focused for pin entering.
                document.getElementById("pinVirtualInput")?.focus()
            }}
        >
            <div className="space-y-4 w-fit">
                <div className="w-full text-center">
                    <div className="mb-6 flex justify-center">
                        <SmoothLogo />
                    </div>
                    <p className="text-4xl font-bold mb-4">
                        Smooth USDT
                    </p>
                    <p className="text-xl">Your pin code.</p>
                </div>
                <EnterPin
                    pinLength={6}
                    processing={fetching}
                    onPinEntered={onPinVerify}
                    animationControls={pinAnimationControls}
                />
                {remainingAttempts !== -1 && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words text-left"><AlertCircle className="inline mr-1" />Incorrect pin. You have {remainingAttempts} attempts left.</p>}
                <ForgotPinButton />
            </div>
        </div>
    );
}