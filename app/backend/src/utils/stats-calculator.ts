import { MatchModel, StatsModel, TeamModel } from '../domain/models';
import { GetLeaderboardStats, TeamStats } from '../domain/usecases';

const sortFunction = (a: StatsModel, b: StatsModel): number => b.totalPoints - a.totalPoints
  || b.totalVictories - a.totalVictories
  || b.goalsBalance - a.goalsBalance
  || b.goalsFavor - a.goalsFavor
  || a.goalsOwn - b.goalsOwn;

export default class StatsCalculator implements TeamStats, GetLeaderboardStats {
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

  map({ homeTeamGoals, awayTeamGoals }: MatchModel, type: string): void {
    const result = type === 'away'
      ? awayTeamGoals - homeTeamGoals
      : homeTeamGoals - awayTeamGoals;
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
    this.stats.goalsFavor += type === 'away' ? awayTeamGoals : homeTeamGoals;
    this.stats.goalsOwn += type === 'away' ? homeTeamGoals : awayTeamGoals;
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
          this.map(teamHome[j], 'home');
        }
      }
      this.teamsStats.push(this.stats);
      this.resetStats();
    }
    this.teamsStats.sort(sortFunction);

    return this.teamsStats;
  }

  calculateAway(teamsData: TeamModel[]): StatsModel[] {
    this.teamsStats = [];
    for (let i = 0; i < teamsData.length; i += 1) {
      this.stats.name = teamsData[i].teamName;
      const { teamAway } = teamsData[i];
      if (teamAway) {
        for (let j = 0; j < teamAway.length; j += 1) {
          this.stats.totalGames += 1;
          this.map(teamAway[j], 'away');
        }
      }
      this.teamsStats.push(this.stats);
      this.resetStats();
    }
    this.teamsStats.sort(sortFunction);

    return this.teamsStats;
  }

  // async handle(homeStats: StatsModel[], awayStats: StatsModel[]): Promise<StatsModel[]> {
  //   this.teamsStats = []; homeStats.sort(); awayStats.sort();
  //   for (let i = 0; i < homeStats.length; i += 1) {
  //     this.stats.name = homeStats[i].name;
  //     this.stats.totalPoints = homeStats[i].totalPoints + awayStats[i].totalPoints;
  //     this.stats.totalGames = homeStats[i].totalGames + awayStats[i].totalGames;
  //     this.stats.totalVictories = homeStats[i].totalVictories + awayStats[i].totalVictories;
  //     this.stats.totalDraws = homeStats[i].totalDraws + awayStats[i].totalDraws;
  //     this.stats.totalLosses = homeStats[i].totalLosses + awayStats[i].totalLosses;
  //     this.stats.goalsFavor = homeStats[i].goalsFavor + awayStats[i].goalsFavor;
  //     this.stats.goalsOwn = homeStats[i].goalsOwn + awayStats[i].goalsOwn;
  //     this.stats.goalsBalance = homeStats[i].goalsBalance + awayStats[i].goalsBalance;
  //     this.stats.efficiency = ((this.stats.totalPoints / (this.stats.totalGames * 3)) * 100)
  //       .toFixed(2);
  //     this.teamsStats.push(this.stats);
  //     this.resetStats();
  //   }
  //   return this.teamsStats.sort(sortFunction);
  // }
  private sumStats(stats1: StatsModel, stats2: StatsModel): void {
    this.stats.name = stats1.name;
    this.stats.totalPoints = stats1.totalPoints + stats2.totalPoints;
    this.stats.totalGames = stats1.totalGames + stats2.totalGames;
    this.stats.totalVictories = stats1.totalVictories + stats2.totalVictories;
    this.stats.totalDraws = stats1.totalDraws + stats2.totalDraws;
    this.stats.totalLosses = stats1.totalLosses + stats2.totalLosses;
    this.stats.goalsFavor = stats1.goalsFavor + stats2.goalsFavor;
    this.stats.goalsOwn = stats1.goalsOwn + stats2.goalsOwn;
    this.stats.goalsBalance = stats1.goalsBalance + stats2.goalsBalance;
    this.stats.efficiency = ((this.stats.totalPoints / (this.stats.totalGames * 3)) * 100)
      .toFixed(2);
  }

  async handle(homeStats: StatsModel[], awayStats: StatsModel[]): Promise<StatsModel[]> {
    this.teamsStats = [];
    const biggerArray = homeStats.length > awayStats.length ? homeStats : awayStats;
    const smallerArray = homeStats.length <= awayStats.length ? homeStats : awayStats;
    for (let i = 0; i < biggerArray.length; i += 1) {
      let hasMatch = false;
      for (let j = 0; j < smallerArray.length; j += 1) {
        if (biggerArray[i].name === smallerArray[j].name) {
          hasMatch = true;
          this.sumStats(biggerArray[i], smallerArray[j]);
          this.teamsStats.push(this.stats);
          this.resetStats();
        }
      }
      if (!hasMatch) {
        this.teamsStats.push(biggerArray[i]);
      }
    }
    return this.teamsStats.sort(sortFunction);
  }
}
