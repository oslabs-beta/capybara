// ------------------------------------------------------------------------------------------------
// >> GOOGLE GEMINI EMBEDDING CLIENT
// ------------------------------------------------------------------------------------------------
import { GoogleGenAI } from '@google/genai';
import getSecretKeys from '../appSecrets';
import chalk from 'chalk';

const generateEmbedding = async (text: string) => {
  try {
    const { GEMINI_API } = await getSecretKeys();
    if (!GEMINI_API) {
      throw new Error(
        chalk.red('[Gemini Embedding] API is not defined in secrets'),
      );
    }
    const embedding = new GoogleGenAI({ apiKey: GEMINI_API });

    const result = await embedding.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
    });
    // console.log(chalk.green('[Gemini Embedding] embedding result:'), result);

    const embeddings = result.embeddings;
    if (!embeddings || embeddings.length === 0) {
      throw new Error(chalk.red('[Gemini Embedding] No embeddings returned'));
    }
    const vector = embeddings[0].values;

    console.log(
      chalk.green('[Gemini Embedding] vector length:'),
      vector?.length,
    ); // confirm dimension of vector 3072
    console.log(
      chalk.green('[Gemini Embedding] first 5 values:'),
      vector?.slice(0, 5),
    ); // check first 5 values of vector

    return vector;
  } catch (error) {
    console.error(chalk.red('[Gemini Embedding] error:'), error);
    throw error;
  }
};

// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/geminiEmbeddingClient.ts'
// const text = 'Hello Coffybara!';

// generateEmbedding(text).catch((err) =>
//   console.error(chalk.red('[Gemini Embedding] test failed:'), err),
// );
// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/geminiEmbeddingClient.ts'

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default generateEmbedding;
