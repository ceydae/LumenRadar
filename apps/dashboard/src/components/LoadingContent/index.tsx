"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  blur,
  ReducedMotionConfig,
  transition,
  useTempoTransition,
} from "@animate-ui/react/utils/motion";

export default function LoadingContent({
  loading,
  skeleton,
  children,
  label,
}: {
  loading: boolean;
  skeleton: ReactNode;
  children: ReactNode;
  label: string;
}) {
  const fade = useTempoTransition(transition.fade);
  const reveal = useTempoTransition(transition.reveal);
  return (
    <ReducedMotionConfig>
      <div className="loading-content" aria-busy={loading}>
        <span className="sr-only" role="status">
          {loading ? label : ""}
        </span>
        <AnimatePresence mode="popLayout" initial={false}>
          {loading ? (
            <motion.div
              key="skeleton"
              aria-hidden="true"
              exit={{ opacity: 0, transition: fade }}
            >
              {skeleton}
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, filter: blur.surface }}
              animate={{ opacity: 1, filter: "blur(0px)", transition: reveal }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ReducedMotionConfig>
  );
}
