import { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { playTickSound } from '../utils/soundEffects';
import { motion } from 'framer-motion';
import { Users, Timer, Play, Pause, Vote, Sparkles } from 'lucide-react';

export const Discussion = () => {
  const { clues, settings, startVoting, soundEnabled } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(settings.discussionTimerSeconds || 60);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        if (prev <= 6 && prev > 1) {
          playTickSound(soundEnabled);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeLeft, soundEnabled]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const progressPercent = Math.max(0, (timeLeft / (settings.discussionTimerSeconds || 60)) * 100);

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
            <Users size={13} /> Discussion Phase
          </span>
          <span className="text-xs font-bold text-slate-400">
            Debate & Cross-Examine
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-white">Who Is The Impostor?</h2>
          <p className="text-xs text-slate-400 mt-1">
            Compare all submitted clues below and question anyone acting suspicious!
          </p>
        </div>
      </div>

      {/* Discussion Board and Clues */}
      <div className="space-y-5 my-auto">
        {/* Countdown Timer Card */}
        <div className="glass-card p-4 rounded-3xl border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg border ${
              timeLeft <= 10
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
            }`}>
              <Timer size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-black tracking-wider ${
                  timeLeft <= 10 ? 'text-rose-400 animate-pulse' : 'text-white'
                }`}>
                  {timeFormatted}
                </span>
                {timeLeft === 0 && (
                  <span className="text-xs font-bold text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full">
                    Time's Up!
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400">Discussion Timer</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-white/5 active:scale-95"
              title={isPaused ? 'Resume Timer' : 'Pause Timer'}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              onClick={() => setTimeLeft(settings.discussionTimerSeconds || 60)}
              className="text-xs px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-all border border-white/5 active:scale-95"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Timer Bar */}
        <div className="w-full bg-slate-850 h-1.5 rounded-full overflow-hidden bg-slate-800">
          <motion.div
            className={`h-full ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-gradient-to-r from-purple-500 to-amber-400'}`}
            style={{ width: `${progressPercent}%` }}
            transition={{ ease: 'linear' }}
          />
        </div>

        {/* All Clues Grid */}
        <div className="glass-card p-5 rounded-3xl border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles size={13} className="text-purple-400" />
            All Player Clues
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
            {clues.map((c) => (
              <motion.div
                key={c.playerId}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-white/5 hover:border-purple-500/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <PlayerAvatar
                    name={c.playerName}
                    color={c.playerColor}
                    size="sm"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    {c.playerName}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-xs font-black text-purple-300 bg-purple-500/15 px-2.5 py-1 rounded-xl border border-purple-500/30 shadow-sm">
                    "{c.clue}"
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Discussion Prompt / Icebreaker */}
        <div className="p-3.5 rounded-2xl bg-purple-950/20 border border-purple-500/20 text-center">
          <p className="text-xs text-purple-200">
            💬 <strong>Discussion Tip:</strong> Look closely at generic clues. The Impostor usually plays it very safe!
          </p>
        </div>
      </div>

      {/* Start Voting Button */}
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
        <button
          onClick={startVoting}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-lg tracking-wider shadow-xl shadow-rose-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 mt-4"
        >
          <Vote size={22} />
          <span>START VOTING</span>
        </button>
      </motion.div>
    </div>
  );
};
