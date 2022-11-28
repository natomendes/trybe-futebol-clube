import { ServerError } from '../../errors';
import { ok, serverError } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller, GetHomeTeamStats } from './leaderboard-protocols';

export default class HomeTeamStatsController implements Controller {
  constructor(
    private readonly getHomeTeamStats: GetHomeTeamStats,
  ) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const homeTeamStats = await this.getHomeTeamStats.handle();

      return ok(homeTeamStats);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
