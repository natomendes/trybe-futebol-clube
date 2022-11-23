// import * as sinon from 'sinon';
// import * as chai from 'chai';
// // @ts-ignore
// import chaiHttp = require('chai-http');

// import App from '../app';
// import User from '../database/models/User';

// import { Response } from 'superagent';

// chai.use(chaiHttp);

// const { app } = new App();

// const { expect } = chai;

// describe('Seu teste', () => {
//   /**
//    * Exemplo do uso de stubs com tipos
//    */

//   let chaiHttpResponse: Response;

//   before(async () => {
//     sinon
//       .stub(UserMySqlRepository, "find")
//       .resolves({
//         id: 1,
//         username: 'any_name',
//         role: 'any_roll',
//         email: 'valid_email@mail.com',
//       } as UserModel);
//   });

//   after(()=>{
//     (UserMySqlRepository.find as sinon.SinonStub).restore();
//   })

//   it('Should return 400 if no email is provided', async () => {
//     chaiHttpResponse = await chai
//        .request(app)
//        .post('/login')
//        .send({
//         password: 'any_password',
//       })

//     expect(chaiHttpResponse.status).to.be.equal(400);
//   });
// });
