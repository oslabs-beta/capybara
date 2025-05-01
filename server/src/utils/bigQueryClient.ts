// ------------------------------------------------------------------------------
// >> GOOGLE BIGQUERY CLIENT
// ------------------------------------------------------------------------------
// * This file contains the Google BigQuery client config and initialization

import { BigQuery } from '@google-cloud/bigquery';
import chalk from 'chalk';
// import getSecretKeys from '../appSecrets';

// const secret = await getSecretKeys(); // Load secrets from Google Secret Manager

// if (!secret.GCP_KEY_FILE) {
//   throw new Error('GCP_KEY_FILE is not defined in secrets');
// }

const bigquery = new BigQuery();

const get_data = async (
    query: string,
) => {
  
    // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
    const options = {
      query: query,
      // Location must match that of the dataset(s) referenced in the query.
      location: 'US',
    };
  
    // Run the query as a job
    const [job] = await bigquery.createQueryJob(options);
    console.log(`Job ${job.id} started.`);
  
    // Wait for the query to finish
    const [rows] = await job.getQueryResults();
  
    // Print the results
    console.log('Rows:');
    rows.forEach(row => console.log(row));
}

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default get_data;

// TEST CASE
// npx vite-node src/utils/bigQueryClient.ts
const query = "SELECT * FROM `capybara-456403.kubernetes_cluster.kubernetes_cluster` WHERE TIMESTAMP_TRUNC(_PARTITIONTIME, HOUR) > TIMESTAMP('2025-04-21T18:00:00') LIMIT 1000";

get_data(query);