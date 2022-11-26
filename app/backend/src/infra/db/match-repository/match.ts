import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';
import { FindMatchesRepository } from '../../../data/protocols/find-matches-repository';

export default class MatchRepository implements FindMatchesRepository {
  constructor(private model = Match) {}

  async findAll(): Promise<Match[]> {
    const matches = await this.model.findAll({
      include: [
        { model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return matches;
  }
}
