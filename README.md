# MyFlix API
Part of the documentation for myFlix API, the server-side project built with Mongo, Express, and Node.

## Description 
This web app allows users to register/login, search movies titles, update profile information, and save their favorite movies. 

## Essential Features 
```
Return a list of all movies to the user
Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
Return data about a genre (description) by name/title (e.g., Sci-Fi)
Return data about a director (Bio) by name
Allow new users to register
Allow users to update their user info (username, password, email, date of birth)
Allow users to add a movie to their list of favorites
Allow users to remove a movie from their list of favorites
Allow existing users to deregister
```

## Technical 
- Node and Express 
- RESTful architecture 
- CRUD Requests
- Middleware such as Morgan and body-parser
- MongoDB and Mongoose
- API provides information in JSON format
- Tested with Postman
- Error-free JavaScript
- Data validation
- Complies with CORS security requirements 
- Hosted on Heroku

### Endpoints

```
/login
/users
/users/:Username
/movies
/movies/:Title
/movies/:Genre
/directors
/directors/:Name
/users/:Username/movies/:MovieID
```

#### Dependendcies 
```
"bcrypt": "^5.0.1",
"body-parser": "^1.20.0",
"cors": "^2.8.5",
"express": "^4.17.3",
"express-validator": "^6.14.0",
"jsonwebtoken": "^8.5.1",
"lodash": "^4.17.21",
"mongoose": "^6.3.0",
"morgan": "^1.10.0",
"passport": "^0.5.2",
"passport-jwt": "^4.0.0",
"passport-local": "^1.0.0",
"uuid": "^8.3.2"
```

#### devDependencies
```
"eslint": "^8.12.0",
"nodemon": "^2.0.15"
```

#### Deployment
Clone this repo and run ```npm start``` 