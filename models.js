const mongoose = require('mongoose');

let directorSchema = mongoose.Schema({
    Name: String,
    Bio: String,
    Birth: String,
    Films: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Movie'
    }]
});

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String, 
        Description: String 
    },
    Director: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Director'
    },
    ReleaseYear: String,
    Rating: String,
    Actors: [String],
    Featured: Boolean,
    ImagePath: String
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);


module.exports.Movie = Movie;
module.exports.User = User; 
module.exports.Director = Director;