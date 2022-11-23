import MissingParamError, { InvalidParamError, ServerError } from '../errors';
import { badRequest, serverError, unauthorized, ok } from '../helpers/http-helpers';
import {
  Controller,
  FindUser,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  LoginReq,
  TokenGenerator,
  Encrypter } from './signin-protocols';

export default class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly findUser: FindUser,
    private readonly tokenGenerator: TokenGenerator,
    private readonly encrypter: Encrypter,
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
      const isValidEmail = this.emailValidator.isValid(email as string);
      if (!isValidEmail) return badRequest(new InvalidParamError());

      const user = await this.findUser.find(email as string);
      if (!user) return unauthorized(new InvalidParamError());

      const isValidPassword = await this.encrypter.validate(password as string, user.password);
      if (!isValidPassword) return unauthorized(new InvalidParamError());

      return ok({ token: this.tokenGenerator.generate(email as string) });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
