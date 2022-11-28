import { StatsModel, TeamModel } from '../../models';

export interface HomeStats {
  calculate(teamsData: TeamModel[]): StatsModel[]
}
