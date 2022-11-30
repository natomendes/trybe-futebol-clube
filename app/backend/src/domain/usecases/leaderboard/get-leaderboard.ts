import { StatsModel } from '../../models';

export interface GetLeaderboard {
  handle(): Promise<StatsModel[]>
}
