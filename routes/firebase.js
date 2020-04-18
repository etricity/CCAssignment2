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
  //EN_TEST-- REMOVE ON FURTHER DEVELOPMENT
  test: () => {console.log('test');},

  saveData: function(data) {
    var ref = db.ref("SPADE");
    var usersRef = ref.child("users");


    usersRef.set({
      alanisawesome: {
        date_of_birth: "June 23, 1912",
        full_name: "Alan Turing"
      }
    }, function(err) {
      if (err) {
        console.log('Creation Error');
      } else {
        console.log('Data Created!');
      }
    });

    var hopperRef = usersRef.child("gracehop");
    usersRef.update({
      "alanisawesome/nickname": "Alan The Machine"
    }, function(err) {
      if (err) {
        console.log('Creation Error');
      } else {
        console.log('Data Updated!');
      }
    });
  },
  getData: function() {

    var url = 'https://spade-274202.firebaseio.com/SPADE/users.json?';
    url += querystring.stringify({
      print: 'pretty'
    });
    var options = {
      url: url,
      json: true
    };
    request.get(options, function(error, response, data) {
      console.log('Test Firebase Data: ', data);
    });
  },
  //END_TEST
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
    /*
    IF Search NOT exists in DB
      Save search data
    ELSE
      searchCounter++;
    */

    /*Save last search of current user
      user.lastSearch = latestSearch
    */

  }
};

var usersRef = db.ref("users");

usersRef.orderByKey().equalTo('new').once("value", function(snapshot) {
  console.log(snapshot.val());

}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});



// usersRef.child("alanisawesome").set({
//   date_of_birth: "June 23, 1912",
//   full_name: "Alan Turing"
// });
//
// usersRef.child("aaracehop").set({
//   date_of_birth: "December 9, 1906",
//   full_name: "Grace Hopper"
// });
