import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Pagination,
  CircularProgress,
  Alert,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Layout from '../components/common/Layout';
import { neoApi } from '../services/backendApi';

const SectionContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  padding: theme.spacing(4, 0),
}));

const NEOCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  marginBottom: theme.spacing(2),
  width: '100%',
  maxWidth: 600,
}));

const defaultStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
const defaultEndDate = new Date().toISOString().slice(0, 10);

const NEOPage: React.FC = () => {
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [neos, setNeos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchNEOs();
    // eslint-disable-next-line
  }, [startDate, endDate, page]);

  const fetchNEOs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await neoApi.getFeed(startDate, endDate);
      // Flatten the NEOs by date
      const allNeos = Object.values(res.near_earth_objects).flat();
      setTotalPages(Math.ceil(allNeos.length / 10));
      setNeos(allNeos.slice((page - 1) * 10, page * 10));
    } catch (err: any) {
      setError('Failed to fetch Near Earth Objects.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Near Earth Objects">
      <SectionContainer>
        <Typography variant="h3" color="primary" gutterBottom>
          Near Earth Objects
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Explore asteroids and comets that pass close to Earth. Filter by date range.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <FormControl>
            <InputLabel shrink htmlFor="start-date">Start Date</InputLabel>
            <TextField
              id="start-date"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              size="small"
            />
          </FormControl>
          <FormControl>
            <InputLabel shrink htmlFor="end-date">End Date</InputLabel>
            <TextField
              id="end-date"
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              size="small"
            />
          </FormControl>
        </Box>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <>
            {neos.map((neo: any) => (
              <NEOCard key={neo.id}>
                <CardContent>
                  <Typography variant="h6" color="primary">
                    {neo.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Close Approach Date: {neo.close_approach_data[0]?.close_approach_date_full || 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Estimated Diameter: {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} - {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Potentially Hazardous: {neo.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
                  </Typography>
                  <Button
                    href={neo.nasa_jpl_url}
                    target="_blank"
                    variant="outlined"
                    sx={{ mt: 1 }}
                  >
                    NASA JPL Details
                  </Button>
                </CardContent>
              </NEOCard>
            ))}
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              sx={{ mt: 2 }}
              color="primary"
            />
          </>
        )}
      </SectionContainer>
    </Layout>
  );
};

export default NEOPage; 