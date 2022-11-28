import { InvalidParamError, ServerError } from '../../errors';
import { notFound, ok, serverError } from '../../helpers/http-helpers';
import { Controller, FinishMatch, HttpRequest, HttpResponse } from './match-protocols';

export default class FinishMatchController implements Controller {
  constructor(private readonly finishMatch: FinishMatch) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const hasFinish = await this.finishMatch.finish(id);

      if (!hasFinish) return notFound(new InvalidParamError('Match not found'));

      return ok({ message: 'Finished' });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
