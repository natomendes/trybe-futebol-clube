import { ok } from '../../helpers/http-helpers';
import { Controller, FinishMatch, HttpRequest, HttpResponse } from './match-protocols';

export default class FinishMatchController implements Controller {
  constructor(private readonly finishMatch: FinishMatch) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params;
    await this.finishMatch.finish(id);

    return ok({ message: 'Finished' });
  }
}
