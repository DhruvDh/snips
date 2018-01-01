var path = require('path');
var fs = require('fs');

var cleaner = function (rawFileName) {
    var rawjson = JSON.parse(fs.readFileSync(path.join(__dirname, rawFileName+".json"), 'utf8'));
    var raw = rawjson[Object.keys(rawjson)[0]];
    
    var processed = [];
    for (var i = 0; i < raw.length; i++) {
        for (var j = 0; j < raw[i].data.length; j++) {
            if (processed[i] == undefined)
                processed[i] = raw[i].data[j].text;
            else
                processed[i] += raw[i].data[j].text;
        }
    }
    fs.writeFile(path.join(__dirname, "cleaned", rawFileName+".clean.json"), JSON.stringify(processed), 'utf8');
}

var intents = ['AddToPlaylist', 'BookRestaurant', 'GetWeather', 'PlayMusic', 'RateBook', 'SearchCreativeWork', 'SearchScreeningEvent'];

for(var i = 0; i < intents.length; i++) {
    cleaner('train_'+intents[i]);
    cleaner('validate_'+intents[i]);
    cleaner('train_'+intents[i]+'_full');
}
