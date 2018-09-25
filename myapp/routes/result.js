var express = require('express');
var router = express.Router();

function query_result(placeurl, res) {
    var request = require('request');
    request(placeurl, function (error, response, body) {
        res.send(body);
    });
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    var Keyword = req.query.Keyword;
    var Category = req.query.Category;
    var Distance = req.query.Distance;
    var placeurl =
        "https://maps.googleapis.com/maps/api/place/nearbysearch/json?" +
        "location=" +
        req.query.lat +
        "," +
        req.query.lng +
        "&radius=" +
        Distance +
        "&type=" +
        Category +
        "&keyword=" + Keyword +
        "&key=AIzaSyAEyemc1G2yk7Bb3J-sun80cOiYR4jT9P8";
    query_result(placeurl, res);
});

module.exports = router;

