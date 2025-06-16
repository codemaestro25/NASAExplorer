import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = process.env.NASA_API_KEY;

// GET /api/apod - Get today's APOD
export const apod = async (req, res) => {
    try {
        const response = await axios.get(NASA_APOD_URL, {
            params: {
                api_key: NASA_API_KEY
            }
        });

        res.json(response.data);
    } catch (error) {
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


