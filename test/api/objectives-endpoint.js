const app = require('../../app');
const request = require('supertest');
const {
  resetObjectivesTable,
  addObjectiveToDatabase,
  addTwoObjectivesToDatabase,
  exampleObjectiveBook,
} = require('../helpers');
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

describe('------ ENDPOINTS: ------', () => {
  describe('POST /objectives', () => {
    it('can receive POST to /objectives which creates an objective', (done) => {
      request(app)
        .post('/objectives')
        .send(exampleObjectiveBook)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { res: response } = res;
          response.statusCode.should.equal(200);
          const responseJson = JSON.parse(response.text);
          const { id, title, type, totalPagesVideos, completed } = responseJson;
          id.should.equal(1);
          title.should.equal(exampleObjectiveBook.title);
          type.should.equal(exampleObjectiveBook.type);
          totalPagesVideos.should.equal(exampleObjectiveBook.totalPagesVideos);
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
      addObjectiveToDatabase('book')
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
              dataReceived[0].title.should.equal(exampleObjectiveBook.title);
              dataReceived[0].type.should.equal(exampleObjectiveBook.type);
              dataReceived[0].totalPagesVideos.should.equal(exampleObjectiveBook.totalPagesVideos);
              dataReceived[0].timeAllocated.should.equal(exampleObjectiveBook.timeAllocated);
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

  describe('GET /objectives/:id', () => {
    it('should retreive an objective with the ID provided if it exists', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          request(app)
            .get('/objectives/2')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              const { body: dataReceived } = res;
              res.statusCode.should.equal(200);
              dataReceived.id.should.equal(2);
              dataReceived.should.have.keys(
                'id',
                'dateCreated',
                'title',
                'type',
                'totalPagesVideos',
                'timeAllocated',
                'completed',
                'createdAt',
                'updatedAt' // eslint-disable-line comma-dangle
              );
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should returns a 404 if there is no data by the ID provided', (done) => {
      request(app)
        .get('/objectives/3')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.error.status.should.equal(404);
          res.error.text.should.equal('An objective with the ID: 3 has not been found');
          return done();
        });
    });
  });

  describe('PATCH /objectives', () => {
    it('can receive a PATCH to /objectives to edit an objective', (done) => {
      addObjectiveToDatabase('book')
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
              objective.type.should.equal(exampleObjectiveBook.type);
              objective.totalPagesVideos.should.equal(exampleObjectiveBook.totalPagesVideos);
              objective.timeAllocated.should.equal(exampleObjectiveBook.timeAllocated);
              return done();
            });
        });
    });
    it('should send 400 error if data sent in request is not valid', (done) => {
      addObjectiveToDatabase('book')
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
