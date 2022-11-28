import { FindMatches, FindMatchesRepository, Match } from './match-protocols';

export default class DbFindMatches implements FindMatches {
  constructor(
    private findMatchesRepository: FindMatchesRepository,
  ) {}

  async find(inProgress?: string): Promise<Match[]> {
    if (inProgress) return this.findMatchesRepository.findAll({ inProgress });

    return this.findMatchesRepository.findAll();
  }
}
