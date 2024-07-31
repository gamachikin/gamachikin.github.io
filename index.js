import express from 'express';
import path from 'node:path';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

// Load environment variables from .env file for local development
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin
if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    })
  });
}

const db = admin ? admin.firestore() : null;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), 'static')));

// Basic routes
const routes = [
  { path: '/', file: 'index.html' },
  { path: '/apps', file: 'apps.html' },
  { path: '/games', file: 'games.html' },
  { path: '/chat', file: 'chat.html' },
  { path: '/settings', file: 'settings.html' },
  { path: '/canvas', file: 'canvas.html' },
];

// Serve static files
routes.forEach((route) => {
  app.get(route.path, (req, res) => {
    res.sendFile(path.join(process.cwd(), 'static', route.file));
  });
});

// Rating submission endpoint
app.post('/api/rateGame', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: 'Database not initialized' });
  }

  const { gameName, rating } = req.body;

  if (!gameName || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const gameRef = db.collection('games').doc(gameName);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      await gameRef.set({ totalRating: rating, numberOfRatings: 1 });
    } else {
      const gameData = gameDoc.data();
      const newTotalRating = gameData.totalRating + rating;
      const newNumberOfRatings = gameData.numberOfRatings + 1;
      await gameRef.update({ totalRating: newTotalRating, numberOfRatings: newNumberOfRatings });
    }

    res.status(200).json({ message: 'Rating submitted' });
  } catch (error) {
    console.error('Error updating rating:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Rating statistics endpoint
app.get('/api/getGameRating/:gameName', async (req, res) => {
  const { gameName } = req.params;

  if (!gameName) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    const gameRef = db.collection('games').doc(gameName);
    const gameDoc = await gameRef.get();

    if (!gameDoc.exists) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const gameData = gameDoc.data();
    const averageRating = gameData.totalRating / gameData.numberOfRatings;

    res.status(200).json({
      numberOfRatings: gameData.numberOfRatings,
      averageRating: averageRating.toFixed(1)  // Round to 1 decimal place
    });
  } catch (error) {
    console.error('Error retrieving rating statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Middleware to handle 404 errors
app.use((req, res) => {
  res.status(404).sendFile(path.join(process.cwd(), 'static', '404.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
