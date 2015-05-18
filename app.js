var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require("express-session");

var routes = require('./routes/index');
var api = require('./routes/api');


var facade = require("./model/Facade");

var app = express();

app.use(session({secret: 'very_sercret_3162735', saveUninitialized: true, resave: true}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.locals.pretty = true;


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/api', api)


app.use(function(req, res, next){
    var newUser = req.body.createUserName;
    var newPw = req.body.createPassword;
    var newFName = req.body.createFirstName;
    var newLName = req.body.createLastName;
    var newEmail = req.body.createEmail;
    var newStreet = req.body.createStreet;
    var newCity = req.body.createCity;
    var newZip = req.body.createZip;
    var newCountry = req.body.createCountry;
    console.log(newEmail);
    if(typeof(newFName) !== "undefined"){
        facade.createUser({"userName" : newUser, "password" : newPw, "firstName" : newFName, "lastName" : newLName, "email" : newEmail, "street" : newStreet, "city" : newCity, "zip" : newZip, "country" : newCountry });
        res.redirect("/api/home");
        return next();
    }

    if (typeof req.body.departAir !== "undefined") {
        res.redirect("/api/findflights" + "/" + req.body.departAir + "/" + req.body.landingAir + "/" + req.body.date);
        return next();
    }

    return next();
});

app.use(function (req, res, next) {
    var userName = req.session.userName;

    if (typeof(userName) !== "undefined") {
        next(); //Already logged in, just forward the request
    }
    else
    {
        userName = req.body.userName;  //Try get userName and password from login page
        var password = req.body.password;

        if (typeof(userName) !== "undefined" && typeof(password !== "undefined"))
        {
            facade.checkUser(userName, password, function (err, result) {
                if (err || result === false) {
                    req.session.loginerror = "Wrong password or user name";
                }
                else {
                    req.session.userName = userName;
                    req.session.user = userName;
                    delete req.session.req.session.loginerror;
                }
                return res.redirect("/");
            })
        }
        else {
            req.url = "/login"; //Forward to login page
            return next();
        }
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler. No stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
