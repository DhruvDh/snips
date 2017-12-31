var express = require('express'),
    bodyParser = require('body-parser');
app = express();
var path = require('path');
var fs = require('fs');




app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'node_modules')));


var server = app.listen(process.env.PORT || '3030', function () {
    console.log('The servers up yo.');
});