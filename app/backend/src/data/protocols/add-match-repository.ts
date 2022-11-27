import { MatchModel } from '../../domain/models/match';
import { AddMatchModel } from '../../domain/usecases/add-match';

export interface AddMatchRepository {
  add(matchData: AddMatchModel): Promise<MatchModel>
}
