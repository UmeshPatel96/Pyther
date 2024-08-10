var mysql = require('mysql');
var pool  = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'xyz@123',
    database: 'nodejs',
    port: '3306'
});
 
var service = {};

service.getCustomers = function() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * from customer', function (error, results, fields) {
         if (error) {
           resolve([]);
           throw error;
         }else{
           resolve(results);
         }
       });
   })
}

service.getCustomerscallback = function(callback){
	pool.query('SELECT * from customer', function (error, results, fields) {
  	if (error) {
  		callback([]);
  		throw error;
  	}else{
  		callback(results);
  	}
	});
}


module.exports=service;