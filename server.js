var express = require('express'),
    bodyParser = require('body-parser');
app = express();
var path = require('path');
var fs = require('fs');

var natural = require('natural');
var classifier = new natural.BayesClassifier();

var intents = ['AddToPlaylist', 'BookRestaurant', 'GetWeather', 'PlayMusic', 'RateBook', 'SearchCreativeWork', 'SearchScreeningEvent'];

for(var i = 0; i < intents.length; i++) {
    var docs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cleaner', 'cleaned', 'train_'+intents[i]+'.clean.json')));
    for(var j = 0; j < docs.length; j++) {
        classifier.addDocument(docs[j], intents[i]);
    }
}

classifier.train();

console.log(classifier.classify("will it rain in mumbai"));

fs.writeFile(path.join(__dirname, "classifiers", "trainedNaiveBayes.json"), JSON.stringify(classifier), 'utf8', function(err){
    if (err) console.log(err);
});

for(var i = 0; i < intents.length; i++) {
    var docs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cleaner', 'cleaned', 'train_'+intents[i]+'_full.clean.json')));
    var positive = 0;
    for(var j = 0; j < docs.length; j++) {
        if(classifier.classify(docs[j]) == intents[i])
            positive++;
        else {
            //console.log("For '"+docs[j]+"' --> "+classifier.classify(docs[j])+" || Expected: "+intents[i]);
        }
    }
    console.log("For "+intents[i]+"'s classification: "+((positive/docs.length)*100.0));
}

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'node_modules')));


var server = app.listen(process.env.PORT || '3030', function () {
    console.log('The servers up yo.');
});