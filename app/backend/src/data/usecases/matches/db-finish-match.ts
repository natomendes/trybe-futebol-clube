import { FinishMatch, FinishMatchRepository } from './match-protocols';

export default class DbFinishMatch implements FinishMatch {
  constructor(
    private readonly finishMatchRepository: FinishMatchRepository,
  ) {}

  async finish(id: string): Promise<number> {
    return this.finishMatchRepository.finish(id);
  }
}
