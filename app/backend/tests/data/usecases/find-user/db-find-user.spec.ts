import { UserModel, FindUserRepository } from "../../../../src/data/usecases/find-user/db-find-user-protocols";
import UserModelMock from "../../../mocks/user-model-mock"
import DbFindUser from '../../../../src/data/usecases/find-user/db-find-user'

const makeFindUserRepository = (): FindUserRepository => {
  class FindUserRepositoryStub implements FindUserRepository {
    async find(email: string): Promise<UserModel | undefined> {
      return UserModelMock;
    }
  }
  return new FindUserRepositoryStub();
}

interface SutTypes {
  sut: DbFindUser
  findUserRepositoryStub: FindUserRepository
}

const makeSut = (): SutTypes => {
  const findUserRepositoryStub = makeFindUserRepository();
  const sut = new DbFindUser(findUserRepositoryStub);
  return {
    sut,
    findUserRepositoryStub
  }
}

describe('DbFindUser Usecase', () => {
  it('Should return undefined if no user is found with provided email', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    jest.spyOn(findUserRepositoryStub, 'find')
      .mockResolvedValue(undefined);
    const promise = sut.find('no_user@mail.com');
    expect(promise).resolves.toBeUndefined();
  });

  it('Should call FindUserRepository with correct email', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(findUserRepositoryStub, 'find')
    await sut.find('valid@mail.com');
    expect(findSpy).toHaveBeenCalledWith('valid@mail.com');
  });

  it('Should throw if FindUserRepository throws', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    jest.spyOn(findUserRepositoryStub, 'find')
      .mockRejectedValue(new Error());
      const promise = sut.find('no_user@mail.com');
      expect(promise).rejects.toThrow();
    });

    it('Should return an user on success', async () => {
      const { sut } = makeSut();
      const user = await sut.find('valid@mail.com');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('password');
      });
})
