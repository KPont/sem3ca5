var db = require('../model/db.js');
var request = require('request');


function _getAllUsers(callback){
    var users = db.User.find(function (err, Users){
        if(err) {
            return console.log(err);
        }
        else{
            callback( Users );
        }
    });
}

function _checkUser(user,password,callback){
    db.User.findOne({userName : user },function(err,foundUser){
        if(err) {
            return callback(err);
        }
        if(foundUser != null && foundUser.password === password){
            callback(null,true);
        } else
        {
            callback(null,false);
        }
    })
}

function _getUser(id, callback){
   db.User.findById(id, function(err, user){
       if(err) {
           return console.log(err);
       }
        else {
           callback( user );
       }
    });
}

function _getUserByUsername(username, callback){
    db.User.find({userName: username}, function(err, user){
        if(err) {
            return console.log(err);
        }
        else {
            callback( user );
        }
    });
}

function _getFlight(departurePort, landingPort, date, callback){
    var options = {
        url: "http://localhost:8084/CA5/api/flights/" + departurePort + "/" + landingPort + "/" + date,
        method: 'GET',
        json: true
    }

    request(options, function(error, response, body){
        if(!error && response.statusCode === 200){
            return callback(body);
        }
        console.log(error + " : " + JSON.stringify(body))
    });
}

function _getAllFlights(callback){
    var options = {
        url: "http://localhost:8084/CA5/api/flights",
        method: 'GET',
        json: true
    }

    request(options, function(error, response, body){
        if(!error && response.statusCode === 200){
            return callback(body);
        }
        console.log(error + " : " + JSON.stringify(body))
    });
}

function _getTicketInfo(userName, callback){
    db.User.findOne({'userName': userName}, function(err, user){
        var index = 0;
        var ticketList = [];
        for(var i = 0; i < user.tickets.length; i++){
            db.Ticket.findById(user.tickets[i], function(err, ticket){
                ticketList.push(ticket);
                index++;
                if(index === user.tickets.length){
                    return callback (null, ticketList);
                }
            })
        }
    });
}

function _createUser(UserJson, callback){
    var User = new db.User({'userName': UserJson.userName, 'password': UserJson.password, 'firstName': UserJson.firstName, 'lastName': UserJson.lastName,'email': UserJson.email, 'street': UserJson.street, 'city': UserJson.city, 'zip': UserJson.zip, 'country': UserJson.country, 'tickets': []});
    User.save(function(err){
        if(err) {
            return callback(err);
        }
        else{
            console.log(User);
            return callback(null, User)
        }
    });
}

function _editUser(id, UserJson) {
    db.User.findByIdAndUpdate(id, {'userName': UserJson.userName, 'password': UserJson.password, 'firstName': UserJson.firstName, 'lastName': UserJson.lastName,'email': UserJson.email, 'street': UserJson.street, 'city': UserJson.city, 'zip': UserJson.zip, 'country': UserJson.country, 'tickets': UserJson.tickets});
}



function _createTicketAndAddToUser(ticketJson, userName, callback){

    var ticket = new db.Ticket({'seat': ticketJson.seat, 'date': ticketJson.departure, 'arrival': ticketJson.arrival});
    ticket.save(function(err){
        if(err) {
            return callback(err);
        }
        else{
            db.User.findOne({'userName': userName}, function(err, user){
                if(err){
                    callback(err);
                }
                user.tickets.push(ticket.id);
                user.save(function(err){
                    console.log(user);
                })
            })
        }

    });
}

function _ja(){
    // _createUser({userName: 'adlund', password: 'adlund', firstName: 'Alex', lastName: "lastAlex", email: 'adlund@hotmail.com', street: 'hvidovrevej', city: 'Hvidovre', zip: '2650', country: 'Denmark'}, function (err, user){
    //  console.log("HEY")
    //});
    //_createTicketAndAddToUser({seat: 'A88', date: '05-05-2015', departure: 'CPH', arrival: 'BAR'}, 'adlund' );
    _getTicketInfo("adlund", function (err, tickets){
        console.log("hey")
        console.log(tickets);
    })
}


module.exports = {
    createUser : _createUser,
    editUser : _editUser,
    createTicketAndAddToUser: _createTicketAndAddToUser,
    checkUser : _checkUser,
    getTicketInfo : _getTicketInfo,
    getAllFlights : _getAllFlights,
    getAllUsers : _getAllUsers,
    getUser : _getUser,
    getUserByUsername : _getUserByUsername,
    getFlight : _getFlight
    //uncomment for at kører ja function ved start. (bruger den til at teste)
    //ja: _ja()
};