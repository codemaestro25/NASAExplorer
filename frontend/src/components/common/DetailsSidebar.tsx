import React from 'react';
import { Drawer, Dialog, DialogContent, useMediaQuery, useTheme, IconButton } from '@mui/material';
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
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogContent sx={{ position: 'relative', p: 3 }}>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
          {children}
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
          width: 400,
          maxWidth: '90vw',
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          color: '#fff',
          p: 3,
        },
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8, color: theme.palette.grey[500] }}
      >
        <CloseIcon />
      </IconButton>
      <div style={{ marginTop: 40 }}>{children}</div>
    </Drawer>
  );
};

export default DetailsSidebar; 