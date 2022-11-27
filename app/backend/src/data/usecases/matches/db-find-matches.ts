import { FindMatches } from '../../../domain/usecases/find-matches';
import { FindMatchesRepository } from '../../protocols/find-matches-repository';
import Match from '../../../database/models/Match';

export default class DbFindMatches implements FindMatches {
  constructor(
    private findMatchesRepository: FindMatchesRepository,
  ) {}

  async find(inProgress?: string): Promise<Match[]> {
    if (inProgress) return this.findMatchesRepository.findAll({ inProgress });

    return this.findMatchesRepository.findAll();
  }
}
