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
exports.apod = void 0;
exports.getApodData = getApodData;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';
const NASA_API_KEY = '8j7gw73snXCD8lpaEe5nSBZSeFTUV8Qn6umZuod1';
// GET /api/apod - Get today's APOD
const apod = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(NASA_APOD_URL, {
            params: {
                api_key: NASA_API_KEY
            }
        });
        res.json(response.data);
    }
    catch (error) {
        console.error('Error fetching APOD:', error);
        res.status(500).json({
            error: 'Failed to fetch Astronomy Picture of the Day',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.apod = apod;
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
function getApodData() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield axios_1.default.get(NASA_APOD_URL, {
            params: { api_key: NASA_API_KEY }
        });
        return response.data;
    });
}
