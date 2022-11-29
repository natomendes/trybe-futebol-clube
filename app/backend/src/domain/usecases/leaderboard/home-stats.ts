import Team from '../../../database/models/Team';
import { StatsModel } from '../../models';

export interface TeamStats {
  calculateHome(teamsData: Team[]): StatsModel[]
  calculateAway(teamsData: Team[]): StatsModel[]
}
