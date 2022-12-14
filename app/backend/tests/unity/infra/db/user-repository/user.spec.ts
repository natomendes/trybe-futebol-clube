import User from '../../../../../src/database/models/User';
import UserRepository from '../../../../../src/infra/db/user-repository/user';
import UserModelMock from '../../../mocks/user-model-mock'

const makeSut = (): UserRepository => {
 return new UserRepository();
}

describe('UserRepository', () => {
  it('Should return undefined if no user is found', async () => {
    const sut = makeSut();
    jest.spyOn(User, 'findOne')
      .mockResolvedValueOnce(null);
    const user = await sut.find('valid_mail@mail.com');
    expect(user).toBeUndefined();
  });

  it('Should call model with correct email', async () => {
    const sut = makeSut();
    const findOneSpy = jest.spyOn(User, 'findOne')
    await sut.find('valid_mail@mail.com');
    expect(findOneSpy).toHaveBeenCalledWith({ where: { email: 'valid_mail@mail.com' } });
  });

  it('Should return an user on success', async () => {
    const sut = makeSut();
    jest.spyOn(User, 'findOne')
      .mockResolvedValueOnce(UserModelMock as User);
    const user = await sut.find('valid_mail@mail.com');
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('role');
    expect(user).toHaveProperty('password');
  });
});
