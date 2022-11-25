import { TeamModel } from '../models/team';

export interface FindTeams {
  find(): Promise<TeamModel[]>
}
