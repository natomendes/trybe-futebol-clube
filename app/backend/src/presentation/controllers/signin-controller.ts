import { HttpRequest, HttpResponse } from '../protocols/http';
import Controller from './signin-protocols';

export default class SignInController implements Controller {
  constructor(
    private statusCode: number = 400,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise((resolve) => {
      resolve({
        statusCode: this.statusCode,
      });
    });
  }
}
