import { MatchModel } from '../../domain/models/match';

export interface FindMatchesRepository {
  findAll(): Promise<MatchModel[]>
}
