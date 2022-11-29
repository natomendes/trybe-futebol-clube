import TeamRepository from '../../infra/db/team-repository/team';
import DbGetHomeTeamStats from '../../data/usecases/teams/db-get-home-team-stats';
import
HomeTeamStatsController
  from '../../presentation/controllers/leaderboard/home-team-stats-controller';
import HomeStatsCalculator from '../../utils/home-stats-calculator';

const makeHomeTeamStatsController = (): HomeTeamStatsController => {
  const getHomeMatchesRepo = new TeamRepository();
  const homeStats = new HomeStatsCalculator();
  const getHometeamStats = new DbGetHomeTeamStats(getHomeMatchesRepo, homeStats);
  return new HomeTeamStatsController(getHometeamStats);
};

export default makeHomeTeamStatsController;
