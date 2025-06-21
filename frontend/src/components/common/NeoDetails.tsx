import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';

interface NeoDetailsProps {
  neo: any;
  loading: boolean;
  error: string | null;
}

const NeoDetails: React.FC<NeoDetailsProps> = ({ neo, loading, error }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: { xs: 150, sm: 200 },
        p: { xs: 2, sm: 0 }
      }}>
        <CircularProgress size={isMobile ? 32 : 40} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="error"
        sx={{ 
          fontSize: { xs: '0.875rem', sm: '1rem' },
          p: { xs: 1, sm: 2 }
        }}
      >
        {error}
      </Alert>
    );
  }

  if (!neo) {
    return null;
  }

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
        {neo.name}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          mb: { xs: 0.5, sm: 1 }
        }}
      >
        NEO ID: {neo.id}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          mb: { xs: 0.5, sm: 1 }
        }}
      >
        Absolute Magnitude: {neo.absolute_magnitude_h}
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          mb: { xs: 0.5, sm: 1 },
          lineHeight: { xs: 1.3, sm: 1.4 }
        }}
      >
        Estimated Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
      </Typography>
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{ 
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
          mb: { xs: 1, sm: 1.5 }
        }}
      >
        Potentially Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
      </Typography>
      {neo.close_approach_data && neo.close_approach_data.length > 0 && (
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
            Close Approach Data:
          </Typography>
          {neo.close_approach_data.map((cad: any, idx: number) => (
            <Box key={idx} sx={{ mb: { xs: 1, sm: 1.5 } }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mb: { xs: 0.25, sm: 0.5 }
                }}
              >
                Date: {cad.close_approach_date_full || cad.close_approach_date}
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mb: { xs: 0.25, sm: 0.5 }
                }}
              >
                Miss Distance: {cad.miss_distance.kilometers} km
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  mb: { xs: 0.5, sm: 1 }
                }}
              >
                Relative Velocity: {cad.relative_velocity.kilometers_per_hour} km/h
              </Typography>
            </Box>
          ))}
        </Box>
      )}
      <Button
        href={neo.nasa_jpl_url}
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
        NASA JPL Details
      </Button>
    </Box>
  );
};

export default NeoDetails; 