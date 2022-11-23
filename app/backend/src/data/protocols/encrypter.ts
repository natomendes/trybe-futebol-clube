export interface Encrypter {
  validate(password: string, hash: string): Promise<boolean>
}
