// import { MatchModel } from '../../domain/models/match';
import Match from '../../database/models/Match';

export interface FindMatchesRepository {
  findAll(): Promise<Match[]>
}
