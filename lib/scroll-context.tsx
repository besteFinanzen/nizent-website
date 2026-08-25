"use client";

/*
 * Scroll progress context. The page reports overall scroll progress (0..1) here;
 * consumers (cube, dot nav, scroll progress bar) read it via useScrollProgress().
 */

import { createContext, useContext, useState, type ReactNode } from "react";

const ScrollCtx = createContext<{
  progress: number;
  setProgress: (p: number) => void;
}>({ progress: 0, setProgress: () => {} });

export function ScrollProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  return (
    <ScrollCtx.Provider value={{ progress, setProgress }}>
      {children}
    </ScrollCtx.Provider>
  );
}

export function useScrollProgress() {
  return useContext(ScrollCtx);
}
