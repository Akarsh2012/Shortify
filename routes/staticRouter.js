const express = require("express");
const router = express.Router();
const URL = require("../models/url");
const { restrictTo } = require("../middlewares/auth");


router.get('/admin/urls',restrictTo(["ADMIN"]),async  (req, res) => {

    const allUrls = await URL.find({});

  return res.render("home", { urls: allUrls });
});

router.get("/signup", async (req, res) => {
  return res.render("signup");
});

router.get("/",restrictTo(["NORMAL","ADMIN"]), async (req, res) => {
  
  const allUrls = await URL.find({createdBy:req.user._id});
  

  return res.render("home", { urls: allUrls});
});

router.get("/login", async (req, res) => {
  return res.render("login");
});
router.get("/logout", async (req, res) => {
  res.clearCookie('token');
  return res.render("index");
});
router.get("/shortify", async (req, res) => {
  return res.render("index");
});
router.get("/about", async (req, res) => {
  return res.render("about");
});

module.exports = router;
