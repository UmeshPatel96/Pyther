const mongoose = require('mongoose');

const studentschema =  new mongoose.Schema({
	    name: {
	        type: String,
	      },
	      roll_no:{
	        type: Number,
	      },
	      maths:{
	        type: Number,
	      },
	      science:{
	        type: Number,
	      },
          english:{
	        type: Number,
	      },
          total:{
	        type: Number,
	      },
          percentage:{
	        type: Number,
	      },
        //   rank:{
	    //     type: Number,
	    //   }
},{
	    timestamps: false,
});

module.exports= mongoose.model('students', studentschema);
