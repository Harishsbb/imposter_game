import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { PlayerAvatar } from '../components/PlayerAvatar';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, UserX, Skull, ArrowRight, Sparkles } from 'lucide-react';

export const RevealImpostor = () => {
  const {
    players,
    votes,
    eliminatedPlayerId,
    impostorId,
    proceedFromReveal,
  } = useGameStore();

  const [isRevealed, setIsRevealed] = useState(false);

  // Compute vote counts for display
  const voteCounts: Record<string, number> = {};
  players.forEach((p) => {
    voteCounts[p.id] = 0;
  });
  Object.values(votes).forEach((targetId) => {
    voteCounts[targetId] = (voteCounts[targetId] || 0) + 1;
  });

  const eliminatedPlayer = players.find((p) => p.id === eliminatedPlayerId);
  const isImpostor = eliminatedPlayerId === impostorId;

  const totalVotesCast = Object.keys(votes).length;

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 flex-1 flex flex-col justify-between relative z-10">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 flex items-center gap-1.5">
            <UserX size={13} /> Voting Results
          </span>
          <span className="text-xs font-bold text-slate-400">
            {totalVotesCast} Votes Tallied
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-white">The Tribe Has Spoken</h2>
          <p className="text-xs text-slate-400 mt-1">
            See how everyone voted and find out who is eliminated
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 my-auto">
        {/* Vote Breakdown Cards */}
        <div className="glass-card p-5 rounded-3xl border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Sparkles size={13} className="text-purple-400" />
            Vote Tally
          </h3>

          <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
            {players
              .slice()
              .sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0))
              .map((p) => {
                const count = voteCounts[p.id] || 0;
                const isEliminated = p.id === eliminatedPlayerId;
                const percentage = totalVotesCast > 0 ? (count / totalVotesCast) * 100 : 0;

                return (
                  <div
                    key={p.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      isEliminated
                        ? 'bg-rose-950/40 border-rose-500/50 glow-rose'
                        : 'bg-slate-900/60 border-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar
                          name={p.name}
                          color={p.color}
                          avatar={p.avatar}
                          size="sm"
                        />
                        <span className="text-sm font-bold text-white">
                          {p.name}
                        </span>
                        {isEliminated && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-rose-400 bg-rose-500/20 px-2 py-0.5 rounded-full border border-rose-500/30">
                            Eliminated
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-black text-purple-300">
                        {count} {count === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>

                    {/* Vote percentage bar */}
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full ${
                          isEliminated
                            ? 'bg-gradient-to-r from-rose-500 to-red-500'
                            : 'bg-gradient-to-r from-purple-500 to-indigo-500'
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Dramatic Role Reveal Card */}
        {eliminatedPlayer && (
          <AnimatePresence mode="wait">
            {!isRevealed ? (
              <motion.div
                key="unrevealed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card p-6 rounded-3xl border border-rose-500/30 text-center shadow-2xl relative overflow-hidden"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-500/30">
                  <Skull size={28} />
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1 block">
                  Most Suspected Player
                </span>
                <h3 className="text-2xl font-black text-white mb-2">
                  {eliminatedPlayer.name} is Eliminated!
                </h3>
                <p className="text-xs text-slate-300 mb-6">
                  Are they the crafty Impostor, or did you eliminate an innocent Citizen?
                </p>

                <button
                  onClick={() => setIsRevealed(true)}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-black text-base tracking-wider shadow-lg shadow-rose-600/30 transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95 animate-pulse"
                >
                  <span>REVEAL SECRET IDENTITY</span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="revealed"
                initial={{ opacity: 0, scale: 0.9, rotateX: 90 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                transition={{ duration: 0.4 }}
                className={`glass-card p-6 rounded-3xl border text-center shadow-2xl relative overflow-hidden ${
                  isImpostor
                    ? 'border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-900/90 glow-emerald'
                    : 'border-rose-500/40 bg-gradient-to-b from-rose-950/40 to-slate-900/90 glow-rose'
                }`}
              >
                <div className="text-6xl mb-3">
                  {isImpostor ? '🕵️' : '😱'}
                </div>

                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block mb-1">
                  Identity Unmasked
                </span>

                <h3 className={`text-2xl font-black tracking-wide mb-2 ${
                  isImpostor ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {isImpostor
                    ? `${eliminatedPlayer.name} WAS THE IMPOSTOR!`
                    : `${eliminatedPlayer.name} WAS AN INNOCENT CITIZEN!`}
                </h3>

                <p className="text-xs text-slate-300 max-w-xs mx-auto mb-6">
                  {isImpostor
                    ? 'Great deduction, Citizens! But wait... the Impostor still has ONE LAST CHANCE to guess the secret word!'
                    : 'Disaster! You eliminated your fellow citizen! The Impostor escaped unnoticed and wins the game!'}
                </p>

                <button
                  onClick={proceedFromReveal}
                  className={`w-full py-4 px-6 rounded-2xl font-black text-base tracking-wider text-white shadow-xl transition-all border border-white/20 flex items-center justify-center gap-2 active:scale-95 ${
                    isImpostor
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/30'
                      : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 shadow-rose-600/30'
                  }`}
                >
                  <ShieldAlert size={18} />
                  <span>
                    {isImpostor ? 'PROCEED TO FINAL GUESS' : 'VIEW WINNER ANNOUNCEMENT'}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="text-center text-xs text-slate-500 mt-4">
        {isImpostor
          ? 'The Impostor was identified by majority vote.'
          : 'Citizens must agree on the actual suspect next time.'}
      </div>
    </div>
  );
};
