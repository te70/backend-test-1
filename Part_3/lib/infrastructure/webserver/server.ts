import express from 'express';
import environment from '../config/environment';
import serviceLocator from '../config/service-locator';
import routesV1 from './routes-v1';

const app = express();
const router = express.Router();

const createServer = async () => {
  express.request.serviceLocator = serviceLocator;

  app.use(express.json({ limit: '50mb' }));
  router.use('/api/v1', routesV1);
  app.use(router);

  // Create a server with a port
  app.listen(environment.port, () => {
    console.log(`App listening on port ${environment.port}`);
  });

  return app;
};

export default createServer;
