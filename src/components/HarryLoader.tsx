import { Box } from '@chakra-ui/react';

const HarryLoader = () => {
  return (
    <Box
      minH="100vh"
      bgImage="url('/src/assets/j1vknfng.png')"
      bgSize="cover"
      bgPosition="center"
      bgRepeat="no-repeat"
      position="relative"
      display="flex"
      alignItems="center"
      justifyContent="center"
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
      <Box
        className="harry-loader"
        position="relative"
        zIndex={2}
      />
      <style>
        {`
          .harry-loader {
            width: 100px;
            height: 40px;
            background: linear-gradient(90deg, #1a1a1a, #2a2a2a);
            border: 2px solid #d4af37;
            border-radius: 8px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 0 12px #d4af37 inset, 0 0 6px #000;
            animation: harry-bg-flash 2s infinite ease-in-out;
          }

          .harry-loader::before,
          .harry-loader::after {
            content: "";
            position: absolute;
            inset: 0;
            background-image: radial-gradient(circle, #fdf6d3 0.8px, transparent 1px);
            background-size: 18px 18px;
            animation: sparkle 0.4s linear infinite;
            opacity: 0.8;
          }

          .harry-loader::after {
            background-size: 10px 10px;
            animation-duration: 0.6s;
            opacity: 0.5;
          }

          @keyframes harry-bg-flash {
            0%, 100% { box-shadow: 0 0 12px #d4af37 inset, 0 0 6px #000; }
            50% { box-shadow: 0 0 18px #ffd700 inset, 0 0 12px #333; }
          }

          @keyframes sparkle {
            0% { transform: translateY(0); }
            100% { transform: translateY(20px); }
          }
        `}
      </style>
    </Box>
  );
};

export default HarryLoader; 