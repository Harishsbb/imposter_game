import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { Vote, Check, Shield, AlertCircle, ArrowRight } from 'lucide-react';

export const Voting = () => {
  const {
    players,
    currentVoterIndex,
    castVote,
  } = useGameStore();

  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [hasConfirmedPhone, setHasConfirmedPhone] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const currentVoter = players[currentVoterIndex];
  if (!currentVoter) return null;

  const isLastVoter = currentVoterIndex === players.length - 1;

  const handleConfirmVote = () => {
    if (!selectedTargetId) {
      setErrorMsg('Please select a player to cast your vote!');
      return;
    }

    castVote(selectedTargetId);
    setSelectedTargetId(null);
    setHasConfirmedPhone(false);
    setErrorMsg('');
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
            <Vote size={13} /> Secret Ballot
          </span>
          <span className="text-xs font-bold text-slate-400">
            Vote {currentVoterIndex + 1} of {players.length}
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-black text-white">WHO IS THE IMPOSTOR?</h2>
          <p className="text-xs text-slate-400 mt-1">
            Cast your secret vote for the person you suspect the most
          </p>
        </div>
      </div>

      {/* Main Ballot Card */}
      <div className="my-auto">
        <AnimatePresence mode="wait">
          {!hasConfirmedPhone ? (
            /* --- Privacy Curtain between voters --- */
            <motion.div
              key="pass-curtain"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-8 rounded-3xl border border-white/10 text-center shadow-2xl flex flex-col items-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 border border-rose-500/30">
                <Shield size={28} />
              </div>

              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                Pass Device To
              </span>

              <div className="flex items-center gap-3 mb-3">
                <PlayerAvatar
                  name={currentVoter.name}
                  color={currentVoter.color}
                  avatar={currentVoter.avatar}
                  size="lg"
                />
                <h3 className="text-3xl font-black text-white">{currentVoter.name}</h3>
              </div>

              <p className="text-xs text-slate-300 max-w-xs mb-8">
                Your vote is 100% confidential. Make sure no one else can see your screen.
              </p>

              <button
                onClick={() => setHasConfirmedPhone(true)}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-extrabold text-base tracking-wider shadow-xl shadow-rose-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>I AM {currentVoter.name.toUpperCase()} (VOTE NOW)</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          ) : (
            /* --- Active Player Vote Ballot --- */
            <motion.div
              key="vote-ballot"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card p-6 rounded-3xl border border-rose-500/30 shadow-2xl relative glow-rose"
            >
              {/* Voter identifier */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <PlayerAvatar
                    name={currentVoter.name}
                    color={currentVoter.color}
                    size="sm"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Voting as
                    </span>
                    <span className="text-sm font-extrabold text-white">
                      {currentVoter.name}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-rose-300 font-semibold bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
                  Secret Ballot
                </span>
              </div>

              {/* Player Candidates Selection */}
              <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {players.map((target) => {
                  const isSelected = selectedTargetId === target.id;
                  const isSelf = target.id === currentVoter.id;

                  return (
                    <button
                      key={target.id}
                      type="button"
                      onClick={() => {
                        setSelectedTargetId(target.id);
                        if (errorMsg) setErrorMsg('');
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-rose-950/50 border-rose-500/60 shadow-lg shadow-rose-950/50 scale-[1.01]'
                          : 'bg-slate-900/60 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Radio indicator */}
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-rose-400 bg-rose-500 text-white'
                              : 'border-slate-600 bg-slate-800'
                          }`}
                        >
                          {isSelected && <Check size={12} className="stroke-[3]" />}
                        </div>

                        <PlayerAvatar
                          name={target.name}
                          color={target.color}
                          avatar={target.avatar}
                          size="sm"
                        />

                        <div>
                          <span className="text-sm font-black text-white block">
                            {target.name}
                          </span>
                          {isSelf && (
                            <span className="text-[10px] text-slate-500">
                              (Self vote)
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <span className="text-xs font-bold text-rose-400 px-2 py-0.5 rounded-md bg-rose-500/10 border border-rose-500/20">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-400 font-semibold flex items-center justify-center gap-1.5 mt-3 animate-pulse">
                  <AlertCircle size={14} />
                  <span>{errorMsg}</span>
                </p>
              )}

              {/* Confirm Vote Button */}
              <button
                type="button"
                onClick={handleConfirmVote}
                className="w-full mt-5 py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-base tracking-wider shadow-lg shadow-rose-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95"
              >
                <span>CONFIRM VOTE</span>
                <ArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer hint */}
      <div className="text-center text-xs text-slate-500 mt-4">
        {isLastVoter
          ? 'Final vote of the round! Results will be revealed next.'
          : 'After you vote, you will pass the phone to the next player.'}
      </div>
    </div>
  );
};
