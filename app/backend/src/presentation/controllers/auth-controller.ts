import { InvalidParamError, InvalidTokenError, MissingTokenError, ServerError } from '../errors';
import { badRequest, notFound, ok, serverError, unauthorized } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller, TokenValidator, FindUser } from './signin-protocols';

export default class AuthenticationController implements Controller {
  constructor(
    private tokenValidator: TokenValidator,
    private findUser: FindUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest?.headers?.authorization) return badRequest(new MissingTokenError());
      const { authorization } = httpRequest.headers;
      const { email } = this.tokenValidator.validate(authorization);
      const user = await this.findUser.find(email);
      if (!user) {
        return notFound(new InvalidParamError('User not found'));
      }
      const { role } = user;
      return ok({ role });
    } catch (error) {
      if (error instanceof Error && error.name === 'TokenExpiredError') {
        return unauthorized(new InvalidTokenError());
      }
      return serverError(new ServerError());
    }
  }
}
