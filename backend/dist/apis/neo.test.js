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
const neo_1 = require("./neo");
const axios_1 = __importDefault(require("axios"));
jest.mock('axios');
const mockedAxios = axios_1.default;
describe('getNeoFeed', () => {
    it('returns NEO feed data from NASA API', () => __awaiter(void 0, void 0, void 0, function* () {
        const mockData = { element_count: 42 };
        mockedAxios.get.mockResolvedValueOnce({ data: mockData });
        const data = yield (0, neo_1.getNeoFeed)();
        expect(data).toEqual(mockData);
        expect(mockedAxios.get).toHaveBeenCalled();
    }));
});
