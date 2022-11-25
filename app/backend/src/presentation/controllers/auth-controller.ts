import { MissingTokenError } from '../errors';
import { badRequest } from '../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../protocols/http';
import { Controller } from './signin-protocols';

export default class AuthenticationController implements Controller {
  constructor(private test = badRequest) {}
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    return this.test(new MissingTokenError());
  }
}
