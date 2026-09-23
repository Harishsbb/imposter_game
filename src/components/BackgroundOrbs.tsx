import { motion } from 'framer-motion';

export const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="ambient-orb w-96 h-96 bg-purple-600 top-[-10%] left-[-10%]"
      />
      <motion.div
        animate={{
          x: [0, -40, 50, 0],
          y: [0, 50, -30, 0],
          scale: [1, 1.15, 0.85, 1],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="ambient-orb w-[28rem] h-[28rem] bg-rose-600 bottom-[-10%] right-[-10%]"
      />
      <motion.div
        animate={{
          x: [0, 40, -40, 0],
          y: [0, 30, -50, 0],
          scale: [0.9, 1.1, 1, 0.9],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="ambient-orb w-80 h-80 bg-cyan-600 top-[40%] right-[10%]"
      />
      {/* Subtle grid mesh overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)`,
          backgroundSize: '32px 32px'
        }}
      />
    </div>
  );
};
