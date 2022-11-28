import { FindUser, UserModel, FindUserRepository } from './db-find-user-protocols';

export default class DbFindUser implements FindUser {
  constructor(
    private readonly findUserRepository: FindUserRepository,
  ) {}

  async find(email: string): Promise<UserModel | undefined> {
    return this.findUserRepository.find(email);
  }
}
