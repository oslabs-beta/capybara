// ------------------------------------------------------------------------------------------------
// >> GOOGLE GEMINI EMBEDDING CLIENT
// ------------------------------------------------------------------------------------------------
import { GoogleGenAI } from '@google/genai';
import getSecretKeys from '../appSecrets';
import chalk from 'chalk';

const generateEmbedding = async () => {
  try {
    const { GEMINI_API } = await getSecretKeys();
    if (!GEMINI_API) {
      throw new Error(
        chalk.red('[Gemini Embedding] API is not defined in secrets'),
      );
    }
    const embedding = new GoogleGenAI({ apiKey: GEMINI_API });
    const text = 'Hello Coffybara!';

    const result = await embedding.models.embedContent({
      model: 'gemini-embedding-exp-03-07',
      contents: text,
    });
    console.log(chalk.green('[Gemini Embedding] embedding result:'), result);
  } catch (error) {
    console.error(chalk.red('[Gemini Embedding] error:'), error);
  }
};

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default generateEmbedding;

// // Self-test when run via npx vite-node
// generateEmbedding().catch((err) =>
//   console.error(chalk.red('[Gemini Embedding] test failed:'), err),
// );
