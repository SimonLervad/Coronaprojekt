var express = require('express');
var router = express.Router();
const handler = require("../models/handler");
const headTitle = "Todo list application";  //save keystrokes

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
