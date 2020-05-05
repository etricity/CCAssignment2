//Utility Functions
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

//Utility to sort 2D Array By Column
function sortBySecondColumn(x, y) {
  if (x[1] === y[1]) {
    return 0;
  } else {
    return x[1] < y[1] ? -1 : 1;
  }
}
