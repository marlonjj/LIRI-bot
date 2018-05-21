require("dotenv").config();

var Spotify = require("node-spotify-api");
var Twitter = require("twitter");
var request = require("request");
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];

var song = "The Sign Ace of Base";
var movie = "Mr. Nobody";

function run(c){ 
    fs.appendFile("./log.txt", ("\n\n" + c + ","), function(err) {
        if (err) {
            console.log(err);
        }
    });
    switch(c){
        case 'my-tweets':
            myTweets(); 
            break;
        case 'spotify-this-song':
            spotifyThis();
            break;
        case 'movie-this':
            movieThis();
            break;
        case 'do-what-it-says':
            doWhat();
            break;
        default:
            console.log("Unrecognized Command");
    }
}

function myTweets(){
    var params = {screen_name: 'PopeyesChicken'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
           for(i=0; i<20; i++){
               console.log(tweets[i].created_at);
               console.log(tweets[i].text);
               fs.appendFile("./log.txt", ("\n" + tweets[i].created_at + "\n" + tweets[i].text), function(err) {
                if (err) {
                    console.log(err);
                }
            });
           }
        }
    });
}

function spotifyThis(){
    if (process.argv.length > 3){
        song = process.argv[3];
        for(var n = 4; n<process.argv.length; n++){
            song += " " + process.argv[n];
        }
    }
    spotify.search({ type: 'track', query: song }, function(err, data) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }
       var theTrack = data.tracks.items[0];
        for (var m = 0; m < theTrack.artists.length; m++){
            fs.appendFile("./log.txt", ("\n" + theTrack.artists[m].name), function(err) {
                if (err) {
                    console.log(err);
                }
            });
            console.log(theTrack.artists[m].name);
        }
        console.log(theTrack.name);
        console.log(theTrack.preview_url);
        console.log(theTrack.album.name); 
        fs.appendFile("./log.txt", ("\n" + theTrack.name + "\n" + theTrack.preview_url 
          + "\n" + theTrack.album.name), function(err) {
            if (err) {
                console.log(err);
            }
        });
      });
}

function movieThis(){
    if (process.argv.length > 3){
        movie = process.argv[3];
        for(var n = 4; n<process.argv.length; n++){
            movie += "+" + process.argv[n];
        }
    }
    request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

        if (!error && response.statusCode === 200) {
            var myMovie = JSON.parse(body);
            console.log(myMovie.Title);
            console.log(myMovie.Year);
            console.log(myMovie.Rated);
            console.log(myMovie.Ratings[1]);
            console.log(myMovie.Country);
            console.log(myMovie.Language);
            console.log(myMovie.Plot);
            console.log(myMovie.Actors);

            fs.appendFile("./log.txt", ("\n" + myMovie.Title + "\n" + myMovie.Year
              + "\n" + myMovie.Rated + "\n" + myMovie.Ratings[1] + "\n" + myMovie.Country
              + "\n" + myMovie.Language + "\n" + myMovie.Plot + "\n" + myMovie.Actors), function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
    });
}

function doWhat(){
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
    
        var dataArr = data.split(",");
        if(dataArr[0] == "spotify-this-song"){
            song = dataArr[1];
        }
        else if(dataArr[0] == "move-this"){
            movie = dataArr[1];
        }
        run(dataArr[0]);
    
    });
}
run(command);