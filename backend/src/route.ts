import { Router } from 'express';
import { apod } from './apis/apod';
import { marsRover, getRovers } from './apis/mars_rover';
import { eonetEvents, eonetCategories, eonetSources } from './apis/eonet';
import { neoFeed, neoBrowse, neoById } from './apis/neo';

const router = Router();

// APOD (Astronomy Picture of the Day) routes
router.get('/', apod);

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

export default router;

