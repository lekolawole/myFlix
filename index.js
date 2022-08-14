const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());
/** 
 * Uncomment to restrict access to certain Origins *
 * Cross-origin by default 
 * 
let allowedOrigins = ['http://localhost:8080', 'http://localhost:4200', 'http:testsite.com', 'http://localhost:1234', 'https://myflixgo.netlify.app', 'https://my-flix-go.vercel.app'];
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
*/

/** Setting up authentication */
let auth = require('./auth')(app);
const passport = require('passport');
const { Router } = require('express');
require('./passport');


/** Setting up validation */
const { check, validationResult } = require('express-validator');
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const req = require('express/lib/request');


/** Setting up Models */
const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;
mongoose.connect(process.env.CONNECTION_URI, {
    useNewUrlParser: true, useUnifiedTopology: true 
});

// Using Morgan, BodyParser, UUID to log requests
app.use(morgan('common'));

// Routing for Documentation & Index
app.get('/', (req, res) => {res.send('🎥It\'s movie time!')});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
});

/* HTTP Requests */
/**
 * CREATE POST new User
 * Routes to "/users" endpoint
 * 
 * @param {express.req} 
 * Expects {Username, Password, Email, Birthday}
 * @param {express.res}
 * 
 */
app.post('/users', (req, res) => { 
    // checks validation 
    [check('Username', 'Username is required').isLength({min: 5}),

    check('Username', 'Username contains non alphanumeric characters - not allowed').isAlphanumeric(),

    check('Password', 'Password is requried').not().isEmpty(),

    check('Email', 'Email is invalid').isEmail()
    ], (req, res) => {
        // check validation object for errors
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() });
        }
    };

    // hash any password when registering
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
 
/**
 * READ - returns ALL movies
 * Routes to "/movies" endpoint
 * 
 * @param {express.req} 
 * Expects {jwt} - created when a registered user successfully logs in
 * @param {express.res}
 * 
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * READ - GET movie by Title
 * Routes to "/movies/:Title" endpoint
 * 
 * @param {express.req}
 * Expects {movie.Title, jwt}
 * @param {express.res}
 * 
 */
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

/**
 * READ - GET movies by genre
 * Routes to "movies/:Genre" endpoint
 * 
 * @param {express.req}
 * Expects {movie.Genre, jwt}
 * @param {express.res}
 * 
 */
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

/**
 * READ - Get Director by name
 * Routes to "/directors/:Name" endpoint
 * 
 * @parm {express.req}
 * Expects {movieDirector.Name, jwt}
 * @param {express.res}
 * 
 */
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

/**
 * READ - GET ALL directors
 * Routes to "/directors" endpoint
 * 
 * @param {express.req}
 * Expects {jwt}
 * @param {express.res}
 * 
 */
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

/**
 * READ - GET all users
 * Used to validate existing user login and new user registration 
 * Throws an error if user does not exist 
 * Routes to "/users" endpoint 
 * 
 * @param {express.req} 
 * Expects {Username}
 * @param {express.res}
 * 
 */
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

/**
 * READ - GET user by username
 * Routes to "/users/:Username" endpoint
 * 
 * @param {express.req}
 * Expects {Username}
 * @param {express.res}
 * 
 */ 
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

/** 
 * UPDATE - user by username
 * Routes to "/users/:Username" endpoint
 * 
 * @param {express.req}
 * Expects { Username, Password, Email, Birthday }
 * Checks for validation & hashes password
 * @param {express.res}
 * 
*/
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

/**
 * UPDATE/POST - add movie title to user's favorite movies
 * Routes to "/users/:Username/movies/:MovieID" endpoint 
 * 
 * @param {express.req}
 * Expects Username and MovieID
 * @param {express.res}
 * 
 */
app.post('/users/:Username/movies/:MovieID', 
    // passport.authenticate('jwt', { session: false }), 
    (req, res) => {
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

/**
 * DELETE - remove existing user by username
 * Routes to "users/:Username" endpoint
 * 
 * @param {express.req}
 * Expects Username and jwt
 * @param {express.res}
 * 
 */
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

/**
 * DELETE - removes a movie title from a user's FavoriteMovies array
 * Routes to "users/:Username/:movies/:MovieID" endpoint
 * 
 * @param {express.req}
 * Expects {Username, movie._id, jwt}
 * @param {express.res}
 * 
 */
app.delete('/users/:Username/movies/:MovieID', 
    // passport.authenticate('jwt', { session: false }), 
    (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: {FavoriteMovies: req.params.MovieID}
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


// Express.static
app.use(express.static('public'));

// error Handling 
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Oh no, 😵 something broke!')
}); 
 

// Creates the server
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Your app is listening on Port ' + port);
});