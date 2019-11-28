require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var axios = require("axios");
var moment = require("moment");

var spotify = new Spotify(keys.spotify);
var command = process.argv[2];

if (command === "concert-this") {
    var artist = process.argv.slice(3).join(" ");
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
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
        }).catch(function(error) {
            console.log("There was an error trying to find that artist.");
        });
}

