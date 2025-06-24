import { getEonetEvents } from './eonet';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('getEonetEvents', () => {
  it('returns EONET events data from NASA API', async () => {
    const mockData = { events: [{ id: 1, title: 'Event 1' }] };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const data = await getEonetEvents();
    expect(data).toEqual(mockData);
    expect(mockedAxios.get).toHaveBeenCalled();
  });
}); 