import MissingParamError, { InvalidParamError, ServerError } from '../errors';
import { badRequest, serverError, unauthorized, ok } from '../helpers/http-helpers';
import {
  Controller,
  FindUser,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  LoginReq,
  TokenGenerator } from './signin-protocols';

export default class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly findUser: FindUser,
    private readonly tokenGenerator: TokenGenerator,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];
      for (let i = 0; i < requiredFields.length; i += 1) {
        if (!httpRequest.body?.[requiredFields[i] as keyof LoginReq]) {
          return badRequest(new MissingParamError());
        }
      }
      const { email, password } = httpRequest.body as LoginReq;
      const isValid = this.emailValidator.isValid(email as string);
      if (!isValid) return badRequest(new InvalidParamError());
      const user = await this.findUser.find(email as string);
      if (!user || user.password !== password) {
        return unauthorized(new InvalidParamError());
      }
      return ok({ token: this.tokenGenerator.generate(email as string) });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
