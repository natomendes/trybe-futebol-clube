import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../src/app';
import Team from '../../src/database/models/Team';

import { Response } from 'superagent';
import DbGetTeamsStats from '../../src/data/usecases/teams/db-get-teams-stats';
import { awayStatsMock ,homeStatsMock, homeTeamDbResult, awayTeamDbResult, tiedHomeDbResult, tiedHomedStatsMock } from '../mocks/leaderboard-model-mock';
chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('HomeAwayStatsController', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if GetTeamsStats throws', async () => {
    sinon.stub(DbGetTeamsStats.prototype, 'handle').throws();
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/home')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return homeTeams stats on success', async () => {
    sinon.stub(Team, "findAll").resolves(homeTeamDbResult as any[]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/home')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(homeStatsMock);
  });
  
  it('Should return homeTeams stats tied on success', async () => {
    sinon.stub(Team, "findAll").resolves(tiedHomeDbResult as any[]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/home')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(tiedHomedStatsMock);
  });
  
  it('Should return awayTeams stats on success', async () => {
    sinon.stub(Team, "findAll").resolves(awayTeamDbResult as any[]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/leaderboard/away')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(awayStatsMock);
  });
});

