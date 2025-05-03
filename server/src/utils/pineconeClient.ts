// ------------------------------------------------------------------------------------------------
// >> PINECONE CLIENT
// ------------------------------------------------------------------------------------------------

import { Pinecone } from '@pinecone-database/pinecone';
import getSecretKeys from '../appSecrets';
import chalk from 'chalk';

const { PINECONE_API } = await getSecretKeys();

if (!PINECONE_API) {
  throw new Error('PINECONE_API is not defined in secrets');
}

const pc = new Pinecone({
  apiKey: PINECONE_API,
});

const indexName = 'coffybara';

const index = pc.index(indexName);
console.log(chalk.green(`[PINCONE] Connected to ${indexName} index`));

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------

// Gemini Embed Models:
// - gemini-embedding-exp-03-07
// - text-embedding-004
// -
