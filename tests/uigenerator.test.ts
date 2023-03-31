import { NextApiRequest, NextApiResponse } from 'next';
import uigenerator from '../pages/api/uigenerator';

describe('Test the handler function', () => {
  it('should respond with 200 status code',  () => {
    let mockReq: NextApiRequest = {
      method: 'POST',
      body: {
        query: 'test query',
        component: 'test component',
      },
    } as NextApiRequest;

    let mockRes: jest.Mocked<NextApiResponse>  = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<NextApiResponse>;

     uigenerator(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('should respond with the expected JSON object',  () => {
    const mockReq: NextApiRequest = {
      method: 'POST',
      body: {
        query: 'test query',
        component: 'test component',
      },
    } as NextApiRequest;

    const mockRes: jest.Mocked<NextApiResponse> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as jest.Mocked<NextApiResponse>;;

     uigenerator(mockReq, mockRes);

    expect(mockRes.json).toHaveBeenCalledWith({
      query: mockReq.body.query,
      component: mockReq.body.component,
      code: expect.any(String),
    });
  });
});
