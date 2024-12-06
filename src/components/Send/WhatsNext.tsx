import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";

export function WhatsNext() {
    const { t } = useTranslation("", { keyPrefix: "receiptWindow" })
    return (
        <Dialog>
            <DialogTrigger className="w-full flex justify-center">
                <p className="border-b-2 text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500">
                    {t("whatsNext")}
                </p>
            </DialogTrigger>
            <DialogContent className="bg-gray-800">
                <DialogHeader className="flex flex-row justify-center">
                    <DialogTitle>
                        <p className="text-2xl">{t("whatsNext")}</p>
                    </DialogTitle>
                </DialogHeader>
                <p className="text-gray-400">
                    {t("whatsNextLine1")}
                    <br />
                    <br />
                    {t("whatsNextLine2")}
                </p>
            </DialogContent>
        </Dialog>
    );
}