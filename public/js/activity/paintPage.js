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

function drawSearchHist(data) {
    var newData = collapseData(data);
    console.log(newData);
  // Load the Visualization API and the corechart package.
  google.charts.load("current", { packages: ["corechart"] });
  // Set a callback to run when the Google Visualization API is loaded.
  google.charts.setOnLoadCallback(drawChart);
  // Callback that creates and populates a data table,
  // instantiates the pie chart, passes in the data and
  // draws it.

  function drawChart() {
    // Create the data table.
    var dataToWrite = new google.visualization.DataTable();
    dataToWrite.addColumn("string", "Songs");
    dataToWrite.addColumn("number", "Count");

    for (var count = 0; count < newData.length; count++) {
      dataToWrite.addRows([[newData[count][0], newData[count][1]]]);
    }

    // Set chart options
    var options = {
      title: "How Much Pizza I Ate Last Night",
      width: 400,
      height: 300,
    };

    // Instantiate and draw our chart, passing in some options.
    var chart = new google.visualization.PieChart(
      document.getElementById("chart_div")
    );

    chart.draw(dataToWrite, options);
  }
}



function collapseData(data) {
  var newData = [];
  Object.keys(data).forEach(function (k) {
    // gets each user, single itteration

    var obj = data[k].searchHist; //assigns search History
    var historySize = Object.keys(obj).length;

    newData = new Array(historySize);
    for (var i = 0; i <= historySize + 1; i++) {
      newData[i] = [0, 0];
    }
    var tempCount = 0;
    Object.keys(obj).forEach(function (i) {
      var thisName = obj[i].songname;
      var isNew = true;

      for (var x = 0; x <= historySize + 1; x++) {
        if (newData[x][0] == thisName) {
          isNew = false;
          newData[x][1] = newData[x][1] + 1;
        }
      }

      if (isNew) {
        newData.push([thisName, 1]);
        newData;
      }

      tempCount++;
    });
  });

  return newData;
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