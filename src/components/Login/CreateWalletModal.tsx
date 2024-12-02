import { AnimationControls, motion, useAnimation } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRef, useState } from 'react';
import { Loader, Check, Copy, ArrowLeft, AlertCircle } from 'lucide-react';
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

enum CreateWalletStage {
    INTRODUCTION,
    CREATE_PHRASE,
    PHRASE_CREATED,
    VERIFY_PHRASE,
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
                className="bg-gray-700 p-2 border-2 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow duration-300"
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
            <TextBlock title="Wallet created!">
                {t("thisIsYourSecretPhrase")}
            </TextBlock>
            <motion.div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
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
                {t("iSaved")}
            </CoolButton>
        </motion.div>
    );
}

function PhraseConfirmRow(props: {
    wordIndex: number;
    enteredWord: string;
    setEnteredWord: (word: string) => void;
    animationControls: AnimationControls
}) {
    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    return (
        <motion.div
            className="flex justify-between py-2 items-center"
            animate={props.animationControls}
        >
            <span className="text-gray-300 font-bold">{t("word")} #{props.wordIndex + 1}:</span>
            <input
                type="text"
                value={props.enteredWord}
                onChange={(e) => props.setEnteredWord(e.target.value)}
                className="px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192] transition-all duration-300 shadow-md hover:shadow-lg"
            />
        </motion.div>
    );
}

function PhraseConfirm(props: { secretPhrase: string; onVerified: () => void; }) {
    const wordlist = props.secretPhrase.split(" ")
    if (wordlist.length !== 12) throw new Error("Secret phrase is expected to have 12 words")

    const { t } = useTranslation("", { keyPrefix: "createWalletFlow" })
    const index1 = useRef(Math.floor((Math.random() * 179) % 4))
    const index2 = useRef(4 + Math.floor((Math.random() * 179) % 4))
    const index3 = useRef(8 + Math.floor((Math.random() * 179) % 4))

    const [enteredWord1, setEnteredWord1] = useState("")
    const [enteredWord2, setEnteredWord2] = useState("")
    const [enteredWord3, setEnteredWord3] = useState("")

    const controls1 = useAnimation()
    const controls2 = useAnimation()
    const controls3 = useAnimation()

    const [errorMessage, setErrorMessage] = useState("")

    const onConfirm = () => {
        if (enteredWord1.trim().toLowerCase() !== wordlist[index1.current]) {
            setErrorMessage(t("wordIsIncorrect", { index: index1.current + 1 }))
            controls1.start(shakeAnimation)
            return;
        }
        if (enteredWord2.trim().toLowerCase() !== wordlist[index2.current]) {
            setErrorMessage(t("wordIsIncorrect", { index: index2.current + 1 }))
            controls2.start(shakeAnimation)
            return;
        }
        if (enteredWord3.trim().toLowerCase() !== wordlist[index3.current]) {
            setErrorMessage(t("wordIsIncorrect", { index: index3.current + 1 }))
            controls3.start(shakeAnimation)
            return;
        }

        // Else - success
        props.onVerified()
    }

    const inputsAreEmpty = enteredWord1.length === 0 || enteredWord2.length === 0 || enteredWord3.length === 0

    return (
        <motion.div className="space-y-4">
            <TextBlock title="Verification">
                {t("verifySecretPhrase")}
            </TextBlock>
            <motion.div className="space-y-4">
                <div>
                    <PhraseConfirmRow wordIndex={index1.current} enteredWord={enteredWord1} setEnteredWord={setEnteredWord1} animationControls={controls1} />
                    <PhraseConfirmRow wordIndex={index2.current} enteredWord={enteredWord2} setEnteredWord={setEnteredWord2} animationControls={controls2} />
                    <PhraseConfirmRow wordIndex={index3.current} enteredWord={enteredWord3} setEnteredWord={setEnteredWord3} animationControls={controls3} />
                </div>
                {errorMessage && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" /> {errorMessage}</p>}
                <CoolButton onClick={onConfirm} disabled={inputsAreEmpty}>
                    {t("confirm")}
                </CoolButton>
            </motion.div>
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
    const [creatingPhrase, setCreatingPhrase] = useState(false)

    const onCreatePhrase = async () => {
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
                {t("whatIsSecretPhraseLine1")}.<br />
                {t("whatIsSecretPhraseLine2")}
            </TextBlock>
            <CoolButton onClick={onCreatePhrase} disabled={creatingPhrase}>
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
            onContinue={() => setStage(CreateWalletStage.VERIFY_PHRASE)}
        />
    } else if (stage === CreateWalletStage.VERIFY_PHRASE) {
        stageContent = <PhraseConfirm secretPhrase={secretPhrase!} onVerified={() => {
            setStage(CreateWalletStage.CREATE_PINCODE)
        }} />
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
            <DialogContent className="bg-gray-800">
                <DialogHeader className="flex flex-row justify-between items-center">
                    {canGoBack ?
                        <button onClick={() => setStage(stage - 1)} className="w-8 h-full text-gray-400 hover:text-white">
                            <ArrowLeft size={24} />
                        </button> : <div />
                    }
                    <DialogTitle>
                        <p className="text-2xl">{t("createWallet")}</p>
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
