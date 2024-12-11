import { motion, useAnimation } from 'framer-motion'
import { PageContainer } from "../PageContainer";
import { useEffect, useState } from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useLocation } from 'wouter';
import { BigNumber } from 'tronweb';
import { SmoothApiURL, tronweb } from '@/constants';
import { useWallet } from '@/hooks/useWallet';
import { useTranslation } from 'react-i18next';
import { InfoTooltip } from '../shared/InfoTooltip';
import { ScanButton } from './ScanButton';
import { itemVariants, shakeAnimation, stepVariants } from '../animations';

async function fetchUsdtFee(): Promise<BigNumber> {
    const respone = await fetch(`${SmoothApiURL}/getFeeQuote`)
    const data = await respone.json()
    if (!data.success) throw new Error(`Couldnt fetch fee quote due to ${data.error}`)

    return new BigNumber(data.requestedUsdtFee).decimalPlaces(2)
}

export function SendInput() {
    const { t } = useTranslation("", { keyPrefix: "sendFlow" })
    const { wallet } = useWallet();
    const search = new URLSearchParams(window.location.search)
    const [recipient, setRecipient] = useState(search.get("recipient") || "")
    const [rawAmount, setRawAmount] = useState(search.get("amount") || "")
    const [errorMessage, setErrorMessage] = useState("")
    const [, navigate] = useLocation()
    const recipientControls = useAnimation()
    const amountControls = useAnimation()
    const [smoothFee, setSmoothFee] = useState<BigNumber>()

    let availableAmount: BigNumber | undefined = undefined
    if (smoothFee !== undefined) availableAmount = BigNumber.max(wallet.balance.minus(smoothFee), 0)

    useEffect(() => {
        fetchUsdtFee().then((quote) => setSmoothFee(quote))
    }, [])

    const onContinue = () => {
        // Validate inputs
        if (availableAmount === undefined || smoothFee === undefined) return;
        if (!tronweb.isAddress(recipient)) {
            recipientControls.start(shakeAnimation)
            let msg: string;
            if (recipient.length === 0) msg = t("errorEnterRecipient")
            else msg = t("errorInvalidRecipient").replace("$1", recipient)
            setErrorMessage(msg)
            return;
        }
        const amount = new BigNumber(rawAmount.replaceAll(",", ".")) // for Russian keyboard

        let amountError: string = ""
        if (amount.isNaN()) {
            amountError = t("errorEnterAmount")
        } else if (amount.lt(0)) {
            amountError = t("errorNegativeAmount")
        } else if (amount.gt(availableAmount)) {
            amountError = t("errorLimitExceeded").replace("$1", availableAmount.toFixed(2))
        }

        if (amountError) {
            amountControls.start(shakeAnimation)
            setErrorMessage(amountError)
            return;
        }

        // Cache values in case the user wants to come back and edit
        navigate(`/send?recipient=${recipient}&amount=${amount.toString()}`, { replace: true })
        // Navigate to the confirmation screeens
        navigate(`/send/confirm?recipient=${recipient}&transferAmount=${amount.toString()}&feeAmount=${smoothFee.toString()}`)
    }

    return (
        <PageContainer title={t("sendUsdt")}>
            <motion.div
                variants={stepVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full bg-gray-800 rounded-lg p-6"
            >
                <h3 className="text-lg font-semibold mb-4">{t("enterDetails")}</h3>
                <div className="space-y-4">
                    <motion.div variants={itemVariants} animate={recipientControls}>
                        <div className="text-sm text-gray-400 mb-1">
                            <InfoTooltip content={t("recipientTooltip")} />
                            {t("recipientAddress")}
                        </div>
                        <div className="relative flex">
                            <input
                                type="text"
                                id="recipient"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
                            />
                            <div className="absolute right-0 h-full flex">
                                <ScanButton onScanned={setRecipient} />
                            </div>
                        </div>
                    </motion.div>
                    <motion.div variants={itemVariants} animate={amountControls}>
                        <div className="text-sm text-gray-400 mb-1">
                            <InfoTooltip content={t("amountTooltip", { networkFee: smoothFee === undefined ? "-" : smoothFee.toString() })} />
                            {t("amount")}
                        </div>
                        <input
                            type="text"
                            id="recipient"
                            value={rawAmount}
                            onChange={(e) => setRawAmount(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
                        />
                        <p className="text-sm text-gray-400 my-1">{t("availableAmount")} {availableAmount === undefined ? "-" : availableAmount.toFixed(2)} USDT.</p>
                        <p className="text-sm text-gray-400 my-1">{t("networkFee")} {smoothFee === undefined ? "-" : smoothFee.toFixed(2)} USDT.</p>
                    </motion.div>
                    {errorMessage && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" /> {errorMessage}</p>}
                    <motion.button
                        variants={itemVariants}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4"
                        onClick={onContinue}
                    >
                        {t("continue")} <ArrowRight size={20} className="ml-2" />
                    </motion.button>
                </div>
            </motion.div>
        </PageContainer>
    );
}