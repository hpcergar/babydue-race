var express = require('express'),
    app = express(),
    router = express.Router(),
    users = require('../models/users'),
    _ = require('lodash')
    ;



router.route('/')
    .get(function (request, response) {
        // Get an array
        let usersFiltered = _(users.getAll()) //wrap object so that you can chain lodash methods
            .mapValues((value, id)=>_.merge({}, value, {id})) //attach id to object
            .values() //get the values of the result
            .value();

        usersFiltered = usersFiltered
            .filter(user => user.score !== undefined) // Take those having score
            .map(({ name, score }) => ({ name, score })); // Take only name, email, score
        // Take first 10, sorted by score desc
        let highscores = _.slice(_.orderBy(usersFiltered, ['score'], ['desc']), 0, 10);
        response.json(highscores);
    })
;

router.route('/:email')
    .get(function (request, response) {
        let email = request.query.emailOrig || request.query.email;
        let user = users.getUserByEmail(email)
        response.json(user
            ? { "user" : user.name, "score" : user.score || null}
            : false);
    })
;



module.exports = router;