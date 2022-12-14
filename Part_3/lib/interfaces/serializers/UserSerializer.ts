import User from "../../domain/entities/User";
import { ServiceLocator } from "../../infrastructure/config/service-locator";
import Serializer from "./Serializer";

export default class UserSerializer extends Serializer {
  _serializeSingleEntity(entity: User, serviceLocator: ServiceLocator): object {
    const userObj = {
      'id': entity.id,
      'first_name': entity.firstName,
      'last_name': entity.lastName,
      'email': entity.email,
      'phone': entity.phone,
      'access_token': entity.accessToken ? entity.accessToken : undefined,
    };
    return userObj;
  }
};
