"use client";

import { ReactNode } from "react";
import { motion } from "motion/react";
export function Animated({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.3, 1, 0.8, 1] }}
      transition={{
        duration: 0.8,
        ease: "easeInOut",
        times: [0, 0.2, 0.4, 0.7, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
