import {
  GetHomeTeamStats,
  StatsModel,
  GetHomeTeamStatsRepository,
  HomeStats,
} from './db-leaderboard-protocols';

export default class DbGetHomeTeamStats implements GetHomeTeamStats {
  constructor(
    private readonly getHomeTeamStatsRepo: GetHomeTeamStatsRepository,
    private readonly homeStats: HomeStats,
  ) {}

  async handle(): Promise<StatsModel[]> {
    const teamsSearch = await this.getHomeTeamStatsRepo.findAll();
    const homeStats = this.homeStats.calculate(teamsSearch);
    return homeStats;
  }
}
