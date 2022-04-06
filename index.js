const express = require('express');
const morgan = require('morgan');
const app = express();

//Using Morgan to log requests
app.use(morgan('common'));


let topMovies = [
    {title: 'The Batman', Genre: 'Action/Crime', Year: 2022},
    {title: 'Death On The Nile', Genre: 'Crime-Mystery', Year: 2022},
    {title: 'The Lost City', Genre: 'Comedy', Year: 2022},
    {title: 'Get Out', Genre: 'Horror/Thriller', Year: 2017},
    {title: 'The Avengers: End Game', Genre: 'Action/Sci-Fi', Year: 2019},
    {title: 'Avatar', Genre: 'Action/Sci-Fi', Year: 2009},
    {title: 'Encanto', Genre: 'Animation/Musical', Year: 2021},
    {title: 'Coda', Genre: 'Drama', Year: 2022},
    {title: 'The Worst Person In The World', Genre: 'Drama', Year: 2022},
    {title: 'Flee', Genre: 'Animated/Documentary', Year: 2021}
];


// GET Requests
app.get('/movies', (req, res) => {res.json(topMovies)});

app.get('/', (req, res) => {res.send('🎥It\'s movie time!')});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', {root: __dirname });
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