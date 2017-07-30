const app = require('../../app');
const request = require('supertest');

describe('------ SETUP: ------', () => {
  it('GET / should return "Objective Organiser"', (done) => {
    const responseHTML = '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>ObjectiveOrganiser</title>\n  </head>\n  <body>\n    Objective Organiser\n  </body>\n</html>\n';
    request(app)
      .get('/')
      .expect(200, responseHTML)
      .end((err) => {
        if (err) {
          return done(err);
        }
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
