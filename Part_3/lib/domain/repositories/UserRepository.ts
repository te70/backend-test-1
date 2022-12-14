import { ID } from "../entities/Entity";
import User from "../entities/User";

export default interface UserRepository {
  persist(domainEntity: User): Promise<User | null>;

  merge(domainEntity: User): Promise<User | null>;

  remove(entityId: ID): Promise<boolean | null>;

  get(entityId: ID): Promise<User | null>;

  getByEmail(email: string): Promise<User | null>;

  find(): Promise<User[]>;
};
