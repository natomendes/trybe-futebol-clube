import { AddMatchRepository, MatchModel, AddMatch, AddMatchModel } from './match-protocols';

export default class DbAddMatch implements AddMatch {
  constructor(
    private readonly addMatchRepository: AddMatchRepository,
  ) {}

  async add(matchData: AddMatchModel): Promise<MatchModel> {
    return this.addMatchRepository.add(matchData);
  }
}
