'use strict';

var model = require('../models/bets'),
    winner = require('../models/winner'),
    user = require('../models/users'),
    // Date validation & transform
    moment = require('moment'),
    validator = require('validator')
    ;

exports.get = function (callback) {
    model.getAll(callback);
};

/**
 *
 * @param params
 * @param emailOrig
 * @param callback
 */
exports.save = function (params, emailOrig, callback) {

    var date = params.date,
        email = params.email,
        gender = params.gender
        ;

    // Data validation
    if(!params.date || !moment(date).isValid()){callback(new Error('Invalid date'), null);return;}
    if(!params.email || !validator.isEmail(email)){callback(new Error('Invalid email'), null);return;}
    if(email != emailOrig){callback(new Error('Sent email ' + email + ' is not the same as authenticated one ' + emailOrig), null);return;}
    if(!params.gender || !model.isValidGender(gender)){callback(new Error('Invalid gender'), null);return;}

    // Winner check
    if(winner.haveWinner()){callback(new Error('Bets disabled: we already got a winner!'), null);return;}
    if(!user.hasAlreadyPlayed(email)){callback(new Error('You can only vote after play at least once'), null);return;}


    // Check availability of date
    model.isBetAvailable(params, function(err){
        /* params format: {
                "date" : "2016-01-01",
                "email" : "aaa@bbb.com",
                "gender" : "m", // m, f, d (dragon)
                }
                */
        if(err){
            callback(new Error('Date unavailable'), null);
            return;
        }

        // Save bet by email
        model.save({
            "date":date,
            "email":email,
            "gender":gender
        }, callback);
    });
};


