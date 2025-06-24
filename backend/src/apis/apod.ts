import axios from 'axios';
import dotenv from 'dotenv';
import { Request, Response } from 'express';

dotenv.config();

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';

// GET /api/apod - Get today's APOD
export const apod = async (req: Request, res: Response): Promise<void> => {
    try {
        const response = await axios.get(NASA_APOD_URL, {
            params: {
                api_key: NASA_API_KEY
            }
        });

        res.json(response.data);
    } catch (error: any) {
        console.error('Error fetching APOD:', error);
        res.status(500).json({ 
            error: 'Failed to fetch Astronomy Picture of the Day',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// GET /api/apod/date/:date - Get APOD for a specific date (YYYY-MM-DD)
// Uncomment and use if needed
// export const apodByDate = async (req, res) => {
//     try {
//         const { date } = req.params;
//         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//         if (!dateRegex.test(date)) {
//             return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
//         }
//         const response = await axios.get(NASA_APOD_URL, {
//             params: {
//                 api_key: NASA_API_KEY,
//                 date
//             }
//         });
//         res.json(response.data);
//     } catch (error) {
//         console.error('Error fetching APOD for date:', error);
//         res.status(500).json({ 
//             error: 'Failed to fetch Astronomy Picture of the Day for the specified date',
//             details: error instanceof Error ? error.message : 'Unknown error'
//         });
//     }
// };

export async function getApodData(): Promise<any> {
    const response = await axios.get(NASA_APOD_URL, {
        params: { api_key: NASA_API_KEY }
    });
    return response.data;
}


