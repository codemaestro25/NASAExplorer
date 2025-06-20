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