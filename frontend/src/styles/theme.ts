import { createTheme } from '@mui/material/styles';

// Space theme color palette
const spaceTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4A90E2', // Deep blue
      light: '#7BB3F0',
      dark: '#2E5C8A',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9C27B0', // Purple
      light: '#BA68C8',
      dark: '#7B1FA2',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#0A0A0F', // Very dark blue-black
      paper: '#1A1A2E', // Dark blue-gray
    },
    text: {
      primary: '#E8E8E8',
      secondary: '#B0B0B0',
    },
    error: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#CC5555',
    },
    warning: {
      main: '#FFA726',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    info: {
      main: '#29B6F6',
      light: '#4FC3F7',
      dark: '#0288D1',
    },
    success: {
      main: '#66BB6A',
      light: '#81C784',
      dark: '#388E3C',
    },
    divider: 'rgba(255, 255, 255, 0.12)',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '3.5rem',
      fontWeight: 300,
      letterSpacing: '-0.01562em',
      color: '#FFFFFF',
    },
    h2: {
      fontSize: '3rem',
      fontWeight: 300,
      letterSpacing: '-0.00833em',
      color: '#FFFFFF',
    },
    h3: {
      fontSize: '2.5rem',
      fontWeight: 400,
      letterSpacing: '0em',
      color: '#FFFFFF',
    },
    h4: {
      fontSize: '2rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
      color: '#FFFFFF',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0em',
      color: '#FFFFFF',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      color: '#FFFFFF',
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '0.00938em',
      color: '#E8E8E8',
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '0.01071em',
      color: '#B0B0B0',
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '0.02857em',
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 4px 14px 0 rgba(74, 144, 226, 0.3)',
          '&:hover': {
            boxShadow: '0 6px 20px 0 rgba(74, 144, 226, 0.4)',
          },
        },
        contained: {
          background: 'linear-gradient(45deg, #4A90E2 30%, #7BB3F0 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #2E5C8A 30%, #4A90E2 90%)',
          },
        },
        outlined: {
          borderColor: '#4A90E2',
          color: '#4A90E2',
          '&:hover': {
            borderColor: '#7BB3F0',
            backgroundColor: 'rgba(74, 144, 226, 0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(74, 144, 226, 0.2)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          backdropFilter: 'blur(4px)',
          '&:hover': {
            borderColor: 'rgba(74, 144, 226, 0.4)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A2E',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(90deg, #0A0A0F 0%, #1A1A2E 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(74, 144, 226, 0.2)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: 'linear-gradient(180deg, #0A0A0F 0%, #1A1A2E 100%)',
          borderRight: '1px solid rgba(74, 144, 226, 0.2)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(74, 144, 226, 0.1)',
          border: '1px solid rgba(74, 144, 226, 0.3)',
          color: '#4A90E2',
          '&:hover': {
            backgroundColor: 'rgba(74, 144, 226, 0.2)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(74, 144, 226, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(74, 144, 226, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#4A90E2',
            },
          },
        },
      },
    },
  },
});

export default spaceTheme; 