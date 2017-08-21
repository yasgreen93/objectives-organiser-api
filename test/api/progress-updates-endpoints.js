const app = require('../../app');
const request = require('supertest');
const {
  createNewObjective,
  createNewProgressUpdate,
} = require('../../server/models/helpers');
const {
  testUserId,
  resetObjectivesTable,
  exampleObjectiveBook,
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
      createNewObjective(testUserId, exampleObjectiveBook)
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
        }).catch(error => done(error));
    });
    it('should send 400 error if data is missing from request', (done) => {
      createNewObjective(testUserId, exampleObjectiveBook)
        .then(() => {
          request(app)
            .post('/objectives/1/progress-updates')
            .send({ pageVideoNumReached: 2, learningSummary: 'learning...' })
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(400);
              const firstError = res.body[0];
              const secondError = res.body[1];
              res.body.length.should.equal(2);
              firstError.msg.should.equal('objectiveId is required');
              secondError.msg.should.equal('objectiveId needs to be a number');
              return done();
            });
        }).catch(error => done(error));
    });
    it('should send 400 error if objectiveId send in request body does not match the id sent as params', (done) => {
      createNewObjective(testUserId, exampleObjectiveBook)
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
              response.text.should.equal('The objectiveId (2) and the id provided in the request (1) do not match');
              return done();
            });
        }).catch(error => done(error));
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
            }).catch(error => done(error));
        }).catch(error => done(error));
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
        }).catch(error => done(error));
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
        }).catch(error => done(error));
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
        }).catch(error => done(error));
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

  describe('PATCH /progress-updates/:id', () => {
    it('can receive a PATCH to /progress-updates/:id to edit an objective', (done) => {
      createNewObjective(testUserId, exampleObjectiveBook)
        .then(() => {
          createNewProgressUpdate(testUserId, exampleProgressUpdate)
            .then(() => {
              request(app)
                .patch('/progress-updates/1')
                .send({ pageVideoNumReached: 222 })
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  res.statusCode.should.equal(200);
                  const progressUpdate = res.body;
                  progressUpdate.pageVideoNumReached.should.equal(222);
                  progressUpdate.objectiveId.should.equal(exampleProgressUpdate.objectiveId);
                  progressUpdate.learningSummary.should.equal(exampleProgressUpdate.learningSummary);
                  return done();
                });
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
    it('should send 400 error if data sent in request is not valid', (done) => {
      createNewObjective(testUserId, exampleObjectiveBook)
        .then(() => {
          createNewProgressUpdate(testUserId, exampleProgressUpdate)
            .then(() => {
              request(app)
                .patch('/progress-updates/1')
                .send({ learningSummary: 123 })
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  res.statusCode.should.equal(400);
                  const error = res.body[0];
                  res.body.length.should.equal(1);
                  error.msg.should.equal('learningSummary needs to be a string');
                  return done();
                });
            }).catch(error => done(error));
        }).catch(error => done(error));
    });
    it('should send a 404 if the progress update does not exist', (done) => {
      request(app)
        .patch('/progress-updates/1')
        .send({ title: '123' })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(404);
          res.text.should.equal('ERROR 404: A progress update with the ID of 1 does not exist');
          return done();
        });
    });
    it('should send a 400 error if a user tries to update the objectiveID', (done) => {
      request(app)
        .patch('/progress-updates/1')
        .send({ objectiveId: 2 })
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.statusCode.should.equal(400);
          res.text.should.equal('The objectiveId cannot be updated once added');
          return done();
        });
    });
  });

  describe('DELETE /progress-updates/:id', () => {
    it('can receive a DELETE request to /progress-updates/:id to delete a progress update', (done) => {
      addThreeProgressUpdatesToDatabase()
        .then(() => {
          request(app)
            .delete('/progress-updates/1')
            .end((err, res) => {
              if (err) {
                return done(err);
              }
              res.statusCode.should.equal(200);
              res.text.should.equal('Progress update ID: 1 has been deleted successfully.');
              return done();
            });
        }).catch(error => done(error));
    });
    it('should return a 404 if there is no data by the ID provided', (done) => {
      request(app)
        .delete('/progress-updates/3')
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          res.error.status.should.equal(404);
          res.error.text.should.equal('ERROR 404: A progress update with the ID: 3 has not been found');
          return done();
        });
    });
  });
});
