import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (email: string, password: string, {
  userRepository,
  passwordManager
}: ServiceLocator) => {
  const user = await userRepository!.getByEmail(email.toLowerCase());

  if (!user || !passwordManager.compare(password, user.password)) {
    throw new Error('Bad credentials');
  }
  
  return user;
};
