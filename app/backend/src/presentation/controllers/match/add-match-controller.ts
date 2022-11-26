import { InvalidTokenError, ServerError } from '../../errors';
import { unauthorized, ok, serverError } from '../../helpers/http-helpers';
import {
  Controller,
  TokenValidator,
  HttpRequest,
  HttpResponse,
} from './match-protocols';

export default class AddMatchController implements Controller {
  constructor(private readonly tokenValidator: TokenValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { authorization } = httpRequest.headers;
      const token = this.tokenValidator.validate(authorization);

      return ok(token);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return unauthorized(new InvalidTokenError());
      }
      return serverError(new ServerError());
    }
  }
}
