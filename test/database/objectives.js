const should = require('should'); // eslint-disable-line no-unused-vars
const models = require('../../server/models/index');
const { resetObjectivesTable, addObjectiveToDatabase } = require('../helpers');

beforeEach((done) => {
  resetObjectivesTable(done);
});

describe('Objectives database', () => {
  describe('Adding an objective', () => {
    it('should add a new objective to the database', (done) => {
      addObjectiveToDatabase()
        .then(() => {
          models.Objective.findAll().then((objectives) => {
            objectives.length.should.equal(1);
            done();
          });
        })
        .catch(error => done(error));
    });
  });

  describe('Updating an objective', () => {
    it('should update an objective with a specific ID', (done) => {
      // Adding objective to DB
      addObjectiveToDatabase()
        .then(() => {
          // Then updating that objective with the ID of 1
          models.Objective.update({
            title: 'editing title',
          }, {
            where: { id: 1 },
          })
            .then(() => {
              // Then finding the objective and checking it has changed.
              models.Objective.findAll()
                .then((objectives) => {
                  objectives[0].dataValues.title.should.equal('editing title');
                  return done();
                })
                .catch(error => done(error));
            })
            .catch(error => done(error));
        })
        .catch(error => done(error));
    });
  });
});
