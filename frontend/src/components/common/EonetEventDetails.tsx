import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import type { EONETEvent } from '../../types/nasa';

interface EonetEventDetailsProps {
  event: EONETEvent;
}

const EonetEventDetails: React.FC<EonetEventDetailsProps> = ({ event }) => {
  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        {event.title}
      </Typography>
      <Box sx={{ mb: 2 }}>
        {event.categories.map((category) => (
          <Chip
            key={category.id}
            label={category.title}
            sx={{
              mr: 1,
              backgroundColor: '#4A90E2',
              color: 'white',
            }}
          />
        ))}
      </Box>
      <Typography variant="body1" paragraph>
        {event.description}
      </Typography>
      {event.geometry && event.geometry.length > 0 && (
        <Typography variant="body2" color="text.secondary">
          Location: {event.geometry[0].coordinates[1].toFixed(2)}°N, 
          {event.geometry[0].coordinates[0].toFixed(2)}°E
        </Typography>
      )}
      {event.sources && event.sources.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Sources:
          </Typography>
          {event.sources.map((source) => (
            <Typography key={source.id} variant="body2" color="text.secondary">
              {source.id}: {source.url}
            </Typography>
          ))}
        </Box>
      )}
      {event.link && (
        <Button 
          href={event.link} 
          target="_blank" 
          variant="contained"
          sx={{ mt: 2 }}
        >
          View Source
        </Button>
      )}
    </Box>
  );
};

export default EonetEventDetails; 