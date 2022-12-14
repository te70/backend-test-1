import { Request, Response, NextFunction } from 'express';
import VerifyAccessToken from '../../application/use_cases/auth/VerifyAccessToken';

export default ({ isOptional = false }: { isOptional: boolean } = { isOptional: false }) => (request: Request, response: Response, next: NextFunction) => {
  // Context
  const serviceLocator = request.serviceLocator!;

  // Input
  const authorizationHeader = request.headers.authorization;
  try {
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      throw new Error('Missing or wrong Authorization request header');
    }
    const accessToken = authorizationHeader.replace(/Bearer/gi, '').replace(/ /g, '');

    // Treatment
    const { uid, role } = VerifyAccessToken(accessToken, serviceLocator);
    request.userId = uid;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    }
    if (!isOptional)
      return response.status(401).json({ 'message': 'Invalid Token' });
  }
  return next();
};
