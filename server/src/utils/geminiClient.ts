// ------------------------------------------------------------------------------------------------
// >> GOOGLE GEMINI CLIENT
// ------------------------------------------------------------------------------------------------
import { GoogleGenAI } from '@google/genai';
import getSecretKeys from '../appSecrets';
import chalk from 'chalk';

// const prompt = 'Explain how AI is reshaping the world in a few words';

const gemini = async (eventData: string) => {
  try {
    const { GEMINI_API } = await getSecretKeys();
    if (!GEMINI_API) {
      throw new Error('[Gemini] API is not defined in secrets');
    }
    const ai = new GoogleGenAI({ apiKey: GEMINI_API });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: [{ role: 'user', parts: [{ text: eventData }] }],
    });
    // console.log(chalk.green('[Gemini] response:', response.text));
    return response.text ?? '';
  } catch (error) {
    console.error(chalk.red('[Gemini] API error:', error));
    throw error;
  }
};

// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/geminiClient.ts'
// gemini().catch((error) => {
//   console.error(chalk.red('[Gemini] Failed to generate content:', error));
// });
// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/geminiClient.ts'

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default gemini;
