const express = require('express');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).send('User not authenticated');
}

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
module.exports.ensureAuthenticated = ensureAuthenticated;
