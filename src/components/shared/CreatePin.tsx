import { motion } from "framer-motion";
import { TextBlock } from "./TextBlock";
import { EnterPin } from "./EnterPin";
import { CoolButton } from "./CoolButton";


export function CreatePin(props: { onPinEntered: (pin: string) => void }) {
    return (
        <motion.div
            className="space-y-4"
            onClick={() => {
                // Ugly, but we need to keep the input always focused for pin entering.
                document.getElementById("pinVirtualInput")?.focus()
            }}
        >
            <TextBlock title="Create a pin code">
                - Your wallet is almost ready. Create a secure pin code for extra protection.<br />
                - If you forget your pin code, you can reset it with a secret phrase.
            </TextBlock>
            <EnterPin pinLength={6} onPinEntered={props.onPinEntered} />
            <CoolButton
                disabled
                onClick={() => { }} // navigates automatically after pin is entered
            >
                Continue
            </CoolButton>
        </motion.div>
    );
}
