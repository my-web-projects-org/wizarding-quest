import { Box, Container, Heading, SimpleGrid, Button, Text, VStack, Image } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import mqedi3fo from '../assets/mqedi3fo.png';
import qefrlytp from '../assets/qefrlytp.png';
import tajrpeta from '../assets/tajrpeta.png';
import d4cee813 from '../assets/d4cee813.png';

const gameModes = [
  {
    title: 'Spell Duel',
    description: 'Test your knowledge of magical spells!',
    path: '/spell-duel',
    color: 'gryffindor',
    image: mqedi3fo,
  },
  {
    title: 'Potions Challenge',
    description: 'Identify potions from their ingredients and effects!',
    path: '/potions-challenge',
    color: 'slytherin',
    image: qefrlytp,
  },
  {
    title: 'Character Riddle',
    description: 'Guess the character from magical hints!',
    path: '/character-riddle',
    color: 'ravenclaw',
    image: tajrpeta,
  },
  {
    title: 'Book Trivia',
    description: 'Test your knowledge of the Harry Potter books!',
    path: '/book-trivia',
    color: 'hufflepuff',
    image: d4cee813,
  },
];

const Home = () => {
  return (
    <Box
      minH="100vh"
      bgImage="url('/src/assets/s5j1mu3z.png')"
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
      <Container maxW="container.xl" py={10} position="relative" zIndex={2}>
        <VStack spacing={8}>
          <Heading
            as="h1"
            size="2xl"
            bgGradient="linear(to-r, gryffindor.primary, gryffindor.secondary)"
            bgClip="text"
            textAlign="center"
            textShadow="0 0 10px rgba(255,255,255,0.5)"
            letterSpacing="wider"
          >
            Wizarding Quest
          </Heading>
          <Text 
            fontSize="xl" 
            textAlign="center" 
            color="white"
            textShadow="0 0 5px rgba(0,0,0,0.5)"
          >
            Welcome to the magical world of Harry Potter! Choose your challenge below and prove your worth as a wizard.
          </Text>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8} w="full">
            {gameModes.map((mode) => (
              <Box
                key={mode.path}
                p={6}
                borderRadius="lg"
                bg={`${mode.color}.primary`}
                color="white"
                _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }}
                transition="all 0.3s"
                position="relative"
                overflow="hidden"
                role="group"
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  opacity={0.3}
                  transition="all 0.3s"
                  _groupHover={{ opacity: 0.5 }}
                >
                  <Image
                    src={mode.image}
                    alt={mode.title}
                    w="full"
                    h="full"
                    objectFit="cover"
                  />
                </Box>
                <VStack spacing={4} align="stretch" position="relative" zIndex={1}>
                  <Heading size="lg" textShadow="0 0 5px rgba(0,0,0,0.5)">{mode.title}</Heading>
                  <Text textShadow="0 0 3px rgba(0,0,0,0.5)">{mode.description}</Text>
                  <Button
                    as={RouterLink}
                    to={mode.path}
                    variant="magical"
                    bg={`${mode.color}.secondary`}
                    _hover={{ 
                      bg: `${mode.color}.primary`,
                      transform: 'scale(1.05)',
                    }}
                    transition="all 0.3s"
                  >
                    Start Challenge
                  </Button>
                </VStack>
              </Box>
            ))}
          </SimpleGrid>
          <Button
            as={RouterLink}
            to="/encyclopedia"
            variant="magical"
            size="lg"
            mt={8}
            bg="whiteAlpha.200"
            _hover={{ 
              bg: "whiteAlpha.300",
              transform: 'scale(1.05)',
            }}
            transition="all 0.3s"
          >
            Visit Encyclopedia
          </Button>
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 