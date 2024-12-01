import { motion } from 'framer-motion'

// Cool button.
// Handles props.disabled via tailwind if-else instead of a proper disabled
// to preserve clicks propagation to the parent container.
export function CoolButton(props: { onClick: () => void; children: any; disabled?: boolean }) {
    return (
        <motion.button
            onClick={props.disabled ? () => { } : props.onClick}
            whileHover={props.disabled ? {} : { scale: 1.05 }}
            whileTap={props.disabled ? {} : { scale: 0.95 }}
            className={`flex items-center justify-center w-full py-3 rounded-lg hover:bg-[#2a7475] transition-all duration-300 mt-4 ${props.disabled ? "bg-[#2a7475] text-gray-400" : "bg-[#339192] text-white"} shadow-lg hover:shadow-xl`}
        >
            {props.children}
        </motion.button>
    );
}
