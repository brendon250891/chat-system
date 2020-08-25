// Server
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const server = require('./listen.js');

// Database
const MongoClient = require('mongodb').MongoClient;
const databaseUrl = 'mongodb://localhost:27017';
const databaseName = 'chat-system';
const client = new MongoClient(databaseUrl);
const database = require('./routes/database');

const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/../dist/chat-system`));

server.listen(http, PORT);
database.connect(client, databaseName);


require('./routes/authentication.js')(app, path);