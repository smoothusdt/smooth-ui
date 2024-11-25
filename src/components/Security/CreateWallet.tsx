import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from 'react';
import { DotIcon, Loader } from 'lucide-react';


const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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

function CoolButton(props: { onClick: () => void; children: any; disabled?: boolean }) {
    return (
        <motion.button
            disabled={props.disabled}
            onClick={props.onClick}
            variants={itemVariants}
            whileHover={props.disabled ? {} : { scale: 1.05 }}
            whileTap={props.disabled ? {} : { scale: 0.95 }}
            className="flex items-center justify-center w-full bg-[#339192] text-white py-3 rounded-lg hover:bg-[#2a7475] transition-colors mt-4 disabled:bg-[#2a7475] disabled:text-gray-300"
        >
            {props.children}
        </motion.button>
    );
}

function Word(props: { word: string | null; index: number }) {
    const wordBlock = props.word ? <>{props.word}</> : <>•••••</>
    return (
        <p className="bg-gray-700 p-1 rounded-lg text-center">{props.index + 1}. {wordBlock}</p>
    );
}

function SecretPhrase() {
    const [revealed, setRevealed] = useState(false)
    const words = ["banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana", "banana"]
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                {words.map((word, index) => <Word word={revealed ? word : null} index={index} />)}
            </div>
            <motion.button
                onClick={() => setRevealed(!revealed)}
                variants={itemVariants}
                whileTap={{ scale: 0.95 }}
                className="w-full"
            ><span className="text-gray-400 border-b-2 border-gray-400 hover:text-gray-500 hover:border-gray-500">{revealed ? "Hide" : "Reveal"} Secret Phrase</span>
            </motion.button>
            <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // onClick={privyLogin}
                className="flex items-center justify-center w-full border-2 border-[#339192] text-[#339192] py-3 rounded-lg  hover:text-white transition-all duration-300 bg-transparent"
            >
                Copy Secret Phrase
            </motion.button>
        </div>
    );
}

function PhraseConfirmRow(props: { wordIndex: number }) {
    const [enteredWord, setEnteredWord] = useState("")

    return (
        <div className="flex justify-between py-1"><span>Word #{props.wordIndex}:</span><input
            type="text"
            value={enteredWord}
            onChange={(e) => setEnteredWord(e.target.value)}
            className="px-3 py-1 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#339192]"
        /></div>
    );
}

function PhraseConfirm() {
    return (
        <div>
            <PhraseConfirmRow wordIndex={1} />
            <PhraseConfirmRow wordIndex={5} />
            <PhraseConfirmRow wordIndex={9} />
        </div>
    );
}

function DigitWindow(props: { filled: boolean }) {
    return (
        <div className="relative w-8 h-full flex justify-center items-center">
            {/* A separate div to have the border transparent while keeping the dot non-transparent */}
            <div className="absolute w-full h-full border-current border-2 rounded-lg opacity-15"></div>
            <DotIcon
                className="absolute"
                size={48}
                visibility={props.filled ? "auto" : "hidden"}
            />
        </div>
    );
}

function EnterPin() {
    const [pin, setPin] = useState("12");
    return (
        <div className="w-full h-10 flex justify-center gap-4">
            <DigitWindow filled={pin.length >= 1} />
            <DigitWindow filled={pin.length >= 2} />
            <DigitWindow filled={pin.length >= 3} />
            <DigitWindow filled={pin.length >= 4} />
            <DigitWindow filled={pin.length >= 5} />
            <DigitWindow filled={pin.length >= 6} />
        </div>
    );
}

export function CreateWallet(props: { isOpen: boolean; onClose: () => void }) {
    const [stage, setStage] = useState(CreateWalletStage.INTRODUCTION)

    let stageContent;
    if (stage === CreateWalletStage.INTRODUCTION) {
        stageContent = <>
            <p>- Creating a crypto wallet is not as scary as it might sound.<br />- We'll help you understand this process.</p>
            <CoolButton onClick={() => setStage(CreateWalletStage.PHRASES_DESCRIPTION)}>
                Great
            </CoolButton>
        </>
    } else if (stage === CreateWalletStage.PHRASES_DESCRIPTION || stage === CreateWalletStage.CREATING_PHRASE) {
        const onCreatePhrase = async () => {
            setStage(CreateWalletStage.CREATING_PHRASE)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setStage(CreateWalletStage.PHRASE_CREATED)
        }

        const creating = stage === CreateWalletStage.CREATING_PHRASE
        const buttonContent = creating ? <><Loader className="animate-spin mr-2" />Creating...</> : <>Create Secret Phrase</>

        stageContent = <>
            <p>Crypto wallet is controlled by a secret phrase. A secret phrase is like a password, but:<br />- It is not recoverable if you lose it.<br />- It is generated by a crypto wallet for you.</p>
            <CoolButton onClick={onCreatePhrase} disabled={creating}>
                {buttonContent}
            </CoolButton>
        </>
    } else if (stage === CreateWalletStage.PHRASE_CREATED) {
        stageContent = <>
            <p>Great! This is your secret phrase. Save it in a secure place.</p>
            <SecretPhrase />
            <CoolButton onClick={() => setStage(CreateWalletStage.VERIFY_PHRASE)}>
                I've saved it
            </CoolButton>
        </>
    } else if (stage === CreateWalletStage.VERIFY_PHRASE) {
        const onVerifyPhrase = () => {
            setStage(CreateWalletStage.CREATE_PINCODE)
        }

        stageContent = <>
            <p>Verify that you saved your secret phrase correctly.</p>
            <PhraseConfirm />
            <CoolButton onClick={onVerifyPhrase}>
                Continue
            </CoolButton>
        </>
    } else if (stage === CreateWalletStage.CREATE_PINCODE) {
        stageContent = <>
            <p>Great! Now create a pin code. The pin code can be reset with your secret phtase.</p>
            <EnterPin />
            <CoolButton onClick={() => setStage(CreateWalletStage.VERIFY_PINCODE)}>
                Continue
            </CoolButton>
        </>
    } else if (stage === CreateWalletStage.VERIFY_PINCODE) {
        stageContent = <>
            <p>Verify your pin code</p>
            <EnterPin/>
            <CoolButton onClick={() => setStage(CreateWalletStage.ALLSET)}>Continue</CoolButton>
        </>
    } else if (stage === CreateWalletStage.ALLSET) {
        stageContent = <>
            <p>Congratulations! Your wallet is ready to be used.</p>
            <CoolButton onClick={() => {}}>
                Start using
            </CoolButton>
        </>
    }

    return (
        <Dialog open={props.isOpen} onOpenChange={props.onClose}>
            <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-sm rounded-lg w-80 md:w-full">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#339192]">Create Wallet</DialogTitle>
                </DialogHeader>
                {stageContent}
            </DialogContent>
        </Dialog>
    );
}