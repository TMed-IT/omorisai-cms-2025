"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export function FadeIn(
  { children, delay = 0, direction = "up", className = "" }: FadeInProps,
) {
  const directions = {
    up: { y: 60, x: 0 },
    down: { y: -60, x: 0 },
    left: { y: 0, x: 60 },
    right: { y: 0, x: -60 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.25, 0.25, 0, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn(
  { children, delay = 0, direction = "left", className = "" }: FadeInProps,
) {
  const directions = {
    up: { y: 100 },
    down: { y: -100 },
    left: { x: -100 },
    right: { x: 100 },
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        ...directions[direction],
      }}
      animate={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({
  children,
  delay = 0,
  className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Stagger(
  { children, className = "" }: { children: ReactNode; className?: string },
) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem(
  { children, className = "" }: { children: ReactNode; className?: string },
) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface TypewriterProps {
  text: string;
  delay?: number;
  speed?: number;
  className?: string;
}

export function Typewriter(
  { text, delay = 0, speed = 50, className = "" }: TypewriterProps,
) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className={className}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: delay + (index * speed) / 1000,
            duration: 0.1,
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
}

export function FloatIn({
  children,
  delay = 0,
  className = "",
  duration = 1.2,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
        filter: "blur(10px)",
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealText({
  children,
  delay = 0,
  className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        clipPath: "inset(0 100% 0 0)",
      }}
      animate={{
        opacity: 1,
        clipPath: "inset(0 0% 0 0)",
      }}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MorphIn({
  children,
  delay = 0,
  className = "",
}: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.6,
        borderRadius: "50%",
        rotate: -180,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        borderRadius: "0.5rem",
        rotate: 0,
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGrid({
  children,
  className = "",
  staggerDelay = 0.08,
}: { children: ReactNode; className?: string; staggerDelay?: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GridItem({
  children,
  className = "",
  index = 0,
}: { children: ReactNode; className?: string; index?: number }) {
  return (
    <motion.div
      variants={{
        hidden: {
          opacity: 0,
          y: 60,
          scale: 0.8,
          filter: "blur(8px)",
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        },
      }}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.05,
      }}
      whileHover={{
        y: -8,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxContainer({
  children,
  className = "",
  offset = 50,
}: { children: ReactNode; className?: string; offset?: number }) {
  return (
    <motion.div
      initial={{ y: offset }}
      animate={{ y: 0 }}
      transition={{
        duration: 1.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileInView={{
        y: 0,
        transition: { duration: 0.8, ease: "easeOut" },
      }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function GlowCard({
  children,
  className = "",
  delay = 0,
}: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.9,
        boxShadow: "0 0 0 rgba(59, 130, 246, 0)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        boxShadow: "0 20px 40px rgba(59, 130, 246, 0.1)",
      }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 25px 50px rgba(59, 130, 246, 0.2)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function TextBurst({
  children,
  delay = 0,
  className = "",
  duration = 1.5,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.3,
        rotate: -180,
        filter: "blur(20px)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        rotate: 0,
        filter: "blur(0px)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Starfield({
  children,
  delay = 0,
  className = "",
  duration = 2.0,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.8,
        filter: "blur(15px) brightness(0.5)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px) brightness(1)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function LightStreak({
  children,
  delay = 0,
  className = "",
  duration = 1.8,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: -100,
        scale: 0.5,
        filter: "blur(10px) brightness(0.3)",
      }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px) brightness(1)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 1, 0.5, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function Disintegrate({
  children,
  delay = 0,
  className = "",
  duration = 1.2,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 1.2,
        filter: "blur(8px)",
        clipPath: "inset(0 0% 0 0)",
      }}
      animate={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        clipPath: "inset(0 0% 0 0)",
      }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxText({
  children,
  delay = 0,
  className = "",
  offset = 100,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  offset?: number;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: offset,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 1.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
