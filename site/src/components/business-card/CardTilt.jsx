import { motion as Motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

// Motion values write transforms directly; pointer movement never renders React.
export default function CardTilt({ expanded, children }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(-1.2);
  const spring = { stiffness: 170, damping: 25 };
  const rotateX = useSpring(x, spring);
  const rotateY = useSpring(y, spring);
  const rotateZ = useSpring(z, spring);
  const reset = () => { x.set(0); y.set(0); z.set(-1.2); };
  return (
    <Motion.div className="card-tilt" style={expanded || reduced ? { rotateX: 0, rotateY: 0, rotateZ: 0 } : { rotateX, rotateY, rotateZ }}
      onPointerMove={(event) => {
        if (expanded || reduced || event.pointerType !== "mouse" || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
        const rect = event.currentTarget.getBoundingClientRect();
        x.set((0.5 - (event.clientY - rect.top) / rect.height) * 3);
        y.set(((event.clientX - rect.left) / rect.width - 0.5) * 3);
        z.set(0);
      }}
      onPointerLeave={reset} onPointerCancel={reset}
      onFocusCapture={() => { x.set(0); y.set(0); z.set(0); }}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) reset(); }}
    >{children}</Motion.div>
  );
}
