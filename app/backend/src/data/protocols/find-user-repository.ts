import UserModel from '../../domain/models/user';

export default interface FindUserRepository {
  find(email: string): Promise<UserModel>
}
