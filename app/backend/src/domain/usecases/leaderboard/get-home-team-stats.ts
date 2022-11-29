import { StatsModel } from '../../models';

export interface GetTeamsStats {
  handle(path: string): Promise<StatsModel[]>
}
