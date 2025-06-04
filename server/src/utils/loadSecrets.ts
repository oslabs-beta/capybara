// ------------------------------------------------------------------------------
// >> GOOGLE SECRET MANAGER CLIENT
// ------------------------------------------------------------------------------
// * This file contains the Google Secret Manager client config and initialization

import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import chalk from 'chalk';

const secretClient = new SecretManagerServiceClient(); // Initialize the Secret Manager client

const loadSecrets = async (
  secretNames: string[],
): Promise<Record<string, string | undefined>> => {
  const projectId = await secretClient.getProjectId(); // Automatically detects project ID from credentials

  // * Error handling for missing project ID - need this to access secrets
  if (!projectId) {
    throw new Error(
      chalk.bgRedBright(
        '❌ Project ID not found. Please set the GCP_PROJECT_ID environment variable.',
      ),
    );
  }

  console.log(
    chalk.blue(`[Secret Manager] Loading secrets from project: ${projectId}`),
  ); // Log project ID

  // * Access all secrets - each secret is a key-val pair
  const secretResults = await Promise.all(
    secretNames.map(async (name): Promise<[string, string | undefined]> => {
      const secretPath = `projects/${projectId}/secrets/${name}/versions/latest`;
      try {
        const [version] = await secretClient.accessSecretVersion({
          name: secretPath,
        });
        return [name, version.payload?.data?.toString() ?? undefined];
      } catch (error) {
        console.error(chalk.red(`Failed to load secret ${name}:`, error));
        return [name, undefined];
      }
    }),
  );
  console.log('[Secret Manager] Secrets loaded successfully');

  return Object.fromEntries(secretResults); // Return all secrets as an object
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default loadSecrets;
