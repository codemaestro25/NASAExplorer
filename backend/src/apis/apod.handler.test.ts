import { apod } from './apod';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('apod route handler', () => {
  it('responds with APOD data', async () => {
    const mockData = { title: 'Test APOD', explanation: 'Test explanation' };
    mockedAxios.get.mockResolvedValueOnce({ data: mockData });
    const req = {} as any;
    const res = { json: jest.fn() } as any;
    await apod(req, res);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('handles errors', async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error('fail'));
    const req = {} as any;
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() } as any;
    await apod(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });
}); 