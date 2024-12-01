import { motion, useAnimation } from "framer-motion";
import { useState } from "react";
import { shakeAnimation } from "../animations";
import { TextBlock } from "./TextBlock";
import { EnterPin } from "./EnterPin";
import { CoolButton } from "./CoolButton";

export function VerifyPin(props: { correctPin: string; onVerified: () => void }) {
    const [pinVerificationError, setPinVerificationError] = useState(false)
    const pinAnimationControls = useAnimation()

    const onPinVerify = (enteredPin: string) => {
        if (enteredPin !== props.correctPin) {
            setPinVerificationError(true)
            pinAnimationControls.start(shakeAnimation)
            return;
        }

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
            <TextBlock title="Verify your pin code">
                You will be asked for your pin code every time you log in to Smooth USDT.
            </TextBlock>
            <EnterPin
                pinLength={6}
                onPinEntered={onPinVerify}
                animationControls={pinAnimationControls}
            />
            {pinVerificationError && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" />Incorrect pin</p>}
            <CoolButton
                disabled
                onClick={() => { }} // navigates automatically after pin is entered
            >
                Continue
            </CoolButton>
        </motion.div>
    );
}
