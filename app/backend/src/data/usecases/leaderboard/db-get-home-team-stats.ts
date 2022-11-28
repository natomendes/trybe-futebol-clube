import {
  GetHomeTeamStats,
  StatsModel,
  GetHomeMatches,
  HomeStats,
} from './db-leaderboard-protocols';

export default class DbGetHomeTeamStats implements GetHomeTeamStats {
  constructor(
    private readonly getHomeMatchesRepo: GetHomeMatches,
    private readonly homeStats: HomeStats,
  ) {}

  async handle(): Promise<StatsModel[]> {
    const teamsSearch = await this.getHomeMatchesRepo.findHomeMatches();
    const homeStats = this.homeStats.calculate(teamsSearch);
    return homeStats;
  }
}
