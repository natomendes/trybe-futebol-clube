import MissingParamError from '../../errors';
import { badRequest, ok } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller } from './match-protocols';

export default class UpdateMatchController implements Controller {
  private readonly requiredFields = ['homeTeamGoals', 'awayTeamGoals'];
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    for (let i = 0; i < this.requiredFields.length; i += 1) {
      if (!httpRequest?.body?.[this.requiredFields[i]]) {
        return badRequest(new MissingParamError('Invalid request body'));
      }
    }

    return ok('test');
  }
}
