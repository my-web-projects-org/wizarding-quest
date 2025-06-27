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
  Badge,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import charactersBg from '../assets/tajrpeta.png';
import MagicalFirefliesLoader from '../components/MagicalFirefliesLoader';
import { api, Character } from '../utils/api';

const CharacterRiddle = () => {
  const [currentCharacter, setCurrentCharacter] = useState<Character | null>(null);
  const [options, setOptions] = useState<Character[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
  const [storyStep, setStoryStep] = useState(0);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [cluesUsed, setCluesUsed] = useState(0);
  const [maxClues, setMaxClues] = useState(3);
  const [currentRiddle, setCurrentRiddle] = useState('');
  const [riddleType, setRiddleType] = useState<'house' | 'actor' | 'birth' | 'children'>('house');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storyTexts = [
    "Welcome to the Character Riddle Challenge, young wizard...",
    "You find yourself in the Great Hall, surrounded by portraits of famous witches and wizards...",
    "Your task is to identify characters from magical riddles and hints...",
    "Choose your difficulty level wisely...",
    "Begin your character-guessing journey...",
  ];

  const generateRiddle = (character: Character, type: 'house' | 'actor' | 'birth' | 'children') => {
    switch (type) {
      case 'house':
        return character.hogwartsHouse 
          ? `I belong to the noble house of ${character.hogwartsHouse}. Who am I?`
          : `I am a character from the magical world. Who am I?`;
      case 'actor':
        return character.interpretedBy 
          ? `I am portrayed by the talented ${character.interpretedBy}. Who am I?`
          : `I am a character from the magical world. Who am I?`;
      case 'birth':
        return character.birthdate 
          ? `I was born on ${character.birthdate}. Who am I?`
          : `I am a character from the magical world. Who am I?`;
      case 'children':
        if (character.children && character.children.length > 0) {
          return `I am the parent of ${character.children.join(', ')}. Who am I?`;
        } else {
          return `I have no children mentioned in the records. Who am I?`;
        }
      default:
        return `I am a character from the magical world. Who am I?`;
    }
  };

  const getRiddleTypes = (character: Character) => {
    const types: ('house' | 'actor' | 'birth' | 'children')[] = [];
    
    // Only add types if the character has the required data
    if (character.hogwartsHouse && character.hogwartsHouse.trim() !== '') {
      types.push('house');
    }
    if (character.interpretedBy && character.interpretedBy.trim() !== '') {
      types.push('actor');
    }
    if (character.birthdate && character.birthdate.trim() !== '') {
      types.push('birth');
    }
    if (character.children && character.children.length > 0) {
      types.push('children');
    }
    
    // If no specific types are available, use a generic approach
    if (types.length === 0) {
      types.push('house'); // Default fallback
    }
    
    return types;
  };

  const fetchNewCharacter = async () => {
    try {
      setIsLoading(true);
      let allCharacters = await api.characters.getAll();
      
      console.log('Total characters fetched:', allCharacters.length);
      
      // Fallback characters if API returns insufficient data
      const fallbackCharacters: Character[] = [
        {
          fullName: "Harry James Potter",
          nickname: "Harry",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Daniel Radcliffe",
          children: ["James Sirius Potter", "Albus Severus Potter", "Lily Luna Potter"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/harry_potter.png",
          birthdate: "Jul 31, 1980",
          index: 0
        },
        {
          fullName: "Hermione Jean Granger",
          nickname: "Hermione",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Emma Watson",
          children: ["Rose Granger-Weasley", "Hugo Granger-Weasley"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/hermione_granger.png",
          birthdate: "Sep 19, 1979",
          index: 1
        },
        {
          fullName: "Ron Weasley",
          nickname: "Ron",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Rupert Grint",
          children: ["Rose Granger-Weasley", "Hugo Granger-Weasley"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/ron_weasley.png",
          birthdate: "Mar 1, 1980",
          index: 2
        },
        {
          fullName: "Albus Percival Wulfric Brian Dumbledore",
          nickname: "Dumbledore",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Richard Harris",
          children: [],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/albus_dumbledore.png",
          birthdate: "Aug 29, 1881",
          index: 14
        },
        {
          fullName: "Severus Snape",
          nickname: "Snape",
          hogwartsHouse: "Slytherin",
          interpretedBy: "Alan Rickman",
          children: [],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/severus_snape.png",
          birthdate: "Jan 9, 1960",
          index: 19
        },
        {
          fullName: "Lord Voldemort",
          nickname: "Voldemort",
          hogwartsHouse: "Slytherin",
          interpretedBy: "Ralph Fiennes",
          children: ["Delphi"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/lord_voldemort.png",
          birthdate: "Dec 31, 1926",
          index: 21
        },
        {
          fullName: "Draco Malfoy",
          nickname: "Draco",
          hogwartsHouse: "Slytherin",
          interpretedBy: "Tom Felton",
          children: ["Scorpius Malfoy"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/draco_malfoy.png",
          birthdate: "Jun 5, 1980",
          index: 13
        },
        {
          fullName: "Luna Lovegood",
          nickname: "Luna",
          hogwartsHouse: "Ravenclaw",
          interpretedBy: "Evanna Lynch",
          children: [],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/luna_lovegood.png",
          birthdate: "Feb 13, 1981",
          index: 12
        }
      ];
      
      // If API returns less than 4 characters, use fallback
      if (allCharacters.length < 4) {
        console.log('API returned insufficient characters, using fallback');
        allCharacters = fallbackCharacters;
      }
      
      // Filter characters based on difficulty - make it more lenient
      let filteredCharacters = allCharacters;
      if (difficulty === 'Easy') {
        // Use characters with at least a fullName and one other piece of data
        filteredCharacters = allCharacters.filter(char => 
          char.fullName && 
          (char.hogwartsHouse || char.interpretedBy || char.birthdate || char.nickname)
        );
      } else if (difficulty === 'Medium') {
        // Use characters with at least a fullName
        filteredCharacters = allCharacters.filter(char => 
          char.fullName && char.fullName.trim() !== ''
        );
      }
      // Hard difficulty uses all characters with any data
      
      console.log('Filtered characters for', difficulty, ':', filteredCharacters.length);
      
      // If we still don't have enough, use all characters
      if (filteredCharacters.length < 4) {
        console.log('Not enough filtered characters, using all characters');
        filteredCharacters = allCharacters.filter(char => char.fullName && char.fullName.trim() !== '');
      }
      
      // Final check - if still not enough, show error
      if (filteredCharacters.length < 4) {
        toast({
          title: 'Error',
          description: `Only ${filteredCharacters.length} characters available. Need at least 4 to play.`,
          status: 'error',
          duration: 3000,
        });
        return;
      }
      
      // Ensure we don't get the same character twice in a row
      let randomCharacter: Character | undefined;
      do {
        randomCharacter = filteredCharacters[Math.floor(Math.random() * filteredCharacters.length)];
      } while (randomCharacter.fullName === currentCharacter?.fullName && filteredCharacters.length > 1);
      
      // Get other characters, excluding the current one
      const otherCharacters = filteredCharacters
        .filter(char => randomCharacter && char.fullName !== randomCharacter.fullName)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      // Generate riddle
      const availableTypes = getRiddleTypes(randomCharacter);
      const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const riddle = generateRiddle(randomCharacter, selectedType);

      setCurrentCharacter(randomCharacter);
      setOptions([randomCharacter, ...otherCharacters].sort(() => Math.random() - 0.5));
      setCurrentRiddle(riddle);
      setRiddleType(selectedType);
      setCluesUsed(0);
    } catch (error) {
      console.error('Error fetching characters:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch characters. Using fallback data.',
        status: 'warning',
        duration: 3000,
      });
      
      // Use fallback characters on error
      const fallbackCharacters: Character[] = [
        {
          fullName: "Harry James Potter",
          nickname: "Harry",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Daniel Radcliffe",
          children: ["James Sirius Potter", "Albus Severus Potter", "Lily Luna Potter"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/harry_potter.png",
          birthdate: "Jul 31, 1980",
          index: 0
        },
        {
          fullName: "Hermione Jean Granger",
          nickname: "Hermione",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Emma Watson",
          children: ["Rose Granger-Weasley", "Hugo Granger-Weasley"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/hermione_granger.png",
          birthdate: "Sep 19, 1979",
          index: 1
        },
        {
          fullName: "Ron Weasley",
          nickname: "Ron",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Rupert Grint",
          children: ["Rose Granger-Weasley", "Hugo Granger-Weasley"],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/ron_weasley.png",
          birthdate: "Mar 1, 1980",
          index: 2
        },
        {
          fullName: "Albus Percival Wulfric Brian Dumbledore",
          nickname: "Dumbledore",
          hogwartsHouse: "Gryffindor",
          interpretedBy: "Richard Harris",
          children: [],
          image: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/characters/albus_dumbledore.png",
          birthdate: "Aug 29, 1881",
          index: 14
        }
      ];
      
      // Use fallback characters
      const randomCharacter = fallbackCharacters[Math.floor(Math.random() * fallbackCharacters.length)];
      const otherCharacters = fallbackCharacters
        .filter(char => char.fullName !== randomCharacter.fullName)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const availableTypes = getRiddleTypes(randomCharacter);
      const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const riddle = generateRiddle(randomCharacter, selectedType);

      setCurrentCharacter(randomCharacter);
      setOptions([randomCharacter, ...otherCharacters].sort(() => Math.random() - 0.5));
      setCurrentRiddle(riddle);
      setRiddleType(selectedType);
      setCluesUsed(0);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      fetchNewCharacter();
    }
  }, [gameState, difficulty]);

  const handleAnswer = (selectedCharacter: Character) => {
    if (!currentCharacter) return;

    if (selectedCharacter.fullName === currentCharacter.fullName) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const basePoints = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 20;
      const streakBonus = newStreak > 2 ? Math.min(newStreak, 5) : 0;
      const cluePenalty = cluesUsed * 2;
      const points = Math.max(1, basePoints + streakBonus - cluePenalty);
      
      setScore(prev => prev + points);
      toast({
        title: 'Correct!',
        description: `You identified ${currentCharacter.fullName} perfectly! +${points} points`,
        status: 'success',
        duration: 2000,
      });
    } else {
      setStreak(0);
      const penalty = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 5 : 8;
      setScore(prev => Math.max(0, prev - penalty));
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameState('gameOver');
        onOpen();
      } else {
        toast({
          title: 'Wrong!',
          description: `The correct character was ${currentCharacter.fullName}`,
          status: 'error',
          duration: 2000,
        });
      }
    }

    // Always fetch a new character after answering
    setTimeout(() => fetchNewCharacter(), 1000);
  };

  const useClue = () => {
    if (cluesUsed < maxClues && currentCharacter) {
      setCluesUsed(prev => prev + 1);
      
      let clueText = '';
      switch (riddleType) {
        case 'house':
          clueText = currentCharacter.nickname 
            ? `This character's nickname is "${currentCharacter.nickname}"`
            : `This character's name starts with "${currentCharacter.fullName.charAt(0)}"`;
          break;
        case 'actor':
          clueText = currentCharacter.hogwartsHouse 
            ? `This character belongs to ${currentCharacter.hogwartsHouse} house`
            : `This character's name starts with "${currentCharacter.fullName.charAt(0)}"`;
          break;
        case 'birth':
          clueText = currentCharacter.nickname 
            ? `This character's nickname is "${currentCharacter.nickname}"`
            : `This character's name starts with "${currentCharacter.fullName.charAt(0)}"`;
          break;
        case 'children':
          clueText = currentCharacter.interpretedBy 
            ? `This character is portrayed by ${currentCharacter.interpretedBy}`
            : `This character's name starts with "${currentCharacter.fullName.charAt(0)}"`;
          break;
        default:
          clueText = `This character's full name starts with "${currentCharacter.fullName.charAt(0)}"`;
      }
      
      toast({
        title: 'Clue Used',
        description: `Clue ${cluesUsed + 1}/${maxClues}: ${clueText}`,
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
    setMaxClues(difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 2 : 1);
    fetchNewCharacter();
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
        bgImage={`url(${charactersBg})`}
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
                    onClick={() => setDifficulty('Easy')}
                    variant="magical"
                    bg={difficulty === 'Easy' ? 'green.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Easy' ? 'green.600' : 'whiteAlpha.400' }}
                  >
                    Easy
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Medium')}
                    variant="magical"
                    bg={difficulty === 'Medium' ? 'yellow.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Medium' ? 'yellow.600' : 'whiteAlpha.400' }}
                  >
                    Medium
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Hard')}
                    variant="magical"
                    bg={difficulty === 'Hard' ? 'red.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Hard' ? 'red.600' : 'whiteAlpha.400' }}
                  >
                    Hard
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
      bgImage={`url(${charactersBg})`}
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
              <Heading size="lg" color="white">Magical Riddle:</Heading>
              <Text
                color="white"
                fontSize="xl"
                textAlign="center"
                fontStyle="italic"
                textShadow="0 0 10px rgba(255,255,255,0.3)"
              >
                "{currentRiddle}"
              </Text>
              
              {currentCharacter && (
                <Box w="full" textAlign="center">
                  <Badge colorScheme="blue" fontSize="md" mb={2}>
                    {riddleType === 'house' ? 'House Hint' : 
                     riddleType === 'actor' ? 'Actor Hint' : 
                     riddleType === 'birth' ? 'Birth Date Hint' : 'Children Hint'}
                  </Badge>
                </Box>
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
            {options.map((character) => (
              <Button
                key={character.fullName}
                onClick={() => handleAnswer(character)}
                variant="magical"
                size="lg"
                bg="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.400' }}
                h="auto"
                p={4}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="120px"
              >
                <VStack spacing={2} w="full">
                  {character.image && (
                    <Image
                      src={character.image}
                      alt={character.fullName}
                      boxSize="60px"
                      objectFit="cover"
                      borderRadius="full"
                      border="2px solid"
                      borderColor="whiteAlpha.300"
                      fallbackSrc="https://via.placeholder.com/60x60/666666/FFFFFF?text=?"
                    />
                  )}
                  <Text
                    fontSize="sm"
                    fontWeight="bold"
                    textAlign="center"
                    color="white"
                    noOfLines={2}
                    lineHeight="1.2"
                  >
                    {character.fullName}
                  </Text>
                </VStack>
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

export default CharacterRiddle; 