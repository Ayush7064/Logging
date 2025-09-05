const express = require('express');
const app = express();
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');

app.use(express.json());

app.use('/api/users', userRoutes);

// Global Error Handler (must be after routes)
app.use(errorHandler);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
