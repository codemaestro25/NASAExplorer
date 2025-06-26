"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mars_rover_1 = require("./mars_rover");
//mainly for the date validations
describe('validateEarthDate', () => {
    const manifest = {
        name: 'Curiosity',
        landing_date: '2012-08-06',
        max_date: '2023-12-31',
        total_photos: 1000
    };
    it('returns invalid for a future date', () => {
        const futureDate = '2999-01-01';
        const result = (0, mars_rover_1.validateEarthDate)(futureDate, manifest);
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/future/);
    });
    it('returns invalid for a date before landing', () => {
        const beforeLanding = '2010-01-01';
        const result = (0, mars_rover_1.validateEarthDate)(beforeLanding, manifest);
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/before/);
    });
    it('returns invalid for a date after max_date', () => {
        const afterMax = '2024-01-01';
        const result = (0, mars_rover_1.validateEarthDate)(afterMax, manifest);
        expect(result.isValid).toBe(false);
        expect(result.error).toMatch(/after/);
    });
    it('returns valid for a date within range', () => {
        const validDate = '2015-05-01';
        const result = (0, mars_rover_1.validateEarthDate)(validDate, manifest);
        expect(result.isValid).toBe(true);
    });
});
