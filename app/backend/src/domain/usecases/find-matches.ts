import { MatchModel } from '../models/match';

export interface FindMatches {
  find(): Promise<MatchModel[]>
}
