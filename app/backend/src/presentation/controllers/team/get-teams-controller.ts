import { ok, serverError } from '../../helpers/http-helpers';
import { Controller, HttpRequest, HttpResponse, FindTeams } from './get-teams-protocols';
import { ServerError } from '../../errors';

export default class GetTeamsController implements Controller {
  constructor(
    private findTeams: FindTeams,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const teams = await this.findTeams.find();
      return ok(teams);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
