import { useGameStore } from '../store/gameStore';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, ShieldAlert, KeyRound, MessageSquare, Vote, Trophy, HelpCircle } from 'lucide-react';

interface HowToPlayProps {
  onBack?: () => void;
  isModal?: boolean;
}

export const HowToPlay = ({ onBack, isModal = false }: HowToPlayProps) => {
  const { setPhase } = useGameStore();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setPhase('home');
    }
  };

  const steps = [
    {
      step: '1',
      title: 'Secret Role Reveal',
      icon: <KeyRound size={22} className="text-purple-400" />,
      desc: 'Pass the device to each player. Citizens receive the Secret Word (e.g. "Pizza"). The Impostor only sees "YOU ARE THE IMPOSTOR" and has NO idea what the word is!',
    },
    {
      step: '2',
      title: 'Give One Clue',
      icon: <MessageSquare size={22} className="text-cyan-400" />,
      desc: 'Each player in turn enters a 1-word or short clue related to the secret word. Be careful: make your clue subtle enough so the Impostor cannot easily guess the word, but clear enough so Citizens know you are innocent!',
    },
    {
      step: '3',
      title: 'Discussion & Debate',
      icon: <Users size={22} className="text-amber-400" />,
      desc: 'Review all submitted clues together on screen. Notice who hesitated, whose clue was too vague, or who repeated someone else\'s idea!',
    },
    {
      step: '4',
      title: 'Vote Out the Suspect',
      icon: <Vote size={22} className="text-rose-400" />,
      desc: 'Each player casts a secret vote for the person they suspect is the Impostor. The player with the most votes is eliminated!',
    },
    {
      step: '5',
      title: 'Impostor\'s Final Guess',
      icon: <Trophy size={22} className="text-yellow-400" />,
      desc: 'If Citizens eliminate an innocent player, the Impostor wins immediately! If the Impostor is caught, they get ONE LAST CHANCE to guess the secret word. If they guess correctly, the Impostor wins!',
    },
  ];

  return (
    <div className={`w-full max-w-xl mx-auto ${isModal ? 'p-0' : 'px-4 py-6'} relative z-10`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 py-2 px-3.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 text-sm font-semibold transition-all active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
          <HelpCircle size={14} /> Party Game Guide
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-white mb-2">How To Play</h2>
        <p className="text-sm text-slate-300 max-w-md mx-auto">
          One player is a secret impostor trying to blend in. The rest are citizens trying to expose them!
        </p>
      </div>

      {/* Role Comparison Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {/* Citizens */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 bg-emerald-950/10">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg border border-emerald-500/30">
              👥
            </div>
            <div>
              <h3 className="font-extrabold text-emerald-300 text-base">The Citizens</h3>
              <p className="text-[11px] text-slate-400">The majority team</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Know the secret word. Give subtle clues to prove you know it without giving the word away to the Impostor!
          </p>
        </div>

        {/* Impostor */}
        <div className="glass-card p-5 rounded-2xl border border-rose-500/20 bg-rose-950/10">
          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg border border-rose-500/30">
              🕵️
            </div>
            <div>
              <h3 className="font-extrabold text-rose-300 text-base">The Impostor</h3>
              <p className="text-[11px] text-slate-400">1 Secret Liar</p>
            </div>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Has NO clue what the secret word is. Listen carefully to others' clues, fake your own clue, and guess the word if exposed!
          </p>
        </div>
      </div>

      {/* Step by step flow */}
      <div className="space-y-3 mb-8">
        {steps.map((item, idx) => (
          <motion.div
            key={item.step}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08 }}
            className="glass-card p-4 rounded-2xl border border-white/10 flex items-start gap-3.5 hover:border-purple-500/30 transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-800 flex-shrink-0 flex items-center justify-center border border-white/10 shadow-sm mt-0.5">
              {item.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  STEP {item.step}
                </span>
                <h4 className="font-bold text-white text-sm">{item.title}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Tips Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/40 border border-purple-500/30 mb-8">
        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2 flex items-center gap-1.5">
          <ShieldAlert size={15} /> Pro Tips
        </h4>
        <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
          <li><strong>For Citizens:</strong> Don't give super obvious clues like "Mozzarella" for "Pizza". Use witty or indirect clues!</li>
          <li><strong>For Impostor:</strong> Give safe, flexible clues (e.g. "Popular", "Fun", "Everyday") until you deduce the topic.</li>
        </ul>
      </div>

      {/* Action button */}
      {!isModal && (
        <button
          onClick={() => setPhase('create-game')}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-base tracking-wide shadow-xl shadow-purple-600/30 transition-all border border-white/20"
        >
          START PLAYING
        </button>
      )}
    </div>
  );
};
