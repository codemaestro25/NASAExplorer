import { getMarsRoverPhotos } from './mars_rover';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getMarsRoverPhotos', () => {
  it('returns Mars rover photos from NASA API', async () => {
    const mockData = { photos: [{ id: 1, img_src: 'url' }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const data = await getMarsRoverPhotos('curiosity', '1000');
    expect(data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });
}); 