const db = firebase.database();

var params = getHashParams();
var access_token = params.access_token,
  refresh_token = params.refresh_token;

var data = [];


//Reuqest user's top tracks & artists from Spotify
function getPersonalisedData() {
  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/' + 'tracks',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function (topTracks) {
      data.push(topTracks);
    }
  });

  $.ajax({
    url: 'https://api.spotify.com/v1/me/top/' + 'artists',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: function (topArtists) {
      data.push(topArtists);
      success(data);
    }
  });

  //Request user's SPADE data from firebase
  var usersRef = db.ref("users");
  usersRef.orderByKey().equalTo('bvrtpgo0cdzuo4i1htm78rvea').once("value", function(snapshot) {
    console.log(snapshot.val());
    data.push(snapshot.val());

  });
}
