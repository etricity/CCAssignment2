const db = firebase.database();

var params = getHashParams();
console.log(params);
var access_token = params.access_token,
  refresh_token = params.refresh_token,
  userID = params.id;

var data = [];


//Reuqest user's top tracks & artists from Spotify
function getPersonalisedData() {

  const p1 = getTracks();
  const p2 = getArtists();
  const p3 = getArticlePromise(userID);

  Promise.all([p1, p2, p3]).then(function(values) {
    data = values;
    success(values);
  });
}
function getTracks() {
  return $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'tracks',
      headers: {
        'Authorization': 'Bearer ' + params.access_token
      }
    });
}

function getArtists() {
  return  $.ajax({
      url: 'https://api.spotify.com/v1/me/top/' + 'artists',
      headers: {
        'Authorization': 'Bearer ' + params.access_token
      }
    });
}

function getArticlePromise(id) {
  // Request user's SPADE data from firebase
  console.log(id);
  var usersRef = db.ref("users");
  return usersRef.orderByKey().equalTo(id).once("value").then(function(snapshot) {
      // The Promise was "fulfilled" (it succeeded).
      return snapshot.val();

    });
}

function addTopSongs() {
  //Request to server
  //Client-->Spotify
  var uris = [];
  console.log(data);

  data[0].items.forEach((element) => {
    uris.push(element.uri);
  });
console.log(uris);

  $.ajax({
    url: '/spotify/addTrackToPlaylist',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    data: {
      name: 'SPADE',
      description: 'Songs added via SPADE',
      userID: userID,
      trackData: {
        trackURI: uris,
        trackID: '',
        trackName: '',
      },
        multiTracks: 'true',
      access_token: access_token
    },
    success: () => {
      data[0].items.forEach((element) => {
        firebase.analytics().logEvent('addTrackToPlaylist', {
          trackName: element.name
        });
      });
    }
  });
}
