import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import SignInController from '../presentation/controllers/signin-controller';
import MissingParamError, { InvalidParamError } from '../presentation/errors';
import EmailValidator from '../presentation/protocols/email-validator';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

interface SutTypes {
  sut: SignInController,
  emailValidatorStub: EmailValidator
}

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();  
  const sut = new SignInController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub,
  }
}

describe('Seu teste', () => {
  /**
   * Exemplo do uso de stubs com tipos
   */

  let chaiHttpResponse: Response;

  // before(async () => {
  //   sinon
  //     .stub(UserMySqlRepository, "find")
  //     .resolves({
  //       id: 1,
  //       username: 'any_name',
  //       role: 'any_roll',
  //       email: 'valid_email@mail.com',
  //     } as UserModel);
  // });

  // after(()=>{
  //   (UserMySqlRepository.find as sinon.SinonStub).restore();
  // })

  it('Should return 400 and and error if no email is provided', async () => {
    const { sut } = makeSut();
    app.post('/login-no-email', async (req, res) => {
      const response = await sut.handle(req);
      res.status(response.statusCode).json(response.body);
    })
    chaiHttpResponse = await chai
       .request(app)
       .post('/login-no-email')
       .send({
        password: 'any_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new MissingParamError().message});
  });

  it('Should return 400 and and error if no password is provided', async () => {
    const { sut } = makeSut();
    app.post('/login-no-email', async (req, res) => {
      const response = await sut.handle(req);
      res.status(response.statusCode).json(response.body);
    })
    chaiHttpResponse = await chai
       .request(app)
       .post('/login-no-email')
       .send({
        email: 'any_email@mail.com',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new MissingParamError().message});
  });

  it('Should return 400 and and error if an invalid email is provided', async () => {
    app.post('/login-invalid-email', async (req, res) => {
      const { sut, emailValidatorStub } = makeSut();
      sinon.stub(emailValidatorStub, 'isValid').returns(false);
      const response = await sut.handle(req);
      res.status(response.statusCode).json(response.body);
    })
    chaiHttpResponse = await chai
       .request(app)
       .post('/login-invalid-email')
       .send({
        email: 'invalid_email@mail.com',
        password: 'any_password',
      });

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidParamError().message});
  });
});
