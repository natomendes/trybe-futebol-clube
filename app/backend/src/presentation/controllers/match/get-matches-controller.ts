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

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { inProgress } = httpRequest.query;
      const matches = await this.findMatches.find(inProgress);
      return ok(matches);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
