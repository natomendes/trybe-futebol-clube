import Team from '../../../database/models/Team';
import { TeamModel } from '../../../domain/models/team';
import {
  FindTeamRepository,
  FindTeamsRepository,
} from '../../../data/protocols/find-teams-repository';

export default class TeamRepository implements FindTeamsRepository, FindTeamRepository {
  constructor(private model = Team) {}
  async findAll(): Promise<TeamModel[]> {
    return this.model.findAll();
  }

  async findOne(id: string): Promise<TeamModel | undefined> {
    const team = await this.model.findOne({ where: { id } });
    if (!team) return undefined;

    return team;
  }
}
