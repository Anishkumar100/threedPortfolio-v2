import { motion } from 'framer-motion'

// ─── Animation variants ───────────────────────────────────────────────────────
// "initial" = state when page first mounts (invisible, shifted up slightly)
// "animate" = state the page animates TO (fully visible, in position)
// "exit"    = state the page animates TO before unmounting
const variants = {
  initial: {
    opacity: 0,
    y: 18,           // starts 18px below final position — subtle, not jarring
    filter: 'blur(6px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.55,
      ease: [0.25, 0.46, 0.45, 0.94], // custom cubic-bezier — feels "engineered"
    },
  },
  exit: {
    opacity: 0,
    y: -12,          // exits upward — gives directional flow
    filter: 'blur(4px)',
    transition: {
      duration: 0.35,
      ease: [0.55, 0, 1, 0.45],
    },
  },
}

// ─── Component ────────────────────────────────────────────────────────────────
// Wrap every page in this. Children render normally inside.
export default function PageTransition({ children }) {
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      // min-h-screen ensures short pages don't cause layout jumps during transition
      style={{ minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  )
}
