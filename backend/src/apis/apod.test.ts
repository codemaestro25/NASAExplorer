import { getApodData } from './apod';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getApodData', () => {
  it('returns APOD data from NASA API', async () => {
    const mockData = { title: 'Test APOD', explanation: 'Test explanation' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const data = await getApodData();
    expect(data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });
}); 