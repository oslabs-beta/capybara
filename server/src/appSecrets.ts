// ----------------------------------------------------------------------------------------
// >> APP SECRETS << //
// ----------------------------------------------------------------------------------------
// * This file is used to load secrets from Google Secret Manager

import chalk from 'chalk';
import loadSecrets from './utils/loadSecrets';

// ----------------------------------------------------------------------------------------
// TODO: ADD SECRET KEYS HERE FROM GOOGLE SECRET MANAGER
const SECRET_KEYS = [
  'PORT',
  'GCP_PROJECT_ID',
  'GCP_KEY_FILE',
  'PINECONE_API',
  'REDIS_URL',
];
// ----------------------------------------------------------------------------------------

const getSecretKeys = async () => {
  console.log(chalk.blue('[Secret Manager] Loading secrets...'));

  try {
    const secrets = await loadSecrets(SECRET_KEYS);

    return {
      PORT: parseInt(secrets.PORT || '3000'), // default to 300 if not found,
      GCP_PROJECT_ID: secrets.GCP_PROJECT_ID,
      GCP_KEY_FILE: secrets.GCP_KEY_FILE,
      PINECONE_API: secrets.PINECONE_API,
    };
  } catch (error) {
    console.error(chalk.red('[Secret Manager] Error loading secrets:'), error);
    throw error;
  }
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default getSecretKeys;
