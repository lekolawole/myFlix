const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
const uuid = require('uuid');
const mongoose = require('mongoose');
const Models = require('./models.js');
const req = require('express/lib/request');

const Movies = Models.Movie;
const Users = Models.User;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', {
    useNewUrlParser: true, useUnifiedTopology: true 
}); 

//Using Morgan, BodyParser, UUID to log requests

app.use(morgan('common'));

let users = [
    {
        id: 1,
        name: 'John',
        favoriteMovies: ['The Batman']
    },
    {
        id: 2, 
        name: 'Kate',
        favoriteMovies: ['Get Out']
    },
    {
        id: 3,
        name: 'Kelly',
        favoriteMovies: []
    }
]

let topMovies = [
    {
        title: 'The Batman', 
        Director: {
            Name: 'Matt Reeves', 
            Bio: 'Matthew George "Matt" Reeves was born April 27, 1966 in Rockville Center, New York, USA and is a writer, director and producer.'
        },
        Genre: {
            Name: 'Action', 
            Description: 'Protagonists are thrown into situations that involve violence and physical feats.'
        }, 
        Year: 2022, 
        Description: 'When the Riddler, a sadistic serial killer, begins murdering key political figures in Gotham, Batman is forced to investigate the city\'s hidden corruption and question his family\'s involvement.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BOGE2NWUwMDItMjA4Yi00N2YLWJjMzEtMDJjZTMzZTdlZGE5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg'
    },
    {
        title: 'Death On The Nile', 
        Director: {
            Name: 'Kenneth Branagh', 
            Bio: 'Kenneth Charles Branagh was born on December 10, 1960, in Belfast, Northern Ireland. He is an oscar-winning actor, director, and writer.'
        },
        Genre: {
            Name: 'Crime', 
            Description: 'Fantasizes crimes, investigations, and criminal motives.'
        },
        Year: 2022, 
        Description: 'While on vacation on the Nile, Hercule Poirot must investigate the murder of a young heiress.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNjI4ZTQ1OTYtNTI0Yi00M2EyLThiNjMtMzk1MmZlOWMyMDQwXkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg'
    },
    {
        title: 'The Lost City', 
        Director: {
            Name: 'Aaron Knee',
            Bio: 'Brothers, Aaron and Adam Knee are best known for their action oriented blockbusters.',
            Director2: 'Adam Knee'
        },
        Genre: {
            Name: 'Comedy',
            Description: 'Protagonists find humor in ironic, dramatic, or uncanny situations.'
        },
        Year: 2022, 
        Description: 'A reclusive romance novelist on a book tour with her cover model gets swept up in a kidnapping attempt that lands them both in a cutthroat jungle adventure.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMmIwYzFhODAtY2I1YS00ZDdmLTkyYWQtZjI5NDIwMDc2MjEyXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg'
    },
    {
        title: 'Get Out', 
        Director: {
            Name: 'Jordan Peele',
            Bio: 'Jordan Peele is a comedian turned writer-director. He is known for co-writing and starring in Keanu (2016), opposite Keegan-Michael Key, and for directing Get Out (2017), one of the highest-grossing horror films of all time.'
        },
        Genre: {
            Name: 'Horror',
            Description: 'Movies of this genre focus on creating the feeling of fear through folklore, myth, supernatural actvities, or legend.'
        }, 
        Year: 2017, 
        Description: 'A young African-American visits his white girlfriend\'s parents for the weekend, where his simmering uneasiness about their reception of him eventually reaches a boiling point.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMjUxMDQwNjcyNl5BMl5BanBnXkFtZTgwNzcwMzc0MTI@._V1_.jpg'
    },
    {
        title: 'The Avengers: End Game', 
        Director: {
            Name: 'Anthony Russo',
            Bio: 'Anthony J. Russo is an American filmmaker and producer who works alongside his brother Joseph Russo.',
            Director2: 'Joe Russo'
        }, 
        Genre: {
            Name: 'Sci-Fi', 
            Description: 'Protagonists are imagined in futuristic conceptualizations of science and technology, parallel universes, and extra-terrestrial forms of life.'
        },
        Year: 2019, 
        Description: 'After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos\' actions and restore balance to the universe.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg'
    },
    {
        title: 'Avatar', 
        Director: {
            Name: 'James Cameron'
        },
        Genre: {
            Name: 'Sci-Fi', 
             Description: 'Protagonists are imagined in futuristic conceptualizations of science and technology, parallel universes, and extra-terrestrial forms of life.'
        },
        Year: 2009, 
        Description: 'A paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_FMjpg_UX1000_.jpg'
    },
    {
        title: 'Encanto', 
        Director: {
            Name: 'Byron Howard',
            Bio: 'Byron Howard was born on December 26, 1968 in Misawa, Japan.',
            Director2: 'Charise Castro' 
        },
        Genre: {
            Name:'Musical',
            Description: 'Follows a story emphasized emotionally through song and dance.' 
        },
        Year: 2021, 
        Description: 'A Colombian teenage girl has to face the frustration of being the only member of her family without magical powers.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNjE5NzA4ZDctOTJkZi00NzM0LTkwOTYtMDI4MmNkMzIxODhkXkEyXkFqcGdeQXVyNjY1MTg4Mzc@._V1_.jpg'
    },
    {
        title: 'CODA', 
        Director: {
            Name: 'Sian Heder', 
            Bio: 'Sian Heder was born on June 23, 1977 in Cambridge, Massachusetts, USA. She is a writer and producer'
        },
        Genre: {
            Name: 'Drama',
            Description: 'Dramas follow their protagonists through emotional and interpersonal developent.'
        }, 
        Year: 2022, 
        Description: 'As a CODA (Child of Deaf Adults) Ruby is the only hearing person in her deaf family. When the family\'s fishing business is threatened, Ruby finds herself torn between pursuing her passion at Berklee College of Music and her fear of abandoning her parents.',
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BYzkyNzNiMDItMGU1Yy00NmEyLWE4N2ItMjkzMDZmMmVhNDU4XkEyXkFqcGdeQXVyMTkxNjUyNQ@@._V1_.jpg'
    },
    {
        title: 'The Worst Person In The World',
        Director: {
            Name: 'Joachim Trier',
            Bio: 'Joachim Trier is a Norwegian writer and director. He is known for Reprise (2006), Oslo, August 31st (2011), Louder Than Bombs (2015) and Thelma (2017). Trier also directed three short films, Pietà (2000), Still (2001) and Procter (2002).'
        },
        Genre: {
            Name: 'Dark Humor',
            Description: 'Often referred to as \'Dramedies\', this genre presents characters who experience intense change and emotional trauma, but often experience a happy ending.'
        },
        Year: 2022, 
        Description: 'The chronicles of four years in the life of Julie, a young woman who navigates the troubled waters of her love life and struggles to find her career path, leading her to take a realistic look at who she really is.',
        imageUrl: 'https://www.femalefirst.co.uk/image-library/port/1000/t/twpitw-poster.jpg'
    },
    {
        title: 'Flee', 
        Director: {
            Name: 'Jonas Poher Rasumussen',
            Bio: 'Jonas Poher Rasmussen was born on May 19, 1981 in Kalundborg, Denmark. He is a director and writer, known for Flee (2021), Searching for Bill (2012) and What He Did (2015).'
        },
        Genre: {
            Name: 'Documentary',
            Description: 'Documentaries are investigative or informational presentations of the world outside of film.'
        },
        Year: 2021, 
        Description: 'FLEE tells the extraordinary true story of a man, Amin, on the verge of marriage which compels him to reveal his hidden past for the first time.',
        imageUrl: 'K'
    }
];

// Requests for Documentation & Index
app.get('/', (req, res) => {res.send('🎥It\'s movie time!')});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
});

// HTTP Requests 

//CREATE new User - expecting JSON



//READ - returns ALL movies
app.get('/movies', (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(201).json(movies);
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
//READ - GET movie by Title
app.get('/movies/:Title', (req, res) => {
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
app.get('/movies/:Genre', (req, res) => {
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
app.get('/directors/:Name', (req, res) => {
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
app.get('/directors', (req, res) => {
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
app.get('/users', (req, res) => {
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
app.get('/users/:Username', (req, res) => {
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
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {$set:
            {
                Username: req.body.Username,
                Password: req.body.Password,
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
app.post('/users/:Username/movies/:MovieID', (req, res) => {
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
app.delete('/users/:Username', (req, res) => {
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
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});