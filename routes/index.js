var express = require('express');
var router = express.Router();
// var customerService = require('../service/customer-service');
// var customerMysql = require('../service/customer-mysql');
// var customermongo = require('../service/customer-mongo');
// const { routes } = require('../app');




router.get('/', (req, res, next)  => {
  //res.render('index', { title: 'Customer App', company:"IBM"});
  res.redirect("/login");
});

router.get('/login', (req, res, next) => {
  delete(req.session.user);
  //res.send(""); //data
  //res.send({result:'success', msg:""}); //data
  res.render('login', { title: 'Login'});
});


module.exports = router;