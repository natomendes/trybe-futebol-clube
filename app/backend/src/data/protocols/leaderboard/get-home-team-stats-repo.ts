import Team from '../../../database/models/Team';

export interface GetHomeMatchesRepository {
  findHomeMatches(): Promise<Team[]>
}
