import Match from '../../../../src/database/models/Match';
import MatchRepository from '../../../../src/infra/db/match-repository/match';
import { allMatchesMock } from '../../../mocks/match-model-mock';

describe('MatchRepository', () => {
  it('Should throw if Match throws', async () => {
    const sut = new MatchRepository();
    jest.spyOn(Match, 'findAll')
      .mockRejectedValueOnce(new Error());
    const promise = sut.findAll();
    await expect(promise).rejects.toThrow();
  });
  describe('findAll method', () => {
    it('Should return an empty array if no matches are found', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'findAll')
        .mockResolvedValueOnce([]);
      const matches = await sut.findAll();
      expect(matches).toEqual([]);
    });
  });
  
});
