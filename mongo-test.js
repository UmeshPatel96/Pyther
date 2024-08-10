const { MongoClient } = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'nodejs';

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('customers').find().toArray();

  // the following code examples can be pasted here...

  return collection;
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());