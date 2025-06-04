// ----------------------------------------------------------------------------------------
// >> SERVER << //
// ----------------------------------------------------------------------------------------

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import chalk from 'chalk';
import errorHandler from './middleware/errorHandler';
import routes from './routes';
import startK8sEventWatcher from './services/k8sEventWatcher'; // K8s event watcher
import getSecretKeys from './appSecrets'; // Google Secret Manager
import startK8sEventProcessor from './services/k8sEventProcessor';
import clusterRouter from './routes/clusterInfo';

const app = express();
const secret = await getSecretKeys(); // Load secrets from Google Secret Manager
const port = secret.PORT;

// ------------------------------------------------------------------------------------------------
// * K8s EVENT WATCHER & PROCESSOR
// ------------------------------------------------------------------------------------------------
startK8sEventWatcher().catch((err) =>
  console.error(chalk.redBright('Failed to start K8s watcher:', err)),
); // Start Kubernetes event watcher

startK8sEventProcessor().catch((err) =>
  console.error(chalk.redBright('Failed to start K8s processor:', err)),
); // Start Kubernetes event processor

// ------------------------------------------------------------------------------------------------
// * MIDDLEWARE
// ------------------------------------------------------------------------------------------------
app.use(cors());

// ! Test to see if server is running
app.get('/', (req, res) => {
  res.status(200).send('Hello from the server side! Time to go!');
});

// ! Using this as a test endpoint to send to frontent for connection confirmation
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'online', message: 'Server is online!' });
});

app.use(express.json()); // EXPRESS
app.use('/api', routes); // ROUTES
app.use('/api/gke', clusterRouter);

// ----------------------------------------------------------------------------------------
// * 404 HANDLER
// ----------------------------------------------------------------------------------------
app.use((req, res) => {
  console.warn(`404 - Route not found: ${req.originalUrl}`);
  res.status(404).json({ message: 'Route not found' });
});

// ----------------------------------------------------------------------------------------
// * ERROR HANDLER MIDDLEWARE
// ----------------------------------------------------------------------------------------
app.use(errorHandler);

// ----------------------------------------------------------------------------------------
// * START SERVER
// ----------------------------------------------------------------------------------------
// * Only start the server if not in test environment
// * This prevents the server from starting during tests

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () =>
    console.log(
      chalk.bgGreenBright(
        `[Server] is up and running @ http://localhost:${port}`,
      ),
    ),
  );
}

// ------------------------------------------------------------------------------------------------
// * MODULE EXPORT
// ------------------------------------------------------------------------------------------------
export default app;
