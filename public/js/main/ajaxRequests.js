var userData;
var currentTrack;
  var params = getHashParams();
  var access_token = params.access_token,
    refresh_token = params.refresh_token;


  function getUserData() {
    $.ajax({
      url: 'https://api.spotify.com/v1/me',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      success: function (response) {
        userData = response;
        paintPage(response);
      }
    });
  }


  function getSearchData() {
    //Variable for API call data
    var data;

    //Request to server
    //Client --> Server --> Spotify --> Server --> Client
    $.ajax({
      url: '/spotify/search',
      headers: {
        'Authorization': 'Bearer ' + access_token
      },
      data: {
        song_name: document.getElementById("song-name").value,
        access_token: access_token
      },
      success: success,
      error: error
    });
  }

  function addTrackToPlaylist() {
    //Request to server
    //Client-->Spotify
    if (currentTrack) {
      $.ajax({
        url: '/spotify/addTrackToPlaylist',
        headers: {
          'Authorization': 'Bearer ' + access_token
        },
        data: {
          name: 'SPADE',
          description: 'Songs added via SPADE',
          userID: userData.id,
          trackData: {
            trackURI: currentTrack.uri,
            trackID: currentTrack.id,
            trackName: currentTrack.name
          },
          access_token: access_token
        }
      });
    }
  }

  //Utility Function
  function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
