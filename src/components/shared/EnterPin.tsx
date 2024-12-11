import { AnimationControls, motion } from "framer-motion";
import { DotIcon, Loader } from "lucide-react";
import { useState } from "react";

function DigitWindow(props: { filled: boolean; focused: boolean; disabled?: boolean }) {
    return (
        <motion.div className="relative w-10 h-12 flex justify-center items-center">
            <div className={`absolute w-full h-full  border-2 rounded-lg transition-all duration-300 ${props.disabled ? "opacity-5" : "opacity-100"} ${props.focused && !props.disabled ? "border-gray-400" : "border-gray-700"}`}></div>
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: props.filled ? 1 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
                <DotIcon className={`text-[#339192] ${props.disabled && "opacity-30"}`} size={32} />
            </motion.div>
        </motion.div>
    );
}


export function EnterPin(props: {
    pinLength: number;
    onPinEntered: (pin: string) => void;
    animationControls?: AnimationControls;
    processing?: boolean
    disabled?: boolean
}) {
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
        <div>
            <motion.form
                className="w-full h-12 flex justify-center gap-4"
                animate={props.animationControls}
            >
                <input /* Ugly, but needed to open the native keyboard on mobile devices. */
                    id="pinVirtualInput"
                    autoFocus
                    type="number"
                    value={pin}
                    onChange={((e) => {
                        e.preventDefault()
                        if (!props.disabled) {
                            onPinChange(e.target.value)
                        }
                    })}
                    className="absolute w-0"
                />
                {[...Array(props.pinLength).keys()].map(
                    (value) => <DigitWindow
                        disabled={props.processing || props.disabled}
                        key={value}
                        focused={pin.length === value}
                        filled={pin.length >= value + 1}
                    />
                )}
                {props.processing && <div className="fixed w-full h-12 flex justify-center items-center">
                    <Loader className=" animate-spin w-8 h-8 opacity-70" />
                </div>}
            </motion.form>
        </div>
    );
}
