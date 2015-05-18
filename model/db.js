var mongoose = require( 'mongoose' );
var Facade = require("../model/Facade");

//Uncomment if you are going to use a local instance or add connection details for your account on MongoLab
var dbURI = 'mongodb://ca3:ca3@ds061631.mongolab.com:61631/ca3sem3';

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
    mongoose.connection.db.dropDatabase(function(err, result) {
        if(err){
            console.log(err);
        }
        else{
            console.log('db Dropped');
        }
    });
});


mongoose.connection.on('error',function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

var UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: {type: String, unique: true},
    email: String,
    phone: Number,
    password: String
});


var User = mongoose.model('User', UserSchema);

exports.User = User;

