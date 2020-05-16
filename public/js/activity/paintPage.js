function paintPage(data) {
  //Sends Data To the Main Page Area
  drawCharts(data);
  //Sends Data To The Nav and Title area
  paintDashboard();
}

function drawCharts(data) {
  console.log(data);
  var topSongs = data[0];
  var topArtist = data[1];
  var searchHistory = data[2];

  //Writes User History
  drawSearchHist(searchHistory);
  //Writes Top 20 Songs
  drawTopSongs(topSongs);
  //Writes Top 20 Artists
  drawTopArtists(topArtist);
  drawLoginCount(searchHistory);
}

/** Writes Top Songs To Div id="songsTable"
 *
 * @param {Top Songs As JSON, handles unspecified count} data
 */
function drawTopSongs(data) {
  //tableRef As: Reference to the table "songsTable"
  var tableRef = document
    .getElementById("songsTable")
    .getElementsByTagName("tbody")[0];
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
  var tableRef = document
    .getElementById("artistTable")
    .getElementsByTagName("tbody")[0];
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
  /**
   * Songs Searched In App
   */
  // Sanitise the Data: searchData[i][{Song Name, Song Count}]
  var searchData = collapseData(data);
  // Sort the Data: searchData[i][{Song Name, Song Count}] where Sorted by Song Count Field
  searchData.sort(sortBySecondColumn);

  /**
   * Songs Added To Spotify Through App
   */
  // Sanitise the Data: saveData[i][{Song Name, Add Count}]
  var saveData = collapseSavedTracksData(data);
  // Sort the Data: saveData[i][{Song Name, Add Count}] where Sorted by Add Count Field
  saveData.sort(sortBySecondColumn);

  //Assuming there are more than 1 Points Of Data, prepare a call back
  if (searchData.length > 1 || saveData.length > 1) {
    // Load the Visualization API and the corechart package.
    google.charts.load("current", { packages: ["corechart"] });
    // Set a callback to run when the Google Visualization API is loaded.
    google.charts.setOnLoadCallback(drawChart);
    // Callback that creates and populates a data table,
    // instantiates the pie chart, passes in the data and
    // draws it.
  }

  // Chart Drawing Callback
  function drawChart() {
    /**
     * DRAW SEARCHED SONG HISTORY
     *
     * Contains individual Scope
     */
    {
      // Create the data table.
      var dataToWrite = new google.visualization.DataTable();
      dataToWrite.addColumn("string", "Songs");
      dataToWrite.addColumn("number", "Count");

      for (var count = 1; count < searchData.length; count++) {
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
        // Fetch Ratios of search as PieChart
        document.getElementById("songname")
      );
      chart.draw(dataToWrite, options);
    }

    /**
     * DRAW ADDED SONGD
     * Uses Simliarily named variables, Scope block to avoid naming conflicts
     *  */

    {
      // Create the data table.
      var dataToWrite = new google.visualization.DataTable();
      dataToWrite.addColumn("string", "Songs");
      dataToWrite.addColumn("number", "Count");

      for (var count = 0; count < saveData.length; count++) {
        dataToWrite.addRows([saveData[count]]);
      }

      // Set chart options
      var options = {
        title: "Songs You Added To Spotify",
        width: 400,
        height: 300,
      };
      // Instantiate and draw our chart, passing in some options.
      var chart = new google.visualization.BarChart(
        document.getElementById("trackName")
      );
      chart.draw(dataToWrite, options);
    } // END SCOPE CONTAINER
  }
}

/** Utility to Flatten an array of strings into a 2d array, {string, occurence of string}
 *
 * @param {String[] arrayToFlatten} data
 */
function collapseData(data) {
  var records = new Array(0);
  // gets each user, single itteration
  Object.keys(data).forEach(function (k) {
    var entries = 0;
    //Obj is search History
    var history = data[k].searchHist;
    var historySize = Object.keys(history).length;
    var names = new Array(0);
    // Add all song names to an array
    Object.keys(history).forEach(function (i) {
      names.push(history[i].songname);
    });
    //ASSUME ALPHA SORTED
    names.sort();

    // FOR EACH ELEMENT OF THE SORTED ARRAY
    for (var index = 0; index < historySize; index++) {
      // IF NOT FIRST SONG
      if (entries > 0) {
        var found = false;

        //CHECKS IF FOUND previousyly
        for (var moving = 0; moving < entries; moving++) {
          if (records[moving][0] == names[index]) {
            //AS FOUND ALREADY, INCREASE COUNT
            records[moving][1] = records[moving][1] + 1;
            found = true;
          }
        } //END IF FOUND
        //IF NOT FOUND, ADD
        if (found == false) {
          records[entries] = new Array(0);
          records[entries].push(names[index]);
          records[entries].push(1);
          entries++;
        }
      } else {
        /**
         * First Song is Automatically Added
         */
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

/** Utility to Flatten an array of strings into a 2d array, {string, occurence of string}
 *
 * @param {String[] arrayToFlatten} data
 */
function collapseSavedTracksData(data) {
  var records = new Array(0);
  // gets each user, single itteration
  Object.keys(data).forEach(function (k) {
    var entries = 0;
    //Obj is search History
    var history = data[k].savedTracks;
    var historySize = Object.keys(history).length;
    var names = new Array(0);
    // Add all song names to an array
    Object.keys(history).forEach(function (i) {
      names.push(history[i].trackName);
    });
    //ASSUME ALPHA SORTED
    names.sort();

    // FOR EACH ELEMENT OF THE SORTED ARRAY
    for (var index = 0; index < historySize; index++) {
      // IF NOT FIRST SONG
      if (entries > 0) {
        var found = false;

        //CHECKS IF FOUND previousyly
        for (var moving = 0; moving < entries; moving++) {
          if (records[moving][0] == names[index]) {
            //AS FOUND ALREADY, INCREASE COUNT
            records[moving][1] = records[moving][1] + 1;
            found = true;
          }
        } //END IF FOUND
        //IF NOT FOUND, ADD
        if (found == false) {
          records[entries] = new Array(0);
          records[entries].push(names[index]);
          records[entries].push(1);
          entries++;
        }
      } else {
        /**
         * First Song is Automatically Added
         */
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

/** TESTING CLASS FOR DATA SANITY
 *
 * @param {JSON[]} data
 */
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

/** Utility To Print The Number of Times you Logged in.
 *
 * @param {Firebase User Item: loginCount Required} data
 */
function drawLoginCount(data) {
  Object.keys(data).forEach(function (k) {
    var loginCount = data[k].loginCount;
    if (loginCount) {
      document.getElementById("loginCount").innerText =
        "You Have Logged In " + loginCount + " Times.";
    }
  });
}
