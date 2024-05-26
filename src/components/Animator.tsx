import { motion } from "framer-motion";

/**
 * Loads children step by step with a delay
 */
export function StepByStepLoader(props: {
  intervals: number[];
  children: JSX.Element[];
}) {
  if (props.intervals.length !== props.children.length) {
    throw new Error(
      "intervals length doesnt match children length in StepByStepLoader",
    );
  }

  const motionizedChildren = props.children.map((child, i) => {
    return (
      <motion.span
        key={i}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 0.5,
            delay: props.intervals[i],
          },
        }}
      >
        {child}
      </motion.span>
    );
  });

  return <>{motionizedChildren}</>;
}
