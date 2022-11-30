import DbGetTeamsStats from '../../data/usecases/teams/db-get-teams-stats';
import DbGetLeaderboard from '../../data/usecases/teams/db-get-leaderboard';
import
LeaderboardController
  from '../../presentation/controllers/leaderboard/leaderboard-controller';
import TeamRepository from '../../infra/db/team-repository/team';
import StatsCalculator from '../../utils/stats-calculator';

const makeLeaderBoardController = (): LeaderboardController => {
  const getTeamsMatchesRepository = new TeamRepository();
  const statsCalculator = new StatsCalculator();
  const getTeamsStats = new DbGetTeamsStats(getTeamsMatchesRepository, statsCalculator);
  const getLeaderboard = new DbGetLeaderboard(getTeamsStats, statsCalculator);
  return new LeaderboardController(getLeaderboard);
};

export default makeLeaderBoardController;
