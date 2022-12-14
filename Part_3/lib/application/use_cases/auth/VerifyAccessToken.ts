import { ServiceLocator } from "../../../infrastructure/config/service-locator";

export default (accessToken: string, { accessTokenManager }: ServiceLocator) => {
  const decoded: any = accessTokenManager.decode(accessToken);
  if (!decoded) {
    throw new Error('Invalid access token');
  }
  return {
    uid: decoded.uid,
    role: decoded.role,
  };
};
