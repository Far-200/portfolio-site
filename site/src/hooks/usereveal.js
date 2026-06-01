// Shared scroll-reveal hook — used across all section components
import { useRef } from "react";
import { useInView } from "framer-motion";

export function useReveal(options = {}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.12, ...options });
  return { ref, isInView };
}
