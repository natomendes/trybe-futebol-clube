import Team from "../../../../src/database/models/Team";
import { homeTeamDbResult } from "../../../mocks/leaderboard-model-mock";
import LeaderboardRepository from '../../../../src/infra/db/leaderboard-repository/leaderboard';

describe('LeaderboardRepository', () => {
  it('Should return all teams with home matches on success', async () => {
    const sut = new LeaderboardRepository();
    jest.spyOn(Team, 'findAll')
      .mockResolvedValueOnce(homeTeamDbResult as any[]);
      
    const homeTeamSearch = await sut.findHomeMatches();
    expect(homeTeamSearch).toEqual(homeTeamDbResult);
  })
});
