import { FindMatches } from '../../../domain/usecases/find-matches';
import { FindMatchesRepository } from '../../protocols/find-matches-repository';
import Match from '../../../database/models/Match';

export default class DbFindMatches implements FindMatches {
  constructor(
    private findMatchesRepository: FindMatchesRepository,
  ) {}

  async find(): Promise<Match[]> {
    return this.findMatchesRepository.findAll();
  }
}
