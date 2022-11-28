import { TeamModel } from '../../../domain/models';

export interface GetHomeTeamStatsRepository {
  findAll(): Promise<TeamModel[]>
}
