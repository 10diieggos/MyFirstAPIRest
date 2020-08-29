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

app.get('/game/:id', (req, res) => {
 
  let { id } = req.params;
  id = parseInt(id);
  
  if (isNaN(id)) {
    res.statusCode = 400;
    res.send('id should be a number!')
  } else {
    res.statusCode = 200;
    let game = DB.games.find(g => g.id === id);
    
    if (game === undefined) {
      res.sendStatus(404);
    } else {
      res.json(game);
    }

  };  

});

app.post('/game', (req, res) => {
  let { id, title, year, price } = req.body;
  let game = { id, title, year, price };
  DB.games.push(game);
  res.sendStatus(200);
});

//run server
app.listen(80);
