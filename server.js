const express = require('express');
const apiRouter = require('./controllers/api');
const { authRouter } = require('./controllers/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// serve public folder statically
app.use(express.static('public'))

// Routes
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});