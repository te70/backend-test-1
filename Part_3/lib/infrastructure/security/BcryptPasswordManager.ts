import bcrypt from 'bcryptjs';
import PasswordManager from '../../domain/services/PasswordManager';

export default class BcryptPasswordManager implements PasswordManager {
  hash(password: string, saltRounds: number): string {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }
  
  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
};
