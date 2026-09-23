import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { WORD_EMOJIS, CATEGORY_EMOJIS } from '../data/words';
import { playSecretRevealSound } from '../utils/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldCheck, Lock, ChevronRight, User } from 'lucide-react';

export const SecretRoleReveal = () => {
  const {
    players,
    currentRoleRevealIndex,
    activeWord,
    impostorId,
    nextRoleReveal,
    soundEnabled,
    settings,
  } = useGameStore();

  const [isRevealed, setIsRevealed] = useState(false);

  const currentPlayer = players[currentRoleRevealIndex];
  if (!currentPlayer || !activeWord) return null;

  const isImpostor = currentPlayer.id === impostorId;
  const isLastPlayer = currentRoleRevealIndex === players.length - 1;

  const handleReveal = () => {
    setIsRevealed(true);
    playSecretRevealSound(isImpostor, soundEnabled);
  };

  const handleNext = () => {
    setIsRevealed(false);
    nextRoleReveal();
  };

  const wordEmoji = WORD_EMOJIS[activeWord.word] || CATEGORY_EMOJIS[activeWord.category] || '💡';

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Progress header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          Secret Role Reveal
        </span>
        <span className="text-xs font-bold text-slate-400">
          Player {currentRoleRevealIndex + 1} of {players.length}
        </span>
      </div>

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center my-4">
        <AnimatePresence mode="wait">
          {!isRevealed ? (
            /* --- Privacy Curtain (Hidden state) --- */
            <motion.div
              key="hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full glass-card p-8 rounded-3xl border border-white/10 text-center shadow-2xl flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-5 border border-purple-500/30">
                <Lock size={32} />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Pass Device To
              </span>

              <div className="flex items-center gap-3 mb-4">
                <PlayerAvatar
                  name={currentPlayer.name}
                  color={currentPlayer.color}
                  avatar={currentPlayer.avatar}
                  size="lg"
                />
                <h3 className="text-3xl font-black text-white">{currentPlayer.name}</h3>
              </div>

              <p className="text-sm text-slate-300 max-w-xs mb-8">
                Make sure no one else is looking at the screen before tapping to reveal!
              </p>

              <button
                onClick={handleReveal}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wider shadow-lg shadow-purple-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <Eye size={20} />
                <span>TAP TO REVEAL ROLE</span>
              </button>
            </motion.div>
          ) : (
            /* --- Revealed State --- */
            <motion.div
              key="revealed"
              initial={{ opacity: 0, scale: 0.95, rotateY: 90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className={`w-full glass-card p-8 rounded-3xl border text-center shadow-2xl flex flex-col items-center relative overflow-hidden ${
                isImpostor
                  ? 'border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900/90 glow-rose'
                  : 'border-purple-500/40 bg-gradient-to-b from-purple-950/40 to-slate-900/90 glow-purple'
              }`}
            >
              {/* Top player badge */}
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold mb-6">
                <User size={13} />
                <span>{currentPlayer.name}'s Secret Role</span>
              </div>

              {isImpostor ? (
                /* --- Impostor Screen --- */
                <div className="space-y-4 py-2 flex flex-col items-center">
                  <div className="text-6xl mb-2 animate-bounce">🕵️</div>

                  <h3 className="text-3xl font-black text-rose-400 tracking-wide m-0">
                    YOU ARE THE IMPOSTOR
                  </h3>

                  <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/30 max-w-xs text-center w-full">
                    <p className="text-sm font-semibold text-rose-200 mb-2">
                      You don't know the secret word.
                    </p>

                    {settings.showImpostorHint ? (
                      <div className="bg-black/30 p-2.5 rounded-xl border border-amber-500/20">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300">Category Hint:</span>
                          <span className="font-extrabold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/40">
                            {activeWord.category}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-black/40 p-2.5 rounded-xl border border-rose-500/20 text-xs">
                        <div className="flex items-center justify-center gap-1.5 text-rose-300/80 font-bold">
                          <span>🔒 Category Hint: Hidden</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Hardcore mode is ON: Guess purely from others' clues!
                        </p>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Blend in! Listen carefully to other players' clues, enter a plausible clue of your own, and guess the word if exposed!
                  </p>
                </div>
              ) : (
                /* --- Citizen Screen --- */
                <div className="space-y-3 py-2 flex flex-col items-center">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-purple-300">
                    YOUR WORD
                  </span>

                  <div className="text-7xl my-2 filter drop-shadow-lg">
                    {wordEmoji}
                  </div>

                  <h3 className="text-4xl font-black text-white tracking-wider uppercase m-0">
                    {activeWord.word}
                  </h3>

                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Category: {activeWord.category}
                  </span>

                  <p className="text-xs text-slate-300 max-w-xs mt-2 leading-relaxed">
                    Give a subtle clue during the clue phase to show other citizens you know the word without revealing it to the impostor!
                  </p>
                </div>
              )}

              {/* Dismiss & Pass button */}
              <div className="w-full mt-8 pt-4 border-t border-white/10">
                <button
                  onClick={handleNext}
                  className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base tracking-wider text-white shadow-xl transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95 ${
                    isImpostor
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-600/30'
                  }`}
                >
                  <EyeOff size={18} />
                  <span>
                    {isLastPlayer ? 'START CLUE PHASE' : "I'VE GOT IT! HIDE & PASS"}
                  </span>
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Security reminder */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck size={14} className="text-purple-400" />
        <span>Privacy protection active: Keep the screen shielded from friends</span>
      </div>
    </div>
  );
};
