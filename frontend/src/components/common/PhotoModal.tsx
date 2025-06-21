import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import {
  Dialog,
  DialogContent,
  IconButton,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface PhotoModalProps {
  photos: any[];
  isLargeScreen?: boolean;
}

export interface PhotoModalRef {
  handlePhotoClick: (photo: any) => void;
}

const PhotoModal = forwardRef<PhotoModalRef, PhotoModalProps>(({ photos, isLargeScreen: externalIsLargeScreen }, ref) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const theme = useTheme();
  const internalIsLargeScreen = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = externalIsLargeScreen ?? internalIsLargeScreen;

  const handlePhotoClick = useCallback((photo: any) => {
    if (isLargeScreen) {
      setSelectedPhoto(photo);
      setIsModalOpen(true);
    }
  }, [isLargeScreen]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  // Expose the click handler to parent components
  useImperativeHandle(ref, () => ({
    handlePhotoClick
  }), [handlePhotoClick]);

  if (!photos || photos.length === 0) return null;

  return (
    <>
      {/* Photo Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(26, 26, 46, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(74, 144, 226, 0.3)',
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          {selectedPhoto && (
            <Box sx={{ p: 3 }}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2
              }}>
                <img 
                  src={selectedPhoto.img_src} 
                  alt={selectedPhoto.camera?.full_name || 'Mars Rover Photo'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '70vh',
                    objectFit: 'contain',
                    borderRadius: 12,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                  }}
                />
                
                <Box sx={{ 
                  textAlign: 'center', 
                  width: '100%',
                  mt: 2
                }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {selectedPhoto.camera?.full_name || 'Unknown Camera'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    Earth Date: {selectedPhoto.earth_date}
                  </Typography>
                  {selectedPhoto.sol && (
                    <Typography variant="body2" color="text.secondary">
                      Sol: {selectedPhoto.sol}
                    </Typography>
                  )}
                  {selectedPhoto.rover && (
                    <Typography variant="body2" color="text.secondary">
                      Rover: {selectedPhoto.rover.name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
});

PhotoModal.displayName = 'PhotoModal';

export default PhotoModal; 