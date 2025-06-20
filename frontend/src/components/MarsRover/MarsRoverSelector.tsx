import React from 'react';
import { Box, Typography, Card, CardActionArea, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const rovers = [
  {
    name: 'Curiosity',
    id: 'curiosity',
    img: 'https://mars.nasa.gov/system/feature_items/images/6037_msl_banner.jpg',
  },
  {
    name: 'Opportunity',
    id: 'opportunity',
    img: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/NASA_Mars_Rover.jpg',
  },
  {
    name: 'Spirit',
    id: 'spirit',
    img: 'https://assets.science.nasa.gov/dynamicimage/assets/science/psd/solar/2023/07/rover2-1.jpg?w=1280&h=960&fit=clip&crop=faces%2Cfocalpoint',
  },
];

const MarsRoverSelector: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
      {rovers.map((rover) => (
        <Card key={rover.id} sx={{ width: 300, borderRadius: 4, boxShadow: 6, background: 'rgba(40,20,10,0.85)' }}>
          <CardActionArea onClick={() => navigate(`/mars/${rover.id}`)}>
            <CardMedia
              component="img"
              height="180"
              image={rover.img}
              alt={rover.name}
              sx={{ objectFit: 'cover', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
            />
            <CardContent>
              <Typography variant="h5" color="primary" align="center">
                {rover.name}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
};

export default MarsRoverSelector; 