const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.json');

mongoose.connect('mongodb://localhost/' + config.dbName, {useNewUrlParser: true});

mongoose.connection
    .once('open', () => {
        console.log('Message:', 'The ' + config.dbName + ' database is connected');

        const port = 27017;

        app.listen(port, function(){
            console.log('http://localhost: ' + port);
        });
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.all('*', function(req, res, next){
    console.log( req.method + " " + req.url);
    next();
});

app.use(express.static(__dirname + '/public'));

// Routing with versions
app.use('/api', require('./routes/Login'));
// app.use('/api/register', require('./routes/Register'));


module.exports = app;