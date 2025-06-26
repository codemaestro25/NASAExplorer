"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEarthDate = exports.marsRover = exports.getRovers = void 0;
exports.getMarsRoverPhotos = getMarsRoverPhotos;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
const BASE_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
const BASE_URL_MANIFEST = 'https://api.nasa.gov/mars-photos/api/v1';
const getManifest = (rover) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${BASE_URL_MANIFEST}/manifests/${rover}?api_key=${NASA_API_KEY}`;
    const { data } = yield axios_1.default.get(url);
    return data.photo_manifest;
});
const getPhotos = (rover, params) => __awaiter(void 0, void 0, void 0, function* () {
    const url = `${BASE_URL}/${rover}/photos`;
    const { data } = yield axios_1.default.get(url, { params });
    return data.photos;
});
// Enhanced date validation function
const validateEarthDate = (date, manifest) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    const requestedDate = new Date(date);
    const landingDate = new Date(manifest.landing_date);
    const maxDate = new Date(manifest.max_date);
    // Check if date is in the future
    if (requestedDate > today) {
        return {
            isValid: false,
            error: `Cannot fetch photos for future dates. The requested date ${date} is in the future.`
        };
    }
    // Check if date is before landing date
    if (requestedDate < landingDate) {
        return {
            isValid: false,
            error: `No photos available before ${manifest.landing_date}. The ${manifest.name} rover landed on ${manifest.landing_date}.`
        };
    }
    // Check if date is after the last photo date
    if (requestedDate > maxDate) {
        return {
            isValid: false,
            error: `No photos available after ${manifest.max_date}. The last photo from ${manifest.name} was taken on ${manifest.max_date}.`
        };
    }
    return { isValid: true };
};
exports.validateEarthDate = validateEarthDate;
// GET /api/mars/rovers - Get list of available rovers
const getRovers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}?api_key=${NASA_API_KEY}`);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching rovers:', error);
        res.status(500).json({
            error: 'Failed to fetch Mars rovers',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getRovers = getRovers;
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
const marsRover = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { rover, earth_date, camera, page } = req.query;
        if (!rover || typeof rover !== 'string') {
            res.status(400).json({ error: 'Rover name is required' });
            return;
        }
        // If no photo-specific params are provided, return just the manifest
        if (!earth_date && !camera && !page) {
            const manifest = yield getManifest(rover);
            res.json({ photo_manifest: manifest });
            return;
        }
        // Fetch manifest to get valid date range for photo searches
        const manifest = yield getManifest(rover);
        // Enhanced validation for earth_date
        if (earth_date && typeof earth_date === 'string') {
            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(earth_date)) {
                res.status(400).json({
                    error: 'Invalid date format. Please use YYYY-MM-DD format (e.g., 2023-12-25).'
                });
                return;
            }
            // Validate date range and future dates
            const validation = validateEarthDate(earth_date, manifest);
            if (!validation.isValid) {
                res.status(400).json({
                    error: validation.error,
                    manifest: {
                        rover: manifest.name,
                        landing_date: manifest.landing_date,
                        max_date: manifest.max_date,
                        total_photos: manifest.total_photos
                    }
                });
                return;
            }
        }
        // Prepare params for NASA API
        const params = Object.assign(Object.assign({ api_key: NASA_API_KEY, page: page || 1 }, (earth_date && { earth_date })), (camera && { camera }));
        const photos = yield getPhotos(rover, params);
        // Check if photos were found
        if (photos.length === 0) {
            res.json({
                photos: [],
                message: `No photos found for ${rover} on ${earth_date}${camera ? ` with camera ${camera}` : ''}.`,
                manifest: {
                    rover: manifest.name,
                    landing_date: manifest.landing_date,
                    max_date: manifest.max_date,
                    total_photos: manifest.total_photos
                }
            });
            return;
        }
        res.json({ photos });
    }
    catch (error) {
        console.error('Error fetching rover data:', error);
        // Handle specific NASA API errors
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 400) {
            res.status(400).json({
                error: 'Invalid request parameters',
                details: ((_b = error.response.data) === null || _b === void 0 ? void 0 : _b.error) || 'Bad request to NASA API'
            });
            return;
        }
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === 404) {
            res.status(404).json({
                error: 'Rover not found',
                details: 'The specified rover does not exist or is not available.'
            });
            return;
        }
        res.status(500).json({
            error: 'Failed to fetch rover data',
            details: error instanceof Error ? error.message : error
        });
    }
});
exports.marsRover = marsRover;
function getMarsRoverPhotos() {
    return __awaiter(this, arguments, void 0, function* (rover = 'curiosity', sol = '1000') {
        const NASA_MARS_ROVER_URL = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos`;
        const response = yield axios_1.default.get(NASA_MARS_ROVER_URL, {
            params: {
                api_key: NASA_API_KEY,
                sol
            }
        });
        return response.data;
    });
}
