import User from '../../../../src/database/models/User'
import UserRepository from '../../../../src/infra/db/user-repository/user'

const makeSut = (): UserRepository => {
 return new UserRepository();
}

describe('UserRepository', () => {
  it('Should return undefined if no user is found', async () => {
    const sut = makeSut();
    jest.spyOn(User, 'findOne')
      .mockResolvedValueOnce(null)
    const user = await sut.find('valid_mail@mail.com')
    expect(user).toBeUndefined();
  })
})
