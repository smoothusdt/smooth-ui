import { SmoothApiURL } from '@/constants';
import { getEncryptedPhrasehash, useSigner } from '@/hooks/useSigner';
import { WalletContext } from '@/hooks/useWallet';
import { SmoothLogo } from '@/svgs';
import { motion, useAnimation } from 'framer-motion'
import { AlertCircle } from 'lucide-react';
import { useContext, useState } from 'react';
import { TronWeb } from 'tronweb';
import { useLocation } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { TextBlock } from '../shared/TextBlock';
import { shakeAnimation } from '../animations';
import { EnterPin } from '../shared/EnterPin';
import { useTranslation } from 'react-i18next';

function ForgotPinButton() {
    const { t } = useTranslation("", { keyPrefix: "pinLoginWindow" })
    const [showDialog, setShowDialog] = useState(false)
    const { eraseSigner } = useSigner();
    const { dispatch } = useContext(WalletContext);
    const [, navigate] = useLocation()

    const onLogout = () => {
        eraseSigner()
        dispatch({
            type: "LogOut"
        })
        navigate("/")
    }

    return (
        <>
            <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <p className="text-2xl">{t("forgotPinCode")}</p>
                        </DialogTitle>
                    </DialogHeader>
                    <TextBlock title={t("howToReset")}>
                        {t("resetStep1")}<br />
                        {t("resetStep2")}
                    </TextBlock>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onLogout}
                        className="flex items-center justify-center w-full bg-red-400 text-white py-3 rounded-lg hover:bg-[#c44d4d] transition-colors"
                    >
                        {t("logOut")}
                    </motion.button>
                </DialogContent>
            </Dialog>
            <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDialog(true)}
            ><span className="border-b-2 text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500">{t("forgotPinCodeQuestion")}</span>
            </motion.button>
        </>
    );
}


export function PinLogin(props: { navigateAfterLogin: boolean }) {
    const { t } = useTranslation("", { keyPrefix: "pinLoginWindow" })
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
        console.log("Successfully fetched encryption key.")
        const secretPhrase = await decrypt(encryptionKeyHex)
        const { address: tronUserAddress } = TronWeb.fromMnemonic(secretPhrase)
        logIn(tronUserAddress)

        if (props.navigateAfterLogin) {
            navigate("/home")
        }
    }

    return (
        <div
            className="flex h-full w-full flex-col items-center pt-32 md:pt-48"
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
                    <p className="text-xl">{t("yourPinCode")}</p>
                </div>
                <EnterPin
                    pinLength={6}
                    processing={fetching}
                    disabled={remainingAttempts === 0}
                    onPinEntered={onPinVerify}
                    animationControls={pinAnimationControls}
                />
                {remainingAttempts !== -1 &&
                    <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words text-left w-80"><AlertCircle className="inline mr-1" />
                        {t("incorrectPin", { remainingAttempts })}
                    </p>
                }
                <ForgotPinButton />
            </div>
        </div>
    );
}