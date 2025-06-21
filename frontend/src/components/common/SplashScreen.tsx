import React from 'react';
import { Box, Typography, Button, Zoom } from '@mui/material';
import { styled } from '@mui/material/styles';

const SplashContainer = styled(Box)({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
});

const CenteredContent = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  zIndex: 2,
  textAlign: 'center',
  transition: 'opacity 0.6s, transform 0.6s',
});

const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 3s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { 
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 0.5,
    },
    '50%': { 
      transform: 'translate(-50%, -50%) scale(1.2)',
      opacity: 0.8,
    },
  },
}));

const NASALogo = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #4A90E2, #7BB3F0, #9C27B0)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  letterSpacing: '0.2em',
  animation: 'glow 2s ease-in-out infinite alternate',
  '@keyframes glow': {
    from: { 
      filter: 'drop-shadow(0 0 10px rgba(74, 144, 226, 0.5))',
    },
    to: { 
      filter: 'drop-shadow(0 0 20px rgba(74, 144, 226, 0.8))',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: '#B0B0B0',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  animation: 'fadeInUp 1s ease-out 0.5s both',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));

const ExploreButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4A90E2 30%, #7BB3F0 90%)',
  border: 0,
  borderRadius: 25,
  boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 48px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  letterSpacing: '0.1em',
  transition: 'all 0.3s ease',
  animation: 'bounceIn 1s ease-out 1s both',
  '&:hover': {
    background: 'linear-gradient(45deg, #2E5C8A 30%, #4A90E2 90%)',
    boxShadow: '0 12px 40px rgba(74, 144, 226, 0.5)',
    transform: 'translateY(-2px)',
  },
  '@keyframes bounceIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.3)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.05)',
    },
    '70%': {
      transform: 'scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

interface SplashScreenProps {
  fade: number;
  translateY: number;
  onExplore: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ fade, translateY, onExplore }) => {
  return (
    <SplashContainer>
      <CenteredContent
        sx={{
          opacity: fade,
          transform: `translate(-50%, -50%) translateY(${translateY}px)`,
          pointerEvents: fade < 0.1 ? 'none' : 'auto',
        }}
      >
        <LogoContainer>
          <Zoom in={fade > 0.1} timeout={1000}>
            <NASALogo variant="h1">
              NASA
            </NASALogo>
          </Zoom>
        </LogoContainer>
        <Subtitle variant="h4">
          Data Explorer
        </Subtitle>
        <Typography
          variant="body1"
          sx={{
            color: '#B0B0B0',
            mb: 4,
          }}
        >
          Explore NASA's Earth, asteroid, and Mars rover data in a beautiful, interactive 3D experience.
        </Typography>
        <ExploreButton onClick={onExplore} size="large">
          Explore Now
        </ExploreButton>
      </CenteredContent>
    </SplashContainer>
  );
};

export default SplashScreen; 