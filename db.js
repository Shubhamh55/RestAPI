const { MongoClient } = require('mongodb');
const uri = "mongodb://wanderer:Shubhamh55@ac-fixh0p5-shard-00-00.5ctubhf.mongodb.net:27017,ac-fixh0p5-shard-00-01.5ctubhf.mongodb.net:27017,ac-fixh0p5-shard-00-02.5ctubhf.mongodb.net:27017/?ssl=true&replicaSet=atlas-vabfrr-shard-0&authSource=admin&retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client
} catch (error) {
    console.error(error);
  }
}


module.exports = connect;