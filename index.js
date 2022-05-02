const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const cors = require('cors');
let allowedOrigins = ['http://localhost:8080','http:testsite.com'];
app.use(cors({ //restricts domain origin access
    origin: (origin, callback) => {
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){ //finds origin & compares
            let message = 'The CORS policy for this application does not allow access from origin ' + origin;
            return callback(new Error(message ), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);
const passport = require('passport');
const { Router } = require('express');
require('./passport');

const { check, validationResult } = require('express-validator');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const req = require('express/lib/request');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;

/*mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true, useUnifiedTopology: true 
});*/
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true, useUnifiedTopology: true 
});

//Using Morgan, BodyParser, UUID to log requests
app.use(morgan('common'));

// Requests for Documentation & Index
app.get('/', (req, res) => {res.send('🎥It\'s movie time!')});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
});

/* HTTP Requests */

//CREATE POST new User - expecting JSON
app.post('/users', (req, res) => { 
    //checks validation 
    [check('Username', 'Username is required').isLength({min: 5}),

    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),

    check('Password', 'Password is requried').not().isEmpty(),

    check('Email', 'Email is invalid').isEmail()
    ], (req, res) => {
        //check validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    };

    //hash any password when registering
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ 
        Username: req.body.Username 
    }).then((user) => { 
        if (user) { 
            return res.status(400).send(req.body.Username + 'already exists'); 
        } else { 
            Users.create({ 
                Username: req.body.Username, 
                Password: hashedPassword, 
                Email: req.body.Email, 
                Birthday: req.body.Birthday 
            }).then((user) => { 
                res.status(201).json(user) 
            }).catch((error) => { 
                console.error(error); res.status(500).send('Error: ' + error); 
            }) 
        } 
    }).catch((error) => { 
        console.error(error); 
        res.status(500).send('Error: ' + error); 
        }); 
});
 

//READ - returns ALL movies
// app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
//     Movies.find()
//     .then((movies) => {
//         res.status(201).json(movies);
//     })
//     .catch((err) => {
//         console.error(err);
//         res.status(500).send('Error: ' + err);
//     });
// });
app.get("/movies", function (req, res) {
  Movies.find()
    .then(function (movies) {
      res.status(201).json(movies);
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send("Error: " + error);
    });
});


//READ - GET movie by Title
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.findOne({ Title: req.params.Title})
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ - GET movies by genre
app.get('/movies/:Genre', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find({ Genre: req.params.Genre.Name })
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ - Get Director by name
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.findOne({ Name: req.params.Name })
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
//READ - GET ALL directors
app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
    Directors.find()
    .then((director) => {
        res.json(director);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ - GET all users with Mongoose
app.get('/users', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//READ -GET user by username 
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
    .then((user) => {
        res.json(user);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//UPDATE - user by username - expecting JSON
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
//checks validation
        [check('Username', 'Username is required').isLength({min: 5}),

    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),

    check('Password', 'Password is requried').not().isEmpty(),

    check('Email', 'Email is invalid').isEmail(),

    check('Birthday', 'Date is invalid').isDate()
    ], (req, res) => {
        //check validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    };
    let hashedPassword = Users.hashPassword(req.body.Password);
    
    Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
            {
                Username: req.body.Username,
                Password: hashedPassword,
                Email: req.body.Email,
                Birthday: req.body.Birthday
            }
    }, 
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

// UPDATE or CREATE -  add movie title to user's favorite movies using Mongoose - 
//Expects Username and MovieID
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: {FavoriteMovies: req.params.MovieID}
    }, 
    { new: true }, 
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});


//DELETE - remove existing user by username using Mongoose
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
        if (!user) {
            res.status(400).send(req.params.Username + ' was not found');
        } else {
            res.status(200).send(req.params.Username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});


// Express.static
app.use(express.static('public'));

//error Handling 
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Oh no, 😵 something broke!')
}); 
 

//Creates the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Your app is listening on Port ' + port);
});