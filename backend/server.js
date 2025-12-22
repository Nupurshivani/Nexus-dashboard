require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
