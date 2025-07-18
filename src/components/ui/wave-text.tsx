"use client"
import { motion } from "framer-motion"

export function WaveText({
  text,
  delay = 0,
  className = ""
}: {
  text: string;
  delay?: number;
  className?: string;
}) {
  const letters = text.split("")
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.05,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              filter: "blur(4px)"
            },
            visible: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)"
            },
          }}
          transition={{
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  )
} 