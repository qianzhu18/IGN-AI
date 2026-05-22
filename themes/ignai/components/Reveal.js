import { motion } from 'framer-motion'

const MOTION_EASE = [0.22, 1, 0.36, 1]
const MOTION_VIEWPORT = { once: true, amount: 0.18 }

export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  y = 28,
  blur = true
}) {
  const initialFilter = blur
    ? 'brightness(0.72) contrast(0.92) blur(10px)'
    : 'brightness(0.72) contrast(0.92)'
  const finalFilter = blur
    ? 'brightness(1) contrast(1) blur(0px)'
    : 'brightness(1) contrast(1)'
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y, filter: initialFilter }}
      whileInView={{ opacity: 1, y: 0, filter: finalFilter }}
      viewport={MOTION_VIEWPORT}
      transition={{ duration, delay, ease: MOTION_EASE }}
    >
      {children}
    </motion.div>
  )
}
