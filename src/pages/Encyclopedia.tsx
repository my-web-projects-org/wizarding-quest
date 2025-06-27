import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  HStack,
  Badge,
  Image,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import encyclopediaBg from '../assets/127s69rv.png';
import MagicalFirefliesLoader from '../components/MagicalFirefliesLoader';
import { api, Character, Spell, House, Book } from '../utils/api';
import { useToast } from '@chakra-ui/react';

interface EncyclopediaItem {
  id: string;
  name: string;
  type: 'character' | 'spell' | 'house' | 'book';
  image?: string;
  description: string;
  data: Character | Spell | House | Book;
}

const Encyclopedia = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [characters, setCharacters] = useState<Character[]>([]);
  const [spells, setSpells] = useState<Spell[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<EncyclopediaItem | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  console.log('Encyclopedia component mounted');

  // Fetch all data on component mount
  useEffect(() => {
    console.log('Encyclopedia useEffect triggered');
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setIsLoading(true);
      
      // Try to fetch from API, but provide fallbacks
      let charactersData: Character[] = [];
      let spellsData: Spell[] = [];
      let housesData: House[] = [];
      let booksData: Book[] = [];

      try {
        const [charactersResponse, spellsResponse, housesResponse, booksResponse] = await Promise.all([
          api.characters.getAll(),
          api.spells.getAll(),
          api.houses.getAll(),
          api.books.getAll(),
        ]);
        
        charactersData = charactersResponse;
        spellsData = spellsResponse;
        housesData = housesResponse;
        booksData = booksResponse;
        
        console.log('API Data loaded:', {
          characters: charactersData.length,
          spells: spellsData.length,
          houses: housesData.length,
          books: booksData.length
        });
      } catch (apiError) {
        console.error('API Error:', apiError);
        toast({
          title: 'API Unavailable',
          description: 'Using fallback data. Some features may be limited.',
          status: 'warning',
          duration: 3000,
        });
      }

      // Fallback data if API fails or returns empty
      if (charactersData.length === 0) {
        charactersData = [
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
          }
        ];
      }

      if (spellsData.length === 0) {
        spellsData = [
          {
            spell: "Expecto Patronum",
            use: "Conjures a Patronus, a guardian that acts as a shield between the wizard and Dementors",
            index: 0
          },
          {
            spell: "Wingardium Leviosa",
            use: "Makes objects levitate",
            index: 1
          },
          {
            spell: "Lumos",
            use: "Creates light at the wand tip",
            index: 2
          },
          {
            spell: "Alohomora",
            use: "Unlocks doors and other locked objects",
            index: 3
          },
          {
            spell: "Expelliarmus",
            use: "Disarms the target by making their wand fly out of their hand",
            index: 4
          }
        ];
      }

      if (housesData.length === 0) {
        housesData = [
          {
            house: "Gryffindor",
            emoji: "🦁",
            founder: "Godric Gryffindor",
            colors: ["Scarlet", "Gold"],
            animal: "Lion",
            index: 0
          },
          {
            house: "Slytherin",
            emoji: "🐍",
            founder: "Salazar Slytherin",
            colors: ["Green", "Silver"],
            animal: "Snake",
            index: 1
          },
          {
            house: "Ravenclaw",
            emoji: "🦅",
            founder: "Rowena Ravenclaw",
            colors: ["Blue", "Bronze"],
            animal: "Eagle",
            index: 2
          },
          {
            house: "Hufflepuff",
            emoji: "🦡",
            founder: "Helga Hufflepuff",
            colors: ["Yellow", "Black"],
            animal: "Badger",
            index: 3
          }
        ];
      }

      if (booksData.length === 0) {
        booksData = [
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
          }
        ];
      }

      setCharacters(charactersData);
      setSpells(spellsData);
      setHouses(housesData);
      setBooks(booksData);

      console.log('Final data loaded:', {
        characters: charactersData.length,
        spells: spellsData.length,
        houses: housesData.length,
        books: booksData.length
      });

    } catch (error) {
      console.error('Error in fetchAllData:', error);
      toast({
        title: 'Error',
        description: 'Failed to load encyclopedia data. Please try again.',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Convert data to encyclopedia items
  const getEncyclopediaItems = (): EncyclopediaItem[] => {
    const items: EncyclopediaItem[] = [];

    console.log('Processing characters:', characters.length);
    console.log('Processing spells:', spells.length);
    console.log('Processing houses:', houses.length);
    console.log('Processing books:', books.length);

    // Add characters
    characters.forEach(char => {
      items.push({
        id: `char-${char.index}`,
        name: char.fullName || char.nickname || 'Unknown Character',
        type: 'character',
        image: char.image,
        description: char.nickname || 'A character from the wizarding world',
        data: char,
      });
    });

    // Add spells
    spells.forEach(spell => {
      items.push({
        id: `spell-${spell.index}`,
        name: spell.spell,
        type: 'spell',
        description: spell.use,
        data: spell,
      });
    });

    // Add houses
    houses.forEach(house => {
      items.push({
        id: `house-${house.index}`,
        name: house.house,
        type: 'house',
        description: `Founded by ${house.founder}`,
        data: house,
      });
    });

    // Add books
    books.forEach(book => {
      items.push({
        id: `book-${book.index}`,
        name: book.title,
        type: 'book',
        image: book.cover,
        description: book.description.substring(0, 100) + '...',
        data: book,
      });
    });

    console.log('Total encyclopedia items:', items.length);
    return items;
  };

  // Filter items based on search query
  const getFilteredItems = (items: EncyclopediaItem[]) => {
    if (!searchQuery.trim()) return items;
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => 
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  };

  // Get items by type
  const getItemsByType = (type: 'character' | 'spell' | 'house' | 'book') => {
    const allItems = getEncyclopediaItems();
    return getFilteredItems(allItems.filter(item => item.type === type));
  };

  const handleItemClick = (item: EncyclopediaItem) => {
    setSelectedItem(item);
    onOpen();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'character': return 'blue';
      case 'spell': return 'purple';
      case 'house': return 'green';
      case 'book': return 'orange';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'character': return '👤';
      case 'spell': return '✨';
      case 'house': return '🏠';
      case 'book': return '📚';
      default: return '📄';
    }
  };

  const renderItemCard = (item: EncyclopediaItem) => (
    <Card
      key={item.id}
      cursor="pointer"
      transition="all 0.3s ease"
      onClick={() => handleItemClick(item)}
      bg="whiteAlpha.200"
      backdropFilter="blur(15px)"
      border="1px solid"
      borderColor="whiteAlpha.400"
      boxShadow="0 4px 15px rgba(0,0,0,0.3)"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: '0 12px 30px rgba(0,0,0,0.5)',
        borderColor: 'whiteAlpha.600',
        bg: 'whiteAlpha.300'
      }}
    >
      <CardHeader pb={2} bg="whiteAlpha.100" borderBottom="1px solid" borderColor="whiteAlpha.300">
        <HStack justify="space-between">
          <Text fontSize="lg" fontWeight="bold" noOfLines={1} color="white" textShadow="0 1px 2px rgba(0,0,0,0.5)">
            {item.name}
          </Text>
          <Badge colorScheme={getTypeColor(item.type)} variant="solid">
            {getTypeIcon(item.type)} {item.type}
          </Badge>
        </HStack>
      </CardHeader>
      <CardBody pt={4} bg="whiteAlpha.50">
        {item.image && (
          <Image
            src={item.image}
            alt={item.name}
            borderRadius="md"
            mb={3}
            boxSize="100px"
            objectFit="cover"
            mx="auto"
            fallbackSrc="https://via.placeholder.com/100x100/666666/FFFFFF?text=?"
            border="2px solid"
            borderColor="whiteAlpha.400"
          />
        )}
        <Text fontSize="sm" color="white" noOfLines={3} fontWeight="medium" textShadow="0 1px 2px rgba(0,0,0,0.5)">
          {item.description}
        </Text>
      </CardBody>
    </Card>
  );

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const { data, type } = selectedItem;

    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
        <ModalContent
          bg="gray.900"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="0 20px 60px rgba(0,0,0,0.5)"
          borderRadius="xl"
          color="white"
        >
          <ModalHeader
            bg="gray.800"
            borderBottom="1px solid"
            borderColor="gray.700"
            borderRadius="xl 0 0 0"
          >
            <HStack>
              <Text fontWeight="bold">{selectedItem.name}</Text>
              <Badge colorScheme={getTypeColor(type)} variant="solid">
                {getTypeIcon(type)} {type}
              </Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ color: 'white', bg: 'gray.600' }} />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              {selectedItem.image && (
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.name}
                  borderRadius="lg"
                  maxH="200px"
                  objectFit="cover"
                  mx="auto"
                  fallbackSrc="https://via.placeholder.com/300x200/666666/FFFFFF?text=?"
                  border="2px solid"
                  borderColor="gray.700"
                  boxShadow="0 4px 15px rgba(0,0,0,0.2)"
                />
              )}

              {type === 'character' && (
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Heading size="md" mb={3}>Character Details</Heading>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Full Name:</Text> <Text as="span" color="gray.300">{(data as Character).fullName}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Nickname:</Text> <Text as="span" color="gray.300">{(data as Character).nickname}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">House:</Text> <Text as="span" color="gray.300">{(data as Character).hogwartsHouse}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Actor:</Text> <Text as="span" color="gray.300">{(data as Character).interpretedBy}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Birth Date:</Text> <Text as="span" color="gray.300">{(data as Character).birthdate}</Text>
                    </ListItem>
                    {(data as Character).children && (data as Character).children.length > 0 && (
                      <ListItem>
                        <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                        <Text as="span" fontWeight="bold">Children:</Text> <Text as="span" color="gray.300">{(data as Character).children.join(', ')}</Text>
                      </ListItem>
                    )}
                  </List>
                </Box>
              )}

              {type === 'spell' && (
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Heading size="md" mb={3}>Spell Details</Heading>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Spell:</Text> <Text as="span" color="gray.300">{(data as Spell).spell}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Use:</Text> <Text as="span" color="gray.300">{(data as Spell).use}</Text>
                    </ListItem>
                  </List>
                </Box>
              )}

              {type === 'house' && (
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Heading size="md" mb={3}>House Details</Heading>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">House:</Text> <Text as="span" color="gray.300">{(data as House).house}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Founder:</Text> <Text as="span" color="gray.300">{(data as House).founder}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Animal:</Text> <Text as="span" color="gray.300">{(data as House).animal}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Colors:</Text> <Text as="span" color="gray.300">{(data as House).colors.join(', ')}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Emoji:</Text> <Text as="span" color="gray.300">{(data as House).emoji}</Text>
                    </ListItem>
                  </List>
                </Box>
              )}

              {type === 'book' && (
                <Box bg="gray.800" p={4} borderRadius="lg" border="1px solid" borderColor="gray.700">
                  <Heading size="md" mb={3}>Book Details</Heading>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Title:</Text> <Text as="span" color="gray.300">{(data as Book).title}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Book Number:</Text> <Text as="span" color="gray.300">{(data as Book).number}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Release Date:</Text> <Text as="span" color="gray.300">{(data as Book).releaseDate}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Pages:</Text> <Text as="span" color="gray.300">{(data as Book).pages}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as="span" color="yellow.400">⭐</ListIcon>
                      <Text as="span" fontWeight="bold">Description:</Text>
                    </ListItem>
                    <Text fontSize="sm" color="gray.300" pl={6} bg="gray.700" p={3} borderRadius="md">
                      {(data as Book).description}
                    </Text>
                  </List>
                </Box>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  if (isLoading) {
    return (
      <Box
        minH="100vh"
        bgImage={`url(${encyclopediaBg})`}
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
            <Box textAlign="center" w="full">
              <Heading size="2xl" color="white" mb={4} textShadow="0 0 10px rgba(255,255,255,0.5)">
                Wizarding Encyclopedia
              </Heading>
              <Text color="white" fontSize="lg" mb={6}>
                Loading magical knowledge...
              </Text>
            </Box>
            <MagicalFirefliesLoader />
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      bgImage={`url(${encyclopediaBg})`}
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
          <Box textAlign="center" w="full">
            <Heading size="2xl" color="white" mb={4} textShadow="0 0 10px rgba(255,255,255,0.5)">
              Wizarding Encyclopedia
            </Heading>
            <Text color="white" fontSize="lg" mb={6}>
              Explore the magical world of Harry Potter
            </Text>
            
            <InputGroup maxW="600px" mx="auto">
              <InputLeftElement pointerEvents="none">
                <Text fontSize="lg">🔍</Text>
              </InputLeftElement>
              <Input
                placeholder="Search characters, spells, houses, or books..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                bg="whiteAlpha.900"
                border="2px solid"
                borderColor="whiteAlpha.400"
                _focus={{ 
                  bg: 'white', 
                  borderColor: 'blue.400',
                  boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
                  transform: 'scale(1.02)'
                }}
                _hover={{
                  borderColor: 'whiteAlpha.600',
                  transform: 'scale(1.01)'
                }}
                size="lg"
                borderRadius="xl"
                backdropFilter="blur(10px)"
                transition="all 0.3s ease"
                fontWeight="medium"
                color="gray.800"
                _placeholder={{ color: 'gray.500' }}
              />
            </InputGroup>
          </Box>

          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue" 
            w="full"
            index={activeTab}
            onChange={setActiveTab}
          >
            <TabList 
              justifyContent="center" 
              bg="whiteAlpha.200" 
              borderRadius="xl" 
              p={2}
              border="1px solid"
              borderColor="whiteAlpha.300"
              backdropFilter="blur(10px)"
            >
              <Tab 
                color="white" 
                _selected={{ bg: 'blue.500', color: 'white', shadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
                _hover={{ bg: 'whiteAlpha.300' }}
                borderRadius="lg"
                fontWeight="medium"
              >
                👤 Characters ({getItemsByType('character').length})
              </Tab>
              <Tab 
                color="white" 
                _selected={{ bg: 'purple.500', color: 'white', shadow: '0 4px 15px rgba(147, 51, 234, 0.4)' }}
                _hover={{ bg: 'whiteAlpha.300' }}
                borderRadius="lg"
                fontWeight="medium"
              >
                ✨ Spells ({getItemsByType('spell').length})
              </Tab>
              <Tab 
                color="white" 
                _selected={{ bg: 'green.500', color: 'white', shadow: '0 4px 15px rgba(34, 197, 94, 0.4)' }}
                _hover={{ bg: 'whiteAlpha.300' }}
                borderRadius="lg"
                fontWeight="medium"
              >
                🏠 Houses ({getItemsByType('house').length})
              </Tab>
              <Tab 
                color="white" 
                _selected={{ bg: 'orange.500', color: 'white', shadow: '0 4px 15px rgba(249, 115, 22, 0.4)' }}
                _hover={{ bg: 'whiteAlpha.300' }}
                borderRadius="lg"
                fontWeight="medium"
              >
                📚 Books ({getItemsByType('book').length})
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {getItemsByType('character').length > 0 ? (
                    getItemsByType('character').map(renderItemCard)
                  ) : (
                    <Box textAlign="center" gridColumn="1 / -1" py={10}>
                      <Text color="white" fontSize="lg" bg="whiteAlpha.200" p={4} borderRadius="lg">No characters found. Try adjusting your search.</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {getItemsByType('spell').length > 0 ? (
                    getItemsByType('spell').map(renderItemCard)
                  ) : (
                    <Box textAlign="center" gridColumn="1 / -1" py={10}>
                      <Text color="white" fontSize="lg" bg="whiteAlpha.200" p={4} borderRadius="lg">No spells found. Try adjusting your search.</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {getItemsByType('house').length > 0 ? (
                    getItemsByType('house').map(renderItemCard)
                  ) : (
                    <Box textAlign="center" gridColumn="1 / -1" py={10}>
                      <Text color="white" fontSize="lg" bg="whiteAlpha.200" p={4} borderRadius="lg">No houses found. Try adjusting your search.</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </TabPanel>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {getItemsByType('book').length > 0 ? (
                    getItemsByType('book').map(renderItemCard)
                  ) : (
                    <Box textAlign="center" gridColumn="1 / -1" py={10}>
                      <Text color="white" fontSize="lg" bg="whiteAlpha.200" p={4} borderRadius="lg">No books found. Try adjusting your search.</Text>
                    </Box>
                  )}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button
            onClick={() => navigate('/')}
            variant="magical"
            size="lg"
            bg="whiteAlpha.200"
            _hover={{ bg: 'whiteAlpha.300', transform: 'translateY(-2px)' }}
            border="1px solid"
            borderColor="whiteAlpha.400"
            backdropFilter="blur(10px)"
            transition="all 0.3s ease"
            fontWeight="bold"
            color="white"
          >
            Return to Home
          </Button>
        </VStack>
      </Container>

      {renderDetailModal()}
    </Box>
  );
};

export default Encyclopedia; 