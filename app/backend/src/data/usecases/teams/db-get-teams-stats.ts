import {
  GetTeamsStats,
  StatsModel,
  GetTeamsMatchesRepository,
  TeamStats,
} from './find-teams-protocols';

export default class DbGetTeamsStats implements GetTeamsStats {
  constructor(
    private readonly getTeamsMatchesRepo: GetTeamsMatchesRepository,
    private readonly teamStats: TeamStats,
  ) {}

  async handle(path: string): Promise<StatsModel[]> {
    const teamsSearch = await this.getTeamsMatchesRepo.findMatches(path);
    const teamStats = path === 'home'
      ? this.teamStats.calculateHome(teamsSearch)
      : this.teamStats.calculateAway(teamsSearch);
    return teamStats;
  }
}
