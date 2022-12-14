import { MissingParamError, InvalidParamError, ServerError } from '../../errors';
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helpers';
import { Controller, UpdateMatch, HttpRequest, HttpResponse } from './match-protocols';

export default class UpdateMatchController implements Controller {
  private readonly requiredFields = ['homeTeamGoals', 'awayTeamGoals'];

  constructor(private readonly updateMatch: UpdateMatch) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      for (let i = 0; i < this.requiredFields.length; i += 1) {
        if (!httpRequest.body[this.requiredFields[i]]) {
          return badRequest(new MissingParamError('Invalid request body'));
        }
      }
      const { id } = httpRequest.params;
      const { homeTeamGoals, awayTeamGoals } = httpRequest.body;
      const hasUpdate = await this.updateMatch.update({ id, homeTeamGoals, awayTeamGoals });

      if (!hasUpdate) return notFound(new InvalidParamError('Match not found'));

      return ok({ message: 'Match updated with success' });
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
