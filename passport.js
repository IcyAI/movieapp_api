
const passport = require('passport'),
 LocalStrategy = require('passport-local').Strategy,

 Models = require('./models.js'),
 passportJWT = require('passport-jwt');

 let users = Models.user,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

    //checks username when logging in
passport.use(
    new LocalStrategy(
        {
            usernameField: 'Username',
            passwordField: 'Password',
        },
    async  (username, password, callback) => {
        console.log(`${username} ${password}`);
        await users.findOne({username: username})
        .then((user) => {
            if(!user) {
                console.log('incorrect username');
                return callback(null, false, {
                    message: 'Incorrect username or password.',
                });
            }
            console.log('finished');
            return callback(null, user);
        })
        .catch((error) => {
            if (error) {
                console.log(error);
                return callback(error);
            }
        })
    }
    )
);

//checks JWT on each server request
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'your_jwt_secret'},
    async (jwtPayload, callback) => {
        return await users.findById(jwtPayload._id)
        .then((user) => {
            return callback(null, user);
        })
        .catch((error) => {
            return callback (error)
        });
    }));