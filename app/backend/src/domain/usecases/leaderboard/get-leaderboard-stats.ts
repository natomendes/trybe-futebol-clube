import { StatsModel } from '../../models';

export interface GetLeaderboardStats {
  handle(homeStats: StatsModel[], awayStats: StatsModel[]): Promise<StatsModel[]>
}
