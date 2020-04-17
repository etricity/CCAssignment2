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
  saveUser: function(userData) {
    /*
    IF user NOT in  DB
      Save user data in DB
    ELSE
      loginCounter++;
    */

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
