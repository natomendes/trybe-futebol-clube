import { StatsModel, TeamModel } from "../../../../src/domain/models";
import { homeStatsMock, teamHomeMatchesMock, teamAwayMatchesMock } from '../../../../src/tests/mocks'
import { GetTeamsMatchesRepository } from '../../../../src/data/protocols';
import DbGetTeamsStats from '../../../../src/data/usecases/teams/db-get-teams-stats';
import { TeamStats } from "../../../../src/domain/usecases";
import Team from "../../../../src/database/models/Team";

const makeGetTeamsMatchesRepositoryStub = (): GetTeamsMatchesRepository => {
  class GetTeamsMatchesRepositoryStub implements GetTeamsMatchesRepository {
    async findMatches(path: string): Promise<Team[]> {
      if (path === 'home') {
        return teamHomeMatchesMock as any;
      } else {
        return teamAwayMatchesMock as any;
      }
    }
  }

  return new GetTeamsMatchesRepositoryStub();
}

const makeTeamStatsStub = (): TeamStats => {
  class TeamStatsStub implements TeamStats {
    calculateHome(teamsData: TeamModel[]): StatsModel[] {
      return homeStatsMock;
    }
    calculateAway(teamsData: TeamModel[]): StatsModel[] {
      return homeStatsMock;
    }
  }
  return new TeamStatsStub();
}

interface SutTypes {
  sut: DbGetTeamsStats,
  getTeamsMatchesRepositoryStub: GetTeamsMatchesRepository
  teamStatsStub: TeamStats
}

const makeSut = (): SutTypes => {
  const teamStatsStub = makeTeamStatsStub();
  const getTeamsMatchesRepositoryStub = makeGetTeamsMatchesRepositoryStub();
  const sut = new DbGetTeamsStats(
    getTeamsMatchesRepositoryStub,
    teamStatsStub
  );
  return {
    sut,
    getTeamsMatchesRepositoryStub,
    teamStatsStub
  }
};

describe('DbGetTeamsStats', () => {
  it('Should throw if GetTeamsMatchesRepository throws', async () => {
    const { sut, getTeamsMatchesRepositoryStub } = makeSut();
    jest.spyOn(getTeamsMatchesRepositoryStub, 'findMatches')
      .mockRejectedValueOnce(new Error());
    const promise = sut.handle('home');
    await expect(promise).rejects.toThrow();
  });
  describe('Home Teams Stats', () => {
    it('Should throw if TeamStats throws', async () => {
      const { sut, teamStatsStub } = makeSut();
      jest.spyOn(teamStatsStub, 'calculateHome')
        .mockImplementationOnce(() => { throw new Error()});
      const promise = sut.handle('home');
      await expect(promise).rejects.toThrow();
    });
  
    it('Should call TeamStats with correct values', async () => {
      const { sut, teamStatsStub } = makeSut();
      const calculateHomeSpy = jest.spyOn(teamStatsStub, 'calculateHome');
      await sut.handle('home');
      expect(calculateHomeSpy).toHaveBeenCalledWith(teamHomeMatchesMock);
    });
  
    it('Should return home teams stats order by points on success', async () => {
      const { sut } = makeSut();
      const homeTeamsStats = await sut.handle('home');
      expect(homeTeamsStats).toEqual(homeStatsMock);
    });  
  });
  describe('Away Team Stats', () => {
    it('Should throw if TeamStats throws', async () => {
      const { sut, teamStatsStub } = makeSut();
      jest.spyOn(teamStatsStub, 'calculateAway')
        .mockImplementationOnce(() => { throw new Error()});
      const promise = sut.handle('away');
      await expect(promise).rejects.toThrow();
    });
  
    it('Should call TeamStats with correct values', async () => {
      const { sut, teamStatsStub } = makeSut();
      const calculateHomeSpy = jest.spyOn(teamStatsStub, 'calculateAway');
      await sut.handle('away');
      expect(calculateHomeSpy).toHaveBeenCalledWith(teamAwayMatchesMock);
    });
  });
  
});
