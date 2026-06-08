import { motion } from 'framer-motion'

export default function Spinner({ label = 'Loading flights...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-16 shadow-sm">
      <motion.span
        className="h-10 w-10 rounded-full border-[3px] border-slate-200 border-t-sky-600"
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
      />
      {label && (
        <motion.span
          className="text-sm font-medium tracking-wide text-slate-500"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          {label}
        </motion.span>
      )}
    </div>
  )
}
