var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('about', { title: req.query.user });
});

router.post('/', function(req, res) {
    res.render('about', { title: req.body.user });
})

router.put('/', function(req, res) {
    res.json({"put from server ":req.body});
})

router.delete('/', function(req, res) {
    res.json({"delete from server":req.body});
})

module.exports =  router;