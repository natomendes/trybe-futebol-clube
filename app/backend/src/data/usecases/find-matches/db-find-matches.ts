import { FindMatches } from '../../../domain/usecases/find-matches';
import { FindMatchesRepository } from '../../protocols/find-matches-repository';
import { MatchModel } from '../../../domain/models/match';

export default class DbFindMatches implements FindMatches {
  constructor(
    private findMatchesRepository: FindMatchesRepository,
  ) {}

  async find(): Promise<MatchModel[]> {
    return this.findMatchesRepository.findAll();
  }
}
