import React from 'react';
import { Box, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const rovers = [
  {
    name: 'Curiosity',
    id: 'curiosity',
    img: '/images/curiosity.png',
    style: {
      width: { xs: '45%', sm: '35%', md: '30%' },
      top: { xs: '65%', sm: '35%', md: '20%' },
      left: { xs: '5%', sm: '10%', md: '15%' },
      zIndex: 2,
    },
  },
  {
    name: 'Opportunity',
    id: 'opportunity',
    img: '/images/oppurtunity.png',
    style: {
      width: { xs: '30%', sm: '30%', md: '25%' },
      top: { xs: '80%', sm: '50%', md: '40%' },
      left: { xs: '50%', sm: '45%', md: '46%' },
      zIndex: 2,
    },
  },
  {
    name: 'Spirit',
    id: 'spirit',
    img: '/images/spirit.png',
    style: {
      width: { xs: '30%', sm: '25%', md: '20%' },
      top: { xs: '45%', sm: '5%', md: '-13%' },
      left: { xs: '55%', sm: '58%', md: '60%' },
      zIndex: 1,
    },
  },
];
//gallery to select the rover for exploring its photos
const MarsRoverSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      position: 'relative',
      width: '100%',
      height: { xs: '30vh', sm: '40vh', md: '50vh' },
      minHeight: '200px',
    }}>
      {rovers.map((rover) => (
        <Box
          key={rover.id}
          onClick={() => navigate(`/mars/${rover.id}`)}
          sx={{
            position: 'absolute',
            ...rover.style,
            cursor: 'pointer',
            transition: 'transform 0.3s ease-in-out',
            '&:hover': {
              transform: 'scale(1.4)',
              zIndex: 3,
            },
            '& .rover-name': {
              transition: 'opacity 0.3s ease-in-out',
              opacity: 0,
            },
            '&:hover .rover-name': {
              opacity: 1,
            },
          }}
        >
          <Box
            className="rover-name"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'linear-gradient(45deg, rgba(206, 124, 86, 0.8), rgba(192, 57, 43, 0.8))',
              p: { xs: '2px 8px', sm: '4px 12px' },
              borderRadius: '12px',
              zIndex: 1,
              backdropFilter: 'blur(4px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
            }}
          >
            <Typography 
              variant="subtitle2" 
              color="white" 
              align="center"
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.9rem' },
              }}
            >
              {rover.name}
            </Typography>
          </Box>
          <img 
            src={rover.img} 
            alt={rover.name}  
            style={{ 
              width: '100%', 
              height: 'auto', 
              objectFit: 'contain', 
              display: 'block',
              filter: 'drop-shadow(5px 5px 15px rgba(0,0,0,0.5))',
            }} 
          />
        </Box>
      ))}
    </Box>
  );
};

export default MarsRoverSelector; 