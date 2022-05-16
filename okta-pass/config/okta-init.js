var session = require('express-session');
var passport = require('passport');
var { Strategy } = require('passport-openidconnect');

const initialize = (app) => {

    app.use(session({
        secret: 'MyVoiceIsMyPassportVerifyMe',
        resave: false,
        saveUninitialized: true
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // set up passport
    passport.use('oidc', new Strategy({
        issuer: `${process.env.OKTA_OAUTH2_ISSUER}`,
        authorizationURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/authorize`,
        tokenURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/token`,
        userInfoURL: `https://${process.env.OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
        clientID: `${process.env.OKTA_OAUTH2_CLIENT_ID}`,
        clientSecret: `${process.env.OKTA_OAUTH2_CLIENT_SECRET}`,
        callbackURL: 'http://localhost:3000/authorization-code/callback',
        scope: 'openid profile'
    }, (issuer, profile, done) => {
        return done(null, profile);
    }));

    passport.serializeUser((user, next) => {
        next(null, user);
    });

    passport.deserializeUser((obj, next) => {
        next(null, obj);
    });

    app.use('/login', passport.authenticate('oidc'));

    app.use('/authorization-code/callback',
        passport.authenticate('oidc', { failureRedirect: '/error' }),
        (req, res) => {
            res.redirect('/profile');
        }
    );

    function ensureLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login')
    }

    app.use('/profile', ensureLoggedIn, (req, res) => {
        res.render('profile', { title: 'Express', user: req.user });
    });

    app.get('/logout', (req, res) => {
        req.logout();
        req.session.destroy();
        res.redirect('/');
    });

    app.get('/error', (req, res) => {
        res.status(500).json("we got issues!");
    });
}

module.exports = initialize;