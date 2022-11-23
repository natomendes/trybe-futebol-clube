import * as jwt from 'jsonwebtoken';
import { TokenGenerator } from '../presentation/protocols/token';

export default class TokenGeneratorAdapter implements TokenGenerator {
  private secret = process.env.JWT_SECRET || 'jwt_secret';
  private jwtConfig: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  generate(email: string): string {
    return jwt.sign({ email }, this.secret as string, this.jwtConfig);
  }
}
