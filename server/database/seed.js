require('dotenv').config();

const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'dealershipsDB';

async function seed() {
  const client = new MongoClient(MONGO_URL);

  try {
    await client.connect();
    console.log(`Connected to MongoDB at ${MONGO_URL}`);
    const db = client.db(MONGO_DB);

    const dealersPath = path.join(__dirname, 'data', 'dealerships.json');
    const reviewsPath = path.join(__dirname, 'data', 'reviews.json');

    const dealers = JSON.parse(fs.readFileSync(dealersPath, 'utf-8'));
    const reviews = JSON.parse(fs.readFileSync(reviewsPath, 'utf-8'));

    // Drop existing collections first so this script is idempotent.
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    if (collectionNames.includes('dealerships')) {
      await db.collection('dealerships').drop();
      console.log('Dropped existing "dealerships" collection.');
    }
    if (collectionNames.includes('reviews')) {
      await db.collection('reviews').drop();
      console.log('Dropped existing "reviews" collection.');
    }

    const dealersResult = await db.collection('dealerships').insertMany(dealers);
    console.log(`Inserted ${dealersResult.insertedCount} documents into "dealerships".`);

    const reviewsResult = await db.collection('reviews').insertMany(reviews);
    console.log(`Inserted ${reviewsResult.insertedCount} documents into "reviews".`);

    console.log('Seeding complete.');
  } catch (err) {
    console.error('ERROR: Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

seed();
