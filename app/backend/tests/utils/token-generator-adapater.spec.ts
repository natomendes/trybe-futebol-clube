import TokenGeneratorAdapter from '../../src/utils/jwt-adapter'
import { TokenExpiredError } from 'jsonwebtoken'
import * as jwt from 'jsonwebtoken'
// const jwtMock = jest.mock('jsonwebtoken', () => {
//   const originalModule = jest.requireActual('jsonwebtoken');

//   //Mock the default export and named export 'foo'
//   return {
//     __esModule: true,
//     ...originalModule,
//     sign: jest.fn(() => 'valid_token'),
//   };
// });

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'valid_token'),
  verify: jest.fn(() => ({ email: 'valid_mail@mail.com'})),
}))

describe('TokenGenerator Adapter', () => {
  it('Should return a valid token on generate', () => {
    const sut = new TokenGeneratorAdapter();
    const response = sut.generate('valid_email@mail.com');
    expect(response).toBe('valid_token');
  });

  it('Should return user email on success', () => {
    const sut = new TokenGeneratorAdapter();
    const response = sut.validate('token');
    expect(response).toEqual({ email: 'valid_mail@mail.com'});
  });
})
