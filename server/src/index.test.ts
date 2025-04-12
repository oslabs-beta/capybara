import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';
import app from './index';

describe('GET /', () => {
  it("should return 'Hello from the server side! Time to go!'", async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello from the server side! Time to go!');
  });
});
