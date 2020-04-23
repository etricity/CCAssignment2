
function getUserData() {
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + access_token
    },
    success: success
  });
}
