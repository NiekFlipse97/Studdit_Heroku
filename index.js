const mongoose = require('mongoose');
const config = require('./config.json');

mongoose.connect('mongodb://localhost/' + config.dbName, {useNewUrlParser: true});

mongoose.connection
    .once('open', () => {
        console.log('Message:', 'The ' + config.dbName + ' database is connected');
        done();
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });