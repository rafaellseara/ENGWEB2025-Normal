const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

var indexRouter = require('./routes/index');

const app = express();
const PORT = 25000;

app.use(bodyParser.json());
app.use('/', indexRouter);

// Conexão ao MongoDB
dbUri = 'mongodb://localhost:27017/eurovisao';
mongoose.connect(dbUri);

mongoose.connection
  .on('error', console.error.bind(console, 'MongoDB connection error:'))
  .once('open', () => console.log('Conectado ao MongoDB'));

app.listen(PORT, () => {
  console.log(`API a correr na porta ${PORT}`);
});