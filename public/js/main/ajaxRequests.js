var userData;
var currentTrack;

var params = getHashParams();
var access_token = params.access_token,
  refresh_token = params.refresh_token;

function getUserData() {
  $.ajax({
    url: "https://api.spotify.com/v1/me",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    success: function (response) {
      userData = response;
      paintPage(response);

      console.log(response);

      var dashboardData = {
        id: response.id,
        name: response.display_name,
        country: response.country,
        email: response.email,
        product: response.product,
      };
      console.log(dashboardData);

      //Setting links for website navigation
      var params =
        window.location.hash.substr(1) + "&" + $.param(dashboardData);
      document
        .getElementById("activity")
        .setAttribute("href", "/spotify/activity/#" + params);
      document
        .getElementById("webplayer")
        .setAttribute("href", "/spotify/webplayer/#" + params);
      document.getElementById("logout").setAttribute("href", "/");
    },
  });
}

function getSearchData() {
  //Variable for API call data
  var data;

  //Request to server
  //Client --> Server --> Spotify --> Server --> Client
  $.ajax({
    url: "/spotify/search",
    headers: {
      Authorization: "Bearer " + access_token,
    },
    data: {
      song_name: document.getElementById("song-name").value,
      access_token: access_token,
    },
    success: success,
    error: error,
  });
}
//Data Request Successful!
function success(data) {
  if (data) {
    currentTrack = data[0].tracks.items[0];
    firebase.analytics().logEvent("search", {
      searchTerms: document.getElementById("song-name").value,
    });
    paintSongData(data[0]);
    paintArtistData(data[1]);
    paintAlbumData(data[2]);
  }
}
function error(error) {
  console.error(error);
}

function addTrackToPlaylist() {
  //Request to server
  //Client-->Spotify
  if (currentTrack) {
    $.ajax({
      url: "/spotify/addTrackToPlaylist",
      headers: {
        Authorization: "Bearer " + access_token,
      },
      data: {
        name: "SPADE",
        description: "Songs added via SPADE",
        userID: userData.id,
        trackData: {
          trackURI: currentTrack.uri,
          trackID: currentTrack.id,
          trackName: currentTrack.name,
        },
        access_token: access_token,
      },
    });
  }
}

//Google Translate Call
function changeLanguage() {
  var e = document.getElementById("lang");
  var lang = e.options[e.selectedIndex].value;

  var text = [
    "Song Name",
    "Artist",
    "Album",
    "Popularity Rating",
    "Album Name",
    "Release Date",
    "Album Type",
    "Total Tracks",
    "Artist Name",
    "Followers",
  ];

  if (currentTrack) {
    $.ajax({
      url: "/translate",
      data: {
        lang: lang,
        text: text,
      },
      success: (translateText) => {
        paintTranslated(translateText, lang);
      },
    });
  }
}
