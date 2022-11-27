import { AddMatchRepository } from '../../protocols/add-match-repository';
import { MatchModel } from '../../../domain/models/match';
import { AddMatch, AddMatchModel } from '../../../domain/usecases/add-match';

export default class DbAddMatch implements AddMatch {
  constructor(
    private readonly addMatchRepository: AddMatchRepository,
  ) {}

  async add(matchData: AddMatchModel): Promise<MatchModel> {
    return this.addMatchRepository.add(matchData);
  }
}
