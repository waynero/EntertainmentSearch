var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const yelp = require('yelp-fusion');
var apiKey = "j1yBxpMHAefliziWvKr2tzCP2bEz7QJ4eGNILpF4jzh8AwjPvbiKNG0u2Y5PaAykofAqqVfLBp91XQgBVKJY59J0TJmob2JT23hX8RpYW1WGSm61CXB2kw_NoPXLWnYx";

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var result = require("./routes/result");
var nextpage = require("./routes/nextpage");
// var nextpage2 = require("./routes/nextpage2");
// var yelp = require("./routes/yelp");

var app = express();
// app.listen(8081);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});

app.use('/result', result);
app.use('/nextpage', nextpage);
// app.use('/nextpage2', nextpage2);

app.get('/yelp', function (req, res) {
    const client = yelp.client(apiKey);

    console.log("yelp");

    client.businessMatch('best', {
        name: req.query.name,
        address1: req.query.address1,
        city: req.query.city,
        state: req.query.state,
        country: req.query.country
    }).then(response => {
        console.log(response.jsonBody.businesses[0]);
        var temp = response.jsonBody.businesses[0];
        if (temp != undefined) {
            console.log(temp.name);
            if (temp.name == req.query.name || temp.alias == req.query.name || temp.location.zip_code == req.query.zip) {
                console.log(temp.id);
                client.reviews(temp.id).then(response => {
                    console.log(response.jsonBody);
                    res.send(response.jsonBody);
                });
            }

        } else {
            var tempArray = {
                result: 'No'
            };

            console.log(JSON.stringify(tempArray));
            res.send(JSON.stringify(tempArray));
        }

    }).catch(e => {
        console.log(e);
    });

});

// app.use('/yelp', yelp);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
