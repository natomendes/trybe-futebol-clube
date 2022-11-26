import { MatchModel } from '../models/match';

export interface AddMatchModel {
  homeTeam: string
  awayTeam: string
  homeTeamGoals: string
  awayTeamGoals: string
}

export interface AddMatch {
  add(matchData: AddMatchModel): Promise<MatchModel>
}
