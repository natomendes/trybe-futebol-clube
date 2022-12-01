import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../src/app';
import Match from '../../src/database/models/Match';
import { Response } from 'superagent';
import { matchMock, validBodyRequest } from '../mocks/match-model-mock'
import DbAddMatch from '../../src/data/usecases/matches/db-add-match'
import JWTAdapter from '../../src/utils/jwt-adapter';
import { teamMock, teamMock2 } from '../mocks/team-model-mock';
import Team from '../../src/database/models/Team';
import DbFindTeam from '../../src/data/usecases/teams/db-find-team';
import { TokenExpiredError } from 'jsonwebtoken';
chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('AddMatchController', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon.stub(Team, 'findOne')
      .onFirstCall()
      .resolves(teamMock as Team)
      .onSecondCall()
      .resolves(teamMock2 as Team);
    sinon.stub(Match, 'create')
      .resolves(matchMock as Match);
  })

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if JwtAdapter throws', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').throws();
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return bad request if no token is provided', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Token is required'});
  });
  
  it('Should return unauthorized if token is invalid', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate')
      .throws(new TokenExpiredError('Token Expired', new Date()));
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'invalid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(401);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Token must be a valid token' });
  });
  
  it('Should return server error if DbFindTeam throws', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbFindTeam.prototype, 'find').throws();
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return server error if DbAddMatch throws', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbAddMatch.prototype, 'add').throws();
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return server error if DbAddMatch throws', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbAddMatch.prototype, 'add').throws();
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return bad request if homeTeam param is not provided', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        awayTeam: '8',
        homeTeamGoals: '2',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return bad request if awayTeam param is not provided', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: '16',
        homeTeamGoals: '2',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return bad request if homeTeamGoals param is not provided', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: '16',
        awayTeam: '8',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return bad request if awayTeamGoals param is not provided', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: '16',
        awayTeam: '8',
        homeTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return unprocessable entity if homeTeam is equal to awayTeam', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: '16',
        awayTeam: '16',
        homeTeamGoals: '2',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(422);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'It is not possible to create a match with two equal teams'});
  });
  
  it('Should return not found if homeTeam provided has no match in the database', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbFindTeam.prototype, 'find')
      .onFirstCall().resolves(undefined)
      .onSecondCall().resolves(teamMock2);
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: 'no-team-id',
        awayTeam: '8',
        homeTeamGoals: '2',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'There is no team with such id!'});
  });
  
  it('Should return not found if awayTeam provided has no match in the database', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    sinon.stub(DbFindTeam.prototype, 'find')
      .onFirstCall().resolves(teamMock2)
      .onSecondCall().resolves(undefined);
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send({
        homeTeam: '16',
        awayTeam: '8',
        homeTeamGoals: '2',
        awayTeamGoals: '2',
      });
    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'There is no team with such id!'});
  });
  
  it('Should return the match created on success', async () => {
    sinon.stub(JWTAdapter.prototype, 'validate').returns({ email: 'valid_mail@mail.com'});
    chaiHttpResponse = await chai
      .request(app)
      .post('/matches')
      .set('authorization', 'valid_token')
      .send(validBodyRequest);
    expect(chaiHttpResponse.status).to.be.equal(201);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(matchMock);
  });
});

