const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid');

//Using Morgan, BodyParser, UUID to log requests
app.use(bodyParser.json());
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
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BOGE2NWUwMDItMjA4Yi00N2Y3LWJjMzEtMDJjZTMzZTdlZGE5XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg'
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
        imageUrl: 'https://m.media-amazon.com/images/M/MV5BNWY1NjUyNTktMjM2Ni00YWNlLWE3NzktOTJkMmRjMDUwY2JmXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_.jpg'
    }
];

// Requests for Documentation & Index
app.get('/', (req, res) => {res.send('🎥It\'s movie time!')});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
});

// HTTP Requests 

//CREATE new User
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('User needs a name.')
    };
});


//READ - returns list of ALL movies 
app.get('/movies', (req, res) => {
    res.status(200).json(topMovies)
});

//READ - returns movie by title 
app.get('/movies/:title', (req, res) => {

    res.status(200).json(topMovies.find((movie) => {
        return movie.title === req.params.title
    }));
});

//READ - returns descriptions of genres by name 
app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = topMovies.find((movie) => movie.Genre.Name === genreName).Genre;

     if (genre) {
         res.status(200).json(genre);
    } else {
        res.status(400).send('no such genre');
    };
});

//READ - returns descriptions of Directors by name
app.get('/movies/director/:directorName', (req, res) => {
    const {directorName} = req.params;
    const director = topMovies.find((movie) => movie.Director.Name === directorName).Director;

     if (director) {
         res.status(200).json(director);
    } else {
        res.status(400).send('no such genre');
    };
});

// UPDATE - update user by id

app.put('/users/:id', (req, res) => {
    const updatedUser = req.body;
    const { id } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user.');
    }
});

// UPDATE or CREATE -  add movie title to user 
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s array.`);
    } else {
        res.status(400).send('no such user.');
    }
});

//DELETE - remove movies from array
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s array.`);
    } else {
        res.status(400).send('no such user.');
    }
});

//DELETE - Allow existing users to delete user from array
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find((user) => user.id == id);

    if (user) {
        users = users.filter( user => user.id !== id);
        res.status(200).send(` User ${id} has been deleted.`);
    } else {
        res.status(400).send('no such user.');
    }
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