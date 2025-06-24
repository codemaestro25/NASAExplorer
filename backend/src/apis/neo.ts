import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const NASA_NEO_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const NASA_NEO_BROWSE_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse';
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';

// GET /api/neo/feed - Get Near Earth Objects for a date range
export const neoFeed = async (req: Request, res: Response): Promise<void> => {
    try {
        const { start_date, end_date } = req.query;

        if (!start_date || !end_date) {
            res.status(400).json({ 
                error: 'Both start_date and end_date are required (YYYY-MM-DD format)' 
            });
            return;
        }

        // Validate date format
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(start_date as string) || !dateRegex.test(end_date as string)) {
            res.status(400).json({ 
                error: 'Invalid date format. Use YYYY-MM-DD' 
            });
            return;
        }

        const response = await axios.get(NASA_NEO_URL, {
            params: {
                api_key: NASA_API_KEY,
                start_date,
                end_date
            }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching NEO feed:', error);
        res.status(500).json({ 
            error: 'Failed to fetch Near Earth Object feed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// GET /api/neo/browse - Get NEO browse data
export const neoBrowse = async (req: Request, res: Response): Promise<void> => {
    try {
        const { page = 0, size = 20, sort = 'id' } = req.query;

        const response = await axios.get(NASA_NEO_BROWSE_URL, {
            params: {
                api_key: NASA_API_KEY,
                page: parseInt(page as string),
                size: parseInt(size as string),
                sort
            }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching NEO browse:', error);
        res.status(500).json({ 
            error: 'Failed to fetch NEO browse data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// GET /api/neo/:id - Get specific NEO by ID
export const neoById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!id) {
            res.status(400).json({ error: 'NEO ID is required' });
            return;
        }

        const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}`, {
            params: {
                api_key: NASA_API_KEY
            }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching NEO by ID:', error);
        res.status(500).json({ 
            error: 'Failed to fetch NEO by ID',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export async function getNeoFeed(): Promise<any> {
    const response = await axios.get(NASA_NEO_URL, {
        params: {
            api_key: NASA_API_KEY
        }
    });
    return response.data;
}

export async function getNeoById(id: string): Promise<any> {
    const response = await axios.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}`, {
        params: {
            api_key: NASA_API_KEY
        }
    });
    return response.data;
}

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

export const processNEODataForVisualization = (neoData: any): ProcessedNEOData => {
  const closeApproachData = neoData.close_approach_data || [];
  const today = new Date();
  
  // Sort approaches by date
  const sortedApproaches = closeApproachData.sort((a: any, b: any) => 
    new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime()
  );

  // Separate historical and future approaches
  const historicalApproaches = sortedApproaches.filter((approach: any) => 
    new Date(approach.close_approach_date) < today
  );
  const futureApproaches = sortedApproaches.filter((approach: any) => 
    new Date(approach.close_approach_date) >= today
  );

  // Extract data for charts
  const dates = sortedApproaches.map((approach: any) => approach.close_approach_date);
  const distances = sortedApproaches.map((approach: any) => 
    parseFloat(approach.miss_distance.kilometers)
  );
  const velocities = sortedApproaches.map((approach: any) => 
    parseFloat(approach.relative_velocity.kilometers_per_hour)
  );

  // Find closest approach
  const closestApproach = sortedApproaches.reduce((closest: any, current: any) => {
    const currentDistance = parseFloat(current.miss_distance.kilometers);
    const closestDistance = parseFloat(closest.miss_distance.kilometers);
    return currentDistance < closestDistance ? current : closest;
  });

  // Calculate statistics
  const averageDistance = distances.reduce((sum: number, distance: number) => sum + distance, 0) / distances.length;
  const averageVelocity = velocities.reduce((sum: number, velocity: number) => sum + velocity, 0) / velocities.length;

  // Calculate hazard assessment
  const nextCloseApproach = futureApproaches[0];
  const daysFromNow = nextCloseApproach ? 
    Math.ceil((new Date(nextCloseApproach.close_approach_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : 
    0;

  // Risk assessment algorithm
  const minDistance = Math.min(...distances);
  const estimatedDiameter = neoData.estimated_diameter?.kilometers?.estimated || 0.1;
  
  let riskScore = 0;
  if (minDistance < 1000000) riskScore += 30; // Very close
  if (minDistance < 5000000) riskScore += 20; // Close
  if (neoData.is_potentially_hazardous_asteroid) riskScore += 25;
  if (estimatedDiameter > 1) riskScore += 15; // Large object
  if (estimatedDiameter > 0.5) riskScore += 10;
  
  const riskLevel = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';

  return {
    id: neoData.id,
    name: neoData.name,
    isHazardous: neoData.is_potentially_hazardous_asteroid,
    diameter: {
      min: neoData.estimated_diameter?.kilometers?.estimated_min || 0,
      max: neoData.estimated_diameter?.kilometers?.estimated_max || 0,
      estimated: neoData.estimated_diameter?.kilometers?.estimated || 0
    },
    missDistanceTrend: {
      dates,
      distances,
      velocities
    },
    statistics: {
      closestApproach: {
        date: closestApproach.close_approach_date,
        distance: parseFloat(closestApproach.miss_distance.kilometers),
        velocity: parseFloat(closestApproach.relative_velocity.kilometers_per_hour)
      },
      averageDistance,
      averageVelocity,
      totalApproaches: sortedApproaches.length,
      futureApproaches: futureApproaches.length
    },
    hazardAssessment: {
      riskLevel,
      riskScore,
      nextCloseApproach: nextCloseApproach ? {
        date: nextCloseApproach.close_approach_date,
        distance: parseFloat(nextCloseApproach.miss_distance.kilometers),
        daysFromNow
      } : {
        date: 'N/A',
        distance: 0,
        daysFromNow: 0
      }
    }
  };
};

export const getProcessedNEOById = async (id: string): Promise<ProcessedNEOData> => {
  try {
    const rawData = await getNeoById(id);
    return processNEODataForVisualization(rawData);
  } catch (error) {
    console.error('Error processing NEO data:', error);
    throw error;
  }
};