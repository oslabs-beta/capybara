import express, { Request, Response } from 'express';
import { ClusterManagerClient } from '@google-cloud/container';
import loadSecrets from '../utils/loadSecrets';
import chalk from 'chalk';

const clusterRouter = express.Router();
const client = new ClusterManagerClient();

clusterRouter.get('/cluster', async (req: Request, res: Response) => {
  try {
    const secrets = await loadSecrets(['GCP_PROJECT_ID']);
    const projectId = secrets['GCP_PROJECT_ID'];

    if (!projectId) {
      throw new Error('Missing GCP_PROJECT_ID from secret manager');
    }

    const [response] = await client.listClusters({
      parent: `projects/${projectId}/locations/-`,
    });

    const cluster = response.clusters?.[0];
    if (!cluster) {
      return res.status(404).json({ error: 'No GKE cluster found.' });
    }

    const clusterData = {
      name: cluster.name,
      location: cluster.location,
      status: cluster.status,
      nodeCount: cluster.currentNodeCount,
      network: cluster.network,
    };
    res.json(clusterData);
  } catch (err) {
    console.error(chalk.red('[GKE ERROR] Failed to fetch cluster info:'), err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default clusterRouter;
