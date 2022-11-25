import { JwtPayload } from 'jsonwebtoken';

export interface TokenGenerator {
  generate(email: string): string
}

export interface TokenValidator {
  validate(token: string): JwtPayload
}
