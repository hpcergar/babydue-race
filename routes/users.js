var express = require('express'),
    app = express(),
    router = express.Router(),
    users = require('../models/users')
    ;



router.route('/')
    .get(function (request, response) {
        response.json(users.getAll());
    })
;



module.exports = router;