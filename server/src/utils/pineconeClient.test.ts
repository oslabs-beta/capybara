import { describe, it, expect, vi } from 'vitest';
import pineconeVector from './pineconeClient'; //

// Mock for upsert function
const mockUpsert = vi.fn().mockResolvedValue({ upsertedCount: 1 }); //
// Mock for query function
const mockQuery = vi.fn().mockResolvedValue({
  //
  matches: [
    //
    {
      id: 'event-similar-1',
      score: 0.9,
      metadata: { message: 'Similar event 1' },
    }, //
    {
      id: 'event-similar-2',
      score: 0.8,
      metadata: { message: 'Similar event 2' },
    }, //
  ],
});

// Mock Pinecone dependency
vi.mock('@pinecone-database/pinecone', () => ({
  //
  Pinecone: vi.fn().mockImplementation(() => ({
    //
    index: vi.fn().mockReturnValue({
      //
      query: mockQuery, // Use the new mockQuery //
      upsert: mockUpsert, //
    }),
  })),
}));

// Mock appSecrets - only provide what's needed
vi.mock('../appSecrets', () => ({
  //
  default: vi.fn().mockResolvedValue({
    //
    PINECONE_API: 'mock-api-key', //
  }),
}));

// Simple mock for chalk to avoid console coloring
interface ChalkColors {
  green: (text: string) => string; //
  red: (text: string) => string; //
  redBright: (text: string) => string; //
}

vi.mock('chalk', () => ({
  //
  default: {
    green: (text: string): string => text, //
    red: (text: string): string => text, //
    redBright: (text: string): string => text, //
  } satisfies ChalkColors, //
}));

describe('Pinecone Vector Client', () => {
  // Reset mocks before each test to ensure test isolation
  beforeEach(() => {
    mockUpsert.mockClear();
    mockQuery.mockClear();
    // If appSecrets.default is called multiple times and needs fresh mock for each test
    // vi.mocked(getSecretKeys).mockResolvedValue({ PINECONE_API: 'mock-api-key' });
  });

  it('should initialize and connect to Pinecone index', async () => {
    //
    const client = await pineconeVector(); //
    expect(client).toBeDefined(); //
    expect(client.index).toBeDefined(); //
  });

  it('should upsert a single K8s event embedding', async () => {
    //
    const client = await pineconeVector(); //

    const singleEvent = {
      //
      id: 'test-event-1', //
      values: new Array(1536).fill(0.1), //
      metadata: {
        //
        namespace: 'default', //
        kind: 'Pod', //
        name: 'nginx', //
        reason: 'Started', //
        message: 'Container started successfully', //
        timestamp: '2025-05-07T12:00:00Z', //
      },
    };

    const result = await client.upsertEvent(singleEvent); //

    expect(result).toEqual({ upsertedCount: 1 }); //
    expect(mockUpsert).toHaveBeenCalledWith([
      //
      {
        id: singleEvent.id, //
        values: singleEvent.values, //
        metadata: singleEvent.metadata, //
      },
    ]);
  });

  it('should query for similar K8s events', async () => {
    //
    const client = await pineconeVector(); //
    const queryVector = new Array(1536).fill(0.2); // Example query vector //
    const topK = 2; //

    const expectedResponse = {
      //
      matches: [
        //
        {
          id: 'event-similar-1',
          score: 0.9,
          metadata: { message: 'Similar event 1' },
        }, //
        {
          id: 'event-similar-2',
          score: 0.8,
          metadata: { message: 'Similar event 2' },
        }, //
      ],
    };

    const result = await client.querySimilarEvents(queryVector, { topK }); //

    expect(result).toEqual(expectedResponse); //
    expect(mockQuery).toHaveBeenCalledWith({
      //
      vector: queryVector, //
      topK, //
      includeMetadata: true, // Default value from pineconeClient.ts //
      // filter: undefined // Default value
    });
  });

  it('should query similar events with namespace filtering', async () => {
    const client = await pineconeVector(); //
    const queryVector = new Array(1536).fill(0.3);
    const topK = 5;
    const namespace = 'production';
    const namespaceFilter = client.createNamespaceFilter(namespace); //

    await client.querySimilarEvents(queryVector, {
      topK,
      filter: namespaceFilter,
    }); //

    expect(mockQuery).toHaveBeenCalledWith({
      vector: queryVector,
      topK,
      filter: { namespace: { $eq: namespace } }, //
      includeMetadata: true, //
    });
  });

  it('should query similar events with kind filtering', async () => {
    const client = await pineconeVector(); //
    const queryVector = new Array(1536).fill(0.4);
    const topK = 3;
    const kind = 'Deployment';
    const kindFilter = client.createKindFilter(kind); //

    await client.querySimilarEvents(queryVector, { topK, filter: kindFilter }); //

    expect(mockQuery).toHaveBeenCalledWith({
      vector: queryVector,
      topK,
      filter: { kind: { $eq: kind } }, //
      includeMetadata: true, //
    });
  });
});
