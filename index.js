//initialize express
const express = require('express');
const app = express();
//initialize/configure body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//database connection
const connection = require('./database');
connection.authenticate()
//import model Game
const Game = require('./Game');
//configure cors
const cors = require('cors');
app.use(cors());
//endpoints
app.get('/games', (req, res) => {
  (async () => {
    const games = await Game.findAll()
    res.json(games);
  })();
  res.statusCode = 200;
});

app.get('/game/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (isNaN(id)) {
    res.statusCode = 400;
    res.send('id should be a number!')
  } else {
    (async () => {
      const game = await Game.findByPk(id)
      if (game === undefined) {
        res.sendStatus(404);
      } else {
        res.json(game);
        res.statusCode = 200;
      }
    })();
  };  
});

app.post('/game', (req, res) => {
  let { title, year, price } = req.body;
  
  Game.create({ title, year, price });
  res.sendStatus(200);
  
});

app.delete('/game/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (isNaN(id)) {
    res.statusCode = 400;
    res.send('id should be a number!')
  } else {
    (async () => {
      let game = await Game.findByPk(id);
      if (game === undefined) {
        res.sendStatus(404);
      } else {
        await Game.destroy({where: {id}});
        res.sendStatus(200);
      }
    })();
};
  
});

app.put('/game/:id', (req, res) => {
  let { id } = req.params;
  id = parseInt(id);
  if (isNaN(id)) {
    res.statusCode = 400;
    res.send('id should be a number!')
  } else {
    (async () => { 
      const game = await Game.findByPk(id);
      if (game === undefined) {
        res.sendStatus(404);
      } else {
        let { title, year, price } = req.body;
        if (title != undefined) { Game.update({ title }, { where: { id } }) };
        if (year != undefined) { Game.update({ year }, { where: { id } }) };
        if (price != undefined) { Game.update({ price }, { where: { id } }) };
        res.sendStatus(200);
      }
    })();
  };  
});
//run server
app.listen(80);
