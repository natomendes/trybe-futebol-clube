import { StatsModel } from '../../models';

export interface GetHomeTeamStats {
  handle(): Promise<StatsModel[]>
}
