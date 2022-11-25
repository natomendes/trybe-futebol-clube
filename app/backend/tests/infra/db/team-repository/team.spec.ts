import Team from '../../../../src/database/models/Team';
import TeamRepository from '../../../../src/infra/db/team-repository/team';
import { getTeamsMock } from '../../../mocks/team-model-mock'

describe('TeamRepository', () => {
  it('Should throw if Team throws', async () => {
    const sut = new TeamRepository();
    jest.spyOn(Team, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.findAll();
    await expect(promise).rejects.toThrow();
  });

  // it('Should return an empty array if no teams are found', async () => {
  //   const sut = new TeamRepository();
  //   jest.spyOn(Team, 'findAll')
  //     .mockResolvedValueOnce([]);
  //   const teams = await sut.findAll();
  //   expect(teams).toEqual([]);
  // });

  // it('Should return all teams on success', async () => {
  //   const sut = new TeamRepository();
  //   jest.spyOn(Team, 'findAll')
  //     .mockResolvedValueOnce(getTeamsMock as Team[]);
  //   const teams = await sut.findAll();
  //   expect(teams).toEqual(getTeamsMock);
  // });
});
