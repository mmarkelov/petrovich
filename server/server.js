var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
var data = require('./products.json');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.post('/getelements', function (req, res) {
    let result = [];

    let firstElementPosition = req.body.firstElementPosition;
    let lastElementPosition = req.body.lastElementPosition;

    console.log(firstElementPosition, lastElementPosition);

    result = data.slice(firstElementPosition, lastElementPosition);
    // console.log(result);

    res.send(result);
});

app.listen(3090, function() {
    console.log('Started on 3090');
});