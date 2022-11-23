import * as bcrypt from 'bcryptjs';
import { Encrypter } from '../../data/protocols/encrypter';

export default class BcryptAdapter implements Encrypter {
  private isValid = false;
  constructor(
    private readonly salt: number,
  ) {}

  async validate(password: string, hash: string): Promise<boolean> {
    this.isValid = await bcrypt.compare(password, hash);
    return this.isValid;
  }
}
