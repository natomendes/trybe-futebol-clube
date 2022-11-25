import { ok, serverError } from '../../helpers/http-helpers';
import { FindTeams } from '../../../domain/usecases/find-teams';
import { Controller, HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { ServerError } from '../../errors';

export default class GetTeamsController implements Controller {
  constructor(
    private findTeams: FindTeams,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const teams = this.findTeams.find();
      return ok(teams);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
