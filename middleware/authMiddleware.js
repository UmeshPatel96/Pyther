const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).send({ result: "error    ", msg: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret_key');
        req.user = decoded; 
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ result: "error", msg: 'Token expired.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ result: "error", msg: 'Invalid token.' });
        } else {
            return res.status(401).send({ result: "error", msg: 'Authorization failed.' });
        }
    }
}

module.exports = authMiddleware;
