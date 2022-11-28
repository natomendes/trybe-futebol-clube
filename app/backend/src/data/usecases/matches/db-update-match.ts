import { UpdateMatch, UpdateMatchModel, UpdateMatchRepository } from './match-protocols';

export default class DbUpdateMatch implements UpdateMatch {
  constructor(private readonly updateMatchRepository: UpdateMatchRepository) {}
  async update(updateMatchData: UpdateMatchModel): Promise<number> {
    return this.updateMatchRepository.update(updateMatchData);
  }
}
