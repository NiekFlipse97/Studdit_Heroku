const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const config = require('./config.json');

//Mongoose connection
if(process.env.NODE_ENV == 'testCloud' || process.env.NODE_ENV == 'production') {
    mongoose.connect('mongodb+srv://studdit_mongo_user:0iNDODCg1ozjP4n6Jw$xn#5J@studdit-uejdp.mongodb.net/test?retryWrites=true', {useNewUrlParser: true})
} else if(process.env.NODE_ENV !== 'test') {
    mongoose.connect('mongodb://localhost/' + config.dbName, {useNewUrlParser: true});
}

mongoose.connection
    .once('open', () => {
        console.log('Message:', 'The ' + config.dbName + ' database is connected');

        const port = process.env.PORT || config.serverPort;

        app.listen(port, function(){
            console.log('http://localhost: ' + port);
        });
    })
    .on('error', (error) => {
        console.warn('Warning', error);
    });

//app setup
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.all('*', function(req, res, next){
    next();
});

app.use(express.static(__dirname + '/public'));

// Routing with versions
app.use('/api', require('./src/routes/authentication'));
app.use('/api/thread', require('./src/routes/thread'));
app.use('/api/comment', require('./src/routes/comment'));
app.use('/api/friend', require('./src/routes/friend'));


module.exports = app;