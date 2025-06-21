import React from 'react';
import { Box, Typography, Chip, Button, useTheme, useMediaQuery } from '@mui/material';
import type { EONETEvent } from '../../types/nasa';

interface EonetEventDetailsProps {
  event: EONETEvent;
}

const EonetEventDetails: React.FC<EonetEventDetailsProps> = ({ event }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ p: { xs: 1, sm: 0 } }}>
      <Typography 
        variant={isMobile ? "h6" : "h5"} 
        color="primary" 
        gutterBottom
        sx={{ 
          fontSize: { xs: '1.25rem', sm: '1.5rem' },
          lineHeight: { xs: 1.3, sm: 1.4 },
          mb: { xs: 1, sm: 2 }
        }}
      >
        {event.title}
      </Typography>
      <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
        {event.categories.map((category) => (
          <Chip
            key={category.id}
            label={category.title}
            size={isMobile ? "small" : "medium"}
            sx={{
              mr: 1,
              mb: 1,
              backgroundColor: '#4A90E2',
              color: 'white',
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              height: { xs: 24, sm: 32 },
            }}
          />
        ))}
      </Box>
      <Typography 
        variant="body1" 
        paragraph
        sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          lineHeight: { xs: 1.4, sm: 1.5 },
          mb: { xs: 1.5, sm: 2 }
        }}
      >
        {event.description}
      </Typography>
      {event.geometry && event.geometry.length > 0 && (
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            mb: { xs: 1, sm: 1.5 }
          }}
        >
          Location: {event.geometry[0].coordinates[1].toFixed(2)}°N, 
          {event.geometry[0].coordinates[0].toFixed(2)}°E
        </Typography>
      )}
      {event.sources && event.sources.length > 0 && (
        <Box sx={{ mt: { xs: 1.5, sm: 2 } }}>
          <Typography 
            variant="subtitle2" 
            color="primary" 
            gutterBottom
            sx={{ 
              fontSize: { xs: '0.875rem', sm: '1rem' },
              mb: { xs: 0.5, sm: 1 }
            }}
          >
            Sources:
          </Typography>
          {event.sources.map((source) => (
            <Typography 
              key={source.id} 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                mb: { xs: 0.5, sm: 0.5 },
                wordBreak: 'break-word'
              }}
            >
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
          size={isMobile ? "small" : "medium"}
          sx={{ 
            mt: { xs: 1.5, sm: 2 },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
            px: { xs: 2, sm: 3 },
            py: { xs: 0.75, sm: 1 }
          }}
        >
          View Source
        </Button>
      )}
    </Box>
  );
};

export default EonetEventDetails; 