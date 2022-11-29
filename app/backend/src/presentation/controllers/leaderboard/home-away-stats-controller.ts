import { ServerError } from '../../errors';
import { ok, serverError } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller, GetTeamsStats } from './leaderboard-protocols';

export default class HomeAwayStatsController implements Controller {
  constructor(
    private readonly getTeamsStats: GetTeamsStats,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { path } = httpRequest.body;
      const finalPath = path.split('/')[1];

      const teamsStats = await this.getTeamsStats.handle(finalPath as string);

      return ok(teamsStats);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
