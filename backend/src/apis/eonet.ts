import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const NASA_EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
const NASA_EONET_CATEGORIES_URL = 'https://eonet.gsfc.nasa.gov/api/v3/categories';
const NASA_EONET_SOURCES_URL = 'https://eonet.gsfc.nasa.gov/api/v3/sources';

// GET /api/eonet/events - Get Earth Observatory Natural Event Tracker events
export const eonetEvents = async (req: Request, res: Response): Promise<void> => {
    try {
        const { 
            limit = 50, 
            days = 30, 
            category, 
            source, 
            status = 'open' 
        } = req.query;

        const params: any = {
            limit: parseInt(limit as string),
            days: parseInt(days as string),
            status
        };

        // Add optional parameters if provided
        if (category) params.category = category;
        if (source) params.source = source;

        const response = await axios.get(NASA_EONET_URL, { params });

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching EONET events:', error);
        res.status(500).json({ 
            error: 'Failed to fetch Earth Observatory Natural Event Tracker events',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// GET /api/eonet/categories - Get EONET categories
export const eonetCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(NASA_EONET_CATEGORIES_URL);
        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching EONET categories:', error);
        res.status(500).json({ 
            error: 'Failed to fetch EONET categories',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// GET /api/eonet/sources - Get EONET sources
export const eonetSources = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(NASA_EONET_SOURCES_URL);
        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching EONET sources:', error);
        res.status(500).json({ 
            error: 'Failed to fetch EONET sources',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}; 