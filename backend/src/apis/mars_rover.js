import { Router, Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

const router = Router();
const NASA_API_KEY = process.env.NASA_API_KEY;
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const BASE_URL_MANIFEST = 'https://api.nasa.gov/mars-photos/api/v1';


const getManifest = async (rover) => {
  const url = `${BASE_URL_MANIFEST}/manifests/${rover}?api_key=${NASA_API_KEY}`;
  const { data } = await axios.get(url);
  return data.photo_manifest.slice(0, -1);
};

const getPhotos = async (rover, params) => {
  const url = `${BASE_URL}/${rover}/photos`;
  const { data } = await axios.get(url, { params });
  return data.photos;
};

// const validateEarthDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);


 export const marsRover = async (req, res) => {
    try {
      const { rover , earth_date, camera, page = 1 } = req.query;

      // Fetch manifest to get valid date range
      const manifest = await getManifest(rover);

      // edge case: check if earth_date is within available range for the photos
      if (earth_date && typeof earth_date === 'string') {
        if (earth_date < manifest.landing_date || earth_date > manifest.max_date) {
          return res.status(400).json({
            error: `Photos for ${rover} are only available between ${manifest.landing_date} and ${manifest.max_date}.`
          });
        }
      }

      // Prepare params for NASA API
      const params = {
        api_key: NASA_API_KEY,
        page,
        ...(earth_date && { earth_date }),
        ...(camera && { camera }),
        ...(rover && { rover }),
      };

      const photos = await getPhotos(rover, params);
      res.json({ manifest, photos });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch rover data', details: error instanceof Error ? error.message : error });
    }
  };




