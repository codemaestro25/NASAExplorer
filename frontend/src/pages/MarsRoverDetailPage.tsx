import React, { useEffect, useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Alert,
  Grid,
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useParams } from 'react-router-dom';
import Layout from '../components/common/Layout';
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
  justifyContent: 'flex-start',
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
  borderRadius: theme.shape.borderRadius * 1.5,
}));

const PhotoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  width: '100%',
}));

// Local 3D model loader using GLB files from public/models folder
const roverModels: Record<string, string> = {
  curiosity: '/models/curiosity.glb',
  opportunity: '/models/spirit_and_oppurtunity.glb',
  spirit: '/models/spirit_and_oppurtunity.glb',
};

function RoverModel({ url, roverId }: { url: string; roverId: string }) {
  const { scene } = useGLTF(url);
  
  // Add error handling and loading state
  if (!scene) {
    return null;
  }
  
  return (
    <group>
      <primitive 
        object={scene} 
        scale={0.5} 
        position={[0, -0.5, 0]} 
        rotation={[0, Math.PI / 4, 0]} // Add some rotation for better initial view
      />
      {/* Add a specific light for the Spirit/Opportunity model */}
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
    // eslint-disable-next-line
  }, [roverId]);

  const fetchData = async (isInitialLoad = false, isManualFetch = false) => {
    if (!roverId) return;

    setLoading(true);
    setError(null);

    try {
      // For manual fetch, use earth date. For initial, get manifest.
      const params: any = isManualFetch ? { page, earth_date: earthDate, camera } : {};
      
      const res: any = await marsRoverApi.getPhotos(roverId, params);

      if (isInitialLoad && res.photo_manifest) {
        setManifest(res.photo_manifest);
        setPhotos([]); // Clear photos on initial load
        setTotalPages(1);
      } else if (res.photos) {
        setPhotos(res.photos);
        // Paginate based on 8 photos per page
        setTotalPages(Math.max(1, Math.ceil((res.photos.length || 1) / 8)));
      }
    } catch (err) {
      setError('Failed to fetch rover data.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchPhotos = () => {
    if (page !== 1) {
      setPage(1); // Reset to page 1 for new searches
    }
    fetchData(false, true);
  };

  useEffect(() => {
    // This effect will run when page changes, only if photos are already present
    if (roverId && photos.length > 0 && earthDate) {
      fetchData(false, true);
    }
    // eslint-disable-next-line
  }, [page]);

  return (
    <Layout title={`Mars Rover: ${roverId?.charAt(0).toUpperCase() + (roverId?.slice(1) ?? '')}` }>
      <SectionContainer>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, width: '100%', maxWidth: 1400, zIndex: 2 }}>

          {/* Left: Rover Stats */}
          <Box sx={{ width: { xs: '100%', md: '33.33%' } }}>
            <Typography variant="h4" color="primary" gutterBottom sx={{ mb: 3 }}>
              Mission Manifest
            </Typography>
            {manifest ? (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Rover</Typography>
                      <Typography variant="h5">{manifest.name}</Typography>
                    </CardContent>
                  </InfoCard>
                </Grid>
                <Grid item xs={6}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FiberManualRecord
                          fontSize="small"
                          sx={{ color: manifest.status === 'active' ? 'success.main' : 'error.main' }}
                        />
                        <Typography variant="h6">{manifest.status}</Typography>
                      </Box>
                    </CardContent>
                  </InfoCard>
                </Grid>
                <Grid item xs={6}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Total Photos</Typography>
                      <Typography variant="h6">{manifest.total_photos.toLocaleString()}</Typography>
                    </CardContent>
                  </InfoCard>
                </Grid>
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Mission Timeline</Typography>
                      <Typography><b>Launched:</b> {manifest.launch_date}</Typography>
                      <Typography><b>Landed:</b> {manifest.landing_date}</Typography>
                    </CardContent>
                  </InfoCard>
                </Grid>
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Photo Span</Typography>
                      <Typography><b>Last Photo:</b> {manifest.max_date}</Typography>
                      <Typography><b>Mars Sol:</b> {manifest.max_sol}</Typography>
                    </CardContent>
                  </InfoCard>
                </Grid>
                <Grid item xs={12}>
                  <InfoCard>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">Available Cameras</Typography>
                      {availableCameras.map((c: any) => (
                        <Typography key={c.name} variant="body2">{c.full_name}</Typography>
                      ))}
                    </CardContent>
                  </InfoCard>
                </Grid>
              </Grid>
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {loading ? <CircularProgress /> : error ? <Alert severity="error">{error}</Alert> : null}
              </Box>
            )}
          </Box>

          {/* Right: 3D Model */}
          <Box sx={{ width: { xs: '100%', md: '66.67%' }, position: 'sticky', top: '100px', height: 'fit-content' }}>
            <Box sx={{ width: '100%', height: 500, background: 'rgba(26,26,46,0.7)', borderRadius: 4, boxShadow: 6 }}>
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
        <Box sx={{ width: '100%', maxWidth: 1200, mt: 6, zIndex: 2 }}>
          <Typography variant="h5" color="primary" gutterBottom>
            Grab photos of the rover from a particular date and camera
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4, flexWrap: 'wrap' }}>
            <FormControl>
              <TextField
                label="Earth Date"
                type="date"
                value={earthDate}
                onChange={e => setEarthDate(e.target.value)}
                size="small"
                InputLabelProps={{ shrink: true }}
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
                  <Grid item>
                    <Typography variant="body2" color="text.secondary">No photos found for the selected criteria.</Typography>
                  </Grid>
                ) : (
                  photos.slice((page - 1) * 8, page * 8).map((photo: any) => (
                    <Grid item key={photo.id} xs={12} sm={6} md={3} lg={3}>
                      <PhotoCard>
                        <CardContent sx={{ p: 1.5 }}>
                          <img src={photo.img_src} alt={photo.camera.full_name} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }} />
                          <Typography variant="subtitle1" color="primary" noWrap>{photo.camera.full_name}</Typography>
                          <Typography variant="body2" color="text.secondary">{photo.earth_date}</Typography>
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
    </Layout>
  );
};

export default MarsRoverDetailPage; 