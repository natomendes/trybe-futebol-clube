import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Team from '../database/models/Team';

import { Response } from 'superagent';
import { getTeamsMock } from '../../tests/mocks/team-model-mock'
import DbFindTeams from '../data/usecases/teams/db-find-teams'
chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('GetTeamsController', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if FindTeams throws', async () => {
    sinon.stub(DbFindTeams.prototype, 'find').throws();
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return an empty array if no teams are found', async () => {
    sinon.stub(Team, "findAll").resolves([]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal([]);
  });
  
  it('Should return all teams on success', async () => {
    sinon.stub(Team, "findAll").resolves(getTeamsMock as Team[]);
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(getTeamsMock);
  });
});

