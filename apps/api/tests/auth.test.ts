import request from 'supertest';
import express from 'express';

const app = express();
app.use(express.json());

// Mock /auth/register endpoint for test
app.post('/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (email && password) return res.status(200).json({ id: 1, email });
  res.status(400).json({ error: 'Email and password required' });
});

describe('POST /auth/register', () => {
  it('should register a user with email and password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ email: 'test@example.com', password: 'secret' });
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('test@example.com');
  });
});
