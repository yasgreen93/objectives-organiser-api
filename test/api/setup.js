var app = require("../../app");
var request = require('supertest');

var BASE_URL = "http://localhost:3000";

describe('server test setup', () => {
  it('GET / should return "Objective Organiser"', (done) => {
    const responseHTML = '<!DOCTYPE html>\n<html>\n  <head>\n    <meta charset="utf-8">\n    <title>ObjectiveOrganiser</title>\n  </head>\n  <body>\n    Objective Organiser\n  </body>\n</html>\n';
    request(app)
      .get('/')
      .expect(200, responseHTML)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
  it('GET /wronguri should return 404', (done) => {
    request(app)
      .get('/wronguri')
      .expect(404)
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        done();
      });
  });
});
