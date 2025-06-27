import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  useToast,
  SimpleGrid,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Badge,
} from '@chakra-ui/react';
import { type Book } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import MagicalFirefliesLoader from '../components/MagicalFirefliesLoader';
import booksBg from '../assets/d4cee813.png';

interface TriviaQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  type: 'title' | 'release' | 'pages' | 'description' | 'number';
  book: Book;
}

const BookTrivia = () => {
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'gameOver'>('intro');
  const [storyStep, setStoryStep] = useState(0);
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [cluesUsed, setCluesUsed] = useState(0);
  const [maxClues, setMaxClues] = useState(3);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const storyTexts = [
    "Welcome to the Book Trivia Challenge, young scholar...",
    "You find yourself in the Hogwarts Library, surrounded by ancient tomes and magical books...",
    "Your task is to answer questions about the Harry Potter book series...",
    "Choose your difficulty level wisely...",
    "Begin your literary journey through the wizarding world...",
  ];

  // Book data from the API
  const bookData: Book[] = [
    {
      number: 1,
      title: "Harry Potter and the Sorcerer's Stone",
      originalTitle: "Harry Potter and the Sorcerer's Stone",
      releaseDate: "Jun 26, 1997",
      description: "On his birthday, Harry Potter discovers that he is the son of two well-known wizards, from whom he has inherited magical powers. He must attend a famous school of magic and sorcery, where he establishes a friendship with two young men who will become his companions on his adventure. During his first year at Hogwarts, he discovers that a malevolent and powerful wizard named Voldemort is in search of a philosopher's stone that prolongs the life of its owner.",
      pages: 223,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/1.png",
      index: 0
    },
    {
      number: 2,
      title: "Harry Potter and the Chamber of Secrets",
      originalTitle: "Harry Potter and the Chamber of Secrets",
      releaseDate: "Jul 2, 1998",
      description: "Harry Potter and the sophomores investigate a malevolent threat to their Hogwarts classmates, a menacing beast that hides within the castle.",
      pages: 251,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/2.png",
      index: 1
    },
    {
      number: 3,
      title: "Harry Potter and the Prisoner of Azkaban",
      originalTitle: "Harry Potter and the Prisoner of Azkaban",
      releaseDate: "Jul 8, 1999",
      description: "Harry's third year of studies at Hogwarts is threatened by Sirius Black's escape from Azkaban prison. Apparently, it is a dangerous wizard who was an accomplice of Lord Voldemort and who will try to take revenge on Harry Potter.",
      pages: 317,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/3.png",
      index: 2
    },
    {
      number: 4,
      title: "Harry Potter and the Goblet of Fire",
      originalTitle: "Harry Potter and the Goblet of Fire",
      releaseDate: "Jul 8, 2000",
      description: "Hogwarts prepares for the Triwizard Tournament, in which three schools of wizardry will compete. To everyone's surprise, Harry Potter is chosen to participate in the competition, in which he must fight dragons, enter the water and face his greatest fears.",
      pages: 636,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/4.png",
      index: 3
    },
    {
      number: 5,
      title: "Harry Potter and the Order of the Phoenix",
      originalTitle: "Harry Potter and the Order of the Phoenix",
      releaseDate: "Jun 21, 2003",
      description: "In his fifth year at Hogwarts, Harry discovers that many members of the wizarding community do not know the truth about his encounter with Lord Voldemort. Cornelius Fudge, Minister of Magic, appoints Dolores Umbridge as Defense Against the Dark Arts teacher because he believes that Professor Dumbledore plans to take over his job. But his teachings are inadequate, so Harry prepares the students to defend the school against evil.",
      pages: 766,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/5.png",
      index: 4
    },
    {
      number: 6,
      title: "Harry Potter and the Half-Blood Prince",
      originalTitle: "Harry Potter and the Half-Blood Prince",
      releaseDate: "Jul 16, 2005",
      description: "Harry discovers a powerful book and, while trying to discover its origins, collaborates with Dumbledore in the search for a series of magical objects that will aid in the destruction of Lord Voldemort.",
      pages: 607,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/6.png",
      index: 5
    },
    {
      number: 7,
      title: "Harry Potter and the Deathly Hallows",
      originalTitle: "Harry Potter and the Deathly Hallows",
      releaseDate: "Jul 21, 2007",
      description: "Harry, Ron and Hermione go on a dangerous mission to locate and destroy the secret of Voldemort's immortality and destruction - the Horcruces. Alone, without the guidance of their teachers or the protection of Professor Dumbledore, the three friends must lean on each other more than ever. But there are Dark Forces in between that threaten to tear them apart. Harry Potter is getting closer and closer to the task for which he has been preparing since the first day he set foot in Hogwarts: the last battle with Voldemort.",
      pages: 607,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/7.png",
      index: 6
    },
    {
      number: 8,
      title: "Harry Potter and the Cursed Child",
      originalTitle: "Harry Potter and the Cursed Child",
      releaseDate: "Jul 30, 2016",
      description: "Harry's second son entered Hogwarts, but in Slytherin. His relationship with Harry is getting worse and he became close friends with Draco's son, Scorpius Malfoy who is said to be Lord Voldemort's son.",
      pages: 336,
      cover: "https://raw.githubusercontent.com/fedeperin/potterapi/main/public/images/covers/8.png",
      index: 7
    }
  ];

  const generateQuestion = (book: Book): TriviaQuestion => {
    const questionTypes: ('title' | 'release' | 'pages' | 'description' | 'number')[] = ['title', 'release', 'pages', 'description', 'number'];
    const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    let question = '';
    let correctAnswer = '';
    let options: string[] = [];

    switch (selectedType) {
      case 'title':
        question = `What is the title of Book ${book.number}?`;
        correctAnswer = book.title;
        options = bookData
          .map(b => b.title)
          .filter(title => title !== book.title)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;

      case 'release':
        question = `When was "${book.title}" released?`;
        correctAnswer = book.releaseDate;
        options = bookData
          .map(b => b.releaseDate)
          .filter(date => date !== book.releaseDate)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;

      case 'pages':
        question = `How many pages does "${book.title}" have?`;
        correctAnswer = book.pages.toString();
        options = bookData
          .map(b => b.pages.toString())
          .filter(pages => pages !== book.pages.toString())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;

      case 'description':
        question = `Which book is described as: "${book.description.substring(0, 100)}..."?`;
        correctAnswer = book.title;
        options = bookData
          .map(b => b.title)
          .filter(title => title !== book.title)
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;

      case 'number':
        question = `What is the book number for "${book.title}"?`;
        correctAnswer = book.number.toString();
        options = bookData
          .map(b => b.number.toString())
          .filter(num => num !== book.number.toString())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
        break;
    }

    options.push(correctAnswer);
    options.sort(() => Math.random() - 0.5);

    return {
      question,
      options,
      correctAnswer,
      type: selectedType,
      book
    };
  };

  const fetchNewQuestion = async () => {
    try {
      setIsLoading(true);
      
      // Filter books based on difficulty
      let availableBooks = bookData;
      if (difficulty === 'Easy') {
        // Use first 4 books (most well-known)
        availableBooks = bookData.slice(0, 4);
      } else if (difficulty === 'Medium') {
        // Use first 6 books
        availableBooks = bookData.slice(0, 6);
      }
      // Hard uses all books
      
      // Avoid using the same book twice in a row
      let selectedBook;
      do {
        selectedBook = availableBooks[Math.floor(Math.random() * availableBooks.length)];
      } while (selectedBook.number === currentQuestion?.book.number && availableBooks.length > 1);

      const question = generateQuestion(selectedBook);
      setCurrentQuestion(question);
      setCluesUsed(0);
    } catch (error) {
      console.error('Error generating question:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate question. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      fetchNewQuestion();
    }
  }, [gameState, difficulty]);

  const handleAnswer = (selectedAnswer: string) => {
    if (!currentQuestion) return;

    if (selectedAnswer === currentQuestion.correctAnswer) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const basePoints = difficulty === 'Easy' ? 10 : difficulty === 'Medium' ? 15 : 20;
      const streakBonus = newStreak > 2 ? Math.min(newStreak, 5) : 0;
      const cluePenalty = cluesUsed * 2;
      const points = Math.max(1, basePoints + streakBonus - cluePenalty);
      
      setScore(prev => prev + points);
      toast({
        title: 'Correct!',
        description: `Excellent knowledge! +${points} points`,
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
          description: `The correct answer was: ${currentQuestion.correctAnswer}`,
          status: 'error',
          duration: 2000,
        });
      }
    }

    // Always fetch a new question after answering
    setTimeout(() => fetchNewQuestion(), 1000);
  };

  const useClue = () => {
    if (cluesUsed < maxClues && currentQuestion) {
      setCluesUsed(prev => prev + 1);
      
      let clueText = '';
      switch (currentQuestion.type) {
        case 'title':
          clueText = `This book is number ${currentQuestion.book.number} in the series`;
          break;
        case 'release':
          clueText = `This book was released in the ${currentQuestion.book.releaseDate.split(' ')[2]}`;
          break;
        case 'pages':
          clueText = `This book has ${currentQuestion.book.pages > 500 ? 'more' : 'less'} than 500 pages`;
          break;
        case 'description':
          clueText = `This book is number ${currentQuestion.book.number} in the series`;
          break;
        case 'number':
          clueText = `This book is titled "${currentQuestion.book.title}"`;
          break;
        default:
          clueText = `This book is number ${currentQuestion.book.number} in the series`;
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
    fetchNewQuestion();
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
        bgImage={`url(${booksBg})`}
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
                    Easy (Books 1-4)
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Medium')}
                    variant="magical"
                    bg={difficulty === 'Medium' ? 'yellow.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Medium' ? 'yellow.600' : 'whiteAlpha.400' }}
                  >
                    Medium (Books 1-6)
                  </Button>
                  <Button
                    onClick={() => setDifficulty('Hard')}
                    variant="magical"
                    bg={difficulty === 'Hard' ? 'red.500' : 'whiteAlpha.300'}
                    _hover={{ bg: difficulty === 'Hard' ? 'red.600' : 'whiteAlpha.400' }}
                  >
                    Hard (All Books)
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
      bgImage={`url(${booksBg})`}
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

          {currentQuestion && (
            <Box
              p={8}
              borderRadius="lg"
              bg="whiteAlpha.200"
              backdropFilter="blur(10px)"
              w="full"
            >
              <VStack spacing={6}>
                <HStack spacing={4} align="start" w="full">
                  <Image
                    src={currentQuestion.book.cover}
                    alt={currentQuestion.book.title}
                    boxSize="80px"
                    objectFit="cover"
                    borderRadius="md"
                    border="2px solid"
                    borderColor="whiteAlpha.300"
                    fallbackSrc="https://via.placeholder.com/80x120/666666/FFFFFF?text=Book"
                  />
                  <VStack align="start" flex={1} spacing={2}>
                    <Heading size="md" color="white">
                      {currentQuestion.question}
                    </Heading>
                    <Badge colorScheme="blue" fontSize="sm">
                      {currentQuestion.type === 'title' ? 'Title Question' : 
                       currentQuestion.type === 'release' ? 'Release Date Question' : 
                       currentQuestion.type === 'pages' ? 'Page Count Question' : 
                       currentQuestion.type === 'description' ? 'Description Question' : 'Book Number Question'}
                    </Badge>
                  </VStack>
                </HStack>
              </VStack>
            </Box>
          )}

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
            {currentQuestion?.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(option)}
                variant="magical"
                size="lg"
                bg="whiteAlpha.300"
                _hover={{ bg: 'whiteAlpha.400' }}
                h="auto"
                p={4}
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minH="80px"
              >
                <Text
                  fontSize="md"
                  fontWeight="bold"
                  textAlign="center"
                  color="white"
                  noOfLines={3}
                  lineHeight="1.2"
                >
                  {option}
                </Text>
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

export default BookTrivia; 