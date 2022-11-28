import { InvalidParamError, ServerError } from '../../errors';
import { notFound, ok, serverError } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse, Controller, FindTeam } from './get-teams-protocols';

export default class GetTeamController implements Controller {
  constructor(private findTeam: FindTeam) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      const team = await this.findTeam.find(id);
      if (!team) return notFound(new InvalidParamError('Team not found'));

      return ok(team);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
