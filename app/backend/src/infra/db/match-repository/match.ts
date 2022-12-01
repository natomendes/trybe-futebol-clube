import * as P from './match-repository-protocols';

export default
class MatchRepository
implements
  P.FindMatchesRepository,
  P.AddMatchRepository,
  P.UpdateMatchRepository,
  P.FinishMatchRepository {
  constructor(private model = P.Match) {}

  async add(matchData: P.AddMatchModel): Promise<P.MatchModel> {
    const matchMap = {
      homeTeam: Number(matchData.homeTeam),
      homeTeamGoals: Number(matchData.homeTeamGoals),
      awayTeam: Number(matchData.awayTeam),
      awayTeamGoals: Number(matchData.awayTeamGoals),
      inProgress: true,
    };

    return this.model.create(matchMap);
  }

  async findAll(Options?: P.FindAllOptions): Promise<P.Match[]> {
    if (Options) {
      const { inProgress } = Options;
      const boolInProgress = inProgress.toLowerCase() === 'true';
      const matches = await this.model.findAll({
        where: { inProgress: boolInProgress },
        include: [{ model: P.Team, as: 'teamHome', attributes: ['teamName'] },
          { model: P.Team, as: 'teamAway', attributes: ['teamName'] },
        ],
      });

      return matches;
    }
    const matches = await this.model.findAll({
      include: [{ model: P.Team, as: 'teamHome', attributes: ['teamName'] },
        { model: P.Team, as: 'teamAway', attributes: ['teamName'] },
      ],
    });

    return matches;
  }

  async update(updateMatchData: P.UpdateMatchModel): Promise<number> {
    const id = Number(updateMatchData.id);
    const updateInfo = {
      homeTeamGoals: Number(updateMatchData.homeTeamGoals),
      awayTeamGoals: Number(updateMatchData.awayTeamGoals),
    };

    const [affectedRows] = await this.model.update(updateInfo, { where: { id } });

    return affectedRows;
  }

  async finish(matchId: string): Promise<number> {
    const id = Number(matchId);

    const [affectedRows] = await this.model.update({
      inProgress: false,
    }, { where: { id } });

    return affectedRows;
  }
}
