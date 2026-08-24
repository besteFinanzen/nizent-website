"use client";

import { motion } from "framer-motion";

export default function ScrollProgress({ progress }: { progress: number }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px]">
      <motion.div
        className="h-full bg-cyan origin-left"
        style={{ scaleX: progress }}
      />
    </div>
  );
}
