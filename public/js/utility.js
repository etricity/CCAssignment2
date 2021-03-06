//Utility Functions
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=+]+)=?([^&;+]*)/g,
    q = window.location.hash.substring(1);
  while (e = r.exec(q)) {
    hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  console.log(hashParams);
  return hashParams;
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
