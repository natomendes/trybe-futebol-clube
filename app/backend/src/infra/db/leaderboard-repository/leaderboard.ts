import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';
import { GetHomeMatches } from '../match-repository/match-repository-protocols';

export default class LeaderboardRepository implements GetHomeMatches {
  constructor(private model = Team) {}

  async findHomeMatches(): Promise<Team[]> {
    const homeMatches = await this.model.findAll({
      include: [{ model: Match, as: 'teamAway', where: { inProgress: false } }],
    });

    return homeMatches;
  }
}
