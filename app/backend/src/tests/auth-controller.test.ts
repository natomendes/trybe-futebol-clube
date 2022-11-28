import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import User from '../database/models/User';

import { Response } from 'superagent';
import { InvalidParamError, InvalidTokenError, MissingTokenError, ServerError } from '../presentation/errors';
import DbFindUser from '../data/usecases/find-user/db-find-user';
import JwtAdapter from '../utils/jwt-adapter';
import { TokenExpiredError } from 'jsonwebtoken';


chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('AuthenticationController', () => {
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
  
  it('Should return bad request if no token is provided', async () => {

    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new MissingTokenError().message});
  });

  it('Should return not found if no user is found in the database', async () => {
    sinon.stub(JwtAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbFindUser.prototype, 'find').resolves(undefined);
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', 'valid_token')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidParamError('User not found').message});
  });

  it('Should return unauthorized if token is invalid', async () => {
    sinon.stub(JwtAdapter.prototype, 'validate').throws(new TokenExpiredError('InvalidToken', new Date()));
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', 'invalid_token')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new InvalidTokenError().message });
  });

  it('Should return server error if FindUser throws', async () => {
    sinon.stub(DbFindUser.prototype, 'find').throws();
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', 'invalid_token')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: new ServerError().message });
  });

  it('Should return user role on success', async () => {
    sinon.stub(JwtAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
       .request(app)
       .get('/login/validate')
       .set('authorization', 'valid_token')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ role: 'any_roll' });
  });
});
