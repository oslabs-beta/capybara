import express, { Request, Response } from 'express';
import { ClusterManagerClient } from '@google-cloud/container';
import loadSecrets from '../utils/loadSecrets';
import chalk from 'chalk';

const clusterRouter = express.Router();
const client = new ClusterManagerClient();

// Get all clusters
clusterRouter.get('/clusters', async (req: Request, res: Response) => {
  try {
    const secrets = await loadSecrets(['GCP_PROJECT_ID']);
    const projectId = secrets['GCP_PROJECT_ID'];

    if (!projectId) {
      throw new Error('Missing GCP_PROJECT_ID from secret manager');
    }

    const [response] = await client.listClusters({
      parent: `projects/${projectId}/locations/-`,
    });

    if (!response.clusters || response.clusters.length === 0) {
      return res.status(404).json({ error: 'No GKE clusters found.' });
    }

    const clusters = response.clusters.map(cluster => ({
      name: cluster.name,
      location: cluster.location,
      status: cluster.status,
      nodeCount: cluster.currentNodeCount,
      network: cluster.network,
    }));

    res.json(clusters);
  } catch (err) {
    console.error(chalk.red('[GKE ERROR] Failed to fetch clusters info:'), err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific cluster (keeping for backward compatibility)
clusterRouter.get('/cluster', async (req: Request, res: Response) => {
  try {
    const secrets = await loadSecrets(['GCP_PROJECT_ID']);
    const projectId = secrets['GCP_PROJECT_ID'];
    const clusterName = req.query.name as string;
    const clusterLocation = req.query.location as string;

    if (!projectId) {
      throw new Error('Missing GCP_PROJECT_ID from secret manager');
    }

    const [response] = await client.listClusters({
      parent: `projects/${projectId}/locations/-`,
    });

    let cluster;
    if (clusterName && clusterLocation) {
      // Find specific cluster by name and location
      cluster = response.clusters?.find(c => 
        c.name === clusterName && c.location === clusterLocation
      );
    } else {
      // Default to first cluster if no specific cluster requested
      cluster = response.clusters?.[0];
    }

    if (!cluster) {
      return res.status(404).json({ error: 'GKE cluster not found.' });
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
