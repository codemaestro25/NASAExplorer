import React from 'react';
import { Box, Typography, Card, CardContent, Alert } from '@mui/material';

interface SectionIntroCardProps {
  title: string;
  cardTitle: string;
  cardDescription: string;
  cardStats: React.ReactNode;
  error?: string | null;
  visible: boolean;
  align?: 'left' | 'right';
}

const monospace = `'Fira Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace`;

const SectionIntroCard: React.FC<SectionIntroCardProps> = ({
  title,
  cardTitle,
  cardDescription,
  cardStats,
  error,
  visible,
  align = 'left',
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: { xs: 'center', md: align === 'left' ? 'flex-start' : 'flex-end' },
        justifyContent: 'center',
        width: { xs: '100%', md: 400 },
        zIndex: 2,
        gap: 2,
        ml: align === 'left' ? { xs: 0, md: 6 } : 0,
        mr: align === 'right' ? { xs: 0, md: 6 } : 0,
        order: { xs: 2, md: 1 },
        fontFamily: monospace,
      }}
    >
      <Typography
        variant={align === 'left' ? 'h3' : 'h3'}
        color="primary"
        sx={{
          fontWeight: 900,
          mb: 0,
          textAlign: { xs: 'center', md: align === 'left' ? 'left' : 'right' },
          letterSpacing: '0.03em',
          textShadow: '0 4px 32px rgba(74,144,226,0.15)',
          alignSelf: { xs: 'center', md: align === 'left' ? 'flex-start' : 'flex-end' },
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3.75rem' },
          fontFamily: monospace,
          background: 'linear-gradient(90deg, #4A90E2, #7BB3F0, #fff, #4A90E2)',
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: visible ? 'shimmer 3s linear infinite' : 'none',
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '200% center' },
            '100%': { backgroundPosition: '0% center' },
          },
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(40px)',
          transition: 'opacity 0.7s, transform 0.7s',
        }}
      >
        {title}
      </Typography>
      <Card
        sx={{
          background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
          border: '1px solid rgba(74, 144, 226, 0.2)',
          boxShadow: '0 8px 32px rgba(74,144,226,0.08)',
          maxWidth: { xs: '100%', md: 400 },
          width: '100%',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 1.1s 0.3s, transform 1.1s 0.3s',
          fontFamily: monospace,
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" color="primary" gutterBottom sx={{ fontSize: { xs: '1.3rem', md: '1.6rem' } }}>
            {cardTitle}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
            {cardDescription}
          </Typography>
          <Box sx={{ mt: 2 }}>{cardStats}</Box>
        </CardContent>
      </Card>
      {error && (
        <Alert severity="error" sx={{ maxWidth: { xs: '100%', md: 400 }, mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default SectionIntroCard; 