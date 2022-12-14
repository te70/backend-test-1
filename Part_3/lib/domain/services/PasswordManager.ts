export default interface PasswordManager {
  hash(password: string, saltRounds: number): string;

  compare(password: string, hash: string): boolean;
};
