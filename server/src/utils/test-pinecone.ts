// test-pinecone.ts - Verify that similar events are found in Pinecone
import pineconeVector from './pineconeClient';
import generateEmbedding from './geminiEmbeddingClient';
import chalk from 'chalk';

// Mock K8s events for testing
const testEvents = [
  {
    reason: 'OOMKilled',
    message: 'Container memory-hog exceeded its memory limit',
    pod: 'oom-pod',
    namespace: 'default',
    timestamp: new Date().toISOString(),
  },
  {
    reason: 'CrashLoopBackOff',
    message: 'Back-off restarting failed container',
    pod: 'crashpod',
    namespace: 'default',
    timestamp: new Date().toISOString(),
  },
];

// Function to create embedding text (copy from your main code)
const createEmbeddingText = (event: any): string => {
  return `Kubernetes Error Event:
Reason: ${event.reason}
Pod: ${event.pod}
Namespace: ${event.namespace}
Message: ${event.message}`;
};

// Test function
const testPineconeSimilaritySearch = async () => {
  try {
    console.log(
      chalk.bgBlue('[TEST] Starting Pinecone similarity search test'),
    );

    // 1. Connect to Pinecone
    const pinecone = await pineconeVector();
    console.log(chalk.green('[TEST] Connected to Pinecone'));

    // 2. For each test event, search for similar events
    for (const event of testEvents) {
      console.log(
        chalk.yellow(
          `\n[TEST] Testing event: ${event.reason} for pod ${event.pod}`,
        ),
      );

      // 2.1 Generate embedding text
      const embeddingText = createEmbeddingText(event);
      console.log(chalk.cyan('[TEST] Embedding text:'), embeddingText);

      // 2.2 Get vector embedding
      const vector = await generateEmbedding(embeddingText);
      console.log(
        chalk.cyan('[TEST] Generated vector of length:'),
        vector ? vector.length : 'undefined',
      );

      // 2.3 Search with NO namespace filter
      console.log(
        chalk.magenta('[TEST] Searching WITHOUT namespace filter...'),
      );
      const similarEventsNoFilter = await pinecone.querySimilarEvents(
        vector || [],
        {
          topK: 10,
          includeMetadata: true,
        },
      );

      console.log(
        chalk.green(
          `[TEST] Found ${similarEventsNoFilter.matches.length} matches WITHOUT namespace filter`,
        ),
      );

      // 2.4 Print top matches
      if (similarEventsNoFilter.matches.length > 0) {
        console.log(chalk.green('[TEST] Top matches WITHOUT filter:'));
        similarEventsNoFilter.matches.slice(0, 3).forEach((match, idx) => {
          console.log(
            `  Match #${idx + 1} (score: ${match.score.toFixed(4)}): ${match.metadata?.reason} - ${match.metadata?.namespace} - ${match.metadata?.name}`,
          );
        });
      }

      // 2.5 Search with namespace filter
      const filter = pinecone.createNamespaceFilter(event.namespace);
      console.log(
        chalk.magenta(
          `[TEST] Searching WITH namespace filter (${event.namespace})...`,
        ),
      );
      const similarEventsWithFilter = await pinecone.querySimilarEvents(
        vector || [],
        {
          topK: 10,
          filter,
          includeMetadata: true,
        },
      );

      console.log(
        chalk.green(
          `[TEST] Found ${similarEventsWithFilter.matches.length} matches WITH namespace filter`,
        ),
      );

      // 2.6 Print top matches
      if (similarEventsWithFilter.matches.length > 0) {
        console.log(chalk.green('[TEST] Top matches WITH filter:'));
        similarEventsWithFilter.matches.slice(0, 3).forEach((match, idx) => {
          console.log(
            `  Match #${idx + 1} (score: ${match.score.toFixed(4)}): ${match.metadata?.reason} - ${match.metadata?.namespace} - ${match.metadata?.name}`,
          );
        });
      }
    }

    console.log(
      chalk.bgGreen('\n[TEST] Pinecone similarity search test completed'),
    );
  } catch (error) {
    console.error(chalk.bgRed('[TEST] Error in Pinecone test:'), error);
  }
};

// Run the test
testPineconeSimilaritySearch().catch((err) => {
  console.error(chalk.red('[TEST] Fatal error:'), err);
});
