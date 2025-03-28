import { motion, useAnimation } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { FlyInBlock } from '../shared/FlyInBlock';
import { TextBlock } from '../shared/TextBlock';
import { CoolButton } from '../shared/CoolButton';
import { TronWeb } from 'tronweb';
import { CreatePin } from '../shared/CreatePin';
import { VerifyPin } from '../shared/VerifyPin';
import { useSetupFlow } from './useSetupFlow';
import { AllSet } from '../shared/AllSet';
import { useTranslation } from 'react-i18next';
import { TermsConsent } from '../shared/TermsConsent';
import { shakeAnimation } from '../animations';

enum ImportWalletStage {
    INTRODUCTION,
    IMPORT_PHRASE,
    CREATE_PINCODE,
    VERIFY_PINCODE,
    ALLSET
}

function Introduction(props: { onNext: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "importWalletFlow" })
    return (
        <motion.div className="space-y-4">
            <FlyInBlock delay={0.2}>
                <TextBlock title={t("whenImport")}>
                    {t("whenImportLine1")}<br />
                    {t("whenImportLine2")}
                </TextBlock>
            </FlyInBlock>
            <FlyInBlock delay={0.4}>
                <TextBlock title={t("stepsDescriptionTitle")}>
                    {t("stepDescription1")}<br />
                    {t("stepDescription2")}
                </TextBlock>
            </FlyInBlock >
            <FlyInBlock delay={0.6}>
                <CoolButton onClick={props.onNext}>
                    {t("importWallet")}
                </CoolButton>
            </FlyInBlock >
        </motion.div >
    );
}

function ImportPhrase(props: { onImported: (phrase: string) => void }) {
    const { t } = useTranslation("", { keyPrefix: "importWalletFlow" })
    const [rawPhrase, setRawPhrase] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [termsError, setTermsError] = useState(false)
    const termsControls = useAnimation()

    const onImport = async () => {
        const formatted = rawPhrase.trim().toLowerCase()
        if (formatted.split(" ").length !== 12) {
            setErrorMessage(t("secretPhraseMustHave12Words"))
            return;
        }

        let importedPhrase: string;
        try {
            importedPhrase = TronWeb.fromMnemonic(formatted).mnemonic!.phrase
            setErrorMessage("")
        } catch {
            setErrorMessage(t("invalidSecretPhrase"))
            return;
        }

        if (!agreedToTerms) {
            setTermsError(true)
            termsControls.start(shakeAnimation)
            return;
        }
        props.onImported(importedPhrase)
    }

    return (
        <motion.div className="space-y-4">
            <p className="text-xl">{t("enterSecretPhrase")}</p>
            <textarea
                autoFocus
                rows={2}
                value={rawPhrase}
                onChange={(e) => setRawPhrase(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
            />
            <TermsConsent
                agreed={agreedToTerms}
                error={termsError}
                setAgreed={setAgreedToTerms}
                controls={termsControls}
            />
            {errorMessage && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" /> {errorMessage}</p>}
            <CoolButton
                disabled={rawPhrase.length === 0}
                onClick={onImport}
            >
                {t("import")}
            </CoolButton>
        </motion.div>
    );
}

export function ImportWallet(props: { isOpen: boolean; onClose: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "importWalletFlow" })
    const [stage, setStage] = useState(ImportWalletStage.INTRODUCTION)
    const {
        pinCode,
        setPincode,
        setSecretPhrase,
        onSetupCompleted
    } = useSetupFlow()

    let stageContent;
    if (stage === ImportWalletStage.INTRODUCTION) {
        stageContent = <Introduction
            onNext={() => setStage(ImportWalletStage.IMPORT_PHRASE)}
        />
    } else if (stage === ImportWalletStage.IMPORT_PHRASE) {
        stageContent = <ImportPhrase
            onImported={(secretPhrase: string) => {
                setSecretPhrase(secretPhrase)
                setStage(ImportWalletStage.CREATE_PINCODE)
            }}
        />
    } else if (stage === ImportWalletStage.CREATE_PINCODE) {
        stageContent = <CreatePin onPinEntered={(pin: string) => {
            setPincode(pin)
            setStage(ImportWalletStage.VERIFY_PINCODE)
        }} />
    } else if (stage === ImportWalletStage.VERIFY_PINCODE) {
        stageContent = <VerifyPin correctPin={pinCode!} onVerified={async () => {
            await onSetupCompleted()
            setStage(ImportWalletStage.ALLSET)
        }} />
    } else if (stage === ImportWalletStage.ALLSET) {
        stageContent = <AllSet />
    }

    const canGoBack = stage !== 0 && stage !== ImportWalletStage.ALLSET
    return (
        <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            <DialogContent className="bg-gray-800">
                <DialogHeader className="flex flex-row justify-between items-center">
                    {canGoBack ?
                        <button onClick={() => setStage(stage - 1)} className="w-8 h-full text-gray-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button> : <div />
                    }
                    <DialogTitle>
                        <p className="text-2xl">{t("dialogTitle")}</p>
                    </DialogTitle>
                    <div className="w-4" /> {/* For alignment */}
                </DialogHeader>
                <motion.div
                    key={stage}
                    initial={stage !== ImportWalletStage.INTRODUCTION && stage !== ImportWalletStage.ALLSET && { x: 50, opacity: 0 }}
                    animate={stage !== ImportWalletStage.INTRODUCTION && stage !== ImportWalletStage.ALLSET  && { x: 0, opacity: 1 }}
                >
                    {stageContent}
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}