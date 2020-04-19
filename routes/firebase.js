var admin = require("firebase-admin");
var serviceAccount = require("./ServiceAccountKey.json");
var querystring = require('querystring');
var request = require('request');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spade-274202.firebaseio.com"
});

var db = admin.database();
var currentUserRef;

module.exports = {
  /*
  @param userData: JSON Object from Spotify API Call containing te user's spotify profile data
  @return: void
  @desciption: Queries Google Firebase to log a new or existing user.
  If it is the user's first login, they are created in the database.
  A reference to the user in the Google Firebase is created.
   */
  logUser: function(userData) {

    //Check if user already exists
    var usersRef = db.ref("users");
    usersRef.orderByKey().equalTo(userData.id).once("value", function(snapshot) {
      console.log(snapshot.val());

      //IF the user does not exist, create them
      if (snapshot.val() === null) {
        console.log('User does not exist in our database. Adding User...');
        usersRef.child(userData.id).set({
          display_name: userData.display_name,
          email: userData.email,
          country: userData.country,
          //Will not be added to the DB. Here purely for user model reference
          searchHist: null,
          lastSearch: null,
          loginCount: 0,
        });
        //ELSE --> do noting
      } else {
        console.log('User Already Exists in our Database');
      }

      //Initlise DB reference for current user to save data
      currentUserRef = usersRef.child(userData.id);
      //loginCounter++
      var loginCountRef = db.ref("users/" + userData.id + "/loginCount");
      loginCountRef.transaction(function(current_value) {
        return (current_value || 0) + 1;
      });
      //error handling
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  },
  /*
  @param searchResult: Array of JSON Objects from Spotify API Call containing track, artist & album objects.
  @return: void
  @desciption: Queries Google Firebase to log a new or existing search
  If it is the first time the search as been done, it is created in the database.
   */
  saveSearch: function(searchResult) {

    //Check if search already exists
    var searchRef = db.ref("searches");
    searchRef.orderByKey().equalTo(searchResult.tracks.items[0].id).once("value", function(snapshot) {
      console.log(snapshot.val());

      //IF search doesn't exist, create it
      if (snapshot.val() === null) {
        console.log("New Search!");
        searchRef.child(searchResult.tracks.items[0].id).set({
          name: searchResult.tracks.items[0].name,
          artist: searchResult.tracks.items[0].artists[0].name,
          album: searchResult.tracks.items[0].album.name,
          counter: 1
        });
        //ELSE--> update search counter
      } else {
        console.log('Search logged!');
        var counterRef = db.ref("searches/" + searchResult.tracks.items[0].id + "/counter");
        counterRef.transaction(function(current_value) {
          return (current_value || 0) + 1;
        });
      }
      //Update user's search history
      var userSeachHist = currentUserRef.child('searchHist');
      userSeachHist.push().set({
        searchID: searchResult.tracks.items[0].id,
        songname: searchResult.tracks.items[0].name
});
      //Update user's last search
      currentUserRef.update({
        lastSearch: searchResult.tracks.items[0].id
      });
      //error handling
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }
};
