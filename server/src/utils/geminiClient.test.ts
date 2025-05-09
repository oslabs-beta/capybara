import { describe, it, expect, vi, beforeEach } from 'vitest';
import gemini from './geminiClient';

// Mock the external dependencies
vi.mock('../appSecrets', () => ({
  default: vi.fn().mockResolvedValue({ GEMINI_API: 'mock-api-key' }),
}));

vi.mock('@google/genai', () => {
  const mockGenerateContent = vi.fn().mockResolvedValue({
    text: 'This is a test response from Gemini',
  });

  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        generateContent: mockGenerateContent,
      },
    })),
  };
});

describe('Gemini Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return response text when API call succeeds', async () => {
    const testPrompt = 'Test prompt';
    const response = await gemini(testPrompt);

    expect(response).toBe('This is a test response from Gemini');
  });
});
