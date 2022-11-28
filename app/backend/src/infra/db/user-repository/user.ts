import { User, UserModel, FindUserRepository } from './user-repository-protocol';

export default class UserRepository implements FindUserRepository {
  constructor(private model = User) {}
  async find(emailArg: string): Promise<UserModel | undefined> {
    const user = await this.model.findOne({ where: { email: emailArg } });

    return user || undefined;
  }
}
