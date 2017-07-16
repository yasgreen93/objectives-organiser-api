var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Objective organiser' });
});

module.exports = router;
