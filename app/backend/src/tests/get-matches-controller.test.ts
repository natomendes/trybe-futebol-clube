import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Match from '../database/models/Match';

import { Response } from 'superagent';
import { allMatchesMock, matchesInProgressMock } from '../../tests/mocks/match-model-mock'
import DbFindMatches from '../data/usecases/find-matches/db-find-matches'
chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('GetTeamsController', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if FindMatches throws', async () => {
    sinon.stub(DbFindMatches.prototype, 'find').throws();
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return an empty array if no matches are found', async () => {
    sinon.stub(Match, "findAll").resolves([]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal([]);
  });
  
  it('Should return all matches on success', async () => {
    sinon.stub(Match, "findAll").resolves(allMatchesMock as any);
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(allMatchesMock);
  });
  
  it('Should return matches filtered if query inProgress is provided', async () => {
    sinon.stub(Match, "findAll").resolves(matchesInProgressMock as any);
    chaiHttpResponse = await chai
       .request(app)
       .get('/matches?inProgress=true')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(matchesInProgressMock);
  });
});

