import { ID } from '../../../domain/entities/Entity';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async (userId: ID, { userRepository }: ServiceLocator) => {
  const user = await userRepository!.get(userId);
  if (!user) {
    throw new Error('Invalid User');
  }
  return user;
};
