import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  useTheme,
  useMediaQuery,
  Menu,
  
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';

// components for space theme
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: 'linear-gradient(90deg, #0A0A0F 0%, #1A1A2E 100%)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(74, 144, 226, 0.2)',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  [theme.breakpoints.down('sm')]: {
    minHeight: '56px',
  },
}));

const ContentWrapper = styled('div')({
  position: 'relative',
  zIndex: 1,
  paddingTop: '16px',
  paddingBottom: '16px',
  width: '100%',
});

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'NASA Data Explorer' }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box sx={{ minHeight: '100vh' }}>
      <StyledAppBar position="static">
        <Toolbar sx={{ minHeight: { xs: '56px', md: '64px' } }}>
          <Typography
            variant={isMobile ? 'h6' : 'h5'}
            component="div"
            sx={{
              flexGrow: 1,
              background: 'linear-gradient(45deg, #4A90E2, #7BB3F0)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
              letterSpacing: { xs: '0.05em', md: '0.1em' },
              fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' },
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            {title}
          </Typography>
          
          

          {/* mobile friendly */}
          {isMobile && (
            <Box>
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                sx={{ color: 'white' }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  '& .MuiPaper-root': {
                    background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
                    border: '1px solid rgba(74, 144, 226, 0.2)',
                  },
                }}
              >
               
              </Menu>
            </Box>
          )}
        </Toolbar>
      </StyledAppBar>

      <Container 
        maxWidth={false} 
        disableGutters
        sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 50%, #16213E 100%)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, #eee, transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
              radial-gradient(1px 1px at 90px 40px, #fff, transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
              radial-gradient(2px 2px at 160px 30px, #ddd, transparent)
            `,
            backgroundRepeat: 'repeat',
            backgroundSize: '200px 100px',
            animation: 'twinkle 20s linear infinite',
            opacity: 0.3,
            zIndex: 0,
          },
        }}
      >
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </Container>
    </Box>
  );
};

export default Layout; 