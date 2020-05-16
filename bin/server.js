#!/usr/bin/env node

// Module dependencies --> Imports
var app = require('../app');
const PORT = 8080;

//Test purposes
app.listen(PORT, function() {
  console.log('Test server listening on port ' + PORT + '!')

})
