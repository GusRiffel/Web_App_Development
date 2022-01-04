const express = require("express");
const userRouter = express.Router();

const connection = require("../mysqlConnection");
const userController = require("../controllers/userController");
const passport = require("passport");

const userControllerInstance = new userController(connection);

userRouter.post(
  "/create",
  userControllerInstance.createUser.bind(userControllerInstance)
);
userRouter.get(
  "/findById",
  userControllerInstance.findUserById.bind(userControllerInstance)
);

userRouter.get("/login", (req, res) => {
  res.json({ user: req.user || null });
});

userRouter.post("/login", (req, res, next) => {
  passport.authenticate("local", function (cb, user, err) {
    if (err) {
      return res.status(401).json(err);
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      return res.status(200).json(`Welcome ${user.username}`);
    });
  })(req, res, next);
});

userRouter.post("/logout", function (req, res) {
  req.logout();
  req.session = null;
  res.json({ success: 1 });
});

module.exports = userRouter;
