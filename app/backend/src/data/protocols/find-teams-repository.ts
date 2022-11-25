import { TeamModel } from '../../domain/models/team';

export interface FindTeamsRepository {
  find(): Promise<TeamModel[]>
}
