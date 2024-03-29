const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
        Name: String,
        Bio: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Director',
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
    //FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}] - use for referenced movie._id in MongoDB collection
    FavoriteMovies: [{
        Title: String, ref: 'Movie',
        ImagePath: String, ref: 'Movie',
        type: mongoose.Schema.Types.ObjectId, ref: 'Movie',
    }]
});

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
};

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Director = mongoose.model('Director', directorSchema);


module.exports.Movie = Movie;
module.exports.User = User; 
module.exports.Director = Director;