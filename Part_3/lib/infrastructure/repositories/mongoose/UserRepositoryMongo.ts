import User from "../../../domain/entities/User";
import MongooseUser from "../../orm/mongoose/schemas/User";
import UserRepository from "../../../domain/repositories/UserRepository";
import UserSTO from "../../stos/mongoose/UserSTO";
import { ID } from "../../../domain/entities/Entity";

export default class UserRepositoryMongo implements UserRepository {
  async persist(domainEntity: User): Promise<User | null> {
    const {
      firstName,
      lastName,
      email,
      phone,
      password,
    } = domainEntity;
    const mongooseUser = new MongooseUser({
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      password,
    });
    await mongooseUser.save();
    return UserSTO(mongooseUser);
  }

  async merge(domainEntity: User): Promise<User | null> {
    const {
      id,
      firstName,
      lastName,
      email,
      phone,
      password,
    } = domainEntity;
    const mongooseUser = await MongooseUser.findByIdAndUpdate(
      id,
      {
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        password,
      },
      {
        new: true,
      }
    );
    return UserSTO(mongooseUser);
  }

  async remove(entityId: ID): Promise<boolean | null> {
    return MongooseUser.findOneAndDelete({ _id: entityId });
  }

  async get(entityId: ID): Promise<User | null> {
    const mongooseUser = await MongooseUser.findById(entityId);
    if (!mongooseUser) return null;
    return UserSTO(mongooseUser);
  }

  async getByEmail(email: string): Promise<User | null> {
    const mongooseUser = await MongooseUser.findOne({ email });
    if (!mongooseUser) return null;
    return UserSTO(mongooseUser);
  }

  async find(): Promise<User[]> {
    const mongooseUsers = await MongooseUser.find().sort({ createdAt: -1 });
    return mongooseUsers
      .map((mongooseUser) => UserSTO(mongooseUser))
      .filter((user: User | null): user is User => user != null);
  }
}
