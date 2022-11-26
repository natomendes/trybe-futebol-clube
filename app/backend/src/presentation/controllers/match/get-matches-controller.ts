import { ServerError } from '../../errors';
import { ok, serverError } from '../../helpers/http-helpers';
import {
  Controller,
  HttpRequest,
  HttpResponse,
  FindMatches,
} from './match-protocols';

export default class GetMatchesController implements Controller {
  constructor(
    private findMatches: FindMatches,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const matches = await this.findMatches.find();
      return ok(matches);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
