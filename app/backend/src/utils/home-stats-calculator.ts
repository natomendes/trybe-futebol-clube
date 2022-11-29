import { MatchModel, StatsModel, TeamModel } from '../domain/models';
import { HomeStats } from '../domain/usecases';

const recursiveSort = (objA: StatsModel, objB: StatsModel, index: number) => {
  const comparisonOder = [
    'totalPoints', 'totalVictories', 'goalsBalance', 'goalsFavor', 'goalsOwn'];
  const firstValue = objA[comparisonOder[index] as keyof StatsModel] as number;
  const secondValue = objB[comparisonOder[index] as keyof StatsModel] as number;
  if (secondValue === firstValue && index < comparisonOder.length) {
    const next = index + 1;
    recursiveSort(objA, objB, next);
  }
  return secondValue - firstValue;
};

const sortFunction = (a: StatsModel, b: StatsModel): number =>
  recursiveSort(a, b, 0);

export default class HomeStatsCalculator implements HomeStats {
  private teamsStats: StatsModel[] = [];
  private stats: StatsModel = { name: '',
    totalPoints: 0,
    totalGames: 0,
    totalVictories: 0,
    totalDraws: 0,
    totalLosses: 0,
    goalsFavor: 0,
    goalsOwn: 0,
    goalsBalance: 0,
    efficiency: '0.00' };

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
    this.stats = { name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: '0.00' };
  }

  calculate(teamsData: TeamModel[]): StatsModel[] {
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
}
