import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { Play, BookOpen, Users, Sparkles, ShieldAlert, Award } from 'lucide-react';

export const Home = () => {
  const { setPhase } = useGameStore();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full text-center relative z-10">
      {/* Spy Badge Animation */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="relative mb-6"
      >
        <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-rose-500 p-[2px] shadow-2xl shadow-purple-500/30">
          <div className="w-full h-full bg-slate-950 rounded-3xl flex items-center justify-center text-6xl shadow-inner relative overflow-hidden">
            <span className="relative z-10">🕵️</span>
            {/* Spotlight reflection */}
            <motion.div
              animate={{ x: [-100, 150] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 1 }}
              className="absolute inset-0 w-12 h-full bg-white/10 skew-x-12"
            />
          </div>
        </div>

        {/* Glow pill behind */}
        <div className="absolute -inset-4 bg-purple-500/20 rounded-full blur-xl -z-10 animate-pulse" />
      </motion.div>

      {/* Hero Title */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-2 mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tight text-white m-0">
          IMPOSTOR
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-200 to-cyan-300">
          Can you find the liar?
        </p>
        <p className="text-sm text-slate-400 max-w-xs mx-auto pt-1">
          A thrilling pass-and-play social deduction party game for 3 to 12 players on a single phone.
        </p>
      </motion.div>

      {/* Feature Badges */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex flex-wrap justify-center gap-2 mb-10 max-w-sm"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-purple-300">
          <Users size={13} /> 3–12 Players
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-cyan-300">
          <Sparkles size={13} /> 200 Words
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-rose-300">
          <ShieldAlert size={13} /> 1 Impostor
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800/80 border border-slate-700/80 text-amber-300">
          <Award size={13} /> Pass & Play
        </span>
      </motion.div>

      {/* Primary Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="w-full space-y-3.5 max-w-sm"
      >
        <button
          onClick={() => setPhase('create-game')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-lg tracking-wide shadow-xl shadow-purple-600/30 hover:shadow-purple-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-3 border border-white/20"
        >
          <Play size={22} className="fill-white" />
          <span>CREATE GAME</span>
        </button>

        <button
          onClick={() => setPhase('how-to-play')}
          className="w-full py-3.5 px-6 rounded-2xl glass-card hover:bg-slate-800/80 text-slate-200 hover:text-white font-bold text-base tracking-wide border border-white/10 hover:border-purple-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2.5"
        >
          <BookOpen size={19} className="text-purple-400" />
          <span>HOW TO PLAY</span>
        </button>
      </motion.div>

      {/* Footer subtle tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-xs text-slate-500 flex items-center gap-1.5"
      >
        <span>💡</span>
        <span>Pass the phone between friends. No internet connection needed!</span>
      </motion.div>
    </div>
  );
};
