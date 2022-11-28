import { MatchModel } from '../../../domain/models/match';
import { AddMatchModel, UpdateMatchModel } from '../../../domain/usecases';
import Match from '../../../database/models/Match';
import Team from '../../../database/models/Team';
import {
  FindAllOptions,
  FindMatchesRepository,
  UpdateMatchRepository,
  AddMatchRepository,
} from '../../../data/protocols';

export default
class MatchRepository
implements
  FindMatchesRepository,
  AddMatchRepository,
  UpdateMatchRepository {
  constructor(private model = Match) {}

  async add(matchData: AddMatchModel): Promise<MatchModel> {
    const matchMap = {
      homeTeam: Number(matchData.homeTeam),
      homeTeamGoals: Number(matchData.homeTeamGoals),
      awayTeam: Number(matchData.awayTeam),
      awayTeamGoals: Number(matchData.awayTeamGoals),
      inProgress: true,
    };

    return this.model.create(matchMap);
  }

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

  async update(updateMatchData: UpdateMatchModel): Promise<number> {
    const id = Number(updateMatchData.id);
    const updateInfo = {
      homeTeamGoals: Number(updateMatchData.homeTeamGoals),
      awayTeamGoals: Number(updateMatchData.awayTeamGoals),
    };

    const [affectedRows] = await this.model.update(updateInfo, { where: { id } });

    return affectedRows;
  }
}
