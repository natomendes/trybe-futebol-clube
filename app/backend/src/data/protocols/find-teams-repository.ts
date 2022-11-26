import { TeamModel } from '../../domain/models/team';

export interface FindTeamsRepository {
  findAll(): Promise<TeamModel[]>
}

export interface FindTeamRepository {
  find(id: string): Promise<TeamModel | undefined>
}
