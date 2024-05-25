import { motion } from "framer-motion";

/**
 * Loads children step by step with a delay
 */
export function StepByStepLoader(props: { children: JSX.Element[] }) {
  const motionizedChildren = props.children.map((child, index) => {
    return (
      <motion.span
        key={index}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.5,
            delay: 0.3 * index,
          },
        }}
      >
        {child}
      </motion.span>
    );
  });

  return <>{motionizedChildren}</>;
}
