import MissingParamError, { InvalidParamError } from '../errors';
import { badRequest, unauthorized } from '../helpers/http-helpers';
import Controller, {
  FindUser,
  EmailValidator,
  HttpRequest,
  HttpResponse,
  LoginReq } from './signin-protocols';

export default class SignInController implements Controller {
  constructor(
    private readonly emailValidator: EmailValidator,
    private readonly findUser: FindUser,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!httpRequest.body?.[requiredFields[i] as keyof LoginReq]) {
        return badRequest(new MissingParamError());
      }
    }

    const { email } = httpRequest.body as LoginReq;
    const isValid = this.emailValidator.isValid(email as string);
    if (!isValid) {
      return badRequest(new InvalidParamError());
    }

    const user = await this.findUser.find(email as string);
    if (!user) {
      return unauthorized(new InvalidParamError());
    }
    return { statusCode: 200, body: { message: 'ok' } };
  }
}
