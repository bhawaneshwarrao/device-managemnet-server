const express = require('express');
const app = express();
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');
const mongoose = require('mongoose');
const cors = require('cors');
const deviceRoutes = require('./routes/device-router');
const appLogger = require('./middlewares/app-logger');
const { logger } = require('./utils');

const port = process.env.PORT || 3000;
const dbURI = process.env.CONNECTION_URL
  || 'mongodb+srv://nagsbr:NagSbrTest2@cluster0.eow8e.mongodb.net/device-database?retryWrites=true&w=majority';

// middleware
app.use(express.json());
app.use(cors());
app.use(appLogger);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.send('device service');
});

app.get('/healthcheck', (req, res) => {
  res.send('device service is up and running!');
});

app.use('/api/v1', deviceRoutes);

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => app.listen(port))
  .catch((err) => logger.error(err));

module.exports = app;
