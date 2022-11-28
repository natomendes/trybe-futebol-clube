import { ServerError } from '../../errors';
import { ok, serverError } from '../../helpers/http-helpers';
import { Controller, FinishMatch, HttpRequest, HttpResponse } from './match-protocols';

export default class FinishMatchController implements Controller {
  constructor(private readonly finishMatch: FinishMatch) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      await this.finishMatch.finish(id);

      return ok({ message: 'Finished' });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
