import jwt from 'jsonwebtoken';
import environment from '../config/environment';
import AccessTokenManager from '../../application/security/AccessTokenManager';

export default class JwtAccessTokenManager implements AccessTokenManager {
  generate(payload: object): string {
    return jwt.sign(payload, environment.jwtSecretKey);
  }

  decode(accessToken: string): object | null {
    const token = jwt.verify(accessToken, environment.jwtSecretKey)
    return token != null ? token as object : null;
  }
};
