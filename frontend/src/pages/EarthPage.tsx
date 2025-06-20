import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Fab,
  Zoom,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, Info } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/common/Layout';
import Earth3D from '../components/Earth3D/Earth3D';
import { eonetApi, neoApi } from '../services/backendApi';
import type { EONETEvent } from '../types/nasa';
import ParallaxStars from '../components/common/ParallaxStars';
import MarsRoverSelector from '../components/MarsRover/MarsRoverSelector';
import DetailsSidebar from '../components/common/DetailsSidebar';
import { useMediaQuery } from '@mui/material';

const PageContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  position: 'relative',
  overflowX: 'hidden',
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}));

const ScrollIndicator = styled(Fab)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(4),
  left: '50%',
  transform: 'translateX(-50%)',
  background: 'linear-gradient(45deg, #4A90E2, #7BB3F0)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #2E5C8A, #4A90E2)',
  },
}));

const EventCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(74, 144, 226, 0.4)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
  },
}));

const NEOSection = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  zIndex: 1,
}));

const SplashContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',
}));
const CenteredContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: 600,
  zIndex: 2,
  textAlign: 'center',
  transition: 'opacity 0.6s, transform 0.6s',
}));
const LogoContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(4),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '200px',
    height: '200px',
    background: 'radial-gradient(circle, rgba(74, 144, 226, 0.1) 0%, transparent 70%)',
    borderRadius: '50%',
    animation: 'pulse 3s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { 
      transform: 'translate(-50%, -50%) scale(1)',
      opacity: 0.5,
    },
    '50%': { 
      transform: 'translate(-50%, -50%) scale(1.2)',
      opacity: 0.8,
    },
  },
}));
const NASALogo = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 'bold',
  background: 'linear-gradient(45deg, #4A90E2, #7BB3F0, #9C27B0)',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  letterSpacing: '0.2em',
  animation: 'glow 2s ease-in-out infinite alternate',
  '@keyframes glow': {
    from: { 
      filter: 'drop-shadow(0 0 10px rgba(74, 144, 226, 0.5))',
    },
    to: { 
      filter: 'drop-shadow(0 0 20px rgba(74, 144, 226, 0.8))',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '2.5rem',
  },
}));
const Subtitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.5rem',
  color: '#B0B0B0',
  textAlign: 'center',
  marginBottom: theme.spacing(4),
  animation: 'fadeInUp 1s ease-out 0.5s both',
  '@keyframes fadeInUp': {
    from: {
      opacity: 0,
      transform: 'translateY(30px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '1.2rem',
  },
}));
const ExploreButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #4A90E2 30%, #7BB3F0 90%)',
  border: 0,
  borderRadius: 25,
  boxShadow: '0 8px 32px rgba(74, 144, 226, 0.3)',
  color: 'white',
  height: 56,
  padding: '0 48px',
  fontSize: '1.1rem',
  fontWeight: 'bold',
  textTransform: 'none',
  letterSpacing: '0.1em',
  transition: 'all 0.3s ease',
  animation: 'bounceIn 1s ease-out 1s both',
  '&:hover': {
    background: 'linear-gradient(45deg, #2E5C8A 30%, #4A90E2 90%)',
    boxShadow: '0 12px 40px rgba(74, 144, 226, 0.5)',
    transform: 'translateY(-2px)',
  },
  '@keyframes bounceIn': {
    '0%': {
      opacity: 0,
      transform: 'scale(0.3)',
    },
    '50%': {
      opacity: 1,
      transform: 'scale(1.05)',
    },
    '70%': {
      transform: 'scale(0.9)',
    },
    '100%': {
      opacity: 1,
      transform: 'scale(1)',
    },
  },
}));

const EarthPage: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EONETEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EONETEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [neos, setNeos] = useState<any[]>([]);
  const [neosLoading, setNeosLoading] = useState(false);
  const [neosError, setNeosError] = useState<string | null>(null);
  const neoSectionRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedNEO, setSelectedNEO] = useState<any | null>(null);
  const [showNEODetails, setShowNEODetails] = useState(false);
  const [neoDetailsLoading, setNEODetailsLoading] = useState(false);
  const [neoDetailsError, setNEODetailsError] = useState<string | null>(null);
  const [neosLoaded, setNeosLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const eonetRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const neoRef = useRef<HTMLDivElement>(null);
  const [sectionOffsets, setSectionOffsets] = useState({
    eonetTop: 0,
    overlayTop: 0,
    neoTop: 0,
  });

  useEffect(() => {
    fetchEvents();
    if (!neosLoaded) {
      fetchNEOs();
      setNeosLoaded(true);
    }
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useLayoutEffect(() => {
    const calcOffsets = () => {
      setSectionOffsets({
        eonetTop: eonetRef.current?.offsetTop || window.innerHeight,
        overlayTop: overlayRef.current?.offsetTop || window.innerHeight * 2,
        neoTop: neoRef.current?.offsetTop || window.innerHeight * 3,
      });
    };
    calcOffsets();
    window.addEventListener('resize', calcOffsets);
    return () => window.removeEventListener('resize', calcOffsets);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eonetApi.getEvents({ days: 30, limit: 50 });
      setEvents(response.events);
    } catch (err) {
      setError('Failed to fetch Earth events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchNEOs = async () => {
    setNeosLoading(true);
    setNeosError(null);
    try {
      const today = new Date();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const start = weekAgo.toISOString().slice(0, 10);
      const end = today.toISOString().slice(0, 10);
      const res = await neoApi.getFeed(start, end);
      const allNeos = Object.values(res.near_earth_objects).flat();
      setNeos(allNeos);
    } catch (err) {
      setNeosError('Failed to fetch Near Earth Objects.');
    } finally {
      setNeosLoading(false);
    }
  };

  const handleEventClick = (event: EONETEvent) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  // const handleScrollToNext = () => {
  //   if (neoSectionRef.current) {
  //     window.scrollTo({
  //       top: neoSectionRef.current.offsetTop,
  //       behavior: 'smooth',
  //     });
  //   }
  // };

  const handleNEOClick = async (neo: any) => {
    setSelectedNEO(null);
    setShowNEODetails(true);
    setNEODetailsLoading(true);
    setNEODetailsError(null);
    try {
      const details = await neoApi.getById(neo.id);
      setSelectedNEO(details);
    } catch (err) {
      setNEODetailsError('Failed to fetch NEO details.');
    } finally {
      setNEODetailsLoading(false);
    }
  };

  const handleExplore = () => {
    if (eonetRef.current) {
      window.scrollTo({
        top: eonetRef.current.offsetTop,
        behavior: 'smooth',
      });
    }
  };

  // Parallax and fade effect for splash
  const fade = Math.max(0, 1 - scrollY / window.innerHeight);
  const translateY = -scrollY * 0.3;
  const starsTranslateY = -scrollY * 0.15;

  // Calculate section positions
  const sectionHeight = window.innerHeight;
  const { eonetTop, overlayTop, neoTop } = sectionOffsets;
  let overlayProgress = 0;
  if (scrollY >= eonetTop && scrollY < neoTop) {
    overlayProgress = (scrollY - eonetTop) / (neoTop - eonetTop);
  }
  overlayProgress = Math.max(0, Math.min(1, overlayProgress));

  // Improved fade/slide logic
  let overlayFade = 0;
  let overlayTranslate = 0;
  if (overlayProgress < 0.4) {
    overlayFade = overlayProgress / 0.4;
    overlayTranslate = 0;
  } else if (overlayProgress < 0.7) {
    overlayFade = 1;
    overlayTranslate = 0;
  } else {
    overlayFade = 1 - (overlayProgress - 0.7) / 0.3;
    overlayTranslate = -100 * ((overlayProgress - 0.7) / 0.3);
  }
  overlayFade = Math.max(0, Math.min(1, overlayFade));

  // EONET Earth stays fully visible until halfway, then fades out
  let eonetFade = 1;
  if (overlayProgress > 0.5) {
    eonetFade = 1 - (overlayProgress - 0.5) / 0.5;
  }
  eonetFade = Math.max(0, Math.min(1, eonetFade));

  // NEO Earth: always fully visible (no fade in/out)
  const neoFade = 1;

  if (loading) {
    return (
      <Layout>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
          }}
        >
          <CircularProgress size={60} />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout title="Earth & Space Events">
      {/* Parallax stars background */}
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, transform: `translateY(${starsTranslateY}px)` }}>
        <ParallaxStars style={{ width: '100vw', height: '100vh' }} />
      </Box>
      <PageContainer sx={{ position: 'relative', zIndex: 1 }}>
        {/* Splash Section */}
        <SplashContainer>
          <CenteredContent
            sx={{
              opacity: fade,
              transform: `translate(-50%, -50%) translateY(${translateY}px)`,
              pointerEvents: fade < 0.1 ? 'none' : 'auto',
            }}
          >
            <LogoContainer>
              <Zoom in={fade > 0.1} timeout={1000}>
                <NASALogo variant="h1">
                  NASA
                </NASALogo>
              </Zoom>
            </LogoContainer>
            <Subtitle variant="h4">
              Data Explorer
            </Subtitle>
            <Typography
              variant="body1"
              sx={{
                color: '#B0B0B0',
                mb: 4,
              }}
            >
              Explore NASA's Earth, asteroid, and Mars rover data in a beautiful, interactive 3D experience.
            </Typography>
            <ExploreButton onClick={handleExplore} size="large">
              Explore Now
            </ExploreButton>
          </CenteredContent>
        </SplashContainer>
        {/* Section 1: EONET Earth */}
        <SectionContainer ref={eonetRef} sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: { xs: 2, md: 6 }, px: { xs: 2, md: 8 } }}>
          {/* Left: Title + Info Card */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' }, justifyContent: 'center', width: { xs: '100%', md: 400 }, zIndex: 2, gap: 2, ml: { xs: 0, md: 6 } }}>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 900, mb: 0, textAlign: { xs: 'center', md: 'left' }, letterSpacing: '0.03em', textShadow: '0 4px 32px rgba(74,144,226,0.15)', alignSelf: { xs: 'center', md: 'flex-start' } }}>
              Real-Time Earth Events
            </Typography>
            <Card sx={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', border: '1px solid rgba(74, 144, 226, 0.2)', boxShadow: '0 8px 32px rgba(74,144,226,0.08)', maxWidth: 400 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Earth Observatory Natural Event Tracker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Explore real-time natural events happening around the world. Click on markers to view details.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Events shown: {events.length}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
            {error && (
              <Alert severity="error" sx={{ maxWidth: 400, mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
          {/* Right: Earth Globe */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, position: 'relative' }}>
            <Earth3D
              events={events}
              neos={[]}
              onEventClick={handleEventClick}
              onNEOClick={() => {}}
              scrollProgress={0}
            />
            <ScrollIndicator
              color="primary"
              onClick={() => {
                if (neoRef.current) {
                  neoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
              size="large"
              sx={{ zIndex: 20, position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)' }}
            >
              <KeyboardArrowDown />
            </ScrollIndicator>
          </Box>
        </SectionContainer>
        {/* Section 2: NEO Earth (reverse layout) */}
        <SectionContainer ref={neoRef} sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse', gap: { xs: 2, md: 6 }, px: { xs: 2, md: 8 } }}>
          {/* Right: Title + Info Card */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-end' }, justifyContent: 'center', width: { xs: '100%', md: 400 }, zIndex: 2, gap: 2, mr: { xs: 0, md: 6 } }}>
            <Typography variant="h2" color="primary" sx={{ fontWeight: 900, mb: 0, textAlign: { xs: 'center', md: 'right' }, letterSpacing: '0.03em', textShadow: '0 4px 32px rgba(74,144,226,0.15)', alignSelf: { xs: 'center', md: 'flex-end' } }}>
              Near Earth Objects
            </Typography>
            <Card sx={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)', border: '1px solid rgba(74, 144, 226, 0.2)', boxShadow: '0 8px 32px rgba(74,144,226,0.08)', maxWidth: 400 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Near Earth Object Tracker
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Asteroids and comets passing close to Earth, visualized in real time. Click on objects to view details.
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    Objects shown: {neos.length}
                  </Typography>
                </Box>
                {neosLoading && (
                  <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} />
                    <Typography variant="caption" color="text.secondary">Loading NEOs...</Typography>
                  </Box>
                )}
                {neosError && (
                  <Alert severity="error" sx={{ mt: 2 }}>{neosError}</Alert>
                )}
              </CardContent>
            </Card>
          </Box>
          {/* Left: Earth Globe */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, position: 'relative', height: '100vh' }}>
            <Earth3D
              events={[]}
              neos={neos}
              onEventClick={() => {}}
              onNEOClick={handleNEOClick}
              scrollProgress={1}
            />
          </Box>
        </SectionContainer>
        {/* Section 3: Mars Rover Selector */}
        <SectionContainer sx={{
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #3a1c0a 0%, #a0522d 100%)',
          backgroundImage: 'url(https://images-assets.nasa.gov/image/PIA19808/PIA19808~orig.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}>
          <Box sx={{ position: 'absolute', inset: 0, background: 'rgba(60,30,10,0.7)', zIndex: 1 }} />
          <Box sx={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 1200, p: 4 }}>
            <Typography variant="h3" color="primary" textAlign="center" gutterBottom>
              Mars Rover Gallery
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              Click a rover to explore its mission, stats, and photos from Mars.
            </Typography>
            <MarsRoverSelector />
          </Box>
        </SectionContainer>
        {/* Section 4: Events List (optional, can move to a separate page) */}
        <SectionContainer sx={{ background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)' }}>
          <Box sx={{ width: '100%', maxWidth: 1200, p: 4 }}>
            <Typography variant="h3" color="primary" textAlign="center" gutterBottom>
              Recent Natural Events
            </Typography>
            <Typography variant="body1" color="text.secondary" textAlign="center" sx={{ mb: 4 }}>
              Track wildfires, storms, volcanoes, and other natural phenomena
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {events.slice(0, 12).map((event) => (
                <EventCard key={event.id}>
                  <CardContent>
                    <Typography variant="h6" color="primary" gutterBottom>
                      {event.title}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      {event.categories.map((category) => (
                        <Chip
                          key={category.id}
                          label={category.title}
                          size="small"
                          sx={{
                            mr: 1,
                            mb: 1,
                            backgroundColor: '#4A90E2',
                            color: 'white',
                          }}
                        />
                      ))}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {event.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleEventClick(event)}
                      startIcon={<Info />}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </EventCard>
              ))}
            </Box>
          </Box>
        </SectionContainer>
      </PageContainer>
      {/* EONET Event Details Sidebar/Modal */}
      <DetailsSidebar
        open={!!selectedEvent && showEventDialog && !isMobile}
        onClose={() => setShowEventDialog(false)}
      >
        {selectedEvent && (
          <Box>
            <Typography variant="h5" color="primary" gutterBottom>
              {selectedEvent.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              {selectedEvent.categories.map((category) => (
                <Chip
                  key={category.id}
                  label={category.title}
                  sx={{
                    mr: 1,
                    backgroundColor: '#4A90E2',
                    color: 'white',
                  }}
                />
              ))}
            </Box>
            <Typography variant="body1" paragraph>
              {selectedEvent.description}
            </Typography>
            {selectedEvent.geometry && selectedEvent.geometry.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                Location: {selectedEvent.geometry[0].coordinates[1].toFixed(2)}°N, 
                {selectedEvent.geometry[0].coordinates[0].toFixed(2)}°E
              </Typography>
            )}
            {selectedEvent.sources && selectedEvent.sources.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Sources:
                </Typography>
                {selectedEvent.sources.map((source) => (
                  <Typography key={source.id} variant="body2" color="text.secondary">
                    {source.id}: {source.url}
                  </Typography>
                ))}
              </Box>
            )}
            {selectedEvent.link && (
              <Button 
                href={selectedEvent.link} 
                target="_blank" 
                variant="contained"
                sx={{ mt: 2 }}
              >
                View Source
              </Button>
            )}
          </Box>
        )}
      </DetailsSidebar>
      {/* EONET Event Details Dialog for mobile */}
      <Dialog
        open={!!selectedEvent && showEventDialog && isMobile}
        onClose={() => setShowEventDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedEvent && (
          <>
            <DialogTitle>
              <Typography variant="h5" color="primary">
                {selectedEvent.title}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2 }}>
                {selectedEvent.categories.map((category) => (
                  <Chip
                    key={category.id}
                    label={category.title}
                    sx={{
                      mr: 1,
                      backgroundColor: '#4A90E2',
                      color: 'white',
                    }}
                  />
                ))}
              </Box>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              {selectedEvent.geometry && selectedEvent.geometry.length > 0 && (
                <Typography variant="body2" color="text.secondary">
                  Location: {selectedEvent.geometry[0].coordinates[1].toFixed(2)}°N, 
                  {selectedEvent.geometry[0].coordinates[0].toFixed(2)}°E
                </Typography>
              )}
              {selectedEvent.sources && selectedEvent.sources.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Sources:
                  </Typography>
                  {selectedEvent.sources.map((source) => (
                    <Typography key={source.id} variant="body2" color="text.secondary">
                      {source.id}: {source.url}
                    </Typography>
                  ))}
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowEventDialog(false)}>Close</Button>
              {selectedEvent.link && (
                <Button 
                  href={selectedEvent.link} 
                  target="_blank" 
                  variant="contained"
                >
                  View Source
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
      {/* NEO Details Sidebar/Modal */}
      <DetailsSidebar
        open={showNEODetails && !isMobile}
        onClose={() => setShowNEODetails(false)}
      >
        {neoDetailsLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        ) : neoDetailsError ? (
          <Alert severity="error">{neoDetailsError}</Alert>
        ) : selectedNEO ? (
          <Box>
            <Typography variant="h5" color="primary" gutterBottom>
              {selectedNEO.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              NEO ID: {selectedNEO.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Absolute Magnitude: {selectedNEO.absolute_magnitude_h}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Estimated Diameter: {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {selectedNEO.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Potentially Hazardous: {selectedNEO.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
            </Typography>
            {selectedNEO.close_approach_data && selectedNEO.close_approach_data.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="primary" gutterBottom>
                  Close Approach Data:
                </Typography>
                {selectedNEO.close_approach_data.map((cad: any, idx: number) => (
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
              href={selectedNEO.nasa_jpl_url}
              target="_blank"
              variant="contained"
              sx={{ mt: 2 }}
            >
              NASA JPL Details
            </Button>
          </Box>
        ) : null}
      </DetailsSidebar>
      {/* NEO Details Dialog for mobile */}
      <Dialog
        open={showNEODetails && isMobile}
        onClose={() => setShowNEODetails(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedNEO?.name}
        </DialogTitle>
        <DialogContent>
          {neoDetailsLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
              <CircularProgress />
            </Box>
          ) : neoDetailsError ? (
            <Alert severity="error">{neoDetailsError}</Alert>
          ) : selectedNEO ? (
            <Box>
              <Typography variant="body2" color="text.secondary">
                NEO ID: {selectedNEO.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Absolute Magnitude: {selectedNEO.absolute_magnitude_h}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Estimated Diameter: {selectedNEO.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {selectedNEO.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Potentially Hazardous: {selectedNEO.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
              </Typography>
              {selectedNEO.close_approach_data && selectedNEO.close_approach_data.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Close Approach Data:
                  </Typography>
                  {selectedNEO.close_approach_data.map((cad: any, idx: number) => (
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
                href={selectedNEO.nasa_jpl_url}
                target="_blank"
                variant="contained"
                sx={{ mt: 2 }}
              >
                NASA JPL Details
              </Button>
            </Box>
          ) : null}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EarthPage; 