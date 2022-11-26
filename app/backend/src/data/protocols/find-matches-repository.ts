// import { MatchModel } from '../../domain/models/match';
import Match from '../../database/models/Match';

interface FindAllOptions {
  inProgress: string
}

export interface FindMatchesRepository {
  findAll({ inProgress }?: FindAllOptions): Promise<Match[]>
}
