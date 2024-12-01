import { motion } from 'framer-motion'

export function FlyInBlock(props: { children: any; delay: number }) {
    return (
        <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{
                y: 0,
                opacity: 1,
                transition: {
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: props.delay
                },

            }}
        >
            {props.children}
        </motion.div>
    );
}
