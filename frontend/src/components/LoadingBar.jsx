import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function LoadingBar({ active }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(active)
  const timers = useRef([])

  function clearTimers() {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }

  useEffect(() => {
    clearTimers()

    if (active) {
      setVisible(true)
      setProgress(8)
      const trickle = () => {
        setProgress((p) => {
          if (p >= 90) return p
          const next = p + Math.max(1, (90 - p) * 0.12)
          timers.current.push(setTimeout(trickle, 280))
          return next
        })
      }
      timers.current.push(setTimeout(trickle, 280))
    } else if (visible) {
      setProgress(100)
      timers.current.push(setTimeout(() => setVisible(false), 320))
    }

    return clearTimers
  }, [active])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 top-0 z-50 h-0.5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 shadow-[0_0_8px_rgba(14,165,233,0.7)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.4 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
