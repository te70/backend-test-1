import { ID } from '../lib/domain/entities/Entity';
import { ServiceLocator } from '../lib/infrastructure/config/service-locator';
declare global {
   namespace Express {
      interface Request {
         serviceLocator?: ServiceLocator;
         userId?: ID;
      }
   }
}