const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const http = require('http');
const path = require('path');

const { initializeSocket } = require('./socket/socket');
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const blockRoutes = require('./routes/block.routes');
const uploadRoutes = require('./routes/upload.routes');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const app = express();
const server = http.createServer(app);

initializeSocket(server);

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));