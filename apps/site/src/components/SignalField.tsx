'use client'

import { motion, useReducedMotion } from 'framer-motion'

const lines = [
  { delay: 0.05, left: '7%', top: '24%', width: '36%' },
  { delay: 0.12, left: '22%', top: '47%', width: '61%' },
  { delay: 0.19, left: '54%', top: '69%', width: '39%' },
]

export function SignalField() {
  const reducedMotion = useReducedMotion()

  return (
    <div aria-hidden="true" className="signal-field">
      {lines.map((line) => (
        <motion.span
          className="signal-field__line"
          initial={reducedMotion ? false : { opacity: 0, scaleX: 0 }}
          key={`${line.left}-${line.top}`}
          style={{ left: line.left, top: line.top, width: line.width }}
          transition={{ delay: line.delay, duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 0.72, scaleX: 1 }}
        />
      ))}
      {[18, 48, 77].map((left, index) => (
        <motion.span
          className="signal-field__node"
          initial={reducedMotion ? false : { opacity: 0, scale: 0.6 }}
          key={left}
          style={{ left: `${left}%`, top: `${31 + index * 18}%` }}
          transition={{ delay: 0.24 + index * 0.08, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, scale: 1 }}
        />
      ))}
    </div>
  )
}
