import { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const BASE_URL_MANIFEST = 'https://api.nasa.gov/mars-photos/api/v1';

const getManifest = async (rover: string) => {
  const url = `${BASE_URL_MANIFEST}/manifests/${rover}?api_key=${NASA_API_KEY}`;
  const { data } = await axios.get(url);
  return data.photo_manifest;
};

const getPhotos = async (rover: string, params: any) => {
  const url = `${BASE_URL}/${rover}/photos`;
  const { data } = await axios.get(url, { params });
  return data.photos;
};

// const validateEarthDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

// GET /api/mars/rovers - Get list of available rovers
export const getRovers = async (req: Request, res: Response): Promise<void> => {
  try {
    const response = await axios.get(`${BASE_URL}?api_key=${NASA_API_KEY}`);
    res.json(response.data);
  } catch (error: any) {
    console.error('Error fetching rovers:', error);
    res.status(500).json({ 
      error: 'Failed to fetch Mars rovers',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// GET /api/mars/manifest/:rover - Get rover manifest (REMOVING THIS ENDPOINT)
/*
export const getRoverManifest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { rover } = req.params;
    
    if (!rover) {
      res.status(400).json({ error: 'Rover name is required' });
      return;
    }

    const manifest = await getManifest(rover);
    res.json({ photo_manifest: manifest });
  } catch (error: any) {
    console.error('Error fetching rover manifest:', error);
    res.status(500).json({ 
      error: 'Failed to fetch rover manifest',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
*/

// GET /api/mars/photos - Get Mars rover photos OR manifest
export const marsRover = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rover, earth_date, camera, page } = req.query;

      if (!rover || typeof rover !== 'string') {
        res.status(400).json({ error: 'Rover name is required' });
        return;
      }

      // If no photo-specific params are provided, return just the manifest
      if (!earth_date && !camera && !page) {
        const manifest = await getManifest(rover);
        res.json({ photo_manifest: manifest });
        return;
      }

      // Fetch manifest to get valid date range for photo searches
      const manifest = await getManifest(rover);

      // edge case: check if earth_date is within available range for the photos
      if (earth_date && typeof earth_date === 'string') {
        if (earth_date < manifest.landing_date || earth_date > manifest.max_date) {
          res.status(400).json({
            error: `Photos for ${rover} are only available between ${manifest.landing_date} and ${manifest.max_date}.`
          });
          return;
        }
      }

      // Prepare params for NASA API
      const params: any = {
        api_key: NASA_API_KEY,
        page: page || 1,
        ...(earth_date && { earth_date }),
        ...(camera && { camera }),
      };

      const photos = await getPhotos(rover, params);
      res.json({ photos });
    } catch (error: any) {
      console.error('Error fetching rover data:', error);
      res.status(500).json({ 
        error: 'Failed to fetch rover data', 
        details: error instanceof Error ? error.message : error 
      });
    }
  };




