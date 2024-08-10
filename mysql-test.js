var mysql = require('mysql');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'xyz@123',
    database: 'nodejs',
    port: '3306'
});

// connection.connect(function(err) {
//     if (err) {
//       return console.error('error: ' + err.message);
//     }
  
//     console.log('Connected to the MySQL server.');
//   });
 

connection.connect()


connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
      if (error) throw error;
    console.log('The solution is: ', results[0].solution);
});

connection.query('SELECT * from customer', function (error, results, fields) {
  if (error) throw error;
  for (var i = 0; i < results.length; i++) {
  	console.log('Name is: ', results[i].name);
  }
  
});

connection.end();