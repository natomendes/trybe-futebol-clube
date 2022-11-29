import TeamRepository from '../../infra/db/team-repository/team';
import DbGetTeamsStats from '../../data/usecases/teams/db-get-teams-stats';
import
HomeAwayStatsController
  from '../../presentation/controllers/leaderboard/home-away-stats-controller';
import StatsCalculator from '../../utils/stats-calculator';

const makeHomeAwayStatsController = (): HomeAwayStatsController => {
  const getTeamsMatchesRepo = new TeamRepository();
  const homeStats = new StatsCalculator();
  const getTeamsStats = new DbGetTeamsStats(getTeamsMatchesRepo, homeStats);
  return new HomeAwayStatsController(getTeamsStats);
};

export default makeHomeAwayStatsController;
