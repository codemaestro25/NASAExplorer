import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Fab,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeyboardArrowDown } from '@mui/icons-material';
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
import APODPage from './APODPage';
import SectionIntroCard from '../components/common/SectionIntroCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(2),
    width: 48,
    height: 48,
  },
}));


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
  const marsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    fetchEvents();
    if (!neosLoaded) {
      fetchNEOs();
      setNeosLoaded(true);
    }
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [neosLoaded]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eonetApi.getEvents({ days: 30, limit: 50 });
      setEvents(response.events);
    } catch (err) {
      setError(`Failed to fetch Earth events : ${err}`);
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
      setNeosError(`Failed to fetch Near Earth Objects: ${err}`);
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
      setNEODetailsError(`Failed to fetch NEO details: ${err}`);
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

  return (
    // <Layout title="Earth & Space Events">
      
<>
<Box sx={{ position: 'fixed', inset: 0, zIndex: 0, transform: `translateY(${starsTranslateY}px)` }}>
        <ParallaxStars style={{ width: '100vw', height: '100vh' }} />
      </Box>
      <PageContainer sx={{ position: 'relative', zIndex: 1 }}>
        <SplashScreen 
          fade={fade}
          translateY={translateY}
          onExplore={handleExplore}
        />
        
        <SectionContainer 
          ref={eonetRef} 
          sx={{ 
            minHeight: { xs: 'auto', md: '100vh' },
            py: { xs: 4, md: 0 },
            justifyContent: {xs : 'space-around', md: 'center'}, 
            alignItems: 'center', 
            flexDirection: { xs: 'column', md: 'row' }, 
            gap: { xs: 3, md: 6 }, 
            px: { xs: 2, md: 8 } 
          }}
        >
          <SectionIntroCard
            title="Real-Time Earth Events"
            cardTitle="Earth Observatory Natural Event Tracker"
            cardDescription="Explore real-time natural events happening around the world. Click on markers to view details."
            cardStats={
              loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoadingSpinner size={16} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                    Loading events...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                  Events shown: <b>{events.length}</b>
                </Typography>
              )
            }
            error={error}
            visible={true}
            align="left"
          />
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minWidth: 0, 
            position: 'relative',
            height: { xs: '50vh', md: '100vh' },
            width: '100%',
            order: { xs: 1, md: 2 }
          }}>
            <Earth3D
              events={events}
              neos={[]}
              onEventClick={handleEventClick}
              onNEOClick={() => {}}
              scrollProgress={0}
            />
          </Box>
          <ScrollIndicator
            color="primary"
            onClick={() => {
              if (neoRef.current) {
                neoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            size={isMobile ? 'medium' : 'large'}
            sx={{ 
              zIndex: 20, 
              position: 'absolute', 
              bottom: { xs: 20, md: 40 }, 
              left: '50%', 
              transform: 'translateX(-50%)' 
            }}
          >
            <KeyboardArrowDown />
          </ScrollIndicator>
        </SectionContainer>
        
        <SectionContainer 
          ref={neoRef} 
          sx={{ 
            minHeight: { xs: 'auto', md: '100vh' },
            py: { xs: 4, md: 0 },
            justifyContent: 'center', 
            alignItems: 'center', 
            flexDirection: { xs: 'column', md: 'row-reverse' }, 
            gap: { xs: 3, md: 6 }, 
            px: { xs: 2, md: 8 } 
          }}
        >
          <SectionIntroCard
            title="Near Earth Objects"
            cardTitle="Near Earth Object Tracker"
            cardDescription="Asteroids and comets passing close to Earth, visualized in real time. Click on objects to view & visualise their details."
            cardStats={
              neosLoading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LoadingSpinner size={16} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                    Loading objects...
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: { xs: '0.8rem', md: '1rem' } }}>
                  Objects shown: <b>{neos.length}</b>
                </Typography>
              )
            }
            error={neosError}
            visible={true}
            align="right"
          />
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minWidth: 0, 
            position: 'relative', 
            height: { xs: '50vh', md: '100vh' }, 
            width: '100%',
            mt: { xs: 0, md: -30 },
            order: { xs: 1, md: 2 }
          }}>
            {neosLoading ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                gap: 2,
                color: 'primary.main'
              }}>
                <LoadingSpinner size={60} />
              </Box>
            ) : (
              <Earth3D
                events={[]}
                neos={neos}
                onEventClick={() => {}}
                onNEOClick={handleNEOClick}
                scrollProgress={1}
              />
            )}
          </Box>
          <ScrollIndicator
            color="primary"
            onClick={() => {
              if (marsRef.current) {
                marsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            size={isMobile ? 'medium' : 'large'}
            sx={{ 
              zIndex: 20, 
              position: 'absolute', 
              bottom: { xs: 20, md: 40 }, 
              left: '50%', 
              transform: 'translateX(-50%)',
              mt : { xs: 2, md: 4}
            }}
          >
            <KeyboardArrowDown />
          </ScrollIndicator>
        </SectionContainer>
        
        <SectionContainer
        ref={marsRef}
        sx={{
          minHeight: { xs: 'auto', md: '100vh' },
          py: { xs: 4, md: 0 },
          backgroundImage: 'url(/images/marssurface.png)',
          backgroundSize: { xs: 'contain', md: 'cover' },
          backgroundPosition: { xs: 'center bottom', md: 'center' },
          backgroundRepeat: 'no-repeat',
        }}>
          <Box sx={{ 
            position: 'absolute', 
            top: { xs: 20, md: 40 }, 
            left: 0, 
            right: 0, 
            zIndex: 2 ,
            
          }}>
            <Typography 
              variant={isMobile ? "h4" : "h3"} 
              color="primary" 
              textAlign="center" 
              gutterBottom
              sx={{ fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' } }}
            >
              Mars Rover Gallery
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary" 
              textAlign="center"
              sx={{ px: { xs: 2, md: 0 } }}
            >
              Click a rover to explore its mission, stats, and photos from Mars.
            </Typography>
          </Box>
          <Box sx={{ 
            position: 'relative', 
            zIndex: 2, 
            width: '100%', 
            p: { xs: 2, md: 4 }, 
            mt: { xs: 8, md: 5 } 
          }}>
            <MarsRoverSelector />
          </Box>
        </SectionContainer>
        
        <APODPage />
        
      
      </PageContainer>
      
      <DetailsSidebar
        open={!!selectedEvent && showEventDialog && !isMobile}
        onClose={() => setShowEventDialog(false)}
      >
        {selectedEvent && <EonetEventDetails event={selectedEvent} />}
      </DetailsSidebar>
      
     
      
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
      
     
</>


    // </Layout>
  );
};

export default EarthPage; 