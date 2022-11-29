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
    const teamStats = this.teamStats.calculateHome(teamsSearch);
    return teamStats;
  }
}
