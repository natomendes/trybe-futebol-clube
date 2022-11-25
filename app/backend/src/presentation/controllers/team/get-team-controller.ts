import MissingParamError from '../../errors';
import { badRequest, ok } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller } from './get-teams-protocols';

export default class GetTeamController implements Controller {
  private hasId = false;
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { id } = httpRequest.params;
    if (id) {
      this.hasId = true;
    }
    if (!this.hasId) {
      return badRequest(new MissingParamError('id'));
    }
    return ok({ id: 5, teamName: 'Cruzeiro' });
  }
}
