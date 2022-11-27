import { UserModel } from '../../domain/models';

export interface FindUserRepository {
  find(email: string): Promise<UserModel | undefined>
}
