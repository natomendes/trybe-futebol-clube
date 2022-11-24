import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import MissingParamError, { InvalidParamError, ServerError } from '../presentation/errors';
import EmailValidatorAdapter from '../utils/email-validator-adapter';
import DbFindUser from '../data/usecases/find-user/db-find-user';
import BcryptAdapter from '../infra/criptography/bcrypt-adapter';
import TokenGeneratorAdapter from '../utils/token-generator-adapter'


chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

// const makeEmailValidator = (): EmailValidator => {
//   class EmailValidatorStub implements EmailValidator {
//     isValid(email: string): boolean {
//       return true;
//     }
//   }
//   return new EmailValidatorStub();
// }

// const makeFindUser = (): FindUser => {
//   class FindUserStub implements FindUser {
//     async find(email: string): Promise<UserModel> {
//       return await new Promise(resolves => {
//         resolves({
//         id: 1,
//         username: 'username',
//         email: 'usermail@mail.com',
//         role: 'admin',
//         password: 'hashed_password'
//         });
//       });
//     }
//   }

//   return new FindUserStub();
// }

// const makeTokenGenerator = (): TokenGenerator => {
//   class TokenGeneratorStub implements TokenGenerator {
//     generate(email: string): string {
//       return 'valid_token'
//     }
//   }

//   return new TokenGeneratorStub();
// }

// const makeEncrypterStub = (): Encrypter => {
//   class EncrypterStub implements Encrypter {
//     async validate(password: string, hash: string): Promise<boolean> {
//       return await new Promise(resolve => {
//         resolve(true);
//       });
//     }
//   }
//   return new EncrypterStub();
// }

// interface SutTypes {
//   sut: SignInController,
//   emailValidatorStub: EmailValidator,
//   findUserStub: FindUser,
//   tokenGeneratorStub: TokenGenerator,
//   encrypterStub: Encrypter
// }

// const makeSut = (): SutTypes => {
//   const encrypterStub = makeEncrypterStub();
//   const tokenGeneratorStub = makeTokenGenerator();
//   const findUserStub = makeFindUser();
//   const emailValidatorStub = makeEmailValidator();  
//   const sut = new SignInController(
//     emailValidatorStub,
//     findUserStub,
//     tokenGeneratorStub,
//     encrypterStub
//   );
//   return {
//     sut,
//     emailValidatorStub,
//     findUserStub,
//     tokenGeneratorStub,
//     encrypterStub
//   }
// }

describe('Seu teste', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(User, "findOne")
      .resolves({
        id: 1,
        username: 'any_name',
        role: 'any_roll',
        email: 'valid_email@mail.com',
      } as User);
  });

  afterEach(()=>{
    (User.findOne as sinon.SinonStub).restore();
    sinon.restore();
  });
  
  it('Should return 400 and and error if no email is provided', async () => {

    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        password: 'any_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new MissingParamError().message});
  });

  it('Should return 400 and and error if no password is provided', async () => {
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'any_email@mail.com',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new MissingParamError().message});
  });

  it('Should return 400 and and error if an invalid email is provided', async () => {
    sinon.stub(EmailValidatorAdapter.prototype, 'isValid').returns(false);
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'invalid_email@mail.com',
        password: 'any_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidParamError().message});
  });

  it('Should return 401 and an error if email provided has no match in the database', async () => {
    sinon.stub(DbFindUser.prototype, 'find')
      .resolves(undefined);
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'no_user@mail.com',
        password: 'any_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidParamError().message});
  });

  it('Should return 401 and an error if password provided is wrong', async () => {
    sinon.stub(BcryptAdapter.prototype, 'validate')
      .resolves(false);
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'valid_email@mail.com',
        password: 'wrong_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidParamError().message});
  });

  it('Should return an token on success', async () => {
    sinon.stub(BcryptAdapter.prototype, 'validate')
    .resolves(true);
    sinon.stub(TokenGeneratorAdapter.prototype, 'generate')
    .returns('valid_token');
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'valid_email@mail.com',
        password: 'valid_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ token: 'valid_token' });
  });

  it('Should return 500 and an error if something throws and exception', async () => {
    sinon.stub(BcryptAdapter.prototype, 'validate').throws()
    chaiHttpResponse = await chai
       .request(app)
       .post('/login')
       .send({
        email: 'valid_email@mail.com',
        password: 'valid_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new ServerError().message });
  });
});
