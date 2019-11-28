require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var command = process.argv[2];

if (command === "concert-this") {
    var artist = process.argv.slice(3).join(" ");
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=" + keys.bandsintown)
        .then(function (response) {
            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {
                    var artistEvent = response.data[i];
                    var venueName = artistEvent.venue.name;
                    var venueLoc = artistEvent.venue.city + ", " + artistEvent.venue.region + ", " + artistEvent.venue.country;
                    var eventDate = moment(artistEvent.datetime, 'YYYY-MM-DDTHH:mm:ss').format("MM/DD/YYYY");
                    console.log(venueLoc + " at " + venueName + " on " + eventDate);
                }
            } else {
                console.log("No upcoming events for " + artist);
            }
        }).catch(function (error) {
            console.log("There was an error trying to find that artist.");
        });
} else if (command === "spotify-this-song") {
    var song = process.argv.slice(3).join(" ");
    if (song.length === 0) {
        song = '"The Sign" artist:"Ace Of Base"';
    }
    spotify.search({ type: 'track', query: song }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var songsData = data.tracks.items;
        if (songsData.length > 0) {
            for (var i = 0; i < songsData.length; i++) {
                //extract artists names
                var artists = [];
                for (var j = 0; j < songsData[i].artists.length; j++) {
                    artists.push(songsData[i].artists[j].name);
                }

                console.log("Artist(s): " + artists.join(", "));
                console.log("Song name: " + songsData[i].name);
                console.log("Preview link: " + songsData[i].preview_url);
                console.log("Album: " + songsData[i].album.name);
                console.log("----------");
            }
        } else {
            console.log("Song Not Found")
        }
    });
} else if (command === "movie-this") {
    var movie = process.argv.slice(3).join(" ");
    if (movie.length === 0) {
        movie = "Mr. Nobody"
    }
    axios.get("http://www.omdbapi.com/?apikey=" + keys.omdb + "&t=" + movie)
        .then(function (response) {
            if ("Error" in response.data) {
                console.log("Movie not found");
            } else {
                console.log("Title: " + response.data.Title);
                console.log("Year: " + response.data.Year);
                console.log("IMDB Rating: " + response.data.Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                console.log("Country: " + response.data.Country);
                console.log("Language: " + response.data.Language);
                console.log("Plot: " + response.data.Plot);
                console.log("Actors: " + response.data.Actors);
            }
        }).catch(function (error) {
            console.log("There was an error trying to find that movie.");
        });
} else if (command === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (err, contents) {
        console.log(contents);
    });
}
