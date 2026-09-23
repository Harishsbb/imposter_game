import { useState } from 'react';
import type { FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { motion } from 'framer-motion';
import { KeyRound, Sparkles, AlertCircle, ArrowRight, HelpCircle } from 'lucide-react';

export const FinalGuess = () => {
  const {
    players,
    impostorId,
    activeWord,
    clues,
    submitFinalGuess,
  } = useGameStore();

  const [guessInput, setGuessInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showClues, setShowClues] = useState(true);

  const impostor = players.find((p) => p.id === impostorId);
  if (!impostor || !activeWord) return null;

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = guessInput.trim();

    if (!trimmed) {
      setErrorMsg('Please enter your guess for the secret word!');
      return;
    }

    setErrorMsg('');
    submitFinalGuess(trimmed);
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20 flex items-center gap-1.5">
            <KeyRound size={13} /> The Impostor's Last Stand
          </span>
          <span className="text-xs font-bold text-slate-400">
            Category: {activeWord.category}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-amber-300 tracking-wider">
            ONE LAST CHANCE
          </h2>
          <p className="text-sm font-semibold text-white mt-1">
            What was the secret word?
          </p>
        </div>
      </div>

      {/* Main Guess Card */}
      <div className="space-y-5 my-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl border border-amber-500/30 text-center shadow-2xl relative glow-amber"
        >
          {/* Impostor Identity Header */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <PlayerAvatar
              name={impostor.name}
              color={impostor.color}
              avatar="🕵️"
              size="md"
            />
            <div className="text-left">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                The Impostor
              </span>
              <h3 className="text-xl font-black text-white">{impostor.name}</h3>
            </div>
          </div>

          <p className="text-xs text-slate-300 max-w-sm mx-auto mb-6 leading-relaxed">
            You were identified, but you can still <strong>steal the win</strong> if you can guess the Citizens' secret word!
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter word..."
                value={guessInput}
                onChange={(e) => {
                  setGuessInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                autoFocus
                maxLength={30}
                className="w-full glass-input px-4 py-4 rounded-2xl text-center font-black text-xl text-white placeholder-slate-500 border border-white/20 focus:border-amber-400 shadow-inner tracking-wide uppercase"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Single guess only • Spelling counts
              </span>
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-slate-950 font-black text-base tracking-wider shadow-lg shadow-amber-500/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>MAKE FINAL GUESS</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>

        {/* Clues Review Cheat Sheet */}
        <div className="glass-card p-4 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles size={13} className="text-amber-400" />
              Clue Memory Aid
            </span>
            <button
              onClick={() => setShowClues(!showClues)}
              className="text-[11px] text-amber-400 hover:underline font-semibold"
            >
              {showClues ? 'Hide Clues' : 'Show Clues'}
            </button>
          </div>

          {showClues && (
            <div className="grid grid-cols-2 gap-2 pt-1 max-h-36 overflow-y-auto">
              {clues.map((c) => (
                <div
                  key={c.playerId}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-white/5 text-xs"
                >
                  <span className="text-slate-400 truncate mr-1">{c.playerName}:</span>
                  <span className="font-extrabold text-amber-200 truncate">
                    "{c.clue}"
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-slate-500 mt-4 flex items-center justify-center gap-1">
        <HelpCircle size={13} />
        <span>Correct guess = Impostor Wins • Incorrect = Citizens Win</span>
      </div>
    </div>
  );
};
