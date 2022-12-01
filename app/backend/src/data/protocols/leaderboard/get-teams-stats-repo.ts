import { TeamModel } from '../../../domain/models';

export interface GetTeamsMatchesRepository {
  findMatches(path: string): Promise<TeamModel[]>
}
