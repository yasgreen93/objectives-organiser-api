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

function getSessionUserId(req) {
  const userId = req.user ? req.user.dataValues.id : null;
  return process.env.NODE_ENV === 'test' ?
    process.env.USER_ID : userId;
}

router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;
module.exports.ensureAuthenticated = ensureAuthenticated;
module.exports.getSessionUserId = getSessionUserId;
