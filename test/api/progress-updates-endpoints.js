const app = require('../../app');
const request = require('supertest');
const {
  resetObjectivesTable,
  addObjectiveToDatabase,
  exampleProgressUpdate,
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
              response.text.should.equal('"objectiveId" is missing or needs to be a number');
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
              response.text.should.equal('The objectiveId (2) and the id provided in the request (1) do not match');
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
          response.text.should.equal('The objective with an ID of 1 does not exist');
          return done();
        });
    });
  });
});
