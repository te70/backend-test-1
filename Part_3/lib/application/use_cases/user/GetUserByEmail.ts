import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (email: string, { userRepository }: ServiceLocator) => {
  const user = await userRepository!.getByEmail(email);
  if (!user) {
    return null;
  }
  return user;
};
