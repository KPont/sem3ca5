var facade = require("../model/Facade");
var express = require('express');
var http = require('http');
var fs = require('fs');

var router = express.Router();

var path = __dirname.substr(0,__dirname.lastIndexOf("\\"));  //Remove the routes part


router.get('/home', function(req, res) {
    res.render('home',{"welcome" : "Welcome ! Here you will find the cheapest flights, from all over the world. ", "msg": "What are you doing here ? Go sign up for free, or search for your next cheap vacation !"});
});

router.get('/user', function(req, res) {
    res.render('signUp');
});

router.get('/login', function(req, res, next) {
    res.render('login', {loginerror : req.session.loginerror});
});

router.get('/logoff', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

router.get('/findflights', function(req, res, next) {
    res.render('findflights');
});

router.get('/findflights/:departAir/:landingAir/:date', function(req, res, next) {
    facade.getFlight(req.params.departAir, req.params.landingAir, req.params.date, function(data){
        res.json(data);
    });
});

router.get('/allflights', function(req, res, next) {
        facade.getAllFlights(function(data){
            res.json(data);
        });
});


router.get('/jadeB/', function(req, res, next){
        facade.getFlight(req.body.departAir, req.body.landingAir, req.body.date, function(data){
            res.json(data);
        });
});

router.get('/quote/:topic', function(req, res) {
    facade.getAllQuotesByTopic(req.params.topic, function(quotes){
        res.json(quotes);
    });
});

router.get('/quote/random/:topic', function(req, res) {
    facade.getRandomQuote(req.params.topic, function(quotes){
        res.json(quotes);
    });
});

router.get('/addquote', function(req, res, next) {
    res.render('addquote');
});

router.get('/rest', function(req, res, next) {
    res.render('rest');
});

var d = '';
// GET Request options configuration
var optionsget = {
    host : 'localhost',
    port : 8080,
    path : '/brandserver/rest/wines', // url with parameters
    method : 'GET' // GET Method
};


module.exports = router;