const roles = {
    admin: ['admin', 'user'],
    user: ['user'],
};

const requireRole = (role) => {
    return (req, res, next) => {
        console.log(roles[req.user.role]);
        if (req.user && roles[req.user.role]?.includes(role)) {
            console.log(">>> User: ",req.user);
            
            next();
        } else {++
            
            res.status(401).send({ result: "error", msg: 'Authorization failed.' });
        }
    };
};


module.exports = requireRole;