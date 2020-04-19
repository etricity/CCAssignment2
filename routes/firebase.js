var admin = require("firebase-admin");
var serviceAccount = require("./ServiceAccountKey.json");
var querystring = require('querystring');
var request = require('request');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spade-274202.firebaseio.com"
});
var db = admin.database();

module.exports = {
  logUser: function(userData) {
    /*
    IF user NOT in  DB
      Save user data in DB
    ELSE
      loginCounter++;
    */

    //Query Databse to see if a user matching their Spotify display_name already exists
    var usersRef = db.ref("users");
    usersRef.orderByKey().equalTo(userData.id).once("value", function(snapshot) {
      console.log(snapshot.val());

      //IF the user does not exist, create them
      if(snapshot.val() === null) {
        console.log('User does not exist in our database. Adding User...');
        usersRef.child(userData.id).set({
          display_name: userData.display_name,
          email: userData.email,
          country: userData.country,
          //Will not be added to the DB. Here purely for user model reference
          searchHist: null,
          lastSearch: null,
        });

        //ELSE --> do noting
      } else {
        console.log('User Already Exists in our Database');
      }
      //error handling
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  },
  saveSearch: function(searchResult) {
    var searchRef = db.ref("searches");

    searchRef.orderByKey().equalTo(searchResult.tracks.items[0].id).once("value", function(snapshot) {
      console.log(snapshot.val());

      if(snapshot.val() === null) {
        console.log("New Search!");
        searchRef.child(searchResult.tracks.items[0].id).set({
          name: searchResult.tracks.items[0].name,
          counter: 1
        });
      } else {
        console.log('Search logged!');
        var counterRef = db.ref("searches/" + searchResult.tracks.items[0].id + "/counter");
        counterRef.transaction(function (current_value) {
      return (current_value || 0) + 1;
    });
      }

    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  }
};
