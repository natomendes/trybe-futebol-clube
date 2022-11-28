import {
  GetHomeTeamStats,
  StatsModel,
  GetHomeTeamStatsRepository,
} from './db-leaderboard-protocols';
import homeStatsMock from './mockProvisory';

export default class DbGetHomeTeamStats implements GetHomeTeamStats {
  constructor(
    private readonly getHomeTeamStatsRepo: GetHomeTeamStatsRepository,
  ) {}

  async handle(): Promise<StatsModel[]> {
    await this.getHomeTeamStatsRepo.findAll();
    return homeStatsMock;
  }
}
