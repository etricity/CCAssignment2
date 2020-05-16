function paintPage(response) {
  document.getElementById("greeting").innerText = response.display_name;
  document.getElementById("name").innerText = response.display_name;
  document.getElementById("email").innerText = response.email;
  document.getElementById("country").innerText = response.country;
  document.getElementById("product").innerText = response.product;
}

function paintSongData(data) {

  document.getElementById("result-name").innerText = data.tracks.items[0].name;
  document.getElementById("artist").innerText = data.tracks.items[0].artists[0].name;
  document.getElementById("album").innerText = data.tracks.items[0].album.name;
  document.getElementById("popularity").innerText = data.tracks.items[0].popularity;
  document.getElementById("song-div").style.visibility = "visible";

  var video_url = data.tracks.items[0].preview_url;
  var vid = document.getElementById("preview-url");

  if (video_url == null) {
    // vid.style.display = "none";
    document.getElementById("song-found").innerHTML = '"<div id="song-link"><a href="' + data.tracks.items[0].external_urls.spotify + '">Song</a></div>';
  } else {
    if (document.getElementById("preview-url")) {
      document.getElementById("preview-url").pause();
      document.getElementById("preview-url").display = "visible";
    }
    document.getElementById("song-found").innerHTML = '<audio id="preview-url" controls="" name="media"> <source src="' + video_url + '" type="audio/mpeg" > </audio>';
    document.getElementById("preview-url").load();
    document.getElementById("preview-url").style.display = "inline";
  }
}

function paintArtistData(data) {
  document.getElementById("artist-image").innerHTML = '<img src="' + data.artists.items[0].images[0].url + '" alt= "" style="width:10em;"  > ';
  document.getElementById("artist-name").innerText = data.artists.items[0].name;
  document.getElementById("followers").innerText = data.artists.items[0].followers.total;
  document.getElementById("follow-link").innerHTML = '<a href="' + data.artists.items[0].external_urls.spotify + '">Follow</a>';
  document.getElementById("artist-div").style.visibility = "visible";
}

function paintAlbumData(data) {

  document.getElementById("album-image").innerHTML = '<img src="' + data.albums.items[0].images[0].url + '" alt= "" style="width:10em;"  > ';

  document.getElementById("album-name").innerText = data.albums.items[0].name;
  document.getElementById("release-date").innerText = data.albums.items[0].release_date;
  document.getElementById("album-type").innerText = data.albums.items[0].album_type;
  document.getElementById("total-tracks").innerText = data.albums.items[0].total_tracks;
  document.getElementById("album-div").style.visibility = "visible";
}
function paintTranslated(data, lang) {
  console.log('DATA TO BE REPAINTED');
  console.log(data);
  document.getElementById("result").setAttribute("lang", lang);
  console.log(  document.getElementById("result"));

  document.getElementById("SN").innerText = data[0];
  document.getElementById("AR").innerText = data[1];
  document.getElementById("AL").innerText = data[2];
  document.getElementById("PR").innerText = data[3];
  document.getElementById("AN").innerText = data[4];
  document.getElementById("RD").innerText = data[5];
  document.getElementById("ALT").innerText = data[6];
  document.getElementById("TT").innerText = data[7];
  document.getElementById("ARN").innerText = data[8];
  document.getElementById("F").innerText = data[9];


}
