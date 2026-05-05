"use client";

import { motion, HTMLMotionProps } from "motion/react";
export function Animated({ children, className, ...props }: HTMLMotionProps<"div">) {
  return <motion.div className={className} {...props}>{children}</motion.div>;
}