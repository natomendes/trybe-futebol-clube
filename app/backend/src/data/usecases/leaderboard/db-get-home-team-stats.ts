import {
  GetHomeTeamStats,
  StatsModel,
  GetHomeMatches,
  HomeStats,
} from './db-leaderboard-protocols';

export default class DbGetHomeTeamStats implements GetHomeTeamStats {
  constructor(
    private readonly getHomeTeamStatsRepo: GetHomeMatches,
    private readonly homeStats: HomeStats,
  ) {}

  async handle(): Promise<StatsModel[]> {
    const teamsSearch = await this.getHomeTeamStatsRepo.findHomeMatches();
    const homeStats = this.homeStats.calculate(teamsSearch);
    return homeStats;
  }
}
