import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import SignInController from '../presentation/controllers/signin-controller';
import { response } from 'express';
import MissingParamError from '../presentation/errors';

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

const makeSut = (): SignInController => {
  return new SignInController();
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
    app.post('/login-no-email', async (_req, res) => {
      const sut = makeSut();
      const httpRequest = {
        body: {
          password: 'any_password',
        }
      };
      const response = await sut.handle(httpRequest);
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
    app.post('/login-no-email', async (_req, res) => {
      const sut = makeSut();
      const httpRequest = {
        body: {
          email: 'any_email@mail.com',
        }
      };
      const response = await sut.handle(httpRequest);
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
});
