// =================================================================
// get the packages we need ========================================
// =================================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Customer = require('../schema/customer-model');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

// Connect to MongoDB
mongoose.connect('mongodb://localhost/yourDatabaseName', { useNewUrlParser: true, useUnifiedTopology: true });

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
app.get('/', function (req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

// ---------------------------------------------------------
// authentication route
// ---------------------------------------------------------
apiRoutes.post('/authenticate', async function (req, res) {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Customer.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Authentication failed. User not found.' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        }

        // Create payload
        const payload = { admin: user.email };

        // Generate token
        const token = jwt.sign(payload, app.get('superSecret'), {
            expiresIn: 86400 // Expires in 24 hours
        });

        // Respond with token
        res.json({
            success: true,
            message: 'Enjoy your token!',
            token
        });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Authentication failed. An error occurred.', error: error.message });
    }
});

// ---------------------------------------------------------
// route middleware to authenticate and check token
// ---------------------------------------------------------
apiRoutes.use(function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function (err, decoded) {
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
apiRoutes.get('/', function (req, res) {
    res.json({ message: 'Welcome to the JSON Web Token API!' });
});

// Fetch users from the Customer schema
apiRoutes.get('/users', async function (req, res) {
    try {
        const users = await Customer.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch users.', error: error.message });
    }
});

apiRoutes.get('/check', function (req, res) {
    res.json(req.decoded);
});

app.use('/api', apiRoutes);

app.listen(port);
console.log('Magic happens at http://localhost:' + port);
