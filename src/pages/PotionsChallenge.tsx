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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import potionsBg from '../assets/qefrlytp.png';
import MagicalFirefliesLoader from '../components/MagicalFirefliesLoader';
import { api, Potion } from '../utils/api';

const PotionsChallenge = () => {
  const [currentPotion, setCurrentPotion] = useState<Potion | null>(null);
  const [options, setOptions] = useState<Potion[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
  const [storyStep, setStoryStep] = useState(0);
  const [difficulty, setDifficulty] = useState<Potion['difficulty']>('Beginner');
  const [cluesUsed, setCluesUsed] = useState(0);
  const [maxClues, setMaxClues] = useState(3);
  const [showClue, setShowClue] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storyTexts = [
    "Welcome to the Potions Challenge, young apprentice...",
    "You stand in Professor Snape's dungeon, surrounded by bubbling cauldrons...",
    "Your task is to identify potions from their ingredients and effects...",
    "Choose your difficulty level carefully...",
    "Begin your potion-making journey...",
  ];

  const fetchNewPotion = async () => {
    try {
      setIsLoading(true);
      const allPotions = await api.potions.getAll();
      const potionsOfDifficulty = allPotions.filter(p => p.difficulty === difficulty);
      
      if (potionsOfDifficulty.length < 4) {
        toast({
          title: 'Error',
          description: 'Not enough potions available for this difficulty level.',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      
      // Ensure we don't get the same potion twice in a row
      let randomPotion: Potion;
      do {
        randomPotion = potionsOfDifficulty[Math.floor(Math.random() * potionsOfDifficulty.length)];
      } while (randomPotion.name === currentPotion?.name && potionsOfDifficulty.length > 1);
      
      // Get other potions, excluding the current one
      const otherPotions = potionsOfDifficulty
        .filter(potion => potion.name !== randomPotion.name)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      setCurrentPotion(randomPotion);
      setOptions([randomPotion, ...otherPotions].sort(() => Math.random() - 0.5));
      setCluesUsed(0);
      setShowClue(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch potions. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      fetchNewPotion();
    }
  }, [gameState, difficulty]);

  const handleAnswer = (selectedPotion: Potion) => {
    if (!currentPotion) return;

    if (selectedPotion.name === currentPotion.name) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const basePoints = difficulty === 'Beginner' ? 10 : difficulty === 'Intermediate' ? 15 : 20;
      const streakBonus = newStreak > 2 ? Math.min(newStreak, 5) : 0;
      const cluePenalty = cluesUsed * 2;
      const points = Math.max(1, basePoints + streakBonus - cluePenalty);
      
      setScore(prev => prev + points);
      toast({
        title: 'Correct!',
        description: `You identified the potion perfectly! +${points} points`,
        status: 'success',
        duration: 2000,
      });
    } else {
      setStreak(0);
      const penalty = difficulty === 'Beginner' ? 3 : difficulty === 'Intermediate' ? 5 : 8;
      setScore(prev => Math.max(0, prev - penalty));
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameState('gameOver');
        onOpen();
      } else {
        toast({
          title: 'Wrong!',
          description: `The correct potion was ${currentPotion.name}`,
          status: 'error',
          duration: 2000,
        });
      }
    }

    // Always fetch a new potion after answering
    setTimeout(() => fetchNewPotion(), 1000);
  };

  const useClue = () => {
    if (cluesUsed < maxClues) {
      setCluesUsed(prev => prev + 1);
      setShowClue(true);
      toast({
        title: 'Clue Used',
        description: `Clue ${cluesUsed + 1}/${maxClues}: ${currentPotion?.color}`,
        status: 'info',
        duration: 3000,
      });
    }
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLives(3);
    setStreak(0);
    setCluesUsed(0);
    setMaxClues(difficulty === 'Beginner' ? 3 : difficulty === 'Intermediate' ? 2 : 1);
    fetchNewPotion();
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
        bgImage={`url(${potionsBg})`}
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
            >
              <Text
                fontSize="2xl"
                color="white"
                mb={4}
                textShadow="0 0 10px rgba(255,255,255,0.5)"
              >
                {storyTexts[storyStep]}
              </Text>
              {storyStep === 3 && (
                <VStack spacing={4} mb={4}>
                  <Button
                    onClick={() => setDifficulty('Beginner')}
                    variant="magical"
                    bg={difficulty === 'Beginner' ? 'green.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Beginner' ? 'green.600' : 'whiteAlpha.400' }}
                  >
                    Beginner
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Intermediate')}
                    variant="magical"
                    bg={difficulty === 'Intermediate' ? 'yellow.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Intermediate' ? 'yellow.600' : 'whiteAlpha.400' }}
                  >
                    Intermediate
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Advanced')}
                    variant="magical"
                    bg={difficulty === 'Advanced' ? 'red.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Advanced' ? 'red.600' : 'whiteAlpha.400' }}
                  >
                    Advanced
                  </Button>
                </VStack>
              )}
              <Button
                onClick={handleNextStory}
                variant="magical"
                size="lg"
                mt={4}
              >
                {storyStep === storyTexts.length - 1 ? 'Start Challenge' : 'Next'}
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
      bgImage={`url(${potionsBg})`}
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
          <HStack spacing={8} justify="center" w="full">
            <Box textAlign="center">
              <Text color="white" fontSize="lg">Score</Text>
              <Text color="white" fontSize="2xl" fontWeight="bold">{score}</Text>
            </Box>
            <Box textAlign="center">
              <Text color="white" fontSize="lg">Lives</Text>
              <Text color="white" fontSize="2xl" fontWeight="bold">{lives}</Text>
            </Box>
            <Box textAlign="center">
              <Text color="white" fontSize="lg">Streak</Text>
              <Text color="white" fontSize="2xl" fontWeight="bold">{streak}x</Text>
            </Box>
            <Box textAlign="center">
              <Text color="white" fontSize="lg">Clues</Text>
              <Text color="white" fontSize="2xl" fontWeight="bold">{maxClues - cluesUsed}</Text>
            </Box>
          </HStack>

          <Box
            p={8}
            borderRadius="lg"
            bg="whiteAlpha.200"
            backdropFilter="blur(10px)"
            w="full"
          >
            <VStack spacing={6}>
              <Heading size="lg" color="white">Identify this potion:</Heading>
              {currentPotion && (
                <>
                  <Box w="full" textAlign="center">
                    <Text color="white" fontSize="lg" fontWeight="bold" mb={2}>
                      Effect:
                    </Text>
                    <Text color="white" fontSize="md" mb={4}>
                      {currentPotion.effect}
                    </Text>
                    
                    <Text color="white" fontSize="lg" fontWeight="bold" mb={2}>
                      Ingredients:
                    </Text>
                    <SimpleGrid columns={2} spacing={2} w="full" mb={4}>
                      {currentPotion.ingredients.map((ingredient, index) => (
                        <Text key={index} color="white" fontSize="sm">
                          • {ingredient}
                        </Text>
                      ))}
                    </SimpleGrid>
                    
                    {showClue && (
                      <Box mt={4} p={3} bg="blue.500" borderRadius="md">
                        <Text color="white" fontWeight="bold">
                          Clue: This potion is {currentPotion.color} in color
                        </Text>
                      </Box>
                    )}
                  </Box>
                </>
              )}
            </VStack>
          </Box>

          <HStack spacing={4} w="full" justify="center">
            <Button
              onClick={useClue}
              isDisabled={cluesUsed >= maxClues}
              variant="magical"
              size="md"
              bg="blue.500"
              _hover={{ bg: 'blue.600' }}
              _disabled={{ bg: 'gray.500', cursor: 'not-allowed' }}
            >
              Use Clue ({maxClues - cluesUsed} left)
            </Button>
          </HStack>

          <SimpleGrid columns={2} spacing={4} w="full">
            {options.map((potion) => (
              <Button
                key={potion.name}
                onClick={() => handleAnswer(potion)}
                variant="magical"
                size="lg"
                bg="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.400' }}
                h="60px"
                fontSize="md"
              >
                {potion.name}
              </Button>
            ))}
          </SimpleGrid>

          <Button
            onClick={() => navigate('/')}
            variant="magical"
            size="lg"
            mt={4}
            bg="whiteAlpha.200"
            _hover={{ bg: 'whiteAlpha.300' }}
          >
            Return to Home
          </Button>
        </VStack>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bg="whiteAlpha.900" backdropFilter="blur(10px)">
          <ModalCloseButton />
          <ModalBody p={8}>
            <VStack spacing={6}>
              <Heading size="lg">Game Over!</Heading>
              <Text fontSize="xl">Final Score: {score}</Text>
              <Text>Difficulty: {difficulty}</Text>
              <Text>Best Streak: {streak}x</Text>
              <Text>Clues Used: {cluesUsed}</Text>
              <Button onClick={handleRestart} variant="magical" size="lg">
                Play Again
              </Button>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PotionsChallenge; 