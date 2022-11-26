import MissingParamError, { InvalidParamError, ServerError } from '../../errors';
import { badRequest, notFound, ok, serverError } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller, FindTeam } from './get-teams-protocols';

export default class GetTeamController implements Controller {
  constructor(private findTeam: FindTeam) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = httpRequest.params;
      if (!id) return badRequest(new MissingParamError('id'));

      const team = await this.findTeam.find(id);
      if (!team) return notFound(new InvalidParamError('Team not found'));

      return ok(team);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
