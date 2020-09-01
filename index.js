//Caution! Change this for your project!
let JWTsecret = ',+fH%t<^YTKdd>Js8cKenJO[]0(ql^UZ'
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
//import models
const Game = require('./Game');
const User = require('./User');
//configure cors
const cors = require('cors');
app.use(cors());
//authentication library (JWT)
const jwt = require('jsonwebtoken');
//A library to help you hash passwords.
const bcrypt = require('bcrypt');
const saltRounds = 10;

//authentication middleware
function authentication(req, res, next) {
  let token = req.headers.authorization;
  if (!token) {
    res.sendStatus(401);
  } else {
    token = token.split(' ');
    token = token[1]
    jwt.verify(token, JWTsecret, function(err, decoded) {
      if (err) {
        res.sendStatus(401)
      } else {
        req.decoded = decoded
        next()
      }
    });
  }
};

//HATEOAS
let HATEOAS = (id) => {
  return [
    {
      href: 'http://localhost/user',
      method: 'POST',
      rel: 'post_user'
    },
    {
      href: 'http://localhost/authentication',
      method: 'POST',
      rel: 'post_authentication'
    },
    {
      href: 'http://localhost/games',
      method: 'GET',
      rel: 'get_games'
    },
    {
      href: `http://localhost/game/${id}`,
      method: 'GET',
      rel: `get_game_${id}`
    },
    {
      href: `http://localhost/game/${id}`,
      method: 'POST',
      rel: `post_game_${id}`
    },
    {
      href: `http://localhost/game/${id}`,
      method: 'DELETE',
      rel: `delete_game_${id}`
    },
    {
      href: `http://localhost/game/${id}`,
      method: 'PUT',
      rel: `put_game_${id}`
    },
    ]
};

//endpoints
app.post('/user', (req, res) => {
  (async () => { 
    let { email, password } = req.body;
    let user = await User.findOne({ where: { email } });
    console.log(user);
    if (user) {
      res.send('user already registered');
      res.statusCode = 412;
    } else {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(password, salt, function (err, hash) {
          User.create({ email, password: hash });
          res.json({ token: 'invalid', message:'Registered succes!' });
          res.statusCode = 200;
        });
      });
    }
  })();
});

app.post('/authentication', (req,res) => {
  (async () => { 
    let { email, password } = req.body;
    let hash = await User.findOne({ where: { email } });
    if (hash) {
      hash = (hash.dataValues.password);
      bcrypt.compare(password, hash, function(err, result) {
        if (result) {
          jwt.sign({ email, password }, JWTsecret, { expiresIn: '1d' }, (err, token) => {
            res.json({ token, message:'logon success!' });
          });
        } else {
          res.json({ token: 'invalid', message:'password incorrect!' });
          res.statusCode = 401;
        }
      });      
    } else {
      res.json({token:'invalid', message: 'User not found!'})
      res.statusCode = 404
    }
  })();  
});

app.get('/games', authentication, (req, res) => {
  (async () => {
    const games = await Game.findAll()
    res.json({games, _links: HATEOAS(':id') });
  })();
  res.statusCode = 200;
});

app.get('/game/:id', authentication, (req, res) => {
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
        res.json({ game, _links: HATEOAS(id) });
        res.statusCode = 200;
      }
    })();
  };  
});

app.post('/game', authentication, (req, res) => {
  let { title, year, price } = req.body;
  
  Game.create({ title, year, price });
  res.sendStatus(200);
  
});

app.delete('/game/:id', authentication, (req, res) => {
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

app.put('/game/:id', authentication, (req, res) => {
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
