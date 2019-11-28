require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

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
}
