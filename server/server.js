// Server
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const PORT = 3000;
const io = require('socket.io')(http);
const socket = require('./socket.js');

const MongoClient = require('mongodb').MongoClient;
const databaseUrl = 'mongodb://localhost:27017';
const databaseName = 'chatSystem';

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

socket.connect(io, PORT);

MongoClient.connect(databaseUrl, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
    if (error) {
        return console.log(error)
    }
    const database = client.db(databaseName);

    require('./routes/api-users')(database, app);
    require('./routes/authentication.js')(database, app);
    require('./routes/api-groups.js')(database, app);
    require('./routes/api-channels.js')(database, app);
    
    require('./listen.js')(http, PORT);
});