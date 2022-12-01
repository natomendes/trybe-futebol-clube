import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../../src/app';
import Team from '../../src/database/models/Team';

import { Response } from 'superagent';
import { teamMock } from '../../tests/mocks/team-model-mock'
import DbFindTeam from '../../src/data/usecases/teams/db-find-team'
chai.use(chaiHttp);

const { app } = new App();

const { expect } = chai;

describe('GetTeamController', () => {
  let chaiHttpResponse: Response;

  afterEach(()=>{
    sinon.restore();
  });
  
  it('Should return server error if FindTeam throws', async () => {
    sinon.stub(DbFindTeam.prototype, 'find').throws();
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/error')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return an empty array if no teams are found', async () => {
    sinon.stub(Team, "findOne").resolves(null);
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/no-team-id')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Team not found' });
  });
  
  it('Should return all teams on success', async () => {
    sinon.stub(Team, "findOne").resolves(teamMock as any);
    chaiHttpResponse = await chai
       .request(app)
       .get('/teams/1')
       .send();

    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal(teamMock);
  });
});

