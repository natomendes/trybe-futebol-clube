import * as P from './team-repository-protocols';

export default class TeamRepository implements P.FindTeamsRepository, P.FindTeamRepository {
  constructor(private model = P.Team) {}
  async findAll(): Promise<P.TeamModel[]> {
    return this.model.findAll();
  }

  async findOne(id: string): Promise<P.TeamModel | undefined> {
    const team = await this.model.findOne({ where: { id } });
    if (!team) return undefined;

    return team;
  }
}
