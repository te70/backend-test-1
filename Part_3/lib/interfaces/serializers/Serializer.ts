import { ServiceLocator } from "../../infrastructure/config/service-locator";

export default abstract class Serializer {
  serialize(data: any | any[], serviceLocator: ServiceLocator): object | object[] {
    if (!data) {
      throw new Error('Expect data to be not undefined nor null');
    }
    if (Array.isArray(data)) {
      return data.map((entity) => this._serializeSingleEntity(entity, serviceLocator));
    }
    return this._serializeSingleEntity(data, serviceLocator);
  }

  protected abstract _serializeSingleEntity(entity: any, serviceLocator: ServiceLocator): object;
};
