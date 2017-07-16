var should = require('should');
var app = require("../../app");
var request = require("supertest");

// define server base URL
var BASE_URL = "http://localhost:3000";

describe.only('Objective endpoints', () => {
  describe('create-objective endpoint', () => {
    const objective = {
      title: 'tester',
      type: 'book',
      totalPagesVideos: 123,
      timeAllocated: '1 hour per day'
    };
    it('can receive POST /create-objective', (done) => {
      request(app)
        .post('/create-objective')
        .send(objective)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          const { res: response } = res;
          response.statusCode.should.equal(200);
          const responseJson = JSON.parse(response.text);
          const { id, title, type, totalPagesVideos, completed } = responseJson;
          id.should.equal(1);
          title.should.equal(objective.title);
          type.should.equal(objective.type);
          totalPagesVideos.should.equal(objective.totalPagesVideos);
          completed.should.equal(false);
          done();
        });
    });
  });
});
