const app = require('../../app');
const request = require('supertest');
const { resetObjectivesTable, exampleObjective, addObjectiveToDatabase } = require('../helpers');
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

describe('/objectives', () => {
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
          response.text.should.equal('"type" is missing or needs to be a string');
          return done();
        });
    });
  });

  describe('GET /objectives', () => {
    it('can receive a GET to /objectives and find all objectives', (done) => {
      addObjectiveToDatabase()
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

  describe('PATCH /objectives', () => {
    it('can receive a PATCH to /objectives to edit an objective', (done) => {
      addObjectiveToDatabase()
        .then(() => {
          request(app)
            .patch('/objectives/1')
            .send({ title: 'editing test objective' })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              const objective = res.body;
              objective.title.should.equal('editing test objective');
              objective.type.should.equal(exampleObjective.type);
              objective.totalPagesVideos.should.equal(exampleObjective.totalPagesVideos);
              objective.timeAllocated.should.equal(exampleObjective.timeAllocated);
              return done();
            });
        });
    });
    it('should send 400 error if data sent in request is not valid', (done) => {
      addObjectiveToDatabase()
        .then(() => {
          request(app)
            .patch('/objectives/1')
            .send({ title: 123 })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              const { res: response } = res;
              response.statusCode.should.equal(400);
              response.text.should.equal('"title" needs to be in a string format');
              return done();
            });
        })
        .catch(error => done(error));
    });
  });
});
