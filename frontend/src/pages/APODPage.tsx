import React from 'react';
import { Box } from '@mui/material';
import APODSection from '../components/common/APODSection';

const APODPage: React.FC = () => {
  return (
    <Box
      sx={{
        background: 'transparent',
        padding: { xs: 2, md: 4 },
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <APODSection />
    </Box>
  );
};

export default APODPage; 