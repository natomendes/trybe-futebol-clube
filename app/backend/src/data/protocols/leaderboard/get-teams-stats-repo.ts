import Team from '../../../database/models/Team';

export interface GetTeamsMatchesRepository {
  findMatches(path: string): Promise<Team[]>
}
