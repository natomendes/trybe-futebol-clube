import Team from '../../../database/models/Team';
import { TeamModel } from '../../../domain/models/team';
import { FindTeamsRepository } from '../../../data/protocols/find-teams-repository';

export default class TeamRepository implements FindTeamsRepository {
  constructor(private model = Team) {}
  async findAll(): Promise<TeamModel[]> {
    return this.model.findAll();
  }
}
