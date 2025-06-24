import React from 'react';
import { Box, Typography, Button, Zoom } from '@mui/material';
import { styled, css } from '@mui/material/styles';

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
    width: { xs: '120px', sm: '160px', md: '200px' },
    height: { xs: '120px', sm: '160px', md: '200px' },
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

const glow = css`
  @keyframes glow {
    from { 
      filter: drop-shadow(0 0 10px rgba(74, 144, 226, 0.5));
    }
    to { 
      filter: drop-shadow(0 0 20px rgba(74, 144, 226, 0.8));
    }
  }
`;

const NASALogo = styled(Typography)`
  font-size: 4rem;
  font-weight: bold;
  background: linear-gradient(45deg, #4A90E2, #7BB3F0, #9C27B0);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  letter-spacing: 0.2em;
  animation: glow 2s ease-in-out infinite alternate;
  ${glow}

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 2.5rem;
    letter-spacing: 0.1em;
  }
`;

const fadeInUp = css`
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to: {
      opacity: 1,
      transform: translateY(0);
    }
  }
`;

const Subtitle = styled(Typography)`
  font-size: 1.5rem;
  color: #B0B0B0;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing(4)};
  animation: fadeInUp 1s ease-out 0.5s both;
  ${fadeInUp}

  ${({ theme }) => theme.breakpoints.down('sm')} {
    font-size: 1.2rem;
    margin-bottom: ${({ theme }) => theme.spacing(2)};
  }
`;

const bounceIn = css`
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      opacity: 1,
      transform: scale(1);
    }
  }
`;

const ExploreButton = styled(Button)`
  background: linear-gradient(45deg, #4A90E2 30%, #7BB3F0 90%);
  border: 0;
  border-radius: 25px;
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.3);
  color: white;
  height: 56px;
  padding: 0 48px;
  font-size: 1.1rem;
  font-weight: bold;
  text-transform: none;
  letter-spacing: 0.1em;
  transition: all 0.3s ease;
  animation: bounceIn 1s ease-out 1s both;
  ${bounceIn}

  &:hover {
    background: linear-gradient(45deg, #2E5C8A 30%, #4A90E2 90%);
    box-shadow: 0 12px 40px rgba(74, 144, 226, 0.5);
    transform: translateY(-2px);
  }

  ${({ theme }) => theme.breakpoints.down('sm')} {
    height: 48px;
    padding: 0 32px;
    font-size: 1rem;
    border-radius: 20px;
    letter-spacing: 0.05em;
  }
`;

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
          px: { xs: 2, md: 0 },
        }}
      >
        <LogoContainer>
          <Zoom in={fade > 0.1} timeout={1000}>
            <NASALogo variant="h1">
              NASA
            </NASALogo>
          </Zoom>
        </LogoContainer>
        <Subtitle variant="h4"
        sx={{
          fontFamily: 'monospace',
          color: '#B0B0B0',
          mb: { xs: 2, md: 4 },
          fontSize: { xs: '1.5rem', sm: '1.8rem' , md: '2.2rem'},
          px: { xs: 1, md: 0 },
          lineHeight: { xs: 1.4, md: 1.5 },
        }}
        >
         Earth & Mars explorer
        </Subtitle>
        <Typography
          variant="body1"
          sx={{
            fontFamily: 'monospace',
            color: '#B0B0B0',
            mb: { xs: 2, md: 4 },
            fontSize: { xs: '1.0rem', sm: '1.2rem' , md: '1.4rem'},
            px: { xs: 1, md: 0 },
            lineHeight: { xs: 1.4, md: 1.5 },
          }}
        >
          Explore NASA's Earth, asteroid, and Mars rover data in a beautiful, interactive 3D experience supported by NASA's API.
        </Typography>
        <ExploreButton onClick={onExplore} size="large">
          Explore Now
        </ExploreButton>
      </CenteredContent>
    </SplashContainer>
  );
};

export default SplashScreen; 