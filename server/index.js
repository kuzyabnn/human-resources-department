const express = require("express");
const port = 3001

const app = express()
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

//middlewares
app.use(express.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie:{
      expires: 60*60*24*1000,
    },
  })
)

//routes
app.use(require('./routes/index'))
  

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})