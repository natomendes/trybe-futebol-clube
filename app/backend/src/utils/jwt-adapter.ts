import * as jwt from 'jsonwebtoken';
import { TokenGenerator, TokenValidator } from '../presentation/protocols/token';

export default class JWTAdapter implements TokenGenerator, TokenValidator {
  private secret = process.env.JWT_SECRET || 'jwt_secret';
  private jwtConfig: jwt.SignOptions = {
    expiresIn: '7d',
    algorithm: 'HS256',
  };

  generate(email: string): string {
    return jwt.sign({ email }, this.secret as string, this.jwtConfig);
  }

  validate(token: string): jwt.JwtPayload {
    return jwt.verify(token, this.secret) as jwt.JwtPayload;
  }
}
