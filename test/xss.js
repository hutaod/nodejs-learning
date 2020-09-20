/**
 * 演示xss
 */
const path = require("path")
var express = require('express');
const ejs = require('ejs')
var router = express.Router();

const app = express()

app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.query.xss)
  const xss = decodeURIComponent(encodeURIComponent(req.query.xss))
  res.render('xss', { title: 'Express', xss:xss });
});

app.use(router)

app.listen(9090)

// module.exports = router;