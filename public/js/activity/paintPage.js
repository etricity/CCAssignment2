function paintPage(data) {
  // this.data = data;
  drawCharts(data);
}

function drawCharts(data) {
  // console.log("TESTING");
  // console.log(data[1]);

  var topSongs = data[0];
  var topArtist = data[1];
  var searchHist = data[2];

  drawTopArtists(topArtist);
  drawTopSongs(topSongs);
  //   testHist(searchHist);
  drawSearchHist(searchHist);
}
function drawTopSongs(data) {
  var tableRef = document
    .getElementById("songsTable")
    .getElementsByTagName("tbody")[0];

  var count = 0;
  data.items.forEach((element) => {
    count++;
    var myHtmlContent = "<p>" + count + ". " + element.name + "</p>";
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
  });
}

function drawTopArtists(data) {
  var tableRef = document
    .getElementById("artistTable")
    .getElementsByTagName("tbody")[0];
  var count = 0;
  data.items.forEach((element) => {
    count++;
    var myHtmlContent = "<p>" + count + ". " + element.name + "</p>";
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
  });
}

//Utility to sort 2D Array By Column
function sortBySecondColumn(x, y) {
  if (x[1] === y[1]) {
    return 0;
  } else {
    return x[1] < y[1] ? -1 : 1;
  }
}

function drawSearchHist(data) {
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
      document.getElementById("chart_div songname")
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
       document.getElementById("chart_div trackName")
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






function testHist(data) {
  Object.keys(data).forEach(function (k) {
    console.log(data[k]);
    var obj = data[k].searchHist;
    Object.keys(obj).forEach(function (k) {
      console.log(obj[k].songname);
    });
  });
}
