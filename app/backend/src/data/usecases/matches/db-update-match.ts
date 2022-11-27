import { UpdateMatch, UpdateMatchModel } from '../../../domain/usecases';
import { UpdateMatchRepository } from '../../protocols';

export default class DbUpdateMatch implements UpdateMatch {
  constructor(private readonly updateMatchRepository: UpdateMatchRepository) {}
  async update(updateMatchData: UpdateMatchModel): Promise<number> {
    return this.updateMatchRepository.update(updateMatchData);
  }
}
