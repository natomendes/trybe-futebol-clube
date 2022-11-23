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
  it('Should undefined if no user is found with provided email', async () => {
    const { sut, findUserRepositoryStub } = makeSut();
    jest.spyOn(findUserRepositoryStub, 'find')
      .mockResolvedValue(undefined);
    const user = await sut.find('no_user@mail.com');
    expect(user).toBeUndefined();
  })
})
