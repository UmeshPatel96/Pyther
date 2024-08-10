const mongoose = require('mongoose');

// Define the schema
const customerSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	phone: {
		type: String,
	},
	address: {
		type: String,
	},
	password: {
		type: String,
		minlength: 8,
		// required: true,
	},role: {
		type: String,
		enum: ['user', 'admin'], 
		default: 'user' },
}, {
	timestamps: true,
});


	module.exports = mongoose.model('customers', customerSchema);
