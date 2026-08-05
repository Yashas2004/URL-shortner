require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const { redirectToUrl } = require('./controllers/urlController');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');

connectDB();

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

app.get('/', (req, res) => {
  res.send('URL Shortener API is running...');
});

app.use('/api', urlRoutes);
app.use('/api/auth', authRoutes);
app.get('/:shortCode', redirectToUrl);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});