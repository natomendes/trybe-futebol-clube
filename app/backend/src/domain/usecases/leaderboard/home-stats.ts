import { StatsModel, TeamModel } from '../../models';

export interface TeamStats {
  calculateHome(teamsData: TeamModel[]): StatsModel[]
  calculateAway(teamsData: TeamModel[]): StatsModel[]
}
