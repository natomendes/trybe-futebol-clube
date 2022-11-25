import { TeamModel } from '../models/team';

export interface FindTeams {
  find(): Promise<TeamModel[]>
}

export interface FindTeam {
  find(id: string): Promise<TeamModel | undefined>
}
