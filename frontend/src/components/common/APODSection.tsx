import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, CardContent, CircularProgress, Alert, useTheme, Fade, Grow, Slide } from '@mui/material';
import { apodApi } from '../../services/backendApi';
import type { APODResponse } from '../../types/nasa';

const monospace = `'Fira Mono', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', monospace`;

const APODSection: React.FC = () => {
  const [apod, setApod] = useState<APODResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Intersection Observer for scroll-triggered animation
  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchAPOD = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await apodApi.getToday();
        setApod(data);
      } catch (err) {
        setError(`Failed to fetch Astronomy Picture of the Day: ${err}`);
      } finally {
        setLoading(false);
      }
    };
    fetchAPOD();
  }, []);

  return (
    <Box
      ref={sectionRef}
      sx={{
        width: '100%',
        maxWidth: 1600,
        mx: 'auto',
        mt: { xs: 4, md: 8 },
        mb: { xs: 4, md: 8 },
        px: { xs: 1, md: 0 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: monospace,
      }}
    >
      {/* animated gradient title */}
      <Grow in={visible} timeout={900}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 900,
            letterSpacing: 2,
            mb: 5,
            fontFamily: monospace,
            background: 'linear-gradient(90deg, #4A90E2, #7BB3F0, #fff, #4A90E2)',
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'shimmer 3s linear infinite',
            '@keyframes shimmer': {
              '0%': { backgroundPosition: '200% center' },
              '100%': { backgroundPosition: '0% center' },
            },
            textShadow: '0 2px 24px rgba(74,144,226,0.25)',
          }}
        >
          Astronomy Picture of the Day
        </Typography>
      </Grow>
      <Fade in={loading} unmountOnExit>
        <Box sx={{ display: loading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', py: 8, width: '100%' }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main, animation: 'spin 1.2s linear infinite' }} />
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </Box>
      </Fade>
      {!loading && error && (
        <Alert severity="error" sx={{ fontFamily: monospace }}>{error}</Alert>
      )}
      {!loading && apod && (
        <Grow in={visible} timeout={1200} style={{ transformOrigin: 'left center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch',
              gap: { xs: 4, md: 8 },
              width: '100%',
              background: 'rgba(10, 10, 20, 0.35)',
              borderRadius: 8,
              boxShadow: 8,
              p: { xs: 1, md: 4 },
              backdropFilter: 'blur(2px)',
              fontFamily: monospace,
            }}
          >
            {/* sliding in animation or img */}
            <Slide in={visible} direction="up" timeout={1400} mountOnEnter unmountOnExit>
              <Box
                sx={{
                  flex: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: 0,
                  maxWidth: { xs: '100%', md: 800 },
                  borderRadius: 8,
                  overflow: 'visible',
                  boxShadow: '0 8px 32px 0 rgba(0,0,0,0.35)',
                  background: 'none',
                }}
              >
                {apod.media_type === 'image' ? (
                  <img
                    src={apod.hdurl || apod.url}
                    alt={apod.title}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: 32,
                      boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
                      margin: 0,
                      maxHeight: 700,
                      objectFit: 'cover',
                    }}
                  />
                ) : apod.media_type === 'video' ? (
                  <Box sx={{ position: 'relative', width: '100%', height: 0, paddingTop: '56.25%' }}>
                    <iframe
                      src={apod.url}
                      title={apod.title}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 0,
                        borderRadius: 32,
                        boxShadow: '0 8px 32px 0 rgba(0,0,0,0.45)',
                      }}
                    />
                  </Box>
                ) : null}
              </Box>
            </Slide>
            {/* info card */}
            <Slide in={visible} direction="left" timeout={1700} mountOnEnter unmountOnExit>
              <CardContent
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                  background: 'none',
                  p: 0,
                  color: 'white',
                  minWidth: 0,
                  fontFamily: monospace,
                }}
              >
                <Grow in={visible} timeout={2000}>
                  <Typography variant="h4" color="primary" sx={{ fontWeight: 700, mb: 1, fontFamily: monospace }}>
                    {apod.title}
                  </Typography>
                </Grow>
                <Fade in={visible} timeout={2200}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2, fontFamily: monospace }}>
                    {apod.date}
                  </Typography>
                </Fade>
                <Fade in={visible} timeout={2500}>
                  <Typography variant="body1" color="text.primary" sx={{ mb: 2, fontSize: { xs: '1.1rem', md: '1.2rem' }, fontFamily: monospace }}>
                    {apod.explanation}
                  </Typography>
                </Fade>
                {apod.copyright && (
                  <Fade in={visible} timeout={2700}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: monospace }}>
                      &copy; {apod.copyright}
                    </Typography>
                  </Fade>
                )}
              </CardContent>
            </Slide>
          </Box>
        </Grow>
      )}
    </Box>
  );
};

export default APODSection; 