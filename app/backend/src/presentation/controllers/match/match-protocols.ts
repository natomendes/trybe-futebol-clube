export * from '../../../domain/models/match';
export * from '../../../domain/usecases/find-matches';
export * from '../../protocols';
export * from '../../../data/protocols/find-matches-repository';

export interface AddMatchReqBody {
  homeTeam?: number
  awayTeam?: number
  homeTeamGoals?: number
  awayTeamGoals?: number
}
