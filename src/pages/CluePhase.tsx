import { useState } from 'react';
import type { FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, AlertCircle, Lock, ArrowRight } from 'lucide-react';

export const CluePhase = () => {
  const {
    players,
    currentCluePlayerIndex,
    clues,
    submitClue,
  } = useGameStore();

  const [clueInput, setClueInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const currentPlayer = players[currentCluePlayerIndex];
  if (!currentPlayer) return null;

  const isLastPlayer = currentCluePlayerIndex === players.length - 1;

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = clueInput.trim();

    if (!trimmed) {
      setErrorMessage('Clue cannot be empty! Enter at least one word.');
      return;
    }

    if (trimmed.length > 40) {
      setErrorMessage('Keep your clue concise (max 40 characters).');
      return;
    }

    setErrorMessage('');
    submitClue(trimmed);
    setClueInput('');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 flex items-center gap-1.5">
            <MessageSquare size={13} /> Clue Phase
          </span>
          <span className="text-xs font-bold text-slate-400">
            Turn {currentCluePlayerIndex + 1} of {players.length}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white">Give Your Clue</h2>
          <p className="text-xs text-slate-400 mt-1">
            Give a 1-word or short clue related to your secret role
          </p>
        </div>
      </div>

      {/* Active Player Input Card */}
      <div className="my-auto">
        <motion.div
          key={currentPlayer.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 rounded-3xl border border-purple-500/30 text-center shadow-2xl relative overflow-hidden mb-6 glow-purple"
        >
          {/* Active Turn Banner */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <PlayerAvatar
              name={currentPlayer.name}
              color={currentPlayer.color}
              avatar={currentPlayer.avatar}
              size="md"
            />
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-300 block">
                It's your turn
              </span>
              <h3 className="text-xl font-black text-white">{currentPlayer.name}</h3>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Enter 1-word clue (e.g. Cheese, Fast, Heavy)..."
                value={clueInput}
                onChange={(e) => {
                  setClueInput(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                maxLength={40}
                autoFocus
                className="w-full glass-input px-4 py-3.5 rounded-2xl text-center font-bold text-lg text-white placeholder-slate-500 border border-white/15 focus:border-purple-500 shadow-inner"
              />
              <div className="flex justify-between items-center text-[11px] text-slate-500 mt-1.5 px-2">
                <span>Rule: Clues cannot be edited once sent</span>
                <span>{clueInput.length}/40</span>
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 animate-pulse">
                <AlertCircle size={14} />
                <span>{errorMessage}</span>
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wider shadow-lg shadow-purple-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>{isLastPlayer ? 'FINISH & START DISCUSSION' : 'SUBMIT CLUE & PASS'}</span>
              {isLastPlayer ? <ArrowRight size={18} /> : <Send size={18} />}
            </button>
          </form>
        </motion.div>

        {/* Submitted Clues Feed */}
        {clues.length > 0 && (
          <div className="glass-card p-4 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400 px-1 font-bold">
              <span>Submitted Clues ({clues.length})</span>
              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                <Lock size={12} /> Locked
              </span>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
              <AnimatePresence>
                {clues.map((c, idx) => (
                  <motion.div
                    key={c.playerId + idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-white/5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 w-4 text-center">
                        {c.order}.
                      </span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: c.playerColor }}
                      />
                      <span className="text-xs font-bold text-slate-200">
                        {c.playerName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">→</span>
                      <span className="text-xs font-extrabold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-lg border border-purple-500/20">
                        "{c.clue}"
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>

      {/* Helpful tip */}
      <div className="mt-4 text-center text-xs text-slate-500">
        💡 Pass the device to the player whose name is on the card.
      </div>
    </div>
  );
};
