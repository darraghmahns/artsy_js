const path = require('path');
const express = require('express');
require('dotenv').config();

const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

const app = express();

// app.use((req, res, next) => {
//   console.log(`[REQUEST] ${req.method} ${req.originalUrl}`);
//   console.log('[QUERY]', req.query);
//   next();
// });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use('/api/search', require('./routes/search'));
app.use('/api/artist', require('./routes/artist'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/favorites', require('./routes/favorites'));

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, 'public')));

// For all other routes, serve index.html (for Angular routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}...`);
});
