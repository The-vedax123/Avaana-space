import { motion } from 'framer-motion';
import { LogoMark } from '../components/ui/Logo.jsx';

export default function Splash() {
  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-secondary"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 animate-blob rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-80 w-80 animate-blob rounded-full bg-brand-400/20 blur-3xl [animation-delay:3s]" />
      </div>

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        <motion.div
          animate={{ boxShadow: ['0 0 0px rgba(31,166,184,0)', '0 0 80px rgba(31,166,184,0.6)', '0 0 0px rgba(31,166,184,0)'] }}
          transition={{ duration: 2.2, repeat: Infinity }}
          className="rounded-3xl"
        >
          <LogoMark size={92} />
        </motion.div>
      </motion.div>

      <motion.h1
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-8 font-display text-3xl font-extrabold tracking-tight text-white"
      >
        Avaana<span className="text-accent">Space</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="mt-2 text-sm font-medium uppercase tracking-[0.35em] text-brand-200"
      >
        Accessible Discovery
      </motion.p>
    </motion.div>
  );
}
