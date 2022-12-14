export default interface AccessTokenManager {
  generate(payload: object): string;

  decode(accessToken: string): object | null;
};
