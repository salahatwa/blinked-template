//Create a server that can send back static files
const request = require('request');
const http = require("http");
const url = require("url");
const fs = require("fs");

//npm install --save request
//npm i mime-types
const lookup = require("mime-types").lookup;

console.log('Init  request....');
const server = http.createServer((req, res) => {
    console.log('Received request....');
  //handle the request and send back a static file
  //from a folder called `public`
  let parsedURL = url.parse(req.url, true);
  //remove the leading and trailing slashes
  let path = parsedURL.path.replace(/^\/+|\/+$/g, "");

  // get host & protocol

  var host = req.headers.host,
    subDomain = host.split("."),
    protocol = req.socket.encrypted ? "https" : "http";

  if (subDomain.length >= 2) {
    subDomain = subDomain[0].split("-").join(" ");
  }

  // Get user details by subdomain name [return template name ]
  request(
    "https://nodejs.org/api/documentation.json",
    function (error, response, body) {
      if (!error && response.statusCode === 200) {
        // console.log(body); // Print the google web page.
        console.log('Get Sample response success');
      }
    }
  );

  console.log(req.headers);
  var userAgent = req.headers['X-Real-IP']; 

  console.log("userAgent:",userAgent);
  console.log("Template Path:", host);
  console.log("Subdomain:", subDomain);
  console.log("Subdomain length:", subDomain.length);
  console.log("Protocol:", protocol);
  //   console.log(req);
  /**
   *  /
   *  /index.html
   *
   *  /main.css
   *  /main.js
   */
  if (path == "") {
    path = "index.html";
  }
  console.log(`Requested path ${path} `);

  let file = __dirname + "/templates/" + subDomain + "/" + path;
  console.log(__dirname);
  //async read file function uses callback
  fs.readFile(file, function (err, content) {
    if (err) {
      console.log(`File Not Found ${file}`);
      res.writeHead(404);
      res.end();
    } else {
      //specify the content type in the response
      console.log(`Returning ${path}`);
      res.setHeader("X-Content-Type-Options", "nosniff");
      //   res.setHeader("USER", subDomain);

      let mime = lookup(path);
      res.writeHead(200, { "Content-type": mime });

      //   var _repl = "<div>I am new!</div>";
      //   res.write(_repl);

      res.end(content);
    }
  });
});

server.listen(8082, "127.0.0.1", () => {
  console.log("Listening on port 80");
});
