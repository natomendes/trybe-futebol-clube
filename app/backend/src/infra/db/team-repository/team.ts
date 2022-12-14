import * as P from './team-repository-protocols';

export default class TeamRepository implements
  P.FindTeamsRepository, P.FindTeamRepository, P.GetTeamsMatchesRepository {
  constructor(private model = P.Team) {}
  async findAll(): Promise<P.TeamModel[]> {
    return this.model.findAll({
      include: [
        { model: P.Match, as: 'teamHome' },
        { model: P.Match, as: 'teamAway' },
      ],
    }) as any;
  }

  async findOne(id: string): Promise<P.TeamModel | undefined> {
    const team = await this.model.findOne({
      include: [
        { model: P.Match, as: 'teamHome' },
        { model: P.Match, as: 'teamAway' },
      ],
      where: { id },
    });
    if (!team) return undefined;

    return team as any;
  }

  async findMatches(path: string): Promise<P.TeamModel[]> {
    const capitalizedPath = path[0].toUpperCase() + path.slice(1);
    const as = `team${capitalizedPath}`;
    const homeMatches = await this.model.findAll({
      include: [{ model: P.Match, as, where: { inProgress: false } }],
    });

    return homeMatches as any;
  }
}
