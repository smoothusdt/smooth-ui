import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { shakeAnimation } from "../animations";
import { TextBlock } from "./TextBlock";
import { EnterPin } from "./EnterPin";
import { CoolButton } from "./CoolButton";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function VerifyPin(props: { correctPin: string; onVerified: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "verifyPinWindow" })
    const [pinVerificationError, setPinVerificationError] = useState(false)
    const [processing, setProcessing] = useState(false)
    const pinAnimationControls = useAnimation()

    const onPinVerify = (enteredPin: string) => {
        if (enteredPin !== props.correctPin) {
            setPinVerificationError(true)
            pinAnimationControls.start(shakeAnimation)
            return;
        }

        setProcessing(true)
        props.onVerified()
    }

    return (
        <motion.div
            className="space-y-4"
            onClick={() => {
                // Ugly, but we need to keep the input always focused for pin entering.
                document.getElementById("pinVirtualInput")?.focus()
            }}
        >
            <TextBlock title={t("verifyPin")}>
                {t("verifyPinDescription")}
            </TextBlock>
            <EnterPin
                pinLength={6}
                processing={processing}
                onPinEntered={onPinVerify}
                animationControls={pinAnimationControls}
            />
            {pinVerificationError && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" />{t("incorrectPin")}</p>}
            <CoolButton
                disabled
                onClick={() => { }} // navigates automatically after pin is entered
            >
                {t("continue")}
            </CoolButton>
        </motion.div>
    );
}
