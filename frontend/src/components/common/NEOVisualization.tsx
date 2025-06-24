import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line,Scatter } from 'react-chartjs-2';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ProcessedNEOData {
  id: string;
  name: string;
  isHazardous: boolean;
  diameter: {
    min: number;
    max: number;
    estimated: number;
  };
  missDistanceTrend: {
    dates: string[];
    distances: number[];
    velocities: number[];
  };
  statistics: {
    closestApproach: {
      date: string;
      distance: number;
      velocity: number;
    };
    averageDistance: number;
    averageVelocity: number;
    totalApproaches: number;
    futureApproaches: number;
  };
  hazardAssessment: {
    riskLevel: 'low' | 'medium' | 'high';
    riskScore: number;
    nextCloseApproach: {
      date: string;
      distance: number;
      daysFromNow: number;
    };
  };
}

interface NEOVisualizationProps {
  neoId: string;
}

const StyledCard = styled(Card)(() => ({
  background: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
  border: '1px solid rgba(74, 144, 226, 0.2)',
  borderRadius: 12,
  boxShadow: '0 8px 32px rgba(74,144,226,0.08)',
  '&:hover': {
    borderColor: 'rgba(74, 144, 226, 0.4)',
    boxShadow: '0 12px 40px rgba(74,144,226,0.12)',
  },
}));

const RiskChip = styled(Chip)(({ riskLevel }: { theme: any; riskLevel: string }) => ({
  backgroundColor: riskLevel === 'high' ? '#FF6B6B' : 
                   riskLevel === 'medium' ? '#FFA726' : '#4CAF50',
  color: 'white',
  fontWeight: 'bold',
  fontSize: '0.875rem',
}));

const NEOVisualization: React.FC<NEOVisualizationProps> = ({ neoId }) => {
  const [data, setData] = useState<ProcessedNEOData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/neo/${neoId}/visualization`);
        if (!response.ok) {
          throw new Error('Failed to fetch NEO visualization data');
        }
        const processedData = await response.json();
        setData(processedData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [neoId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !data) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error || 'Failed to load NEO visualization data'}
      </Alert>
    );
  }

  // Format dates for better display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Prepare chart data
  const missDistanceChartData = {
    labels: data.missDistanceTrend.dates.map(formatDate),
    datasets: [
      {
        label: 'Miss Distance (millions km)',
        data: data.missDistanceTrend.distances.map(d => d / 1000000), // Convert to millions
        borderColor: '#4A90E2',
        backgroundColor: 'rgba(74, 144, 226, 0.1)',
        tension: 0.4,
        pointRadius: isMobile ? 2 : 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const velocityChartData = {
    labels: data.missDistanceTrend.dates.map(formatDate),
    datasets: [
      {
        label: 'Relative Velocity (thousands km/h)',
        data: data.missDistanceTrend.velocities.map(v => v / 1000), // Convert to thousands
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4,
        pointRadius: isMobile ? 2 : 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const scatterData = {
    datasets: [
      {
        label: 'Distance vs Velocity',
        data: data.missDistanceTrend.distances.map((distance, index) => ({
          x: distance / 1000000, // Convert to millions
          y: data.missDistanceTrend.velocities[index] / 1000, // Convert to thousands
        })),
        backgroundColor: data.isHazardous ? '#FF6B6B' : '#4A90E2',
        pointRadius: isMobile ? 3 : 5,
        pointHoverRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: theme.palette.text.primary,
          font: {
            size: isMobile ? 10 : 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(26, 26, 46, 0.9)',
        titleColor: '#4A90E2',
        bodyColor: theme.palette.text.primary,
        borderColor: 'rgba(74, 144, 226, 0.3)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          font: {
            size: isMobile ? 8 : 10,
          },
        },
        grid: {
          color: 'rgba(74, 144, 226, 0.1)',
        },
      },
      y: {
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: isMobile ? 8 : 10,
          },
        },
        grid: {
          color: 'rgba(74, 144, 226, 0.1)',
        },
      },
    },
  };

  const scatterOptions = {
    ...chartOptions,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Miss Distance (millions km)',
          color: theme.palette.text.primary,
        },
        ...chartOptions.scales.x,
      },
      y: {
        title: {
          display: true,
          text: 'Relative Velocity (thousands km/h)',
          color: theme.palette.text.primary,
        },
        ...chartOptions.scales.y,
      },
    },
  };

  return (
    <Box sx={{ p: { xs: 1, md: 2 } }}>
      {/* Header */}
      <StyledCard sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, gap: 2, mb: 2 }}>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
              {data.name}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <RiskChip 
                label={`Risk: ${data.hazardAssessment.riskLevel.toUpperCase()}`} 
                riskLevel={data.hazardAssessment.riskLevel}
                size="small"
              />
              {data.isHazardous && (
                <Chip 
                  label="HAZARDOUS" 
                  color="error" 
                  size="small"
                  sx={{ fontWeight: 'bold' }}
                />
              )}
            </Box>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Diameter</Typography>
              <Typography variant="h6" color="primary">
                {data.diameter.estimated.toFixed(2)} km
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Total Approaches</Typography>
              <Typography variant="h6" color="primary">
                {data.statistics.totalApproaches}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Future Approaches</Typography>
              <Typography variant="h6" color="primary">
                {data.statistics.futureApproaches}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Typography variant="body2" color="text.secondary">Risk Score</Typography>
              <Typography variant="h6" color="primary">
                {data.hazardAssessment.riskScore}/100
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </StyledCard>

      {/* Charts Grid */}
      <Grid container spacing={3}>
        {/* Miss Distance Trend */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Miss Distance Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={missDistanceChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Velocity Trend */}
        <Grid item xs={12} lg={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Relative Velocity Trend
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line data={velocityChartData} options={chartOptions} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Scatter Plot */}
        <Grid item xs={12}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Distance vs Velocity Correlation
              </Typography>
              <Box sx={{ height: 400 }}>
                <Scatter data={scatterData} options={scatterOptions} />
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>

        {/* Statistics Cards */}
        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Closest Approach
              </Typography>
              <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                {formatDate(data.statistics.closestApproach.date)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Distance: {(data.statistics.closestApproach.distance / 1000000).toFixed(2)} million km
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Velocity: {(data.statistics.closestApproach.velocity / 1000).toFixed(0)} thousand km/h
              </Typography>
            </CardContent>
          </StyledCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Next Close Approach
              </Typography>
              {data.hazardAssessment.nextCloseApproach.date !== 'N/A' ? (
                <>
                  <Typography variant="h4" color="primary" sx={{ mb: 1 }}>
                    {formatDate(data.hazardAssessment.nextCloseApproach.date)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    In {data.hazardAssessment.nextCloseApproach.daysFromNow} days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Distance: {(data.hazardAssessment.nextCloseApproach.distance / 1000000).toFixed(2)} million km
                  </Typography>
                </>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  No future approaches recorded
                </Typography>
              )}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NEOVisualization; 