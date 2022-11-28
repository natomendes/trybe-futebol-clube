import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import App from '../app';
import Match from '../database/models/Match';
import { Response } from 'superagent';

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
      .patch('/matches/1/finish')
      .set('authorization', 'valid_token')
      .send();
    expect(chaiHttpResponse.status).to.be.equal(500);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Internal server error'});
  });
  
  it('Should return not found if no match is found with id provided', async () => {
    sinon.stub(Match, 'update').resolves([0]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/invalid-id/finish')
      .set('authorization', 'valid_token')
      .send();
    expect(chaiHttpResponse.status).to.be.equal(404);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Match not found'});
  });
  
  it('Should return 200 and "Match updated with success" on success', async () => {
    sinon.stub(Match, 'update').resolves([1]);
    chaiHttpResponse = await chai
      .request(app)
      .patch('/matches/valid-id/finish')
      .set('authorization', 'valid_token')
      .send();
    expect(chaiHttpResponse.status).to.be.equal(200);
    expect(chaiHttpResponse.body)
      .to.be.deep.equal({ message: 'Finished'});
  });
});

