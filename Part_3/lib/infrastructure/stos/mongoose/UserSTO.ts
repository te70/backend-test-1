import User from '../../../domain/entities/User';

export default (schemaEntity: any): User | null => {
  if (!schemaEntity) return null;
  return new User({
    id: schemaEntity.id,
    firstName: schemaEntity.first_name,
    lastName: schemaEntity.last_name,
    email: schemaEntity.email,
    phone: schemaEntity.phone,
    password: schemaEntity.password,
  });
};
