import User from '../../../domain/entities/User';
import UserValidator from '../../../domain/validators/UserValidator';
import { ServiceLocator } from '../../../infrastructure/config/service-locator';

export default async (userData: any, { userRepository, passwordManager }: ServiceLocator) => {
  await UserValidator.tailor('create').validateAsync(userData);
  const user = new User({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.phone,
    password: passwordManager.hash(userData.password, 12),
  });
  return userRepository!.persist(user);
};