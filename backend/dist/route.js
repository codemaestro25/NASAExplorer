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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const apod_1 = require("./apis/apod");
const mars_rover_1 = require("./apis/mars_rover");
const eonet_1 = require("./apis/eonet");
const neo_1 = require("./apis/neo");
const chatbot_1 = require("./apis/chatbot");
const router = (0, express_1.Router)();
// APOD (Astronomy Picture of the Day) routes
router.get('/api/apod', apod_1.apod);
// Mars Rover routes
router.get('/mars/rovers', mars_rover_1.getRovers);
router.get('/mars/photos', mars_rover_1.marsRover);
// EONET (Earth Observatory Natural Event Tracker) routes
router.get('/eonet/events', eonet_1.eonetEvents);
router.get('/eonet/categories', eonet_1.eonetCategories);
router.get('/eonet/sources', eonet_1.eonetSources);
// NEO (Near Earth Object) routes
router.get('/neo/feed', neo_1.neoFeed);
router.get('/neo/browse', neo_1.neoBrowse);
router.get('/neo/:id', neo_1.neoById);
router.get('/neo/:id/visualization', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const processedData = yield (0, neo_1.getProcessedNEOById)(id);
        res.json(processedData);
    }
    catch (error) {
        console.error('Error fetching processed NEO data:', error);
        res.status(500).json({
            error: 'Failed to fetch processed NEO data',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}));
// Chatbot route
router.post('/api/chat', chatbot_1.chatbot);
exports.default = router;
