"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedJoinButtonProps extends Omit<React.ComponentProps<typeof motion.button>, "children"> {
  label?: string;
}

export function AnimatedJoinButton({ label = "Join Queue", className, ...props }: AnimatedJoinButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative inline-flex items-center gap-2 px-4 py-2 rounded-lg",
        "text-white font-medium",
        "bg-gradient-to-r from-sky-600 to-blue-600",
        "hover:from-sky-500 hover:to-blue-500",
        "ring-1 ring-sky-500/20 shadow-[0_10px_30px_-10px_rgba(56,189,248,0.6)]",
        "transition-all duration-200",
        className
      )}
      {...props}>
      <span className="relative z-10">{label}</span>
      <span className="pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
    </motion.button>
  );
}


