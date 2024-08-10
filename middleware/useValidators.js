const { body, validationResult } = require('express-validator');
const Customer = require('../schema/customer-model'); 


// Custom validator function
const isStrongPassword = value => {
  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumbers = /\d/.test(value);
  const hasNonAlphas = /\W/.test(value);
  return hasUpperCase && hasLowerCase && hasNumbers && hasNonAlphas;
};

const checkUniqueField = async (value, { req }) => {
    const user = await Customer.findOne({ email: value });
    if (user) {
      throw new Error('Email is already in use');
    }
    return true;
  };

const addValidator = [
  body('name')
    .isLength({ min: 3 })
    .withMessage('name must be at least 3 characters long'),
  
  body('email')
    .isEmail()
    .withMessage('Email is not valid')
    .normalizeEmail()
    .custom(checkUniqueField),
  
  // Custom validator
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
    // .custom(value => {
    //   if (!isStrongPassword(value)) {
    //     throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    //   }
    //   return true;
    // })
];

const updateValidator = [
    body('name')
      .isLength({ min: 3 })
      .withMessage('name must be at least 3 characters long'),
    
    body('email')
      .isEmail()
      .withMessage('Email is not valid')
      .normalizeEmail(),
    //   .custom(checkUniqueField),

  ];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  };

module.exports = {
    addValidator,
    validate,
    updateValidator
}