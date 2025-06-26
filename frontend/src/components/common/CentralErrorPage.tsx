import React from 'react';
import { Box, Typography, Button } from '@mui/material';

const CentralErrorPage: React.FC<{ onRetry?: () => void }> = ({ onRetry }) => (
  <Box
    sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: '#181A2A',
      color: '#fff',
      textAlign: 'center',
      p: 4,
    }}
  >
    <img src="/error.png" alt="Error" style={{ width: 120, marginBottom: 24 }} />
    <Typography variant="h4" gutterBottom>
      Oops! Something went wrong.
    </Typography>
    <Typography variant="body1" sx={{ mb: 3 }}>
      I am having trouble connecting to our Spacecrafts.<br />
      Please bear with me till I fix your Space journey.
    </Typography>
    {onRetry && (
      <Button
        variant="contained"
        color="primary"
        onClick={onRetry}
        sx={{ mt: 2 }}
      >
        Retry
      </Button>
    )}
  </Box>
);

export default CentralErrorPage; 