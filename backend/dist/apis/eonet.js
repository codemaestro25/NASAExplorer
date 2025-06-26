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
exports.eonetSources = exports.eonetCategories = exports.eonetEvents = void 0;
exports.getEonetEvents = getEonetEvents;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
const NASA_EONET_URL = 'https://eonet.gsfc.nasa.gov/api/v3/events';
const NASA_EONET_CATEGORIES_URL = 'https://eonet.gsfc.nasa.gov/api/v3/categories';
const NASA_EONET_SOURCES_URL = 'https://eonet.gsfc.nasa.gov/api/v3/sources';
// GET /api/eonet/events - Get Earth Observatory Natural Event Tracker events
const eonetEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { limit = 50, days = 30, category, source, status = 'open' } = req.query;
        const params = {
            limit: parseInt(limit),
            days: parseInt(days),
            status
        };
        // Add optional parameters if provided
        if (category)
            params.category = category;
        if (source)
            params.source = source;
        const response = yield axios_1.default.get(NASA_EONET_URL, { params });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching EONET events:', error);
        res.status(500).json({
            error: 'Failed to fetch Earth Observatory Natural Event Tracker events',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.eonetEvents = eonetEvents;
// GET /api/eonet/categories - Get EONET categories
const eonetCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(NASA_EONET_CATEGORIES_URL);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching EONET categories:', error);
        res.status(500).json({
            error: 'Failed to fetch EONET categories',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.eonetCategories = eonetCategories;
// GET /api/eonet/sources - Get EONET sources
const eonetSources = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(NASA_EONET_SOURCES_URL);
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching EONET sources:', error);
        res.status(500).json({
            error: 'Failed to fetch EONET sources',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.eonetSources = eonetSources;
function getEonetEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(NASA_EONET_URL, {
            params: {
                api_key: NASA_API_KEY
            }
        });
        return response.data;
    });
}
