import React from 'react';
import { Box, Typography, Button, CircularProgress, Alert } from '@mui/material';

interface NeoDetailsProps {
  neo: any;
  loading: boolean;
  error: string | null;
}

const NeoDetails: React.FC<NeoDetailsProps> = ({ neo, loading, error }) => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!neo) {
    return null;
  }

  return (
    <Box>
      <Typography variant="h5" color="primary" gutterBottom>
        {neo.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        NEO ID: {neo.id}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Absolute Magnitude: {neo.absolute_magnitude_h}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Estimated Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Potentially Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
      </Typography>
      {neo.close_approach_data && neo.close_approach_data.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="primary" gutterBottom>
            Close Approach Data:
          </Typography>
          {neo.close_approach_data.map((cad: any, idx: number) => (
            <Box key={idx} sx={{ mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Date: {cad.close_approach_date_full || cad.close_approach_date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Miss Distance: {cad.miss_distance.kilometers} km
              </Typography>
              <Typography variant="body2" color="text.secondary">
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
        sx={{ mt: 2 }}
      >
        NASA JPL Details
      </Button>
    </Box>
  );
};

export default NeoDetails; 