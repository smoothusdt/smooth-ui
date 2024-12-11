import { AnimationControls, motion } from "framer-motion";
import { Checkbox } from "../ui/checkbox"
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function TermsConsent(props: {
    agreed: boolean;
    error: boolean;
    setAgreed: (value: boolean) => void;
    controls: AnimationControls
}) {
    const { t } = useTranslation("", { keyPrefix: "termsConsentWindow" })
    return (
        <div className="space-y-4">
            <motion.div
                className="flex items-center space-x-2"
                animate={props.controls}
            >
                <Checkbox
                    id="terms"
                    checked={props.agreed}
                    onCheckedChange={() => props.setAgreed(!props.agreed)}
                    className="w-4 h-4 border-gray-600 data-[state=checked]:bg-[#339192] data-[state=checked]:border-[#339192] transition-all duration-300"
                />
                <p className="text-gray-300">
                    {t("iAgreeTo")}
                    {" "}
                    <a href="/terms-of-use" target="_blank" className="text-[#339192] hover:underline">
                        {t("termsOfUse")}
                        {"."}
                    </a>
                </p>
            </motion.div>
            {props.error &&
                <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words">
                    <AlertCircle className="inline mr-1" />
                    {t("agreeTo")}
                </p>
            }
        </div>
    )
}