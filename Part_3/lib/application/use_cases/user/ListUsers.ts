import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async ({ userRepository }: ServiceLocator) => userRepository!.find();