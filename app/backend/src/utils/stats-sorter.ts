import { StatsModel } from '../domain/models';

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

export default class StatsSorter {
  static sort(teamsStats: StatsModel[]): StatsModel[] {
    return teamsStats.sort(sortFunction);
  }
}
