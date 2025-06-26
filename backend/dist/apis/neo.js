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
exports.getProcessedNEOById = exports.processNEODataForVisualization = exports.neoById = exports.neoBrowse = exports.neoFeed = void 0;
exports.getNeoFeed = getNeoFeed;
exports.getNeoById = getNeoById;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NASA_NEO_URL = 'https://api.nasa.gov/neo/rest/v1/feed';
const NASA_NEO_BROWSE_URL = 'https://api.nasa.gov/neo/rest/v1/neo/browse';
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
// GET /api/neo/feed - Get Near Earth Objects for a date range
const neoFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        if (!dateRegex.test(start_date) || !dateRegex.test(end_date)) {
            res.status(400).json({
                error: 'Invalid date format. Use YYYY-MM-DD'
            });
            return;
        }
        const response = yield axios_1.default.get(NASA_NEO_URL, {
            params: {
                api_key: NASA_API_KEY,
                start_date,
                end_date
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching NEO feed:', error);
        res.status(500).json({
            error: 'Failed to fetch Near Earth Object feed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.neoFeed = neoFeed;
// GET /api/neo/browse - Get NEO browse data
const neoBrowse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 0, size = 20, sort = 'id' } = req.query;
        const response = yield axios_1.default.get(NASA_NEO_BROWSE_URL, {
            params: {
                api_key: NASA_API_KEY,
                page: parseInt(page),
                size: parseInt(size),
                sort
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching NEO browse:', error);
        res.status(500).json({
            error: 'Failed to fetch NEO browse data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.neoBrowse = neoBrowse;
// GET /api/neo/:id - Get specific NEO by ID
const neoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ error: 'NEO ID is required' });
            return;
        }
        const response = yield axios_1.default.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}`, {
            params: {
                api_key: NASA_API_KEY
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching NEO by ID:', error);
        res.status(500).json({
            error: 'Failed to fetch NEO by ID',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.neoById = neoById;
function getNeoFeed() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(NASA_NEO_URL, {
            params: {
                api_key: NASA_API_KEY
            }
        });
        return response.data;
    });
}
function getNeoById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(`https://api.nasa.gov/neo/rest/v1/neo/${id}`, {
            params: {
                api_key: NASA_API_KEY
            }
        });
        return response.data;
    });
}
const processNEODataForVisualization = (neoData) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const closeApproachData = neoData.close_approach_data || [];
    const today = new Date();
    // Sort approaches by date
    const sortedApproaches = closeApproachData.sort((a, b) => new Date(a.close_approach_date).getTime() - new Date(b.close_approach_date).getTime());
    // Separate historical and future approaches
    const historicalApproaches = sortedApproaches.filter((approach) => new Date(approach.close_approach_date) < today);
    const futureApproaches = sortedApproaches.filter((approach) => new Date(approach.close_approach_date) >= today);
    // Extract data for charts
    const dates = sortedApproaches.map((approach) => approach.close_approach_date);
    const distances = sortedApproaches.map((approach) => parseFloat(approach.miss_distance.kilometers));
    const velocities = sortedApproaches.map((approach) => parseFloat(approach.relative_velocity.kilometers_per_hour));
    // Find closest approach
    const closestApproach = sortedApproaches.reduce((closest, current) => {
        const currentDistance = parseFloat(current.miss_distance.kilometers);
        const closestDistance = parseFloat(closest.miss_distance.kilometers);
        return currentDistance < closestDistance ? current : closest;
    });
    // Calculate statistics
    const averageDistance = distances.reduce((sum, distance) => sum + distance, 0) / distances.length;
    const averageVelocity = velocities.reduce((sum, velocity) => sum + velocity, 0) / velocities.length;
    // Calculate hazard assessment
    const nextCloseApproach = futureApproaches[0];
    const daysFromNow = nextCloseApproach ?
        Math.ceil((new Date(nextCloseApproach.close_approach_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) :
        0;
    // Risk assessment algorithm
    const minDistance = Math.min(...distances);
    const estimatedDiameter = ((_b = (_a = neoData.estimated_diameter) === null || _a === void 0 ? void 0 : _a.kilometers) === null || _b === void 0 ? void 0 : _b.estimated) || 0.1;
    let riskScore = 0;
    if (minDistance < 1000000)
        riskScore += 30; // Very close
    if (minDistance < 5000000)
        riskScore += 20; // Close
    if (neoData.is_potentially_hazardous_asteroid)
        riskScore += 25;
    if (estimatedDiameter > 1)
        riskScore += 15; // Large object
    if (estimatedDiameter > 0.5)
        riskScore += 10;
    const riskLevel = riskScore >= 50 ? 'high' : riskScore >= 30 ? 'medium' : 'low';
    return {
        id: neoData.id,
        name: neoData.name,
        isHazardous: neoData.is_potentially_hazardous_asteroid,
        diameter: {
            min: ((_d = (_c = neoData.estimated_diameter) === null || _c === void 0 ? void 0 : _c.kilometers) === null || _d === void 0 ? void 0 : _d.estimated_min) || 0,
            max: ((_f = (_e = neoData.estimated_diameter) === null || _e === void 0 ? void 0 : _e.kilometers) === null || _f === void 0 ? void 0 : _f.estimated_max) || 0,
            estimated: ((_h = (_g = neoData.estimated_diameter) === null || _g === void 0 ? void 0 : _g.kilometers) === null || _h === void 0 ? void 0 : _h.estimated) || 0
        },
        missDistanceTrend: {
            dates,
            distances,
            velocities
        },
        statistics: {
            closestApproach: {
                date: closestApproach.close_approach_date,
                distance: parseFloat(closestApproach.miss_distance.kilometers),
                velocity: parseFloat(closestApproach.relative_velocity.kilometers_per_hour)
            },
            averageDistance,
            averageVelocity,
            totalApproaches: sortedApproaches.length,
            futureApproaches: futureApproaches.length
        },
        hazardAssessment: {
            riskLevel,
            riskScore,
            nextCloseApproach: nextCloseApproach ? {
                date: nextCloseApproach.close_approach_date,
                distance: parseFloat(nextCloseApproach.miss_distance.kilometers),
                daysFromNow
            } : {
                date: 'N/A',
                distance: 0,
                daysFromNow: 0
            }
        }
    };
};
exports.processNEODataForVisualization = processNEODataForVisualization;
const getProcessedNEOById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawData = yield getNeoById(id);
        return (0, exports.processNEODataForVisualization)(rawData);
    }
    catch (error) {
        console.error('Error processing NEO data:', error);
        throw error;
    }
});
exports.getProcessedNEOById = getProcessedNEOById;
