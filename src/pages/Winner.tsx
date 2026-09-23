import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { WORD_EMOJIS, CATEGORY_EMOJIS } from '../data/words';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';
import { RotateCcw, Home, Users, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export const Winner = () => {
  const {
    winner,
    winnerReason,
    activeWord,
    players,
    impostorId,
    clues,
    votes,
    impostorGuess,
    impostorGuessCorrect,
    playAgain,
    resetToHome,
    setPhase,
  } = useGameStore();

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: winner === 'citizens'
          ? ['#10b981', '#06b6d4', '#8b5cf6']
          : ['#f43f5e', '#ec4899', '#f59e0b'],
      });
    } catch (e) {
      console.debug('Confetti error', e);
    }
  }, [winner]);

  if (!activeWord) return null;

  const isCitizenWin = winner === 'citizens';
  const wordEmoji = WORD_EMOJIS[activeWord.word] || CATEGORY_EMOJIS[activeWord.category] || '💡';

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Victory Banner */}
      <div className="text-center my-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="relative inline-block mb-3"
        >
          <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shadow-2xl border border-white/20 ${
            isCitizenWin
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-500 shadow-emerald-500/30'
              : 'bg-gradient-to-tr from-rose-500 to-amber-500 shadow-rose-500/30'
          }`}>
            {isCitizenWin ? '🏆' : '🕵️'}
          </div>
          <div className="absolute -inset-2 rounded-full blur-lg opacity-40 bg-white -z-10" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-black uppercase tracking-widest text-slate-400 block mb-1">
            Victory Declared
          </span>
          <h2 className={`text-4xl font-black tracking-tight ${
            isCitizenWin ? 'text-emerald-400' : 'text-rose-400'
          }`}>
            {isCitizenWin ? 'CITIZENS WIN!' : 'IMPOSTOR WINS!'}
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-sm mx-auto mt-2 px-2">
            {winnerReason}
          </p>
        </motion.div>
      </div>

      {/* Secret Word & Final Guess Card */}
      <div className="space-y-4 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 rounded-3xl border border-white/10 text-center relative overflow-hidden"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 block mb-1">
            The Secret Word Was
          </span>

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-3xl">{wordEmoji}</span>
            <h3 className="text-3xl font-black text-white tracking-wider uppercase">
              {activeWord.word}
            </h3>
          </div>

          <span className="text-xs text-slate-400">
            Category: <strong className="text-slate-200">{activeWord.category}</strong>
          </span>

          {/* If impostor made a guess */}
          {impostorGuess && (
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-center gap-2 text-xs">
              <span className="text-slate-400">
                Impostor's Guess: <strong className="text-white">"{impostorGuess}"</strong>
              </span>
              {impostorGuessCorrect ? (
                <span className="text-emerald-400 font-extrabold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 size={13} /> Correct!
                </span>
              ) : (
                <span className="text-rose-400 font-extrabold flex items-center gap-1 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30">
                  <XCircle size={13} /> Incorrect!
                </span>
              )}
            </div>
          )}
        </motion.div>

        {/* Full Player Recap Board */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-4 rounded-3xl border border-white/10"
        >
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 px-1">
            <Sparkles size={13} className="text-purple-400" />
            Game Recap & Roles
          </h4>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {players.map((p) => {
              const isThisImpostor = p.id === impostorId;
              const playerClue = clues.find((c) => c.playerId === p.id);
              const voteTargetId = votes[p.id];
              const votedFor = players.find((t) => t.id === voteTargetId);

              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    isThisImpostor
                      ? 'bg-rose-950/30 border-rose-500/40'
                      : 'bg-slate-900/60 border-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <PlayerAvatar
                      name={p.name}
                      color={p.color}
                      avatar={isThisImpostor ? '🕵️' : p.avatar}
                      size="sm"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-white">{p.name}</span>
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${
                            isThisImpostor
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isThisImpostor ? 'Impostor' : 'Citizen'}
                        </span>
                      </div>
                      {votedFor && (
                        <span className="text-[10px] text-slate-400">
                          Voted for: {votedFor.name}
                        </span>
                      )}
                    </div>
                  </div>

                  {playerClue && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 block">Clue</span>
                      <span className="font-bold text-purple-300">
                        "{playerClue.clue}"
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="space-y-2.5 mt-4"
      >
        <button
          onClick={() => playAgain(true)}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wider shadow-xl shadow-purple-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
        >
          <RotateCcw size={19} />
          <span>PLAY AGAIN (NEW WORD)</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => setPhase('lobby')}
            className="flex-1 py-3 px-4 rounded-xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs tracking-wider transition-all border border-white/10 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Users size={15} />
            <span>CHANGE PLAYERS</span>
          </button>

          <button
            onClick={resetToHome}
            className="flex-1 py-3 px-4 rounded-xl glass-card hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs tracking-wider transition-all border border-white/10 flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Home size={15} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
