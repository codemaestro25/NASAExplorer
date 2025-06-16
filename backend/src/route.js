import { Router } from 'express';
import { apod } from './apis/apod';
import { marsRover } from './apis/mars_rover';

const router = Router();

router.get('/', apod);
router.get('/mars/photos', marsRover);

export default router; 