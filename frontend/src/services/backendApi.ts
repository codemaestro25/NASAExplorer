import axios from 'axios';
import type {
  EONETResponse,
  NEOResponse,
  RoverResponse,
  RoverManifest,
  EPICResponse
} from '../types/nasa';

// Backend API Base URL
const BACKEND_API_BASE = 'http://localhost:3000';

// Create axios instance with base configuration
const backendApi = axios.create({
  baseURL: BACKEND_API_BASE,
  timeout: 10000,
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
    const response = await backendApi.get('/eonet/events', { params });
    return response.data;
  },

  // Get event categories
  getCategories: async () => {
    const response = await backendApi.get('/eonet/categories');
    return response.data;
  },

  // Get event sources
  getSources: async () => {
    const response = await backendApi.get('/eonet/sources');
    return response.data;
  },
};

// NEO (Near Earth Object) API
export const neoApi = {
  // Get near earth objects for a date range
  getFeed: async (startDate: string, endDate: string): Promise<NEOResponse> => {
    const response = await backendApi.get('/neo/feed', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  },

  // Get specific NEO by ID
  getById: async (asteroidId: string) => {
    const response = await backendApi.get(`/neo/${asteroidId}`);
    return response.data;
  },

  // Get NEO browse data
  getBrowse: async (params?: {
    page?: number;
    size?: number;
    sort?: string;
  }) => {
    const response = await backendApi.get('/neo/browse', { params });
    return response.data;
  },
};

// Mars Rover API
export const marsRoverApi = {
  // Get photos from a specific rover, or the manifest if no other params are provided
  getPhotos: async (
    rover: string,
    params?: {
      sol?: number;
      earth_date?: string;
      camera?: string;
      page?: number;
    }
  ): Promise<RoverResponse | RoverManifest> => {
    const response = await backendApi.get('/mars/photos', {
      params: { rover, ...params },
    });
    return response.data;
  },

  // Get available rovers
  getRovers: async () => {
    const response = await backendApi.get('/mars/rovers');
    return response.data;
  },
};

// APOD (Astronomy Picture of the Day) API
export const apodApi = {
  // Get today's APOD
  getToday: async () => {
    const response = await backendApi.get('/');
    return response.data;
  },
};

export default backendApi; 