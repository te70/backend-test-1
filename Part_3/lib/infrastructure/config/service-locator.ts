import constants from './constants';
import environment from './environment';

// Types
import PasswordManager from '../../domain/services/PasswordManager';
import AccessTokenManager from '../../application/security/AccessTokenManager';

import Serializer from '../../interfaces/serializers/Serializer';

import UserRepository from '../../domain/repositories/UserRepository';

// Implementations

import BcryptPasswordManager from '../security/BcryptPasswordManager';
import JwtAccessTokenManager from '../security/JwtAccessTokenManager';

import UserSerializer from '../../interfaces/serializers/UserSerializer';

// Mongo
import UserRepositoryMongo from '../repositories/mongoose/UserRepositoryMongo';

export type ServiceLocator = {
  passwordManager: PasswordManager,
  accessTokenManager: AccessTokenManager,

  userSerializer: Serializer,

  userRepository?: UserRepository,
};

function buildBeans() {
  const beans: ServiceLocator = {
    passwordManager: new BcryptPasswordManager(),
    accessTokenManager: new JwtAccessTokenManager(),

    userSerializer: new UserSerializer(),
  };

  if (environment.database.dialect === constants.SUPPORTED_DATABASE.MONGO) {
    beans.userRepository = new UserRepositoryMongo();
  }

  return beans;
}

export default buildBeans();
