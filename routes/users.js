var express = require('express');
const { login, verifyToken } = require('../service/login-mangoose');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/authenticate', async(req, res, next) => {
	const loginUser = await login(req.body.email, req.body.password)
	res.send(loginUser)
});

module.exports = router;
