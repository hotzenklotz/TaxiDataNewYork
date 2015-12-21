var fs = require("fs");
var OSRM = require('osrm')
var parse = require('csv-parse');
var stringify = require('csv-stringify');
var transform = require('stream-transform');

var CSV_FILE = "/Users/therold/Google Drive/Uni/Machine Translation/week3/news_10000.csv";
var ORM_FILE = "nyc.xyz";

var inputStream = fs.createReadStream(CSV_FILE);
var outputStream = fs.createWriteStream("distance_table.csv");
var OSRM = new OSRM(ORM_FILE);

// Parser - Parses the CSV input into Array-type records
var CSVParser = parse({
  delimiter : ",",
  relax: true // Ignore double-quote vs. single quote issues
});

// Transformer - Calculates route distance and appends it to a record
var transformer = transform(function(record, callback) {

  callback(null, record);

  // TODO validatate row numbers for records
  var coord_start = [record[12], record[13]];
  var coord_end = [record[14], record[15]];
  var query = {coordinates: [coord_start, coord_end]};

  // Query OSRM for a route between our two points
  osrm.route(query, function (err, result) {

    // In case of an routing error make sure, that the record has a
    // default 'null' value in order get the same column count as all other records.
    if (err)
      record.push(null);
      callback(null, record)

    // Add route distance to record
    var distance = result.route_summary.total_distance;
    //console.log(distance)
    record.push(distance);
    callback(null, record);
  });
});

// Stringifier - Converts records back into CSV strings
var stringifier = stringify();

// Start the streaming
inputStream
  .pipe(CSVParser)
  .pipe(transformer)
  .pipe(stringifier)
  .pipe(outputStream);

