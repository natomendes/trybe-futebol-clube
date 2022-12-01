import * as sinon from 'sinon';
import * as chai from 'chai';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../src/app';
import User from '../../src/database/models/User';

import { Response } from 'superagent';
import { MissingParamError, InvalidParamError, ServerError } from '../../src/presentation/errors';
import EmailValidatorAdapter from '../../src/utils/email-validator-adapter';
import BcryptAdapter from '../../src/infra/criptography/bcrypt-adapter';
import JWTAdapter from '../../src/utils/jwt-adapter'
import UserModelMock from '../mocks/user-model-mock';


chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('SignInController', () => {
  let chaiHttpResponse: Response;
  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return bad request if no email is provided', async () => {
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

  it('Should return bad request if no password is provided', async () => {
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

  it('Should return bad request if an invalid email is provided', async () => {
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

  it('Should return unauthorized if email provided has no match in the database', async () => {
    sinon.stub(User, 'findOne').resolves(undefined);
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
    sinon.stub(User, 'findOne').resolves(UserModelMock as User);
    sinon.stub(bcrypt, 'compare').resolves(false);
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
    sinon.stub(User, 'findOne').resolves(UserModelMock as User);
    sinon.stub(BcryptAdapter.prototype, 'validate').resolves(true);
    const jwtMock = sinon.mock(jwt).expects('sign').returns('valid_token');
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
    sinon.stub(EmailValidatorAdapter.prototype, 'isValid').throws()
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
