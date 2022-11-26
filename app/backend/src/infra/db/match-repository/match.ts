import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';
import {
  FindAllOptions,
  FindMatchesRepository,
} from '../../../data/protocols/find-matches-repository';

export default class MatchRepository implements FindMatchesRepository {
  constructor(private model = Match) {}

  async findAll(Options?: FindAllOptions): Promise<Match[]> {
    if (Options) {
      const { inProgress } = Options;
      const boolInProgress = inProgress?.toLowerCase() === 'true';
      const matches = await this.model.findAll({
        where: { inProgress: boolInProgress },
        include: [{ model: Team, as: 'teamHome', attributes: ['teamName'] },
          { model: Team, as: 'teamAway', attributes: ['teamName'] },
        ],
      });
      return matches;
    }
    const matches = await this.model.findAll({
      include: [{ model: Team, as: 'teamHome', attributes: ['teamName'] },
        { model: Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });
    return matches;
  }
}
