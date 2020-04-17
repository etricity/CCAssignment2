var express = require('express');
var router = express.Router();

//Login Page
router.get('/', function(req, res, next) {
  res.render('login', {
    title: 'S.P.A.D.E'
  });
});


module.exports = router;
