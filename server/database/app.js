require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017';
const MONGO_DB = process.env.MONGO_DB || 'dealershipsDB';
const SENTIMENT_URL = process.env.SENTIMENT_URL || 'http://localhost:5050/';
const PORT = process.env.PORT || 3030;

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let db;
let client;

async function connectToMongo() {
  client = new MongoClient(MONGO_URL);
  try {
    await client.connect();
    db = client.db(MONGO_DB);
    console.log(`Connected to MongoDB at ${MONGO_URL}, using database "${MONGO_DB}"`);
  } catch (err) {
    console.error('ERROR: Failed to connect to MongoDB:', err.message);
    // Keep the process alive but log clearly; requests will fail until Mongo is reachable.
  }
}

function ensureDbConnected(req, res, next) {
  if (!db) {
    return res.status(500).json({ status: 500, message: 'Database not connected' });
  }
  next();
}

// Builds a base URL that safely joins with '/analyze/<text>' regardless of
// whether SENTIMENT_URL has a trailing slash.
function buildSentimentUrl(text) {
  const base = SENTIMENT_URL.endsWith('/') ? SENTIMENT_URL.slice(0, -1) : SENTIMENT_URL;
  return `${base}/analyze/${encodeURIComponent(text)}`;
}

async function computeSentiment(text) {
  try {
    const url = buildSentimentUrl(text);
    const response = await fetch(url, { timeout: 5000 });
    if (!response.ok) {
      throw new Error(`Sentiment service responded with status ${response.status}`);
    }
    const result = await response.json();
    if (result && result.sentiment) {
      return result.sentiment;
    }
    return 'neutral';
  } catch (err) {
    console.error('WARNING: Sentiment analysis call failed, falling back to "neutral":', err.message);
    return 'neutral';
  }
}

// ---------- Routes ----------

app.get('/fetchDealers', ensureDbConnected, async (req, res) => {
  try {
    const dealers = await db.collection('dealerships').find({}, { projection: { _id: 0 } }).toArray();
    res.status(200).json({ status: 200, data: dealers });
  } catch (err) {
    console.error('ERROR in /fetchDealers:', err.message);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.get('/fetchDealers/state/:state', ensureDbConnected, async (req, res) => {
  try {
    const state = req.params.state;
    const dealers = await db
      .collection('dealerships')
      .find(
        { state: { $regex: `^${state}$`, $options: 'i' } },
        { projection: { _id: 0 } }
      )
      .toArray();
    res.status(200).json({ status: 200, data: dealers });
  } catch (err) {
    console.error('ERROR in /fetchDealers/state/:state:', err.message);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.get('/fetchDealer/:id', ensureDbConnected, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const dealer = await db.collection('dealerships').findOne({ id }, { projection: { _id: 0 } });
    if (!dealer) {
      return res.status(404).json({ status: 404, message: 'Dealer not found' });
    }
    res.status(200).json({ status: 200, data: dealer });
  } catch (err) {
    console.error('ERROR in /fetchDealer/:id:', err.message);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.get('/fetchReviews/dealer/:id', ensureDbConnected, async (req, res) => {
  try {
    const dealerId = parseInt(req.params.id, 10);
    const reviews = await db
      .collection('reviews')
      .find({ dealership: dealerId }, { projection: { _id: 0 } })
      .toArray();

    // Fill in sentiment on the fly for any review that's missing it.
    const withSentiment = await Promise.all(
      reviews.map(async (review) => {
        if (!review.sentiment) {
          const sentiment = await computeSentiment(review.review);
          // Persist it so we don't have to recompute next time.
          try {
            await db.collection('reviews').updateOne({ id: review.id }, { $set: { sentiment } });
          } catch (updateErr) {
            console.error('WARNING: Failed to persist computed sentiment:', updateErr.message);
          }
          return { ...review, sentiment };
        }
        return review;
      })
    );

    res.status(200).json({ status: 200, data: withSentiment });
  } catch (err) {
    console.error('ERROR in /fetchReviews/dealer/:id:', err.message);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.post('/insert_review', ensureDbConnected, async (req, res) => {
  try {
    const body = req.body || {};
    const {
      name,
      dealership,
      review,
      purchase,
      purchase_date,
      car_make,
      car_model,
      car_year,
    } = body;

    const reviewsCollection = db.collection('reviews');
    const lastReview = await reviewsCollection
      .find({}, { projection: { id: 1, _id: 0 } })
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newId = lastReview.length > 0 ? lastReview[0].id + 1 : 1;

    const sentiment = await computeSentiment(review || '');

    const newReview = {
      id: newId,
      name,
      dealership: parseInt(dealership, 10),
      review,
      purchase: Boolean(purchase),
      purchase_date,
      car_make,
      car_model,
      car_year: parseInt(car_year, 10),
      sentiment,
    };

    await reviewsCollection.insertOne(newReview);
    const { _id, ...responseData } = newReview;
    res.status(200).json({ status: 200, data: responseData });
  } catch (err) {
    console.error('ERROR in /insert_review:', err.message);
    res.status(500).json({ status: 500, message: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ status: 200, message: 'Dealership database service is running' });
});

// Catch unhandled promise rejections so the process doesn't crash silently.
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED PROMISE REJECTION:', reason);
});

connectToMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`Dealership database service listening on port ${PORT}`);
  });
});
