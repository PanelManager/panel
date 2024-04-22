const LocalStrategy = require("passport-local").Strategy
const User = require("../models/UserModel")
const bcrypt = require("bcrypt")

function initialize(passport) {
    const authUser = async (username, password, done) => {
        const user = await User.findOne({where: { username: username}})
        if (!user) {
            return done(null, false, {message: "Invalid username or password"})
        } else {
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, {message: "Invalid username or password"})
                }
            } catch (err) {
                return done(err)
            }
        }
    }    
    passport.use(new LocalStrategy({}, authUser))
    passport.serializeUser(function(user, done) {
        done(null, user);
      });
      
      passport.deserializeUser(function(user, done) {
        done(null, user);
      });
}

module.exports = initialize