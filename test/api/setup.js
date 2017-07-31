const app = require('../../app');
const request = require('supertest');

describe('------ SETUP: ------', () => {
  it('GET / should return a 200 with HTML', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        res.statusCode.should.equal(200);
        res.type.should.equal('text/html');
        return done();
      });
  });
  it('GET /wronguri should return 404', (done) => {
    request(app)
      .get('/wronguri')
      .expect(404)
      .end((err) => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });
});
