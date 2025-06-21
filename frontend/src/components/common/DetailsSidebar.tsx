import React from 'react';
import { Drawer, Dialog, DialogContent, useMediaQuery, useTheme, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface DetailsSidebarProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const DetailsSidebar: React.FC<DetailsSidebarProps> = ({ open, onClose, children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (isMobile) {
    return (
      <Dialog 
        open={open} 
        onClose={onClose} 
        fullWidth 
        maxWidth="sm"
        PaperProps={{
          sx: {
            margin: { xs: 1, sm: 2 },
            maxHeight: '90vh',
            borderRadius: { xs: 2, sm: 3 },
          }
        }}
      >
        <DialogContent sx={{ 
          position: 'relative', 
          p: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(74, 144, 226, 0.5)',
            borderRadius: '3px',
          },
        }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ 
              position: 'absolute', 
              right: { xs: 4, sm: 8 }, 
              top: { xs: 4, sm: 8 }, 
              color: theme.palette.grey[500],
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box sx={{ mt: { xs: 3, sm: 4 } }}>
            {children}
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { sm: 350, md: 400 },
          maxWidth: '90vw',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          color: '#fff',
          p: { sm: 2, md: 3 },
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(74, 144, 226, 0.5)',
            borderRadius: '3px',
          },
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ 
          position: 'absolute', 
          right: { sm: 4, md: 8 }, 
          top: { sm: 4, md: 8 }, 
          color: theme.palette.grey[500],
          zIndex: 1,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }
        }}
      >
        <CloseIcon />
      </IconButton>
      <Box sx={{ marginTop: { sm: 40, md: 40 } }}>
        {children}
      </Box>
    </Drawer>
  );
};

export default DetailsSidebar; 