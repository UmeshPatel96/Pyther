// =================================================================
// get the packages we need ========================================
// =================================================================
var express 	= require('express');
var app         = express();
var bodyParser  = require('body-parser');
var morgan      = require('morgan');

var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var users=[
	{id:1, name:"Vivek", email:"vivek@pyther.com", phone:"787878787878"},
	{id:2, name:"Deep", email:"deep@ibm.com", phone:"iioioio"},
	{id:3, name:"Deepa", email:"deep@ibm.com", phone:"iioioio"},
	{id:4, name:"Ajay", email:"deep@ibm.com", phone:"iioioio"},
];
// =================================================================
// configuration ===================================================
// =================================================================
var port = process.env.PORT || 3000; // used to create, sign, and verify tokens
app.set('superSecret', 'trainingIsGood'); // secret variable

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use morgan to log requests to the console
app.use(morgan('dev'));


// basic route (http://localhost:3000)
app.get('/', function(req, res) {
	res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router(); 
// http://localhost:3000/api/authenticate
apiRoutes.post('/authenticate', function(req, res) {
	//you need to authentcate from database
	if(req.body.username == req.body.password){
		var payload = {
			admin: req.body.username	
		}
		//generating token
		var token = jwt.sign(payload, app.get('superSecret'), {
			expiresIn: 86400 // expires in 24 hours
		});
		res.json({
			success: true,
			message: 'Enjoy your token!',
			token: token
		});
	}else{
		res.json({ success: false, message: 'Authentication failed. User not found.' });
	}
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function(req, res, next) {

	// check header or url parameters or post parameters for token
	var token = req.body.token || req.param('token') || req.headers['x-access-token'];
	// decode token
	if (token) {

		// verifies secret and checks exp
		jwt.verify(token, app.get('superSecret'), function(err, decoded) {			
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });		
			} else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;	
				next();
			}
		});

	} else {

		// if there is no token
		// return an error
		return res.status(403).send({ 
			success: false, 
			message: 'No token provided.'
		});
	}
});

// ---------------------------------------------------------
// authenticated routes
// ---------------------------------------------------------
apiRoutes.get('/', function(req, res) {
	res.json({ message: 'Welcome to the Json Web Token API !' });
});

apiRoutes.get('/users', function(req, res) {
	res.json(users);
});

apiRoutes.get('/check', function(req, res) {
	res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
