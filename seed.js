const csvtojson = require('csvtojson');
const connect = require('./db');

async function seedDatabase() {
    const client = await connect();
    const db = await client.db('netflix');
  const csvFilePath = './netflix_titles.csv';

  try {
    const data = await csvtojson().fromFile(csvFilePath);

    const collection = await db.collection('shows');

    const count = await collection.countDocuments();

    if(count > 0) {
      console.log("Collection already contains some data!");
      return false;
    } else {
      const batchSize = 10;

      for (let i = 0; i < data.length; i += batchSize) {
        const chunk = data.slice(i, i + batchSize);
        try{
          const res = await collection.insertMany(chunk);
          console.log("Successfully inserted rows " + i + " to " + i+10);
        } catch(w) {
          console.log("Error occured while inserting data. More info : ", w);
        }
      }
      return true;
      console.log("Data Seeded Successfully!");
    }
    
  } finally {
    await client.close();
  }
}

module.exports = seedDatabase;