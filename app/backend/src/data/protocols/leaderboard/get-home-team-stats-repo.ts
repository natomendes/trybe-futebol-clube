import Team from '../../../database/models/Team';

export interface GetHomeMatches {
  findHomeMatches(): Promise<Team[]>
}
