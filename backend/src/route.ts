import { Router } from 'express';
import { apod } from './apis/apod';
import { marsRover, getRovers } from './apis/mars_rover';
import { eonetEvents, eonetCategories, eonetSources } from './apis/eonet';
import { neoFeed, neoBrowse, neoById, getProcessedNEOById } from './apis/neo';
import { chatbot } from './apis/chatbot';

const router = Router();

// APOD (Astronomy Picture of the Day) routes
router.get('/api/apod', apod);

// Mars Rover routes
router.get('/mars/rovers', getRovers);
router.get('/mars/photos', marsRover);

// EONET (Earth Observatory Natural Event Tracker) routes
router.get('/eonet/events', eonetEvents);
router.get('/eonet/categories', eonetCategories);
router.get('/eonet/sources', eonetSources);

// NEO (Near Earth Object) routes
router.get('/neo/feed', neoFeed);
router.get('/neo/browse', neoBrowse);
router.get('/neo/:id', neoById);
router.get('/neo/:id/visualization', async (req, res) => {
    try {
        const { id } = req.params;
        const processedData = await getProcessedNEOById(id);
        res.json(processedData);
    } catch (error: any) {
        console.error('Error fetching processed NEO data:', error);
        res.status(500).json({ 
            error: 'Failed to fetch processed NEO data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

// Chatbot route
router.post('/api/chat', chatbot);

export default router;

