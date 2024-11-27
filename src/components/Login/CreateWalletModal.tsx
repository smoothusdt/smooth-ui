import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useRef, useState } from 'react';
import { DotIcon, Loader, CheckCircle, Check, Copy, ArrowLeft, AlertCircle } from 'lucide-react';
import { Drawer, DrawerContent, DrawerHeader } from '../ui/drawer';
import { PageContainer } from '../PageContainer';
import { tronweb } from '@/constants';
import { TronWeb } from 'tronweb';
import { useLocation } from 'wouter';

const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.3,
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
}

enum CreateWalletStage {
    INTRODUCTION,
    PHRASES_DESCRIPTION,
    CREATING_PHRASE,
    PHRASE_CREATED,
    VERIFY_PHRASE,
    CREATE_PINCODE,
    VERIFY_PINCODE,
    ALLSET
}

// Cool button.
// Handles props.disabled via tailwind if-else instead of a proper disabled
// to preserve clicks propagation to the parent container.
function CoolButton(props: { onClick: () => void; children: any; disabled?: boolean }) {
    return (
        <motion.button
            onClick={props.disabled ? () => { } : props.onClick}
            variants={itemVariants}
            whileHover={props.disabled ? {} : { scale: 1.05 }}
            whileTap={props.disabled ? {} : { scale: 0.95 }}
            className={`flex items-center justify-center w-full py-3 rounded-lg hover:bg-[#2a7475] transition-all duration-300 mt-4 ${props.disabled ? "bg-[#2a7475] text-gray-400" : "bg-[#339192] text-white"} shadow-lg hover:shadow-xl`}
        >
            {props.children}
        </motion.button>
    );
}

function Word(props: { word: string | null; index: number }) {
    const wordBlock = props.word ? <>{props.word}</> : <>•••••</>
    return (
        <motion.div
            variants={itemVariants}
            animate={{
                borderColor: ['#339192', '#00FFFF', '#1DE9B6', '#339192'],
                transition: {
                    duration: 2,
                    repeat: 3,
                    repeatType: 'loop',
                    ease: 'linear'
                }
            }}
            className="bg-gray-700 p-2 border-2 rounded-lg text-center shadow-md hover:shadow-lg transition-shadow duration-300"
        >
            <span className="text-[#339192] font-bold mr-2">{props.index + 1}.</span>
            {wordBlock}
        </motion.div>
    );
}

function SecretPhrase(props: { secretPhrase: string; }) {
    const words = props.secretPhrase.split(" ")
    const [revealed, setRevealed] = useState(false)
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(props.secretPhrase)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <motion.div variants={containerVariants} className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {words.map((word, index) => <Word key={index} word={revealed ? word : null} index={index} />)}
            </div>
            <motion.button
                onClick={() => setRevealed(!revealed)}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                className="w-full"
            >
                <span className="border-b-2 text-gray-400 border-gray-400 hover:text-gray-500 hover:border-gray-500 transition-colors duration-300">
                    {revealed ? "Hide" : "Reveal"} Secret Phrase
                </span>
            </motion.button>
            <motion.button
                onClick={copyToClipboard}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-full border-2 border-[#339192] text-white py-3 rounded-lg transition-all duration-300 bg-transparent shadow-lg hover:shadow-xl"
            >
                {copied ?
                    <><Check size={20} className="mr-2" />Copied</> :
                    <><Copy size={20} className="mr-2" />Copy Secret Phrase</>
                }
            </motion.button>
        </motion.div>
    );
}

function PhraseConfirmRow(props: { wordIndex: number; enteredWord: string; setEnteredWord: (word: string) => void }) {

    return (
        <motion.div
            variants={itemVariants}
            className="flex justify-between py-2 items-center"
        >
            <span className="text-gray-300 font-bold">Word #{props.wordIndex + 1}:</span>
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

    const index1 = useRef(Math.floor((Math.random() * 179) % 4))
    const index2 = useRef(4 + Math.floor((Math.random() * 179) % 4))
    const index3 = useRef(8 + Math.floor((Math.random() * 179) % 4))
    const [enteredWord1, setEnteredWord1] = useState("")
    const [enteredWord2, setEnteredWord2] = useState("")
    const [enteredWord3, setEnteredWord3] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const onConfirm = () => {
        if (enteredWord1.trim().toLowerCase() !== wordlist[index1.current]) {
            setErrorMessage("Word #1 is incorrect")
            return;
        }
        if (enteredWord2.trim().toLowerCase() !== wordlist[index2.current]) {
            setErrorMessage("Word #2 is incorrect")
            return;
        }
        if (enteredWord3.trim().toLowerCase() !== wordlist[index3.current]) {
            setErrorMessage("Word #3 is incorrect")
            return;
        }

        // Else - success
        props.onVerified()
    }

    const inputsAreEmpty = enteredWord1.length === 0 || enteredWord2.length === 0 || enteredWord3.length === 0

    return (
        <motion.div variants={containerVariants} className="space-y-4">
            <div>
                <PhraseConfirmRow wordIndex={index1.current} enteredWord={enteredWord1} setEnteredWord={setEnteredWord1} />
                <PhraseConfirmRow wordIndex={index2.current} enteredWord={enteredWord2} setEnteredWord={setEnteredWord2} />
                <PhraseConfirmRow wordIndex={index3.current} enteredWord={enteredWord3} setEnteredWord={setEnteredWord3} />
            </div>
            {errorMessage && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" /> {errorMessage}</p>}
            <CoolButton onClick={onConfirm} disabled={inputsAreEmpty}>
                Confirm
            </CoolButton>
        </motion.div>
    );
}

function DigitWindow(props: { filled: boolean }) {
    return (
        <motion.div
            className="relative w-10 h-12 flex justify-center items-center"
            variants={itemVariants}
        >
            <div className="absolute w-full h-full border-current border-2 rounded-lg opacity-15 transition-all duration-300"></div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: props.filled ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <DotIcon className="text-[#339192]" size={32} />
            </motion.div>
        </motion.div>
    );
}

function EnterPin(props: { pinLength: number; onPinEntered: (pin: string) => void }) {
    const [pin, setPin] = useState("");

    const onPinChange = (newPin: string) => {
        if (!/^[0-9]*$/.test(newPin)) return;
        if (newPin.length > props.pinLength) return;
        if (newPin.length === props.pinLength) {
            setPin("") // reset state
            props.onPinEntered(newPin)
        } else {
            setPin(newPin)
        }
    }

    return (
        <motion.form
            variants={containerVariants}
            className="w-full h-12 flex justify-center gap-4"
        >
            <input /* Ugly, but needed to open the native keyboard on mobile devices. */
                id="pinVirtualInput"
                autoFocus
                type="number"
                value={pin}
                onChange={((e) => onPinChange(e.target.value))}
                className="absolute w-0"
            />
            {[...Array(props.pinLength).keys()].map(
                (value) => <DigitWindow key={value} filled={pin.length >= value + 1} />
            )}
        </motion.form>
    );
}

function TextBlock(props: { title: string; children: any }) {
    // return <div className="bg-gray-700 p-2 rounded-lg">
    //     <p className="text-xl">{props.title}</p>
    //     <p className="text-gray-300 mb-4">{props.children}</p>
    // </div>

    return (
        <div>
            <div className="flex items-center justify-between mb-4 text-xl">
                {props.title}
            </div>
            <motion.div className="space-y-2" variants={itemVariants}>
                <p className="text-gray-400">{props.children}</p>
            </motion.div>
        </div>
    );
}

export function CreateWallet(props: { isOpen: boolean; onClose: () => void }) {
    const [stage, setStage] = useState(CreateWalletStage.INTRODUCTION)
    const [secretPhrase, setSecretPhrase] = useState<string>()
    const [pinCode, setPincode] = useState<string>()
    const [pinVerificationError, setPinVerificationError] = useState(false)
    const [, navigate] = useLocation()

    let stageContent;
    if (stage === CreateWalletStage.INTRODUCTION) {
        stageContent = (
            <motion.div className="space-y-4">
                <TextBlock title="Introduction">
                    - Creating a crypto wallet is not as scary as it might sound.<br />
                    - We'll help you understand this process.
                </TextBlock>
                <TextBlock title="Right now you will:">
                    1. Create a new Smooth USDT wallet.<br />
                    2. Set up a pin code for your wallet.
                </TextBlock>
                <CoolButton onClick={() => setStage(CreateWalletStage.PHRASES_DESCRIPTION)}>
                    Get started
                </CoolButton>
            </motion.div>
        );
    } else if (stage === CreateWalletStage.PHRASES_DESCRIPTION || stage === CreateWalletStage.CREATING_PHRASE) {
        const onCreatePhrase = async () => {
            setStage(CreateWalletStage.CREATING_PHRASE)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setSecretPhrase(TronWeb.createRandom().mnemonic!.phrase)
            setStage(CreateWalletStage.PHRASE_CREATED)
        }

        const creating = stage === CreateWalletStage.CREATING_PHRASE
        const buttonContent = creating ? <><Loader className="animate-spin mr-2" />Creating...</> : <>Create My Wallet</>

        stageContent = (
            <motion.div className="space-y-4">
                <TextBlock title="Secret phrase">
                    Your wallet will be secured by a secret phrase. You will need it to log in on a new device or if you clear your browser cache.
                </TextBlock>
                <TextBlock title="Secret phrase is like a password, but:">
                    - It is not recoverable if you lose it.<br />
                    - It will be generated automatically.
                </TextBlock>
                <CoolButton onClick={onCreatePhrase} disabled={creating}>
                    {buttonContent}
                </CoolButton>
            </motion.div>
        );
    } else if (stage === CreateWalletStage.PHRASE_CREATED) {
        stageContent = (
            <motion.div className="space-y-4">
                <TextBlock title="Wallet created!">
                    This is your secret phrase. Save it in a secure place.
                </TextBlock>
                <SecretPhrase secretPhrase={secretPhrase!} />
                <CoolButton onClick={() => setStage(CreateWalletStage.VERIFY_PHRASE)}>
                    I've saved it
                </CoolButton>
            </motion.div>
        );
    } else if (stage === CreateWalletStage.VERIFY_PHRASE) {
        const onVerifyPhrase = () => {
            setStage(CreateWalletStage.CREATE_PINCODE)
        }
        onVerifyPhrase()

        stageContent = (
            <motion.div className="space-y-4">
                <TextBlock title="Verification">
                    Verify that you saved your secret phrase correctly.
                </TextBlock>
                <PhraseConfirm secretPhrase={secretPhrase!} onVerified={onVerifyPhrase} />
            </motion.div>
        );
    } else if (stage === CreateWalletStage.CREATE_PINCODE) {
        const onPinEntered = (pin: string) => {
            setPincode(pin)
            setStage(CreateWalletStage.VERIFY_PINCODE)
        }

        stageContent = (
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
                <EnterPin key="create-pin" pinLength={6} onPinEntered={onPinEntered} />
                <CoolButton
                    disabled
                    onClick={() => { }} // navigates automatically after pin is entered
                >
                    Continue
                </CoolButton>
            </motion.div>
        );
    } else if (stage === CreateWalletStage.VERIFY_PINCODE) {
        const onPinVerify = (enteredPin: string) => {
            if (enteredPin !== pinCode) {
                setPinVerificationError(true)
                return;
            }
            setStage(CreateWalletStage.ALLSET)
        }

        stageContent = (
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
                <EnterPin key="verify-pin" pinLength={6} onPinEntered={onPinVerify} />
                {pinVerificationError && <p className="text-red-400 border-2 border-red-400 p-4 rounded-lg break-words"><AlertCircle className="inline mr-1" />Incorrect pin</p>}
                <CoolButton
                    disabled
                    onClick={() => { }} // navigates automatically after pin is entered
                >
                    Continue
                </CoolButton>
            </motion.div>
        );
    } else if (stage === CreateWalletStage.ALLSET) {
        stageContent = (
            <motion.div className="space-y-8">
                <TextBlock title="All set">
                    Your Smooth USDT wallet is ready to be used.
                </TextBlock>
                <motion.div
                    variants={itemVariants}
                    className="flex justify-center items-center mb-4"
                >
                    <CheckCircle size={64} className="text-[#339192]" />
                </motion.div>
                <CoolButton onClick={() => navigate("/home")}>
                    Start using
                </CoolButton>
            </motion.div>
        );
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
                        <p className="text-3xl">Create Wallet</p>
                    </DialogTitle>
                    <div className="w-4" />
                </DialogHeader>
                {stageContent}
            </DialogContent>
        </Dialog>
    );
}
