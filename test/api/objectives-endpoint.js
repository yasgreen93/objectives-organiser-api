const app = require('../../app');
const request = require('supertest');
const { resetObjectivesTable, exampleObjective } = require('../helpers');
const models = require('../../server/models/index');
const httpServer = require('http').createServer(app);

before(() => {
  httpServer.listen('3001');
});

beforeEach((done) => {
  resetObjectivesTable(done);
});

after(() => {
  httpServer.close();
});

describe('/objectives:', () => {
  describe('POST /objectives', () => {
    it('can receive POST to /objectives which creates an objective', (done) => {
      request(app)
        .post('/objectives')
        .send(exampleObjective)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { res: response } = res;
          response.statusCode.should.equal(200);
          const responseJson = JSON.parse(response.text);
          const { id, title, type, totalPagesVideos, completed } = responseJson;
          id.should.equal(1);
          title.should.equal(exampleObjective.title);
          type.should.equal(exampleObjective.type);
          totalPagesVideos.should.equal(exampleObjective.totalPagesVideos);
          completed.should.equal(false);
          return done();
        });
    });
    it('should send 400 error if data is missing from request', (done) => {
      request(app)
        .post('/objectives')
        .send({ title: 'javascript book', totalPagesVideos: 321, timeAllocated: '1 hour per day' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { res: response } = res;
          response.statusCode.should.equal(400);
          return done();
        });
    });
  });

  describe('GET /objectives', () => {
    it('can receive a GET to /objectives and find all objectives', (done) => {
      models.Objective.findOrCreate({
        where: exampleObjective,
      })
        .then(() => {
          request(app)
            .get('/objectives')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              const { body: dataReceived } = res;
              res.statusCode.should.equal(200);
              dataReceived[0].id.should.equal(1);
              dataReceived[0].title.should.equal('test objective');
              dataReceived[0].type.should.equal('book');
              dataReceived[0].totalPagesVideos.should.equal(123);
              dataReceived[0].timeAllocated.should.equal('1 hour per day');
              dataReceived[0].completed.should.equal(false);
              dataReceived[0].should.have.keys('dateCreated', 'createdAt', 'updatedAt');
              return done();
            });
        })
        .catch(error => error);
    });

    it('sends back empty array if there are no objectives', (done) => {
      request(app)
        .get('/objectives')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { body: dataReceived } = res;
          res.statusCode.should.equal(200);
          dataReceived.should.be.empty();
          return done();
        });
    });
  });
});
