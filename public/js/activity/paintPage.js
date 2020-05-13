function paintPage(data) {
  //Sends Data To the Main Page Area
  drawCharts(data);
  //Sends Data To The Nav and Title area
  paintDashboard();
}
function drawCharts(data) {
  var topSongs = data[0];
  var topArtist = data[1];
  var searchHistory = data[2];

  //Writes User History
  drawSearchHist(searchHistory);
  //Writes Top 20 Songs
  drawTopSongs(topSongs);
  //Writes Top 20 Artists
  drawTopArtists(topArtist);
}

/** Writes Top Songs To Div id="songsTable"
 * 
 * @param {Top Songs As JSON, handles unspecified count} data 
 */
function drawTopSongs(data) {
  //tableRef As: Reference to the table "songsTable"
  var tableRef = document.getElementById("songsTable").getElementsByTagName("tbody")[0];
  //Start Song Count at: 1
  var count = 1;
  //For Each Song in Top Songs
  data.items.forEach((element) => {
    //Song Displays as: "1. Song Name"
    var myHtmlContent = "<p>" + count + ". " + element.name + "</p>";
    var newRow = tableRef.insertRow(tableRef.rows.length);
    //New Row For Each Song Inserted
    newRow.innerHTML = myHtmlContent;
    count++;
  });
}

/** Writes Top Artists To Div id="artistTable"
 * 
 * @param {Top Artists As JSON, handles unspecified count} data 
 */
function drawTopArtists(data) {
  //tableRef As: Reference to the table "artistTable"
  var tableRef = document.getElementById("artistTable").getElementsByTagName("tbody")[0];
  //Start Song Count at: 1
  var count = 1;
  //For Each Artists in Top Artist
  data.items.forEach((element) => {
    //Artist Displays as: "1. Artist Name"
    var myHtmlContent = "<p>" + count + ". " + element.name + "</p>";
    var newRow = tableRef.insertRow(tableRef.rows.length);
    //New Row For Each Artist Inserted
    newRow.innerHTML = myHtmlContent;
    count++;
  });
}



/** Writes Personal Firebase Data To Div id="activityTables"
 * 
 *  Takes In All User Data From Firebase And Draws Relevant Data To Screen
 * 
 * @param {Personal Firebase History, handles unspecified count} data 
 */
function drawSearchHist(data) {
  // Sanitise the Data: 
  var searchData = collapseData(data);
  searchData.sort(sortBySecondColumn);
  console.log(searchData);

  var saveData = collapseSavedTracksData(data);
  saveData.sort(sortBySecondColumn);
  console.log(saveData);

  if (searchData.length > 1){
    // Load the Visualization API and the corechart package.
    google.charts.load("current", { packages: ["corechart"] });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
  }


  function drawChart() {
    // Create the data table.
    var dataToWrite = new google.visualization.DataTable();
    dataToWrite.addColumn("string", "Songs");
    dataToWrite.addColumn("number", "Count");

    for (var count = 1; count < searchData.length; count++) {
      //   newData[count].pop;
      dataToWrite.addRows([searchData[count]]);
    }

    // Set chart options
    var options = {
      title: "Your Search History",
      width: 400,
      height: 300,
    };
    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById("songname")
    );
    chart.draw(dataToWrite, options);

    // DRAW ADD SONG

     // Create the data table.
     var dataAddedToWrite = new google.visualization.DataTable();
     dataAddedToWrite.addColumn("string", "Songs");
     dataAddedToWrite.addColumn("number", "Count");

     for (var count = 0; count < saveData.length; count++) {
       //   newData[count].pop;
       dataAddedToWrite.addRows([saveData[count]]);
     }

     // Set chart options
     var opt = {
       title: "Songs You Added To Spotify",
       width: 400,
       height: 300,
     };
     // Instantiate and draw our chart, passing in some options.
     var char = new google.visualization.BarChart(
       document.getElementById("trackName")
     );
     char.draw(dataAddedToWrite, opt);






  }




}

function collapseData(data) {
  var records = new Array(0);
  // gets each user, single itteration
  Object.keys(data).forEach(function (k) {
    var entries = 0;
    //Obj is search History
    var obj = data[k].searchHist;

    var loginCount = data[k].loginCount;

    if (loginCount){
      document.getElementById("loginCount").innerText = "You Have Logged In " + loginCount + " Times."

    }

    var historySize = Object.keys(obj).length;
    var names = new Array(0);
    Object.keys(obj).forEach(function (i) {
      var thisName = obj[i].songname;
      names.push(thisName);
    });
    names.sort();
    for (var index = 0; index < historySize; index++) {
      if (entries > 0) {
        var found = false;

        for (var moving = 0; moving < entries; moving++) {
          if (records[moving][0] == names[index]) {
            records[moving][1] = records[moving][1] + 1;
            found = true;
          }
        }
        if (found == false) {
          records[entries] = new Array(0);
          records[entries].push(names[index]);
          records[entries].push(1);
          entries++;
        }
      } else {
        // FIRST ITTERATION
        records[entries] = new Array(0);
        records[entries].push(names[entries]);
        records[entries].push(1);
        entries++;
      }
    }
  });
  return records;
}


function collapseSavedTracksData(data) {
  var records = new Array(0);
  // gets each user, single itteration
  Object.keys(data).forEach(function (k) {
    var entries = 0;
    //Obj is search History
    var obj = data[k].savedTracks;
    var historySize = Object.keys(obj).length;
    var names = new Array(0);
    Object.keys(obj).forEach(function (i) {
      var thisName = obj[i].trackName;
      names.push(thisName);
    });
    names.sort();
    for (var index = 0; index < historySize; index++) {
      if (entries > 0) {
        var found = false;

        for (var moving = 0; moving < entries; moving++) {
          if (records[moving][0] == names[index]) {
            records[moving][1] = records[moving][1] + 1;
            found = true;
          }
        }
        if (found == false) {
          records[entries] = new Array(0);
          records[entries].push(names[index]);
          records[entries].push(1);
          entries++;
        }
      } else {
        // FIRST ITTERATION
        records[entries] = new Array(0);
        records[entries].push(names[entries]);
        records[entries].push(1);
        entries++;
      }
    }
  });
  return records;
}

function paintDashboard() {
  document.getElementById("greeting").innerText = params.name;
  document.getElementById("name").innerText = params.name;
  document.getElementById("email").innerText = params.email;
  document.getElementById("country").innerText = params.country;
  document.getElementById("product").innerText = params.product;
}




function testHist(data) {
  Object.keys(data).forEach(function (k) {
    console.log(data[k]);
    var obj = data[k].searchHist;
    Object.keys(obj).forEach(function (k) {
      console.log(obj[k].songname);
    });
  });
}


/** Utility to sort 2D Array By Column
 * 
 * @param {First Array To Compare} x 
 * @param {Second Array To Compare} y 
 */
function sortBySecondColumn(x, y) {
  if (x[1] === y[1]) {
    return 0;
  } else {
    return x[1] < y[1] ? -1 : 1;
  }
}
