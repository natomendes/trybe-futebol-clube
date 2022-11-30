import { ServerError } from '../../errors';
import { ok, serverError } from '../../helpers/http-helpers';
import { HttpRequest, HttpResponse } from '../sign-in/signin-protocols';
import { Controller, GetLeaderboard } from './leaderboard-protocols';

export default class LeaderboardController implements Controller {
  constructor(private readonly getLeaderBoard: GetLeaderboard) {}

  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const leaderboard = await this.getLeaderBoard.handle();

      return ok(leaderboard);
    } catch (error) {
      return serverError(new ServerError());
    }
  }
}
