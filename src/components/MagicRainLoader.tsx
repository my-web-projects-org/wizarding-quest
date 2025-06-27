import { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

const MagicRainLoader = () => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader) return;

    const particleCount = 60;

    // Clear any existing particles
    loader.innerHTML = '';

    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${2 + Math.random() * 3}s`;
      particle.style.animationDelay = `${Math.random() * 3}s`;
      const size = 2 + Math.random() * 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      loader.appendChild(particle);
    }

    // Cleanup function
    return () => {
      loader.innerHTML = '';
    };
  }, []);

  return (
    <Box
      minH="100vh"
      bgImage="url('/src/assets/j1vknfng.png')"
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
        bg="blackAlpha.800"
        zIndex={1}
      />
      <Box
        ref={loaderRef}
        className="magic-loader"
        position="relative"
        zIndex={2}
      />
      <style>
        {`
          .magic-loader {
            position: relative;
            width: 100vw;
            height: 100vh;
          }

          .particle {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #ffeaa7;
            border-radius: 50%;
            opacity: 0.8;
            animation: fall linear infinite;
            box-shadow: 0 0 8px #ffeaa7;
          }

          @keyframes fall {
            0% {
              transform: translateY(0) scale(1);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) scale(0.5);
              opacity: 0;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default MagicRainLoader; 