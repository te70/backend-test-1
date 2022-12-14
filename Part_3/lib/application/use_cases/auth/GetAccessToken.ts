import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default async (user: any, {
  accessTokenManager,
}: ServiceLocator) => accessTokenManager.generate({
  uid: user.id,
  role: user.role,
});
