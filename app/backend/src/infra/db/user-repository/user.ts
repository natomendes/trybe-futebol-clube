import { UserModel } from '../../../domain/models/user';
import User from '../../../database/models/User';
import { FindUserRepository } from '../../../data/protocols/find-user-repository';

export default class UserRepository implements FindUserRepository {
  private model = User;
  async find(emailArg: string): Promise<UserModel | undefined> {
    const user = await this.model.findOne({ where: { email: emailArg } });

    return user || undefined;
  }
}
