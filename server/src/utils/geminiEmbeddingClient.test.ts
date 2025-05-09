import { describe, it, expect, vi, beforeEach } from 'vitest';
import generateEmbedding from './geminiEmbeddingClient';

// Mock chalk as it's used in the client
vi.mock('chalk', () => ({
  default: {
    green: (text: string) => text,
    red: (text: string) => text,
  },
}));

// Mock appSecrets to provide a dummy API key
vi.mock('../appSecrets', () => ({
  default: vi.fn().mockResolvedValue({ GEMINI_API: 'mock-embedding-api-key' }),
}));

// This is the mock function for the 'embedContent' method
const mockEmbedContentFn = vi.fn();

// Mock @google/genai
vi.mock('@google/genai', () => {
  return {
    GoogleGenAI: vi.fn().mockImplementation(() => ({
      models: {
        embedContent: mockEmbedContentFn, // Use the externally defined mock function
      },
    })),
  };
});

describe('Gemini Embedding Client', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Setup a default successful response for embedContent for each test
    // The structure needs to match what geminiEmbeddingClient.ts expects:
    // result.embeddings[0].values
    const mockEmbeddingVector = [0.1, 0.2, 0.3, 0.4, 0.5];
    mockEmbedContentFn.mockResolvedValue({
      embeddings: [{ values: mockEmbeddingVector }],
    });
  });

  it('should return an embedding vector when API call succeeds', async () => {
    const testText = 'This is text to be embedded.';
    const expectedVector = [0.1, 0.2, 0.3, 0.4, 0.5]; // Should match the mock setup in beforeEach

    // Act: Call the function to be tested
    const vector = await generateEmbedding(testText);

    // Assert: Check if the dependencies were called and the result is as expected

    // 1. Check if getSecretKeys was called (via the mock for ../appSecrets)
    const getSecretKeysMock = (await import('../appSecrets')).default;
    expect(getSecretKeysMock).toHaveBeenCalledTimes(1);

    // 2. Check if embedContent was called correctly
    expect(mockEmbedContentFn).toHaveBeenCalledTimes(1);
    expect(mockEmbedContentFn).toHaveBeenCalledWith({
      model: 'gemini-embedding-exp-03-07', // As specified in geminiEmbeddingClient.ts
      contents: testText,
    });

    // 3. Check if the returned vector is the one provided by the mock
    expect(vector).toEqual(expectedVector);
  });
});
