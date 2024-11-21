// app.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const studentRoutes = require('./routes/studentRoutes.js');
const professorRoutes = require('./routes/professorRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const subjectsRoute = require('./routes/subjects.js'); // Correctly import the subjects route

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Use the subjects route with the prefix '/api/subjects'
app.use('/api/eligible-subjects', subjectsRoute);

app.use('/api/student', studentRoutes);
app.use('/api/professor', professorRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
