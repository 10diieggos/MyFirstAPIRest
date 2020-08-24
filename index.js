//initialize express
const express = require('express');
const app = express();
//initialize/configure body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//simulating database
let DB = {
  games: [
    {
      id: 23,
      title: 'Call of duty MW',
      year: 2019,
      price: 60
    },
    {
      id: 65,
      title: 'Sea of thieves',
      year: 2018,
      price: 40
    },
    {
      id: 2,
      title: 'Minecraft',
      year: 2012,
      price: 20
    }
  ]
};

//endpoints
app.get('/games', (req, res) => {
  res.statusCode = 200;
  res.json(DB.games);
});

app.listen(8080);

