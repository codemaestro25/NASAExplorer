import axios from 'axios';
import type {
  EONETResponse,
  NEOResponse,
  RoverResponse,
  RoverManifest,
  EPICResponse
} from '../types/nasa';

// NASA API Base URL
const NASA_API_BASE = 'https://api.nasa.gov';

// NASA API Key - Replace with your actual API key from https://api.nasa.gov/
const API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';

// Create axios instance with base configuration
const nasaApi = axios.create({
  baseURL: NASA_API_BASE,
  timeout: 10000,
});

// Request interceptor to add API key to all requests
nasaApi.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: API_KEY,
  };
  return config;
});

// EONET API (Earth Observatory Natural Event Tracker)
export const eonetApi = {
  // Get events with optional filters
  getEvents: async (params?: {
    limit?: number;
    days?: number;
    category?: string;
    source?: string;
    status?: 'open' | 'closed';
  }): Promise<EONETResponse> => {
    const response = await nasaApi.get('/EONET/api/v3/events', { params });
    return response.data;
  },

  // Get event categories
  getCategories: async () => {
    const response = await nasaApi.get('/EONET/api/v3/categories');
    return response.data;
  },

  // Get event sources
  getSources: async () => {
    const response = await nasaApi.get('/EONET/api/v3/sources');
    return response.data;
  },
};

// NEO (Near Earth Object) API
export const neoApi = {
  // Get near earth objects for a date range
  getFeed: async (startDate: string, endDate: string): Promise<NEOResponse> => {
    const response = await nasaApi.get('/neo/rest/v1/feed', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  // Get specific NEO by ID
  getById: async (asteroidId: string) => {
    const response = await nasaApi.get(`/neo/rest/v1/neo/${asteroidId}`);
    return response.data;
  },

  // Get NEO browse data
  getBrowse: async (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await nasaApi.get('/neo/rest/v1/neo/browse', { params });
    return response.data;
  },
};

// Mars Rover API
export const marsRoverApi = {
  // Get photos from a specific rover
  getPhotos: async (
    rover: string,
    params?: {
      sol?: number;
      earth_date?: string;
      camera?: string;
      page?: number;
    }
  ): Promise<RoverResponse> => {
    const response = await nasaApi.get(`/mars-photos/api/v1/rovers/${rover}/photos`, {
      params,
    });
    return response.data;
  },

  // Get rover manifest
  getManifest: async (rover: string): Promise<RoverManifest> => {
    const response = await nasaApi.get(`/mars-photos/api/v1/manifests/${rover}`);
    return response.data;
  },

  // Get available rovers
  getRovers: async () => {
    const response = await nasaApi.get('/mars-photos/api/v1/rovers');
    return response.data;
  },
};

// EPIC (Earth Polychromatic Imaging Camera) API
export const epicApi = {
  // Get EPIC images for a specific date
  getImages: async (date: string): Promise<EPICResponse[]> => {
    const response = await nasaApi.get(`/EPIC/api/natural/date/${date}`);
    return response.data;
  },

  // Get latest EPIC images
  getLatest: async (): Promise<EPICResponse[]> => {
    const response = await nasaApi.get('/EPIC/api/natural/latest');
    return response.data;
  },

  // Get EPIC images for a date range
  getImagesByDateRange: async (startDate: string, endDate: string): Promise<EPICResponse[]> => {
    const response = await nasaApi.get('/EPIC/api/natural/all', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },
};

// Utility function to get image URL for EPIC
export const getEpicImageUrl = (date: string, image: string, type: 'natural' | 'enhanced' = 'natural') => {
  const [year, month, day] = date.split('-');
  return `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${image}.png`;
};

export default nasaApi; 