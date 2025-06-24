import { getNeoFeed } from './neo';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getNeoFeed', () => {
  it('returns NEO feed data from NASA API', async () => {
    const mockData = { element_count: 42 };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const data = await getNeoFeed();
    expect(data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });
}); 