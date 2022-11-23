import { HttpRequest, HttpResponse } from '../protocols/http';
import Controller from './signin-protocols';

type ReqT = {
  email: string
  password: string
};

// type ResT = {
//   token: string
// };

export default class SignInController implements Controller<ReqT> {
  constructor(
    private statusCode: number = 400,
  ) {}

  async handle(_httpRequest: HttpRequest<ReqT>): Promise<HttpResponse> {
    return new Promise((resolve) => {
      resolve({
        statusCode: this.statusCode,
      });
    });
  }
}
