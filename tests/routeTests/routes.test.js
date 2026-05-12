import request from 'supertest';
import app from '#/app.js';
import { sequelize } from '#/models/index.js';

afterAll(async () => {
  await sequelize.close();
});

describe('GET /', () => {
  it('should return API running', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.text).toBe('API running');
  });
});
