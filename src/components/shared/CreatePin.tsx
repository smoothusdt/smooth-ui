import { motion } from "framer-motion";
import { TextBlock } from "./TextBlock";
import { EnterPin } from "./EnterPin";
import { CoolButton } from "./CoolButton";
import { useTranslation } from "react-i18next";


export function CreatePin(props: { onPinEntered: (pin: string) => void }) {
    const { t } = useTranslation("", { keyPrefix: "createPinWindow" })
    return (
        <motion.div
            className="space-y-4"
            onClick={() => {
                // Ugly, but we need to keep the input always focused for pin entering.
                document.getElementById("pinVirtualInput")?.focus()
            }}
        >
            <TextBlock title={t("createPin")}>
                {t("createPinLine1")}<br />
                {t("createPinLine2")}
            </TextBlock>
            <EnterPin pinLength={6} onPinEntered={props.onPinEntered} />
            <CoolButton
                disabled
                onClick={() => { }} // navigates automatically after pin is entered
            >
                {t("continue")}
            </CoolButton>
        </motion.div>
    );
}
