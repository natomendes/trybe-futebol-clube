import { MatchModel } from '../../domain/models';
import { AddMatchModel } from '../../domain/usecases';

export interface AddMatchRepository {
  add(matchData: AddMatchModel): Promise<MatchModel>
}
