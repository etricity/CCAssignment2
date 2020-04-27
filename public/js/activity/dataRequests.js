const db = firebase.database();

var params = getHashParams();
var access_token = params.access_token,
  refresh_token = params.refresh_token,
  userID = params.userID;

var data = [];


//Reuqest user's top tracks & artists from Spotify
function getPersonalisedData() {

  const p1 = getTracks();
  const p2 = getArtists();
  const p3 = getArticlePromise(userID);

  Promise.all([p1, p2, p3]).then(function(values) {
    success(values);
  });
}
function getTracks() {
  return $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'tracks',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
}

function getArtists() {
  return  $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'artists',
      headers: {
        'Authorization': 'Bearer ' + access_token
      }
    });
}

function getArticlePromise(id) {
  // Request user's SPADE data from firebase
  var usersRef = db.ref("users");
  return usersRef.orderByKey().equalTo(id).once("value").then(function(snapshot) {
      // The Promise was "fulfilled" (it succeeded).
      return snapshot.val();

    });
}
