import Match from '../../../../../src/database/models/Match';
import MatchRepository from '../../../../../src/infra/db/match-repository/match';
import {
  addMatchMock,
  allMatchesMock,
  matchesInProgressMock,
  matchMapMock,
  matchMock
} from '../../../mocks/match-model-mock';

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
      const matches = await sut.findAll({ inProgress: 'true'});
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
  describe('add method', () => {
    it('Should call Match.create with correct values', async () => {
      const sut = new MatchRepository();
      const createSpy = jest.spyOn(Match, 'create');
      await sut.add(addMatchMock);
      expect(createSpy).toHaveBeenCalledWith(matchMapMock);
    });

    it('Should return the match created on success', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'create')
        .mockResolvedValueOnce(matchMock);
      const match = await sut.add(addMatchMock);
      expect(match).toEqual(matchMock);
    });
  });
  describe('update method', () => {
    it('Should call Match.update with correct values', async () => {
      const sut = new MatchRepository();
      const createSpy = jest.spyOn(Match, 'update');
      await sut.update({
        id: '1',
        homeTeamGoals: '1',
        awayTeamGoals: '1',
      });
      expect(createSpy).toHaveBeenCalledWith({
        homeTeamGoals: 1,
        awayTeamGoals: 1
      }, {
        where: { id: 1 }
      });
    });

    it('Should return the number of rows affected on success', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'update')
        .mockResolvedValueOnce([1])
      const affectedRows = await sut.update({
        id: '1',
        homeTeamGoals: '1',
        awayTeamGoals: '1',
      });
      expect(affectedRows).toBe(1);
    });
  });
  describe('finish method', () => {
    it('Should call Match.update with correct value', async () => {
      const sut = new MatchRepository();
      const createSpy = jest.spyOn(Match, 'update');
      await sut.finish('1');
      expect(createSpy).toHaveBeenCalledWith({
        inProgress: false,
      }, {
        where: { id: 1 }
      });
    });

    it('Should return the number of rows affected on success', async () => {
      const sut = new MatchRepository();
      jest.spyOn(Match, 'update')
        .mockResolvedValueOnce([1])
      const affectedRows = await sut.finish('valid_id');
      expect(affectedRows).toBe(1);
    });
  });  
  
});
