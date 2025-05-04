// ------------------------------------------------------------------------------------------------
// >> PINECONE CLIENT
// ------------------------------------------------------------------------------------------------
import { Pinecone } from '@pinecone-database/pinecone';
import getSecretKeys from '../appSecrets';
import chalk from 'chalk';

// Define type for K8s event embedding
interface K8sEventEmbedding {
  id: string;
  values: number[];
  metadata?: {
    namespace?: string;
    kind?: string;
    name?: string;
    reason?: string;
    message?: string;
    timestamp?: string;
    [key: string]: any;
  };
}

// Define type for query response
interface SimplifiedQueryMatch {
  id: string;
  score: number;
  metadata?: Record<string, any>;
}

interface SimplifiedQueryResponse {
  matches: SimplifiedQueryMatch[];
}

// ------------------------------------------------------------------------------------------------
// * INITIALIZE PINECONE CLIENT *
// ------------------------------------------------------------------------------------------------
const pineconeVector = async () => {
  try {
    const { PINECONE_API } = await getSecretKeys();
    if (!PINECONE_API) {
      throw new Error(chalk.red('[Pinecone] API is not defined in secrets'));
    }

    const pc = new Pinecone({
      apiKey: PINECONE_API,
    });

    const indexName = 'coffybara';
    const index = pc.index(indexName);
    console.log(chalk.green(`[Pinecone] Connected to ${indexName} index`));

    return {
      index,

      // ------------------------------------------------------------------------------------------------
      // * UPSERT K8s EVENT EMBEDDINGS *
      // ------------------------------------------------------------------------------------------------
      async upsertEvent(event: K8sEventEmbedding | K8sEventEmbedding[]) {
        try {
          const events = Array.isArray(event) ? event : [event];

          // Format for Pinecone upsert
          const vectors = events.map((element) => ({
            id: element.id,
            values: element.values,
            metadata: element.metadata || {},
          }));

          await index.upsert(vectors);
          console.log(
            chalk.green(
              `[Pinecone] Successfully upserted ${vectors.length} vectors`,
            ),
          );
          return { upsertedCount: vectors.length };
        } catch (error) {
          console.error(chalk.redBright('[Pinecone] Upsert error:'), error);
          throw error;
        }
      },
      // ------------------------------------------------------------------------------------------------
      // * QUERY SIMILAR K8s EVENTS *
      // ------------------------------------------------------------------------------------------------
      async querySimilarEvents(
        queryVector: number[],
        options: {
          topK?: number;
          filter?: Record<string, any>;
          includeMetadata?: boolean;
        } = {},
      ): Promise<SimplifiedQueryResponse> {
        try {
          const { topK = 10, filter, includeMetadata = true } = options; // Default to 10 results

          const queryResponse = await index.query({
            vector: queryVector,
            topK,
            filter,
            includeMetadata,
          });

          const simplifiedResponse: SimplifiedQueryResponse = {
            matches: queryResponse.matches.map((match) => ({
              id: match.id,
              score: match.score ?? 0,
              metadata: match.metadata,
            })),
          };

          console.log(
            chalk.green(
              `[Pinecone] Query returned ${queryResponse.matches.length} matches`,
            ),
          );
          return simplifiedResponse;
        } catch (error) {
          console.error(chalk.redBright('[Pinecone] Query error:'), error);
          throw error;
        }
      },

      // Namespace filtering utility
      createNamespaceFilter(namespace: string) {
        return { 'metadata.namespace': { $eq: namespace } };
      },

      // Kind filtering utility
      createKindFilter(kind: string) {
        return { 'metadata.kind': { $eq: kind } };
      },
    };
  } catch (error) {
    console.error(chalk.red('[Pinecone] API error:', error));
    throw error;
  }
};

// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/pineconeClient.ts'
// pineconeVector().catch((error) => {
//   console.error(chalk.red('[Pinecone] Failed to generate content:', error));
// });
// // !TEST FUNCTION - COMMENT THIS BLOCK WHEN NOT TESTING // 'npx vite-node src/utils/pineconeClient.ts'

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default pineconeVector;

// Gemini Embed Models:
// - gemini-embedding-exp-03-07
// - text-embedding-004
// -
