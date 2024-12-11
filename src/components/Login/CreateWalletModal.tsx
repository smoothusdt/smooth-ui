import { motion, useAnimation } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from 'react';
import { Loader, Check, Copy, ArrowLeft } from 'lucide-react';
import { TronWeb } from 'tronweb';
import { TextBlock } from '../shared/TextBlock';
import { FlyInBlock } from '../shared/FlyInBlock';
import { CoolButton } from '../shared/CoolButton';
import { shakeAnimation } from '../animations';
import { CreatePin } from '../shared/CreatePin';
import { VerifyPin } from '../shared/VerifyPin';
import { useSetupFlow } from './useSetupFlow';
import { AllSet } from '../shared/AllSet';
import { useTranslation } from 'react-i18next';
import { TermsConsent } from '../shared/TermsConsent';

enum CreateWalletStage {
    INTRODUCTION,
    CREATE_PHRASE,
    PHRASE_CREATED,
    CREATE_PINCODE,
    VERIFY_PINCODE,
    ALLSET
}

function Word(props: { word: string | null; index: number }) {
    const wordBlock = props.word ? <>{props.word}</> : <>•••••</>
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.075 * props.index } }}
        >
            <motion.div
                animate={{
                    opacity: 1,
                    borderColor: ['#339192', '#00FFFF', '#1DE9B6', '#339192'],
                    transition: {
                        duration: 2,
                        repeat: 3,
                        repeatType: 'loop',
                        ease: 'linear',
                    }
                }}
                className="bg-gray-700 p-2 border-2 rounded-lg text-center shadow-md overflow-hidden"
            >
                <span className="text-[#339192] font-bold mr-2">{props.index + 1}.</span>
                {wordBlock}
            </motion.div>
        </motion.div>
    );
}

function SecretPhrase(props: { secretPhrase: string; onContinue: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    const words = props.secretPhrase.split(" ")
    const [revealed, setRevealed] = useState(false)
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.secretPhrase)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div className="space-y-4">
            <TextBlock title={t("walletCreated")}>
                {t("thisIsYourSecretPhrase")}
            </TextBlock>
            <motion.div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {words.map((word, index) => <Word key={index} word={revealed ? word : null} index={index} />)}
                </div>
                <motion.button
                    onClick={() => setRevealed(!revealed)}
                    whileTap={{ scale: 0.95 }}
                    className="w-full"
                >
                    <span className="border-b-2 text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300">
                        {revealed ? t("hideSecretPhrase") : t("revealSecretPhrase")}
                    </span>
                </motion.button>
                <motion.button
                    onClick={copyToClipboard}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center w-full border-2 border-[#339192] text-white py-3 rounded-lg transition-all duration-300 bg-transparent shadow-lg hover:shadow-xl"
                >
                    {copied ?
                        <><Check size={20} className="mr-2" />{t("copied")}</> :
                        <><Copy size={20} className="mr-2" />{t("copySecretPhrase")}</>
                    }
                </motion.button>
            </motion.div>
            <CoolButton onClick={props.onContinue}>
                {t("continue")}
            </CoolButton>
        </motion.div>
    );
}

function Introduction(props: { onGetStarted: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    return (
        <motion.div className="space-y-4">
            <FlyInBlock delay={0.2}>
                <TextBlock title={t("introduction")}>
                    {t("introductionLine1")}<br />
                    {t("introductionLine2")}
                </TextBlock>
            </FlyInBlock>
            <FlyInBlock delay={0.4}>
                <TextBlock title={t("stepsDescriptionTitle")}>
                    {t("stepDescription1")}<br />
                    {t("stepDescription2")}
                </TextBlock>
            </FlyInBlock >
            <FlyInBlock delay={0.6}>
                <CoolButton onClick={props.onGetStarted}>
                    {t("getStarted")}
                </CoolButton>
            </FlyInBlock >
        </motion.div >
    );
}

function CreatePhrase(props: { onCreated: (secretPhrase: string) => void }) {
    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [error, setError] = useState(false)
    const termsControls = useAnimation()
    const [creatingPhrase, setCreatingPhrase] = useState(false)

    const onCreatePhrase = async () => {
        if (!agreedToTerms) {
            setError(true)
            termsControls.start(shakeAnimation)
            return;
        }

        setCreatingPhrase(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))

        const secretPhrase = TronWeb.createRandom().mnemonic!.phrase
        props.onCreated(secretPhrase)
    }

    const buttonContent = creatingPhrase ? <><Loader className="animate-spin mr-2" />{t("creating")}</> : <>{t("createWallet")}</>

    return (
        <motion.div className="space-y-4">
            <TextBlock title={t("secretPhrase")}>
                {t("walletSecurityDescription")}
            </TextBlock>
            <TextBlock title={t("whatIsSecretPhraseTitle")}>
                {t("whatIsSecretPhraseLine1")}<br />
                {t("whatIsSecretPhraseLine2")}
            </TextBlock>
            <TermsConsent
                agreed={agreedToTerms}
                error={error}
                setAgreed={setAgreedToTerms}
                controls={termsControls}
            />
            <CoolButton
                onClick={onCreatePhrase}
                disabled={!agreedToTerms || creatingPhrase}
                clickableWhileDisabled={!agreedToTerms}
            >
                {buttonContent}
            </CoolButton>
        </motion.div>
    );
}

export function CreateWallet(props: { isOpen: boolean; onClose: () => void }) {
    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    const [stage, setStage] = useState(CreateWalletStage.INTRODUCTION)
    const {
        pinCode,
        setPincode,
        secretPhrase,
        setSecretPhrase,
        onSetupCompleted
    } = useSetupFlow()

    let stageContent;
    if (stage === CreateWalletStage.INTRODUCTION) {
        stageContent = <Introduction
            onGetStarted={() => setStage(CreateWalletStage.CREATE_PHRASE)}
        />
    } else if (stage === CreateWalletStage.CREATE_PHRASE) {
        stageContent = <CreatePhrase onCreated={(secretPhrase: string) => {
            setSecretPhrase(secretPhrase)
            setStage(CreateWalletStage.PHRASE_CREATED)
        }} />
    } else if (stage === CreateWalletStage.PHRASE_CREATED) {
        stageContent = <SecretPhrase
            secretPhrase={secretPhrase!}
            onContinue={() => setStage(CreateWalletStage.CREATE_PINCODE)}
        />
    } else if (stage === CreateWalletStage.CREATE_PINCODE) {
        stageContent = <CreatePin onPinEntered={(pin: string) => {
            setPincode(pin)
            setStage(CreateWalletStage.VERIFY_PINCODE)
        }} />
    } else if (stage === CreateWalletStage.VERIFY_PINCODE) {
        stageContent = <VerifyPin correctPin={pinCode!} onVerified={async () => {
            await onSetupCompleted()
            setStage(CreateWalletStage.ALLSET)
        }} />
    } else if (stage === CreateWalletStage.ALLSET) {
        stageContent = <AllSet />
    }

    const canGoBack = stage !== 0 && stage !== CreateWalletStage.PHRASE_CREATED && stage !== CreateWalletStage.ALLSET

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            <DialogContent className="bg-gray-800 max-h-screen overflow-y-scroll">
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
                    initial={stage !== CreateWalletStage.INTRODUCTION && stage !== CreateWalletStage.ALLSET && { x: 50, opacity: 0 }}
                    animate={stage !== CreateWalletStage.INTRODUCTION && stage !== CreateWalletStage.ALLSET && { x: 0, opacity: 1 }}
                >
                    {stageContent}
                </motion.div>
            </DialogContent>
        </Dialog>
    );
}
