import { TeamModel } from '../../domain/models/team';

export interface FindTeamsRepository {
  findAll(): Promise<TeamModel[]>
}
