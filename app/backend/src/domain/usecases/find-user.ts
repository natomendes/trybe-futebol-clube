import UserModel from '../models/user';

export interface FindUser {
  find(email: string): Promise<UserModel | undefined>
}
