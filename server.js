var http = require('http');
var url = require('url');
var fs = require('fs');
var formidable = require('formidable');
var nodemailer = require('nodemailer');
var util = require('util');
var mysql = require('mysql');
//var oracledb = require('oracledb');
var dt = require('./modules/genika')

http.createServer(function(req, res) {
  //res.writeHead(200, {'Content-Type': 'text/html'});
  //res.write('Hello World!');
  //res.write("The date and time are currently: " + dt.myDateTime());
  //res.write(req.url);
  //var q = url.parse(req.url, true).query;
  //var txt = q.year + " " + q.month;
  //res.end(txt);
  //res.end();
  //
  //var adr = 'http://localhost:8080/default.htm?year=2017&month=february';
  //var q = url.parse(adr, true);
  //console.log(q.host); returns 'localhost:8080'
  //console.log(q.pathname); returns '/default.htm'
  //console.log(q.search); returns '?year=2017&month=february'
  //var qdata = q.query; returns an object: { year: 2017, month: 'february' }
  //console.log(qdata.month); returns 'february'
  //
  //fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
  //if (err) throw err;
  //console.log('Saved!');
  //});
  //
  //fs.open('mynewfile2.txt', 'w', function (err, file) {
  //if (err) throw err;
  //console.log('Saved!');
  //});
  //
  //fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
  //if (err) throw err;
  //console.log('Saved!');
  //});
  //
  //fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
  //if (err) throw err;
  //console.log('Saved!');
  //});
  //
  //fs.rename('mynewfile1.txt', 'myrenamedfile.txt', function (err) {
  //if (err) throw err;
  //console.log('File Renamed!');
  //});
  //
  /*
  http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    var filename = "." + q.pathname;
    fs.readFile(filename, function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }).listen(8085);
   */
  //
  //var uc = require('upper-case');
  //http.createServer(function (req, res) {
  //  res.writeHead(200, {'Content-Type': 'text/html'});
  //  res.write(uc("Hello World!"));
  //  res.end();
  //}).listen(8085);
  //
  //var rs = fs.createReadStream('./public_html/index.html');
  //rs.on('open', function() {
  //  console.log('The file is open');
  //});
  //
  //var events = require('events');
  //var eventEmitter = new events.EventEmitter();
  //
  //Create an event handler:
  //var myEventHandler = function () {
  //  console.log('I hear a scream!');
  //}
  //
  //Assign the event handler to an event:
  //eventEmitter.on('scream', myEventHandler);
  //
  //Fire the 'scream' event:
  //eventEmitter.emit('scream');
  //
  /*
  if (req.url == '/nodesite/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = '/home/nikolaos/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function(err) {
        if (err)
          throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
  } else {
    fs.readFile('./public_html/index.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }*/
  var con = mysql.createConnection({host: "localhost", user: "testuser", password: "test00", database: "testdb"});

  con.connect(function(err) {
    if (err)
      throw err;
    con.query("SELECT * FROM customers", function(err, result, fields) {
      if (err)
        throw err;
      var $table = 
      console.log(result);
    });
  });
/*
  oracledb.getConnection(
  {
    user          : "c##elogistics",
    password      : "elogistics",
    connectString : "neptune.home.net/ORCL"
  },
  function(err, connection)
  {
    if (err) { console.error(err); return; }
    connection.execute(
      "SELECT * "
    + "FROM dm_bathmos",
      function(err, result)
      {
        if (err) { console.error(err); return; }
        console.log(result.rows);
      });
  });
*/
  if (req.url == '/sendmessage') {
    var form = new formidable.IncomingForm();
    var msglog = '--';
    console.log('Sending mail...');
    form.parse(req, function(err, fields, files) {
      //console.log(util.inspect({fields: fields, files: files}));
      //console.log(fields);
      //console.log(files);

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'nikolaos.bellias@gmail.com',
          pass: 'nfzcaqutksimbadp'
        }
      });

      var mailOptionsToCustomer = {
        from: 'nikolaos.bellias@gmail.com', //auth user above, Administrator
        to: fields.email,
        subject: 'Message From Administrator',
        text: "Your Message has been Received and is in the process of evaluation.\nThank you!"
      };
      
      var mailOptionsToAdministrator = {
        from: 'nikolaos.bellias@gmail.com', //auth user above, Administrator
        to: 'nikolaos.bellias@gmail.com', //self auth user above, Administrator
        subject: 'Message From Customer: ' + fields.email,
        text: 'Message From Customer: ' + fields.email + '\n' + fields.message
      };

      transporter.sendMail(mailOptionsToCustomer, function(error, info) {
        if (error) {
          console.log(error);
          msglog += 'Problem: Could not send emailToCustomer nor message!';
          
        } else {
          console.log('Email and message sentToCustomer: ' + info.response);
          msglog += 'Message SentToCustomer OK!';
        }
      });

      transporter.sendMail(mailOptionsToAdministrator, function(error, info) {
        if (error) {
          console.log(error);
          msglog += 'Problem: Could not send emailToAdministrator nor message!';
          
        } else {
          console.log('Email and message sentToAdministrator: ' + info.response);
          msglog += 'Message SentToAdministrator OK!';
          res.write(msglog);
          res.end();
        }
      });
      
    });

  } else if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var oldpath = files.filetoupload.path;
      var newpath = '/home/nikolaos/' + files.filetoupload.name;
      fs.rename(oldpath, newpath, function(err) {
        if (err)
          throw err;
        res.write('File uploaded and moved!');
        res.end();
      });
    });
  } else {
    fs.readFile('./public_html/index.html', function(err, data) {
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }
}).listen(8085);
