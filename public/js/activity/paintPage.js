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
//   drawSearchHist(searchHist);
  // drawSearchHist(searchHist);
}
function drawTopSongs(data) {

    var tableRef = document
    .getElementById("songsTable")
    .getElementsByTagName("tbody")[0];

  data.items.forEach((element) => {
    var myHtmlContent = element.name;
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
  });
}

function drawTopArtists(data) {
  var tableRef = document
    .getElementById("artistTable")
    .getElementsByTagName("tbody")[0];

  data.items.forEach((element) => {
    var myHtmlContent =  "<p>" + element.name + "</p>" ;
    var newRow = tableRef.insertRow(tableRef.rows.length);
    newRow.innerHTML = myHtmlContent;
  });
}


function drawSearchHist(data) {
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
    dataToWrite.addColumn("string", "Topping");
    dataToWrite.addColumn("number", "Slices");

    Object.keys(data).forEach(function(k){ // gets each user, single itteration 
        
        var obj = data[k].searchHist; //assigns search History 

        Object.keys(obj).forEach(function(i){

            // console.log(obj[i].songname);
            var thisName = obj[i].songname;

            var isThere = false;
            for (x = 0; x< i; x++){

                console.log(dataToWrite.getProperty(x, 1, thisName));

                if (dataToWrite.getProperty(x, 1, thisName)){
                    isThere = true;

                }
            }



            if (isThere){
                //if song there, increase count


            }else{
            // else add song 

    
            dataToWrite.addRows([
                [thisName, 1]
            ]);
            }


        });
    });


    
    console.log(dataToWrite)

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

function testHist(data){


    Object.keys(data).forEach(function(k){
        console.log(data[k]);
        var obj = data[k].searchHist;
        Object.keys(obj).forEach(function(k){
            console.log(obj[k].songname);
        });
    });
}