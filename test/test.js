var assert = require("assert");
var db = require('../model/db.js');
var Facade = require("../model/Facade");
var mongoose = require( 'mongoose' );


describe('User', function(){
    describe('#createUser()', function(){
        it('should save without error', function(done){
            Facade.createUser({"firstName":"hej","lastName":"hejsa","userName":"hejsasa","email":"hahah@haha.com","phone":2345,"password":"hey!"});
          done();
        })
    })
});


