import { TeamModel } from '../../domain/models';

export interface FindTeamsRepository {
  findAll(): Promise<TeamModel[]>
}

export interface FindTeamRepository {
  findOne(id: string): Promise<TeamModel | undefined>
}
