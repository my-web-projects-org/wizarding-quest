import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    gryffindor: {
      primary: '#740001',
      secondary: '#D3A625',
    },
    slytherin: {
      primary: '#1A472A',
      secondary: '#5D5D5D',
    },
    ravenclaw: {
      primary: '#0E1A40',
      secondary: '#946B2D',
    },
    hufflepuff: {
      primary: '#ECB939',
      secondary: '#372E29',
    },
    parchment: '#F4E4BC',
  },
  fonts: {
    heading: '"MedievalSharp", cursive',
    body: '"MedievalSharp", cursive',
  },
  styles: {
    global: {
      body: {
        bg: '#1A202C',
        color: 'whiteAlpha.900',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'bold',
        borderRadius: 'md',
        fontFamily: '"MedievalSharp", cursive',
      },
      variants: {
        magical: {
          bg: 'gryffindor.primary',
          color: 'white',
          _hover: {
            bg: 'gryffindor.secondary',
          },
        },
      },
    },
    Heading: {
      baseStyle: {
        fontFamily: '"MedievalSharp", cursive',
      },
    },
    Text: {
      baseStyle: {
        fontFamily: '"MedievalSharp", cursive',
      },
    },
  },
});

export default theme; 