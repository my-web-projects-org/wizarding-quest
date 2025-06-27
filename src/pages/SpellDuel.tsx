import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Button,
  SimpleGrid,
  HStack,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  keyframes,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import MagicalFirefliesLoader from '../components/MagicalFirefliesLoader';
import { api, Spell } from '../utils/api';
import spellBg from '../assets/mqedi3fo.png';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const SpellDuel = () => {
  const [currentSpell, setCurrentSpell] = useState<Spell | null>(null);
  const [options, setOptions] = useState<Spell[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
  const [storyStep, setStoryStep] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storyTexts = [
    "Welcome to the Spell Duel Challenge, young wizard...",
    "You stand in the Great Hall of Hogwarts, surrounded by floating candles...",
    "Your task is to identify spells from their effects...",
    "Choose wisely, for each mistake costs you a life...",
    "Begin your magical journey...",
  ];

  const fetchNewSpell = async () => {
    try {
      setIsLoading(true);
      const allSpells = await api.spells.getAll();
      const randomSpell = await api.spells.getRandom();
      
      const otherSpells = allSpells
        .filter(spell => spell.spell !== randomSpell.spell)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      setCurrentSpell(randomSpell);
      setOptions([randomSpell, ...otherSpells].sort(() => Math.random() - 0.5));
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch spells. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      fetchNewSpell();
    }
  }, [gameState]);

  const handleAnswer = (selectedSpell: Spell) => {
    if (!currentSpell) return;

    if (selectedSpell.spell === currentSpell.spell) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 10 + (newStreak > 2 ? Math.min(newStreak, 5) : 0);
      setScore(prev => prev + points);
      toast({
        title: 'Correct!',
        description: `You cast the spell perfectly! +${points} points`,
        status: 'success',
        duration: 2000,
      });
    } else {
      setStreak(0);
      setScore(prev => prev - 5);
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameState('gameOver');
        onOpen();
      } else {
        toast({
          title: 'Wrong!',
          description: `The correct spell was ${currentSpell.spell}`,
          status: 'error',
          duration: 2000,
        });
      }
    }

    if (lives > 1) {
      fetchNewSpell();
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setStreak(0);
  };

  const handleRestart = () => {
    onClose();
    setGameState('intro');
    setStoryStep(0);
  };

  const handleNextStory = () => {
    if (storyStep < storyTexts.length - 1) {
      setStoryStep(prev => prev + 1);
    } else {
      startGame();
    }
  };

  if (gameState === 'intro') {
    return (
      <Box
        minH="100vh"
        bgImage={`url(${spellBg})`}
        bgSize="cover"
        bgPosition="center"
        bgRepeat="no-repeat"
        position="relative"
      >
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.700"
          zIndex={1}
        />
        <Container maxW="container.md" py={10} position="relative" zIndex={2}>
          <VStack spacing={8} align="center" justify="center" minH="80vh">
            <Box
              p={8}
              borderRadius="lg"
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              textAlign="center"
              animation={`${fadeIn} 2s ease-in`}
            >
              <Text
                fontSize="2xl"
                color="white"
                mb={4}
                textShadow="0 0 10px rgba(255,255,255,0.5)"
              >
                {storyTexts[storyStep]}
              </Text>
              <Button
                onClick={handleNextStory}
                variant="magical"
                size="lg"
                bg="whiteAlpha.300"
                _hover={{ bg: "whiteAlpha.400" }}
              >
                {storyStep < storyTexts.length - 1 ? "Next" : "Begin Challenge"}
              </Button>
            </Box>
          </VStack>
        </Container>
      </Box>
    );
  }

  if (isLoading) {
    return <MagicalFirefliesLoader />;
  }

  return (
    <Box
      minH="100vh"
      bgImage={`url(${spellBg})`}
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
    >
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.700"
        zIndex={1}
      />
      <Container maxW="container.md" py={10} position="relative" zIndex={2}>
        <VStack spacing={8}>
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, gryffindor.primary, gryffindor.secondary)"
            bgClip="text"
            textAlign="center"
            textShadow="0 0 10px rgba(255,255,255,0.5)"
          >
            Spell Duel
          </Heading>

          <HStack spacing={8} w="full" justify="center">
            <Box textAlign="center" bg="whiteAlpha.200" p={4} borderRadius="lg">
              <Text fontSize="lg" color="white">Score</Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">{score}</Text>
            </Box>
            <Box textAlign="center" bg="whiteAlpha.200" p={4} borderRadius="lg">
              <Text fontSize="lg" color="white">Lives</Text>
              <Text fontSize="2xl" fontWeight="bold" color="white">{lives}</Text>
            </Box>
            {streak > 1 && (
              <Box textAlign="center" bg="whiteAlpha.200" p={4} borderRadius="lg">
                <Text fontSize="lg" color="white">Streak</Text>
                <Text fontSize="2xl" fontWeight="bold" color="white">{streak}x</Text>
              </Box>
            )}
          </HStack>

          <Box
            p={6}
            borderRadius="lg"
            bg="gryffindor.primary"
            color="white"
            w="full"
            textAlign="center"
            position="relative"
            overflow="hidden"
          >
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              opacity={0.2}
            >
              <Image
                src="/src/assets/2zc4c6n8.png"
                alt="magical background"
                w="full"
                h="full"
                objectFit="cover"
              />
            </Box>
            <VStack spacing={4} position="relative" zIndex={1}>
              <Text fontSize="xl" textShadow="0 0 5px rgba(0,0,0,0.5)">What spell has this effect?</Text>
              <Text fontSize="2xl" fontWeight="bold" textShadow="0 0 5px rgba(0,0,0,0.5)">{currentSpell?.use}</Text>
            </VStack>
          </Box>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
            {options.map((spell) => (
              <Button
                key={spell.spell}
                onClick={() => handleAnswer(spell)}
                variant="magical"
                size="lg"
                h="60px"
                _hover={{ transform: 'scale(1.05)' }}
                transition="all 0.3s"
              >
                {spell.spell}
              </Button>
            ))}
          </SimpleGrid>

          <Button
            onClick={() => navigate('/')}
            variant="magical"
            size="lg"
            bg="whiteAlpha.200"
            _hover={{ bg: "whiteAlpha.300" }}
          >
            Return to Home
          </Button>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay backdropFilter="blur(10px)" />
        <ModalContent bg="whiteAlpha.200" backdropFilter="blur(10px)">
          <ModalCloseButton color="white" />
          <ModalBody p={8}>
            <VStack spacing={6} textAlign="center">
              <Heading color="white">Game Over!</Heading>
              <Text fontSize="xl" color="white">Your final score: {score}</Text>
              <Text color="white">Would you like to try again?</Text>
              <HStack spacing={4}>
                <Button onClick={handleRestart} variant="magical">
                  Play Again
                </Button>
                <Button onClick={() => navigate('/')} variant="magical" bg="whiteAlpha.300">
                  Return Home
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SpellDuel; 