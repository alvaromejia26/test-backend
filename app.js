var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// PORT
app.set('port', process.env.PORT || 3000);

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
});

// Body Parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// IMPORT ROUTES
var appRoutes = require('./routes/app');
var userRoutes = require('./routes/user');
var taskRoutes = require('./routes/task');

app.use('/user', userRoutes);
app.use('/task', taskRoutes);
app.use('/', appRoutes);

app.listen(app.get('port'), () => {
    console.log(`Express server in port ${app.get('port')}: \x1b[32m%s\x1b[0m` ,'running');
});