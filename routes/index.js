var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/showData', function (req, res, next) {
  let formData = req.query;
  console.log(formData);
  let nodes = {};
  let keys = Object.keys(formData);
  // 把同一個元件的屬性包一起
  for (let i = 1; i < parseInt(formData['q-of-element']) + 1; i++) {
    nodes[String(i)] = { name: `元件 ${String(i)}` };
    keys.forEach(element => {
      if (element.endsWith(`-of-${i}`)) {
        let obj = {};
        if(element == `c-of-${i}`) {
          obj[element] = formData[element].split(' ');
        } else {
          obj[element] = parseInt(formData[element]);
        }
        Object.assign(nodes[String(i)], obj);
        delete formData[element];
      }
    });
  }

  console.log(nodes);
  console.log(formData);
  res.render('showData', { title: 'Express', nodes: nodes, data: formData });
});

module.exports = router;
