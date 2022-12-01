import Match from '../../database/models/Match';

export interface FindAllOptions {
  inProgress: string
}

export interface FindMatchesRepository {
  findAll(Options?: FindAllOptions): Promise<Match[]>
}
