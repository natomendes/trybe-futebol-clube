import UserModel from '../models/user';

export default interface FindUser {
  find(email: string): Promise<UserModel | undefined>
}
