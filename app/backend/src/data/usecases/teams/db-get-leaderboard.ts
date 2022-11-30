import { StatsModel } from '../matches/match-protocols';
import { GetLeaderboard, GetTeamsStats } from './find-teams-protocols';

export default class DbGetLeaderboard implements GetLeaderboard {
  constructor(private readonly getTeamStats: GetTeamsStats) {}

  async handle(): Promise<StatsModel[]> {
    const homeTeamsStats = await this.getTeamStats.handle('home');
    await this.getTeamStats.handle('away');

    return homeTeamsStats;
  }
}
