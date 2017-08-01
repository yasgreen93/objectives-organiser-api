const app = require('../../app');
const request = require('supertest');
const {
  resetObjectivesTable,
  addObjectiveToDatabase,
  exampleProgressUpdate,
  addTwoObjectivesToDatabase,
  addThreeProgressUpdatesToDatabase,
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

describe('------ PROGRESS UPDATES ENDPOINTS: ------', () => {
  describe('POST /objectives/:id/progress-updates', () => {
    it('can receive POST /objectives/:id/progress-updates which creates a progress update', (done) => {
      addObjectiveToDatabase('book')
        .then(() => {
          request(app)
            .post('/objectives/1/progress-updates')
            .send(exampleProgressUpdate)
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              const dataAdded = res.body;
              dataAdded.should.have.keys(
                'dateCreated',
                'objectiveId',
                'pageVideoNumReached',
                'learningSummary',
                'updatedAt',
                'createdAt' // eslint-disable-line comma-dangle
              );
              dataAdded.objectiveId.should.equal(exampleProgressUpdate.objectiveId);
              dataAdded.pageVideoNumReached.should.equal(exampleProgressUpdate.pageVideoNumReached);
              dataAdded.learningSummary.should.equal(exampleProgressUpdate.learningSummary);
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should send 400 error if data is missing from request', (done) => {
      addObjectiveToDatabase('book')
        .then(() => {
          request(app)
            .post('/objectives/1/progress-updates')
            .send({ pageVideoNumReached: 2, learningSummary: 'learning...' })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              const { res: response } = res;
              response.statusCode.should.equal(400);
              response.text.should.equal('ERROR 400: "objectiveId" is missing or needs to be a number');
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should send 400 error if objectiveId send in request body does not match the id sent as params', (done) => {
      addObjectiveToDatabase('book')
        .then(() => {
          request(app)
            .post('/objectives/1/progress-updates')
            .send({ objectiveId: 2, pageVideoNumReached: 2, learningSummary: 'learning...' })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              const { res: response } = res;
              response.statusCode.should.equal(400);
              response.text.should.equal('ERROR 400: The objectiveId (2) and the id provided in the request (1) do not match');
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should send a 404 if the objectiveId does not exist in the database', (done) => {
      request(app)
        .post('/objectives/1/progress-updates')
        .send({ objectiveId: 1, pageVideoNumReached: 2, learningSummary: 'learning...' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { res: response } = res;
          response.statusCode.should.equal(404);
          response.text.should.equal('ERROR 404: The objective with an ID of 1 does not exist');
          return done();
        });
    });
  });

  describe('GET /objectives/:id/progress-updates', () => {
    it('should retreive all progress updates for the objective with the ID provided in the params', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          addThreeProgressUpdatesToDatabase()
            .then(() => {
              request(app)
                .get('/objectives/2/progress-updates')
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  res.statusCode.should.equal(200);
                  const { body: progressUpdates } = res;
                  progressUpdates.length.should.equal(2);
                  progressUpdates[0].id.should.equal(2);
                  progressUpdates[0].objectiveId.should.equal(2);
                  progressUpdates[1].id.should.equal(3);
                  progressUpdates[1].objectiveId.should.equal(2);
                  return done();
                });
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
    it('should should send a 200 with an empty array if no progress udpates for that objective exist', (done) => {
      addTwoObjectivesToDatabase()
        .then(() => {
          request(app)
            .get('/objectives/1/progress-updates')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              res.body.should.be.empty();
              return done();
            });
        })
        .catch(error => done(error));
    });
  });

  describe('GET /progress-updates/:id', () => {
    it('should retreive a single progress update with the ID provided in the params', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          request(app)
            .get('/progress-updates/2')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              res.body.id.should.equal(2);
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should should send a 200 with an empty array if no progress udpate with that ID exists', (done) => {
      request(app)
        .get('/objectives/1/progress-updates')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(200);
          res.body.should.be.empty();
          return done();
        });
    });
  });

  describe('GET /progress-updates', () => {
    it('should get all progress updates', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          request(app)
            .get('/progress-updates')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              res.body.length.should.equal(3);
              return done();
            });
        })
        .catch(error => done(error));
    });
    it('should return a 200 with an empty array if there are no progress updates', (done) => {
      request(app)
        .get('/progress-updates')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(200);
          res.body.should.be.empty();
          return done();
        });
    });
  });
});
