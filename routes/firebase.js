var admin = require("firebase-admin");
var serviceAccount = require("./ServiceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spade-274202.firebaseio.com"
});
var db = admin.database();

module.exports = {
  test: () => {console.log('test');},
  saveData: function() {
    var ref = db.ref("server/saving-data/fireblog");
    var usersRef = ref.child("users");
    usersRef.set({
      alanisawesome: {
        date_of_birth: "June 23, 1912",
        full_name: "Alan Turing"
      },
      gracehop: {
        date_of_birth: "December 9, 1906",
        full_name: "Grace Hopper"
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
      "alanisawesome/nickname": "Alan The Machine",
      "gracehop/nickname": "Amazing Grace"
    }, function(err) {
      if (err) {
        console.log('Creation Error');
      } else {
        console.log('Data Updated!');
      }
    });
  }
};
