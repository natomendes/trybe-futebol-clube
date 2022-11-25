import { InvalidTokenError, MissingTokenError, ServerError } from '../errors';
import { badRequest, ok, serverError, unauthorized } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller, TokenValidator } from './signin-protocols';

export default class AuthenticationController implements Controller {
  constructor(private tokenValidator: TokenValidator) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest?.headers?.authorization) return badRequest(new MissingTokenError());
      const { authorization } = httpRequest.headers;
      const { email } = this.tokenValidator.validate(authorization);
      return ok(email);
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return unauthorized(new InvalidTokenError());
      }
      return serverError(new ServerError());
    }
  }
}
