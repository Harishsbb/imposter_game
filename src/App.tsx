import { useState } from 'react';
import { useGameStore } from './store/gameStore';
import { Navbar } from './components/Navbar';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { Modal } from './components/Modal';
import { Home } from './pages/Home';
import { HowToPlay } from './pages/HowToPlay';
import { CreateGame } from './pages/CreateGame';
import { Lobby } from './pages/Lobby';
import { SecretRoleReveal } from './pages/SecretRoleReveal';
import { CluePhase } from './pages/CluePhase';
import { Discussion } from './pages/Discussion';
import { Voting } from './pages/Voting';
import { RevealImpostor } from './pages/RevealImpostor';
import { FinalGuess } from './pages/FinalGuess';
import { Winner } from './pages/Winner';
import { AnimatePresence, motion } from 'framer-motion';

export function App() {
  const { phase } = useGameStore();
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);

  const renderPhase = () => {
    switch (phase) {
      case 'home':
        return <Home />;
      case 'how-to-play':
        return <HowToPlay />;
      case 'create-game':
        return <CreateGame />;
      case 'lobby':
        return <Lobby />;
      case 'role-reveal':
        return <SecretRoleReveal />;
      case 'clue-phase':
        return <CluePhase />;
      case 'discussion':
        return <Discussion />;
      case 'voting':
        return <Voting />;
      case 'reveal-impostor':
        return <RevealImpostor />;
      case 'final-guess':
        return <FinalGuess />;
      case 'winner':
        return <Winner />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col relative selection:bg-purple-500 selection:text-white overflow-x-hidden font-sans">
      {/* Dynamic Background Glow Orbs */}
      <BackgroundOrbs />

      {/* Top Navigation */}
      <Navbar onOpenRules={() => setIsRulesModalOpen(true)} />

      {/* Main Screen Transition Container */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="flex-1 flex flex-col"
          >
            {renderPhase()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Rules / How To Play Modal */}
      <Modal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        title="Game Instructions"
      >
        <HowToPlay onBack={() => setIsRulesModalOpen(false)} isModal={true} />
      </Modal>
    </div>
  );
}

export default App;
