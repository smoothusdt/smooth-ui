import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { FlyInBlock } from "./FlyInBlock";
import { TextBlock } from "./TextBlock";
import { CheckCircle } from "lucide-react";
import { CoolButton } from "./CoolButton";
import { useTranslation } from "react-i18next";

export function AllSet() {
    const { t } = useTranslation("", { keyPrefix: "allSetWindow" })
    const [, navigate] = useLocation()

    return (
        <motion.div className="space-y-8">
            <FlyInBlock delay={0.2}>
                <TextBlock title={t("allSet")}>
                    {t("walletReady")}
                </TextBlock>
            </FlyInBlock>
            <FlyInBlock delay={0.4}>
                <div className="flex justify-center items-center mb-4">
                    <CheckCircle size={64} className="text-[#339192]" />
                </div>
            </FlyInBlock >
            <FlyInBlock delay={0.6}>
                <CoolButton onClick={() => navigate("/home")}>
                    {t("startUsing")}
                </CoolButton>
            </FlyInBlock >
        </motion.div>
    );
}