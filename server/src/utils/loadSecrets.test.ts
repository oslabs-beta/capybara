import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import loadSecrets from './loadSecrets';

// * Mock the Google Secret Manager module
vi.mock('@google-cloud/secret-manager', () => {
  return {
    SecretManagerServiceClient: vi.fn().mockImplementation(() => ({
      getProjectId: vi.fn().mockResolvedValue('test-project-id'),
      accessSecretVersion: vi.fn().mockImplementation(({ name }) => {
        // * Extract secret name from the path
        const secretName = name.split('/')[3];

        if (secretName === 'API_KEY') {
          return [
            {
              payload: {
                data: Buffer.from('test-api-key'),
              },
            },
          ];
        } else if (secretName === 'DATABASE_URL') {
          return [
            {
              payload: {
                data: Buffer.from('test-db-connection-string'),
              },
            },
          ];
        } else {
          // * Simulate a secret not found
          throw new Error(`Secret ${secretName} not found`);
        }
      }),
    })),
  };
});

// * Mock console.log and console.error
beforeEach(() => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('loadSecrets', () => {
  it('should successfully load existing secrets', async () => {
    // * Test with secrets that exist in our mock
    const secrets = await loadSecrets(['API_KEY', 'DATABASE_URL']);

    expect(secrets).toEqual({
      API_KEY: 'test-api-key',
      DATABASE_URL: 'test-db-connection-string',
    });
  });
});
