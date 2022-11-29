import { MatchModel, StatsModel, TeamModel } from '../domain/models';
import { TeamStats } from '../domain/usecases';

const sortFunction = (a: StatsModel, b: StatsModel): number => b.totalPoints - a.totalPoints
  || b.totalVictories - a.totalVictories
  || b.goalsBalance - a.goalsBalance
  || b.goalsFavor - a.goalsFavor
  || a.goalsOwn - b.goalsOwn;

export default class StatsCalculator implements TeamStats {
  private teamsStats: StatsModel[] = [];
  private stats: StatsModel = {
    name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '0.00',
  };

  map({ homeTeamGoals, awayTeamGoals }: MatchModel): void {
    const result = homeTeamGoals - awayTeamGoals;
    if (result > 0) {
      this.stats.totalPoints += 3;
      this.stats.totalVictories += 1;
    } else if (result < 0) {
      this.stats.totalLosses += 1;
    } else {
      this.stats.totalDraws += 1;
      this.stats.totalPoints += 1;
    }
    this.stats.goalsBalance += result;
    this.stats.goalsFavor += homeTeamGoals;
    this.stats.goalsOwn += awayTeamGoals;
    const efficiency = ((this.stats.totalPoints / (this.stats.totalGames * 3)) * 100).toFixed(2);
    this.stats.efficiency = efficiency;
  }

  resetStats(): void {
    this.stats = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0.00',
    };
  }

  calculateHome(teamsData: TeamModel[]): StatsModel[] {
    this.teamsStats = [];
    for (let i = 0; i < teamsData.length; i += 1) {
      this.stats.name = teamsData[i].teamName;
      const { teamHome } = teamsData[i];
      if (teamHome) {
        for (let j = 0; j < teamHome.length; j += 1) {
          this.stats.totalGames += 1;
          this.map(teamHome[j]);
        }
      }
      this.teamsStats.push(this.stats);
      this.resetStats();
    }
    this.teamsStats.sort(sortFunction);

    return this.teamsStats;
  }

  calculateAway(_teamsData: TeamModel[]): StatsModel[] {
    return this.teamsStats;
  }
}
