import { JwtPayload } from 'jsonwebtoken';
import { InvalidTokenError, MissingTokenError, ServerError } from '../../errors';
import { unauthorized, ok, serverError, badRequest } from '../../helpers/http-helpers';
import {
  Controller,
  TokenValidator,
  HttpRequest,
  HttpResponse,
} from './match-protocols';

export default class AddMatchController implements Controller {
  constructor(private readonly tokenValidator: TokenValidator) {}

  private checkToken(token: string | undefined): JwtPayload | undefined {
    if (!token) return undefined;

    return this.tokenValidator.validate(token);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const token = this.checkToken(httpRequest.headers.authorization);
      if (!token) return badRequest(new MissingTokenError());

      return ok(token);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return unauthorized(new InvalidTokenError());
      }
      return serverError(new ServerError());
    }
  }
}
