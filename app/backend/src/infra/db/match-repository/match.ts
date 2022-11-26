import Match from '../../../database/models/Match';
import { FindMatchesRepository } from '../../../data/protocols/find-matches-repository';
import { MatchModel } from '../../../domain/models/match';

export default class MatchRepository implements FindMatchesRepository {
  constructor(private model = Match) {}

  async findAll(): Promise<MatchModel[]> {
    return this.model.findAll();
  }
}
