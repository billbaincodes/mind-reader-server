// From Dan's Guides: https://github.com/justsml/guides/tree/master/express/setup-guide
// TODO: INSTALL PRE-REQS:
//  npm install express cors body-parser morgan nodemon
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = (module.exports = express());
const port = parseInt(process.env.PORT || 3000);
const request = require("request");

require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV !== "production" ? "dev" : "combined"));
app.use(cors({ origin: true, credentials: true })); // <= Disable if you don't need CORS
// TODO: Optional Static file handler:
// app.use('/', express.static('./build'))

// TODO: ADD (MOUNT) YOUR MIDDLEWARE (ROUTES) HERE:
// Example: app.use('/api/cat', require('./routes/cat'))

app.get("/", (req, res, next) => {
  res.json(
    "Template from Dan's Guides: https://github.com/justsml/guides/tree/master/express/setup-guide"
  );
});

app.get("/test", (req, res, next) => {

  var options = { method: 'GET',
  url: 'https://gateway.watsonplatform.net/tone-analyzer/api/v3/tone',
  qs: 
    { version: '2017-09-21',
      text: "team for once in your life stop messing around. I am so angry right now. you have failed!!!" },
  headers: 
    { 'Postman-Token': '8078eb86-513f-4f7b-b9d7-ddcd2b62df02',
      'cache-control': 'no-cache',
      Authorization: 'Basic ' + process.env.IBM_SECRET,
      'Content-Type': 'application/json' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  res.json(JSON.parse(body))

  console.log(body);
});


});

// The following 2 `app.use`'s MUST follow ALL your routes/middleware
app.use(notFound);
app.use(errorHandler);

function notFound(req, res, next) {
  res
    .status(404)
    .send({ error: "Not found!", status: 404, url: req.originalUrl });
}

// eslint-disable-next-line
function errorHandler(err, req, res, next) {
  console.error("ERROR", err);
  const stack = process.env.NODE_ENV !== "production" ? err.stack : undefined;
  res.status(500).send({ error: err.message, stack, url: req.originalUrl });
}

app
  .listen(port)
  .on("error", console.error.bind(console))
  .on(
    "listening",
    console.log.bind(console, "Listening on http://0.0.0.0:" + port)
  );
