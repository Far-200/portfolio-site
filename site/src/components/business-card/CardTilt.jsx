import { motion as Motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";

// Motion values write transforms directly; pointer movement never renders React.
// The same spring values also feed a few CSS variables (shadow offset, sheen position),
// so the light and shadow settle with the card instead of running on their own clock.
export default function CardTilt({ expanded, children }) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(-1.2);
  const spring = { stiffness: 170, damping: 25 };
  const rotateX = useSpring(x, spring);
  const rotateY = useSpring(y, spring);
  const rotateZ = useSpring(z, spring);
  // The shadow leans a few pixels away from the raised edge and softens a touch as the card tips.
  const shadowX = useTransform(rotateY, (v) => `${(-v * 2.4).toFixed(2)}px`);
  const shadowY = useTransform(rotateX, (v) => `${(v * 2.4).toFixed(2)}px`);
  const tilt = useTransform([rotateX, rotateY], ([a, b]) => Math.hypot(a, b));
  const tiltMagnitude = useTransform(tilt, (m) => m.toFixed(3));
  const shadowScale = useTransform(tilt, (m) => (1 + m * 0.01).toFixed(4));
  const sheenX = useTransform(rotateY, (v) => `${(50 + v * 20).toFixed(1)}%`);
  const sheenY = useTransform(rotateX, (v) => `${(38 - v * 20).toFixed(1)}%`);
  const reset = () => { x.set(0); y.set(0); z.set(-1.2); };
  // Expanded and reduced-motion cards stay flat: no transform and no light variables (the CSS defaults apply).
  const flat = expanded || reduced;
  const style = flat
    ? { rotateX: 0, rotateY: 0, rotateZ: 0 }
    : { rotateX, rotateY, rotateZ, "--shx": shadowX, "--shy": shadowY, "--shs": shadowScale, "--tilt-m": tiltMagnitude, "--lx": sheenX, "--ly": sheenY };
  return (
    <Motion.div className="card-tilt" style={style}
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
