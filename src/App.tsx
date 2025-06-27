import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider, CSSReset, IconButton } from '@chakra-ui/react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useState, useRef, useEffect } from 'react';
import Home from './pages/Home';
import SpellDuel from './pages/SpellDuel';
import PotionsChallenge from './pages/PotionsChallenge';
import CharacterRiddle from './pages/CharacterRiddle';
import BookTrivia from './pages/BookTrivia';
import Encyclopedia from './pages/Encyclopedia';
import theme from './theme';

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      if (audioRef.current) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <audio ref={audioRef} src="/school-of-magic-inspired-by-harry-potter-289617.mp3" loop />
      {hasInteracted && (
        <IconButton
          aria-label={isPlaying ? 'Mute' : 'Unmute'}
          icon={isPlaying ? <FaVolumeUp /> : <FaVolumeMute />}
          onClick={togglePlay}
          position="fixed"
          bottom="20px"
          right="20px"
          zIndex="1000"
        />
      )}
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/spell-duel" element={<SpellDuel />} />
          <Route path="/potions-challenge" element={<PotionsChallenge />} />
          <Route path="/character-riddle" element={<CharacterRiddle />} />
          <Route path="/book-trivia" element={<BookTrivia />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App; 