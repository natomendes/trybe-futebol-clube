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
      console.log(finalPath);
      const teamsStats = await this.getTeamsStats.handle(finalPath as string);
      console.log(teamsStats);
      return ok(teamsStats);
    } catch (error) {
      console.log(error);
      return serverError(new ServerError());
    }
  }
}
