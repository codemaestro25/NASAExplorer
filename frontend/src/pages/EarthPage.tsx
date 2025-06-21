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
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown, Info } from '@mui/icons-material';
import Layout from '../components/common/Layout';
import Earth3D from '../components/Earth3D/Earth3D';
import { eonetApi, neoApi } from '../services/backendApi';
import type { EONETEvent } from '../types/nasa';
import ParallaxStars from '../components/common/ParallaxStars';
import MarsRoverSelector from '../components/MarsRover/MarsRoverSelector';
import DetailsSidebar from '../components/common/DetailsSidebar';
import { useMediaQuery } from '@mui/material';
import SplashScreen from '../components/common/SplashScreen';
import EonetEventDetails from '../components/common/EonetEventDetails';
import NeoDetails from '../components/common/NeoDetails';

const PageContainer = styled(Box)({
  minHeight: '100vh',
  position: 'relative',
  overflowX: 'hidden',
});

const SectionContainer = styled(Box)({
  minHeight: '100vh',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});

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

const EventCard = styled(Card)({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  transition: 'all 0.3s ease',
  '&:hover': {
    borderColor: 'rgba(74, 144, 226, 0.4)',
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
  },
});

const EarthPage: React.FC = () => {
  const [events, setEvents] = useState<EONETEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EONETEvent | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [neos, setNeos] = useState<any[]>([]);
  const [neosLoading, setNeosLoading] = useState(false);
  const [neosError, setNeosError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [selectedNEO, setSelectedNEO] = useState<any | null>(null);
  const [showNEODetails, setShowNEODetails] = useState(false);
  const [neoDetailsLoading, setNEODetailsLoading] = useState(false);
  const [neoDetailsError, setNEODetailsError] = useState<string | null>(null);
  const [neosLoaded, setNeosLoaded] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const eonetRef = useRef<HTMLDivElement>(null);
  const neoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchEvents();
    if (!neosLoaded) {
      fetchNEOs();
      setNeosLoaded(true);
    }
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const fade = Math.max(0, 1 - scrollY / window.innerHeight);
  const translateY = -scrollY * 0.3;
  const starsTranslateY = -scrollY * 0.15;

  // if (loading) {
  //   return (
  //     <Layout>
  //       <Box
  //         sx={{
  //           display: 'flex',
  //           justifyContent: 'center',
  //           alignItems: 'center',
  //           minHeight: '80vh',
  //         }}
  //       >
  //         <CircularProgress size={60} />
  //       </Box>
  //     </Layout>
  //   );
  // }

  return (
    <Layout title="Earth & Space Events">
      <Box sx={{ position: 'fixed', inset: 0, zIndex: 0, transform: `translateY(${starsTranslateY}px)` }}>
        <ParallaxStars style={{ width: '100vw', height: '100vh' }} />
      </Box>
      <PageContainer sx={{ position: 'relative', zIndex: 1 }}>
        <SplashScreen 
          fade={fade}
          translateY={translateY}
          onExplore={handleExplore}
        />
        
        <SectionContainer ref={eonetRef} sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: { xs: 2, md: 6 }, px: { xs: 2, md: 8 } }}>
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
        
        <SectionContainer ref={neoRef} sx={{ minHeight: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse', gap: { xs: 2, md: 6 }, px: { xs: 2, md: 8 } }}>
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
        
        <SectionContainer sx={{
          minHeight: '100vh',
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
      
      <DetailsSidebar
        open={!!selectedEvent && showEventDialog && !isMobile}
        onClose={() => setShowEventDialog(false)}
      >
        {selectedEvent && <EonetEventDetails event={selectedEvent} />}
      </DetailsSidebar>
      
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
              <EonetEventDetails event={selectedEvent} />
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
      
      <DetailsSidebar
        open={showNEODetails && !isMobile}
        onClose={() => setShowNEODetails(false)}
      >
        <NeoDetails 
          neo={selectedNEO}
          loading={neoDetailsLoading}
          error={neoDetailsError}
        />
      </DetailsSidebar>
      
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
          <NeoDetails 
            neo={selectedNEO}
            loading={neoDetailsLoading}
            error={neoDetailsError}
          />
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default EarthPage; 