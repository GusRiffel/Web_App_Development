const express = require("express");
const app = express();
const port = 3000;
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const SessionConnection = require("./sessionConnection");
const setupPassport = require("./setupPassport");
const poiRouter = require("./router/pointsOfInterest");
const reviewRouter = require("./router/review");
const userRouter = require("./router/user");

const sessionStore = new MySQLStore({}, SessionConnection.promise());

app.use(
  session({
    store: sessionStore,
    secret: "BinnieAndClyde",
    resave: false,
    saveUninitialized: false,
    rolling: true,
    unset: "destroy",
    proxy: true,
    cookie: {
      maxAge: 600000, // 600000 ms = 10 mins expiry time
      httpOnly: false, // allow client-side code to access the cookie, otherwise it's kept to the HTTP messages
    },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("src/public"));

setupPassport(app);

app.use("/poi", poiRouter);
app.use("/review", reviewRouter);
app.use("/user", userRouter);

app.listen(port, () => {
  console.log(`Point of Interest started on port ${port}`);
});

module.exports.getApp = app;
