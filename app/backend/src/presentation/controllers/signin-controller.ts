import MissingParamError from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols/http';
import Controller from './signin-protocols';

type LoginReq = {
  email?: string,
  password?: string,
};

export default class SignInController implements Controller {
  constructor(
    private statusCode: number = 200,
  ) {}

  async handle(httpRequest: HttpRequest<LoginReq>): Promise<HttpResponse> {
    const requiredFields = ['email', 'password'];
    for (let i = 0; i < requiredFields.length; i += 1) {
      if (!httpRequest.body?.[requiredFields[i] as keyof LoginReq]) {
        return badRequest(new MissingParamError());
      }
    }
    return new Promise((resolve) => {
      resolve({
        statusCode: this.statusCode,
        body: { message: 'ok' },
      });
    });
  }
}
