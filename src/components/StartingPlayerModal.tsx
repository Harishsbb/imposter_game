import type { Player } from '../types/game';
import { PlayerAvatar } from './PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Dices, Sparkles, X, ShieldCheck, ChevronRight } from 'lucide-react';

interface StartingPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onSelectStarter: (starterId: string | 'random') => void;
  selectedStarterId?: string | null;
}

export const StartingPlayerModal = ({
  isOpen,
  onClose,
  players,
  onSelectStarter,
  selectedStarterId = null,
}: StartingPlayerModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.93, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.93, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 22, stiffness: 320 }}
          className="relative z-10 glass-card max-w-lg w-full max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 p-6 shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                  <Sparkles size={12} className="text-purple-400" />
                  Round Starter
                </span>
              </div>
              <h3 className="text-xl font-black text-white tracking-wide">
                Who Starts The Round?
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Choose who speaks the first clue aloud, or let fate decide!
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors active:scale-95"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>
          </div>

          <div className="py-4 space-y-4">
            {/* Citizen Safety Note */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-500/20 text-[11px] text-purple-200">
              <ShieldCheck size={16} className="text-purple-400 flex-shrink-0" />
              <span>
                The starting player can be a <strong> Citizen or Impostor </strong> So be careful while revel your seceret word.
              </span>
            </div>

            {/* Option 1: Random Player Card */}
            <div>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSelectStarter('random')}
                className={`w-full p-4 rounded-2xl text-left transition-all border flex items-center justify-between group ${selectedStarterId === 'random' || selectedStarterId === null
                    ? 'bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-slate-900 border-purple-500/50 shadow-lg shadow-purple-900/30'
                    : 'bg-slate-800/60 hover:bg-slate-800 border-white/10 hover:border-purple-500/30'
                  }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/40 flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Dices size={24} className="group-hover:rotate-12 transition-transform" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-white">
                        Random Player
                      </h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        Surprise Me 🎲
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Randomly select any player to start this round
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-purple-300 group-hover:translate-x-1 transition-transform">
                  <span>Start</span>
                  <ChevronRight size={16} />
                </div>
              </motion.button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Or Pick Who Starts
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Option 2: Player Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[36vh] overflow-y-auto pr-1">
              {players.map((p, idx) => {
                const isSelected = selectedStarterId === p.id;
                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectStarter(p.id)}
                    className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all ${isSelected
                        ? 'bg-purple-600/20 border-purple-500 shadow-md shadow-purple-600/20'
                        : 'bg-slate-800/40 hover:bg-slate-800 border-white/10 hover:border-white/20'
                      }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <PlayerAvatar
                        name={p.name}
                        color={p.color}
                        avatar={p.avatar}
                        size="sm"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-white truncate">
                            {p.name}
                          </span>
                          {idx === 0 && (
                            <span className="text-[9px] font-bold text-slate-400 bg-white/5 px-1.5 py-0.2 rounded">
                              P1
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 block">
                          Starts round as Citizen
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-white flex-shrink-0">
                      <span>Select</span>
                      <ChevronRight size={14} />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel & Return to Lobby
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
