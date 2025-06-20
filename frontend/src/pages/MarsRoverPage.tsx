import React, { useState, useEffect } from 'react';
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
  Pagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/common/Layout';
import { marsRoverApi } from '../services/backendApi';

const SectionContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  padding: theme.spacing(4, 0),
}));

const PhotoCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
}));

const MarsRoverPage: React.FC = () => {
  const [rovers, setRovers] = useState<any[]>([]);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [manifest, setManifest] = useState<any>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [earthDate, setEarthDate] = useState('');
  const [camera, setCamera] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRovers();
  }, []);

  useEffect(() => {
    if (selectedRover) {
      fetchManifest(selectedRover);
      setEarthDate('');
      setCamera('');
      setPage(1);
    }
  }, [selectedRover]);

  useEffect(() => {
    if (selectedRover) {
      fetchPhotos();
    }
    // eslint-disable-next-line
  }, [selectedRover, earthDate, camera, page]);

  const fetchRovers = async () => {
    try {
      const res = await marsRoverApi.getRovers();
      setRovers(res.rovers);
    } catch (err) {
      setError('Failed to fetch Mars rovers.');
    }
  };

  const fetchManifest = async (rover: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await marsRoverApi.getManifest(rover);
      setManifest(res.photo_manifest);
    } catch (err) {
      setError('Failed to fetch rover manifest.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = { page };
      if (earthDate) params.earth_date = earthDate;
      if (camera) params.camera = camera;
      const res = await marsRoverApi.getPhotos(selectedRover, params);
      setPhotos(res.photos);
      setTotalPages(Math.max(1, Math.ceil((res.photos.length || 1) / 25)));
    } catch (err) {
      setError('Failed to fetch rover photos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Mars Rover Photos">
      <SectionContainer>
        <Typography variant="h3" color="primary" gutterBottom>
          Mars Rover Photos
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Explore photos taken by NASA's Mars rovers. Select a rover, date, and camera.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="rover-label">Rover</InputLabel>
            <Select
              labelId="rover-label"
              value={selectedRover}
              label="Rover"
              onChange={e => setSelectedRover(e.target.value)}
            >
              {rovers.map((r: any) => (
                <MenuItem key={r.name} value={r.name}>{r.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <TextField
              label="Earth Date"
              type="date"
              value={earthDate}
              onChange={e => setEarthDate(e.target.value)}
              size="small"
              // InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="camera-label">Camera</InputLabel>
            <Select
              labelId="camera-label"
              value={camera}
              label="Camera"
              onChange={e => setCamera(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>
              {manifest && manifest.cameras && manifest.cameras.map((c: any) => (
                <MenuItem key={c.name} value={c.name}>{c.full_name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', width: '100%' }}>
            {photos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">No photos found for the selected criteria.</Typography>
            ) : (
              photos.slice((page - 1) * 25, page * 25).map((photo: any) => (
                <PhotoCard key={photo.id}>
                  <CardContent>
                    <img src={photo.img_src} alt={photo.camera.full_name} style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />
                    <Typography variant="subtitle1" color="primary">{photo.camera.full_name}</Typography>
                    <Typography variant="body2" color="text.secondary">{photo.earth_date}</Typography>
                  </CardContent>
                </PhotoCard>
              ))
            )}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{ mt: 2, width: '100%' }}
              color="primary"
            />
          </Box>
        )}
      </SectionContainer>
    </Layout>
  );
};

export default MarsRoverPage; 