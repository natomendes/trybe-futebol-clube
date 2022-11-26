import Match from '../../../../src/database/models/Match';
import MatchRepository from '../../../../src/infra/db/match-repository/match';
import { allMatchesMock, matchesInProgressMock } from '../../../mocks/match-model-mock';

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

    it('Should return matches filtered if query inProgress is provided', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'findAll')
        .mockResolvedValueOnce(matchesInProgressMock as any);
      const matches = await sut.findAll();
      expect(matches).toEqual(matchesInProgressMock);
    });

    it('Should return all matches on success', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'findAll')
        .mockResolvedValueOnce(allMatchesMock as any);
      const matches = await sut.findAll();
      expect(matches).toEqual(allMatchesMock);
    });
  });
  
});
