import {
  GetLeaderboard,
  GetTeamsStats,
  GetLeaderboardStats,
  StatsModel,
} from './find-teams-protocols';

export default class DbGetLeaderboard implements GetLeaderboard {
  constructor(
    private readonly getTeamStats: GetTeamsStats,
    private readonly getLeaderboardStats: GetLeaderboardStats,
  ) {}

  async handle(): Promise<StatsModel[]> {
    const homeTeamsStats = await this.getTeamStats.handle('home');
    const awayTeamsStats = await this.getTeamStats.handle('away');
    const leaderboard = await this.getLeaderboardStats.handle(homeTeamsStats, awayTeamsStats);

    return leaderboard;
  }
}
