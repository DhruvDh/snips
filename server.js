var express = require('express'),
    bodyParser = require('body-parser');
app = express();
var path = require('path');
var fs = require('fs');

var natural = require('natural');
var classifier = new natural.BayesClassifier();

var intents = {
    list: ['AddToPlaylist', 'BookRestaurant', 'GetWeather', 'PlayMusic', 'RateBook', 'SearchCreativeWork', 'SearchScreeningEvent'], 
    'AddToPlaylist': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'BookRestaurant': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'GetWeather': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'PlayMusic': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'RateBook': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'SearchCreativeWork': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    'SearchScreeningEvent': {
        truePositive: 0,
        total: 0,
        falsePositive: 0,
        falseNegative: 0
    },
    totalTruePositive: 0,
    totalFalsePositive: 0,
    totalFalseNegative: 0,
    total: 0,
    accuracy: 0.0
}

for(var i = 0; i < intents.list.length; i++) {
    var docs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cleaner', 'cleaned', 'train_'+intents.list[i]+'.clean.json')));
    for(var j = 0; j < docs.length; j++) {
        classifier.addDocument(docs[j], intents.list[i]);
    }
}

classifier.train();


fs.writeFile(path.join(__dirname, "classifiers", "trainedNaiveBayes.json"), JSON.stringify(classifier), 'utf8', function(err){
    if (err) console.log(err);
});

for(var i = 0; i < intents.list.length; i++) {
    var current = intents.list[i];
    var docs = JSON.parse(fs.readFileSync(path.join(__dirname, 'cleaner', 'cleaned', 'train_'+current+'_full.clean.json')));
    intents[current].total = docs.length + 1;
    for(var j = 0; j < docs.length; j++) {
        var Class = classifier.classify(docs[j]); 
        if(Class == current)
            intents[current].truePositive++;
        else {
            intents[Class].falsePositive++;
            intents[current].falseNegative++;
        }
    }
    console.log("For "+current+"'s classification: "+((intents[current].truePositive/intents[intents.list[i]].total)*100.0));
}

intents.list.forEach(function(intent) {
    intents.totalTruePositive += intents[intent].truePositive;
    intents.totalFalsePositive  += intents[intent].falsePositive;
    intents.totalFalseNegative  += intents[intent].falseNegative;
    intents.total += intents[intent].total;
});

intents.accuracy = (intents.totalTruePositive/intents.total)*100.0;
console.log("Total Accuracy: "+intents.accuracy);

fs.writeFile(path.join(__dirname, 'log', 'firstNaiveBayesAttempt.json'), JSON.stringify(intents), 'utf8', function(err) {
    if (err) console.log(err);
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'node_modules')));


var server = app.listen(process.env.PORT || '3030', function () {
    console.log('The servers up yo.');
});