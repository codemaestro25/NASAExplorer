import React, { useEffect, useState, useMemo, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
import PhotoModal from '../components/common/PhotoModal';
import type { PhotoModalRef } from '../components/common/PhotoModal';
import { marsRoverApi } from '../services/backendApi';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import FiberManualRecord from '@mui/icons-material/FiberManualRecord';

const SectionContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  padding: theme.spacing(4, 0),
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(https://images-assets.nasa.gov/image/PIA19808/PIA19808~orig.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    opacity: 0.4,
    zIndex: -1,
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  background: 'rgba(26, 26, 46, 0.75)',
  backdropFilter: 'blur(8px)',
  color: '#fff',
  height: '100%',
  border: '1px solid rgba(74, 144, 226, 0.25)',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
}));

const PhotoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  width: '100%',
  borderRadius: (theme.shape.borderRadius as number) * 1.5,
}));

// so great of NASA to provide 3D models of the rovers using GLB files, placed them public/models folder
const roverModels: Record<string, string> = {
  curiosity: '/models/curiosity.glb',
  opportunity: '/models/spirit_and_oppurtunity.glb',
  spirit: '/models/spirit_and_oppurtunity.glb',
};

function RoverModel({ url, roverId }: { url: string; roverId: string }) {
  const { scene } = useGLTF(url);
  
  //  error handling and loading state
  if (!scene) {
    return null;
  }
  
  return (
    <group>
      <primitive 
        object={scene} 
        scale={1} 
        position={[0, -0.5, 0]} 
        rotation={[0, Math.PI / 4, 0]}
      />
      {/* specific light for the Spirit/Opportunity model */}
      {(roverId === 'spirit' || roverId === 'opportunity') && (
        <>
          <directionalLight 
            position={[-2, 3, 2]} 
            intensity={8} 
            castShadow 
          />
          <directionalLight
            position={[2, 2, -2]}
            intensity={8}
            castShadow
          />
        </>
      )}
      {/* specific lights for the Curiosity model */}
      {roverId === 'curiosity' && (
        <>
          <directionalLight 
            position={[-3, 2, 3]} 
            intensity={4} 
            castShadow 
          />
          <directionalLight
            position={[3, 3, -3]}
            intensity={2}
            castShadow
          />
        </>
      )}
    </group>
  );
}

// Preload the models
useGLTF.preload('/models/curiosity.glb');
useGLTF.preload('/models/spirit_and_oppurtunity.glb');

// Static data for rover cameras based on the provided image
const roverCameraData: Record<string, { name: string; full_name: string }[]> = {
  curiosity: [
    { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
    { name: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
    { name: 'MAST', full_name: 'Mast Camera' },
    { name: 'CHEMCAM', full_name: 'Chemistry and Camera Complex' },
    { name: 'MAHLI', full_name: 'Mars Hand Lens Imager' },
    { name: 'MARDI', full_name: 'Mars Descent Imager' },
    { name: 'NAVCAM', full_name: 'Navigation Camera' },
  ],
  opportunity: [
    { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
    { name: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
    { name: 'NAVCAM', full_name: 'Navigation Camera' },
    { name: 'PANCAM', full_name: 'Panoramic Camera' },
    { name: 'MINITES', full_name: 'Miniature Thermal Emission Spectrometer (Mini-TES)' },
  ],
  spirit: [
    { name: 'FHAZ', full_name: 'Front Hazard Avoidance Camera' },
    { name: 'RHAZ', full_name: 'Rear Hazard Avoidance Camera' },
    { name: 'NAVCAM', full_name: 'Navigation Camera' },
    { name: 'PANCAM', full_name: 'Panoramic Camera' },
    { name: 'MINITES', full_name: 'Miniature Thermal Emission Spectrometer (Mini-TES)' },
  ],
};

//  reusable component for the manifest cards
interface ManifestCardProps {
  label: string;
  children: React.ReactNode;
  xs?: number;
  sm?: number;
}

// cards for the manifest data
const ManifestCard: React.FC<ManifestCardProps> = ({ label, children }) => (
    <InfoCard>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
        {children}
      </CardContent>
    </InfoCard>
);

const MarsRoverDetailPage: React.FC = () => {
  const { roverId } = useParams<{ roverId: string }>();
  const [manifest, setManifest] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earthDate, setEarthDate] = useState('');
  const [camera, setCamera] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const photoModalRef = useRef<PhotoModalRef | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const availableCameras = useMemo(() => {
    if (!roverId || !roverCameraData[roverId]) {
      return [];
    }
    return roverCameraData[roverId];
  }, [roverId]);

  useEffect(() => {
    if (roverId) {
      // Fetch initial manifest data when rover changes
      fetchData(true);
      setEarthDate('');
      setCamera('');
      setPage(1);
    }
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    // eslint-disable-next-line
  }, [roverId]);

  const fetchData = async (isInitialLoad = false, isManualFetch = false) => {
    if (!roverId) return;

    setLoading(true);
    setError(null);

    try {
      // For manual fetch, use earth date. For initial, get manifest.
      const params: any = isManualFetch ? { earth_date: earthDate, camera } : {};
      
      const res: any = await marsRoverApi.getPhotos(roverId, params);

      if (isInitialLoad && res.photo_manifest) {
        setManifest(res.photo_manifest);
        setPhotos([]); // Clear photos on initial load
        setTotalPages(1);
      } else if (res.photos) {
        setPhotos(res.photos);
        // Paginate based on 8 photos per page
        setTotalPages(Math.max(1, Math.ceil((res.photos.length || 1) / 8)));
        // Reset to page 1 when new photos are fetched
        setPage(1);
      }
    } catch (err: any) {
      console.error('Error fetching rover data:', err);
      
      // Handle enhanced error messages from backend
      if (err.response?.data?.error) {
        const errorData = err.response.data;
        setError(errorData.error);
        
        // If manifest data is provided in error, update the manifest for better UX
        if (errorData.manifest && !manifest) {
          setManifest(errorData.manifest);
        }
      } else if (err.response?.status === 400) {
        setError('Invalid request. Please check your date and camera selection.');
      } else if (err.response?.status === 404) {
        setError('Rover not found. Please try a different rover.');
      } else {
        setError('Failed to fetch rover data. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPhotos = () => {
    // Client-side validation
    if (!earthDate) {
      setError('Please select a date to fetch photos.');
      return;
    }

    // Check for future dates
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const selectedDate = new Date(earthDate);
    
    if (selectedDate > today) {
      setError('Cannot fetch photos for future dates. Please select a date in the past or today.');
      return;
    }

    // Check if date is within rover's mission timeline (if manifest is available)
    if (manifest) {
      const landingDate = new Date(manifest.landing_date);
      const maxDate = new Date(manifest.max_date);
      
      if (selectedDate < landingDate) {
        setError(`No photos available before ${manifest.landing_date}. The ${manifest.name} rover landed on ${manifest.landing_date}.`);
        return;
      }
      
      if (selectedDate > maxDate) {
        setError(`No photos available after ${manifest.max_date}. The last photo from ${manifest.name} was taken on ${manifest.max_date}.`);
        return;
      }
    }

    // clear any previous errors
    setError(null);
    fetchData(false, true);
  };

  return (
    <Layout title={`Mars Rover: ${roverId?.charAt(0).toUpperCase() + (roverId?.slice(1) ?? '')}` }>
      <SectionContainer ref={topRef}>
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 5, 
          width: '100%', 
          minWidth: '100vw',
          mx: 'auto',
          px: { xs: 2, md: 4 },
          zIndex: 2
        }}>

          {/* Left: Rover Stats */}
          <Box sx={{ width: { xs: '100%', md: '35%' } }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 3 }}>
              Mission Manifest
            </Typography>
            {manifest ? (
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <ManifestCard label="Rover">
                    <Typography variant="h5">{manifest.name}</Typography>
                  </ManifestCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ManifestCard label="Status">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FiberManualRecord
                        fontSize="small"
                        sx={{ color: manifest.status === 'active' ? 'success.main' : 'error.main' }}
                      />
                      <Typography variant="h6">{manifest.status}</Typography>
                    </Box>
                  </ManifestCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ManifestCard label="Total Photos">
                    <Typography variant="h6">{manifest.total_photos.toLocaleString()}</Typography>
                  </ManifestCard>
                </Grid>
                <Grid size={{ xs: 12, sm : 6 }}>
                  <ManifestCard label="Mission Timeline">
                    <Typography><b>Launched:</b> {manifest.launch_date}</Typography>
                    <Typography><b>Landed:</b> {manifest.landing_date}</Typography>
                  </ManifestCard>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <ManifestCard label="Photo Span">
                    <Typography><b>Last Photo:</b> {manifest.max_date}</Typography>
                    <Typography><b>Mars Sol:</b> {manifest.max_sol}</Typography>
                  </ManifestCard>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <ManifestCard label="Available Cameras">
                    {availableCameras.map((c: any) => (
                      <Typography key={c.name} variant="body2">{c.full_name}</Typography>
                    ))}
                  </ManifestCard>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', minHeight: '500px' }}>
                {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : null}
              </Box>
            )}
          </Box>

          {/* Right: 3D Model */}
          <Box sx={{ width: { xs: '100%', md: '65%' }, top: '100px' }}>
            <Box sx={{ width: '100%', height: { xs: 500, md: 600 }, background: 'rgba(26,26,46,0.7)', borderRadius: 4, boxShadow: 6 }}>
              <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 50 }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[5, 3, 5]} intensity={1} />
                {roverId && roverModels[roverId] && <RoverModel url={roverModels[roverId]} roverId={roverId} />}
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>
            </Box>
          </Box>
        </Box>
        {/* Below: Photo Gallery */}
        <Box sx={{ 
          width: '100%', 
          maxWidth: 1400, 
          mt: 6, 
          zIndex: 2,
          mx: 'auto',
          px: { xs: 2, md: 4 }
        }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Grab photos of the rover from a particular date and camera
          </Typography>
          
          {/* Date Range Info */}
          {manifest && (
            <Box sx={{ 
              mb: 3, 
              p: 2, 
              backgroundColor: 'rgba(74, 144, 226, 0.1)', 
              borderRadius: 2, 
              border: '1px solid rgba(74, 144, 226, 0.2)' 
            }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Valid Date Range for {manifest.name}:</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Landing Date: {manifest.landing_date} | Last Photo: {manifest.max_date} | Total Photos: {manifest.total_photos.toLocaleString()}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 6, flexWrap: 'wrap' }}>
            <FormControl>
              <TextField
                label="Earth Date"
                type="date"
                value={earthDate}
                onChange={e => setEarthDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
                inputProps={{
                  max: new Date().toISOString().split('T')[0] // Set max to today
                }}
              />
            </FormControl>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="camera-label">Camera</InputLabel>
              <Select
                labelId="camera-label"
                value={camera}
                label="Camera"
                onChange={e => setCamera(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                {availableCameras.map((c: any) => (
                  <MenuItem key={c.name} value={c.name}>{c.full_name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button variant="contained" color="primary" onClick={handleFetchPhotos}>
              Fetch Photos
            </Button>
          </Box>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          ) : (
            <>
              <Grid container spacing={2} sx={{ justifyContent: 'center', width: '100%' }}>
                {photos.length === 0 ? (
                  <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                    <Typography variant="body2" color="text.secondary">No photos found for the selected criteria.</Typography>
                  </Grid>
                ) : (
                  photos.slice((page - 1) * 8, page * 8).map((photo: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }} key={photo.id}>
                      <PhotoCard 
                        sx={{ 
                          cursor: 'pointer',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'scale(1.02)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                          }
                        }}
                        onClick={() => photoModalRef.current?.handlePhotoClick(photo)}
                      >
                        <CardContent sx={{ p: 1.5 }}>
                          <img 
                            src={photo.img_src} 
                            alt={photo.camera.full_name} 
                            style={{ 
                              width: '100%', 
                              height: 200, 
                              objectFit: 'cover', 
                              borderRadius: 8, 
                              marginBottom: 8 
                            }} 
                          />
                          <Typography variant="subtitle1" color="primary" noWrap>
                            {photo.camera.full_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {photo.earth_date}
                          </Typography>
                        </CardContent>
                      </PhotoCard>
                    </Grid>
                  ))
                )}
              </Grid>
              {photos.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </SectionContainer>
      
      {/* Photo Modal - Self-contained component */}
      <PhotoModal ref={photoModalRef} photos={photos} />
    </Layout>
  );
};

export default MarsRoverDetailPage; 