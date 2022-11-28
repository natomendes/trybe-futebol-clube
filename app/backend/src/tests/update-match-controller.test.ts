import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Match from '../database/models/Match';
import { Response } from 'superagent';
import { matchMock } from '../../tests/mocks/match-model-mock'

chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('GetTeamsController', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    // sinon.stub(Match, 'create')
    //   .resolves(matchMock as Match);
  })

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if UpdateMatchRepository throws', async () => {
    sinon.stub(Match, 'update').throws();
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .set('authorization', 'valid_token')
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      });
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return bad request if homeTeamGoals param is not provided', async () => {
    sinon.stub(Match, 'update').resolves([1]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .set('authorization', 'valid_token')
      .send({
        awayTeamGoals: 1,
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return bad request if awayTeamGoals param is not provided', async () => {
    sinon.stub(Match, 'update').resolves([1]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/1')
      .set('authorization', 'valid_token')
      .send({
        homeTeamGoals: 1,
      });
    expect(chaiHttpResponse.status).to.be.equal(400);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Invalid request body'});
  });
  
  it('Should return not found if no match is found with id provided', async () => {
    sinon.stub(Match, 'update').resolves([0]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/invalid-id')
      .set('authorization', 'valid_token')
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      });
    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Match not found'});
  });
  
  it('Should return 200 and "Match updated with success" on success', async () => {
    sinon.stub(Match, 'update').resolves([1]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/valid-id')
      .set('authorization', 'valid_token')
      .send({
        homeTeamGoals: 1,
        awayTeamGoals: 1,
      });
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Match updated with success'});
  });
});

