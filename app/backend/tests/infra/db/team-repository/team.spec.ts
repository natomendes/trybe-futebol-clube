import Team from '../../../../src/database/models/Team';
import TeamRepository from '../../../../src/infra/db/team-repository/team';
import { getTeamsMock, teamMock } from '../../../mocks/team-model-mock'

describe('TeamRepository', () => {
  it('Should throw if Team throws', async () => {
    const sut = new TeamRepository();
    jest.spyOn(Team, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.findAll();
    await expect(promise).rejects.toThrow();
  });
  
  describe('findAll method', () => {
    it('Should return an empty array if no teams are found', async () => {
      const sut = new TeamRepository();
      jest.spyOn(Team, 'findAll')
        .mockResolvedValueOnce([]);
      const teams = await sut.findAll();
      expect(teams).toEqual([]);
    });
  
    it('Should return all teams on success', async () => {
      const sut = new TeamRepository();
      jest.spyOn(Team, 'findAll')
        .mockResolvedValueOnce(getTeamsMock as Team[]);
      const teams = await sut.findAll();
      expect(teams).toEqual(getTeamsMock);
    });
  });

  describe('findOne method', () => {
    it('Should return undefined if no team is found', async () => {
      const sut = new TeamRepository();
      jest.spyOn(Team, 'findOne')
        .mockResolvedValueOnce(null);
      const team = await sut.findOne('no_team_id');
      expect(team).toEqual(undefined);
    });

    // it('Should return a team on success', async () => {
    //   const sut = new TeamRepository();
    //   jest.spyOn(Team, 'findOne')
    //     .mockResolvedValueOnce(teamMock as Team);
    //   const team = await sut.findOne('valid_id');
    //   expect(team).toEqual(teamMock);
    // });
  });
  
});
