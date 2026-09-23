import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { Volume2, VolumeX, HelpCircle, Home, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  onOpenRules: () => void;
}

export const Navbar = ({ onOpenRules }: NavbarProps) => {
  const { phase, soundEnabled, toggleSound, resetToHome } = useGameStore();
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const isInGame = ![
    'home',
    'how-to-play',
    'create-game',
    'lobby',
    'winner',
  ].includes(phase);

  const handleHomeClick = () => {
    if (isInGame) {
      setShowExitConfirm(true);
    } else {
      resetToHome();
    }
  };

  const confirmExit = () => {
    setShowExitConfirm(false);
    resetToHome();
  };

  const getPhaseName = () => {
    switch (phase) {
      case 'role-reveal':
        return 'Secret Role Reveal';
      case 'clue-phase':
        return 'Clue Round';
      case 'discussion':
        return 'Discussion Phase';
      case 'voting':
        return 'Voting Time';
      case 'reveal-impostor':
        return 'The Impostor Reveal';
      case 'final-guess':
        return 'Final Chance';
      default:
        return '';
    }
  };

  return (
    <>
      <header className="relative z-20 w-full max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-2 group text-left transition-transform active:scale-95"
          title="Return to Home"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-purple-500/30 group-hover:scale-105 transition-transform border border-white/20">
            🕵️
          </div>
          <div>
            <div className="text-xl font-black tracking-wider text-white flex items-center gap-1.5">
              <span>IMPOSTOR</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30 uppercase">
                Party
              </span>
            </div>
            {isInGame && (
              <p className="text-[11px] font-medium text-slate-400">
                {getPhaseName()}
              </p>
            )}
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Rules / Help */}
          <button
            onClick={onOpenRules}
            aria-label="How to play"
            className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 transition-all active:scale-95 flex items-center justify-center"
            title="How to Play"
          >
            <HelpCircle size={19} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
            className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 transition-all active:scale-95 flex items-center justify-center"
            title={soundEnabled ? 'Mute Sound' : 'Unmute Sound'}
          >
            {soundEnabled ? (
              <Volume2 size={19} className="text-purple-400" />
            ) : (
              <VolumeX size={19} className="text-slate-500" />
            )}
          </button>

          {/* Home button when away from home */}
          {phase !== 'home' && (
            <button
              onClick={handleHomeClick}
              aria-label="Return home"
              className="p-2.5 rounded-xl glass-card text-slate-300 hover:text-white hover:border-purple-500/40 transition-all active:scale-95 flex items-center justify-center"
              title="Home"
            >
              <Home size={19} />
            </button>
          )}
        </div>
      </header>

      {/* Confirmation Modal to Exit Game */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-sm w-full p-6 rounded-3xl border border-red-500/30 text-center shadow-2xl relative"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                <AlertCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Leave Game?</h3>
              <p className="text-sm text-slate-300 mb-6">
                Are you sure you want to exit the current round? Current game progress will be lost.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold hover:bg-slate-700 transition-colors"
                >
                  Stay
                </button>
                <button
                  onClick={confirmExit}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold hover:from-red-500 hover:to-rose-500 shadow-lg shadow-red-500/30 transition-all"
                >
                  Exit Game
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
